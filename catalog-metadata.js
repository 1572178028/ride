/* Final catalogue summary. Load after every route and research data file. */
(() => {
  'use strict';
  const cities = { xianghu: 'hangzhou', westlake: 'hangzhou', qiandao: 'hangzhou', tonglu: 'hangzhou', qiantangpark: 'hangzhou', canal: 'hangzhou', binjiang: 'hangzhou', qianjiang: 'hangzhou', wengjin: 'jiaxing', nanhu: 'jiaxing', yucun: 'huzhou', mogan: 'huzhou', jiapu: 'huzhou', huaxi: 'huzhou', jinhua: 'jinhua' };
  window.CITY_LABELS = { hangzhou: '杭州', huzhou: '湖州', jiaxing: '嘉兴', shaoxing: '绍兴', jinhua: '金华' };
  window.REGION_LABELS = { xianghu: '萧山 · 湘湖', wengjin: '海宁 · 翁金线', qiandao: '淳安 · 千岛湖', tonglu: '桐庐 · 富春江', qiantangpark: '钱塘 · 湿地外围', westlake: '西湖 · 龙井与梅灵茶山', yucun: '安吉 · 余村', mogan: '德清 · 莫干山山麓', jiapu: '长兴 · 夹浦滨湖', huaxi: '长兴 · 城南画溪', nanhu: '南湖外围街道', jinhua: '江北 · 铁路公园与老城', canal: '拱墅 · 运河桥西', binjiang: '滨江 · 闻涛路西段', qianjiang: '上城 · 钱江新城' };
  // One destination entry; each plan keeps its own geometry, navigation and photos.
  const xianghuPlans = [
    ['xianghu-lakeside', '二期湖岸环线'],
    ['xianghu-shanshan', '上善桥短线'],
    ['xianghu-color', '三期七彩绿道'],
    ['xianghu-hegong', '贺公堤往返'],
    ['xianghu-two-lakes', '两湖联骑']
  ];
  xianghuPlans.forEach(([id, label], order) => {
    const route = ROUTES.find(r => r.id === id);
    route.familyId = 'xianghu-lakeside';
    route.familyTitle = '湘湖 · 二三期湖岸与七彩绿道';
    route.shortTitle = label;
    route.planOrder = order;
  });
  const xianghuMain = ROUTES.find(r => r.id === 'xianghu-lakeside');
  xianghuMain.area = '萧山 · 湘湖二期与三期';
  xianghuMain.title = '湘湖二期 · 湖岸环线';
  // The three Wengjin distances share the outlet parking and road start.
  ['wengjin-short', 'wengjin-middle', 'wengjin-yanguan'].forEach((id, order) => {
    const route = ROUTES.find(r => r.id === id);
    route.familyId = 'wengjin-short';
    route.familyTitle = '翁金线 · 奥莱出发至盐官';
    route.shortTitle = ['入门短线', '林荫半日往返', '盐官长线'][order];
    route.planOrder = order;
  });
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
  window.ROUTE_METADATA = { updated: '2026-10-20', routeCount: ROUTES.length,
    familyCount: count(ROUTES.map(r => r.familyId)), regionCount: count(ROUTES.map(r => r.region)),
    cityCount: count(ROUTES.map(r => r.cityGroup)), parkingCount: count(ROUTES.map(parkingId)),
    freeParkingCount: parkingCount('free'), paidParkingCount: parkingCount('paid'), unknownParkingCount: parkingCount('unknown'),
    shopCount: count(ROUTES.flatMap(r => r.food.map(p => p.id || p.name))),
    restSuggestionCount: count(ROUTES.flatMap(r => r.rest.map(p => p.id || p.name))),
    researchCount: EXPANSION_CANDIDATES.length,
    photoFamilyCount: count(ROUTES.filter(r=>(r.photos||[]).length).map(r=>r.familyId)),
    photoRouteCount: ROUTES.filter(r=>(r.photos||[]).length).length,
    photoCount: count(ROUTES.flatMap(r => (r.photos || []).map(p => p.src))) };
})();
