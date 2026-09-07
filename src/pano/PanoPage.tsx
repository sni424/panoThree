import { useEffect, useRef } from "react";

import startPano from "@/pano/panoApp";

/**
 * "/pano" 라우트 — 기존 바닐라 TS 파노라마 앱을 그대로 띄운다.
 *
 * 레거시 코드는 React를 쓰지 않고 document를 직접 조작하기 때문에,
 * React는 빈 컨테이너(#container)만 만들어주고 나머지는 레거시 코드에 맡긴다.
 */
export default function PanoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  /** 앱이 이미 시작됐는지 표시 (StrictMode에서 effect가 두 번 실행되는 것 방어) */
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startPano("container");
  }, []);

  return <div id="container" ref={containerRef} />;
}
