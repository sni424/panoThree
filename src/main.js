import Core from "./core.js";
import hotSpotImg from "/hotSpotImg.png?url";
import mark from "/mark.png?url";
import uiCollection from "./uiCollection.js";

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

function main() {
  const core = new Core("container");

  hotspotsData.forEach((data) => {
    core.hotspots.addDivHotSpot(
      data.position,
      data.style,
      data.image,
      data.room
    );
  });

  movespotsData.forEach((data) => {
    core.moveSpots.addDivMoveSpot(
      data.position,
      data.style,
      data.image,
      data.from,
      data.to
    );
  });

  uiCollection(core);
}

main();
