import Core from "./core.js";

import hotSpotImg from "/hotSpotImg.png?url";
import uiCollection from "./uiCollection.js";

function main() {
  const core = new Core("container");
  const nextButton = document.getElementById("nextImage");

  // if (nextButton) {
  //   nextButton.addEventListener("click", () => {
  //     core.vtexture.changeImageShader();
  //   });
  // }

  // core.hotspots.addHotSpot(
  //   { radius: 5, segments: 32 },
  //   hotSpotImg,
  //   [1, 0, 1],
  //   0.01
  // );
  // core.hotspots.addHotSpot(
  //   { radius: 5, segments: 32 },
  //   hotSpotImg,
  //   [3, 0, -3],
  //   0.01
  // );

  core.hotspots.addDivHotSpot(
    [0, 0, 1],
    { width: "40px", height: "40px", cursor: "pointer" },
    hotSpotImg,
    1
  );

  core.hotspots.addDivHotSpot(
    [3, 0, -5],
    { width: "40px", height: "40px", cursor: "pointer" },
    hotSpotImg,
    2
  );
  // core.setCameraPosition(1, 0, 1);
  // const imgButton = document.getElementById("meshImage");
  // if (imgButton) {
  //   imgButton.addEventListener("click", () => {
  //     Vtexture.changeImage();
  //   });
  // }
  uiCollection(core);
}

main();
