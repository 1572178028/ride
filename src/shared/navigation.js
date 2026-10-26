import { wgs84ToGcj02 } from "./coordinates.js";
const amap = (gcj, name, mode = "car") =>
  "https://uri.amap.com/navigation?" +
  new URLSearchParams({
    to: gcj.join(",") + "," + name,
    mode,
    coordinate: "gaode",
    src: "ride-atlas",
    callnative: "1",
  });
const amapPoi = (id) =>
  "https://uri.amap.com/poidetail?" +
  new URLSearchParams({ poiid: id, src: "ride-atlas", callnative: "1" });
const amapSearch = (name, region) =>
  "https://uri.amap.com/search?" +
  new URLSearchParams({
    keyword: name,
    city: region,
    src: "ride-atlas",
    callnative: "1",
  });
// The legacy direction URI drops unsupported web modes and treats “我的位置”
// as a POI keyword. Show the target first; Baidu owns departure/mode selection.
const baiduParams = (params) => new URLSearchParams(params).toString().replace(/\+/g, "%20");
const baidu = (gcj, name) =>
  "https://api.map.baidu.com/marker?" +
  baiduParams({
    location: gcj[1] + "," + gcj[0],
    title: name,
    content: "目标位置参考；请选择到这去，并确认出发位置和出行方式。",
    coord_type: "gcj02",
    output: "html",
    src: "webapp.rideatlas.routes",
  });
const baiduSearch = (name, region) =>
  "https://api.map.baidu.com/place/search?" +
  baiduParams({
    query: name,
    region,
    output: "html",
    src: "webapp.rideatlas.routes",
  });
function baiduCyclingRoute(points, region) {
  if (points.length < 2) return null;
  const places = points.map(({ point, name }) => {
    const [lng, lat] = wgs84ToGcj02(point).map(value => Number(value.toFixed(6)));
    return { name, lat, lng };
  });
  const endpoint = ({ name, lat, lng }) => `name:${name}|latlng:${lat},${lng}`;
  const params = {
    origin: endpoint(places[0]), destination: endpoint(places.at(-1)),
    mode: "riding", coord_type: "gcj02", region, src: "ios.rideatlas.routes",
  };
  if (places.length > 2) params.viaPoints = JSON.stringify({ viaPoints: places.slice(1, -1) });
  return "baidumap://map/direction?" + baiduParams(params);
}
function navCity(r) {
  return (
    r.navigationCity ||
    { wengjin: "海宁市", qiandao: "杭州市淳安县", tonglu: "杭州市桐庐县" }[
      r.region
    ] ||
    r.city ||
    "杭州市"
  );
}
function baiduNamed(name, r) {
  // An approximate entrance remains a named lookup, not a precise marker.
  return baiduSearch(name, navCity(r));
}
function placeLinks(f, r) {
  const name = f.query || f.name;
  if (f.namedNavigation)
    return {
      amap: amapSearch(name, navCity(r)),
      baidu: baiduSearch(name, navCity(r)),
    };
  const coords = f.gcj || (f.point ? wgs84ToGcj02(f.point) : null);
  return {
    amap: f.poiid
      ? amapPoi(f.poiid)
      : coords
        ? amap(coords, f.name, "ride")
        : amapSearch(name, navCity(r)),
    baidu: coords
      ? baidu(coords, f.name)
      : baiduSearch(name, navCity(r)),
  };
}

export {
  amap,
  amapPoi,
  amapSearch,
  baidu,
  baiduSearch,
  baiduCyclingRoute,
  navCity,
  baiduNamed,
  placeLinks,
};
