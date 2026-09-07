/**
 * 화면 위 터치 컨트롤(가상 조이스틱 · 점프 버튼)이 만들어내는 입력.
 *
 * 모바일·태블릿에는 키보드가 없으므로 WASD와 Space를 대신할 입력이 필요하다.
 * Player는 여기 담긴 값을 키보드 입력과 합쳐서 쓴다.
 *
 * zustand 스토어에 넣으면 손가락을 움직일 때마다 리렌더가 일어나므로,
 * playerTransform.ts와 같은 방식으로 모듈 변수에 담아 공유한다.
 *
 * - 쓰는 곳: meta/components/Joystick.tsx, meta/components/JumpButton.tsx
 * - 읽는 곳: meta/components/Player.tsx (useFrame에서 매 프레임)
 */
export const touchInput = {
  /** 좌우. +오른쪽 / -왼쪽 (-1 ~ 1) */
  x: 0,
  /**
   * 앞뒤. +앞 / -뒤 (-1 ~ 1).
   * 화면 좌표의 y는 아래가 +라서 조이스틱 쪽에서 부호를 뒤집어 넣는다.
   */
  y: 0,
  /** 점프 버튼을 누르고 있는지 (키보드 Space와 같은 의미) */
  jump: false,
  /**
   * 부스터(달리기)가 켜져 있는지 (키보드 Shift와 같은 의미).
   * 점프와 달리 누르고 있는 게 아니라 한 번 눌러 켜고 끄는 토글이다 —
   * 모바일에서는 조이스틱을 잡은 손 말고 다른 손가락으로 계속 누르고 있기 어렵다.
   */
  run: false,
};

/** 조이스틱을 민 방향과 세기. 원점에서 멀수록 값이 커진다(= 빠르게 걷는다) */
export function setMoveInput(x: number, y: number): void {
  touchInput.x = x;
  touchInput.y = y;
}

export function clearMoveInput(): void {
  touchInput.x = 0;
  touchInput.y = 0;
}

export function setTouchJump(pressed: boolean): void {
  touchInput.jump = pressed;
}

export function setTouchRun(on: boolean): void {
  touchInput.run = on;
}
