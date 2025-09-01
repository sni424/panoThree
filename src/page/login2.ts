/**
 * 타입 정의 (실제 프로젝트에서는 @/type 에서 가져옵니다)
 * @typedef {any} TextData
 * @typedef {any} LoginPageSettings
 */
import type { LoginData, LoginPageSettings, TextData } from "@/type";
import "../css/login.css";

// --- 유틸리티 함수 ---

/**
 * 16진수 색상 코드를 rgba 문자열로 변환합니다.
 */
function hexToRgba(hex?: string, alpha: number = 1): string {
  if (!hex) return "transparent";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 요소의 위치와 크기를 설정하는 헬퍼 함수입니다.
 */
const applyElementPosition = (
  element: HTMLElement,
  data: TextData,
  position: string = "left"
) => {
  element.style.position = "absolute";

  // 크기 설정
  if (data.width) {
    element.style.width = String(data.width).includes("%")
      ? String(data.width)
      : `${data.width}px`;
  }
  if (data.height) {
    element.style.height = String(data.height).includes("%")
      ? String(data.height)
      : `${data.height}px`;
  }

  // 위치 설정
  if (data.x != null || data.y != null) {
    if (String(data.x).includes("%") || String(data.y).includes("%")) {
      if (data.x != null) element.style.left = String(data.x);
      if (data.y != null) element.style.top = String(data.y);
    } else {
      if (position === "center") {
        element.style.left = "50%";
        element.style.top = "50%";
        element.style.transform = `translate(-50%, -50%) translate(${
          data.x || 0
        }px, ${data.y || 0}px)`;
      } else {
        element.style.transform = `translate(${data.x || 0}px, ${
          data.y || 0
        }px)`;
      }
    }
  }
};

// --- 핵심 렌더링 함수 (원본 로직과 동일) ---

/**
 * 데이터 객체를 기반으로 DOM 요소를 재귀적으로 생성하고 스타일을 적용합니다.
 */
const renderTree = <T extends TextData>(
  data: T | null | undefined,
  parentElement: HTMLElement,
  elementType: keyof HTMLElementTagNameMap = "div"
) => {
  if (!data) return;
  console.log("data", data);

  // 'login' 최상위 컨테이너
  if (data.login) {
    const element = document.createElement(elementType);
    parentElement.appendChild(element);
    element.id = "login_container";
    element.style.position = "relative"; // 기준점
    applyElementPosition(element, data.login);
    element.style.backgroundImage = `url("${data.login.bgimage.url.desktop}")`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    renderTree(data.login, element);
  }

  // 'input' 컨테이너
  if (data.input) {
    const element = document.createElement(elementType);
    parentElement.appendChild(element);
    element.id = "login_input";
    applyElementPosition(element, data.input);
    element.style.backgroundColor = hexToRgba(
      data.input.bgcolor,
      data.input.bgalpha
    );
    renderTree(data.input, element);
  }

  // 'inner' 컨테이너
  if (data.inner) {
    const element = document.createElement(elementType);
    parentElement.appendChild(element);
    element.id = "login_inner";
    applyElementPosition(element, data.inner, data.inner.align);
    if (data.inner.ratio) element.style.aspectRatio = String(data.inner.ratio);
    renderTree(data.inner, element);
  }

  // 'button' 컴포넌트
  if (data.button) {
    const element = document.createElement(elementType);
    parentElement.appendChild(element);
    element.id = "login_button";
    applyElementPosition(element, data.button);
    element.style.backgroundColor = hexToRgba(
      data.button.bgcolor,
      data.button.bgalpha
    );

    if (data.button.text) {
      const textData = data.button.text as TextData;
      element.innerHTML = (textData.text || "").replaceAll("[br]", "<br>");
      element.style.display = "flex";
      element.style.justifyContent = "center";
      element.style.alignItems =
        textData.text_align === "center" ? "center" : "flex-start";
      element.style.fontSize = `${textData.font_size}px`;
      element.style.fontWeight = textData.font_weight || "normal";
      element.style.color = `#${textData.font_color}`;
      element.style.fontFamily = textData.font_family || "inherit";
    }
    renderTree(data.button, element);
  }

  // 'identification' 복합 컴포넌트
  if (data.identification) {
    const idContainer = document.createElement(elementType);
    parentElement.appendChild(idContainer);
    idContainer.id = "login_identification";
    applyElementPosition(
      idContainer,
      data.identification,
      data.identification.align
    );
    if (data.inner?.ratio)
      idContainer.style.aspectRatio = String(data.inner.ratio);

    if (data.identification.title) {
      const titleEl = document.createElement("div");
      idContainer.appendChild(titleEl);
      applyElementPosition(titleEl, data.identification.title);
      titleEl.innerHTML = data.identification.title.text.replaceAll(
        "[br]",
        "<br>"
      );
      titleEl.style.fontSize = `${data.identification.title.font_size}px`;
      titleEl.style.fontWeight =
        data.identification.title.font_weight || "normal";
      titleEl.style.color = `#${data.identification.title.font_color}`;
      titleEl.style.fontFamily =
        data.identification.title.font_family || "inherit";
    }

    if (data.identification.textbox) {
      const textbox = data.identification.textbox;
      const textboxDiv = document.createElement("div");
      idContainer.appendChild(textboxDiv);
      textboxDiv.id = "login_identification_textbox";
      applyElementPosition(textboxDiv, textbox);
      textboxDiv.style.backgroundColor = hexToRgba(
        textbox.bgcolor,
        textbox.bgalpha
      );
      if (textbox.bgborder) {
        textboxDiv.style.border = `${textbox.bgborder.top}px solid ${hexToRgba(
          textbox.bgborder.color,
          textbox.bgborder.alpha
        )}`;
      }
      if (textbox.bgroundedge) {
        textboxDiv.style.borderRadius = `${textbox.bgroundedge.lefttop}px ${textbox.bgroundedge.righttop}px ${textbox.bgroundedge.rightbottom}px ${textbox.bgroundedge.leftbottom}px`;
      }

      if (textbox.editable) {
        const input = document.createElement("input");
        textboxDiv.appendChild(input);
        applyElementPosition(input, textbox.editable);
        input.placeholder = textbox.editable.default || "";
        input.id = "login_identification_input";
        if (textbox.editable.padding) {
          input.style.padding = `${textbox.editable.padding.top}px ${textbox.editable.padding.right}px ${textbox.editable.padding.bottom}px ${textbox.editable.padding.left}px`;
        }
        input.style.backgroundColor = hexToRgba(
          textbox.editable.bgcolor,
          textbox.editable.bgalpha
        );
        input.style.fontSize = `${textbox.editable.font_size}px`;
        input.style.fontWeight = textbox.editable.font_weight || "normal";
        input.style.color = `#${textbox.editable.font_color}`;
        input.style.fontFamily = textbox.editable.font_family || "inherit";
        input.style.boxSizing = "border-box";
        input.style.border = "none";
        input.style.outline = "none";
      }
    }
  }

  if (data.password) {
    const element = document.createElement(elementType);
    parentElement.appendChild(element);
    element.id = "login_password";
    applyElementPosition(element, data.password, data.password.align);
    if (data.inner?.ratio) element.style.aspectRatio = String(data.inner.ratio);

    if (data.password.title) {
      const titleEl = document.createElement("div");
      element.appendChild(titleEl);
      applyElementPosition(titleEl, data.password.title);
      titleEl.innerHTML = data.password.title.text
        ? data.password.title.text.replaceAll("[br]", "<br>")
        : "";
      titleEl.style.fontSize = `${data.password.title.font_size}px`;
      titleEl.style.fontWeight = data.password.title.font_weight || "normal";
      titleEl.style.color = `#${data.password.title.font_color}`;
      titleEl.style.fontFamily = data.password.title.font_family || "inherit";
    }

    if (data.password.textbox) {
      const textbox = data.password.textbox;
      const textboxDiv = document.createElement("div");
      element.appendChild(textboxDiv);
      textboxDiv.id = "login_password_textbox";
      applyElementPosition(textboxDiv, textbox);
      textboxDiv.style.backgroundColor = hexToRgba(
        textbox.bgcolor,
        textbox.bgalpha
      );
      if (textbox.bgborder) {
        textboxDiv.style.border = `${textbox.bgborder.top}px solid ${hexToRgba(
          textbox.bgborder.color,
          textbox.bgborder.alpha
        )}`;
      }
      if (textbox.bgroundedge) {
        textboxDiv.style.borderRadius = `${textbox.bgroundedge.lefttop}px ${textbox.bgroundedge.righttop}px ${textbox.bgroundedge.rightbottom}px ${textbox.bgroundedge.leftbottom}px`;
      }

      if (textbox.editable) {
        const input = document.createElement("input");
        textboxDiv.appendChild(input);
        applyElementPosition(input, textbox.editable);
        input.placeholder = textbox.editable.default || "";
        input.id = "login_password_input";
        if (textbox.editable.padding) {
          input.style.padding = `${textbox.editable.padding.top}px ${textbox.editable.padding.right}px ${textbox.editable.padding.bottom}px ${textbox.editable.padding.left}px`;
        }
        input.style.backgroundColor = hexToRgba(
          textbox.editable.bgcolor,
          textbox.editable.bgalpha
        );
        input.style.fontSize = `${textbox.editable.font_size}px`;
        input.style.fontWeight = textbox.editable.font_weight || "normal";
        input.style.color = `#${textbox.editable.font_color}`;
        input.style.fontFamily = textbox.editable.font_family || "inherit";
        input.style.boxSizing = "border-box";
        input.style.border = "none";
        input.style.outline = "none";
      }
    }
  }

  // 'title' 텍스트
  if (data.title) {
    const element = document.createElement(elementType);
    parentElement.appendChild(element);
    element.id = "login_title";
    applyElementPosition(element, data.title);
    element.innerHTML = data.title.text
      ? data.title.text.replaceAll("[br]", "<br>")
      : "";
    element.style.fontSize = `${data.title.font_size}px`;
    element.style.fontWeight = data.title.font_weight || "normal";
    element.style.color = `#${data.title.font_color}`;
    element.style.fontFamily = data.title.font_family || "inherit";
    renderTree(data.title, element);
  }

  // 'decoration' 요소들
  if (data.decoration) {
    data.decoration.forEach((deco: TextData) => {
      const decoEl = document.createElement("div");
      parentElement.appendChild(decoEl);
      decoEl.style.position = "absolute";
      decoEl.style.transform = `translate(${deco.x}px, ${deco.y}px)`;
      decoEl.style.width = `${deco.width}px`;
      decoEl.style.height = "auto";
      if (data.inner?.ratio)
        decoEl.style.aspectRatio = String(data.inner.ratio);
      decoEl.style.backgroundImage = `url("${deco.url.desktop}")`;
      decoEl.style.backgroundSize = "contain";
      decoEl.style.backgroundRepeat = "no-repeat";
      decoEl.style.zIndex = "15";
    });
  }
};

// --- 메인 함수 ---
export const login2 = (loginData: LoginPageSettings) => {
  const parentDiv = document.getElementById("container");
  if (!parentDiv) {
    console.error("Container #container not found.");
    return;
  }
  parentDiv.innerHTML = ""; // 컨테이너 초기화

  // 데이터 구조의 최상위부터 렌더링 시작
  renderTree(loginData.login_page_settings, parentDiv);
};

export default login2;
