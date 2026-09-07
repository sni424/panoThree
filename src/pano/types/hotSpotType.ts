// 핫스팟 데이터 타입 정의
export type HotSpotType = {
  position: [number, number, number]; // 3D 좌표
  style: {
    width: string;
    height: string;
    cursor: string;
  };
  image: string; // 이미지 경로
  room: number; // 방 번호
};

// 여러 개 핫스팟 배열 타입
export type HotSpotListType = HotSpotType[];
