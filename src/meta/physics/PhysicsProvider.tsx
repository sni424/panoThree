import { useFrame } from "@react-three/fiber";
import { useMemo, useState, type ReactNode } from "react";

import { PhysicsContext, usePhysics } from "./PhysicsContext";
import { getPhysicsWorld, useRapier } from "./rapier";

/**
 * 물리 월드를 한 프레임 진행시킨다.
 *
 * 일부러 children보다 **뒤에** 렌더한다. useFrame 콜백은 등록 순서대로
 * 실행되고 등록은 트리 순서를 따르므로, 이렇게 두면
 * "캐릭터가 이번 프레임 이동량을 계산 → 마지막에 월드를 step" 순서가 보장된다.
 *
 * timestep은 월드를 만들 때 PHYSICS_TIMESTEP으로 고정해두고 매 프레임 한 번만
 * step한다. 지금은 캐릭터가 키네마틱이라 이동량을 우리가 직접 계산하므로
 * timestep이 조작감에 영향을 주지 않는다. 나중에 굴러다니는 상자 같은
 * 동적 강체를 넣게 되면, 여기에 고정 timestep 누산기(accumulator)를 넣어
 * 남은 시간만큼 여러 번 step하도록 바꾸면 된다.
 */
function PhysicsStepper() {
  const { world } = usePhysics();

  useFrame(() => {
    world.step();
  });

  return null;
}

/**
 * Rapier 초기화 → 물리 월드 → 하위 컴포넌트에 제공.
 *
 * WASM이 준비될 때까지 useRapier가 Promise를 throw하므로
 * 반드시 <Suspense> 안에서 사용해야 한다.
 */
export function PhysicsProvider({ children }: { children: ReactNode }) {
  const RAPIER = useRapier();
  const world = getPhysicsWorld(RAPIER);

  // 콜리전 맵 등록은 GLB 로딩이 끝난 뒤(CollisionMap의 effect)에나 가능하다.
  // 그 전에 캐릭터가 움직이면 아무것도 없는 공간을 낙하하므로 플래그로 막는다.
  const [collisionReady, setCollisionReady] = useState(false);

  const value = useMemo(
    () => ({ RAPIER, world, collisionReady, setCollisionReady }),
    [RAPIER, world, collisionReady]
  );

  return (
    <PhysicsContext.Provider value={value}>
      {children}
      <PhysicsStepper />
    </PhysicsContext.Provider>
  );
}
