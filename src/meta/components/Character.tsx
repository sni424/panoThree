import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import {
  CHARACTER_ROTATION_OFFSET,
  CHARACTER_SCALE,
  CHARACTER_Y_OFFSET,
  MODELS,
} from "@/meta/constants/world";

interface Props {
  /** true면 걷는 애니메이션 재생, false면 정지 자세 */
  moving: boolean;
}

/** 애니메이션을 켜고 끌 때의 페이드 시간(초) — 툭 끊기지 않게 부드럽게 전환 */
const FADE_DURATION = 0.2;

/**
 * cute_cat.glb — 플레이어가 조종하는 아바타.
 *
 * 이 컴포넌트는 "모델을 올바른 크기·높이로 놓고, 이동 중일 때만 애니메이션을 재생"하는
 * 역할만 한다. 실제 위치 이동은 부모인 Player가 담당한다.
 */
export default function Character({ moving }: Props) {
  /** 애니메이션이 적용될 대상 그룹 */
  const group = useRef<THREE.Group>(null);

  // GLB 로드 (drei가 캐시해주므로 같은 파일을 여러 번 불러도 한 번만 다운로드된다)
  const { scene, animations } = useGLTF(MODELS.character);

  // 모델에 들어 있는 애니메이션 클립을 group에 연결
  // 이 모델에는 클립이 하나(metarigAction.001)뿐이라 names[0]을 사용한다
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions[names[0]];
    if (!action) return;

    if (moving) {
      // 이동 시작: 처음부터 재생하며 서서히 나타나게
      action.reset().fadeIn(FADE_DURATION).play();
    } else {
      // 정지: 서서히 사라지게 (fadeOut 후 자동으로 멈춤)
      action.fadeOut(FADE_DURATION);
    }

    return () => {
      action.fadeOut(FADE_DURATION);
    };
  }, [actions, names, moving]);

  return (
    <group
      ref={group}
      // 모델이 바라보는 방향 보정 (이 모델은 0)
      rotation={[0, CHARACTER_ROTATION_OFFSET, 0]}
      // 원본 모델의 원점이 발밑이 아니라 공중에 있어서 아래로 내려 지면에 붙인다
      position={[0, CHARACTER_Y_OFFSET, 0]}
      scale={CHARACTER_SCALE}
    >
      <primitive object={scene} />
    </group>
  );
}

// 라우트 진입 즉시 다운로드를 시작해 첫 화면 대기를 줄인다
useGLTF.preload(MODELS.character);
