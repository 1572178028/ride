import { EXPANSION_CANDIDATES } from "../../data/index.js";
import { $, esc } from "../../shared/dom.js";
import { external } from "../../shared/links.js";
import { amapSearch, baiduSearch } from "../../shared/navigation.js";
import { photosHTML, openPhoto } from "../photos/index.js";
function researchParkingHTML(c) {
  if (!c.parkingOptions?.length) return "";
  return `<section class="research-parking"><h4>附近停车备选 · ${c.parkingOptions.length}处</h4><p class="small">地图停车点已补，尚未作为本方向正式骑行起点；接驳缺口见下方。</p>${c.parkingOptions.map((p) => `<article class="parking-option" data-fee-basis="${esc(p.feeBasis)}"><b>${esc(p.name)}</b><p>⌖ ${esc(p.address)}</p><strong>${esc(p.feeLabel)}</strong><p>${esc(p.rule || "费用与取车窗口以现场公示为准。")}</p><p>${esc(p.note)}</p><div>${external(amapSearch(p.query, p.city), "高德查找车位 ↗")} ${external(baiduSearch(p.query, p.city), "百度查找车位 ↗")} ${external(p.source, "地图原始条目 ↗")}</div><small>停车条目核对 ${esc(p.checked)} · 未现场核验</small></article>`).join("")}</section>`;
}
function researchPlacesHTML(c) {
  return (c.places || []).length
    ? `<div class="research-places"><h4>可继续核对的探店地点</h4>${c.places.map((p) => `<article><span>${esc(p.kind)}</span><b>${esc(p.name)}</b><p>${esc(p.location)} · ${esc(p.note)}</p><div>${external(p.source, "已读来源 ↗")}${external(amapSearch(p.name, c.city), "高德查找 ↗")}${external(baiduSearch(p.name, c.city), "百度查找 ↗")}</div></article>`).join("")}<small>仅为调研线索，未计入正式补给统计。</small></div>`
    : "";
}
function roadViewsHTML(c) {
  return c.roadViews?.length
    ? `<details class="research-evidence road-views"><summary>道路街景出处 · 历史影像 ${c.roadViews.length}处</summary><p>以下影像用于对照道路结构，拍摄年月不代表当前路况。仅链接原始全景，不计入本线道路实拍张数，也不据此确认入口延伸已可骑。</p>${c.roadViews.map((v) => `<p><b>${esc(v.title)} · ${esc(v.captured)}</b><br>${esc(v.note)}<br>${external(v.url, "百度 · 打开该处历史街景 ↗")}</p>`).join("")}</details>`
    : "";
}
function researchCardHTML(c, embedded = false) {
  return `<article class="expansion-card" data-research-id="${esc(c.id)}"><div class="area">${esc(c.area)}</div><span class="research-status">${esc(c.status)}</span><h3>${esc(c.title)}</h3><p class="expansion-direction">${esc(c.direction)}</p><p>${esc(c.note)}</p><div class="missing-evidence"><b>${embedded ? "入口延伸还缺" : "收录前还缺"}</b><span>${esc(c.missing)}</span></div>${c.checked ? `<details class="research-evidence"><summary>停车、道路与补给的调研依据</summary><p><b>停车：</b>${esc(c.parkingNote)}</p><p><b>骑行道：</b>${esc(c.roadNote)}</p><p><b>餐饮咖啡：</b>${esc(c.foodNote)}</p><ul>${c.sources.map(([label, url]) => `<li>${external(url, esc(label) + " ↗")}</li>`).join("")}</ul><small>资料记录日 ${esc(c.checked)}${c.reviewedAt ? ` · 本轮复核 ${esc(c.reviewedAt)}` : ""} · 未电话或现场核验</small></details>` : ""}${roadViewsHTML(c)}${researchParkingHTML(c)}${researchPlacesHTML(c)}${photosHTML(c)}${c.preview ? `<details class="research-preview"><summary>展开${esc(c.title)}研究图 ↗</summary><img src="${esc(c.preview)}" alt="${esc(c.title)}道路研究图；停车与接驳尚未确认" loading="lazy"><p>${esc(c.previewNote || c.foodNote)}</p>${external(c.preview, "打开完整研究图 ↗")}${(c.sources || []).map(([label, url]) => external(url, esc(label) + " ↗")).join("")}</details>` : ""}<div class="expansion-links">${external(amapSearch(c.query, c.city), "高德查看片区 ↗")}${external(baiduSearch(c.query, c.city), "百度查看片区 ↗")}</div><small>${embedded ? "以下片区查询与停车备选仅供入口延伸核查，不计入上方2.4公里路线或正式停车起点。" : "片区查询不是已核实停车导航，本方向未计入可出行路线。"}</small></article>`;
}
function routeResearchHTML(r) {
  return (r.researchExtensions || [])
    .map(
      (c) =>
        `<details class="route-extension-research"><summary>片区补充资料 · ${esc(c.title)}（待核实）</summary>${researchCardHTML(c, true)}</details>`,
    )
    .join("");
}
function renderResearch() {
  const region = $("#research-region").value,
    candidates = EXPANSION_CANDIDATES.filter(
      (c) => region === "all" || (c.researchCity || "hangzhou") === region,
    );
  $("#research-summary").textContent =
    `${candidates.length} 个方向已复核，仍待补齐出行依据。`;
  $("#expansion-cards").innerHTML = candidates
    .map((c) => researchCardHTML(c))
    .join("");
}
export function initResearch() {
$("#expansion-cards").addEventListener("click", (e) => {
  const button = e.target.closest("[data-photo]");
  if (!button) return;
  const owner = EXPANSION_CANDIDATES.find(
    (c) => c.id === button.dataset.photoOwner,
  );
  if (owner) openPhoto(Number(button.dataset.photo), owner);
});

  $("#research-region").onchange = renderResearch;
  renderResearch();
}

export { researchPlacesHTML, routeResearchHTML };
