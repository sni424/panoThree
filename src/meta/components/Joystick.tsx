import { useEffect, useRef, useState, type PointerEvent } from "react";

import { clearMoveInput, setMoveInput } from "@/meta/state/touchInput";

/** 손잡이가 중심에서 벗어날 수 있는 최대 거리(px). CSS의 원 크기와 맞춰야 한다 */
const RADIUS = 52;

/** 이 세기 이하는 입력으로 치지 않는다 (손가락을 얹어둔 채 생기는 미세한 흔들림 무시) */
const DEADZONE = 0.12;

/**
 * 모바일용 가상 조이스틱.
 *
 * Canvas 밖의 평범한 HTML이라 3D 씬의 터치(카메라 회전)와 서로 간섭하지 않는다.
 * 값은 touchInput 모듈에 직접 써넣고 Player가 매 프레임 읽어간다 —
 * state로 올리면 손가락을 움직일 때마다 3D 씬 전체가 리렌더된다.
 */
export default function Joystick() {
  /** 손잡이의 화면상 위치(px). 놓으면 null이 되어 가운데로 돌아간다 */
  const [knob, setKnob] = useState<{ x: number; y: number } | null>(null);

  /** 조이스틱 원의 중심 좌표 (누른 순간에 한 번 계산) */
  const center = useRef({ x: 0, y: 0 });

  /** 지금 이 조이스틱을 잡고 있는 손가락. 멀티터치에서 다른 손가락과 섞이지 않게 한다 */
  const activePointer = useRef<number | null>(null);

  /** 컴포넌트가 사라질 때 입력이 눌린 채로 남지 않도록 정리 */
  useEffect(() => clearMoveInput, []);

  const update = (clientX: number, clientY: number) => {
    let dx = clientX - center.current.x;
    let dy = clientY - center.current.y;

    // 원 밖으로는 나가지 않게 길이를 잘라낸다
    const distance = Math.hypot(dx, dy);
    if (distance > RADIUS) {
      dx = (dx / distance) * RADIUS;
      dy = (dy / distance) * RADIUS;
    }
    setKnob({ x: dx, y: dy });

    const nx = dx / RADIUS;
    const ny = dy / RADIUS;
    if (Math.hypot(nx, ny) < DEADZONE) {
      clearMoveInput();
      return;
    }
    // 화면 y는 아래가 +인데 게임의 "앞"은 화면 위쪽이라 부호를 뒤집는다
    setMoveInput(nx, -ny);
  };

  const handleDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    center.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    activePointer.current = event.pointerId;
    // 손가락이 원 밖으로 나가도 이 요소가 계속 이벤트를 받게 한다
    event.currentTarget.setPointerCapture(event.pointerId);
    update(event.clientX, event.clientY);
  };

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== activePointer.current) return;
    update(event.clientX, event.clientY);
  };

  const handleUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== activePointer.current) return;
    activePointer.current = null;
    setKnob(null);
    clearMoveInput();
  };

  return (
    <div
      className="joystick"
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      // 전화가 오거나 시스템 제스처로 터치가 끊길 때도 반드시 초기화해야
      // 손을 뗐는데 계속 걸어가는 상태가 되지 않는다
      onPointerCancel={handleUp}
      aria-label="이동 조이스틱"
    >
      <div
        className="joystick__knob"
        style={{
          transform: `translate(${knob?.x ?? 0}px, ${knob?.y ?? 0}px)`,
          // 놓았을 때만 부드럽게 돌아가고, 끄는 동안은 손가락을 즉시 따라가야 한다
          transition: knob ? "none" : "transform 0.15s ease-out",
        }}
      />
    </div>
  );
}
