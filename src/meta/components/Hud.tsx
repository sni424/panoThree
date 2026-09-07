import { useState } from "react";

import { ZONES } from "@/meta/constants/zones";
import { useWorldStore } from "@/meta/store/useWorldStore";

import BoostButton from "./BoostButton";
import DanceButton from "./DanceButton";
import Joystick from "./Joystick";
import JumpButton from "./JumpButton";

/** 이 폭 이하를 모바일로 본다. meta.css의 미디어 쿼리와 같은 값을 쓴다 */
const MOBILE_QUERY = "(max-width: 820px), (pointer: coarse)";

/** 모바일에서는 화면이 좁으니 안내 패널을 접은 채로 시작한다 */
function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

/**
 * 3D 화면 위에 겹쳐 표시되는 일반 HTML UI.
 * (Canvas 안이 아니라 밖에 있으므로 평범한 React 컴포넌트처럼 작성하면 된다)
 */
export default function Hud() {
  const nickname = useWorldStore((s) => s.nickname);
  const setNickname = useWorldStore((s) => s.setNickname);
  const position = useWorldStore((s) => s.playerPosition);
  const activeZoneId = useWorldStore((s) => s.activeZoneId);

  /** 왼쪽 위 안내 패널이 펼쳐져 있는지 */
  const [panelOpen, setPanelOpen] = useState(() => !isMobileViewport());

  /** 지금 들어가 있는 존 정보 (없으면 undefined) */
  const activeZone = ZONES.find((z) => z.id === activeZoneId);

  // 버튼에 포커스가 남으면 이후 스페이스바가 점프가 아니라 그 버튼을 다시 누른다.
  const togglePanel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    setPanelOpen((open) => !open);
  };

  return (
    <>
      {/* 왼쪽 위: 닉네임 + 조작 안내 + 현재 좌표 (접었다 펼 수 있다) */}
      {panelOpen ? (
        <div className="hud hud--top-left">
          <div className="hud__row">
            <input
              className="hud__input"
              value={nickname}
              maxLength={12}
              onChange={(e) => setNickname(e.target.value)}
              aria-label="닉네임"
            />
            <button
              className="hud__icon-button"
              onClick={togglePanel}
              aria-label="안내 패널 접기"
              aria-expanded
            >
              ─
            </button>
          </div>
          <p className="hud__hint">WASD 이동 · Shift 달리기 · Space 점프</p>
          <p className="hud__hint">방향키 · 드래그(터치) 시점 회전</p>
          <p className="hud__hint">휠 / 핀치 확대·축소</p>
          <p className="hud__coords">
            x {position[0].toFixed(1)} · z {position[2].toFixed(1)}
          </p>
        </div>
      ) : (
        <button
          className="hud hud--top-left hud--collapsed"
          onClick={togglePanel}
          aria-label="안내 패널 펼치기"
          aria-expanded={false}
        >
          ☰
        </button>
      )}

      {/*
        오른쪽 아래 동작 버튼들.
        조이스틱·점프·부스터는 좁은 화면과 터치 기기에서만 보이고,
        춤은 PC에 대체 조작이 없어서 항상 보인다.
      */}
      <Joystick />
      <JumpButton />
      <BoostButton />
      <DanceButton />

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
