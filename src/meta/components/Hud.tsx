import { ZONES } from "@/meta/constants/zones";
import { useWorldStore } from "@/meta/store/useWorldStore";

/**
 * 3D 화면 위에 겹쳐 표시되는 일반 HTML UI.
 * (Canvas 안이 아니라 밖에 있으므로 평범한 React 컴포넌트처럼 작성하면 된다)
 */
export default function Hud() {
  const nickname = useWorldStore((s) => s.nickname);
  const setNickname = useWorldStore((s) => s.setNickname);
  const position = useWorldStore((s) => s.playerPosition);
  const activeZoneId = useWorldStore((s) => s.activeZoneId);

  /** 지금 들어가 있는 존 정보 (없으면 undefined) */
  const activeZone = ZONES.find((z) => z.id === activeZoneId);

  return (
    <>
      {/* 왼쪽 위: 닉네임 + 조작 안내 + 현재 좌표 */}
      <div className="hud hud--top-left">
        <input
          className="hud__input"
          value={nickname}
          maxLength={12}
          onChange={(e) => setNickname(e.target.value)}
          aria-label="닉네임"
        />
        <p className="hud__hint">WASD 이동 · Shift 달리기 · Space 점프</p>
        <p className="hud__hint">방향키 · 드래그(터치) 시점 회전</p>
        <p className="hud__hint">휠 / 핀치 확대·축소</p>
        <p className="hud__coords">
          x {position[0].toFixed(1)} · z {position[2].toFixed(1)}
        </p>
      </div>

      {/* 아래 가운데: 존 안에 들어와 있을 때만 표시되는 입장 패널 */}
      {activeZone && (
        <div className="hud hud--bottom">
          <strong>{activeZone.label}</strong>
          {activeZone.url ? (
            // button이 아니라 a인 이유: 새 창 열기를 브라우저가 직접 처리하므로
            // 팝업 차단에 걸리지 않고, 가운데클릭·우클릭(주소 복사)도 그대로 된다.
            <a
              className="hud__button"
              href={activeZone.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              입장하기
            </a>
          ) : (
            <span className="hud__hint">준비 중인 공간입니다</span>
          )}
        </div>
      )}
    </>
  );
}
