import type { Collider, World } from "@dimforge/rapier3d-compat";
import * as THREE from "three";

import type { Rapier } from "./rapier";

/**
 * collision-map.glb를 Rapier의 고정(fixed) 삼각형 메시 충돌체로 등록한다.
 *
 * 전제
 *  - collisionRoot가 이미 씬에 붙어 있고, 화면에 보이는 맵과 **같은 부모 그룹**
 *    아래에 있어야 한다. 정점을 matrixWorld로 구워서 넣기 때문에 트랜스폼이
 *    다르면 캐릭터가 허공을 걷거나 엉뚱한 곳에서 부딪힌다.
 *  - Rapier는 이미 init()이 끝난 상태여야 한다.
 */

/** 바닥: 잘 미끄러지지 않게 마찰을 높인다 */
const GROUND_FRICTION = 0.7;

/** 장애물(벽·소품): 마찰이 높으면 벽에 스쳤을 때 옷깃 걸리듯 멈춰서 낮게 준다 */
const OBSTACLE_FRICTION = 0.2;

interface ColliderMeta {
  role: string;
  sourceObject?: string;
}

export interface CollisionMapHandle {
  /** 등록된 충돌체들 */
  colliders: Collider[];
  /** collider.handle → 원본 메타데이터 (role 등) */
  meta: Map<number, ColliderMeta>;
  /** 모두 제거한다. 두 번 호출해도 안전 */
  dispose: () => void;
}

/**
 * 이 메시가 충돌체로 쓸 대상인지 판정하고 메타데이터를 꺼낸다.
 *
 * GLTFLoader는 glTF 노드의 extras를 "그 노드가 만든 Object3D"의 userData에 넣는다.
 * 프리미티브가 1개면 그 객체가 Mesh 자신이지만, 머티리얼이 갈려서 2개 이상이 되면
 * 부모 Group이 되고 Mesh의 userData는 비어버린다. 모델을 다시 뽑았을 때 조용히
 * 전부 스킵되는 사고를 막기 위해 부모와 이름 규칙까지 3단계로 확인한다.
 */
function colliderMetaOf(mesh: THREE.Mesh): ColliderMeta | null {
  for (const source of [mesh.userData, mesh.parent?.userData]) {
    if (source?.collider_type === "trimesh") {
      return {
        role: typeof source.role === "string" ? source.role : "ground",
        sourceObject: source.source_object,
      };
    }
  }

  // 마지막 안전망: COLLISION_GROUND_01 / COLLISION_OBSTACLE_03 같은 이름 규칙
  if (mesh.name.startsWith("COLLISION_")) {
    return { role: mesh.name.includes("_OBSTACLE_") ? "obstacle" : "ground" };
  }

  return null;
}

/** 메시의 정점을 월드 좌표로 구워서 Rapier가 먹는 Float32Array로 만든다 */
function bakeVertices(mesh: THREE.Mesh): Float32Array {
  const position = mesh.geometry.getAttribute("position");
  const vertices = new Float32Array(position.count * 3);
  const point = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld);
    point.toArray(vertices, i * 3);
  }

  return vertices;
}

/** Rapier는 인덱스를 Uint32Array로만 받는다 (이 GLB는 Uint16이라 변환이 필요) */
function bakeIndices(mesh: THREE.Mesh): Uint32Array {
  const index = mesh.geometry.getIndex();
  if (index) return new Uint32Array(index.array);

  // 인덱스가 없는 메시는 정점이 순서대로 삼각형을 이룬다고 보고 0,1,2,... 를 만든다
  const count = mesh.geometry.getAttribute("position").count;
  return Uint32Array.from({ length: count }, (_, i) => i);
}

export function installCollisionMap(
  collisionRoot: THREE.Object3D,
  world: World,
  RAPIER: Rapier
): CollisionMapHandle {
  // 부모 체인(= MAP_SCALE이 걸린 그룹)까지 거슬러 올라가 matrixWorld를 갱신한다
  collisionRoot.updateWorldMatrix(true, true);

  const colliders: Collider[] = [];
  const meta = new Map<number, ColliderMeta>();

  try {
    collisionRoot.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;

      const colliderMeta = colliderMetaOf(mesh);
      if (!colliderMeta) return;

      const descriptor = RAPIER.ColliderDesc.trimesh(
        bakeVertices(mesh),
        bakeIndices(mesh),
        // 인접 삼각형의 법선을 함께 보고 접촉을 계산한다.
        // 없으면 평평한 바닥의 삼각형 경계마다 캐릭터가 턱턱 걸린다.
        RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES
      )
        .setFriction(
          colliderMeta.role === "obstacle" ? OBSTACLE_FRICTION : GROUND_FRICTION
        )
        .setRestitution(0);

      // 부모 강체를 주지 않으면 월드에 고정된 충돌체가 된다
      const collider = world.createCollider(descriptor);
      colliders.push(collider);
      meta.set(collider.handle, colliderMeta);
    });
  } catch (error) {
    // 중간에 실패하면 이미 만든 것들이 월드에 남지 않도록 되돌린다
    for (const collider of colliders) world.removeCollider(collider, true);
    throw error;
  }

  if (!colliders.length) {
    throw new Error(
      "collision-map.glb에서 충돌 메시를 찾지 못했다 " +
        "(extras.collider_type 또는 COLLISION_ 이름 규칙 확인 필요)"
    );
  }

  let removed = false;

  return {
    colliders,
    meta,
    dispose() {
      if (removed) return;
      removed = true;
      for (const collider of colliders) world.removeCollider(collider, true);
    },
  };
}
