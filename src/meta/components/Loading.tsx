import { useProgress } from "@react-three/drei";

/**
 * GLB 로딩 진행률 오버레이.
 *
 * useProgress는 drei가 관리하는 로딩 상태를 알려준다.
 * Canvas 밖(일반 HTML)에서 써야 로딩 중에도 화면에 보인다.
 */
export default function Loading() {
  const { active, progress } = useProgress();

  // 로딩이 끝나면 아무것도 그리지 않는다
  if (!active) return null;

  return (
    <div className="meta-loading">
      <p>월드를 불러오는 중… {Math.round(progress)}%</p>
      <div className="meta-loading__bar">
        <div className="meta-loading__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
