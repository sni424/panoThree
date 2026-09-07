import type { Zone } from "@/meta/types";

/**
 * 존에 연결된 페이지를 새 창(탭)으로 연다.
 *
 * 같은 탭에서 이동하지 않는 이유: 메타버스 씬은 GLB 8MB + Rapier WASM을
 * 다시 받아야 해서, 돌아올 때마다 처음부터 로딩이 걸린다. 새 탭으로 열면
 * 캐릭터가 서 있던 자리와 카메라 각도가 그대로 남는다.
 *
 * "noopener"는 새로 열린 페이지가 window.opener로 이쪽 창을 건드리지 못하게
 * 막는다. 외부 사이트를 열 때는 반드시 붙여야 한다.
 */
export function openZone(zone: Zone): void {
  if (!zone.url) return;
  window.open(zone.url, "_blank", "noopener,noreferrer");
}
