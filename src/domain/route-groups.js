// Browsing may collect independent routes without changing their stable IDs.
export const browseGroupId = (route) => route.browseGroup?.id || route.familyId;
export const browseRegion = (route) => route.browseGroup?.region || route.region;
