export function matchesRoute(r, filters, saved) {
  const term = filters.search.trim().toLowerCase(),
    distance = filters.distance,
    parking = filters.parking,
    favoritesOnly = filters.favoritesOnly;
  return (
    (filters.city === "all" || r.cityGroup === filters.city) &&
    (!term ||
      [
        r.title,
        r.area,
        ...r.tags,
        ...r.supply.map((f) => f.name),
        r.parking.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)) &&
    (filters.region === "all" || r.region === filters.region) &&
    (distance === "all" ||
      (distance === "short" && r.distance <= 8) ||
      (distance === "easy" && r.distance <= 20) ||
      (distance === "long" && r.distance > 20)) &&
    (parking === "all" ||
      (parking === "free" && r.parking.feeType === "free") ||
      (parking === "paid" && r.parking.feeType === "paid") ||
      (parking === "unknown" && r.parking.feeType === "unknown") ||
      (["day", "night"].includes(parking) && r.window === parking)) &&
    (filters.lane === "all" ||
      (filters.lane === "isolated" && r.isolated) ||
      (filters.lane === "cycleway" && r.mapCyclewayKm > 0.1) ||
      (filters.lane === "dedicated" && r.dedicated) ||
      (filters.lane === "mixed" && !r.isolated && !r.dedicated)) &&
    (!favoritesOnly || saved.has(r.id))
  );
}
export const sortVariants = (a, b) => (a.planOrder || 0) - (b.planOrder || 0);
