import { WALKABLE_AREAS } from "@/meta/constants/world";

/** 결과를 담을 그릇. 매 프레임 호출되므로 새 객체를 만들지 않는다 */
export interface HorizontalPoint {
  x: number;
  z: number;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * 좌표를 걸을 수 있는 영역(WALKABLE_AREAS의 합집합) 안으로 밀어 넣는다.
 *
 * - 어느 한 영역 안에 들어 있으면 그대로 통과시킨다.
 * - 전부 벗어났으면, 각 영역에 잘라 넣어본 뒤 원래 위치에서 가장 가까운 것을 쓴다.
 *   캐릭터는 한 프레임에 조금씩만 움직이므로 결과는 항상 바로 옆 영역의 경계가 되고,
 *   멀리 있는 영역으로 순간이동하는 일은 생기지 않는다.
 */
export function clampToWalkableArea(
  x: number,
  z: number,
  out: HorizontalPoint
): HorizontalPoint {
  for (const area of WALKABLE_AREAS) {
    if (
      x >= area.minX &&
      x <= area.maxX &&
      z >= area.minZ &&
      z <= area.maxZ
    ) {
      out.x = x;
      out.z = z;
      return out;
    }
  }

  let nearest = Infinity;
  for (const area of WALKABLE_AREAS) {
    const clampedX = clamp(x, area.minX, area.maxX);
    const clampedZ = clamp(z, area.minZ, area.maxZ);
    const distance = (clampedX - x) ** 2 + (clampedZ - z) ** 2;
    if (distance < nearest) {
      nearest = distance;
      out.x = clampedX;
      out.z = clampedZ;
    }
  }

  return out;
}
