import Core from "./core";

const roomList = [
  { name: "주방", index: 1 },
  { name: "거실", index: 2 },
  { name: "침실1", index: 3 },
  { name: "야외", index: 4 },
  { name: "테라스1", index: 5 },
  { name: "테라스2", index: 6 },
];

function uiCollection(core) {
  const room = createRoomList(roomList, core);
  document.body.appendChild(room);
}

function createRoomList(roomInfo, core) {
  // 컨테이너 div 생성
  const container = document.createElement("div");
  container.style.cssText = `
    position:absolute;
    top:0;
    overflow-x: auto;
    display: flex;
    align-items: center;
    width: 100%;
    height:40px;
    background-color:rgba(58, 58, 60, 0.30);
    backdrop-filter: blur(2px);
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
    scrollbar-width: none; /* Firefox용 스크롤바 숨김 */
    -ms-overflow-style: none; /* IE/Edge용 스크롤바 숨김 */
  `;
  // Webkit 브라우저(Chrome, Safari)용 스크롤바 숨김
  container.style.setProperty("--webkit-scrollbar", "display: none");

  // ul 요소 생성
  const ul = document.createElement("ul");
  ul.style.cssText = `
    width: 100%;
    display: flex;
    align-items: center;
   justify-content:center;
    gap: 16px;
    height: 100%;
  `;
  container.appendChild(ul);

  // 룸 배열 나열
  if (roomInfo.length > 0) {
    roomInfo.forEach((room) => {
      // li 요소 생성
      const li = document.createElement("li");
      li.style.cssText = `
        cursor: pointer;
        height: 100%;
        width: fit-content;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        border-bottom: 2px solid transparent;
        transform: translateZ(0);
       
      `;

      // 클릭 이벤트 핸들러 (필요 시 로직 추가)
      li.addEventListener("click", () => {
        console.log(`방 "${room.name}" (인덱스: ${room.index}) 클릭됨`);
        core.roomNum = room.index;
        core.vtexture.changeImageShader(room.index);
        core.hotspots.hideShow(room.index);
      });

      // p 요소 생성
      const p = document.createElement("p");
      p.style.cssText = `
        font-size: 16px; /* text-body1 대체, 필요 시 조정 */
        font-weight: 500; /* font-medium */
        padding: 4px 16px;
        border-radius: 8px;
         color  : white
        
      `;
      // 호버 효과 추가
      p.addEventListener("mouseenter", () => {
        p.style.backgroundColor = "#f0f0f0"; /* hover:bg-hoverColor 대체 */
        p.style.color = "#333";
      });
      p.addEventListener("mouseleave", () => {
        p.style.backgroundColor = "transparent";
        p.style.color = "#ffffff";
      });
      p.textContent = room.name;

      // p를 li에, li를 ul에 추가
      li.appendChild(p);
      ul.appendChild(li);
    });
  }

  return container;
}
export default uiCollection;
