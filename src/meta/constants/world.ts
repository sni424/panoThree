/* ============================================================================
 * 메타버스 월드의 숫자 값들을 한곳에 모아둔 파일.
 * 값만 바꾸면 이동 속도·캐릭터 크기·카메라 거리 등을 조절할 수 있다.
 * ========================================================================== */

/** 걷기 속도 (유닛/초) */
export const WALK_SPEED = 16;

/** Shift를 눌렀을 때의 달리기 속도 (유닛/초) */
export const RUN_SPEED = 32;

/** 존(입장 지점) 안에 들어왔다고 판정하는 반경 */
export const ZONE_RADIUS = 2.5;

/* ---------------------------------------------------------------------------
 * 모델 파일 경로 (public/model 폴더)
 * public 안의 파일은 빌드에 그대로 복사되므로 "/model/..." 로 접근한다.
 * ------------------------------------------------------------------------ */
export const MODELS = {
  map: "/model/adventure_map.glb",
  /** 물리 전용 저폴리 맵 (410KB, 25,137삼각형) — 화면에는 그려지지 않는다 */
  collision: "/model/collision-map.glb",
  character: "/model/cat-animated.glb",
} as const;

/* ---------------------------------------------------------------------------
 * 맵(adventure_map.glb) 보정값
 * 원본이 Sketchfab 스케일이라 매우 큼 (도로 폭 약 1100, 길이 약 85000 유닛).
 * 0.01을 곱해 도로 폭 약 11유닛 / 전체 길이 약 850유닛으로 줄인다.
 * ------------------------------------------------------------------------ */
export const MAP_SCALE = 0.01;

/* ---------------------------------------------------------------------------
 * 캐릭터(cat-animated.glb) 보정값
 *
 * 스킨 메시라 GLB의 정점 좌표를 그대로 읽으면 안 되고, 본의 글로벌 행렬과
 * inverseBindMatrix를 곱해 실제 렌더링되는 자세를 계산해야 한다. 그렇게 재면
 * 정지 자세와 클립 3개가 모두 높이 2.149 / 발 위치 y=+3.752로 일치한다.
 * ------------------------------------------------------------------------ */

/** 캐릭터 확대 배율. 1.5 → 키 약 3.2유닛 (도로 폭 11유닛 기준으로 적당한 크기) */
export const CHARACTER_SCALE = 1.5;

/** 발이 지면(y=0)에 닿도록 모델을 아래로 내리는 값 = -(원본 최저 y) × 배율 */
export const CHARACTER_Y_OFFSET = -3.752 * CHARACTER_SCALE;

/** 모델이 바라보는 축을 +Z(진행 방향)에 맞추기 위한 보정 회전(라디안). 이 모델은 보정 불필요 */
export const CHARACTER_ROTATION_OFFSET = 0;

/**
 * GLB 안에 들어 있는 애니메이션 클립 이름.
 * 모델을 다시 뽑아서 이름이 바뀌면 여기만 고치면 된다.
 */
export const CHARACTER_CLIPS = {
  /** 걷기/달리기 (3.33초) */
  walk: "metarigAction.001",
  /** 점프 (2.04초) */
  jump: "Cat_Jump",
  /** 춤 (11.04초) */
  dance: "Cat_Dance",
} as const;

/**
 * 가만히 서 있을 때 쓸 클립.
 *
 * 이 GLB에는 전용 idle 클립이 없어서 걷기 클립을 첫 프레임에 정지시켜 쓴다.
 * 아무 클립도 재생하지 않아도 정지 자세는 멀쩡하지만, 점프처럼 한 번만 재생되는
 * 클립에서 빠져나올 때 어떤 자세로 돌아갈지가 믹서 내부 상태에 좌우된다.
 * 클립을 명시적으로 붙들고 있으면 항상 같은 자세가 보장된다.
 *
 * 나중에 Idle 클립을 만들어 넣으면 여기만 그 이름으로 바꾸면 된다.
 */
export const CHARACTER_IDLE_CLIP: string = CHARACTER_CLIPS.walk;

/* ---------------------------------------------------------------------------
 * 카메라 설정 (캐릭터를 중심으로 공전하는 3인칭 카메라)
 * ------------------------------------------------------------------------ */

/** 카메라가 바라보는 지점의 높이 = 캐릭터 발밑에서 이만큼 위 (가슴 높이쯤) */
export const CAMERA_TARGET_HEIGHT = 2;

/** 시작할 때 카메라가 캐릭터로부터 떨어져 있는 위치 (뒤쪽 위) */
export const CAMERA_START_OFFSET: [number, number, number] = [0, 4.5, -9];

