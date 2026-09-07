import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type ComponentRef } from "react";
import * as THREE from "three";

import {
  CAMERA_MAX_DISTANCE,
  CAMERA_MAX_POLAR_ANGLE,
  CAMERA_MIN_DISTANCE,
  CAMERA_MIN_POLAR_ANGLE,
  CAMERA_TARGET_HEIGHT,
  KEYBOARD_ROTATE_SPEED,
} from "@/meta/constants/world";
import { useKeyboard } from "@/meta/hooks/useKeyboard";
import { playerPosition } from "@/meta/state/playerTransform";

/** drei의 OrbitControls 인스턴스 타입 (ref로 직접 제어하기 위해 필요) */
type OrbitControlsRef = ComponentRef<typeof OrbitControls>;

/**
 * 캐릭터를 중심으로 도는 3인칭 카메라.
 *
 * 시점을 돌리는 방법은 두 가지이며 둘 다 같은 카메라를 움직인다.
 *  1) 마우스 드래그 / 모바일 한 손가락 터치 → OrbitControls가 처리
 *  2) 방향키(←→↑↓)                        → 아래 useFrame에서 직접 계산
 *
 * OrbitControls는 "target(바라보는 점)을 중심으로 카메라를 공전"시키는 컨트롤이라
 * 회전·핀치 줌을 알아서 처리해준다. 다만 target을 옮겨도 카메라는 따라오지 않으므로,
 * 매 프레임 "캐릭터가 움직인 만큼(delta)"을 target과 카메라에 똑같이 더해준다.
 * → 사용자가 맞춰둔 각도·거리는 유지된 채 캐릭터만 따라간다.
 */
export default function CameraRig() {
  const controls = useRef<OrbitControlsRef>(null);

  /** 방향키 입력 (Player와 같은 window 이벤트를 공유) */
  const keys = useKeyboard();

  /** 직전 프레임의 캐릭터 위치 (이동량 계산용) */
  const previous = useRef(new THREE.Vector3().copy(playerPosition));

  /* 매 프레임 새 객체를 만들지 않기 위한 재사용 객체들 */
  const delta = useRef(new THREE.Vector3());
  /** target에서 카메라까지의 벡터 */
  const offset = useRef(new THREE.Vector3());
  /** 위 벡터를 각도(theta=좌우, phi=위아래)와 거리로 표현한 것 */
  const spherical = useRef(new THREE.Spherical());

  // 처음 한 번, 카메라가 캐릭터의 가슴 높이를 바라보도록 target을 맞춘다.
  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    orbit.target.set(
      playerPosition.x,
      playerPosition.y + CAMERA_TARGET_HEIGHT,
      playerPosition.z
    );
    orbit.update();
    previous.current.copy(playerPosition);
  }, []);

  useFrame((_state, frameDelta) => {
    const orbit = controls.current;
    if (!orbit) return;

    /* --- 1. 캐릭터를 따라가기 ------------------------------------------ */
    delta.current.subVectors(playerPosition, previous.current);
    if (delta.current.lengthSq() > 0) {
      // 카메라와 시선 중심을 같은 양만큼 평행 이동 → 보고 있던 각도가 유지된다
      orbit.target.add(delta.current);
      orbit.object.position.add(delta.current);
      previous.current.copy(playerPosition);
    }

    /* --- 2. 방향키로 시점 회전 ----------------------------------------- */
    const k = keys.current;
    const yawInput = (k.lookLeft ? 1 : 0) - (k.lookRight ? 1 : 0); // 좌우
    const pitchInput = (k.lookUp ? 1 : 0) - (k.lookDown ? 1 : 0); // 위아래

    if (yawInput !== 0 || pitchInput !== 0) {
      // 카메라 위치를 "target 기준 구면 좌표(각도 + 거리)"로 바꾼다
      offset.current.subVectors(orbit.object.position, orbit.target);
      spherical.current.setFromVector3(offset.current);

      const step = KEYBOARD_ROTATE_SPEED * frameDelta;
      spherical.current.theta += yawInput * step; // 좌우 회전
      spherical.current.phi -= pitchInput * step; // 위아래 회전

      // 카메라가 지면 아래로 내려가거나 정수리를 넘어가지 않도록 제한
      spherical.current.phi = THREE.MathUtils.clamp(
        spherical.current.phi,
        CAMERA_MIN_POLAR_ANGLE,
        CAMERA_MAX_POLAR_ANGLE
      );

      // 다시 좌표로 되돌려 카메라 위치에 반영
      offset.current.setFromSpherical(spherical.current);
      orbit.object.position.copy(orbit.target).add(offset.current);
    }

    // 드래그 입력(관성 포함)과 위 변경 사항을 카메라에 최종 반영
    orbit.update();
  });

  return (
    <OrbitControls
      ref={controls}
      // 화면을 끌어서 시점을 옮기는 팬 기능은 3인칭 게임에서 방해가 되므로 끈다
      enablePan={false}
      // 드래그를 놓아도 살짝 미끄러지듯 멈추는 관성
      enableDamping
      dampingFactor={0.08}
      // 드래그 회전 감도
      rotateSpeed={0.4}
      // 줌 거리 제한
      minDistance={CAMERA_MIN_DISTANCE}
      maxDistance={CAMERA_MAX_DISTANCE}
      // 카메라가 지면 아래로 내려가지 않도록 수직 회전 각도를 제한
      minPolarAngle={CAMERA_MIN_POLAR_ANGLE}
      maxPolarAngle={CAMERA_MAX_POLAR_ANGLE}
      // 이 컨트롤을 씬의 기본 컨트롤로 등록 (다른 drei 컴포넌트가 참조할 수 있게)
      makeDefault
    />
  );
}
