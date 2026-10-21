import { esc } from "../../shared/dom.js";
import { external } from "../../shared/links.js";
import { placeLinks } from "../../shared/navigation.js";
export function supplyHTML(r, supplyKind) {
  const kinds = [
    ["all", "全部"],
    ["咖啡", "咖啡"],
    ["茶饮", "茶饮"],
    ["餐厅", "餐厅"],
    ["歇脚", "歇脚建议"],
  ];
  const controls = `<div class="supply-controls" role="group" aria-label="筛选补给类型">${kinds.map(([kind, label]) => `<button data-supply-kind="${kind}" aria-pressed="${supplyKind === kind}">${label} <span>${kind === "all" ? r.supply.length : r.supply.filter((f) => f.kind === kind).length}</span></button>`).join("")}</div>`;
  const cards = r.supply
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => supplyKind === "all" || f.kind === supplyKind)
    .map(({ f, i }) => {
      const links = placeLinks(f, r),
        rest = f.kind === "歇脚",
        placement =
          f.placement === "detour"
            ? "支线 · 需额外绕行"
            : f.placement === "start"
              ? "起终点附近"
              : "沿线";
      return `<article class="food-card ${rest ? "rest-card" : ["咖啡", "茶饮"].includes(f.kind) ? "coffee-card" : "restaurant-card"}" data-place-index="${i}"><div class="food-type">${rest ? "REST / 歇脚建议" : f.kind === "咖啡" ? "COFFEE / 咖啡" : f.kind === "茶饮" ? "TEA / 茶饮" : "LOCAL FOOD / 餐厅"}<span class="placement">${placement}</span></div><h4><span class="place-number">${i + 1}</span> ${esc(f.name)}</h4><p>${esc(f.description)}</p><p class="food-location">⌖ ${esc(f.location)}</p><div class="place-status">${esc(f.status)}${f.checked ? " · " + esc(f.checked) : ""}${f.precision ? " · 地图为片区参考" : ""}</div><div class="food-links"><button class="map-locate" data-locate="supply-${i}">◎ 地图定位</button>${external(links.amap, "高德 ↗")}${external(links.baidu, "百度 ↗")}${external(f.source, rest ? "位置参考 ↗" : "信息来源 ↗")}</div></article>`;
    })
    .join("");
  return (
    controls +
    (cards || '<p class="supply-empty">这条路线暂无此类已收录地点。</p>')
  );
}