/** 휠/핀치로 줌인·줌아웃할 수 있는 거리 범위 */
export const CAMERA_MIN_DISTANCE = 4;
export const CAMERA_MAX_DISTANCE = 25;

/** 방향키로 시점을 돌릴 때의 회전 속도 (라디안/초) */
export const KEYBOARD_ROTATE_SPEED = 1.4;

/** 카메라가 위아래로 돌 수 있는 각도 범위 (0=바로 위에서 내려다봄, PI/2=지면 높이) */
export const CAMERA_MIN_POLAR_ANGLE = 0.35;
export const CAMERA_MAX_POLAR_ANGLE = Math.PI / 2 - 0.08;

/* ---------------------------------------------------------------------------
 * 이동 가능 범위
 *
 * 콜리전 메시가 벽은 막아주지만, "발밑에 아무것도 없는 곳"까지 막아주지는
 * 않는다. 그래서 걸을 수 있는 땅이 실제로 있는 영역을 따로 정의한다.
 *
 * 맵의 길은 곧게 뻗다가 끝에서 왼쪽으로 꺾이는 T자 형태라 사각형 하나로는
 * 표현할 수 없다. 사각형 여러 개의 합집합으로 정의하고, 서로 겹치게 두어
 * 영역 사이를 끊김 없이 오갈 수 있게 한다.
 * (수치는 collision-map.glb의 도로 메시를 5유닛 격자로 떠서 뽑았다)
 * ------------------------------------------------------------------------ */
