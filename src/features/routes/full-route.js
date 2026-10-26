import { MAP_DATA } from "../../data/index.js";
import { selectRouteWaypoints } from "../../domain/route-waypoints.js";
import { baiduCyclingRoute, navCity } from "../../shared/navigation.js";
import { esc } from "../../shared/dom.js";

export function fullRouteHTML(r) {
  if (r.id !== "puyang-greenway") return "";
  const path = MAP_DATA.paths[r.id];
  const points = selectRouteWaypoints(path, r.stops);
  if (!points.length) return "";
  const fallback = selectRouteWaypoints(path, r.stops, Infinity);
  return `<section class="full-route-box" aria-labelledby="full-route-heading">
    <div class="detail-label">完整骑行路线 · iPhone 百度地图</div>
    <h3 id="full-route-heading">临浦出发，经义桥折返，再回到临浦</h3>
    <p>本站约 ${r.distance.toFixed(1)} 公里往返，沿道路轨迹设置 ${points.length - 2} 个途经点，保留去程、折返点与返程顺序。</p>
    <div class="navigation-actions">
      <a class="nav-primary full-route-open" href="${esc(baiduCyclingRoute(points, navCity(r)))}">百度 · 查看完整骑行路线 ↗</a>
      <a class="full-route-fallback" href="${esc(baiduCyclingRoute(fallback, navCity(r)))}">使用已测的 ${fallback.length - 2} 点方案 ↗</a>
    </div>
    <p class="nav-explainer">请在已安装百度地图的 iPhone 上用 Safari 打开。百度按途经点重新规划，里程与本站可能不同；新增途经点后的贴合程度待手机核对。若无法打开，请确认使用 Safari；若途经点被忽略或路线异常，可改用已测的 ${fallback.length - 2} 点方案。</p>
    <details class="full-route-points"><summary>查看 ${points.length - 2} 个途经点与行进顺序</summary>
      <ol>${points.map(p => `<li>${esc(p.name)} <small>· 沿程 ${p.km.toFixed(1)} km</small></li>`).join("")}</ol>
      <p class="nav-explainer">补充点从已有道路节点中选取，按长度增加，并优先约束转弯路段；不是实骑轨迹导入。原5点往返已由用户在 iPhone Safari 调起百度验证。</p>
    </details>
  </section>`;
}
