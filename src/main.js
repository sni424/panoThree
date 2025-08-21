import Core from "./core.js";

import hotSpotImg from "/hotSpotImg.png?url";
import mark from "/mark.png?url";
import uiCollection from "./uiCollection.js";

function main() {
  const core = new Core("container");
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

  core.moveSpots.addDivMoveSpot(
    [1, -2, -4],
    { width: "40px", height: "40px", cursor: "pointer" },
    mark,
    1,
    2
  );
  core.moveSpots.addDivMoveSpot(
    [5, -2, 0],
    { width: "40px", height: "40px", cursor: "pointer" },
    mark,
    2,
    3
  );
  core.moveSpots.addDivMoveSpot(
    [2.5, -2, 2],
    { width: "40px", height: "40px", cursor: "pointer" },
    mark,
    2,
    1
  );
  core.moveSpots.addDivMoveSpot(
    [-5.5, -2, 0.7],
    { width: "40px", height: "40px", cursor: "pointer" },
    mark,
    3,
    2
  );

  uiCollection(core);
}

main();
