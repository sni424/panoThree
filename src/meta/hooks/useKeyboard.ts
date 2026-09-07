import { useEffect, useRef } from "react";

/**
 * 실제 키보드 키(event.code) → 게임 안에서의 동작 이름 매핑.
 *
 * 조작 규칙
 *  - WASD  : 캐릭터 이동
 *  - 방향키 : 카메라(시점) 회전  ※ 마우스 드래그와 같은 역할
 *  - Shift : 달리기
 *
 * 키를 추가하고 싶으면 여기에 한 줄만 넣으면 된다.
 */
const KEY_MAP: Record<string, string> = {
  /* 이동 (WASD 전용) */
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",

  /* 시점 회전 (방향키 전용) */
  ArrowLeft: "lookLeft",
  ArrowRight: "lookRight",
  ArrowUp: "lookUp",
  ArrowDown: "lookDown",

  /* 기타 */
  ShiftLeft: "run",
  ShiftRight: "run",
  Space: "jump",
};

/** { forward: true, lookLeft: false, ... } 형태의 입력 상태 */
export type MoveState = Record<string, boolean>;

/**
 * 키 입력 상태를 ref로 돌려주는 훅.
 *
 * state가 아니라 ref를 쓰는 이유: 키를 누를 때마다 리렌더가 일어나면
 * 3D 화면이 매번 다시 그려져 낭비다. useFrame 안에서 ref.current만 읽으면 된다.
 *
 * 이 훅은 Player(이동)와 CameraRig(시점 회전) 양쪽에서 각각 호출한다.
 * 서로 다른 ref를 갖지만 같은 window 이벤트를 듣기 때문에 값은 항상 동일하다.
 */
export function useKeyboard() {
  const keys = useRef<MoveState>({});

  useEffect(() => {
    const setKey = (code: string, value: boolean) => {
      const action = KEY_MAP[code];
      if (action) keys.current[action] = value;
    };

    const down = (e: KeyboardEvent) => {
      // 방향키·스페이스는 브라우저 기본 동작(페이지 스크롤)을 막아야 화면이 튀지 않는다.
      // 특히 스페이스는 점프할 때마다 화면이 한 페이지씩 내려가 버린다.
      if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
      setKey(e.code, true);
    };
    const up = (e: KeyboardEvent) => setKey(e.code, false);

    // 다른 창으로 전환되면 keyup을 못 받아 계속 걷는 상태가 되므로 전부 초기화
    const blur = () => {
      keys.current = {};
    };

    // preventDefault를 쓰려면 passive:false 여야 한다
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);

    // 컴포넌트가 사라질 때 이벤트도 반드시 정리
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  return keys;
}
