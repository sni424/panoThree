// Core.js
import * as THREE from "three";

import VHotSpots from "./VHotSpots";
import VCamera from "./VCamera";
import VTexture from "./VTexture";
import VMoveSpots from "./VMoveSpots";
import VJsonManager from "./VJsonManager";

import penthouse1_1k from "/1k/penthouse1.jpg?url";
import gate_1k from "/1k/gate.jpg?url";
import penthouse_1k from "/1k/penthouse.jpg?url";
import room2_1k from "/1k/room2.jpg?url";
import room3_1k from "/1k/room3.jpg?url";
import room1_1k from "/1k/room1.jpg?url";

import penthouse1_4k from "/penthouse1.jpg?url";
import gate_4k from "/gate.jpg?url";
import penthouse_4k from "/penthouse.jpg?url";
import room1_4k from "/room1.jpg?url";
import room2_4k from "/room2.jpg?url";
import room3_4k from "/room3.jpg?url";

const texturePaths = {
  lowQuality: [
    room1_1k,
    room2_1k,
    room3_1k,
    gate_1k,
    penthouse_1k,
    penthouse1_1k,
  ],
  highQuality: [
    room1_4k,
    room2_4k,
    room3_4k,
    gate_4k,
    penthouse_4k,
    penthouse1_4k,
  ],
};

export default class Core {
  container;
  VJsonManager;
  scene;
  camera;
  renderer;

  VCam;
  VTexture;
  VHotspots;
  VMoveSpots;

  roomNum = 1;
  isRunning = false;

  constructor(containerId, jsonManager) {
    this.container = document.getElementById(containerId);
    this.VJsonManager = jsonManager;
    this.scene;
    this.camera;
    this.renderer;
  }

  // 3D 관련 모듈 실행
  init3D(texturePaths) {
    // 중복 실행 방지
    if (this.isRunning) return;
    this.isRunning = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.VCam = new VCamera(this.renderer.domElement, this.camera);
    this.VTexture = new VTexture(this.scene, texturePaths);
    this.VHotspots = new VHotSpots(this.scene, this.camera, this.roomNum);
    this.VMoveSpots = new VMoveSpots(
      this.scene,
      this.camera,
      this.roomNum,
      this
    );
    window.addEventListener("resize", this.onResize.bind(this));
    this.animate();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate.bind(this));
    this.VHotspots?.update();
    this.VMoveSpots?.update();
    this.renderer.render(this.scene, this.camera);
  }

  movePlace(roomNum) {
    this.roomNum = roomNum;
    this.VTexture?.changeImageShader(roomNum);
    this.VHotspots?.hideShow(roomNum);
    this.VMoveSpots?.hideShow(roomNum);
  }
}
