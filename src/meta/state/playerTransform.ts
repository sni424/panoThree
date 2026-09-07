import * as THREE from "three";

import { PLAYER_START } from "@/meta/constants/world";

/**
 * 캐릭터의 현재 위치를 담아두는 공유 벡터.
 *
 * zustand 스토어에 넣으면 매 프레임 리렌더가 일어나기 때문에,
 * "매 프레임 갱신되지만 화면 UI와는 상관없는 값"은 이렇게 모듈 하나에
 * 담아두고 Player가 쓰고(write) 카메라가 읽는다(read).
 *
 * - 쓰는 곳: meta/components/Player.tsx   (useFrame에서 매 프레임 갱신)
 * - 읽는 곳: meta/components/CameraRig.tsx (카메라가 캐릭터를 따라가도록)
 */
export const playerPosition = new THREE.Vector3(...PLAYER_START);
