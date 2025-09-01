import Core from "./core.js";
import VJsonManager from "./loader/VJsonManager.js";
import login from "./page/login.ts";
import login2 from "./page/login2.ts";
import type { LoginPageSettings } from "./type.ts";

const filesToLoad = {
  ui: "./json/insite-ui.json",
  hotspots: "./json/hotspot.json",
  moveSpots: "./json/moveSpot.json",
  login: "./json/login.json",
};

export type FilesToLoadType = typeof filesToLoad;

function main() {
  (async () => {
    const jsonManager = await VJsonManager.create(filesToLoad);

    const core = new Core("container", jsonManager);
    const loginData = jsonManager.get("login") as LoginPageSettings;
    // core.init3D();

    // 5. 로드된 데이터를 사용해 Hotspot과 MoveSpot 추가
    // const hotspotsData = jsonManager.get("hotspots");
    // const moveSpotsData = jsonManager.get("moveSpots");
    // const uiData = jsonManager.get("ui");

    // if (hotspotsData) {
    //   hotspotsData.forEach((data) => {
    //     core.VHotspots.addDivHotSpot(
    //       data.position,
    //       data.style,
    //       `/${data.image}`,
    //       data.room
    //     );
    //   });
    // }

    // if (moveSpotsData) {
    //   moveSpotsData.forEach((data) => {
    //     core.VMoveSpots.addDivMoveSpot(
    //       data.position,
    //       data.style,
    //       `/${data.image}`,
    //       data.from,
    //       data.to
    //     );
    //   });
    // }

    // uiCollection(core);
    login2(loginData);
    // login(loginData.login_page_settings.login);
  })();

  // hotspotsData.forEach((data) => {
  //   core.hotspots.addDivHotSpot(
  //     data.position,
  //     data.style,
  //     data.image,
  //     data.room
  //   );
  // });

  // movespotsData.forEach((data) => {
  //   core.moveSpots.addDivMoveSpot(
  //     data.position,
  //     data.style,
  //     data.image,
  //     data.from,
  //     data.to
  //   );
  // });

  // uiCollection(core);
}

main();
