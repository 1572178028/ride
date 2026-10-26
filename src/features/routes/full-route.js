import { MAP_DATA, NAVIGATION_GEOMETRY } from "../../data/index.js";
import { buildRouteNavigation } from "../../domain/route-navigation.js";
import { baiduCyclingRoute, navCity } from "../../shared/navigation.js";
import { esc } from "../../shared/dom.js";

export function fullRouteHTML(r) {
  const { plans, fallback, note } = buildRouteNavigation(r, MAP_DATA.paths[r.id], NAVIGATION_GEOMETRY[r.id]);
  const points = plans.full;
  if (!points.length) return "";
  const startName = points[0].name;
  const turnName = plans.outbound?.at(-1).name;
  const verified = r.id === "puyang-greenway";
  return `<section class="full-route-box" aria-labelledby="full-route-heading">
    <div class="detail-label">完整骑行路线 · iPhone 百度地图</div>
    <h3 id="full-route-heading">${plans.outbound ? "完整往返，也可分去程与返程" : "完整环线 · 回到起点"}</h3>
    <p>本站约 ${r.distance.toFixed(1)} 公里${plans.outbound ? "往返" : "环线"}，沿道路轨迹设置 ${points.length - 2} 个途经点。${plans.outbound ? "可打开完整往返，也可分别查看去程和返程。" : "全程沿环线回到起点。"}</p>
    <div class="navigation-actions">
      <a class="nav-primary full-route-open" href="${esc(baiduCyclingRoute(points, navCity(r)))}">百度 · 查看完整${plans.outbound ? "往返" : "环线"} ↗</a>
      ${plans.outbound ? `<a class="full-route-outbound" href="${esc(baiduCyclingRoute(plans.outbound, navCity(r)))}">百度 · 仅去程（约 ${plans.outbound.at(-1).km.toFixed(1)} km） ↗</a>
      <a class="full-route-inbound" href="${esc(baiduCyclingRoute(plans.inbound, navCity(r)))}">百度 · 仅返程（约 ${plans.inbound.at(-1).km.toFixed(1)} km） ↗</a>` : ""}
    </div>
    <p class="nav-explainer">${plans.outbound ? `去程：${esc(startName)} → ${esc(turnName)}；返程反向回到起点。按全程行进顺序拆分，去程可能包含前面的支线折返；去程 ${plans.outbound.length - 2} 个途经点，返程 ${plans.inbound.length - 2} 个。` : `从${esc(startName)}出发，沿环线回到起点。`} 里程按导航参考道路估算，百度按途经点重新规划，以百度显示为准。请在已安装百度地图的 iPhone 上用 Safari 打开。</p>
    ${note ? `<p class="nav-explainer">${esc(note)} 导航参考约 ${points.at(-1).km.toFixed(1)} km。</p>` : ""}
    <details class="full-route-options"><summary>路线异常或无法打开？</summary><p class="nav-explainer">先确认使用 Safari。若途经点被忽略或路线异常，可尝试关键点备用方案。${verified ? "浦阳江原5点方案已由用户实测。" : "本路线的百度 App 结果尚未逐条真机核对。"}</p><div class="navigation-actions"><a class="full-route-fallback" href="${esc(baiduCyclingRoute(fallback, navCity(r)))}">使用 ${fallback.length - 2} 点备用${plans.outbound ? "往返" : "环线"} ↗</a></div></details>
    <details class="full-route-points"><summary>查看 ${points.length - 2} 个途经点与行进顺序</summary>
      <ol>${points.map(p => `<li>${esc(p.name)} <small>· 沿程 ${p.km.toFixed(1)} km</small></li>`).join("")}</ol>
      <p class="nav-explainer">途经点来自道路参考节点，名称表示附近位置；按长度增加，并优先约束转弯路段，不是实骑轨迹导入。${verified ? "用户已在 iPhone Safari 确认浦阳江11点完整往返比原5点更贴合。" : "地图 App 会重新规划，本站不将其他路线的测试结果作为本线验证。"}</p>
    </details>
  </section>`;
}
