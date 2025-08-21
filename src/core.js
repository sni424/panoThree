// Core.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import VHotSpots from "./hotSpots";
import VCamera from "./camera";
import VTexture from "./texture";
import VMoveSpots from "./moveSpots";

export default class Core {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

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
    this.roomNum = 1;

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    // this.controls.enableZoom = false;

    this.vcam = new VCamera(this.renderer.domElement, this.camera);
    this.vtexture = new VTexture(this.scene);
    this.hotspots = new VHotSpots(this.scene, this.camera, this.roomNum);
    this.moveSpots = new VMoveSpots(
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
    console.log(" this.roomNum ", this.roomNum);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // this.controls.update();
    //div핫스팟들 자리에서 고정되게
    this.hotspots.update();
    this.moveSpots.update();
    this.renderer.render(this.scene, this.camera);
  }
  movePlace(roomNum) {
    this.roomNum = roomNum;
    this.vtexture.changeImageShader(roomNum);
    this.hotspots.hideShow(roomNum);
    this.moveSpots.hideShow(roomNum);
  }
}
