import * as THREE from "three";
import type { texturePaths } from "@/type";
import gsap from "gsap";

export default class VTexture {
  private _scene: THREE.Scene;
  private _currentIndex: number;
  private _textureLoader: THREE.TextureLoader;
  private _textures_1k: string[];
  private _textures_4k: string[];
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private currentTextureIndex: number = 0;
  private isTransitioning: boolean = false;

  constructor(scene: THREE.Scene, texturePaths: texturePaths) {
    this._scene = scene;
    this._currentIndex = 0;
    this._textureLoader = new THREE.TextureLoader();

    this._textures_1k = texturePaths.lowQuality;
    this._textures_4k = texturePaths.highQuality;

    // 저화질 먼저, 완료되면 고화질로 교체 (첫 번째 텍스처 로드)
    const initialLowResTexture = this._textureLoader.load(
      this._textures_1k[0],
      (lowResTex: THREE.Texture) => {
        this._textureLoader.load(
          this._textures_4k[0],
          (highResTex: THREE.Texture) => {
            this.material.uniforms.texture1.value = highResTex;
            this.material.uniforms.texture2.value = highResTex;
            lowResTex.dispose();
          }
        );
      }
    );

    const geometry = new THREE.SphereGeometry(500, 60, 40);
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

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.name = "spaceMesh";
    this._scene.add(this.mesh);
  }

  changeImageShader(index: number) {
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

    let highResTextureResult: THREE.Texture | null = null;
    let isTransitionAnimationComplete = false;
    // 1. 고화질 텍스처 로드 (백그라운드에서 진행)
    this._textureLoader.load(highResUrl, (highResTexture: THREE.Texture) => {
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
    this._textureLoader.load(lowResUrl, (lowResTexture: THREE.Texture) => {
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
