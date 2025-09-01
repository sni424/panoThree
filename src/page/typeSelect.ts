import type {
  Decoration,
  Progressbar,
  SelectJsonType,
  SelectType,
  SelectypePageSettings,
  UnitArrayType,
} from "@/type";
import { applyElementPosition, hexToRgba } from "@/utils";

const renderTree = (
  data: SelectType,
  parentElement: HTMLElement,
  elementType: keyof HTMLElementTagNameMap = "div"
) => {
  if (!data) return;
  //   console.log(data);
  // 'decoration' 요소들
  if (data.decoration) {
    data.decoration.forEach((deco: Decoration) => {
      const decoEl = document.createElement("div");
      parentElement.appendChild(decoEl);
      applyElementPosition(decoEl, deco);

      if (deco.url.desktop) {
        decoEl.style.backgroundImage = `url("${deco.url.desktop}")`;
      }
      decoEl.style.backgroundSize = "contain";
      decoEl.style.backgroundRepeat = "no-repeat";
      decoEl.style.zIndex = "1px";
      if (deco.text) {
        decoEl.innerHTML = (deco.text || "").replaceAll("[br]", "<br>");
        decoEl.style.fontSize = `${deco.font_size}px`;
        decoEl.style.fontWeight = String(deco.font_weight || "normal");
        decoEl.style.color = `#${deco.font_color}`;
        decoEl.style.fontFamily = deco.font_family || "inherit";
      }
    });
  }
};

const bottomTree = (
  data: Progressbar, // Progressbar 타입을 사용한다고 가정
  parentElement: HTMLElement,
  elementType: keyof HTMLElementTagNameMap = "div"
) => {
  console.log("data", data);

  // data.button 대신 data.list가 있는지 확인해야 합니다.
  if (data.button) {
    const bottomDiv = document.createElement("div");
    parentElement.appendChild(bottomDiv);

    // 1. 컨테이너(bottomDiv)가 너비를 100% 채우고 Flexbox 역할을 하도록 설정
    applyElementPosition(bottomDiv, data);
    bottomDiv.style.width = "100%"; // [수정] 컨테이너가 부모 너비를 꽉 채우도록 설정
    bottomDiv.style.zIndex = `${data.zorder}`;
    bottomDiv.style.backgroundColor = hexToRgba(data.bgcolor, data.bgalpha);
    bottomDiv.style.display = "flex"; // Flexbox 레이아웃 적용

    // JSON에 정의된 자식 요소 간 간격(spacing) 적용
    if (data.childflowspacing) {
      const horizontalGap =
        (data.childflowspacing.left || 0) + (data.childflowspacing.right || 0);
      bottomDiv.style.gap = `${horizontalGap}px`;
    }

    // 2. [수정] 올바른 데이터 경로(data.list)로 반복문 실행
    data.button.list.forEach((listItem, index) => {
      const listDiv = document.createElement("div");
      bottomDiv.appendChild(listDiv);
      const titleStyle = data.button.inner.title;
      const circleStyle = data.button.inner.title.circle;
      const circleNumStyle = data.button.inner.title.circle.number;
      const circleCheckStyle = data.button.inner.title.circle.number;

      // --- 자식 요소(버튼) 스타일 적용 ---

      // 3. [수정] 자식 요소가 컨테이너의 남는 공간을 균등하게 채우도록 설정
      listDiv.style.flex = "1"; // flex-grow: 1 과 동일, 공간을 채움
      listDiv.style.textAlign = data.button.inner.title.text_align || "center";

      // 버튼의 배경색, 높이 등 기본 스타일 적용
      listDiv.style.height = `${data.button.height}px`;
      listDiv.style.backgroundColor = `#${data.button.normal.bgcolor}`;

      // 텍스트를 버튼 중앙에 오도록 Flexbox 추가 설정
      listDiv.style.display = "flex";
      listDiv.style.justifyContent = "center";
      listDiv.style.alignItems = "center";

      const circleDiv = document.createElement("div");
      listDiv.appendChild(circleDiv);
      circleDiv.innerHTML = String(index + 1);

      circleDiv.style.backgroundColor = `#${data.button.inner.title.circle.bgcolor}`;
      circleDiv.style.backgroundColor = hexToRgba(
        circleStyle.bgcolor,
        circleStyle.bgalpha
      );

      // [추가] JSON의 diameter 값으로 너비와 높이 설정
      circleDiv.style.width = `${circleStyle.diameter}px`;
      circleDiv.style.height = `${circleStyle.diameter}px`;

      circleDiv.style.borderRadius = "50%";

      circleDiv.style.fontSize = `${circleNumStyle.font_size}px`;
      circleDiv.style.fontWeight = String(
        circleNumStyle.font_weight || "normal"
      );
      circleDiv.style.color = `#${circleNumStyle.font_color}`;
      circleDiv.style.fontFamily = circleNumStyle.font_family || "inherit";
      // 패딩 적용

      const textDiv = document.createElement("div");
      listDiv.appendChild(textDiv);
      // 텍스트 및 폰트 스타일 적용
      textDiv.innerHTML = (listItem.name || "").replaceAll("[br]", "<br>");

      textDiv.style.fontSize = `${titleStyle.font_size}px`;
      textDiv.style.fontWeight = String(titleStyle.font_weight || "normal");
      textDiv.style.color = `#${titleStyle.font_color}`;
      textDiv.style.fontFamily = titleStyle.font_family || "inherit";
      if (titleStyle.padding) {
        const { top, right, bottom, left } = titleStyle.padding;
        textDiv.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      }
    });
  }
};

