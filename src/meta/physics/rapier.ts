import type { World } from "@dimforge/rapier3d-compat";

import { GRAVITY, PHYSICS_TIMESTEP } from "@/meta/constants/world";

/**
 * Rapier(WASM 물리 엔진)를 Suspense로 불러오고, 물리 월드를 하나만 유지한다.
 *
 * Rapier는 WebAssembly라서 쓰기 전에 반드시 `await init()`을 해야 한다.
 * 그 대기를 useState/useEffect로 처리하면 "아직 준비 안 됨" 분기가 사방에
 * 퍼지므로, 대신 Promise를 throw해서 React의 <Suspense>가 기다리게 한다.
 * 이미 맵/캐릭터 GLB도 같은 <Suspense> 안에서 로딩 중이라 자연스럽게 합쳐진다.
 *
 * -compat 패키지는 WASM이 base64로 번들에 들어있어 별도 파일 로딩 설정이 필요없다.
 */

/** Rapier 모듈 전체의 타입 (RAPIER.World, RAPIER.ColliderDesc ...) */
export type Rapier = typeof import("@dimforge/rapier3d-compat");

/** 모듈 스코프에 캐시 — 앱 전체에서 초기화는 딱 한 번만 일어난다 */
let pending: Promise<Rapier> | null = null;
let loaded: Rapier | null = null;
let world: World | null = null;

/**
 * 초기화가 끝난 Rapier 모듈을 돌려준다.
 * 아직이면 Promise를 throw해서 가장 가까운 <Suspense>가 fallback을 띄운다.
 */
export function useRapier(): Rapier {
  if (loaded) return loaded;

  pending ??= import("@dimforge/rapier3d-compat").then(async (module) => {
    await module.init();
    loaded = module;
    return module;
  });

  throw pending;
}

/**
 * 물리 월드를 돌려준다. 없으면 만든다.
 *
 * 컴포넌트 state가 아니라 모듈 변수에 두는 이유:
 * 월드는 WASM 메모리를 잡고 있어서 "생성 1 : free 1"이 정확히 맞아야 하는데,
 * StrictMode는 effect를 두 번 돌리고 React 19의 렌더는 언제든 버려질 수 있다.
 * 월드를 페이지 수명 동안 하나만 두면 그 짝맞추기 문제 자체가 사라진다.
 *
 * 월드는 빈 그릇일 뿐이고, 실제 메모리를 먹는 충돌체·강체는 각 컴포넌트가
 * 언마운트될 때 스스로 제거한다(CollisionMap, Player 참고). 그래서 남겨둬도
 * 새는 메모리는 없다.
 */
export function getPhysicsWorld(RAPIER: Rapier): World {
  if (!world) {
    world = new RAPIER.World({ x: 0, y: GRAVITY, z: 0 });
    world.timestep = PHYSICS_TIMESTEP;

    if (import.meta.env.DEV) {
      // 콘솔에서 물리 상태를 들여다보기 위한 개발용 창구.
      // 예: __physicsWorld.colliders.len()  /  __physicsWorld.bodies.len()
      Reflect.set(window, "__physicsWorld", world);
    }
  }
  return world;
}
