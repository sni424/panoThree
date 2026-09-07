import { create } from "zustand";

import type { Vec3 } from "@/meta/types";

/**
 * 화면 UI(HUD)가 필요로 하는 월드 상태.
 *
 * 주의: 매 프레임 바뀌는 값(카메라 각도 등)은 여기 두지 않는다.
 * 스토어가 바뀌면 리렌더가 일어나기 때문에, 그런 값은
 * meta/state/playerTransform.ts 처럼 모듈 변수로 공유한다.
 */
interface WorldState {
  /** HUD 입력창에서 바꾸는 닉네임 */
  nickname: string;
  /** 캐릭터 위치 (초당 10회 갱신 — 좌표 표시용) */
  playerPosition: Vec3;
  /** 지금 들어가 있는 존의 id. 없으면 null */
  activeZoneId: string | null;

  setNickname: (nickname: string) => void;
  setPlayerPosition: (position: Vec3) => void;
  setActiveZoneId: (zoneId: string | null) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  nickname: "게스트",
  playerPosition: [0, 0, 0],
  activeZoneId: null,
  setNickname: (nickname) => set({ nickname }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  setActiveZoneId: (activeZoneId) => set({ activeZoneId }),
}));
