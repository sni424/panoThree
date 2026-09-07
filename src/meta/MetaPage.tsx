import "./meta.css";

import Hud from "@/meta/components/Hud";
import Loading from "@/meta/components/Loading";
import World from "@/meta/components/World";

/**
 * 메인("/") 라우트 = 메타버스 화면.
 *
 * 구성은 세 겹이다.
 *  1) World   — 3D 씬 (Canvas)
 *  2) Hud     — 그 위에 겹치는 HTML UI
 *  3) Loading — 모델 로딩 중에만 보이는 오버레이
 */
export default function MetaPage() {
  return (
    <div className="meta-root">
      <World />
      <Hud />
      <Loading />
    </div>
  );
}
