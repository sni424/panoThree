import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import {
  CHARACTER_CLIPS,
  CHARACTER_IDLE_CLIP,
  CHARACTER_ROTATION_OFFSET,
  CHARACTER_SCALE,
  CHARACTER_Y_OFFSET,
  JUMP_AIRTIME,
  JUMP_CLIP_SPAN,
  JUMP_CLIP_START,
  MODELS,
} from "@/meta/constants/world";
import type { CharacterAnimation } from "@/meta/types";

interface Props {
  /** 지금 재생할 동작 */
  animation: CharacterAnimation;
}

/** 동작을 바꿀 때의 페이드 시간(초) — 툭 끊기지 않게 부드럽게 전환 */
const FADE_DURATION = 0.2;

/**
 * 점프만 전환을 훨씬 짧게 한다.
 * 체공이 0.82초뿐이라 0.2초를 페이드에 쓰면 뜨기 시작할 때 자세가
 * 아직 걷기/정지에 가까워서 "뛴 다음에 애니메이션이 시작"하는 것처럼 보인다.
 */
const JUMP_FADE_DURATION = 0.06;

/** 각 동작이 재생할 GLB 안의 클립 이름 */
const CLIP_OF: Record<CharacterAnimation, string> = {
  // idle은 전용 클립이 없어서 걷기 클립을 첫 프레임에 정지시켜 쓴다 (자세한 이유는 상수 정의 참고)
  idle: CHARACTER_IDLE_CLIP,
  walk: CHARACTER_CLIPS.walk,
  jump: CHARACTER_CLIPS.jump,
  dance: CHARACTER_CLIPS.dance,
};

/**
 * cat-animated.glb — 플레이어가 조종하는 아바타.
 *
 * 이 컴포넌트는 "모델을 올바른 크기·높이로 놓고, 지정된 동작을 재생"하는
 * 역할만 한다. 실제 위치 이동과 동작 결정은 부모인 Player가 담당한다.
 */
export default function Character({ animation }: Props) {
  /** 애니메이션이 적용될 대상 그룹 */
  const group = useRef<THREE.Group>(null);

  // GLB 로드 (drei가 캐시해주므로 같은 파일을 여러 번 불러도 한 번만 다운로드된다)
  const { scene, animations } = useGLTF(MODELS.character);

  // 모델에 들어 있는 애니메이션 클립을 group에 연결
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const clipName = CLIP_OF[animation];
    const action = actions[clipName];
    if (!action) {
      console.warn(`[character] "${clipName}" 클립이 GLB에 없다`);
      return;
    }

    const isJump = animation === "jump";
    const fade = isJump ? JUMP_FADE_DURATION : FADE_DURATION;

    if (isJump) {
      // 점프는 반복하지 않는다. 클립 앞뒤의 "가만히 서 있는" 구간을 건너뛰고
      // 발이 떠 있는 구간만 실제 체공 시간에 맞춰 재생한다.
      action.setLoop(THREE.LoopOnce, 1);
      action.setEffectiveTimeScale(JUMP_CLIP_SPAN / JUMP_AIRTIME);
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
      // idle은 재생 속도 0 = 첫 프레임에서 멈춘 정지 자세
      action.setEffectiveTimeScale(animation === "idle" ? 0 : 1);
    }

    // 높은 곳에서 떨어져 체공이 길어지면 클립이 먼저 끝나는데, 그때 기본 자세로
    // 툭 돌아가지 않고 마지막 프레임을 유지하게 한다.
    // (three.js의 명령형 API라 세터 메서드가 없어 직접 대입해야 한다)
    // eslint-disable-next-line react-hooks/immutability -- 외부 라이브러리 객체의 정상적인 설정 방법
    action.clampWhenFinished = isJump;

    action.reset();
    if (isJump) {
      // 발이 지면을 떠나는 순간부터 시작 (reset이 0으로 되돌리므로 그 뒤에 준다)
      action.time = JUMP_CLIP_START;
    }
    action.fadeIn(fade).play();

    // 다음 동작으로 넘어갈 때 이 클립을 서서히 빼준다.
    // 새 클립의 fadeIn과 겹치면서 자연스러운 크로스페이드가 된다.
    return () => {
      action.fadeOut(fade);
    };
  }, [actions, animation]);

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
