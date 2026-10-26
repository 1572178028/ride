import { buildRoutePlans, selectRouteWaypoints } from "./route-waypoints.js";

// This normalizes navigation reference points, without changing the stored SVG geometry.
export function buildRouteNavigation(route, storedPath, geometry) {
  const onlyOutbound = route.shape === "原路往返" && storedPath[0].join(",") !== storedPath.at(-1).join(",");
  const path = geometry?.path || (onlyOutbound
    ? [...storedPath, ...storedPath.slice(0, -1).toReversed()] : storedPath);
  const nearest = point => path.reduce((best, p) =>
    Math.hypot(p[0] - point[0], p[1] - point[1]) < Math.hypot(best[0] - point[0], best[1] - point[1]) ? p : best, path[0]);
  const anchors = route.stops.map(stop => ({ ...stop, point: nearest(stop.point) }));
  anchors[0] = { name: route.start.name, point: path[0] };
  if (geometry) anchors.push({ name: route.stops.at(-1).name, point: path[geometry.turnIndex] });
  const plans = buildRoutePlans(path, anchors, route.shape);
  const returnRide = !!plans.outbound;
  const minimumVia = returnRide ? 1 : 3;
  const fallback = selectRouteWaypoints(path, anchors, Infinity,
    Math.min(5, Math.max(minimumVia, Math.floor((plans.full.length - 2) / 2))));
  return { plans, fallback, path, note: geometry?.note || "" };
}
