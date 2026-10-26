import { ROUTES } from "../../data/index.js";
import { esc } from "../../shared/dom.js";
import { sortVariants } from "../../domain/route-filters.js";
import { browseGroupId } from "../../domain/route-groups.js";
function parkingBadge(r) {
  if (r.parking.feeBasis === "user-default-roadside")
    return "路侧泊位 · 默认免费";
  if (r.parking.feeType === "unknown") return "停车费用待确认 · 使用正式车位";
  if (r.parking.feeType === "paid")
    return "收费停车 · " + (r.parking.priceSummary || "费用见公示");
  return r.window === "night"
    ? "18:00—次日 08:30 免费"
    : r.region === "qiandao"
      ? "免费依据无日期 · 须先联系"
      : r.region === "tonglu"
        ? "共享车位免费 · 日间优先节假日"
        : "免费停车 · 见开放条件";
}

export function routeCardHTML(variants, { selected, saved }) {
  variants.sort(sortVariants);
  const r =
      variants.find((r) => r.id === selected.id) ||
      variants.find(
        (r) =>
          r.id === ROUTES.find((v) => v.id === r.familyId)?.preferredPlanId,
      ) ||
      variants.find((r) => r.id === r.familyId) ||
      variants[0],
    base = ROUTES.find((v) => v.id === r.familyId),
    active = browseGroupId(r) === browseGroupId(selected);
  return `<article class="route-card ${active ? "selected" : ""}"><button class="card-select" data-select="${r.id}" data-family="${browseGroupId(r)}" aria-pressed="${active}"><div class="card-map"><img src="assets/maps/${r.id}.svg" alt="${esc(r.title)}地图缩略图" loading="lazy"><span class="card-number">${base.number}</span><span class="family-options">${variants.length} 种里程方案</span></div><div class="card-body"><div class="area">${esc(r.browseGroup?.area || base.area)}</div><h3>${esc(r.browseGroup?.title || r.familyTitle)}</h3><div class="card-distances">${variants.map((v) => v.distance.toFixed(1) + " km").join(" / ")}</div><p class="card-current">当前：${esc(r.title)}</p><div class="card-stats"><span><b>${r.distance.toFixed(1)}</b>km</span><span>${r.duration}</span><span>${r.level}</span></div><span class="card-badge ${r.parking.feeType !== "free" ? "paid" : r.window === "night" ? "night" : r.region === "qiandao" ? "needs-confirmation" : ""}">P · ${esc(parkingBadge(r))}</span><div class="card-supply">${r.food.length} 处餐饮 · ${r.rest.length} 处歇脚建议 · ${r.photos?.length || 0} 张实拍</div><div class="card-bottom"><span>${esc(r.lane)}</span><em>${active ? "正在查看" : "查看方案 ↗"}</em></div></div></button><button class="favorite-button ${saved.has(r.id) ? "saved" : ""}" data-save="${r.id}" aria-label="${saved.has(r.id) ? "取消收藏" : "收藏"}${esc(r.title)}" aria-pressed="${saved.has(r.id)}">${saved.has(r.id) ? "♥" : "♡"}</button></article>`;
}
