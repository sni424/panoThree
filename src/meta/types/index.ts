/** [x, y, z] 좌표. three.js 컴포넌트의 position/scale 등에 그대로 넣을 수 있는 형태 */
export type Vec3 = [number, number, number];

/** 맵 위에 표시되는 이동/입장 지점 */
export interface Zone {
  /** 내부 식별자 */
  id: string;
  /** 화면에 표시되는 이름 */
  label: string;
  /** 맵 위 위치 */
  position: Vec3;
  /** 링·오브젝트·이름표에 쓰이는 색 */
  color: string;
  /**
   * 입장 시 열 주소. 없으면 단순 랜드마크(입장 불가).
   *
   * 앱 내부 경로("/pano?...")와 외부 사이트("https://...") 둘 다 넣을 수 있다.
   * 어느 쪽이든 새 창(탭)으로 열리므로 메타버스 화면은 그대로 남는다.
   */
  url?: string;
}

/** 나중에 다른 접속자를 표시할 때 쓸 아바타 정보 */
export interface Avatar {
  id: string;
  nickname: string;
  position: Vec3;
  color: string;
}
