import * as THREE from "three";

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
import gsap from "gsap";

export default class VTexture {
  constructor(scene) {
    this._scene = scene;
    // this._textures = [room1, room2, room3, gate, penthouse, penthouse1];
    this._currentIndex = 0;

    this._textureLoader = new THREE.TextureLoader();
    // 1. 저화질/고화질 텍스처 경로를 별도로 관리합니다.
    this._textures_1k = [
      room1_1k,
      room2_1k,
      room3_1k,
      gate_1k,
      penthouse_1k,
      penthouse1_1k,
    ];
    this._textures_4k = [
      room1_4k,
      room2_4k,
      room3_4k,
      gate_4k,
      penthouse_4k,
      penthouse1_4k,
    ];

    // 저화질 먼저, 완료되면 고화질로 교체
    const initialLowResTexture = this._textureLoader.load(
      this._textures_1k[0],
      (lowResTex) => {
        this._textureLoader.load(this._textures_4k[0], (highResTex) => {
          this.material.uniforms.texture1.value = highResTex;
          this.material.uniforms.texture2.value = highResTex;
          lowResTex.dispose();
        });
      }
    );

    const geometry = new THREE.SphereGeometry(500, 60, 40);

    this.currentTextureIndex = 0; // 현재 텍스처 인덱스
    this.isTransitioning = false;

    // 초기 텍스처 로드
    // this.currentTexture = new THREE.TextureLoader().load(this._textures[0]);
    this._textureLoader = new THREE.TextureLoader();

    // 셰이더 재질 생성
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
        texture1: { value: initialLowResTexture },
        texture2: { value: initialLowResTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float progress;
        uniform sampler2D texture1;
        uniform sampler2D texture2;

        varying vec2 vUv;
        void main() {
            gl_FragColor = mix(texture2D(texture1, vUv), texture2D(texture2, vUv), progress);
          
        }
      `,
      side: THREE.BackSide, // 구 내부에 텍스처 표시
      transparent: true, // 투명도 활성화
    });

    // const material = new THREE.MeshBasicMaterial({
    //   map: new THREE.TextureLoader().load(this._textures[0]),
    //   side: THREE.BackSide,
    // });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this._scene.add(this.mesh);
  }

  changeImageShader(index) {
    // 전환 중이면 무시
    if (this.isTransitioning) {
      return console.warn("아직 변경중");
    }
    this.isTransitioning = true;

    // 다음 인덱스 계산
    // const nextIndex = (this.currentTextureIndex + 1) % this._textures_1k.length;
    const nextIndex = index - 1;

    const lowResUrl = this._textures_1k[nextIndex];
    const highResUrl = this._textures_4k[nextIndex];

    let highResTextureResult = null;
    let isTransitionAnimationComplete = false;
    // 1. 고화질 텍스처 로드 (백그라운드에서 진행)
    this._textureLoader.load(highResUrl, (highResTexture) => {
      // 고화질 로드 완료 시

      highResTextureResult = highResTexture;

      // 만약 GSAP 애니메이션이 "이미" 끝나있는 상태라면, 바로 텍스처를 교체
      if (isTransitionAnimationComplete) {
        this.material.uniforms.texture1.value = highResTextureResult;
        this.material.uniforms.texture2.value = highResTextureResult;
        this.currentTextureIndex = nextIndex;
        this.isTransitioning = false;
      }
    });

    // 2. 저화질 텍스처 로드 및 애니메이션 시작
    this._textureLoader.load(lowResUrl, (lowResTexture) => {
      this.material.uniforms.texture2.value = lowResTexture;

      gsap.to(this.material.uniforms.progress, {
        value: 1,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (highResTextureResult && !isTransitionAnimationComplete) {
            this.material.uniforms.texture2.value = highResTextureResult;
            isTransitionAnimationComplete = true;
          }
          this.material.uniforms.progress.value =
            this.material.uniforms.progress.value;
        },
        onComplete: () => {
          // --- 화면 전환(애니메이션) 완료 시점 ---

          // 고화질 텍스처가로드 되었는지 확인
          if (highResTextureResult) {
            this.material.uniforms.texture1.value = highResTextureResult;
            this.material.uniforms.progress.value = 0;
            this.currentTextureIndex = nextIndex;
            this.isTransitioning = false;
            isTransitionAnimationComplete = false;
          } else {
            // 아직 로드되지 않았다면, 우선 저화질로 설정
            this.material.uniforms.texture1.value = lowResTexture;
            isTransitionAnimationComplete = true;
          }
        },
      });
    });
  }
}
