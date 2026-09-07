import { useGLTF } from "@react-three/drei";

import { MODELS } from "@/meta/constants/world";

/**
 * adventure_map.glb — +Z 방향으로 길게 뻗은 길 형태의 맵 (화면에 보이는 쪽).
 *
 * 크기 보정(MAP_SCALE)은 여기서 하지 않는다.
 * World.tsx에서 CollisionMap과 같은 부모 그룹에 걸어야 둘이 절대 어긋나지 않는다.
 */
export default function MapModel() {
  const { scene } = useGLTF(MODELS.map);

  return <primitive object={scene} />;
}

// 라우트 진입 즉시 다운로드를 시작한다 (맵 파일이 약 7.8MB로 큼)
useGLTF.preload(MODELS.map);
