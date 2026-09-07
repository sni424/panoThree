import { Billboard, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { Zone } from "@/meta/types";

interface Props {
  /** 표시할 존 정보 */
  zone: Zone;
  /** 플레이어가 이 존 안에 들어와 있는지 */
  active: boolean;
  /** 마커를 클릭했을 때 호출 */
  onSelect: (zone: Zone) => void;
}

/**
 * 맵 위의 존 표시물.
 * 바닥 링 + 공중에 떠 있는 다면체 + 이름표로 구성된다.
 */
export default function ZoneMarker({ zone, active, onSelect }: Props) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ring.current) return;
    // 플레이어가 들어와 있으면 링이 커졌다 작아졌다 하며 눈에 띄게 한다
    const pulse = active
      ? 1.15 + Math.sin(state.clock.elapsedTime * 4) * 0.08
      : 1;
    ring.current.scale.setScalar(pulse);
  });

  return (
    <group position={zone.position}>
      {/* 바닥에 눕힌 링 (rotation -90도로 XZ 평면에 맞춤) */}
      <mesh
        ref={ring}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={() => onSelect(zone)}
      >
        <ringGeometry args={[1.6, 2.4, 48]} />
        <meshBasicMaterial
          color={zone.color}
          transparent
          opacity={active ? 0.9 : 0.45}
          // 링을 아래에서 봐도 보이도록 양면 렌더
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 공중에 떠 있는 다면체 — 활성 상태면 더 밝게 빛난다 */}
      <mesh position={[0, 1.6, 0]} castShadow onClick={() => onSelect(zone)}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.color}
          emissiveIntensity={active ? 0.8 : 0.25}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Billboard: 카메라를 어느 방향에서 봐도 항상 정면을 향하게 해준다 */}
      <Billboard position={[0, 3.1, 0]}>
        {/* Html: 3D 공간에 HTML을 띄운다. 폰트를 따로 받지 않아 한글이 깨지지 않는다 */}
        <Html center distanceFactor={12} className="zone-label">
          {zone.label}
        </Html>
      </Billboard>
    </group>
  );
}
