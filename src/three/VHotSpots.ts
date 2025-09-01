import type { HotSpotConfig, HotSpotData, HotSpotStyle } from "@/type";
import * as THREE from "three";

export default class VHotSpots {
  private _scene: THREE.Scene;
  private _camera: THREE.Camera;
  private _inDex: number = 1;
  private _domHotspots: HotSpotData[] = [];
  private _roomNum: number;

  constructor(scene: THREE.Scene, camera: THREE.Camera, roomNum: number) {
    this._scene = scene;
    this._camera = camera;
    this._roomNum = roomNum;
  }

  addHotSpot(
    config: HotSpotConfig,
    texture: string,
    position: [number, number, number],
    scale: number
  ): void {
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

  addDivHotSpot(
    position: [number, number, number],
    style?: HotSpotStyle,
    src?: string,
    num?: number
  ): HTMLDivElement {
    const posVector = new THREE.Vector3(...position);
    const getContainer = document.getElementById("container");
    let divVisible = true;

    if (this._roomNum !== num) {
      divVisible = false;
    }

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.willChange = "transform";

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
      const modalDiv = document.getElementById(
        "modalDiv"
      ) as HTMLDivElement | null;
      const optionInfo = document.getElementById(
        "optionInfo"
      ) as HTMLDivElement | null;
      if (modalDiv && optionInfo) {
        modalDiv.style.display = "flex";
        optionInfo.style.display = "flex";
      }
    });

    this._domHotspots.push({
      id: div.id,
      position: posVector,
      element: div,
      visible: divVisible,
    });

    return div;
  }

  hideShow(index: number): void {
    this._domHotspots.forEach((hotSpot) => {
      const stringToArray = hotSpot.id.split("_");
      const idNum = Number(stringToArray[1]);

      if (index !== idNum) {
        hotSpot.element.style.display = "none";
        hotSpot.visible = false;
      } else {
        hotSpot.visible = true;
        hotSpot.element.style.display = "block";
      }
    });
  }

  update(): void {
    this._domHotspots.forEach((hotSpot) => {
      const vector = hotSpot.position.clone().project(this._camera);

      if (vector.z > 1) {
        hotSpot.element.style.display = "none";
        return;
      } else {
        hotSpot.element.style.display = hotSpot.visible ? "block" : "none";
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      const screenX = ((vector.x + 1) / 2) * width;
      const screenY = ((-vector.y + 1) / 2) * height;

      hotSpot.element.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -50%)`;
    });
  }

  removeHotSpot(index: number): void {
    this._scene.traverse((child) => {
      if (child.name === `hotSpot_${index}`) {
        child.removeFromParent();
      }
    });
  }
}
