import { ROUTES } from "./routes/index.js";
import EXPANSION_CANDIDATES from "./candidates/index.js";
import RESEARCH_MAPS from "./candidates/maps.js";
import PHOTO_CATALOG from "./photos/catalog.js";
import maps from "./generated/maps.js";
import paths from "./generated/paths.js";
import metadata from "./generated/metadata.js";
import REGIONAL_PLANS from "./generated/plans.js";
import NAVIGATION_GEOMETRY from "./generated/navigation.js";
import ROUTE_ALIASES from "./aliases.js";
import labels from "./labels.js";
import { summarizeCatalog } from "../domain/catalog-summary.js";
import { wgs84ToGcj02 } from "../shared/coordinates.js";

export {
  ROUTES,
  EXPANSION_CANDIDATES,
  RESEARCH_MAPS,
  PHOTO_CATALOG,
  REGIONAL_PLANS,
  NAVIGATION_GEOMETRY,
  ROUTE_ALIASES,
};
export const MAP_DATA = { ...metadata, maps, paths };
export const RESEARCH_MAP = RESEARCH_MAPS.find(
  (map) => map.id === "westlake-research",
);
export const CITY_LABELS = labels.cities;
export const REGION_LABELS = labels.regions;
export const RIDE_COORDS = { wgs84ToGcj02 };
export const ROUTE_METADATA = summarizeCatalog(
  ROUTES,
  EXPANSION_CANDIDATES,
  "2026-10-26",
);
