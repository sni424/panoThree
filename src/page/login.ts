// login.js
import type { LoginData, TextData } from "@/type";
import "../css/login.css";

/**
 * 16진수 색상 코드를 rgba 문자열로 변환하는 헬퍼 함수
 * @param {string} hex - "#" 없는 6자리 16진수 색상 코드 (예: "FFFFFF")
 * @param {number} alpha - 투명도 (0.0 ~ 1.0)
 * @returns {string} - "rgba(255, 255, 255, 0.5)" 형식의 문자열
 */
function hexToRgba(hex?: string, alpha: number = 1): string {
  if (!hex) return "transparent";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * JSON 기반으로 DOM 생성
 */
function createElementFromData<T extends TextData>(
  data: T | null | undefined,
  parentElement: HTMLElement,
  elementType: keyof HTMLElementTagNameMap = "div"
) {
  if (!data) return;

  const element = document.createElement(elementType);
  parentElement.appendChild(element);

  // 스타일 적용
  element.style.position = "absolute";
  if (data.width)
    element.style.width = String(data.width).includes("%")
      ? String(data.width)
      : `${data.width}px`;
  if (data.height)
    element.style.height = String(data.height).includes("%")
      ? String(data.height)
      : `${data.height}px`;

  if (data.x || data.y) {
    if (String(data.x).includes("%") || String(data.y).includes("%")) {
      element.style.left = data.x + "";
      element.style.top = data.y + "";
    } else {
      element.style.transform = `translate(${data.x || 0}px, ${data.y || 0}px)`;
    }
  }

  if (typeof data.text === "string") {
    element.innerHTML = data.text.replaceAll("[br]", "<br>");
  }

  if (data.font_size) element.style.fontSize = `${data.font_size}px`;
  if (data.font_weight) element.style.fontWeight = data.font_weight;
  if (data.font_color) element.style.color = `#${data.font_color}`;
  if (data.text_align) element.style.textAlign = data.text_align;
  if (data.font_family) element.style.fontFamily = data.font_family;

  if (data.bgcolor)
    element.style.backgroundColor = hexToRgba(data.bgcolor, data.bgalpha);

  if (data.bgborder) {
    element.style.border = `${data.bgborder.top}px solid ${hexToRgba(
      data.bgborder.color,
      data.bgborder.alpha
    )}`;
  }
  if (data.bgroundedge) {
    element.style.borderRadius = `${data.bgroundedge.lefttop}px`;
  }

  if (elementType === "input" && data.editable) {
    const inputEl = element as HTMLInputElement; // 타입 단언
    inputEl.placeholder = data.editable.default || "";

    // 스타일 적용
    inputEl.style.fontFamily = data.editable.font_family;
    inputEl.style.fontWeight = data.editable.font_weight;
    inputEl.style.fontSize = `${data.editable.font_size}px`;
    inputEl.style.color = `#${data.editable.font_color}`;
    inputEl.style.paddingTop = `${data.editable.padding?.top || 0}px`;
    inputEl.style.paddingBottom = `${data.editable.padding?.bottom || 0}px`;
    inputEl.style.paddingLeft = `${data.editable.padding?.left || 0}px`;
    inputEl.style.paddingRight = `${data.editable.padding?.right || 0}px`;
    inputEl.style.boxSizing = "border-box";
  }

  // 재귀 호출
  if (data.title) createElementFromData(data.title, element);
  if (data.textbox) createElementFromData(data.textbox, element, "input");
  if (typeof data.text === "object") {
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

export const login = (loginData: LoginData) => {
  const parentDiv = document.getElementById("container");
  if (!parentDiv) return;

  const container = document.createElement("div");
  container.id = "login_container";
  container.style.height = String(loginData.height);
  container.style.backgroundImage = `url("${loginData.bgimage.url.desktop}")`;
  container.style.position = "relative";
  parentDiv.appendChild(container);

  const inputDiv = document.createElement("div");
  inputDiv.id = "input_div";
  inputDiv.style.width = `${loginData.input.width}px`;
  inputDiv.style.height = String(loginData.input.height);
  inputDiv.style.backgroundColor = hexToRgba(
    loginData.input.bgcolor,
    loginData.input.bgalpha
  );
  inputDiv.style.position = "absolute";
  inputDiv.style.left = String(loginData.input.x);
  inputDiv.style.top = String(loginData.input.y);
  container.appendChild(inputDiv);

  const innerDiv = document.createElement("div");
  innerDiv.id = "inner_div";
  innerDiv.style.position = "absolute";
  innerDiv.style.left = "50%";
  innerDiv.style.top = "50%";
  innerDiv.style.transform = `translate(-50%, -50%) translate(${loginData.input.inner.x}px, ${loginData.input.inner.y}px)`;
  innerDiv.style.width = String(loginData.input.inner.width);
  innerDiv.style.aspectRatio = String(loginData.input.inner.ratio || 1);
  inputDiv.appendChild(innerDiv);

  createElementFromData(loginData.input.inner.title, innerDiv);
  createElementFromData(loginData.input.inner.identification, innerDiv);
  createElementFromData(loginData.input.inner.password, innerDiv);
  createElementFromData(loginData.input.inner.warning, innerDiv);
  createElementFromData(loginData.input.inner.button, innerDiv);

  // 장식 요소
  loginData.input.decoration.forEach((deco) => {
    const decoEl = document.createElement("div");
    decoEl.style.position = "absolute";
    decoEl.style.transform = `translate(${deco.x}px, ${deco.y}px)`;
    decoEl.style.width = `${deco.width}px`;
    decoEl.style.height = "auto";
    decoEl.style.aspectRatio = String(loginData.input.inner.ratio || 1);
    decoEl.style.backgroundImage = `url("${deco.url.desktop}")`;
    decoEl.style.backgroundSize = "contain";
    decoEl.style.backgroundRepeat = "no-repeat";
    decoEl.style.zIndex = "15";
    inputDiv.appendChild(decoEl);
  });
};

export default login;
