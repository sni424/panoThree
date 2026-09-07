// 마커 데이터 타입 정의
export type MarkerType = {
  position: [number, number, number]; // 3D 좌표
  style: {
    width: string;
    height: string;
    cursor: string;
  };
  image: string; // 이미지 경로
  from: number; // 시작 방 번호
  to: number; // 도착 방 번호
};

// 여러 개 마커 배열 타입
export type MarkerListType = MarkerType[];