export interface WalkableArea {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export const WALKABLE_AREAS: readonly WalkableArea[] = [
  // 1) 직선 도로 구간. 도로(x 약 ±5) 양옆 지형까지 넓게 돌아다닐 수 있다.
  //    지면이 z=0.0에서 딱 끊기므로 캡슐 반지름만큼 여유를 두고 z=1.5에서 막는다.
  //    z 690부터는 옆쪽 지형이 y=-38까지 꺼지므로 여기서 넓은 구간을 끝낸다.
  { minX: -60, maxX: 60, minZ: 1.5, maxZ: 690 },

  // 2) 도로 끝 접근로. 양옆이 구덩이라 도로 폭만 허용한다.
  { minX: -10, maxX: 6, minZ: 685, maxZ: 716 },

  // 3) 왼쪽(-x)으로 꺾이는 가로 도로. 여기가 맵의 끝이다.
  { minX: -88, maxX: 4, minZ: 710, maxZ: 722 },
];

/** 캐릭터가 처음 서 있는 위치 */
export const PLAYER_START: [number, number, number] = [0, 0, 10];

/* ===========================================================================
 * 물리 (Rapier)
 *
 * 단위는 "MAP_SCALE 적용 후"의 월드 유닛이다. 도로 폭 약 11유닛, 캐릭터 키
 * 약 3.2유닛인 세계라, 현실의 m/s² 값이 아니라 이 크기에 맞춘 게임용 값이다.
 * ========================================================================= */

/** 중력 가속도 (유닛/초²). 음수 = 아래 방향 */
export const GRAVITY = -34;

/**
 * 점프를 시작할 때의 위쪽 속도 (유닛/초).
 * 최고 높이 = JUMP_SPEED² / (2 × |GRAVITY|) ≈ 2.9유닛 (캐릭터 키의 약 90%),
 * 체공 시간 ≈ 0.82초.
 */
export const JUMP_SPEED = 14;

/** 낙하 속도 상한. 너무 빠르면 얇은 바닥을 뚫고 지나갈 수 있어 제한한다 */
export const MAX_FALL_SPEED = -60;

/**
 * 점프 한 번의 체공 시간(초) = 2 × JUMP_SPEED / |GRAVITY| ≈ 0.82초.
 * 점프 애니메이션의 재생 속도를 여기에 맞추므로,
 * 중력이나 점프 속도를 바꿔도 애니메이션이 자동으로 따라온다.
 */
export const JUMP_AIRTIME = (2 * JUMP_SPEED) / -GRAVITY;

/**
 * 점프 클립(Cat_Jump, 2.04초)에서 실제로 발이 떠 있는 구간.
 *
 * 클립 앞뒤에 가만히 서 있는 프레임이 각각 0.42초 / 0.54초씩 붙어 있다.
 * 클립을 처음부터 틀면 물리적으로는 이미 떠올랐는데 모델은 아직 서 있는
 * 어색한 순간이 생기므로, 이 구간만 잘라서 체공 시간에 맞춰 재생한다.
 * (발 높이를 0.02초 간격으로 재서 뽑은 값)
 */
export const JUMP_CLIP_START = 0.42;
export const JUMP_CLIP_END = 1.5;
export const JUMP_CLIP_SPAN = JUMP_CLIP_END - JUMP_CLIP_START;

/**
 * 캐릭터를 감싸는 캡슐 충돌체.
 * Rapier 캡슐의 전체 높이 = 2 × (halfHeight + radius) = 2 × (1.0 + 0.6) = 3.2유닛
 * → 실제 캐릭터 키(2.149 × CHARACTER_SCALE ≈ 3.22)와 거의 같다.
 */
export const CHARACTER_CAPSULE_RADIUS = 0.6;
export const CHARACTER_CAPSULE_HALF_HEIGHT = 1.0;

/**
 * 캡슐의 원점은 "가운데"인데 캐릭터 그룹의 원점은 "발밑"이다.
 * 그래서 둘 사이를 이 값만큼 위아래로 변환해준다.
 */
export const CHARACTER_CAPSULE_OFFSET =
  CHARACTER_CAPSULE_HALF_HEIGHT + CHARACTER_CAPSULE_RADIUS;

/** 캐릭터 컨트롤러가 벽에 남겨두는 여유 간격. 0이면 벽에 끼는 버그가 난다 */
export const CHARACTER_CONTROLLER_OFFSET = 0.05;

/** 걸어 올라갈 수 있는 최대 경사각. 이보다 가파르면 미끄러진다 */
export const MAX_SLOPE_CLIMB_ANGLE = (45 * Math.PI) / 180;

/** 이 각도보다 가파른 바닥에 서 있으면 아래로 미끄러진다 */
export const MIN_SLOPE_SLIDE_ANGLE = (32 * Math.PI) / 180;

/** 자동으로 올라갈 수 있는 턱의 최대 높이 / 발 디딜 최소 너비 */
export const AUTOSTEP_MAX_HEIGHT = 0.6;
export const AUTOSTEP_MIN_WIDTH = 0.25;

/**
 * 내리막을 걸을 때 이 거리 안에 바닥이 있으면 붙어서 따라간다.
 * 없으면 살짝 내리막마다 캐릭터가 통통 튄다.
 */
export const SNAP_TO_GROUND_DISTANCE = 0.5;

/** 공중에 있을 때 방향키가 먹히는 비율 (1 = 지상과 동일) */
export const AIR_CONTROL = 0.6;

/**
 * 조이스틱을 이 세기 이하로 밀면 움직이지 않은 것으로 본다.
 * 이동 속도 자체는 민 정도와 무관하게 PC와 똑같이 일정하다 —
 * 아날로그로 속도를 바꾸면 같은 맵을 도는데 기기마다 체감이 달라진다.
 * 달리기는 조이스틱 세기가 아니라 부스터 버튼(키보드 Shift)으로 켠다.
 */
export const MOVE_DEADZONE = 0.05;

/** 스폰할 때 지면 위로 살짝 띄우는 높이 — 지형에 박힌 채 시작하는 걸 막는다 */
export const SPAWN_LIFT = 2;

/**
 * 이 높이 아래로 떨어지면 시작 지점으로 되돌린다 (맵 밖으로 샜을 때의 안전망).
 *
 * 걸어다니는 도로·지형은 전부 y가 -0.8 이상이다. 반면 z 690 부근부터는
 * 옆쪽 지형이 y=-38까지 푹 꺼져 있는데, 여기에 콜리전이 있어서 그냥 두면
 * 되돌아오지도 못하고 구덩이 바닥에 갇힌다. 그래서 -8을 넘어가면 바로 복귀시킨다.
 */
export const RESPAWN_Y = -8;

/**
 * 물리 월드를 한 번 step할 때 진행되는 시간(초).
 * 고정값이라 프레임률이 흔들려도 시뮬레이션 결과가 튀지 않는다.
 */
export const PHYSICS_TIMESTEP = 1 / 60;

/**
 * 물리 계산에 쓸 delta의 상한(초).
 * 탭을 다른 곳에 갔다 오면 delta가 몇 초씩 되는데, 그대로 넣으면
 * 한 프레임에 수십 유닛을 이동해 벽을 뚫는다.
 */
export const MAX_PHYSICS_DELTA = 1 / 20;

/** true로 바꾸면 콜리전 메시가 초록 와이어프레임으로 보인다 (디버깅용) */
export const COLLISION_DEBUG = false;
