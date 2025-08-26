import Core from "./core.js";
import hotSpotImg from "/hotSpotImg.png?url";
import mark from "/mark.png?url";
import uiCollection from "./uiCollection.js";
import VJsonManager from "./VJsonManager.js";
import login from "./page/login.js";

const hotspotsData = [
  {
    position: [0, 0, 1],
    style: { width: "40px", height: "40px", cursor: "pointer" },
    image: hotSpotImg,
    room: 1,
  },
  {
    position: [3, 0, -5],
    style: { width: "40px", height: "40px", cursor: "pointer" },
    image: hotSpotImg,
    room: 2,
  },
];

const movespotsData = [
  {
    position: [1, -2, -4],
    style: { width: "40px", height: "40px", cursor: "pointer" },
    image: mark,
    from: 1,
    to: 2,
  },
  {
    position: [5, -2, 0],
    style: { width: "40px", height: "40px", cursor: "pointer" },
    image: mark,
    from: 2,
    to: 3,
  },
  {
    position: [2.5, -2, 2],
    style: { width: "40px", height: "40px", cursor: "pointer" },
    image: mark,
    from: 2,
    to: 1,
  },
  {
    position: [-5.5, -2, 0.7],
    style: { width: "40px", height: "40px", cursor: "pointer" },
    image: mark,
    from: 3,
    to: 2,
  },
];

const filesToLoad = {
  ui: "./json/insite-ui.json",
  hotspots: "./json/hotspot.json",
  moveSpots: "./json/moveSpot.json",
  login: "./json/login.json",
};

function main() {
  (async () => {
    const jsonManager = await VJsonManager.create(filesToLoad);

    const core = new Core("container", jsonManager);
    const loginData = jsonManager.get("login");

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
    login(loginData.login_page_settings.login);
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
