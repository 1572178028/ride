import { MAP_DATA } from "../../data/index.js";
import { selectRouteWaypoints, buildRoutePlans } from "../../domain/route-waypoints.js";
import { baiduCyclingRoute, navCity } from "../../shared/navigation.js";
import { esc } from "../../shared/dom.js";

export function fullRouteHTML(r) {
  if (r.id !== "puyang-greenway") return "";
  const path = MAP_DATA.paths[r.id];
  const plans = buildRoutePlans(path, r.stops, r.shape);
  const points = plans.full;
  if (!points.length) return "";
  const fallback = selectRouteWaypoints(path, r.stops, Infinity);
  return `<section class="full-route-box" aria-labelledby="full-route-heading">
    <div class="detail-label">完整骑行路线 · iPhone 百度地图</div>
    <h3 id="full-route-heading">${plans.outbound ? "临浦出发，经义桥折返，再回到临浦" : "完整环线 · 回到起点"}</h3>
    <p>本站约 ${r.distance.toFixed(1)} 公里${plans.outbound ? "往返" : "环线"}，沿道路轨迹设置 ${points.length - 2} 个途经点。${plans.outbound ? "可打开完整往返，也可分别查看去程和返程。" : "全程沿环线回到起点。"}</p>
    <div class="navigation-actions">
      <a class="nav-primary full-route-open" href="${esc(baiduCyclingRoute(points, navCity(r)))}">百度 · 查看完整${plans.outbound ? "往返" : "环线"} ↗</a>
      ${plans.outbound ? `<a class="full-route-outbound" href="${esc(baiduCyclingRoute(plans.outbound, navCity(r)))}">百度 · 仅去程（约 ${plans.outbound.at(-1).km.toFixed(1)} km） ↗</a>
      <a class="full-route-inbound" href="${esc(baiduCyclingRoute(plans.inbound, navCity(r)))}">百度 · 仅返程（约 ${plans.inbound.at(-1).km.toFixed(1)} km） ↗</a>` : ""}
    </div>
    <p class="nav-explainer">${plans.outbound ? `去程：临浦道路起点 → 义桥方向折返点；返程：义桥方向折返点 → 临浦道路起点。去程保留 ${plans.outbound.length - 2} 个加密途经点，返程保留 ${plans.inbound.length - 2} 个。` : ""} 里程按本站道路几何估算，百度按途经点重新规划，以百度显示为准。请在已安装百度地图的 iPhone 上用 Safari 打开。</p>
    ${plans.outbound ? `<details class="full-route-options"><summary>路线异常或无法打开？</summary><p class="nav-explainer">先确认使用 Safari。若加密方案的途经点被忽略或路线异常，可改用先前已测的 ${fallback.length - 2} 点完整往返方案。</p><div class="navigation-actions"><a class="full-route-fallback" href="${esc(baiduCyclingRoute(fallback, navCity(r)))}">使用原 ${fallback.length - 2} 点备用往返 ↗</a></div></details>` : ""}
    <details class="full-route-points"><summary>查看 ${points.length - 2} 个途经点与行进顺序</summary>
      <ol>${points.map(p => `<li>${esc(p.name)} <small>· 沿程 ${p.km.toFixed(1)} km</small></li>`).join("")}</ol>
      <p class="nav-explainer">补充点从已有道路节点中选取，按长度增加，并优先约束转弯路段；不是实骑轨迹导入。用户已在 iPhone Safari 调起百度，确认11点完整往返比原5点更贴合。</p>
    </details>
  </section>`;
}
