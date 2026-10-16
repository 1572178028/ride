/* Final catalogue summary. Load after every route and research data file. */
(() => {
  'use strict';
  const cities = { xianghu: 'hangzhou', westlake: 'hangzhou', qiandao: 'hangzhou', tonglu: 'hangzhou', qiantangpark: 'hangzhou', canal: 'hangzhou', wengjin: 'jiaxing', nanhu: 'jiaxing', yucun: 'huzhou', mogan: 'huzhou', jiapu: 'huzhou', huaxi: 'huzhou', jinhua: 'jinhua' };
  window.CITY_LABELS = { hangzhou: '杭州', huzhou: '湖州', jiaxing: '嘉兴', shaoxing: '绍兴', jinhua: '金华' };
  window.REGION_LABELS = { xianghu: '萧山 · 湘湖', wengjin: '海宁 · 翁金线', qiandao: '淳安 · 千岛湖', tonglu: '桐庐 · 富春江', qiantangpark: '钱塘 · 湿地外围', westlake: '西湖与茶山', yucun: '安吉 · 余村', mogan: '德清 · 莫干山山麓', jiapu: '长兴 · 夹浦滨湖', huaxi: '长兴 · 城南画溪', nanhu: '南湖外围街道', jinhua: '江北 · 铁路公园与老城', canal: '拱墅 · 运河桥西' };
  for (const r of ROUTES) {
    r.cityGroup = cities[r.region];
    if (r.window === 'night' && !r.nightRide) r.nightRide = {
      window: '停车免费窗口18:00—次日08:30；预留装卸车、休息和取车时间',
      lighting: '全程照明未现场核实；不能以停车免费推断绿道全程有灯。前后灯及反光装备必备。',
      parking: r.parking.condition,
      supply: '驿站与商户夜间开放未确认，自带水与基础补给。', source: r.parking.source
    };
  }
  const count = values => new Set(values).size;
  const parkingId = r => r.parking.id || r.parking.poiid;
  const parkingCount = type => count(ROUTES.filter(r => r.parking.feeType === type).map(parkingId));
  window.ROUTE_METADATA = { updated: '2026-10-16', routeCount: ROUTES.length,
    familyCount: count(ROUTES.map(r => r.familyId)), regionCount: count(ROUTES.map(r => r.region)),
    cityCount: count(ROUTES.map(r => r.cityGroup)), parkingCount: count(ROUTES.map(parkingId)),
    freeParkingCount: parkingCount('free'), paidParkingCount: parkingCount('paid'), unknownParkingCount: parkingCount('unknown'),
    shopCount: count(ROUTES.flatMap(r => r.food.map(p => p.id || p.name))),
    restSuggestionCount: count(ROUTES.flatMap(r => r.rest.map(p => p.id || p.name))),
    researchCount: EXPANSION_CANDIDATES.length,
    photoCount: count(ROUTES.flatMap(r => (r.photos || []).map(p => p.src))) };
})();
