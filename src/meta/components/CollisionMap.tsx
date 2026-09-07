import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { COLLISION_DEBUG, MODELS } from "@/meta/constants/world";
import { installCollisionMap } from "@/meta/physics/installCollisionMap";
import { usePhysics } from "@/meta/physics/PhysicsContext";

/** 개발 중 정렬 검증에서 이 거리(월드 유닛)를 넘게 어긋나면 에러를 띄운다 */
const ALIGNMENT_TOLERANCE = 1;

/**
 * collision-map.glb — 화면에는 안 보이고 물리 충돌만 담당하는 저폴리 맵.
 *
 * 반드시 화면용 adventure_map과 **같은 부모 그룹** 아래에 두어야 한다.
 * (World.tsx의 <group scale={MAP_SCALE}> 안)
 */
export default function CollisionMap() {
  const { RAPIER, world, setCollisionReady } = usePhysics();
  const { scene } = useGLTF(MODELS.collision);
  const { scene: mapScene } = useGLTF(MODELS.map); // 이미 받아둔 캐시라 추가 다운로드 없음
  const root = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = root.current;
    if (!group) return;

    if (import.meta.env.DEV) {
      // 두 GLB의 월드 바운딩박스를 비교한다.
      // 모델을 다시 뽑거나 트랜스폼을 건드려서 어긋나면 캐릭터가 허공을 걷게 되는데,
      // 화면만 봐서는 원인을 찾기 매우 어려우므로 여기서 미리 잡는다.
      group.updateWorldMatrix(true, true);
      mapScene.updateWorldMatrix(true, true);

      const visualBox = new THREE.Box3().setFromObject(mapScene);
      const collisionBox = new THREE.Box3().setFromObject(group);
      const drift = Math.max(
        visualBox.min.distanceTo(collisionBox.min),
        visualBox.max.distanceTo(collisionBox.max)
      );

      if (drift > ALIGNMENT_TOLERANCE) {
        console.error(
          `[collision] 맵과 콜리전이 ${drift.toFixed(2)}유닛 어긋났다.`,
          { visual: visualBox, collision: collisionBox }
        );
      }
    }

    const handle = installCollisionMap(group, world, RAPIER);
    setCollisionReady(true);

    if (import.meta.env.DEV) {
      // 콜리전이 "실제로 어디에" 등록됐는지 한눈에 확인하기 위한 로그.
      // 여기 찍히는 범위가 화면 속 맵의 크기와 다르면 스케일이 안 먹은 것이다.
      const box = new THREE.Box3().setFromObject(group);
      console.info(
        `[collision] 충돌체 ${handle.colliders.length}개 등록`,
        `x[${box.min.x.toFixed(1)}, ${box.max.x.toFixed(1)}]`,
        `y[${box.min.y.toFixed(1)}, ${box.max.y.toFixed(1)}]`,
        `z[${box.min.z.toFixed(1)}, ${box.max.z.toFixed(1)}]`
      );
    }

    // 물리 전용 메시라 평소에는 렌더링하지 않는다.
    // visible=false여도 정점을 직접 읽어 Rapier에 넣었으므로 충돌은 그대로 동작한다.
    group.visible = COLLISION_DEBUG;

    if (COLLISION_DEBUG) {
      group.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.material = new THREE.MeshBasicMaterial({
          color: "#38ff9c",
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
      });
    }

    return () => {
      setCollisionReady(false);
      handle.dispose();
    };
  }, [RAPIER, world, scene, mapScene, setCollisionReady]);

  return (
    <group ref={root}>
      <primitive object={scene} />
    </group>
  );
}

// 맵과 함께 미리 받아둔다 (410KB라 부담이 없다)
useGLTF.preload(MODELS.collision);