const createCardGrid = (
  selectTypeData: SelectypePageSettings["selectype"],
  unitsData: UnitArrayType,
  parentElement: HTMLElement
) => {
  // 1. 그리드 컨테이너(scrollarea) 생성
  const scrollArea = document.createElement("div");
  parentElement.appendChild(scrollArea);

  // 2. 컨테이너 위치 및 기본 스타일 설정
  applyElementPosition(scrollArea, selectTypeData.scrollarea);
  scrollArea.style.overflow = "auto"; // 콘텐츠가 많으면 스크롤
  scrollArea.style.display = "grid";

  // 3. 그리드 레이아웃 설정
  const cardStyle = selectTypeData.unit_type_outer_frame;
  scrollArea.style.gridTemplateColumns = `repeat(auto-fill, ${cardStyle.width}px)`; // 화면 크기에 맞춰 카드 자동 정렬
  scrollArea.style.gap = `${selectTypeData.scrollarea.vertical_spacing}px ${selectTypeData.scrollarea.horizontal_spacing}px`;
  scrollArea.style.justifyContent = "center"; // 그리드 중앙 정렬

  // 4. unitsData를 순회하며 각 유닛의 카드를 생성
  unitsData.units.forEach((unit) => {
    // 5. 개별 카드(unit_type_outer_frame) 생성
    const card = document.createElement("div");
    scrollArea.appendChild(card);

    // 6. 카드 기본 스타일 적용
    card.style.width = `${cardStyle.width}px`;
    card.style.height = `${cardStyle.height}px`;
    card.style.backgroundColor = hexToRgba(
      cardStyle.normal.bgcolor,
      cardStyle.normal.bgalpha
    );
    card.style.borderRadius = `${cardStyle.bgroundedge}px`;
    card.style.position = "relative"; // 내부 요소들을 absolute로 배치하기 위함
    card.style.cursor = "pointer";
    card.style.zIndex = "2px";
    // --- 7. 카드 내부에 콘텐츠 요소들 추가 ---

    // 타입 이름 (예: 104B)
    const typeNameFrame = document.createElement("div");
    card.appendChild(typeNameFrame);
    applyElementPosition(typeNameFrame, selectTypeData.type_name_frame);
    typeNameFrame.innerHTML = unit.text; // unitsData에서 실제 타입 이름 가져오기
    // (이하 type_name_frame에 대한 폰트 등 상세 스타일 적용)

    // 평면도 이미지
    const floorPlanFrame = document.createElement("div");
    card.appendChild(floorPlanFrame);
    applyElementPosition(floorPlanFrame, selectTypeData.floor_plan);
    // floorPlanFrame.style.backgroundImage = `url(...)`; // unit 데이터에서 평면도 이미지 경로 가져오기
    floorPlanFrame.style.backgroundColor = "grey"; // 임시 배경색

    // 전용 면적
    const exclusiveAreaFrame = document.createElement("div");
    card.appendChild(exclusiveAreaFrame);
    applyElementPosition(
      exclusiveAreaFrame,
      selectTypeData.exclusive_private_area_frame
    );
    exclusiveAreaFrame.innerHTML = `전용면적: ${unit.exclusive_private_area} ㎡`;
    // (이하 exclusive_private_area_frame에 대한 폰트 등 상세 스타일 적용)

    // 분양 면적
    const supplyAreaFrame = document.createElement("div");
    card.appendChild(supplyAreaFrame);
    applyElementPosition(supplyAreaFrame, selectTypeData.supply_area_frame);
    supplyAreaFrame.innerHTML = `분양면적: ${unit.supply_area} ㎡`;
    // (이하 supply_area_frame에 대한 폰트 등 상세 스타일 적용)

    // 마우스 호버 효과 (추가)
    card.onmouseenter = () =>
      (card.style.backgroundColor = hexToRgba(
        cardStyle.hovered.bgcolor,
        cardStyle.hovered.bgalpha
      ));
    card.onmouseleave = () =>
      (card.style.backgroundColor = hexToRgba(
        cardStyle.normal.bgcolor,
        cardStyle.normal.bgalpha
      ));
  });
};

const typeSelectUi = (
  selectTypeData: SelectJsonType,
  unitsData: UnitArrayType
) => {
  console.log("selectTypeData", selectTypeData, unitsData);
  const parentDiv = document.getElementById("container");
  if (!parentDiv) {
    console.error("Container #container not found.");
    return;
  }

  const element = document.createElement("div");
  parentDiv.appendChild(element);

  element.style.width = `100%`;
  element.style.height = `100%`;
  element.style.backgroundColor = hexToRgba(
    selectTypeData.selectype_page_settings.selectype.bgcolor,
    selectTypeData.selectype_page_settings.selectype.bgalpha
  );
  element.style.position = "relative";
  renderTree(selectTypeData.selectype_page_settings.selectype, element);
  createCardGrid(
    selectTypeData.selectype_page_settings.selectype,
    unitsData,
    element
  );
  bottomTree(selectTypeData.selectype_page_settings.progressbar, element);
};

export default typeSelectUi;
