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
