import * as THREE from "three";

export type LoginPageSettings = {
  login_page_settings: {
    login: LoginData;
  };
};

export type texturePaths = {
  lowQuality: string[];
  highQuality: string[];
};

//
export type MoveSpotConfig = {
  radius: number;
  segments: number;
};

export type DomMoveSpot = {
  id: string;
  position: THREE.Vector3;
  element: HTMLDivElement;
  visible: boolean;
};

export type HotSpotConfig = {
  radius: number;
  segments: number;
};

export type HotSpotStyle = Partial<CSSStyleDeclaration>;

export type HotSpotData = {
  id: string;
  position: THREE.Vector3;
  element: HTMLDivElement;
  visible: boolean;
};

export type JsonPaths = Record<string, string>; // { key: "path/to/file.json" }

export type LoginData = {
  height: string | number;
  bgimage: {
    url: {
      desktop: string;
      tablet?: string;
      mobile?: string;
    };
    align?: string;
    edge?: string;
    width?: string | number;
    height?: string | number;
    fillmode?: string;
  };
  input: TextData & { inner: TextData; decoration: any[] };
};

export interface TextData {
  align?: string;
  edge?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  bgcolor?: string;
  bgalpha?: number;
  text?: string | TextData; // text가 문자열일 수도, 객체일 수도 있음
  font_family?: string;
  font_weight?: string;
  font_size?: number;
  font_color?: string;
  text_align?: string;
  title?: TextData;
  textbox?: TextData;
  password?: TextData;
  warning?: TextData;
  button?: TextData;
  ratio?: number;
  decoration?: TextData[];
  invisible?: TextData;
  inner?: TextData;
  [key: string]: any; // 추가 필드 허용
}
export interface EditableData {
  align?: string;
  edge?: string;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  bgcolor?: string;
  bgalpha?: number;
  default?: string;
  font_family?: string;
  font_weight?: string;
  font_size?: number;
  font_color?: string;
  text_align?: string;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}
export interface DecorationData {
  type: string;
  url: {
    desktop: string;
    tablet?: string;
    mobile?: string;
  };
  align?: string;
  edge?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  minwidth?: number;
  maxwidth?: number;
  minheight?: number;
  maxheight?: number;
  rotate?: number;
  bgcolor?: string;
  bgalpha?: number;
  bgborder?: string | null;
  bgroundedge?: string | null;
  bgshadow?: string | null;
  text?: string;
  font_family?: string;
  font_weight?: string;
  font_size?: number;
  font_color?: string;
  text_align?: string;
}
