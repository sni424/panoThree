import type {
  Decoration,
  Progressbar,
  SelectJsonType,
  SelectType,
  SelectypePageSettings,
  UnitArrayType,
} from "@/type";
import { applyElementPosition, hexToRgba } from "@/utils";
import "../css/typeSelect.css";

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
        decoEl.style.aspectRatio = "16 / 9";

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
  data: Progressbar,
  parentElement: HTMLElement,
  elementType: keyof HTMLElementTagNameMap = "div"
) => {
  // [수정] 현재까지 쌓인 bottom 위치를 추적할 변수
  let accumulatedBottom = 0;

  // --- [수정] 1. button list를 먼저 렌더링하여 바닥에 배치 ---
  if (data.button && data.button.list) {
    const bottomDiv = document.createElement("div");
    parentElement.appendChild(bottomDiv);

    // 컨테이너에 위치를 잡고, 가장 아래(bottom: 0)에 배치합니다.
    applyElementPosition(bottomDiv, data);
    bottomDiv.style.bottom = `${accumulatedBottom}px`; // 초기값 0px 적용

    // progressbar의 높이만큼 다음 요소가 올라갈 위치를 누적
    accumulatedBottom += data.height || 0;

    // --- 이하 버튼 렌더링 로직은 동일 ---
    bottomDiv.style.width = "100%";
    bottomDiv.style.zIndex = `${data.zorder}`;
    bottomDiv.style.backgroundColor = hexToRgba(data.bgcolor, data.bgalpha);
    bottomDiv.style.display = "flex";
    bottomDiv.style.height = `${data.height}px`;

    if (data.childflowspacing) {
      const horizontalGap =
        (data.childflowspacing.left || 0) + (data.childflowspacing.right || 0);
      bottomDiv.style.gap = `${horizontalGap}px`;
    }

    data.button.list.forEach((listItem, index) => {
      const listDiv = document.createElement("div");
      bottomDiv.appendChild(listDiv);
      const titleStyle = data.button.inner.title;
      const circleStyle = data.button.inner.title.circle;
      const circleNumStyle = data.button.inner.title.circle.number;

      listDiv.style.flex = "1";
      listDiv.style.height = `${data.button.height}px`;
      listDiv.style.backgroundColor = `#${data.button.normal.bgcolor}`;
      listDiv.style.display = "flex";
      listDiv.style.justifyContent = "center";
      listDiv.style.alignItems = "center";
      listDiv.style.gap = `${titleStyle.padding?.right || 0}px`;

      const circleDiv = document.createElement("div");
      listDiv.appendChild(circleDiv);

      circleDiv.style.display = "flex";
      circleDiv.style.alignItems = "center";
      circleDiv.style.justifyContent = "center";
      circleDiv.innerHTML = String(index + 1);
      circleDiv.style.backgroundColor = hexToRgba(
        circleStyle.bgcolor,
        circleStyle.bgalpha
      );
      circleDiv.style.width = `${circleStyle.diameter}px`;
      circleDiv.style.height = `${circleStyle.diameter}px`;
      circleDiv.style.borderRadius = "50%";
      circleDiv.style.fontSize = `${circleNumStyle.font_size}px`;
      circleDiv.style.fontWeight = String(
        circleNumStyle.font_weight || "normal"
      );
      circleDiv.style.color = `#${circleNumStyle.font_color}`;
      circleDiv.style.fontFamily = circleNumStyle.font_family || "inherit";

      const textDiv = document.createElement("div");
      listDiv.appendChild(textDiv);
      textDiv.innerHTML = (listItem.name || "").replaceAll("[br]", "<br>");
      textDiv.style.fontSize = `${titleStyle.font_size}px`;
      textDiv.style.fontWeight = String(titleStyle.font_weight || "normal");
      textDiv.style.color = `#${titleStyle.font_color}`;
      textDiv.style.fontFamily = titleStyle.font_family || "inherit";
    });
  }

  // --- [수정] 2. notice를 버튼 컨테이너 위로 렌더링 ---
  if (data.notice) {
    const noticeContainer = document.createElement("div");
    parentElement.appendChild(noticeContainer);

    // 컨테이너에 위치를 잡고, 계산된 bottom 값을 적용합니다.
    applyElementPosition(noticeContainer, data.notice);
    noticeContainer.style.width = "100%";
    noticeContainer.style.bottom = `${accumulatedBottom}px`; // 버튼 높이만큼 위로 올림

    // 내부 텍스트 스타일링
    const textStyle = data.notice.text;
    noticeContainer.innerHTML = (textStyle.text || "").replaceAll(
      "[br]",
      "<br>"
    );
    noticeContainer.style.textAlign = textStyle.text_align || "center";
    noticeContainer.style.fontSize = `${textStyle.font_size}px`;
    noticeContainer.style.fontWeight = String(
      textStyle.font_weight || "normal"
    );
    noticeContainer.style.color = `#${textStyle.font_color}`;
    noticeContainer.style.fontFamily = textStyle.font_family || "inherit";
    noticeContainer.style.lineHeight = `${data.notice.height}px`;
  }
};

