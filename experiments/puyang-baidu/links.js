import { ROUTES } from "../../src/data/index.js";

// Throwaway compatibility probe. Do not expose this as verified navigation.
const route = ROUTES.find(({ id }) => id === "puyang-greenway");
const [start, entrance, middle, turn] = route.stops;
export const cases = [
  { id: "baseline", title: "1. 基础骑行：仅起终点", points: [start, turn], note: "临浦道路起点 → 义桥方向折返点；不带途经点，先确认 App 能显示骑行路线。" },
  { id: "outbound", title: "2. 去程：带两个途经点", points: [start, entrance, middle, turn], note: "临浦 → 绿道口 → 滨水中段 → 义桥方向折返点。约为本站往返的一半，不是完整往返。" },
  { id: "inbound", title: "3. 返程：带两个途经点", points: [turn, middle, entrance, start], note: "义桥方向折返点 → 滨水中段 → 绿道口 → 临浦。与去程分别测试。" },
  { id: "roundtrip", title: "4. 完整往返：起终点相同", points: [start, entrance, middle, turn, middle, entrance, start], note: "临浦出发，经义桥方向折返点，再经原走廊返回临浦。重点检查五个途经点的顺序，以及是否被压缩成零距离。" },
];

const coord = value => Number(value.toFixed(6));
const endpoint = ({ name, gcj: [lng, lat] }) =>
  `name:${name}|latlng:${coord(lat)},${coord(lng)}`;

export function baiduRouteLink(points, platform = "ios", alternate = false) {
  // Android's official browser examples use bdapp; iOS direction uses baidumap.
  const primary = platform === "android" ? "bdapp" : "baidumap";
  const scheme = alternate ? (primary === "bdapp" ? "baidumap" : "bdapp") : primary;
  const params = {
    origin: endpoint(points[0]),
    destination: endpoint(points.at(-1)),
    mode: "riding",
    coord_type: "gcj02",
    region: "杭州市",
    src: `${platform === "android" ? "andr" : "ios"}.rideatlas.routes`,
  };
  if (points.length > 2) params.viaPoints = JSON.stringify({
    viaPoints: points.slice(1, -1).map(({ name, gcj: [lng, lat] }) => ({
      name, lat: coord(lat), lng: coord(lng),
    })),
  });
  return `${scheme}://map/direction?${Object.entries(params).map(([key, value]) =>
    `${key}=${encodeURIComponent(value)}`).join("&")}`;
}
