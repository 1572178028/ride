import { $, esc } from "../../shared/dom.js";
import { external } from "../../shared/links.js";
function photoMatchHTML(p) {
  const m = p.matchAssessment;
  if (!m) return '<span class="photo-match unscored">关联程度待评分</span>';
  const score = m.source + m.location + m.track + m.visual;
  const tier = score > 85 ? "dark" : score >= 70 ? "medium" : "light";
  const label =
    score > 85
      ? "深绿 · 路段高度关联"
      : score >= 70
        ? "中绿 · 线路关联"
        : "浅绿 · 线路参考";
  return `<details class="photo-assessment"><summary><span class="photo-match ${tier}" aria-label="${label}，关联评分 ${score}%">${score}%</span></summary><p>关联评分，非定位概率。出处 ${m.source}/20 · 地点 ${m.location}/40 · 轨迹 ${m.track}/20 · 画面 ${m.visual}/20</p><p>${esc(m.reason)}</p></details>`;
}
function photosHTML(r) {
  const photos = (r.photos || []).filter(
    (p) =>
      !p.matchAssessment ||
      (!p.matchAssessment.conflict &&
        p.matchAssessment.source +
          p.matchAssessment.location +
          p.matchAssessment.track +
          p.matchAssessment.visual >=
          60),
  );
  if (!photos.length)
    return r.familyId
      ? `<section class="route-photos photo-empty"><div class="photo-heading"><h3>实拍待补</h3></div><p>${esc(r.photoGap || "暂无已核对的线路实拍。")}</p></section>`
      : "";
  return `<section class="route-photos"><div class="photo-heading"><h3>${r.familyId ? "道路实拍" : "研究区景点参考"}</h3><span>${photos.length} 张 · 点击放大</span></div><p>道路图按关联程度展示：浅绿 60–69%，中绿 70–85%，深绿 >85%。评分是证据关联评估，非定位概率；历史照片不代表当前路况。未评分旧图单独注明。</p>${r.photoMissing ? `<p class="photo-relation">目标 ${r.photoTarget} 张，仍待补 ${r.photoMissing} 张对应路段的道路图。</p>` : ""}<div class="photo-grid">${photos.map((p, i) => `<figure><button class="photo-open" data-photo="${(r.photos || []).indexOf(p)}" data-photo-owner="${esc(r.id)}" aria-label="放大${esc(p.caption)}"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy" decoding="async"><span>查看实拍 ↗</span></button><figcaption>${photoMatchHTML(p)}<span class="photo-kind ${p.kind === "road" ? "photo-road" : ""}">${p.kind !== "road" ? "研究景点" : p.referenceOnly ? "道路参考 · 精确路段待核" : "道路环境"}</span><b>${esc(p.caption)}</b>${p.relation ? `<p class="photo-relation">${esc(p.relation)}</p>` : ""}<small>${esc(p.date || "日期未注明")} · ${esc(p.author)}</small><div>${external(p.source, "原始出处 ↗")}${p.licenseUrl ? external(p.licenseUrl, esc(p.license) + " ↗") : `<span>${esc(p.license)}${p.captureDate ? " · 截取于" + esc(p.captureDate) : ""}</span>`}</div></figcaption></figure>`).join("")}</div></section>`;
}
export function initPhotos() {
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG" && e.target.closest(".photo-open")) {
        e.target.closest(".photo-open").classList.add("photo-unavailable");
        e.target.alt = "图片暂无法加载，请查看下方原始出处";
      }
    },
    true,
  );
}
function openPhoto(index, owner) {
  const p = (owner.photos || [])[index];
  if (!p) return;
  let d = $("#photo-dialog");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "photo-dialog";
    d.setAttribute("aria-label", "景观实拍放大预览");
    document.body.append(d);
    d.addEventListener("click", (e) => {
      if (e.target === d) d.close();
    });
  }
  d.innerHTML = `<button class="dialog-close photo-close" aria-label="关闭实拍预览">×</button><img src="${esc(p.src)}" alt="${esc(p.caption)}"><h3>${esc(p.caption)}</h3>${photoMatchHTML(p)}<p>${esc(p.date || "日期未注明")} · ${esc(p.author)} · ${esc(p.license)}</p>${p.relation ? `<p>${esc(p.relation)}</p>` : ""}<div>${external(p.source, "查看原始出处 ↗")}${p.licenseUrl ? external(p.licenseUrl, "图片许可 ↗") : ""}${p.captureDate ? `<span>截图日期：${esc(p.captureDate)}</span>` : ""}</div>`;
  d.querySelector(".photo-close").onclick = () => d.close();
  d.showModal();
}

export { photoMatchHTML, photosHTML, openPhoto };
