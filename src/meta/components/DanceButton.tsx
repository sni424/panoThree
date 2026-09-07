import { useWorldStore } from "@/meta/store/useWorldStore";

/**
 * 춤 토글 버튼 — 점프·부스터와 같은 모양의 원형 버튼이다.
 *
 * 부스터처럼 라벨은 그대로 두고 켜진 상태를 색으로 보여준다.
 * 60px 원 안에 "그만 추기" 같은 긴 글자는 들어가지 않기도 하고,
 * 세 버튼이 같은 규칙으로 동작하는 편이 읽기 쉽다.
 *
 * button이 아니라 div인 이유: button은 클릭 후 포커스를 가져가서
 * 이후 스페이스바가 점프가 아니라 이 버튼을 다시 누르게 된다.
 *
 * 다른 두 버튼과 달리 상태를 touchInput이 아니라 스토어에 두는 이유는,
 * 춤은 물리가 아니라 재생할 애니메이션을 고르는 값이라 Player가 이를 보고
 * React state를 갱신해 Character에 내려보내야 하기 때문이다.
 * (걷거나 점프하면 Player가 자동으로 꺼준다)
 */
export default function DanceButton() {
  const dancing = useWorldStore((s) => s.dancing);
  const setDancing = useWorldStore((s) => s.setDancing);

  return (
    <div
      className={`touch-button touch-button--dance${dancing ? " is-on" : ""}`}
      onPointerDown={() => setDancing(!dancing)}
      role="button"
      aria-pressed={dancing}
      aria-label="춤추기"
    >
      춤추기
    </div>
  );
}
