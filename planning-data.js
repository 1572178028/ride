/* New plans reuse the original, sourced parking hubs and stored road geometry.
 * They do not establish new parking policies, shop openings, or on-site facilities. */
(() => {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const original = Object.fromEntries(ROUTES.map(route => [route.id, route]));
  const path = id => MAP_DATA.paths[id];
  const lengthKm = points => points.slice(1).reduce((total, point, i) => {
    const a = points[i], rad = Math.PI / 180;
    const q = Math.sin((point[1] - a[1]) * rad / 2) ** 2
      + Math.cos(a[1] * rad) * Math.cos(point[1] * rad)
      * Math.sin((point[0] - a[0]) * rad / 2) ** 2;
    return total + 12742 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }, 0);
  // OSM coordinates are WGS84; navigation providers use GCJ-02 in mainland China.
  function toGcj(point) {
    const [lng, lat] = point, x = lng - 105, y = lat - 35, pi = Math.PI;
    let dLat = -100 + 2 * x + 3 * y + .2 * y * y + .1 * x * y + .2 * Math.sqrt(Math.abs(x));
    let dLng = 300 + x + 2 * y + .1 * x * x + .1 * x * y + .1 * Math.sqrt(Math.abs(x));
    const wave = (a, b) => (20 * Math.sin(6 * a * pi) + 20 * Math.sin(2 * b * pi)) * 2 / 3;
    dLat += wave(x, x) + (20 * Math.sin(y * pi) + 40 * Math.sin(y / 3 * pi)) * 2 / 3 + (160 * Math.sin(y / 12 * pi) + 320 * Math.sin(y / 30 * pi)) * 2 / 3;
    dLng += wave(x, x) + (20 * Math.sin(x * pi) + 40 * Math.sin(x / 3 * pi)) * 2 / 3 + (150 * Math.sin(x / 12 * pi) + 300 * Math.sin(x / 30 * pi)) * 2 / 3;
    const rad = lat * pi / 180, magic = 1 - .00669342162296594323 * Math.sin(rad) ** 2;
    const sqrt = Math.sqrt(magic), a = 6378245;
    return [lng + dLng * 180 / (a / sqrt * Math.cos(rad) * pi), lat + dLat * 180 / (a * (1 - .00669342162296594323) / (magic * sqrt) * pi)];
  }

  function newPlan(baseId, details, points) {
    const route = { ...clone(original[baseId]), ...details };
    route.distance = Math.round(lengthKm(points) * (route.shape === '原路往返' ? 2 : 1) * 10) / 10;
    route.planBasis = '不同里程的规划方案，尚未实骑；免费停车条件与资料日期见下方。';
    route.notes = [
      ...details.notes,
      '新增的是路线规划方案，未完成实骑或电话核验；地图不是实时导航，不代表每个路口均开放。',
      '免费规则依据公开资料，出发前确认入口公示；若与公示不符，请放弃该停车方案。'
    ];
    MAP_DATA.paths[route.id] = clone(points);
    ROUTES.push(route);
  }

  newPlan('xianghu-lakeside', {
    id: 'xianghu-shanshan', number: '05', title: '上善桥 · 入门折返',
    subtitle: '不用骑很远，也能把湖风装进周末。', area: '萧山 · 湘湖二期',
    duration: '0.5—1 小时', shape: '原路往返', level: '入门',
    tags: ['短途', '湖景', '折叠车友好', '夜骑'],
    description: '从老虎洞游客中心沿二期湖岸线骑到上善桥附近，再原路返回。适合第一次 4+2、试车或时间有限的晚上；没有新开辟路段。',
    stops: [clone(original['xianghu-lakeside'].stops[0]), {
      name: '上善桥附近折返', point: clone(path('xianghu-lakeside')[85]),
      note: '不到桥面停留，找到不妨碍行人的位置短暂看湖，再原路回到停车点。'
    }],
    notes: ['18:00 后入场才使用夜间免费方案；白天停车不免费。', '可选咖啡店不在这段短线正线上，需额外绕行；可只在起点附近吃饭。']
  }, path('xianghu-lakeside').slice(0, 86));

  newPlan('xianghu-color', {
    id: 'xianghu-hegong', number: '06', title: '贺公堤 · 湖岸往返',
    subtitle: '沿七彩湖岸，到堤边看一会儿风景。', area: '萧山 · 湘湖二期至三期',
    duration: '1—1.5 小时', shape: '原路往返', level: '轻松',
    tags: ['湖景', '七彩绿道', '往返', '夜骑'],
    description: '使用二期老虎洞停车点，沿七彩绿道方案的前半段，经金沙戏水外围到贺公堤附近，再原路返回。与完整环线不同，方便按体力提前掉头。',
    stops: [clone(original['xianghu-color'].stops[0]), clone(original['xianghu-color'].stops[1]), {
      name: '贺公堤附近折返', point: clone(path('xianghu-color')[219]),
      note: '不进入禁止自行车通行的路段，在允许通行的位置折返。'
    }],
    notes: ['骑三期、停二期；不能将一期二期夜间免费政策套用到三期其他停车场。', '秋冬 18:00 后较暗，需车灯；首次探索优先选择日照较长的季节。']
  }, path('xianghu-color').slice(0, 220));

  newPlan('xianghu-lakeside', {
    id: 'xianghu-two-lakes', number: '07', title: '湘湖 × 定山湖 · 两湖联骑',
    subtitle: '两个湖岸环线，接成一段更完整的夜游。', area: '萧山 · 湘湖二期及三期',
    duration: '2—2.5 小时', shape: '双环线', level: '休闲进阶',
    tags: ['湖景', '长距离', '七彩绿道', '夜骑'],
    laneDetail: '串联二期环湖与三期七彩绿道方案。主体为与机动车分隔的慢行空间，行人共用；接驳、桥口及临时封闭处遵守现场指示，不代表连续自行车专用道。',
    description: '先完成二期湖岸慢骑，回到老虎洞附近，再接定山湖环线。两圈共用同一停车点，中途可以结束行程，适合已有十几公里骑行经验的人。',
    stops: [clone(original['xianghu-lakeside'].stops[0]),
      clone(original['xianghu-lakeside'].stops[1]), clone(original['xianghu-lakeside'].stops[2]),
      { name: '回到老虎洞附近', point: clone(original['xianghu-lakeside'].start.point), note: '完成第一圈，按体力决定是否继续；随时可结束行程取车。' },
      clone(original['xianghu-color'].stops[1]), clone(original['xianghu-color'].stops[2]),
      clone(original['xianghu-color'].stops[3])],
    notes: ['需要满足从停车入场至取车全程均在 18:00—次日 08:30 免费窗口内。', '两圈相接，里程包含重复接驳段，不是一个不重复的景区大环线。', '全程照明未实地确认，不建议缺少照明装备时夜骑。']
  }, [...path('xianghu-lakeside'), ...path('xianghu-color').slice(1)]);

  newPlan('wengjin-yanguan', {
    id: 'wengjin-middle', number: '08', title: '翁金线 · 林荫半日往返',
    subtitle: '比初体验再远一点，不必一次骑到盐官。', area: '下沙周边 · 海宁长安沿江',
    duration: '2—3 小时', shape: '原路往返', level: '休闲进阶',
    tags: ['公路', '林荫', '日间', '半日'],
    description: '从下沙奥特莱斯出发，沿盐官方向线路骑至林荫公路中段折返。里程介于原有 15.8 公里和 41 公里之间，适合逐步增加骑行距离。',
    stops: [clone(original['wengjin-yanguan'].stops[0]), clone(original['wengjin-yanguan'].stops[1]), {
      name: '林荫公路中段折返', point: clone(path('wengjin-yanguan')[213]),
      note: '本点为规划折返位置，不是已确认驿站；选择安全的允许掉头处，不在机动车道停留。'
    }],
    notes: ['主要为普通道路，不因为在翁金线附近就宣称包含专用自行车道。', '商场开放后出发，并确认可取车时间；途中没有新增已核验商家，请自备水和补给。']
  }, path('wengjin-yanguan').slice(0, 214));

  const restSuggestion = (name, point, description, location) => ({
    name, point: clone(point), gcj: toGcj(point), kind: '歇脚', mapLabel: name.replace('周边', ''),
    query: name.replace(/（.*?）/g, ''), location,
    description, status: '规划歇脚建议 · 非设施核验',
    source: `https://www.openstreetmap.org/?mlat=${point[1]}&mlon=${point[0]}#map=17/${point[1]}/${point[0]}`,
    sourceTitle: '位置参考 · OpenStreetMap', placement: 'along'
  });
  const lakesideRest = [
    restSuggestion('上善桥周边', original['xianghu-lakeside'].stops[1].point,
      '可在桥旁不妨碍通行的开放区域短暂停留；不在桥面、车道或绿道中央停车。未确认座椅、厕所或饮水设施。', '湘湖二期 · 上善桥附近'),
    restSuggestion('湖山沿湖周边', original['xianghu-lakeside'].stops[2].point,
      '湖岸观景停靠建议。请按现场开放标志选择合法停留位置；不承诺有驿站、遮雨棚或补水设施。', '湘湖二期 · 湖山附近')
  ];
  const colorRest = [
    restSuggestion('金沙戏水外围', original['xianghu-color'].stops[1].point,
      '仅建议在外围允许停留的开放区域短暂休息，不包含收费游乐项目或沙滩入口。未核实休息设施。', '湘湖三期 · 主线途经点'),
    restSuggestion('贺公堤周边', original['xianghu-color'].stops[2].point,
      '湖岸歇脚位置建议；桥堤狭窄处请推行、让路，避免占用骑行和步行通道。未确认夜间照明及设施。', '湘湖三期 · 贺公堤附近'),
    restSuggestion('定山湖西侧湖岸', original['xianghu-color'].stops[3].point,
      '可在开放湖岸寻找不影响通行的短暂停靠位置；地图表示片区，不代表专门休息区或准确座椅位置。', '湘湖三期 · 环线西侧')
  ];
  const outletRest = restSuggestion('下沙奥特莱斯公共区', original['wengjin-short'].start.point,
    '将主要休息与补给安排在出发前和返回后。只在商场开放、允许使用的公共区域休息；座椅、卫生间和饮水位置需现场确认。', '起终点附近 · 商场片区');

  ROUTES.forEach(route => {
    route.parking.checked = '2026-10-14';
    route.parking.verification = '公开资料依据 · 本次未复核';
    route.sourceChecked = '2026-10-14';
    if (route.id === 'xianghu-shanshan') route.rest = clone(lakesideRest.slice(0, 1));
    else if (route.id === 'xianghu-hegong') route.rest = clone(colorRest.slice(0, 2));
    else if (route.id === 'xianghu-two-lakes') route.rest = clone([...lakesideRest, ...colorRest]);
    else if (route.region === 'xianghu') route.rest = clone(route.id === 'xianghu-color' ? colorRest : lakesideRest);
    else route.rest = [clone(outletRest)];

    route.food.forEach(place => {
      place.status = '公开资料收录 · 营业待核查';
      place.checked = '2026-10-14';
      place.query ||= place.name;
      place.placement = place.name.includes('SOMEHOT') ? 'detour' : 'start';
      place.mapLabel = place.kind === '咖啡'
        ? (route.region === 'xianghu' ? '甚好咖啡（支线）' : '星巴克')
        : (route.region === 'xianghu' ? '湘湖大院' : '避风塘（片区）');
    });
    route.supply = [...route.food, ...route.rest];
    route.mapWater = route.region === 'xianghu'
      ? { name: route.id === 'xianghu-color' || route.id === 'xianghu-hegong' ? '定山湖' : '湘湖', point: route.id === 'xianghu-color' || route.id === 'xianghu-hegong' ? [120.202, 30.123] : [120.209, 30.135] }
      : { name: '钱塘江', point: route.id === 'wengjin-short' ? [120.408, 30.370] : [120.486, 30.384] };
  });

  window.ROUTE_METADATA = {
    updated: '2026-10-15', sourcesChecked: '2026-10-14',
    routeCount: ROUTES.length,
    parkingCount: new Set(ROUTES.map(route => route.parking.poiid)).size,
    shopCount: new Set(ROUTES.flatMap(route => route.food.map(place => place.name))).size,
    restSuggestionCount: new Set(ROUTES.flatMap(route => route.rest.map(place => place.name))).size
  };
  window.RIDE_COORDS = { wgs84ToGcj02: toGcj };
})();
