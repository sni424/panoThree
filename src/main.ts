import Core from "./core.js";
import VJsonManager from "./loader/VJsonManager.js";
import login2 from "./page/login2.ts";
import typeSelectUi from "./page/typeSelect.ts";
import type {
  LoginPageSettings,
  SelectJsonType,
  UnitArrayType,
} from "./type.ts";
import type { HotSpotListType } from "./types/hotSpotType.ts";
import type { MarkerListType } from "./types/markerType.ts";
import uiCollection from "./ui/uiCollection.ts";

import bgimage from "/estimate/bgimage.jpg?url";
import base84a from "/estimate/84a_0_opt_base.png?url";
import base84b from "/estimate/84b_0_opt_base.png?url";
import base84oa from "/estimate/84oa_0_opt_base.png?url";
import base84ob from "/estimate/84ob_0_opt_base.png?url";
import base104a from "/estimate/104a_0_opt_base.png?url";
import base104b from "/estimate/104b_0_opt_base.png?url";
import base104c from "/estimate/104c_0_opt_base.png?url";
import base112t1 from "/estimate/112t1_0_opt_base.png?url";
import base112t2 from "/estimate/112t2_0_opt_base.png?url";
import base112t3 from "/estimate/112t3_0_opt_base.png?url";

import gate from "/gate.jpg?url";
import penthouse from "/penthouse.jpg?url";
import penthouse1 from "/penthouse1.jpg?url";
import room1 from "/room1.jpg?url";
import room2 from "/room2.jpg?url";
import room3 from "/room3.jpg?url";

const filesToLoad = {
  ui: "./json/insite-ui.json",
  hotspots: "./json/hotspot.json",
  moveSpots: "./json/moveSpot.json",
  login: "./json/login.json",
  selectType: "./json/selectype.json",
  units: "./json/units.json",
};

const preloadList: string[] = [
  bgimage,
  base84a,
  base84b,
  base84oa,
  base84ob,
  base104a,
  base104b,
  base104c,
  base112t1,
  base112t2,
  base112t3,
  gate,
  penthouse,
  penthouse1,
  room1,
  room2,
  room3,
];

export type FilesToLoadType = typeof filesToLoad;

const preloadImages = (images: string[]) => {
  return Promise.all(
    images.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // 실패해도 진행 막지 않음
        })
    )
  );
};

function main() {
  (async () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    if (!page) {
      window.location.href = "/?pid=bongmyeong&page=estimate/login";
      return; // 여기서 끝내야 아래 코드 실행 안 됨
    }
    const jsonManager = await VJsonManager.create(filesToLoad);
    console.log("코어 생성");
    const core = new Core("container", jsonManager);
    console.log("json 가져오기");
    const loginData = jsonManager.get("login") as LoginPageSettings;
    const selectTypeData = jsonManager.get("selectType") as SelectJsonType;
    const unitsData = jsonManager.get("units") as UnitArrayType;
    const hotspotsData = jsonManager.get("hotspots") as HotSpotListType;
    const moveSpotsData = jsonManager.get("moveSpots") as MarkerListType;
    console.log("json 로드 끝");

    if (page === "estimate/login") {
      // 🚀 프리로드를 **백그라운드에서 시작**(대기하지 않음)
      const preloadTask = preloadImages(preloadList);
      await preloadImages([bgimage]);
      login2(loginData);
      void preloadTask;
    } else if (page === "estimate/type") {
      typeSelectUi(selectTypeData, unitsData);
    } else if (page === "estimate/tour") {
      core.init3D();
      uiCollection(core);
      if (hotspotsData) {
        hotspotsData.forEach((data) => {
          core.VHotspots.addDivHotSpot(
            data.position,
            data.style,
            `/${data.image}`,
            data.room
          );
        });
      }

      if (moveSpotsData) {
        moveSpotsData.forEach((data) => {
          core.VMoveSpots.addDivMoveSpot(
            data.position,
            data.style,
            `/${data.image}`,
            data.from,
            data.to
          );
        });
      }
    }
  })();
}

main();
