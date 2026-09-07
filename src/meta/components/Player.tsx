import type {
  Collider,
  KinematicCharacterController,
  RigidBody,
} from "@dimforge/rapier3d-compat";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import {
  AIR_CONTROL,
  AUTOSTEP_MAX_HEIGHT,
  AUTOSTEP_MIN_WIDTH,
  CHARACTER_CAPSULE_HALF_HEIGHT,
  CHARACTER_CAPSULE_OFFSET,
  CHARACTER_CAPSULE_RADIUS,
  CHARACTER_CONTROLLER_OFFSET,
  GRAVITY,
  JUMP_SPEED,
  MAX_FALL_SPEED,
  MAX_PHYSICS_DELTA,
  MAX_SLOPE_CLIMB_ANGLE,
  MIN_SLOPE_SLIDE_ANGLE,
  MOVE_DEADZONE,
  PLAYER_START,
  RESPAWN_Y,
  RUN_SPEED,
  SNAP_TO_GROUND_DISTANCE,
  SPAWN_LIFT,
  WALK_SPEED,
  ZONE_RADIUS,
} from "@/meta/constants/world";
import { ZONES } from "@/meta/constants/zones";
import { useKeyboard } from "@/meta/hooks/useKeyboard";
import { usePhysics } from "@/meta/physics/PhysicsContext";
import { clampToWalkableArea } from "@/meta/physics/walkableArea";
import { playerPosition } from "@/meta/state/playerTransform";
import { touchInput } from "@/meta/state/touchInput";
import { useWorldStore } from "@/meta/store/useWorldStore";
import type { CharacterAnimation, Vec3 } from "@/meta/types";

import Character from "./Character";

/** 스토어(UI)에 위치를 알려주는 주기 — 매 프레임 하면 리렌더가 너무 잦다 */
const STORE_UPDATE_INTERVAL = 0.1; // 초 (= 초당 10회)

/** 캡슐 몸통의 중심이 놓일 스폰 위치 (발밑 기준 위치 + 캡슐 반높이 + 살짝 띄우기) */
const SPAWN_TRANSLATION = {
  x: PLAYER_START[0],
  y: PLAYER_START[1] + CHARACTER_CAPSULE_OFFSET + SPAWN_LIFT,
  z: PLAYER_START[2],
};

/**
 * 플레이어(캐릭터)의 이동 처리.
 *
 * 이동 방향은 "카메라가 보고 있는 방향" 기준이다.
 * 카메라를 돌린 뒤 W를 누르면 화면 안쪽으로 걸어가는, 흔한 3인칭 조작감.
 *
 * 충돌·중력·점프는 Rapier의 KinematicCharacterController가 담당한다.
 * 동적(dynamic) 강체가 아니라 키네마틱을 쓰는 이유:
 *  - 콜리전 맵이 두께 0인 삼각형 메시라 빠르게 움직이는 동적 물체는 뚫고 나간다.
 *    키네마틱 컨트롤러는 캡슐을 쓸어서(sweep) 옮기므로 관통이 없다.
 *  - 계단 오르기 / 경사 미끄러짐 / 지면 붙기가 내장돼 있다.
 *  - 조작감이 물리 반발에 휘둘리지 않아 예측 가능하다.
 */