const createCardGrid = (
  selectTypeData: SelectypePageSettings["selectype"],
  unitsData: UnitArrayType,
  parentElement: HTMLElement
) => {
  // 1. 그리드 컨테이너(scrollarea) 생성
  const scrollArea = document.createElement("div");
  scrollArea.id = "scrollArea";
  parentElement.appendChild(scrollArea);

  // 2. 컨테이너 위치 및 기본 스타일 설정
  applyElementPosition(scrollArea, selectTypeData.scrollarea);
  scrollArea.style.overflow = "auto"; // 콘텐츠가 많으면 스크롤
  scrollArea.style.display = "grid";
  scrollArea.style.maxWidth = `${selectTypeData.scrollarea.maxwidth}px`;
  scrollArea.style.maxHeight = `${selectTypeData.scrollarea.maxheight}px`;

  // 3. 그리드 레이아웃 설정
  const cardStyle = selectTypeData.unit_type_outer_frame;
  scrollArea.style.gridTemplateColumns = `repeat(auto-fill, ${cardStyle.width}px)`; // 화면 크기에 맞춰 카드 자동 정렬
  scrollArea.style.gap = `${selectTypeData.scrollarea.vertical_spacing}px ${selectTypeData.scrollarea.horizontal_spacing}px`;
  scrollArea.style.justifyContent = "center"; // 그리드 중앙 정렬
  scrollArea.style.paddingTop = "2px";

  // 4. unitsData를 순회하며 각 유닛의 카드를 생성
  unitsData.units.forEach((unit, index) => {
    // 5. 개별 카드(unit_type_outer_frame) 생성
    const card = document.createElement("div");
    scrollArea.appendChild(card);
    card.id = `card_${index + 1}`;

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
    const typeNameFrameDiv = document.createElement("div");
    card.appendChild(typeNameFrameDiv);
    applyElementPosition(typeNameFrameDiv, selectTypeData.type_name_frame);
    typeNameFrameDiv.style.display = "flex";
    typeNameFrameDiv.style.alignItems = "center";

    typeNameFrameDiv.style.color = `#${selectTypeData.type_name_frame.value.normal.font_color}`;

    const typeNameFrame = document.createElement("div");
    typeNameFrameDiv.appendChild(typeNameFrame);
    typeNameFrame.innerHTML = `${(unit.text || "").replaceAll("[br]", "<br>")}`; // unitsData에서 실제 타입 이름 가져오기
    typeNameFrame.style.paddingRight = "4px";
    typeNameFrame.style.fontSize = `${selectTypeData.type_name_frame.value.normal.font_size}px`;
    typeNameFrame.style.fontWeight = String(
      selectTypeData.type_name_frame.value.normal.font_weight || "normal"
    );
    typeNameFrame.style.fontFamily =
      selectTypeData.type_name_frame.value.font_family || "inherit";

    const typeTitleFrame = document.createElement("div");
    typeNameFrameDiv.appendChild(typeTitleFrame);

    typeTitleFrame.innerHTML = `Type`; // unitsData에서 실제 타입 이름 가져오기
    typeTitleFrame.style.fontSize = `${selectTypeData.type_name_frame.title.normal.font_size}px`;
    typeTitleFrame.style.fontWeight = String(
      selectTypeData.type_name_frame.title.normal.font_weight || "normal"
    );
    typeTitleFrame.style.fontFamily =
      selectTypeData.type_name_frame.title.font_family || "inherit";

    // (이하 type_name_frame에 대한 폰트 등 상세 스타일 적용)

    // 평면도 이미지
    const floorPlanFrame = document.createElement("div");
    card.appendChild(floorPlanFrame);
    applyElementPosition(floorPlanFrame, selectTypeData.floor_plan);

    floorPlanFrame.style.backgroundImage = `url("/estimate/${unit.type}_0_opt_base.png")`; // unit 데이터에서 평면도 이미지 경로 가져오기
    floorPlanFrame.style.backgroundSize = "120% auto"; // 이미지가 꽉차게
    floorPlanFrame.style.backgroundRepeat = "no-repeat"; // 이미지가 반복되지 않게 함
    floorPlanFrame.style.backgroundPosition = "center"; // 이미지를 가운데로 정렬

    // 전용 면적
    const exclusiveAreaFrame = document.createElement("div");
    card.appendChild(exclusiveAreaFrame);
    applyElementPosition(
      exclusiveAreaFrame,
      selectTypeData.exclusive_private_area_frame
    );
    exclusiveAreaFrame.innerHTML = `전용면적: ${unit.exclusive_private_area} ㎡`;
    exclusiveAreaFrame.style.fontSize = `${selectTypeData.exclusive_private_area_frame.font_size}px`;
    exclusiveAreaFrame.style.fontWeight = String(
      selectTypeData.exclusive_private_area_frame.font_weight || "normal"
    );
    exclusiveAreaFrame.style.fontFamily =
      selectTypeData.exclusive_private_area_frame.font_family || "inherit";
    exclusiveAreaFrame.style.color = `#${selectTypeData.exclusive_private_area_frame.font_color}`;

    // (이하 exclusive_private_area_frame에 대한 폰트 등 상세 스타일 적용)

    // 분양 면적
    const supplyAreaFrame = document.createElement("div");
    card.appendChild(supplyAreaFrame);
    applyElementPosition(supplyAreaFrame, selectTypeData.supply_area_frame);
    supplyAreaFrame.innerHTML = `분양면적: ${unit.supply_area} ㎡`;
    supplyAreaFrame.style.fontSize = `${selectTypeData.supply_area_frame.font_size}px`;
    supplyAreaFrame.style.fontWeight = String(
      selectTypeData.supply_area_frame.font_weight || "normal"
    );
    supplyAreaFrame.style.fontFamily =
      selectTypeData.supply_area_frame.font_family || "inherit";
    supplyAreaFrame.style.color = `#${selectTypeData.supply_area_frame.font_color}`;

    // (이하 supply_area_frame에 대한 폰트 등 상세 스타일 적용)

    // 마우스 호버 효과 (추가)
    card.onmouseenter = () => {
      card.style.backgroundColor = hexToRgba(
        cardStyle.hovered.bgcolor,
        cardStyle.hovered.bgalpha
      );
      card.style.outline = `${
        selectTypeData.unit_type_outer_frame.hovered.bgborder.top
      }px solid ${hexToRgba(
        selectTypeData.unit_type_outer_frame.hovered.bgborder.color,
        selectTypeData.unit_type_outer_frame.hovered.bgborder.alpha
      )}`;
      typeNameFrameDiv.style.color = `#${selectTypeData.type_name_frame.value.hovered.font_color}`;
      floorPlanFrame.style.backgroundSize = "130% auto";
    };
    card.onmouseleave = () => {
      card.style.backgroundColor = hexToRgba(
        cardStyle.normal.bgcolor,
        cardStyle.normal.bgalpha
      );
      card.style.outline = `${
        selectTypeData.unit_type_outer_frame.normal.bgborder.top
      }px solid ${hexToRgba(
        selectTypeData.unit_type_outer_frame.normal.bgborder.color,
        selectTypeData.unit_type_outer_frame.normal.bgborder.alpha
      )}`;
      typeNameFrameDiv.style.color = `#${selectTypeData.type_name_frame.value.normal.font_color}`;
      floorPlanFrame.style.backgroundSize = "120% auto";
    };
  });
};

const typeSelectUi = (
  selectTypeData: SelectJsonType,
  unitsData: UnitArrayType
) => {
  // console.log("selectTypeData", selectTypeData, unitsData);
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

  const loginButton = document.getElementById("card_1") as HTMLButtonElement;

  loginButton.addEventListener("click", () => {
    // 로그인 검증 로직 성공 후 이동
    window.location.href = "/?pid=bongmyeong&page=estimate/tour";
  });
};

export default typeSelectUi;
