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
  createRoomList(roomList, core);

  createModal();
  contentModalDiv();
}

function createRoomList(roomInfo, core) {
  // 컨테이너 div 생성
  const parentDiv = document.getElementById("container");
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
        core.movePlace(room.index);
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
  parentDiv.appendChild(container);
  // return container;
}

function createModal() {
  const container = document.getElementById("container");
  const modalDiv = document.createElement("div");
  modalDiv.id = "modalDiv";

  modalDiv.style.cssText = `
    position:absolute;
    height: 100vh;
    width: 100%;
    top : 0; 
    left : 0; 
    display: flex;
    align-items: center;
    justify-content: center;
    z-index:10;
     background-color:rgba(58, 58, 60, 0.30);
    backdrop-filter: blur(2px);
    display:none;
    `;

  modalDiv.addEventListener("click", () => {
    modalDiv.style.display = "none";
  });

  container.appendChild(modalDiv);
}

function contentModalDiv() {
  const modalDiv = document.getElementById("modalDiv");
  // 모달 내부 콘텐츠 컨테이너 생성
  // 모달 콘텐츠 컨테이너
  const contentDiv = document.createElement("div");
  contentDiv.id = "optionInfo";
  contentDiv.style.cssText = `
    width: 100%;
    max-width: 600px;
    height: 78%;
    z-index:20;
    padding: 8px;
    background: rgba(58, 58, 60, 0.6);
    overflow: hidden;
    border-radius: 8px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
    display:none;
  `;

  // 이미지 섹션
  const imageSection = document.createElement("div");
  imageSection.style.cssText = `
    align-self: stretch;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    display: flex;
  `;
  const imageWrapper = document.createElement("div");
  imageWrapper.style.cssText = `
    justify-content: center;
    align-items: center;
    gap: 16px;
    display: inline-flex;
  `;
  const img = document.createElement("img");
  img.src = "https://placehold.co/177x133";
  img.style.cssText = `
    width: 177px;
    height: 133px;
  `;
  imageWrapper.appendChild(img);

  // 크게보기 버튼
  const zoomSection = document.createElement("div");
  zoomSection.style.cssText = `
    align-self: stretch;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    display: inline-flex;
  `;
  const zoomWrapper = document.createElement("div");
  zoomWrapper.style.cssText = `
    justify-content: center;
    align-items: center;
    gap: 4px;
    display: flex;
  `;
  const zoomText = document.createElement("div");
  zoomText.style.cssText = `
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 11px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    line-height: 10.78px;
    word-wrap: break-word;
  `;
  zoomText.textContent = "크게보기";
  // const zoomIcon = document.createElement("div");
  // zoomIcon.style.cssText = `
  //   width: 16px;
  //   height: 16px;
  //   justify-content: center;
  //   align-items: center;
  //   gap: 10px;
  //   display: flex;
  // `;
  const zoomIconBar = document.createElement("div");
  zoomIconBar.style.cssText = `
    width: 10px;
    height: 4px;
    transform: rotate(-45deg);
    transform-origin: top left;
    border: 1px solid #FFFFFF;
  `;
  // zoomIcon.appendChild(zoomIconBar);
  zoomWrapper.appendChild(zoomText);
  // zoomWrapper.appendChild(zoomIcon);
  zoomSection.appendChild(zoomWrapper);
  imageSection.appendChild(imageWrapper);
  imageSection.appendChild(zoomSection);

  // 구분선 2
  const divider2 = document.createElement("div");
  divider2.style.cssText = `
    align-self: stretch;
    height: 1px;
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
  `;

  // 제품 정보 섹션
  const productInfo = document.createElement("div");
  productInfo.style.cssText = `
    align-self: stretch;
    height: 30px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    display: flex;
  `;
  const productName = document.createElement("div");
  productName.style.cssText = `
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 13px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
    line-height: 12.74px;
    word-wrap: break-word;
  `;
  productName.textContent = "BESPOKE 오븐 Infinite Line 50L";
  const productCode = document.createElement("div");
  productCode.style.cssText = `
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 12px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
    line-height: 11.76px;
    word-wrap: break-word;
  `;
  productCode.textContent = "NQ50T9539BD";
  productInfo.appendChild(productName);
  productInfo.appendChild(productCode);

  // 구분선 3
  const divider3 = document.createElement("div");
  divider3.style.cssText = `
    align-self: stretch;
    height: 1px;
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
  `;

  // 색상 섹션
  const colorSection = document.createElement("div");
  colorSection.style.cssText = `
    align-self: stretch;
    justify-content: space-between;
    align-items: center;
    display: inline-flex;
  `;
  const colorLabel = document.createElement("div");
  colorLabel.style.cssText = `
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 13px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    line-height: 19.5px;
    word-wrap: break-word;
  `;
  colorLabel.textContent = "색상";
  const colorValue = document.createElement("div");
  colorValue.style.cssText = `
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 13px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    line-height: 19.5px;
    word-wrap: break-word;
  `;
  colorValue.textContent = "글램차콜";
  colorSection.appendChild(colorLabel);
  colorSection.appendChild(colorValue);

  // 색상 선택 버튼
  const colorOptions = document.createElement("div");
  colorOptions.style.cssText = `
    align-self: stretch;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    display: inline-flex;
  `;
  const colors = ["#272727", "#FFFFFF", "#002D00"];
  colors.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.style.cssText = `
      width: 32px;
      height: 32px;
      position: relative;
    `;
    const innerCircle = document.createElement("div");
    innerCircle.style.cssText = `
      width: 24px;
      height: 24px;
      background: ${color};
      border-radius: 9999px;
    `;
    const borderCircle = document.createElement("div");
    borderCircle.style.cssText = `
      width: 24px;
      height: 24px;
      left: 4px;
      top: 4px;
      position: absolute;
      border-radius: 9999px;
      border: 1px solid #5087E1;
    `;

    borderCircle.appendChild(innerCircle);
    colorDiv.appendChild(borderCircle);
    colorOptions.appendChild(colorDiv);
  });

  // 구분선 4
  const divider4 = document.createElement("div");
  divider4.style.cssText = `
    align-self: stretch;
    height: 1px;
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
  `;

  // 설명 섹션
  const description = document.createElement("div");
  description.style.cssText = `
    align-self: stretch;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    display: flex;
  `;
  const descriptionText = document.createElement("div");
  descriptionText.style.cssText = `
    align-self: stretch;
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 13px;
    font-family: Pretendard, sans-serif;
    font-weight: 400;
    line-height: 19.5px;
    word-wrap: break-word;
  `;
  descriptionText.innerHTML = `
    윗면의 72개 에어홀에서 내려오는 강력한 직화열풍으로 음식의 표면은 더욱 바삭해지고, 
    지름 154 mm의 대형 팬이 내부의 열풍을 고르게 순환시켜 빠르게 조리가 가능합니다.<br>
    한국인이 좋아하는 23가지 요리는 더욱 간단하게!
  `;
  description.appendChild(descriptionText);

  // 구분선 5
  const divider5 = document.createElement("div");
  divider5.style.cssText = `
    align-self: stretch;
    height: 1px;
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
  `;

  // 스펙 섹션
  const specs = document.createElement("div");
  specs.style.cssText = `
    align-self: stretch;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
    display: flex;
  `;
  const specItems = [
    ["용량", "50L"],
    ["오븐온도", "40~250℃"],
    ["규격", "595 x 456 x 570mm"],
    ["앱기능", "있음"],
    ["설치방식", "프리스탠징"],
  ];
  specItems.forEach(([label, value]) => {
    const specRow = document.createElement("div");
    specRow.style.cssText = `
      align-self: stretch;
      justify-content: space-between;
      align-items: center;
      display: inline-flex;
    `;
    const specLabel = document.createElement("div");
    specLabel.style.cssText = `
      justify-content: center;
      display: flex;
      flex-direction: column;
      color: #FFFFFF;
      font-size: 13px;
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 500;
      line-height: 19.5px;
      word-wrap: break-word;
    `;
    specLabel.textContent = label;
    const specValue = document.createElement("div");
    specValue.style.cssText = `
      justify-content: center;
      display: flex;
      flex-direction: column;
      color: #FFFFFF;
      font-size: 12px;
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 400;
      line-height: 18px;
      word-wrap: break-word;
    `;
    specValue.textContent = value;
    specRow.appendChild(specLabel);
    specRow.appendChild(specValue);
    specs.appendChild(specRow);
  });

  // 구분선 6
  const divider6 = document.createElement("div");
  divider6.style.cssText = `
    align-self: stretch;
    height: 1px;
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
  `;

  // 가격 및 버튼 섹션
  const priceSection = document.createElement("div");
  priceSection.style.cssText = `
    align-self: stretch;
    padding-bottom: 16px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 32px;
    display: flex;
  `;
  const priceInfo = document.createElement("div");
  priceInfo.style.cssText = `
    align-self: stretch;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
    display: flex;
  `;
  const basePrice = document.createElement("div");
  basePrice.style.cssText = `
    align-self: stretch;
    text-align: right;
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 13px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
    line-height: 12.74px;
    word-wrap: break-word;
  `;
  basePrice.textContent = "기준가: 1,000,000원";
  const optionPrice = document.createElement("div");
  optionPrice.style.cssText = `
    align-self: stretch;
    text-align: right;
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 13px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 400;
    line-height: 12.74px;
    word-wrap: break-word;
  `;
  optionPrice.textContent = "옵션가: 980,000원";
  priceInfo.appendChild(basePrice);
  priceInfo.appendChild(optionPrice);

  const optionButton = document.createElement("div");
  optionButton.style.cssText = `
    align-self: stretch;
    height: 29px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 4px;
    padding-bottom: 4px;
    background: #5087E1;
    border-radius: 8px;
    justify-content: space-between;
    align-items: center;
    display: inline-flex;
  `;
  const buttonText = document.createElement("div");
  buttonText.style.cssText = `
    flex: 1 1 0;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
    font-size: 14px;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500;
    line-height: 21px;
    word-wrap: break-word;
    cursor:pointer;
  `;
  buttonText.textContent = "옵션선택";

  buttonText.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("옵션");
  });

  optionButton.appendChild(buttonText);
  priceSection.appendChild(priceInfo);
  priceSection.appendChild(optionButton);

  // 콘텐츠 조립

  contentDiv.appendChild(imageSection);
  contentDiv.appendChild(divider2);
  contentDiv.appendChild(productInfo);
  contentDiv.appendChild(divider3);
  contentDiv.appendChild(colorSection);
  contentDiv.appendChild(colorOptions);
  contentDiv.appendChild(divider4);
  contentDiv.appendChild(description);
  contentDiv.appendChild(divider5);
  contentDiv.appendChild(specs);
  contentDiv.appendChild(divider6);
  contentDiv.appendChild(priceSection);

  modalDiv.appendChild(contentDiv);
}

export default uiCollection;
