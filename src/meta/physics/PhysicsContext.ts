import type { World } from "@dimforge/rapier3d-compat";
import { createContext, useContext } from "react";

import type { Rapier } from "./rapier";

/**
 * 물리 컨텍스트의 정의.
 *
 * 컴포넌트(PhysicsProvider)와 파일을 나눠둔 이유는 Vite의 Fast Refresh 때문이다.
 * 한 파일이 컴포넌트와 그 외의 것을 같이 내보내면 저장할 때마다 화면이 통째로
 * 새로고침돼 3D 씬이 처음부터 다시 로딩된다.
 */
export interface PhysicsValue {
  /** 초기화가 끝난 Rapier 모듈 */
  RAPIER: Rapier;
  /** 이 씬의 물리 월드 */
  world: World;
  /** 콜리전 맵이 월드에 등록됐는지. false면 캐릭터를 움직이면 안 된다 */
  collisionReady: boolean;
  setCollisionReady: (ready: boolean) => void;
}

export const PhysicsContext = createContext<PhysicsValue | null>(null);

export function usePhysics(): PhysicsValue {
  const value = useContext(PhysicsContext);
  if (!value) throw new Error("usePhysics는 <PhysicsProvider> 안에서만 쓸 수 있다");
  return value;
}
