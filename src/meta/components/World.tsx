import { AdaptiveDpr, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import {
  CAMERA_START_OFFSET,
  MAP_SCALE,
  PLAYER_START,
} from "@/meta/constants/world";
import { ZONES } from "@/meta/constants/zones";
import { PhysicsProvider } from "@/meta/physics/PhysicsProvider";
import { useWorldStore } from "@/meta/store/useWorldStore";
import { openZone } from "@/meta/utils/openZone";

import CameraRig from "./CameraRig";
import CollisionMap from "./CollisionMap";
import MapModel from "./MapModel";
import Player from "./Player";
import ZoneMarker from "./ZoneMarker";

/** 시작 시 카메라 위치 = 캐릭터 시작 위치 + 뒤쪽 위 오프셋 */
const INITIAL_CAMERA_POSITION: [number, number, number] = [
  PLAYER_START[0] + CAMERA_START_OFFSET[0],
  PLAYER_START[1] + CAMERA_START_OFFSET[1],
  PLAYER_START[2] + CAMERA_START_OFFSET[2],
];

/**
 * 3D 월드 전체. <Canvas> 안이 곧 three.js 씬이다.
 *
 * 여기에 들어가는 것: 하늘 / 조명 / 맵 / 존 마커 / 캐릭터 / 카메라
 * (HTML로 된 UI는 Canvas 밖, 즉 MetaPage에서 올린다)
 */
export default function World() {
  /** 현재 플레이어가 서 있는 존 id (없으면 null) */
  const activeZoneId = useWorldStore((s) => s.activeZoneId);

  return (
    <Canvas
      // 그림자 활성화 (조명의 castShadow / 메쉬의 receiveShadow와 함께 동작)
      shadows
      // 화면 배율: 1~2배 사이에서 기기 성능에 맞춰 사용
      dpr={[1, 2]}
      camera={{
        position: INITIAL_CAMERA_POSITION,
        fov: 55,
        near: 0.1,
        // 맵이 길어서 far를 크게 잡아야 멀리까지 보인다
        far: 1500,
      }}
    >
      {/* 하늘색 배경 + 거리감을 주는 안개 (안개 색은 배경색과 맞춰야 자연스럽다) */}
      <color attach="background" args={["#bcd7f0"]} />
      <fog attach="fog" args={["#bcd7f0", 120, 500]} />

      {/* GLB 로딩이 끝날 때까지 안쪽 내용은 렌더되지 않는다 (진행률은 Loading 컴포넌트가 표시) */}
      <Suspense fallback={null}>
        {/* 절차적으로 생성되는 하늘 — 외부 이미지 다운로드가 없다 */}
        <Sky sunPosition={[100, 60, 200]} turbidity={6} rayleigh={1.4} />

        {/* 전체를 은은하게 밝히는 빛 */}
        <ambientLight intensity={0.7} />
        {/* 하늘색/땅색을 위아래에서 비추는 빛 — 만화풍 모델과 잘 어울린다 */}
        <hemisphereLight args={["#cfe4ff", "#4a4436", 0.8]} />
        {/* 그림자를 만드는 태양광. shadow-camera-* 는 그림자가 그려지는 영역 */}
        <directionalLight
          position={[40, 60, 20]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />

        {/* Rapier(WASM) 초기화 — 준비될 때까지 위 <Suspense>가 기다린다 */}
        <PhysicsProvider>
          {/*
            화면용 맵과 콜리전 맵을 같은 그룹에 넣어 크기 보정을 한 번만 건다.
            따로 scale을 주면 나중에 한쪽만 바뀌었을 때 조용히 어긋나서,
            캐릭터가 허공을 걷거나 보이지 않는 벽에 부딪히게 된다.
          */}
          <group scale={MAP_SCALE}>
            <MapModel />
            <CollisionMap />
          </group>

          {/* 각 존의 바닥 링 + 공중 오브젝트 + 이름표 */}
          {ZONES.map((zone) => (
            <ZoneMarker
              key={zone.id}
              zone={zone}
              active={activeZoneId === zone.id}
              onSelect={openZone}
            />
          ))}

          {/* 캐릭터(이동·점프 처리 포함) */}
          <Player />
        </PhysicsProvider>
      </Suspense>

      {/* 캐릭터를 중심으로 도는 카메라 — 마우스 드래그 / 모바일 터치로 회전 */}
      <CameraRig />

      {/* 프레임이 떨어지면 해상도를 자동으로 낮춰 성능을 확보 */}
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
