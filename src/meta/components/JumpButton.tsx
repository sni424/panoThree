import { useEffect, type PointerEvent } from "react";

import { setTouchJump } from "@/meta/state/touchInput";

/**
 * 모바일용 점프 버튼.
 *
 * button이 아니라 div인 이유: button은 클릭 후 포커스를 가져가서 이후 스페이스바가
 * 점프가 아니라 이 버튼을 다시 누르게 되고, 길게 누르기(pointerdown 유지)보다
 * 클릭(pointerdown+up) 의미가 강하다. 여기서는 "누르고 있는 동안"이 중요하다.
 *
 * Player가 눌린 순간만 골라 점프시키므로(jumpHeld 판정) 계속 누르고 있어도
 * 착지하자마자 다시 뛰지는 않는다.
 */
export default function JumpButton() {
  /** 컴포넌트가 사라질 때 입력이 눌린 채로 남지 않도록 정리 */
  useEffect(() => () => setTouchJump(false), []);

  const handleDown = (event: PointerEvent<HTMLDivElement>) => {
    // 손가락이 버튼 밖으로 미끄러져도 pointerup을 반드시 받기 위해 캡처한다.
    // 안 그러면 손을 뗐는데 계속 눌린 상태로 남는다.
    event.currentTarget.setPointerCapture(event.pointerId);
    setTouchJump(true);
  };

  const handleUp = () => setTouchJump(false);

  return (
    <div
      className="touch-button touch-button--jump"
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      // 전화 수신 등 시스템 제스처로 터치가 끊길 때도 반드시 초기화한다
      onPointerCancel={handleUp}
      role="button"
      aria-label="점프"
    >
      점프
    </div>
  );
}
