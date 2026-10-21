import { readFilters, updateRegions } from "./features/filters/index.js";
import { ROUTES, ROUTE_ALIASES, ROUTE_METADATA } from "./data/index.js";
import { $, esc } from "./shared/dom.js";
import { loadFavorites, saveFavorites } from "./features/favorites/storage.js";
import { matchesRoute, sortVariants } from "./domain/route-filters.js";
import { routeCardHTML } from "./features/routes/card.js";
import { routeDetailHTML } from "./features/routes/detail.js";
import { supplyHTML } from "./features/routes/supply.js";
import { initPhotos, openPhoto } from "./features/photos/index.js";
import { initResearch } from "./features/research/index.js";
import { createMapController } from "./features/map/controller.js";
import { makeMapSVG } from "./features/map/renderer.js";
import { toast } from "./shared/feedback.js";
export function startApp() {
  initPhotos();
  const resolveRouteId = (id) => (ROUTE_ALIASES || {})[id] || id;
  const saved = loadFavorites(ROUTES, resolveRouteId, () => localStorage);
  let supplyKind = "all",
    favoritesOnly = false,
    selected =
      ROUTES.find(
        (r) =>
          r.id ===
          resolveRouteId(
            new URLSearchParams(location.hash.slice(1)).get("route"),
          ),
      ) || ROUTES[0];
  const mapController = createMapController({
    getSelected: () => selected,
    getSupplyKind: () => supplyKind,
    resetSupply: () => {
      supplyKind = "all";
      renderSupply();
    },
  });
  function updateFavoriteCount() {
    $("#saved-count").textContent = saved.size;
    $("#saved-filter").setAttribute("aria-pressed", String(favoritesOnly));
  }
  function toggleFavorite(id) {
    const pageScroll = scrollY;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    try {
      saveFavorites(saved, () => localStorage);
    } catch {
      toast("当前浏览器无法保存收藏，关闭页面后可能丢失。");
    }
    renderList();
    updateFavoriteCount();
    scrollTo({ top: pageScroll, behavior: "instant" });
  }
  function matches(r) {
    return matchesRoute(r, readFilters(favoritesOnly), saved);
  }
  function renderList() {
    const focused = document.activeElement,
      focusKey = focused?.dataset?.select
        ? "select"
        : focused?.dataset?.save
          ? "save"
          : null,
      focusValue = focusKey && focused.dataset[focusKey];
    const listScroll = $("#route-list").scrollTop;
    const filtered = ROUTES.filter(matches),
      families = new Map();
    for (const route of filtered) {
      if (!families.has(route.familyId)) families.set(route.familyId, []);
      families.get(route.familyId).push(route);
    }
    if (filtered.length && !filtered.some((r) => r.id === selected?.id)) {
      selected =
        filtered.find(
          (r) =>
            r.id ===
            ROUTES.find((v) => v.id === filtered[0].familyId)?.preferredPlanId,
        ) || filtered[0];
      renderDetail();
    }
    const picker = $("#selected-heading .variant-picker");
    if (filtered.length && picker) {
      const html = variantPickerHTML(selected);
      if (picker.outerHTML !== html) picker.outerHTML = html;
    }
    $("#result-count").textContent =
      `${families.size} 条主线 · ${filtered.length} 种里程方案${favoritesOnly ? " · 我的收藏" : ""}`;
    $("#route-list").innerHTML = [...families.values()]
      .map((variants) => routeCardHTML(variants, { selected, saved }))
      .join("");
    if (!filtered.length) {
      $("#route-list").innerHTML =
        `<div class="empty"><h3>${favoritesOnly ? "还没有符合条件的收藏" : "没有符合条件的路线"}</h3><p>${$("#lane-filter").value === "dedicated" ? "当前暂无已确认覆盖自行车专用道的路线；隔离绿道不等于自行车专用道。" : "试试其他距离、时段或关键词。"}</p><button class="secondary" id="clear-filters">重置筛选</button></div>`;
      $("#route-view").hidden = true;
      $("#clear-filters").onclick = clearFilters;
      return;
    }
    $("#route-view").hidden = false;
    // Keep selection visible inside the sidebar without moving the page.
    const list = $("#route-list"),
      card = list.querySelector(".selected");
    list.scrollTop = listScroll;
    if (card) {
      const c = card.getBoundingClientRect(),
        l = list.getBoundingClientRect();
      if (innerWidth <= 760) list.scrollLeft += c.left - l.left - 2;
      else if (c.top < l.top) list.scrollTop += c.top - l.top - 2;
      else if (c.bottom > l.bottom) list.scrollTop += c.bottom - l.bottom + 2;
    }
    if (focusKey) {
      const target = [...list.querySelectorAll(`[data-${focusKey}]`)].find(
        (el) => el.dataset[focusKey] === focusValue,
      );
      target?.focus({ preventScroll: true });
    }
  }
  function variantPickerHTML(r) {
    const variants = ROUTES.filter(
      (v) => v.familyId === r.familyId && matches(v),
    ).sort(sortVariants);
    return `<div class="variant-picker" role="group" aria-label="选择本路线里程方案"><span>同一片区 · 选择骑行方案</span><div>${variants.map((v) => `<button data-variant="${v.id}" aria-pressed="${v.id === r.id}">${v.distance.toFixed(1)} km <small>${esc(v.shortTitle || v.shape)}</small></button>`).join("")}</div><p>同一片区只显示一个路线入口。各方案的道路与停车起点可能不同，请按当前方案的地图和导航出发。</p></div>`;
  }
  $("#selected-heading").addEventListener("click", (e) => {
    const button = e.target.closest("[data-variant]");
    if (!button) return;
    selected = ROUTES.find((r) => r.id === button.dataset.variant);
    renderDetail();
    renderList();
  });
  function clearFilters() {
    favoritesOnly = false;
    $("#search").value = "";
    $("#distance-filter").value = "all";
    $("#parking-filter").value = "all";
    $("#lane-filter").value = "all";
    $("#city-filter").value = "all";
    $("#region-filter").value = "all";
    updateRegions();
    updateFavoriteCount();
    renderList();
  }
  function renderDetail() {
    const r = selected,
      p = r.parking;
    mapController.reset();
    $("#selected-heading").innerHTML =
      `<div class="route-topline"><span>ROUTE ${ROUTES.find((v) => v.id === r.familyId).number} / ${esc(r.area)}</span><span class="tag">${r.shape}</span></div><h2>${esc(r.title)}</h2><p class="selected-subtitle">${esc(r.subtitle)}</p><div class="route-summary${p.feeType !== "free" ? " paid-summary" : ""}"><div><strong><span class="km">${r.distance.toFixed(1)}</span> <span>km</span></strong><small>总骑行里程 · 估算</small></div><div><strong>${r.duration}</strong><small>骑行时间 · 不含探店</small></div><div><strong>${r.level}</strong><small>线路强度</small></div><div><strong>${esc(p.feeBasis === "user-default-roadside" ? "默认免费" : p.feeType !== "free" ? p.priceSummary || p.price : "¥0")}</strong><small>${p.feeType !== "free" ? "停车资料 · 见费用条件" : "满足条件时的停车费"}</small></div></div>${variantPickerHTML(r)}`;
    $("#map-container").innerHTML = makeMapSVG(r, {
      supplyKind,
      markerScale: innerWidth <= 760 ? 2.4 : 1,
    });
    $("#poi-popup").hidden = true;
    $("#route-detail").innerHTML = routeDetailHTML(r, { supplyKind });
    $("#copy-stops").onclick = async () => {
      const text = [
        r.title,
        `${r.distance.toFixed(1)} km · ${r.shape}`,
        `停车：${p.name}｜${p.rule}（公开资料依据，出发前确认）`,
        r.stops
          .map((s) => s.name)
          .concat([p.name])
          .join(" → "),
      ].join("\n");
      try {
        await navigator.clipboard.writeText(text);
        toast("途经点已复制，可在地图 App 中逐个搜索。");
      } catch {
        const t = document.createElement("textarea");
        t.value = text;
        t.style.position = "fixed";
        t.style.left = "-9999px";
        document.body.append(t);
        t.select();
        const ok = document.execCommand("copy");
        t.remove();
        toast(ok ? "途经点已复制。" : "复制失败，请从“一路怎么骑”手动复制。");
      }
    };
    history.replaceState(null, "", "#route=" + r.id);
  }
  function renderSupply() {
    $("#supply-content").innerHTML = supplyHTML(selected, supplyKind);
    mapController.reset();
    $("#map-container").innerHTML = makeMapSVG(selected, {
      supplyKind,
      markerScale: innerWidth <= 760 ? 2.4 : 1,
    });
    $("#poi-popup").hidden = true;
  }
  $("#route-detail").addEventListener("click", (e) => {
    const photo = e.target.closest("[data-photo]");
    if (photo) {
      const owner =
        (selected.researchExtensions || []).find(
          (c) => c.id === photo.dataset.photoOwner,
        ) || selected;
      openPhoto(Number(photo.dataset.photo), owner);
      return;
    }
    const filter = e.target.closest("[data-supply-kind]");
    if (filter) {
      supplyKind = filter.dataset.supplyKind;
      renderSupply();
      return;
    }
    const locate = e.target.closest("[data-locate]");
    if (locate) mapController.openPoi(locate.dataset.locate, true);
  });
  $("#route-list").addEventListener("click", (e) => {
    const save = e.target.closest("[data-save]");
    if (save) {
      toggleFavorite(save.dataset.save);
      return;
    }
    const card = e.target.closest("[data-select]");
    if (card) {
      selected = ROUTES.find((r) => r.id === card.dataset.select);
      renderDetail();
      renderList();
      $("#route-view").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  });
  $("#city-filter").onchange = () => {
    updateRegions();
    renderList();
  };
  [
    "#search",
    "#region-filter",
    "#distance-filter",
    "#parking-filter",
    "#lane-filter",
  ].forEach((sel) =>
    $(sel).addEventListener(sel === "#search" ? "input" : "change", renderList),
  );
  $("#saved-filter").onclick = () => {
    favoritesOnly = !favoritesOnly;
    updateFavoriteCount();
    renderList();
  };
  $("#saved-nav").onclick = () => {
    favoritesOnly = true;
    updateFavoriteCount();
    renderList();
    $("#route-library").scrollIntoView({ behavior: "smooth" });
  };
  const dialog = $("#coverage-dialog");
  $("#coverage-button").onclick = () => dialog.showModal();
  dialog.querySelector(".dialog-close").onclick = () => dialog.close();
  dialog.querySelector(".dialog-close-action").onclick = () => dialog.close();
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  window.addEventListener("hashchange", () => {
    const id = resolveRouteId(
        new URLSearchParams(location.hash.slice(1)).get("route"),
      ),
      r = ROUTES.find((r) => r.id === id);
    if (r) {
      clearFilters();
      selected = r;
      renderDetail();
      renderList();
    }
  });
  $("#coverage-region-count").textContent = ROUTE_METADATA.regionCount;
  $("#total-routes").textContent = String(
    new Set(ROUTES.map((r) => r.familyId)).size,
  ).padStart(2, "0");
  $("#total-parking").textContent = String(
    ROUTE_METADATA.parkingCount,
  ).padStart(2, "0");
  $("#ending-count").textContent = new Set(ROUTES.map((r) => r.familyId)).size;
  $("#coverage-count").textContent = new Set(
    ROUTES.map((r) => r.familyId),
  ).size;
  $("#total-plans").textContent = String(ROUTES.length).padStart(2, "0");
  document
    .querySelectorAll(".plan-count")
    .forEach((el) => (el.textContent = ROUTES.length));
  initResearch();
  updateRegions();
  updateFavoriteCount();
  renderDetail();
  renderList();
}
