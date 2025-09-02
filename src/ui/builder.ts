// --- Low-level Utilities ---

function hexToRgba(hex?: string, alpha: number = 1): string {
  if (!hex) return "transparent";
  if (hex.startsWith("#")) hex = hex.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyPosition(element: HTMLElement, data: any) {
  element.style.position = "absolute";

  if (data.width) {
    element.style.width = String(data.width).includes("%")
      ? String(data.width)
      : `${data.width}px`;
  }
  if (data.height) {
    element.style.height = String(data.height).includes("%")
      ? String(data.height)
      : data.height === "prop"
      ? "auto"
      : `${data.height}px`;
  }

  if (data.align === "center" && data.edge === "center") {
    element.style.left = "50%";
    element.style.top = "50%";
    element.style.transform = `translate(-50%, -50%) translate(${data.x || 0}px, ${data.y || 0}px)`;
  } else {
    if (data.x != null) element.style.left = String(data.x);
    if (data.y != null) element.style.top = String(data.y);
  }
}

function applyStyles(element: HTMLElement, styles: any) {
    if (!styles) return;
    if (styles.bgcolor) element.style.backgroundColor = hexToRgba(styles.bgcolor, styles.bgalpha ?? 1);
    if (styles.bgimage?.url?.desktop) {
        element.style.backgroundImage = `url("${styles.bgimage.url.desktop}")`;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
    }
    if (styles.bgborder) element.style.border = `${styles.bgborder.top}px solid ${hexToRgba(styles.bgborder.color, styles.bgborder.alpha)}`;
    if (styles.bgroundedge) {
        const edge = styles.bgroundedge;
        if(typeof edge === 'object'){
             element.style.borderRadius = `${edge.lefttop}px ${edge.righttop}px ${edge.rightbottom}px ${edge.leftbottom}px`;
        } else {
            element.style.borderRadius = `${edge}px`;
        }
    }
    if (styles.font_family) element.style.fontFamily = styles.font_family;
    if (styles.font_size) element.style.fontSize = `${styles.font_size}px`;
    if (styles.font_weight) element.style.fontWeight = styles.font_weight;
    if (styles.font_color) element.style.color = `#${styles.font_color}`;
    if (styles.text_align) element.style.textAlign = styles.text_align;
    if (styles.cursor) element.style.cursor = styles.cursor;
    if (styles.ratio) element.style.aspectRatio = String(styles.ratio);
}

// --- Component Factories ---

function createTextComponent(data: any, id: string): HTMLElement {
    const el = document.createElement('div');
    el.id = id;
    applyPosition(el, data);
    applyStyles(el, data);
    el.innerHTML = (data.text || "").replaceAll("[br]", "<br>");
    return el;
}

function createInputGroup(data: any, id: string): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.id = id;
    applyPosition(wrapper, data);
    applyStyles(wrapper, data);

    if (data.title) {
        const titleEl = createTextComponent(data.title, "");
        wrapper.appendChild(titleEl);
    }

    if (data.textbox) {
        const textbox = data.textbox;
        const textboxDiv = document.createElement('div');
        applyPosition(textboxDiv, textbox);
        applyStyles(textboxDiv, textbox);
        wrapper.appendChild(textboxDiv);

        if (textbox.editable) {
            const input = document.createElement('input');
            input.id = `${id}_input`;
            applyPosition(input, textbox.editable);
            applyStyles(input, textbox.editable);
            input.placeholder = textbox.editable.default || "";
            if (textbox.editable.padding) {
                input.style.padding = `${textbox.editable.padding.top}px ${textbox.editable.padding.right}px ${textbox.editable.padding.bottom}px ${textbox.editable.padding.left}px`;
            }
            input.style.boxSizing = "border-box";
            input.style.border = "none";
            input.style.outline = "none";
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.backgroundColor = 'transparent';
            textboxDiv.appendChild(input);
        }
    }
    return wrapper;
}

function createButton(data: any, id: string): HTMLElement {
    const el = createTextComponent(data.text, id);
    applyPosition(el, data);
    applyStyles(el, data);
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
    return el;
}

function createDecorations(data: any[], parent: HTMLElement) {
    data.forEach((deco) => {
        const decoEl = document.createElement('div');
        parent.appendChild(decoEl);
        applyPosition(decoEl, deco);
        applyStyles(decoEl, deco);
        decoEl.style.backgroundImage = `url("${deco.url.desktop}")`;
        decoEl.style.backgroundSize = 'contain';
        decoEl.style.backgroundRepeat = 'no-repeat';
        decoEl.style.zIndex = '15';
    });
}

// --- UI Assembly ---

export function buildLoginPage(settings: any): { [id: string]: HTMLElement } {
    const elements: { [id: string]: HTMLElement } = {};
    const data = settings.login;

    // 1. Create inner components
    const innerData = data.input.inner;
    elements.title = createTextComponent(innerData.title, 'login_title');
    elements.identification = createInputGroup(innerData.identification, 'login_identification');
    elements.password = createInputGroup(innerData.password, 'login_password');
    elements.warning = createTextComponent(innerData.warning, 'login_warning');
    elements.button = createButton(innerData.button, 'login_button');
    elements.loginButton = elements.button; // alias

    // 2. Create containers and assemble
    const inner = document.createElement('div');
    inner.id = 'login_inner';
    inner.style.position = 'relative';
    applyPosition(inner, innerData);
    applyStyles(inner, innerData);
    inner.append(elements.title, elements.identification, elements.password, elements.warning, elements.button);

    const inputContainer = document.createElement('div');
    inputContainer.id = 'login_input';
    inputContainer.style.position = 'relative';
    applyPosition(inputContainer, data.input);
    applyStyles(inputContainer, data.input);
    inputContainer.appendChild(inner);

    if (data.input.decoration) {
        createDecorations(data.input.decoration, inputContainer);
    }

    const loginContainer = document.createElement('div');
    loginContainer.id = 'login_container';
    loginContainer.style.position = 'relative';
    applyPosition(loginContainer, data);
    applyStyles(loginContainer, data);
    loginContainer.appendChild(inputContainer);

    elements.root = loginContainer;

    return elements;
}