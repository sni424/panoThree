import { useEffect, useState } from "react";

import { setTouchRun } from "@/meta/state/touchInput";

/**
 * 모바일용 부스터(달리기) 버튼 — 키보드 Shift에 해당한다.
 *
 * 점프 버튼과 달리 "누르고 있는 동안"이 아니라 한 번 눌러 켜고 끄는 토글이다.
 * 한 손으로 조이스틱을 잡은 상태에서 다른 손가락으로 Shift처럼 계속 누르고
 * 있기가 어렵기 때문이다.
 *
 * 켜짐 여부는 화면 표시용으로만 state에 두고, 실제 입력은 touchInput 모듈에
 * 써넣는다. Player가 매 프레임 그 값을 읽어간다.
 */
export default function BoostButton() {
  const [on, setOn] = useState(false);

  /** 컴포넌트가 사라질 때 부스터가 켜진 채로 남지 않도록 정리 */
  useEffect(() => () => setTouchRun(false), []);

  const toggle = () => {
    setOn((previous) => {
      const next = !previous;
      setTouchRun(next);
      return next;
    });
  };

  return (
    <div
      className={`touch-button touch-button--boost${on ? " is-on" : ""}`}
      onPointerDown={toggle}
      role="button"
      aria-pressed={on}
      aria-label="부스터"
    >
      부스터
    </div>
  );
}
