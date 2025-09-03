import * as THREE from "three";

export interface PositionAble {
  width?: string | number;
  height?: string | number;
  x?: string | number;
  y?: string | number;
  align?: string;
  text_align?: string;
  edge?: string;
  // 함수가 사용하는 다른 속성이 있다면 여기에 추가...
}

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

//selectType.json type

export type Border = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  color: string;
  alpha: number;
};

export type UrlSet = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export type NormalHovered<T = {}> = {
  normal: T;
  hovered: T;
};

/* Scroll Area */
export type ScrollArea = {
  align: string;
  edge: string;
  x: string | number;
  y: string | number;
  width: string | number;
  height: string | number;
  minwidth: number;
  maxwidth: number;
  minheight: number;
  maxheight: number;
  bgcolor: string;
  bgalpha: number;
  horizontal_spacing: number;
  vertical_spacing: number;
  grip_width: number;
  grip_height: number;
  grip_color: string;
  grip_alpha: number;
  grip_roundedge: number;
};

/* Unit Frame */
export type UnitTypeOuterFrame = {
  width: string | number;
  height: string | number;
  bgroundedge: number;
  normal: {
    bgcolor: string;
    bgalpha: number;
    bgborder: Border;
  };
  hovered: {
    bgcolor: string;
    bgalpha: number;
    bgborder: Border;
  };
};

export type TypeInfoFrame = {
  width: number;
  height: number;
  bgcolor: string;
  bgalpha: number;
};

export type TextState = {
  font_weight: string | number;
  font_size: number;
  font_color: string;
};

export type TypeNameFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  value: {
    align: string;
    edge: string;
    y: number;
    font_family: string;
    text_align: string;
    normal: TextState;
    hovered: TextState;
  };
  title: {
    y: number;
    font_family: string;
    text_align: string;
    normal: TextState;
    hovered: TextState;
  };
};

export type FloorPlan = {
  x: number;
  y: number;
  width: number;
  height: number;
  image: {
    align: string;
    edge: string;
    x: number;
    y: number;
    normal_scale: number;
    hovered_scale: number;
  };
};

export type FrameText = {
  x: number;
  y: number;
  width: number;
  height: number;
  font_family: string;
  font_weight: string | number;
  font_size: number;
  font_color: string;
  text_align: string;
};

export type LinkedButton = {
  width: string | number;
  height: string | number;
  bgroundedge: number;
  isometric: {
    y: string | number;
    text: string;
  };
  panoramic: {
    y: string | number;
    text: string;
  };
  font_family: string;
  text_align: string;
  normal: {
    bgcolor: string;
    bgalpha: number;
    font_weight: string | number;
    font_size: number;
    font_color: string;
  };
  hovered: {
    bgcolor: string;
    bgalpha: number;
    font_weight: string | number;
    font_size: number;
    font_color: string;
  };
};

export type Decoration = {
  type: "image" | "text";
  url: UrlSet;
  align: string;
  edge: string;
  x: string | number;
  y: string | number;
  width: string | number;
  height: string | number;
  minwidth: number;
  maxwidth: number;
  minheight: number;
  maxheight: number;
  rotate: number;
  bgcolor: string;
  bgalpha: number;
  bgborder: string | Border;
  bgroundedge: string | number;
  bgshadow: string;
  text: string;
  font_family: string;
  font_weight: string | number;
  font_size: number;
  font_color: string;
  text_align: string;
};

/* Selectype */
export type SelectType = {
  zorder: number;
  bgcolor: string;
  bgalpha: number;
  scrollarea: ScrollArea;
  unit_type_outer_frame: UnitTypeOuterFrame;
  type_info_frame: TypeInfoFrame;
  type_name_frame: TypeNameFrame;
  floor_plan: FloorPlan;
  exclusive_private_area_frame: FrameText;
  supply_area_frame: FrameText;
  linked_button: LinkedButton;
  decoration: Decoration[];
};

