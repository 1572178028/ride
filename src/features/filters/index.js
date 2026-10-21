import { $, esc } from "../../shared/dom.js";
import { ROUTES, REGION_LABELS } from "../../data/index.js";

export function readFilters(favoritesOnly) {
  return {
    search: $("#search").value,
    city: $("#city-filter").value,
    region: $("#region-filter").value,
    lane: $("#lane-filter").value,
    distance: $("#distance-filter").value,
    parking: $("#parking-filter").value,
    favoritesOnly,
  };
}

export function updateRegions() {
  const city = $("#city-filter").value;
  const previous = $("#region-filter").value;
  const regions = [
    ...new Set(
      ROUTES.filter((r) => city === "all" || r.cityGroup === city).map(
        (r) => r.region,
      ),
    ),
  ];
  $("#region-filter").innerHTML =
    '<option value="all">全部片区</option>' +
    regions
      .map(
        (region) =>
          `<option value="${region}">${esc(REGION_LABELS[region])}</option>`,
      )
      .join("");
  $("#region-filter").value = regions.includes(previous) ? previous : "all";
}
