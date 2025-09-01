// Core.ts
import * as THREE from "three";

import VHotSpots from "./three/VHotSpots";
import VCamera from "./three/VCamera";
import VTexture from "./three/VTexture";
import VMoveSpots from "./three/VMoveSpots";
import VJsonManager from "./loader/VJsonManager";

// 텍스처 임포트
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
import type { FilesToLoadType } from "@/main";

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
  container: HTMLElement | null;
  VJsonManager: VJsonManager<FilesToLoadType>;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  VCam!: VCamera;
  VTexture!: VTexture;
  VHotspots!: VHotSpots;
  VMoveSpots!: VMoveSpots;

  texturePaths: typeof texturePaths;
  roomNum = 1;
  isRunning = false;

  constructor(containerId: string, jsonManager: VJsonManager<FilesToLoadType>) {
    this.container = document.getElementById(containerId);
    this.VJsonManager = jsonManager;
    this.texturePaths = texturePaths;
  }

  // 3D 관련 모듈 초기화
  init3D() {
    if (this.isRunning) return; // 중복 실행 방지
    this.isRunning = true;

    // 씬, 카메라, 렌더러 생성
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
    this.container?.appendChild(this.renderer.domElement);

    // 3D 모듈 초기화
    this.VCam = new VCamera(this.renderer.domElement, this.camera);
    this.VTexture = new VTexture(this.scene, this.texturePaths);
    this.VHotspots = new VHotSpots(this.scene, this.camera, this.roomNum);
    this.VMoveSpots = new VMoveSpots(
      this.scene,
      this.camera,
      this.roomNum,
      this
    );

    // 리사이즈 이벤트
    window.addEventListener("resize", this.onResize.bind(this));

    // 애니메이션 시작
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

    // 핫스팟 업데이트
    this.VHotspots?.update();
    this.VMoveSpots?.update();

    // 씬 렌더
    this.renderer.render(this.scene, this.camera);
  }

  movePlace(roomNum: number) {
    this.roomNum = roomNum;

    // 텍스처 변경
    this.VTexture?.changeImageShader(roomNum);

    // 핫스팟 상태 갱신
    this.VHotspots?.hideShow(roomNum);
    this.VMoveSpots?.hideShow(roomNum);
  }
}