/* Progressbar */
export type Progressbar = {
  zorder: number;
  childflowspacing: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  align: string;
  edge: string;
  height: number;
  bgcolor: string;
  bgalpha: number;
  button: {
    height: number;
    normal: {
      bgcolor: string;
      bgalpha: number;
    };
    hovered: {
      bgcolor: string;
      bgalpha: number;
    };
    inner: {
      align: string;
      edge: string;
      title: {
        align: string;
        edge: string;
        bgcolor: string;
        bgalpha: number;
        font_family: string;
        font_weight: string | number;
        font_size: number;
        font_color: string;
        text_align: string;
        padding: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        };
        circle: {
          align: string;
          edge: string;
          diameter: number;
          bgcolor: string;
          bgalpha: number;
          number: {
            align: string;
            edge: string;
            x: number;
            y: number;
            bgcolor: string;
            bgalpha: number;
            font_family: string;
            font_weight: string | number;
            font_size: number;
            font_color: string;
            text_align: string;
          };
          check: {
            align: string;
            edge: string;
            x: number;
            y: number;
            width: number;
            height: number;
            rotate: number;
            bgborder: Border;
          };
        };
      };
    };
    list: {
      name: string;
      page: string;
    }[];
  };
  notice: {
    zorder: number;
    align: string;
    edge: string;
    height: number;
    text: {
      align: string;
      edge: string;
      bgcolor: string;
      bgalpha: number;
      font_family: string;
      font_weight: string | number;
      font_size: number;
      font_color: string;
      text_align: string;
      text: string;
    };
  };
};

/* 최상위 */
export type SelectypePageSettings = {
  selectype: SelectType;
  progressbar: Progressbar;
};

export type SelectJsonType = {
  selectype_page_settings: SelectypePageSettings;
};
//

//unit 타입
export type UnitArrayType = {
  units: Unit[];
};

interface Unit {
  type: string;
  text: string;
  pre_text: string;
  post_text: string;
  aux_text: string;
  type_text: string;
  units_number_post_text: string;
  total_units_number_pre_text: string;
  total_units_number: number;
  units_number: number;
  exclusive_private_area: string;
  living_common_area: string;
  supply_area: string;
  etc_common_area: string;
  underground_parking_area: string;
  contract_area: string;
  exclusive_private_area_text: string;
  living_common_area_text: string;
  supply_area_text: string;
  etc_common_area_text: string;
  underground_parking_area_text: string;
  contract_area_text: string;
  area_unit_text: string;
  activated_isometric_view: boolean;
  activated_panoramic_view: boolean;
  estimate: Estimate;
  isometric: Isometric;
  panoramic: Panoramic;
}

interface Estimate {
  space: Space[];
}

interface Space {
  title_index: number;
  zorder: number;
  values: Value[];
  exclusion: number[];
  preselected: Preselected;
  dependence: any[];
}

interface Value {
  index: string;
  name: string;
}

interface Preselected {
  operator: string;
  options: any[];
}

interface Isometric {
  yaw: number;
  pitch: number;
  similar: number;
  option: number;
  minscale: number;
  maxscale: number;
  default_yaw: number;
  default_pitch: number;
  default_similar: number;
  default_scale: number;
  rotator_extension: string;
  option_extension: string;
  option_button: string[];
  option_list: OptionList;
  poi: POI;
}

interface OptionList {
  align: string;
  edge: string;
  x: number;
  y: number;
  top: Top;
  body: Body;
  updown: UpDown;
}

interface Top {
  width: number;
  height: number;
  bgcolor: string;
  bgalpha: number;
  bgroundedge: BorderRadius;
  title: Title;
  image: Image;
}

interface Body {
  bgcolor: string;
  bgalpha: number;
  spacing: {
    top: number;
    bottom: number;
    vertical: number;
  };
  innor: {
    childmargin: Margin;
  };
  frame: Frame;
  item: FontProperties;
  payment: Payment;
  contents: Content[];
}

interface UpDown {
  width: number;
  height: number;
  bgcolor: string;
  bgalpha: number;
  bgroundedge: BorderRadius;
  image: Image;
}

interface POI {
  base: PoiInfoContainer;
  option: OptionPoi[];
}

