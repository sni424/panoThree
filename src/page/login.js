// login.js
import "./login.css";

/**
 * 16진수 색상 코드를 rgba 문자열로 변환하는 헬퍼 함수
 * @param {string} hex - "#" 없는 6자리 16진수 색상 코드 (예: "FFFFFF")
 * @param {number} alpha - 투명도 (0.0 ~ 1.0)
 * @returns {string} - "rgba(255, 255, 255, 0.5)" 형식의 문자열
 */
function hexToRgba(hex, alpha) {
  if (!hex) return "transparent";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * JSON 데이터를 기반으로 DOM 요소를 재귀적으로 생성하고 스타일을 적용하는 함수
 * @param {object} data - 요소의 속성을 담은 JSON 객체
 * @param {HTMLElement} parentElement - 생성된 요소를 추가할 부모 DOM 요소
 * @param {string} [elementType='div'] - 생성할 HTML 요소의 타입 (예: 'div', 'input')
 */
function createElementFromData(data, parentElement, elementType = "div") {
  // 데이터가 없으면 아무것도 생성하지 않음
  if (!data) return;

  // 1. 요소 생성 (input 태그 등 다른 타입도 가능하도록)
  const element = document.createElement(elementType);
  parentElement.appendChild(element);

  // 2. 기본 스타일 및 위치 설정
  element.style.position = "absolute";
  if (String(data.width).includes("%")) {
    element.style.width = data.width;
  } else {
    element.style.width = `${data.width}px`;
  }
  if (String(data.height).includes("%")) {
    element.style.height = data.height;
  } else {
    element.style.height = `${data.height}px`;
  }
  // 퍼센트(%) 좌표는 top/left로, 픽셀(px) 좌표는 transform으로 처리
  if (String(data.x).includes("%") || String(data.y).includes("%")) {
    element.style.left = data.x;
    element.style.top = data.y;
  } else {
    element.style.transform = `translate(${data.x || 0}px, ${data.y || 0}px)`;
  }
  // 3. 텍스트 처리 ([br] -> <br>)
  if (typeof data.text === "string") {
    element.innerHTML = String(data.text).replaceAll("[br]", "<br>");
  }

  // 4. 폰트 스타일 적용
  if (data.font_size) element.style.fontSize = `${data.font_size}px`;
  if (data.font_weight) element.style.fontWeight = data.font_weight;
  if (data.font_color) element.style.color = `#${data.font_color}`;
  if (data.text_align) element.style.textAlign = data.text_align;
  if (data.font_family) element.style.fontFamily = data.font_family;

  // 5. 배경 스타일 적용 (opacity 대신 rgba 사용)
  if (data.bgcolor) {
    element.style.backgroundColor = hexToRgba(
      data.bgcolor,
      data.bgalpha ?? 1.0
    );
  }

  // 6. 테두리 및 모서리 둥글기 적용
  if (data.bgborder) {
    element.style.border = `${data.bgborder.top}px solid ${hexToRgba(
      data.bgborder.color,
      data.bgborder.alpha
    )}`;
  }
  if (data.bgroundedge) {
    element.style.borderRadius = `${data.bgroundedge.lefttop}px`;
  }
  console.log("data", data);

  if (data.invisible) {
  }

  // 7. Input 관련 속성 처리
  if (elementType === "input" && data.editable) {
    element.style.fontFamily = data.editable.font_family;
    element.style.fontWeight = data.editable.font_weight;
    element.style.fontSize = data.editable.font_size;
    element.style.color = `#${data.editable.font_color}`;
    element.placeholder = data.editable.default || "";
    element.style.paddingTop = `${data.editable.padding?.top || 0}px`;
    element.style.paddingBottom = `${data.editable.padding?.bottom || 0}px`;
    element.style.paddingLeft = `${data.editable.padding?.left || 0}px`;
    element.style.paddingRight = `${data.editable.padding?.right || 0}px`;
    element.style.boxSizing = "border-box"; // 패딩이 너비에 포함되도록 설정
  }

  // 8. 재귀 호출: 자식 요소들이 있으면 자식 요소들도 생성
  if (data.title) createElementFromData(data.title, element);
  if (data.textbox) {
    // editable 객체에 textbox의 다른 스타일 상속
    const textboxData = { ...data.textbox };
    createElementFromData(textboxData, element, "input");
  }

  if (typeof data.text === "object") {
    // 로그인 버튼 텍스트 처리
    const textSpan = document.createElement("p");
    textSpan.style.position = "relative";
    textSpan.style.zIndex = "1";
    textSpan.style.width = "100%";
    textSpan.style.height = "100%";
    textSpan.style.display = "flex";
    textSpan.style.justifyContent = "center";
    textSpan.style.alignItems = "center";
    element.style.display = "flex";
    element.style.justifyContent = "center";
    element.style.alignItems = "center";
    element.appendChild(textSpan);
    createElementFromData(data.text, textSpan);
  }
}

/**
 * 메인 로그인 페이지 렌더링 함수
 * @param {object} loginData - login_page_settings.login 객체
 */
const login = (loginData) => {
  const { height, bgimage, input } = loginData;

  const parentDiv = document.getElementById("container");
  if (!parentDiv) {
    console.error("id가 'container'인 요소를 찾을 수 없습니다.");
    return;
  }

  // --- 기본 레이아웃 생성 ---
  const container = document.createElement("div");
  container.id = "login_container";
  container.style.height = height;
  container.style.backgroundImage = `url("${bgimage.url.desktop}")`;
  container.style.position = "relative"; // 모든 absolute의 최상위 기준점
  parentDiv.appendChild(container);

  const inputDiv = document.createElement("div");
  inputDiv.id = "input_div";
  inputDiv.style.width = `${input.width}px`;
  inputDiv.style.height = input.height;
  inputDiv.style.backgroundColor = hexToRgba(input.bgcolor, input.bgalpha);
  inputDiv.style.position = "absolute"; // container를 기준으로 위치
  inputDiv.style.left = input.x + "px"; // JSON에 align/edge가 없으므로 x/y를 직접 사용
  inputDiv.style.top = input.y + "px";
  container.appendChild(inputDiv);

  const innerDiv = document.createElement("div");
  innerDiv.id = "inner_div";
  innerDiv.style.position = "absolute";
  innerDiv.style.left = "50%";
  innerDiv.style.top = "50%";
  innerDiv.style.transform = `translate(-50%, -50%) translate(${input.inner.x}px, ${input.inner.y}px)`;
  innerDiv.style.width = input.inner.width;
  innerDiv.style.aspectRatio = input.inner.ratio;
  inputDiv.appendChild(innerDiv);

  // --- 재귀 함수를 이용해 innerDiv 내부의 모든 요소들 생성 ---
  const innerElements = input.inner;
  createElementFromData(innerElements.title, innerDiv);
  createElementFromData(innerElements.identification, innerDiv);
  createElementFromData(innerElements.password, innerDiv);
  createElementFromData(innerElements.warning, innerDiv);
  createElementFromData(innerElements.button, innerDiv);

  // --- 장식 요소 생성 ---
  input.decoration.forEach((decoData) => {
    const decoElement = document.createElement("div");
    decoElement.style.position = "absolute";
    decoElement.style.transform = `translate(${decoData.x}px, ${decoData.y}px)`;
    decoElement.style.width = `${decoData.width}px`;
    decoElement.style.height = `auto`;
    decoElement.style.aspectRatio = input.inner.ratio;
    decoElement.style.backgroundImage = `url("${decoData.url.desktop}")`;
    decoElement.style.backgroundSize = "contain";
    decoElement.style.backgroundRepeat = "no-repeat";
    decoElement.style.zIndex = 15;
    inputDiv.appendChild(decoElement);
  });
};

export default login;
