import * as THREE from "three";

export default class VMoveSpots {
  constructor(scene, camera, roomNum, core) {
    this._scene = scene;
    this._camera = camera;
    this._roomNum = roomNum;
    this._domMoveSpots = [];
    this._core = core;
  }

  addMoveSpot(config, texture, position, scale, num) {
    const geometry = new THREE.CircleGeometry(config.radius, config.segments);

    const loadTexture = new THREE.TextureLoader().load(texture);
    const material = new THREE.MeshBasicMaterial({
      map: loadTexture,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);

    mesh.scale.set(scale, scale, scale);
    mesh.name = `hotSpot_${num}`;
    mesh.rotation.x = -Math.PI / 2;
    // mesh.lookAt(this._camera.position);
    this._scene.add(mesh);
  }

  addDivMoveSpot(position, style, src, num, nextRoomNum) {
    const posVector = new THREE.Vector3(...position);
    const getContainer = document.getElementById("container");
    let divVisible = true;

    if (this._roomNum !== num) {
      divVisible = false;
    }

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "0px"; // 기준점 고정
    div.style.top = "0px"; // 기준점 고정
    div.style.willChange = "transform"; // 브라우저 최적화 힌트
    // div.style.transform = "rotateX(90deg)";
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

    this._domMoveSpots.push({
      id: div.id,
      position: posVector,
      element: div,
      visible: divVisible,
    });
    const vector = posVector.clone().project(this._camera);
    const width = window.innerWidth;
    const height = window.innerHeight;

    const screenX = ((vector.x + 1) / 2) * width;
    const screenY = ((-vector.y + 1) / 2) * height;

    // hotSpot.element.style.left = `${screenX}px`;
    // hotSpot.element.style.top = `${screenY}px`;

    div.addEventListener("click", () => {
      this._core.movePlace(nextRoomNum);
    });
    div.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -50%) rotateX(0deg)`;

    return div;
  }

  onClick(num) {
    console.log("num", num);
    // 마우스 좌표를 NDC(-1 ~ 1)로 변환
    this.movePlace(num);
  }

  hideShow(index) {
    this._domMoveSpots.forEach((moveSpot) => {
      const stringToArray = moveSpot.id.split("_");
      const idNum = Number(stringToArray[1]);

      //카메라 회전하면 뒤에 똑같은게 있음
      if (index !== idNum) {
        // z 값이 1보다 크면 카메라 뒤에 있는 것이므로 숨김
        moveSpot.element.style.display = "none";
        moveSpot.visible = false;

        return;
      } else {
        moveSpot.visible = true;
        moveSpot.element.style.display = "block";
      }
    });
  }

  update() {
    this._domMoveSpots.forEach((hotSpot) => {
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

      // hotSpot.element.style.left = `${screenX}px`;
      // hotSpot.element.style.top = `${screenY}px`;

      hotSpot.element.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -50%) rotateX(0deg)`;
    });
  }
}
