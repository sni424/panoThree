import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import MetaPage from "./meta/MetaPage";

/**
 * 기존 파노라마(레거시) 앱은 번들이 커서 lazy로 감싼다.
 * → "/" 로 들어온 사용자는 파노라마 코드를 아예 내려받지 않는다.
 */
const PanoPage = lazy(() => import("./pano/PanoPage"));

/** 경로별 화면 분기 */
export default function App() {
  return (
    // lazy로 불러오는 동안 보여줄 화면
    <Suspense fallback={<div className="route-fallback">로딩 중…</div>}>
      <Routes>
        {/* 메인: 메타버스 */}
        <Route path="/" element={<MetaPage />} />
        {/* 기존 파노라마 뷰어 */}
        <Route path="/pano" element={<PanoPage />} />
        {/* 그 외 주소는 메인으로 */}
        <Route path="*" element={<MetaPage />} />
      </Routes>
    </Suspense>
  );
}