interface PoiInfoContainer {
  visible: boolean;
  info: Info[];
}

interface OptionPoi {
  visible: boolean;
  info: Info[];
}

interface Info {
  icon: Icon;
  contents: Contents;
  position: Position[];
}

interface Contents {
  type: number;
  scrollbar: boolean;
  components: Component[];
}

interface Component {
  type: string;
  url: string | { base: string; enhanced: string };
  flowspacing: Margin;
  align: string;
  edge: string;
  width: string;
  height: string;
  bgcolor: string;
  bgalpha: number;
  text: string;
  font_family: string;
  font_weight: string | number;
  font_size: number;
  font_color: string;
  text_align: string;
  padding: Margin;
  time?: {
    delay: number;
    tween: number;
  };
}

interface Panoramic {
  typical: ViewActivation;
  exhaustive: ViewActivation;
  keymap: {
    x: number;
    y: number;
  };
  scene: Scene[];
}

interface Scene {
  name: string;
  title: string;
  title_e: string;
  title_t: string;
  skipthumb: boolean;
  preload: boolean;
  hlookat: number;
  vlookat: number;
  fov: number;
  minfov: number;
  maxfov: number;
  keymap: SceneKeymap;
  opendoor: any[];
  option: SceneOption[];
  popup: Popup[];
  floor: Floor[];
}

// Helper Interfaces
interface BorderRadius {
  lefttop: number;
  righttop: number;
  rightbottom: number;
  leftbottom: number;
}

interface Title extends FontProperties {
  align: string;
  edge: string;
  x: number;
  y: number;
  bgcolor: string;
  bgalpha: number;
  text: string;
}

interface Image {
  url: string;
  align: string;
  edge: string;
  x?: number;
  y?: number;
  width?: string;
  height?: string;
  scale?: number;
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Frame {
  childflowspacing: Margin;
  width: number;
  bgcolor: string;
  bgalpha: number;
  bgroundedge: BorderRadius;
}

interface FontProperties {
  font_family: string;
  font_weight: number | string;
  font_size: number;
  font_color: string;
}

interface Payment extends FontProperties {
  align: string;
  edge: string;
  x: number;
  y: number;
  width: number;
  bgcolor: string;
  bgalpha: number;
  bgroundedge: BorderRadius;
  "text-align": string;
}

interface Content {
  major: ContentItem[];
  minor: ContentItem[];
}

interface ContentItem {
  height: number;
  item: {
    text: string;
    bgcolor: string;
    bgalpha: number;
  };
  payment: {
    text: string;
    bgcolor: string;
    bgalpha: number;
  };
}

interface Icon {
  url: string;
  scale: number;
}

interface Position {
  x: string;
  y: string;
  visible: boolean;
}

interface ViewActivation {
  activated: boolean;
  decorated: boolean;
}

interface SceneKeymap {
  floor: number;
  here: {
    x: number;
    y: number;
    heading: number;
  };
  text: {
    x: number;
    y: number;
  };
}

interface SceneOption {
  title_index: number;
  typical: ViewActivation;
  exhaustive: ViewActivation;
  values: Value[];
  exclusion: any[];
  preselected: Preselected;
  dependence: number[];
  zorder: number;
  lookat: {
    yaw: string;
    pitch: string;
  };
  hotspot: {
    info:
      | boolean
      | {
          enabled: boolean;
          type: number;
          scrollbar?: boolean;
          components?: Component[];
          image?: { url: string };
        };
    opendoor: boolean;
  };
}

interface Popup {
  typical: ViewActivation;
  exhaustive: ViewActivation;
  lookat: {
    yaw: string;
    pitch: string;
  };
  hotspot: {
    type: number;
    image?: { url: string };
    title?: string;
    items?: PopupItem[];
    scrollbar?: boolean;
    components?: Component[];
  };
}

interface PopupItem {
  text: string;
  components: Component[];
}

interface Floor {
  name: string;
  tx: number;
  tz: number;
  visible: boolean;
  linkedscene: string;
}

//