export default function Player() {
  /** 캐릭터 모델을 담는 그룹. 위치는 물리 강체를 따라간다 */
  const group = useRef<THREE.Group>(null);

  /** 현재 눌려 있는 키 상태 (리렌더 없이 읽기 위해 ref) */
  const keys = useKeyboard();

  /** 씬의 카메라 (이동 방향 기준을 잡는 데 사용) */
  const camera = useThree((state) => state.camera);

  /** 지금 재생 중인 동작 — Character에 넘긴다 */
  const [animation, setAnimation] = useState<CharacterAnimation>("idle");

  const { RAPIER, world, collisionReady } = usePhysics();

  const setPlayerPosition = useWorldStore((s) => s.setPlayerPosition);
  const setActiveZoneId = useWorldStore((s) => s.setActiveZoneId);
  const dancing = useWorldStore((s) => s.dancing);
  const setDancing = useWorldStore((s) => s.setDancing);

  /* --- 물리 객체 (effect에서 만들고 언마운트 때 지운다) -------------------- */
  const bodyRef = useRef<RigidBody | null>(null);
  const colliderRef = useRef<Collider | null>(null);
  const controllerRef = useRef<KinematicCharacterController | null>(null);

  /* --- 프레임 사이에 이어지는 상태 ---------------------------------------- */
  /** 위아래 속도. 점프하면 +, 떨어지면 - */
  const verticalVelocity = useRef(0);
  /** 지난 프레임에 바닥을 밟고 있었는지 */
  const grounded = useRef(false);
  /** 스페이스바를 계속 누르고 있는 상태인지 — 눌린 순간에만 점프시키기 위함 */
  const jumpHeld = useRef(false);

  /* 매 프레임 새 객체를 만들지 않도록 미리 만들어 재사용하는 벡터들 */
  const moveDirection = useRef(new THREE.Vector3()); // 최종 이동 방향
  const cameraForward = useRef(new THREE.Vector3()); // 카메라가 보는 앞 방향(수평)
  const cameraRight = useRef(new THREE.Vector3()); // 그 오른쪽 방향
  const walkableTarget = useRef({ x: 0, z: 0 }); // 이동 가능 범위로 잘라낸 목표 좌표

  /** 스토어 갱신 주기를 세는 누적 시간 */
  const elapsedSinceReport = useRef(0);

  useEffect(() => {
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
        SPAWN_TRANSLATION.x,
        SPAWN_TRANSLATION.y,
        SPAWN_TRANSLATION.z
      )
    );

    const collider = world.createCollider(
      RAPIER.ColliderDesc.capsule(
        CHARACTER_CAPSULE_HALF_HEIGHT,
        CHARACTER_CAPSULE_RADIUS
      ),
      body
    );

    const controller = world.createCharacterController(
      CHARACTER_CONTROLLER_OFFSET
    );
    controller.setUp({ x: 0, y: 1, z: 0 });
    controller.enableAutostep(AUTOSTEP_MAX_HEIGHT, AUTOSTEP_MIN_WIDTH, true);
    controller.enableSnapToGround(SNAP_TO_GROUND_DISTANCE);
    controller.setMaxSlopeClimbAngle(MAX_SLOPE_CLIMB_ANGLE);
    controller.setMinSlopeSlideAngle(MIN_SLOPE_SLIDE_ANGLE);
    // 나중에 밀 수 있는 상자 같은 걸 놓으면 캐릭터가 밀어낼 수 있게 한다
    controller.setApplyImpulsesToDynamicBodies(true);

    bodyRef.current = body;
    colliderRef.current = collider;
    controllerRef.current = controller;

    return () => {
      bodyRef.current = null;
      colliderRef.current = null;
      controllerRef.current = null;
      world.removeCharacterController(controller);
      world.removeCollider(collider, false);
      world.removeRigidBody(body);
    };
  }, [RAPIER, world]);

  useFrame((_state, delta) => {
    const player = group.current;
    const body = bodyRef.current;
    const collider = colliderRef.current;
    const controller = controllerRef.current;
    if (!player || !body || !collider || !controller) return;

    // 콜리전 맵이 아직 월드에 안 올라왔으면 움직이지 않는다.
    // 안 그러면 아무것도 없는 공간을 그대로 낙하한다.
    if (!collisionReady) return;

    // 탭을 갔다 오면 delta가 몇 초씩 되므로 상한을 둔다 (PhysicsStepper와 같은 값)
    const dt = Math.min(delta, MAX_PHYSICS_DELTA);
    const k = keys.current;

    /* --- 1. 카메라 기준의 앞/오른쪽 방향 구하기 ------------------------- */
    // 카메라가 보는 방향에서 y(위아래)를 지우면 바닥에 평행한 "앞" 방향이 된다
    camera.getWorldDirection(cameraForward.current);
    cameraForward.current.y = 0;
    cameraForward.current.normalize();
    // 오른쪽 방향 = 앞 방향 × 위 방향 (외적) = (-forward.z, 0, forward.x)
    cameraRight.current
      .set(-cameraForward.current.z, 0, cameraForward.current.x)
      .normalize();

    /* --- 2. 키보드 + 조이스틱 입력을 수평 이동량으로 바꾸기 -------------- */
    // 둘을 그냥 더한다. 키보드는 0 아니면 ±1이고 조이스틱은 -1~1 사이의
    // 아날로그 값이라, 동시에 쓰지 않는 한 서로 방해하지 않는다.
    const forwardInput = (k.forward ? 1 : 0) - (k.backward ? 1 : 0) + touchInput.y;
    const rightInput = (k.right ? 1 : 0) - (k.left ? 1 : 0) + touchInput.x;

    const direction = moveDirection.current.set(0, 0, 0);
    direction.addScaledVector(cameraForward.current, forwardInput);
    direction.addScaledVector(cameraRight.current, rightInput);

    // 조이스틱을 아주 살짝 건드린 정도는 무시한다
    const isMoving = direction.length() > MOVE_DEADZONE;

    if (isMoving) {
      // normalize: 대각선 이동이나 조이스틱을 민 정도와 무관하게 속도를 일정하게 —
      // PC와 모바일의 이동 속도가 정확히 같아진다
      direction.normalize();
      // 캐릭터가 가는 쪽을 바라보게 회전 (atan2로 방향 → 각도)
      player.rotation.y = Math.atan2(direction.x, direction.z);

      // 키보드 Shift 또는 모바일 부스터 버튼
      const speed = k.run || touchInput.run ? RUN_SPEED : WALK_SPEED;
      // 공중에서는 조작을 덜 먹게 해서 점프 궤적이 헬리콥터처럼 되지 않게 한다
      const control = grounded.current ? 1 : AIR_CONTROL;
      direction.multiplyScalar(speed * control * dt);
    }

    /* --- 3. 점프와 중력 ------------------------------------------------- */
    // 키보드 Space 또는 모바일 점프 버튼
    const jumpPressed = Boolean(k.jump) || touchInput.jump;
    // 눌린 "순간"에만 점프한다. 계속 누르고 있어도 착지하자마자 다시 뛰지 않는다.
    // verticalVelocity <= 0 조건은 점프 직후 아직 올라가는 중일 때의 이중 점프를 막는다.
    if (
      jumpPressed &&
      !jumpHeld.current &&
      grounded.current &&
      verticalVelocity.current <= 0
    ) {
      verticalVelocity.current = JUMP_SPEED;
    }
    jumpHeld.current = jumpPressed;

    verticalVelocity.current = Math.max(
      verticalVelocity.current + GRAVITY * dt,
      MAX_FALL_SPEED
    );

    /* --- 4. 충돌을 고려한 실제 이동량 계산 ------------------------------ */
    // 원하는 이동량을 넣으면 벽/바닥에 막힌 만큼을 깎아서 실제 이동량을 돌려준다
    controller.computeColliderMovement(collider, {
      x: direction.x,
      y: verticalVelocity.current * dt,
      z: direction.z,
    });
    const movement = controller.computedMovement();
    grounded.current = controller.computedGrounded();

    // 바닥에 닿았는데 아래로 떨어지는 속도가 남아 있으면 없앤다.
    // 안 그러면 계속 누적돼서 다음에 떨어질 때 순간이동하듯 내려간다.
    if (grounded.current && verticalVelocity.current < 0) {
      verticalVelocity.current = 0;
    }

    /* --- 4-1. 지금 어떤 동작을 재생할지 결정 ---------------------------- */
    // 걷거나 점프하면 춤은 자동으로 그만둔다
    if (dancing && (isMoving || jumpPressed)) setDancing(false);

    const nextAnimation: CharacterAnimation = !grounded.current
      ? "jump" // 점프 중이거나 떨어지는 중
      : dancing
        ? "dance"
        : isMoving
          ? "walk"
          : "idle";
    // 값이 바뀔 때만 setState (매 프레임 리렌더를 피한다)
    if (nextAnimation !== animation) setAnimation(nextAnimation);

    /* --- 5. 강체를 옮긴다 (실제 반영은 PhysicsStepper의 world.step()에서) -- */
    const current = body.translation();
    // 발밑에 땅이 없는 곳으로 새어 나가지 않게 하는 안전망.
    // 이미 충돌 처리가 끝난 값이라 여기서 잘라도 지형에 파묻히지 않는다.
    const limited = clampToWalkableArea(
      current.x + movement.x,
      current.z + movement.z,
      walkableTarget.current
    );
    body.setNextKinematicTranslation({
      x: limited.x,
      y: current.y + movement.y,
      z: limited.z,
    });

    /* --- 6. 맵 밖으로 떨어졌으면 시작 지점으로 되돌린다 ------------------ */
    if (current.y < RESPAWN_Y) {
      body.setTranslation(SPAWN_TRANSLATION, true);
      verticalVelocity.current = 0;
      grounded.current = false;
    }

    /* --- 7. 물리 위치를 화면(three.js)에 반영 ---------------------------- */
    // 캡슐 원점은 몸통 가운데, 캐릭터 그룹 원점은 발밑이라 그 차이만큼 내린다
    player.position.set(
      current.x,
      current.y - CHARACTER_CAPSULE_OFFSET,
      current.z
    );
    // 카메라가 읽어갈 수 있게 현재 위치를 공유 벡터에 기록
    playerPosition.copy(player.position);

    /* --- 8. UI용 상태 갱신 (초당 10회로 제한) --------------------------- */
    elapsedSinceReport.current += delta;
    if (elapsedSinceReport.current < STORE_UPDATE_INTERVAL) return;
    elapsedSinceReport.current = 0;

    const position: Vec3 = [
      player.position.x,
      player.position.y,
      player.position.z,
    ];
    setPlayerPosition(position);

    // 현재 어떤 존 안에 서 있는지 판정 (x,z 평면 거리로만 계산)
    const zone = ZONES.find(
      (z) =>
        Math.hypot(z.position[0] - position[0], z.position[2] - position[2]) <
        ZONE_RADIUS
    );
    setActiveZoneId(zone?.id ?? null);
  });

  return (
    <group ref={group} position={PLAYER_START}>
      <Character animation={animation} />
    </group>
  );
}
