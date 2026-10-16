/* Public-road plans; parking tariffs and shop opening hours are evidence-bound. */
(() => {
  'use strict';
  const checked = '2026-10-16', gcj = RIDE_COORDS.wgs84ToGcj02;
  const osm = (type, id) => `https://www.openstreetmap.org/${type}/${id}`;
  const sources = {
    nanhu: 'https://www.jxxznews.com.cn/bmld/202507/t20250728_6100727.shtml',
    nanhuFood: 'https://tidenews.com.cn/news.html?id=2713866',
    railway: 'https://www.zjhmwz.com/phone/raiders/show_2.html',
    railwayParking: 'https://jhwcct.com/articleinfo/303',
    didang: 'https://zjnews.zjol.com.cn/zjnews/202503/t20250307_30865475.shtml?v=1.0'
  };
  const parking = details => ({
    feeType: 'unknown', price: '待确认', priceSummary: '待确认', checked, namedNavigation: true,
    verification: '公开停车资料已读取 · 未电话或现场核验',
    precision: '停车片区参考，非实测入口；按完整名称查找，入场核对费用、装卸车与取车窗口。',
    ...details, gcj: gcj(details.point)
  });
  const nanhuParking = parking({
    id: 'nanhu-visitor-parking', name: '南湖游客服务中心停车场', query: '嘉兴市南湖旅游区游客中心停车场',
    point: [120.76071425, 30.75143015], address: '嘉兴南湖旅游区游客服务中心 · 停车地块参考',
    source: sources.nanhu, sourceTitle: '秀洲新闻网转载交管出行指南 · 点名公众停车场', published: '2025-07-28',
    rule: '正式车场已有公开指引；现行费用与取车窗口待确认',
    condition: '交管出行指南列出南湖游客服务中心停车场，具名OSM地块1259695937对应游客中心片区。该活动报道用于证明停车实体，不把活动接驳或临时措施外推为常态。没有采用不同攻略中互相冲突的日价；入场确认停放时长及推行出入口。',
    evidence: '公众停车名称来自地方媒体交管指南；位置来自具名OSM地块。现价、开放时间与当日容量没有现场核实。',
    mapLabel: '南湖游客中心 · 费用待确认'
  });
  const railwayParking = parking({
    id: 'jinhua-railway-parking', name: '金华铁路文化公园地下停车场', query: '金华铁路文化公园 地下停车场 二七街',
    point: [119.638, 29.1015], address: '金华铁路文化馆西侧 · 工人路与婺江西路之间，二七街入场',
    source: sources.railway, sourceTitle: '婺城城投文旅运营方 · 游园交通指引', published: '2023-10-08',
    rule: '运营方有正式地下停车指引；现价和取车窗口待确认',
    condition: '运营方游园攻略说明可从婺江西路或解放西路转二七街找到地下车场。旧收费运营公告未能重新打开，不把搜索摘要或旧月卡金额换算成现价；也不采用2026防台风临时免费政策。停车标记只表示二七街车场片区，实际出入口及装卸车条件须入场确认。',
    evidence: '已读运营方2023交通指引，车场名称、二七街接入有原文；参考位置按原文描述与OSM铁路公园边界对照，非停车入口实测点。公园全天开放不等于车库24小时开放。',
    mapLabel: '铁路公园车场 · 费用待确认'
  });
  const canalParking = parking({
    id: 'canal-hushu51', name: '湖墅51停车场', query: '杭州 湖墅51停车场',
    point: [120.1327851, 30.3057924], address: '杭州拱墅 · 秉祥巷附近湖墅51地下停车场',
    feeType: 'paid', price: '收费 · 单价待确认', priceSummary: '单价待确认',
    source: osm('node', 9737245752), sourceTitle: 'OSM具名地下车场 · access=yes / fee=yes', published: '地图未提供收费更新日',
    rule: '地图记录收费且公众可进入；不承诺免费或24小时取车',
    condition: 'OSM明确停车实体、access=yes、fee=yes和地下类型，未给现行单价及开放时段。只收录日间公共街道方案；先确认能够停车、装卸车与完整取车，再沿场所出口推行接入秉祥巷。未把步行接驳算进骑行里程。',
    evidence: '实体与公众准入来自2026-10-16保存的OSM快照，不将附近教工或住宅车位合并使用；单价与入口未实测。',
    mapLabel: '湖墅51 · 收费待询'
  });
  const place = (name, kind, point, location, source, description, extra = {}) => ({
    name, kind, point, gcj: gcj(point), location, source, description, checked,
    status: '公开名称与位置已读取 · 当日营业及店门待确认',
    mapLabel: name, query: name, namedNavigation: true, precision: '片区参考', placement: 'detour', ...extra
  });
  const nanhuFood = [place('小菜园新徽菜（嘉兴南湖天地店）', '餐厅', [120.7588659, 30.7600018],
    '南湖路171号南湖天地商业片区 · 按完整分店名查找', sources.nanhuFood,
    '地方媒体实地报道点名南湖天地的小菜园，OSM节点10651230148记录店铺位置。适合作为南湖路一段的可选正餐停留；进商业空间后推行，到店支线与用餐时间另计。',
    { status: '2024媒体到店报道 + 2026读取地图 · 未核实时营业' })];
  const jinhuaFood = [place('五福园', '餐厅', [119.6490189, 29.1050964],
    '金华江北中山路周边 · OSM节点3024775814', osm('node', 3024775814),
    '公开地图具名餐厅，位于江北回程街区附近，可作额外绕行的正餐备选。未取得最新菜单、价格和营业时段，不编造食用体验。')];
  const canalFood = [
    place('觅会咖啡', '咖啡', [120.134014, 30.319501], '拱宸桥西侧街区 · OSM节点6796400385', osm('node', 6796400385),
      '桥西街区的公开具名咖啡点，靠近本线北端。离开公共街道探店时推行，不骑过有台阶的拱宸桥；营业时段未重新核实。'),
    place('院子餐厅（桥西直街）', '餐厅', [120.1336893, 30.3176696], '桥西直街68号 · OSM节点11533443969', osm('node', 11533443969),
      '桥西直街的公开餐厅地址，作为北端探店支线。古街人多时推行，餐厅入口与停放自行车位置按现场管理。')
  ];
  const records = [
    { id: 'nanhu-roads', number: '22', familyId: 'nanhu-roads', familyTitle: '嘉兴 · 南湖外围公共道路', region: 'nanhu', city: '嘉兴市', area: '嘉兴 · 南湖与市区街道',
      title: '南湖 · 外围街道一圈', subtitle: '沿南湖路与南溪西路接入城市街道，景区游览另作步行。',
      duration: '1—1.5小时', level: '城市混行', shape: '环线', parking: nanhuParking,
      laneDetail: '规划使用南湖路、南溪西路、环城南路、南湖大桥、烟雨路等公共道路，避开铁路下穿隧道及无自行车准入标记的景区步道。未确认全程独立自行车道，桥梁与路口按现场非机动车标识通行。',
      description: '从游客中心具名停车片区推行到海盐塘路附近道路起点，沿南湖路北行，经市区公共街道绕回烟雨路、南溪西路返回。9.6公里是道路节点累计值，不把湖心岛、会景园内部游线或探店支线算作骑行主线。',
      stopNames: ['游客中心附近海盐塘路起点', '南湖路北段', '环城南路节点', '烟雨路与迎宾大道片区', '返回游客中心附近'],
      food: nanhuFood, mapWater: { name: '南湖', point: [120.7555, 30.7575] }, sources: [['南湖正式停车实体', sources.nanhu], ['南湖天地餐饮实地报道', sources.nanhuFood], ['具名停车地块', osm('way', 1259695937)]], tags: ['嘉兴', '南湖', '市区', '日间'] },
    { id: 'nanhu-short', number: '23', familyId: 'nanhu-roads', familyTitle: '嘉兴 · 南湖外围公共道路', region: 'nanhu', city: '嘉兴市', area: '嘉兴 · 南湖东侧街道',
      title: '南湖 · 东侧街道短折返', subtitle: '同一车场出发，选择较短的南湖路往返。', duration: '0.5小时左右', level: '城市混行', shape: '往返环路', parking: nanhuParking,
      laneDetail: '公共道路按允许方向分别计算去回，没有简单倒转单行线。短版同样不进入景区步道，不把湖边跑步道当骑行道。',
      description: '从海盐塘路附近起点接入南溪西路、南湖路，到北段公共道路节点后按允许方向返回。适合只想试骑一小段的行程；进入南湖天地探店需要额外推行和绕行。',
      stopNames: ['游客中心附近海盐塘路起点', '南湖路北段折返', '返回游客中心附近'], food: nanhuFood,
      mapWater: { name: '南湖', point: [120.7555, 30.7575] }, sources: [['停车实体与公众指引', sources.nanhu], ['具名停车地块', osm('way', 1259695937)]], tags: ['嘉兴', '南湖', '短线'] },
    { id: 'jinhua-city', number: '24', familyId: 'jinhua-city', familyTitle: '金华 · 铁路公园与江北街道', region: 'jinhua', city: '金华市', area: '金华 · 铁路公园至婺州公园外围',
      title: '金华江北 · 铁路记忆与老城街道', subtitle: '二七街出发，沿婺江东路与飘萍路看城市。', duration: '0.5—1小时', level: '城市混行', shape: '环线', parking: railwayParking,
      laneDetail: '沿二七街、工人路、婺江东路、飘萍路、解放东路等实际公共街道按单行方向连接。没有把三江六岸整片步道当作已核骑行绿道，也不走燕尾洲人行桥。',
      description: '采用运营方明确指引的铁路公园地下车场，推行接到二七街道路起点。沿江北公共街道往婺州公园外围，再经解放东路返回。公园内游览、到五福园用餐及步行看江均属于可选支线，不计入主线里程。',
      stopNames: ['二七街道路起点', '飘萍路东段', '解放东路回程节点', '返回二七街'], food: jinhuaFood,
      mapWater: { name: '婺江', point: [119.6507, 29.0994] }, sources: [['运营方停车交通指引', sources.railway], ['铁路公园边界与周边街道', osm('way', 972337206)]], tags: ['金华', '老城', '婺江', '日间'] },
    { id: 'jinhua-short', number: '25', familyId: 'jinhua-city', familyTitle: '金华 · 铁路公园与江北街道', region: 'jinhua', city: '金华市', area: '金华 · 二七街至婺州公园外围',
      title: '金华江北 · 婺州公园外围短圈', subtitle: '共用二七街停车片区，减少江北街区绕行。', duration: '0.5小时左右', level: '城市混行', shape: '环线', parking: railwayParking,
      laneDetail: '二七街、婺江东路、飘萍路、中山路等普通街道组成闭合短圈；未把公园步道或未核准入的古街小巷用作捷径。单行道路去回分别规划。',
      description: '从二七街道路起点骑至婺州公园外围后，经中山路返回。共用长版停车场，实际是3.6公里城市街道短圈，路口多，不当作封闭儿童骑行场地。',
      stopNames: ['二七街道路起点', '婺江东路节点', '婺州公园外围道路', '返回二七街'], food: jinhuaFood,
      mapWater: { name: '婺江', point: [119.6507, 29.0994] }, sources: [['铁路公园停车交通指引', sources.railway]], tags: ['金华', '婺州公园', '短线'] },
    { id: 'canal-streets', number: '26', familyId: 'canal-streets', familyTitle: '杭州 · 运河桥西公共街道', region: 'canal', city: '杭州市', area: '杭州 · 湖墅至桥西街区',
      title: '运河桥西 · 咖啡街道日间往返', subtitle: '湖墅地下车场接驳，公共街道去桥西。', duration: '0.5—1小时', level: '城市混行', shape: '往返环路', parking: canalParking,
      laneDetail: '经秉祥巷、小河路、小河支路和桥弄街等公共道路，去回按单行规则连接；不跨有台阶的拱宸桥，不把运河岸边步行空间默认为可骑。没有连续照明证据，本线仅收录日间。',
      description: '在湖墅51正式地下车场确认收费与取车条件后，推行接入秉祥巷，沿公共街道北行到桥西街区，再按允许方向返回。咖啡餐厅为额外推行探店支线，不能作为夜间补给保证。',
      stopNames: ['秉祥巷道路起点', '桥西街区道路节点', '桥弄街北端折返', '返回秉祥巷'], food: canalFood,
      mapWater: { name: '京杭运河', point: [120.136, 30.315] }, sources: [['公众收费车场地图记录', osm('node', 9737245752)], ['湖墅北路道路资料', osm('way', 4341706)]], tags: ['杭州', '运河', '桥西', '咖啡', '日间'] }
  ];
  for (const r of records) {
    const p = REGIONAL_PLANS[r.id];
    Object.assign(r, { distance: p.distance, window: 'day', dedicated: false, isolated: false,
      lane: '公共街道混行 · 专用道未确认', sourceChecked: checked,
      geometryWays: p.wayIds, geometrySource: p.geometrySource, mapCyclewayKm: p.cyclewayKm });
    r.start = { name: r.stopNames[0], point: p.anchors[0], gcj: gcj(p.anchors[0]) };
    r.stops = p.anchors.map((point, i) => ({ name: r.stopNames[i], point, gcj: gcj(point), note: i === 0 ? '场所内推行至公共道路；出入口与装卸车条件以现场为准。' : '按公共道路和非机动车标识通行；停留、掉头先选择允许位置。' }));
    r.rest = r.stops.slice(1, -1).map(s => place(s.name + ' · 歇脚建议', '歇脚', s.point, r.area,
      `https://www.openstreetmap.org/?mlat=${s.point[1]}&mlon=${s.point[0]}`,
      '道路途经位置建议，未确认专门休息设施。在允许停留且不影响通行的位置下车休息。', { status: '规划位置建议 · 非设施核验', placement: 'along' }));
    r.supply = [...r.food, ...r.rest];
    r.leads = r.region === 'nanhu' ? [{ name: 'Tims咖啡（南湖天地片区）', kind: '咖啡', location: 'OSM节点10713416456；非店门实测', source: osm('node', 10713416456), note: '已取得品牌地图点，但完整分店与当日营业未完成正文核验，暂不计入正式商户。' }] : r.region === 'jinhua' ? [{ name: '漫悠悠咖啡', kind: '咖啡', location: '婺州古城运营方商业目录，准确店门待核', source: 'https://www.wuzhougucheng.com/mobile/parking.html', note: '运营方目录列名，尚无准确地址与合法到店接驳，不在主线地图上画咖啡点。' }] : [];

    r.notes = ['路线来自公开路网规划，未实骑；现场禁行或施工时结束该段，不绕进单位、景区或快速路。',
      '停车场内推行、装卸车与探店支线未计入骑行里程；停车片区至道路起点的实际出口请入场核对。',
      '暂无本线已核实营业时段的咖啡补给保证，自带饮水；所有商户只作可选停留。'];
    ROUTES.push(r);
  }
  // Real roads can be previewed while the parking entity/connector remains unresolved.
  const plan = REGIONAL_PLANS['didang-research'];
  RESEARCH_MAPS.push({ id: 'didang-research', region: 'didang', research: true,
    title: '迪荡湖西南外围公共道路 · 停车接驳待核', distance: plan.distance, shape: '往返环路',
    stops: plan.anchors.map((point, i) => ({ name: ['西南外围研究起点', '西施山路与迪荡湖路', '迪荡湖路中段', '返回研究起点'][i], point })),
    food: [], supply: [], mapWater: { name: '迪荡湖', point: [120.605, 30.017] } });
})();
