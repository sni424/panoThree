// VCamera.js
import * as THREE from "three";

export default class VCamera {
  constructor(element, camera) {
    // 카메라 상태 초기화
    this._camera = camera; // Core에서 받은 카메라 저장
    this._cameraState = {
      isRotating: false, // 마우스 드래그 중인지
      isDragging: false, // 드래그 시작 여부
      previousMousePosition: { x: 0, y: 0 }, // 이전 마우스 위치
      rotationVelocity: { x: 0, y: 0 }, // 회전 속도 (관성용)
      lastMouseDownTime: 0, // 마우스 다운 시간
    };

    // 이벤트 리스너 등록
    element.addEventListener("mousedown", this.handleMouseDown.bind(this));
    element.addEventListener("mousemove", this.handleMouseMove.bind(this));
    element.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  // 마우스 다운 이벤트 처리
  handleMouseDown(event) {
    this._cameraState.isRotating = true;
    this._cameraState.isDragging = false;
    this._cameraState.previousMousePosition = {
      x: -event.clientX,
      y: -event.clientY,
    };
  }

  // 마우스 이동 이벤트 처리
  handleMouseMove(event) {
    if (this._cameraState.isRotating) {
      this._cameraState.isDragging = true;

      // 마우스 이동 거리 계산
      const deltaX = -event.clientX - this._cameraState.previousMousePosition.x;
      const deltaY = -event.clientY - this._cameraState.previousMousePosition.y;

      // 회전 속도 계산 (민감도 조절 가능)
      const sensitivity = 0.005;
      this._cameraState.rotationVelocity.x = deltaX * sensitivity;
      this._cameraState.rotationVelocity.y = deltaY * sensitivity;

      // 카메라 회전 적용
      this.moveCameraRotation(deltaX, deltaY);

      // 현재 마우스 위치 업데이트
      this._cameraState.previousMousePosition = {
        x: -event.clientX,
        y: -event.clientY,
      };
    }
  }

  // 마우스 업 이벤트 처리
  handleMouseUp(event) {
    const currentTime = Date.now();

    // 상태 업데이트
    this._cameraState.isDragging = false;
    this._cameraState.isRotating = false;
    this._cameraState.lastMouseDownTime = currentTime;

    // 관성 적용 시작
    this.applyInertia();
  }

  // 카메라 회전 함수
  moveCameraRotation(deltaX, deltaY) {
    // 회전 각도 계산 (마우스 이동 거리에 비례)
    const sensitivity = 0.005; // 회전 민감도
    const xAngle = deltaX * sensitivity;
    const yAngle = deltaY * sensitivity;

    // 카메라 회전 및 제한 적용
    this.clampAndUpdateCamera(this._camera, 50, -xAngle, -yAngle, 0.3);
  }

  // 관성 적용 함수
  applyInertia() {
    if (
      !this._cameraState.isRotating &&
      (Math.abs(this._cameraState.rotationVelocity.x) > 0.001 ||
        Math.abs(this._cameraState.rotationVelocity.y) > 0.001)
    ) {
      // 관성 감소 비율
      const inertiaFactor = 0.9;

      // 회전 속도 감소
      this._cameraState.rotationVelocity.x *= inertiaFactor;
      this._cameraState.rotationVelocity.y *= inertiaFactor;

      // 부드러운 카메라 회전 적용
      this.clampAndUpdateCamera(
        this._camera,
        50,
        -this._cameraState.rotationVelocity.x,
        -this._cameraState.rotationVelocity.y,
        0.3
      );

      // 다음 프레임에서 관성 적용 지속
      requestAnimationFrame(this.applyInertia.bind(this));
    }
  }

  // 카메라 회전 및 각도 제한
  clampAndUpdateCamera(
    camera,
    maxPitchDeg,
    xAngle,
    yAngle,
    interpolationFactor
  ) {
    // 1. X축 회전 (yaw)를 위한 쿼터니언 생성 (Y축 기준 회전)
    const quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), xAngle);

    // 2. Y축 회전 (pitch)를 위한 쿼터니언 생성 (X축 기준 회전)
    const quaternionY = new THREE.Quaternion();
    quaternionY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), yAngle);

    // 3. 현재 카메라의 쿼터니언을 복제하여 목표 쿼터니언 생성
    const targetQuaternion = camera.quaternion.clone();

    // 4. 목표 쿼터니언에 X축 회전 적용
    targetQuaternion.multiply(quaternionX);
    // 5. 목표 쿼터니언에 Y축 회전 적용
    targetQuaternion.multiply(quaternionY);

    // 6. 목표 쿼터니언을 Euler 각도로 변환 (회전 순서: 'YXZ')
    const euler = new THREE.Euler().setFromQuaternion(targetQuaternion, "YXZ");
    // 7. 최대 피치 각도를 라디안으로 변환
    const maxPitch = THREE.MathUtils.degToRad(maxPitchDeg);
    // 8. 피치(euler.x)를 -maxPitch ~ maxPitch 범위로 제한
    euler.x = THREE.MathUtils.clamp(euler.x, -maxPitch, maxPitch);
    // 9. 롤(회전, euler.z)은 제거하여 화면 기울임 방지
    euler.z = 0;
    // 10. 제한된 Euler 각도를 기반으로 목표 쿼터니언 업데이트 및 정규화
    targetQuaternion.setFromEuler(euler);
    targetQuaternion.normalize();

    // 11. 현재 카메라 쿼터니언을 목표 쿼터니언으로 부드럽게 보간(slerp)
    camera.quaternion.slerp(targetQuaternion, interpolationFactor);
    // 12. 변경된 쿼터니언을 반영하기 위해 카메라 월드 행렬 업데이트
    camera.updateMatrixWorld(true);
  }

  // 카메라 위치 외부에서 바꾸고 싶을 때
  setCameraPosition(x, y, z) {
    this._camera.position.set(x, y, z);
    this.controls.updateProjectionMatrix();
  }
}
