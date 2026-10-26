import { browseRegion } from "./route-groups.js";

/** Derive counts from the catalogue; never maintain totals in patch files. */
export function summarizeCatalog(ROUTES, EXPANSION_CANDIDATES, updated) {
  const count = (values) => new Set(values).size;
  const parkingId = (r) => r.parking.id || r.parking.poiid;
  const parkingCount = (type) =>
    count(ROUTES.filter((r) => r.parking.feeType === type).map(parkingId));
  return {
    updated,
    routeCount: ROUTES.length,
    familyCount: count(ROUTES.map((r) => r.familyId)),
    regionCount: count(ROUTES.map(browseRegion)),
    cityCount: count(ROUTES.map((r) => r.cityGroup)),
    parkingCount: count(ROUTES.map(parkingId)),
    freeParkingCount: parkingCount("free"),
    paidParkingCount: parkingCount("paid"),
    unknownParkingCount: parkingCount("unknown"),
    shopCount: count(ROUTES.flatMap((r) => r.food.map((p) => p.id || p.name))),
    restSuggestionCount: count(
      ROUTES.flatMap((r) => r.rest.map((p) => p.id || p.name)),
    ),
    researchCount: EXPANSION_CANDIDATES.length,
    photoFamilyCount: count(
      ROUTES.filter((r) => (r.photos || []).length).map((r) => r.familyId),
    ),
    photoRouteCount: ROUTES.filter((r) => (r.photos || []).length).length,
    photoCount: count(
      ROUTES.flatMap((r) => (r.photos || []).map((p) => p.src)),
    ),
  };
}
