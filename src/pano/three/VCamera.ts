// VCamera.ts
import * as THREE from "three";

export default class VCamera {
  private _camera: THREE.Camera;
  private _cameraState = {
    isRotating: false,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotationVelocity: { x: 0, y: 0 },
    lastMouseDownTime: 0,
  };

  constructor(element: HTMLElement, camera: THREE.Camera) {
    this._camera = camera;

    // 마우스 이벤트 등록
    element.addEventListener("mousedown", this.handleMouseDown);
    element.addEventListener("mousemove", this.handleMouseMove);
    element.addEventListener("mouseup", this.handleMouseUp);
  }

  // 마우스 다운 이벤트 핸들러
  private handleMouseDown = (event: MouseEvent) => {
    this._cameraState.isRotating = true;
    this._cameraState.isDragging = false;
    this._cameraState.previousMousePosition = {
      x: -event.clientX,
      y: -event.clientY,
    };
  };

  // 마우스 무브 이벤트 핸들러
  private handleMouseMove = (event: MouseEvent) => {
    if (!this._cameraState.isRotating) return;

    this._cameraState.isDragging = true;

    const deltaX = -event.clientX - this._cameraState.previousMousePosition.x;
    const deltaY = -event.clientY - this._cameraState.previousMousePosition.y;

    // 회전 민감도
    const sensitivity = 0.005;
    this._cameraState.rotationVelocity.x = deltaX * sensitivity;
    this._cameraState.rotationVelocity.y = deltaY * sensitivity;

    // 카메라 회전 이동
    this.moveCameraRotation(deltaX, deltaY);

    // 이전 마우스 위치 업데이트
    this._cameraState.previousMousePosition = {
      x: -event.clientX,
      y: -event.clientY,
    };
  };

  // 마우스 업 이벤트 핸들러
  private handleMouseUp = () => {
    this._cameraState.isDragging = false;
    this._cameraState.isRotating = false;
    this._cameraState.lastMouseDownTime = Date.now();

    // 관성 적용
    this.applyInertia();
  };

  // 카메라 회전 이동
  private moveCameraRotation(deltaX: number, deltaY: number) {
    const sensitivity = 0.005;
    const xAngle = deltaX * sensitivity;
    const yAngle = deltaY * sensitivity;

    this.clampAndUpdateCamera(this._camera, 50, -xAngle, -yAngle, 0.3);
  }

  // 관성 적용
  private applyInertia = () => {
    const { rotationVelocity } = this._cameraState;

    if (
      !this._cameraState.isRotating &&
      (Math.abs(rotationVelocity.x) > 0.001 ||
        Math.abs(rotationVelocity.y) > 0.001)
    ) {
      // 관성 감속 비율
      const inertiaFactor = 0.9;
      rotationVelocity.x *= inertiaFactor;
      rotationVelocity.y *= inertiaFactor;

      this.clampAndUpdateCamera(
        this._camera,
        50,
        -rotationVelocity.x,
        -rotationVelocity.y,
        0.3
      );

      // requestAnimationFrame을 사용한 부드러운 애니메이션
      requestAnimationFrame(this.applyInertia);
    }
  };

  // 카메라 회전 제한 및 적용
  private clampAndUpdateCamera(
    camera: THREE.Camera,
    maxPitchDeg: number,
    xAngle: number,
    yAngle: number,
    interpolationFactor: number
  ) {
    // Y축 기준 회전 쿼터니언 생성 (좌우)
    const quaternionX = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      xAngle
    );

    // X축 기준 회전 쿼터니언 생성 (상하)
    const quaternionY = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      yAngle
    );

    // 현재 카메라 쿼터니언과 곱해서 새로운 목표 쿼터니언 생성
    const targetQuaternion = camera.quaternion.clone();
    targetQuaternion.multiply(quaternionX).multiply(quaternionY);

    // 오일러 각도로 변환하여 제한 적용
    const euler = new THREE.Euler().setFromQuaternion(targetQuaternion, "YXZ");
    const maxPitch = THREE.MathUtils.degToRad(maxPitchDeg);

    // 상하 회전 제한 적용
    euler.x = THREE.MathUtils.clamp(euler.x, -maxPitch, maxPitch);
    euler.z = 0;

    // 다시 쿼터니언으로 변환 후 정규화
    targetQuaternion.setFromEuler(euler).normalize();

    // 보간을 통한 부드러운 회전 적용
    camera.quaternion.slerp(targetQuaternion, interpolationFactor);
    camera.updateMatrixWorld(true);
  }

  // 카메라 위치 설정
  public setCameraPosition(x: number, y: number, z: number) {
    this._camera.position.set(x, y, z);
    this._camera.updateMatrixWorld(true);
  }
}
