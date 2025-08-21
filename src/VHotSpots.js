import * as THREE from "three";
import hotSpotImg from "/hotSpotImg.png?url";

export default class VHotSpots {
  constructor(scene, camera, roomNum) {
    this._scene = scene;
    this._camera = camera;
    this._inDex = 1;
    this._domHotspots = [];
    this._roomNum = roomNum;
  }

  addHotSpot(config, texture, position, scale) {
    const geometry = new THREE.CircleGeometry(config.radius, config.segments);

    const loadTexture = new THREE.TextureLoader().load(texture);
    const material = new THREE.MeshBasicMaterial({
      map: loadTexture,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);

    mesh.scale.set(scale, scale, scale);
    mesh.name = `hotSpot_${this._inDex}`;
    mesh.lookAt(this._camera.position);
    this._scene.add(mesh);
    this._inDex += 1;
  }
  addDivHotSpot(position, style, src, num) {
    const posVector = new THREE.Vector3(...position);
    const getContainer = document.getElementById("container");
    let divVisible = true;
    // const div = document.createElement("div");
    // div.style.position = "absolute";
    // div.style.transform = "translate(-50%, -50%)"; // 중앙 정렬
    if (this._roomNum !== num) {
      divVisible = false;
    }

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "0px"; // 기준점 고정
    div.style.top = "0px"; // 기준점 고정
    div.style.willChange = "transform"; // 브라우저 최적화 힌트

    this._inDex += 1;
    div.id = `hotSpot_${num}`;
    if (style) Object.assign(div.style, style);

    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.pointerEvents = "auto";
      div.appendChild(img);
    }

    if (getContainer) {
      getContainer.appendChild(div);
    }

    div.addEventListener("click", () => {
      const modalDiv = document.getElementById("modalDiv");
      const optionInfo = document.getElementById("optionInfo");
      modalDiv.style.display = "flex";
      optionInfo.style.display = "flex";
    });

    this._domHotspots.push({
      id: div.id,
      position: posVector,
      element: div,
      visible: divVisible,
    });

    return div;
  }

  // const stringToArray = id.split("_")
  // console.log("stringToArray")
  hideShow(index) {
    this._domHotspots.forEach((hotSpot) => {
      const stringToArray = hotSpot.id.split("_");
      const idNum = Number(stringToArray[1]);

      //카메라 회전하면 뒤에 똑같은게 있음
      if (index !== idNum) {
        // z 값이 1보다 크면 카메라 뒤에 있는 것이므로 숨김
        hotSpot.element.style.display = "none";
        hotSpot.visible = false;

        return;
      } else {
        hotSpot.visible = true;
        hotSpot.element.style.display = "block";
      }
    });
  }

  update() {
    this._domHotspots.forEach((hotSpot) => {
      const vector = hotSpot.position.clone().project(this._camera);

      //카메라 회전하면 뒤에 똑같은게 있음
      if (vector.z > 1) {
        // z 값이 1보다 크면 카메라 뒤에 있는 것이므로 숨김
        hotSpot.element.style.display = "none";
        return;
      } else {
        if (hotSpot.visible) {
          hotSpot.element.style.display = "block";
        } else {
          hotSpot.element.style.display = "none";
        }
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      const screenX = ((vector.x + 1) / 2) * width;
      const screenY = ((-vector.y + 1) / 2) * height;

      hotSpot.element.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -50%)`;
    });
  }
  removeHotSpot(index) {
    this._scene.traverse((child) => {
      if (child.name === `hotSpot_${index}`) {
        child.removeFromParent();
      }
    });
  }
}
