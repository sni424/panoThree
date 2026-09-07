import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./style.css";

/**
 * 앱의 시작점.
 * index.html의 <div id="root"> 안에 React 앱을 붙인다.
 */
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("#root element not found");

createRoot(rootElement).render(
  // StrictMode: 개발 중에만 컴포넌트를 두 번 실행해 부작용(정리 안 된 코드)을 찾아준다
  <StrictMode>
    {/* BrowserRouter: 주소창 경로(/, /pano)로 화면을 나누기 위한 라우터 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
