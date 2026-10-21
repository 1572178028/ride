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
const baidu = (gcj, name, mode = "driving") =>
  "https://api.map.baidu.com/direction?" +
  new URLSearchParams({
    origin: "我的位置",
    destination: "latlng:" + gcj[1] + "," + gcj[0] + "|name:" + name,
    mode,
    coord_type: "gcj02",
    output: "html",
    src: "webapp.rideatlas.routes",
  });
const baiduSearch = (name, region) =>
  "https://api.map.baidu.com/place/search?" +
  new URLSearchParams({
    query: name,
    region,
    output: "html",
    src: "webapp.rideatlas.routes",
  });
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
  return (
    "https://api.map.baidu.com/direction?" +
    new URLSearchParams({
      origin: "我的位置",
      destination: navCity(r) + " " + name,
      mode: "driving",
      region: navCity(r),
      output: "html",
      src: "webapp.rideatlas.routes",
    })
  );
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
      ? baidu(coords, f.name, "riding")
      : baiduSearch(name, navCity(r)),
  };
}

export {
  amap,
  amapPoi,
  amapSearch,
  baidu,
  baiduSearch,
  navCity,
  baiduNamed,
  placeLinks,
};
