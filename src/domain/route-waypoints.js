// Select existing WGS84 road nodes in travel order; never interpolate off-road.
const distanceKm = (a, b) => {
  const rad = Math.PI / 180;
  return 6371 * Math.hypot(
    (b[0] - a[0]) * rad * Math.cos((a[1] + b[1]) * rad / 2),
    (b[1] - a[1]) * rad,
  );
};
function deviationKm(point, a, b) {
  const scale = Math.cos(a[1] * Math.PI / 180);
  const x = (point[0] - a[0]) * scale, y = point[1] - a[1];
  const dx = (b[0] - a[0]) * scale, dy = b[1] - a[1];
  const t = dx * dx + dy * dy ? Math.max(0, Math.min(1, (x * dx + y * dy) / (dx * dx + dy * dy))) : 0;
  return 111.195 * Math.hypot(x - t * dx, y - t * dy);
}

// Infinity keeps only anchors, for the previously phone-tested fallback.
export function selectRouteWaypoints(path, anchors = [], spacingKm = 1.5) {
  if (path.length < 2) return [];
  const km = [0];
  for (let i = 1; i < path.length; i++) km.push(km[i - 1] + distanceKm(path[i - 1], path[i]));
  const total = km.at(-1);
  if (!total) return [];
  const names = new Map(anchors.map(anchor => [anchor.point.join(","), anchor.name]));
  const selected = new Set([0, path.length - 1]);
  path.forEach((point, i) => { if (names.has(point.join(","))) selected.add(i); });
  // Internal URL-size budget, not a documented Baidu capacity guarantee.
  const target = Math.min(path.length, Math.max(selected.size, Math.min(17, Math.ceil(total / spacingKm) + 1)));
  while (selected.size < target) {
    const indices = [...selected].sort((a, b) => a - b);
    let next = null, longest = -1;
    for (let j = 1; j < indices.length; j++) {
      const a = indices[j - 1], b = indices[j], gap = km[b] - km[a];
      if (b - a < 2 || gap <= longest) continue;
      const midpoint = (km[a] + km[b]) / 2;
      let middle = a + 1, bend = null, maxDeviation = 0.03;
      for (let i = a + 1; i < b; i++) {
        if (Math.abs(km[i] - midpoint) < Math.abs(km[middle] - midpoint)) middle = i;
        // Keep the split away from the ends so added points cover the route.
        if (km[i] < km[a] + gap / 4 || km[i] > km[b] - gap / 4) continue;
        const deviation = deviationKm(path[i], path[a], path[b]);
        if (deviation > maxDeviation) { bend = i; maxDeviation = deviation; }
      }
      next = bend ?? middle;
      longest = gap;
    }
    if (next === null) break;
    selected.add(next);
  }
  return [...selected].sort((a, b) => a - b).map(index => ({
    index, point: path[index], km: km[index],
    name: names.get(path[index].join(",")) || `沿线约${km[index].toFixed(1)}公里处`,
  }));
}

export function buildRoutePlans(path, anchors, shape) {
  const full = selectRouteWaypoints(path, anchors);
  const plans = { full };
  // A circuit also ends at its origin: endpoint equality cannot identify a return ride.
  if (!/往返|折返/.test(shape) || full.length < 3 || !anchors.length) return plans;
  // For enabled return routes the last maintained stop is the explicit turnaround.
  const turnKey = anchors.at(-1).point.join(",");
  const halfway = full.at(-1).km / 2;
  const candidates = full.map((p, i) => ({ p, i })).filter(({ p, i }) =>
    i > 0 && i < full.length - 1 && p.point.join(",") === turnKey);
  const turn = candidates.sort((a, b) => Math.abs(a.p.km - halfway) - Math.abs(b.p.km - halfway))[0];
  if (!turn) return plans;
  const anchorKeys = new Set(anchors.map(anchor => anchor.point.join(",")));
  const leg = (points, label) => points.map(p => ({
    ...p, km: p.km - points[0].km,
    name: anchorKeys.has(p.point.join(",")) ? p.name : `${label}约${(p.km - points[0].km).toFixed(1)}公里处`,
  }));
  // Slice the actual stored return direction; do not reverse the outbound route.
  return { ...plans, outbound: leg(full.slice(0, turn.i + 1), "去程"), inbound: leg(full.slice(turn.i), "返程") };
}
