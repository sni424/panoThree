// --- 유틸리티 함수 ---

import type { Decoration, PositionAble, SelectType, TextData } from "./type";

/**
 * 16진수 색상 코드를 rgba 문자열로 변환합니다.
 */
export function hexToRgba(hex?: string, alpha: number = 1): string {
  if (!hex) return "transparent";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 요소의 위치와 크기를 설정하는 헬퍼 함수입니다.
 */
export const applyElementPosition = (
  element: HTMLElement,
  data: PositionAble
) => {
  element.style.position = "absolute";

  // 1. 크기 설정 (기존과 동일)
  if (data.width) {
    element.style.width = String(data.width).includes("%")
      ? String(data.width)
      : `${data.width}px`;
  }
  if (data.height) {
    element.style.height = String(data.height).includes("%")
      ? String(data.height)
      : data.height === "prop"
      ? "100%"
      : `${data.height}px`;
  }

  // 2. 위치 설정 (수정된 로직)
  const transforms = [];
  const xOffset = data.x ? parseFloat(String(data.x)) : 0;
  const yOffset = data.y ? parseFloat(String(data.y)) : 0;

  if (data.align === "center" || data.edge === "center") {
    element.style.left = "50%";
    element.style.top = "50%";
    transforms.push(
      `translate(-50%, -50%) translate(${xOffset}px, ${yOffset}px)`
    );
  } else {
    // --- 수평 위치 로직 수정 ---
    if (data.x != null && data.x !== "") {
      if (String(data.x).includes("%")) {
        element.style.left = String(data.x);
      } else {
        transforms.push(`translateX(${xOffset}px)`);
      }
    } else if (data.text_align === "center") {
      // [수정] x가 비어있고 text_align이 center일 때 수평 중앙 정렬
      element.style.left = "50%";
      transforms.push(`translateX(-50%)`);
    }

    // --- 수직 위치 로직 (기존과 거의 동일) ---
    if (data.y != null && data.y !== "") {
      if (String(data.y).includes("%")) {
        element.style.top = String(data.y);
      } else {
        transforms.push(`translateY(${yOffset}px)`);
      }
    }

    if (data.align === "top" || data.edge === "top") element.style.top = "0px";
    if (data.align === "bottom" || data.edge === "bottom")
      element.style.bottom = "0px";
  }

  if (transforms.length > 0) {
    element.style.transform = transforms.join(" ");
  }
};
