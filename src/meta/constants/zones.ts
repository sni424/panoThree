import type { Zone } from "@/meta/types";

/**
 * 길을 따라 +Z 방향으로 배치된 존들.
 *
 * url은 전부 새 창으로 열린다(메타버스 화면을 두고 나가지 않게).
 * 자세한 동작은 meta/utils/openZone.ts 참고.
 */
export const ZONES: Zone[] = [
  {
    id: "pano",
    label: "파노라마 전시관",
    position: [0, 0, 45],
    color: "#4f8cff",
    url: "/pano?pid=bongmyeong&page=estimate/login",
  },
  {
    id: "portfolio",
    label: "포트폴리오",
    position: [0, 0, 140],
    color: "#ffb347",
    url: "https://jong-portfolio-sage.vercel.app/",
  },
  {
    id: "rubyshong",
    label: "루비숑 (주얼리)",
    position: [0, 0, 250],
    color: "#8cffb3",
    url: "https://rubyshong.vercel.app/",
  },
];
