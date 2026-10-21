import { $, esc } from "../../shared/dom.js";
import { external } from "../../shared/links.js";
import { placeLinks } from "../../shared/navigation.js";
import { toast } from "../../shared/feedback.js";
export function createMapController({
  getSelected,
  getSupplyKind,
  resetSupply,
}) {
  let zoom = 1,
    offset = [0, 0];
  function setViewport() {
    const svg = $("#map-container svg");
    if (!svg) return;
    const w = 1000 / zoom,
      h = 610 / zoom;
    offset[0] = Math.min(450, Math.max(-450, offset[0]));
    offset[1] = Math.min(270, Math.max(-270, offset[1]));
    svg.setAttribute(
      "viewBox",
      `${500 - w / 2 + offset[0]} ${305 - h / 2 + offset[1]} ${w} ${h}`,
    );
  }
  function zoomMap(f) {
    zoom = Math.min(4, Math.max(1, zoom * f));
    setViewport();
  }
  $("#zoom-in").onclick = () => zoomMap(1.3);
  $("#zoom-out").onclick = () => zoomMap(1 / 1.3);
  $("#reset-map").onclick = () => {
    zoom = 1;
    offset = [0, 0];
    setViewport();
  };
  $("#download-map").onclick = () => {
    const a = document.createElement("a");
    a.href = `assets/maps/${getSelected().id}.png`;
    a.download = `骑遇-${getSelected().title}-路线地图.png`;
    a.click();
    toast("正在下载路线地图 PNG。");
  };
  function openPoi(id, focusMap = false) {
    const r = getSelected();
    let f;
    if (id === "parking")
      f = {
        ...r.parking,
        description: r.parking.rule + "；" + r.parking.verification,
      };
    else if (id === "start")
      f = {
        ...r.start,
        description: "道路骑行起点；与停车片区不同的路段按现场通道接驳。",
      };
    else if (id.startsWith("supply-")) f = r.supply[Number(id.split("-")[1])];
    else if (id.startsWith("stop-")) {
      const s = r.stops[Number(id.split("-")[1])];
      if (s) f = { ...s, description: s.note };
    }
    if (!f) return;
    if (
      focusMap &&
      getSupplyKind() !== "all" &&
      !document.querySelector('#map-container [data-poi="' + id + '"]')
    ) {
      resetSupply();
    }
    const links = placeLinks(f, r);
    $("#poi-popup").innerHTML =
      `<div><b>${esc(f.name)}</b><span>${esc(f.description)}</span></div><div>${external(links.amap, "高德 ↗")}${external(links.baidu, "百度 ↗")}<button aria-label="关闭地点信息" id="close-poi">×</button></div>`;
    $("#poi-popup").hidden = false;
    $("#close-poi").onclick = () => ($("#poi-popup").hidden = true);
    const markers = [...document.querySelectorAll("#map-container [data-poi]")];
    markers.forEach((m) =>
      m.classList.toggle("poi-active", m.dataset.poi === id),
    );
    if (focusMap) {
      zoom = 1;
      offset = [0, 0];
      setViewport();
      $("#map-container").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const marker = markers.find((m) => m.dataset.poi === id);
      if (marker) marker.focus({ preventScroll: true });
    }
  }
  $("#map-container").addEventListener("click", (e) => {
    const marker = e.target.closest("[data-poi]");
    if (marker && !dragged) openPoi(marker.dataset.poi);
  });
  $("#map-container").addEventListener("keydown", (e) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.closest("[data-poi]")
    ) {
      e.preventDefault();
      openPoi(e.target.closest("[data-poi]").dataset.poi);
      return;
    }
    if (
      [
        "+",
        "=",
        "-",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(e.key)
    ) {
      e.preventDefault();
      if (e.key === "+" || e.key === "=") zoomMap(1.3);
      else if (e.key === "-") zoomMap(1 / 1.3);
      else {
        const n = 35 / zoom;
        if (e.key === "ArrowLeft") offset[0] -= n;
        if (e.key === "ArrowRight") offset[0] += n;
        if (e.key === "ArrowUp") offset[1] -= n;
        if (e.key === "ArrowDown") offset[1] += n;
        setViewport();
      }
    }
  });
  let dragging = null,
    dragged = false;
  const map = $("#map-container");
  map.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[data-poi]")) return;
    dragging = { x: e.clientX, y: e.clientY, offset: [...offset] };
    dragged = false;
    map.setPointerCapture(e.pointerId);
  });
  map.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.x,
      dy = e.clientY - dragging.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) dragged = true;
    const rect = map.getBoundingClientRect();
    offset = [
      dragging.offset[0] - (dx * 1000) / rect.width / zoom,
      dragging.offset[1] - (dy * 610) / rect.height / zoom,
    ];
    setViewport();
  });
  map.addEventListener("pointerup", () => {
    dragging = null;
    setTimeout(() => (dragged = false), 0);
  });
  map.addEventListener("pointercancel", () => (dragging = null));

  return {
    openPoi,
    reset() {
      zoom = 1;
      offset = [0, 0];
    },
  };
}
