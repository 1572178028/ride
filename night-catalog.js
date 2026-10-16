/* Hangzhou night rides: published night use, mapped roads, conditional parking. */
(() => {
  'use strict';
  const checked = '2026-10-16', gcj = RIDE_COORDS.wgs84ToGcj02;
  const lighting = 'https://www.hzzx.gov.cn/cshz/content/2026-10/12/content_9334524.htm';
  const westNight = 'https://nginx-hzwcm.hangzhou.com.cn/hzwcm/site3/mweb/2025-07/30/content_9050189.html';
  const riverParking = 'https://hznews.hangzhou.com.cn/chengshi/content/2026-07/26/content_9264415.htm';
  const energyParking = 'https://www.energyhz.com/xwzxDetail.html?categoryid=2c908a858c1a9931018c1dc22cc70199&contentid=ff80808199e2044701a0e6026b305bbe';
  const publicStandard = 'https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3234/site/attach/jtlydb/db20180201/db_04.pdf';
  const clone = value => JSON.parse(JSON.stringify(value));
  const parking = details => ({
    feeType: 'paid', checked, namedNavigation: true,
    verification: '已读取停车资料正文 · 未电话或现场核验',
    precision: 'P为公众车场片区参考，非入口实测；按完整车场名查找，勿从学校或商场内部穿行。',
    ...details, gcj: gcj(details.point)
  });
  const wentaoParking = parking({
    excludedParking: ['520287620'], id: 'qiantang-school-public', name: '杭州市钱塘实验小学地下公共停车场',
    query: '杭州市滨江区 钱塘实验小学 地下公共停车场',
    point: [120.1483, 30.1917], address: '滨江区东信大道1328号学校地下公众车库片区 · 公共出入口按现场指引',
    source: riverParking, sourceTitle: '2026杭州城管沿江停车指南 · 点名推荐', published: '2026-07-26',
    price: '收费 · 现价待确认', priceSummary: '现价待确认', rule: '公众收费车库；2018参考4元/小时不作为2026现价',
    condition: '2026年沿江指南再次点名该车场，滨江官网2026年1月也报道其收费包月运营。2018交通旅游导报有已开放车库与收费记录，同版公共车库管理标准要求24小时运营；这属于历史管理依据，不是本次当晚窗口实测。建议18:30—20:30短骑，入场先确认临停、装卸车及20:45后可取车；公共车位和学校内部隔离，不进校园。仅首小时免停的旧规则不算整程免费。',
    evidence: '2026指南核实公众车场仍被推荐，旧报道用于说明公众入口和夜间管理背景；不得把“滨停车”平台24小时在线等同车库当前24小时营业；原江陵路临时P+R有停用公告，明确排除。P参考学校具名OSM边界443568400及东信大道位置，入口非实测。',
    mapLabel: '钱塘实验小学 · 公共收费车库'
  });
  const bolangParking = parking({
    id: 'bolang-public-garage', name: '波浪文化城地下停车场', query: '杭州市上城区 波浪文化城地下停车场',
    point: [120.2083852, 30.2479398], address: '上城区解放东路8号波浪文化城地下 · A/B/C分区按入口指示',
    source: energyParking, sourceTitle: '杭州能源集团/杭停股份 · 夜景观演停车指引', published: '2026-09-24',
    price: '参考5元/小时', priceSummary: '参考¥5/小时', rule: '15分钟内免费；5元/小时，6小时封顶30元（运营方2026资料）',
    condition: '运营方明确推荐夜晚看灯光秀、演出的游客使用该车库，A/B区可步行至城市阳台、C区可至大剧院。夜间可用依据是运营方的夜游停车推荐，不宣传24小时。建议18:30—20:00骑行，入场核对20:30后取车、装卸车和公众步行出口；车库内推行，公共街道起点与停车片区分开标记。',
    evidence: '运营方2026-09-24正文通过应用内浏览器实际读取，价格不采用搜索片段中塘栖车场的夜间5元/次。位置以高德B0IG2UASAV与OSM波浪文化城片区对照，非入口实测。',
    mapLabel: '波浪文化城 · 公共收费车库'
  });
  const west = ROUTES.find(r => r.id === 'westlake-road');
  const westParking = clone(ROUTES.find(r => r.id === 'westlake-beishan-night').parking);
  const selfSupply = '夜间商户和设施开放未现场确认，自带饮水与基础补给；餐饮只是可选停留。';
  const records = [
    {
      id: 'westlake-nanshan-night', number: '27', familyId: 'westlake-road', familyTitle: west.familyTitle,
      region: 'westlake', city: '杭州市', area: '杭州 · 北山街与南山路', title: '北山—南山 · 湖城夜景往返',
      subtitle: '比北山短线多骑一段南山路，沿允许方向返回停车点。',
      duration: '1.5—2小时', level: '城市混行', shape: '往返环路', window: 'night',
      dedicated: false, isolated: false, lane: '城市道路混行 · 局部步骑共用',
      laneDetail: '按北山街、南山路及有自行车准入标记的实际道路连接，去回分别遵循单行，不进入白堤、苏堤或无自行车准入的景区步道。全线不是自行车专用道。',
      parking: westParking, tags: ['杭州夜骑', '南山路', '北山街', '西湖', '收费停车'],
      description: '从原有岳湖停车片区推行接入北山街，经湖东北侧公共道路到南山路清波一带，再按允许方向返回。杭州公交2025夜骑推荐提供南山路夜间骑游背景，本方案按自驾返回取车重新规划，12.2公里为路网累计值，不采用原文约11公里环湖里程，也不计停车场内推行。',
      stopNames: ['北山街公共道路起点', '北山街东段节点', '南山路清波一带折返', '返回北山街起点'],
      stopNotes: ['20:00后入场才适用夜间参考计费；先核对取车窗口。', '游客密集处减速，按允许路口通行。', '在允许掉头的位置折返，不骑入柳浪闻莺内部游步道。', '按去回方向规划回到起点，推行取车。'],
      food: clone(west.food), mapWater: clone(west.mapWater),
      sources: [...west.sources, ['杭州公交2025夜骑推荐 · 本线重算里程', westNight], ['2026秋冬亮灯安排', lighting]],
      notes: ['建议20:10—22:00；不将山路、茶园或整圈西湖一概称作有灯。', '去回道路可能不同，按导航和现场标识通行，避免在车道或桥面停留。', selfSupply],
      nightRide: { window: '建议20:10—22:00；给装卸车和取车留足时间', lighting: '北山、南山有夜骑与路灯报道；本规划部分路段照明标记缺失，不能保证全程有灯。2026秋冬核心商圈景观亮灯18:00—22:30，景观灯不是道路照明证明。', parking: westParking.condition, supply: selfSupply, source: westParking.source, lightingSource: lighting }
    },
    {
      id: 'binjiang-wentao-night', number: '28', familyId: 'binjiang-wentao-night', familyTitle: '滨江 · 闻涛路西段夜骑',
      region: 'binjiang', city: '杭州市', area: '杭州 · 东信大道至闻涛路中段',
      title: '闻涛路 · 江风夜骑', subtitle: '从公众车库出发，沿南岸闻涛路骑一段江景。',
      duration: '0.75—1.25小时', level: '休闲 · 路口混行', shape: '往返环路', window: 'night',
      dedicated: false, isolated: true, lane: '含隔离骑行道 · 接驳道路混行',
      laneDetail: '规划实际经过cycleway以及闻涛路非机动车道，绿色只显示经过的独立路网骑行段；不代表自行车独享。东信大道接驳和路口单独遵循方向，避开机动车隧道及未核停车场内捷径。',
      parking: wentaoParking, tags: ['杭州夜骑', '滨江', '闻涛路', '钱塘江', '收费停车'],
      description: '在钱塘实验小学地下公众车库确认当晚临停和取车后，从东信大道公共道路节点出发，经闻涛路口向东骑到中段道路节点，再依允许方向返回。去回分别构图，6.9公里包含道路接驳；没有把已经停用的江陵路临时P+R重新作为起点。',
      stopNames: ['东信大道公共道路起点', '闻涛路东信大道口', '闻涛路中段折返节点', '闻涛路东信大道口', '返回东信大道起点'],
      stopNotes: ['从公众车库出口推行接入，学校区域不通行。', '按现场非机动车标识进入闻涛路。', '在允许停留与掉头的位置折返；不骑上机动车高架。', '按规划回程道路通行，不逆行去程单向道。', '推行回公众车位，预留取车时间。'],
      food: [], mapWater: { name: '钱塘江', point: [120.162, 30.202] },
      sources: [['杭州城管2026沿江停车与樱花跑道骑行指引', riverParking], ['2026滨停车运营 · 已读官网，在线24小时不等于车库窗口', 'https://www.hhtz.gov.cn/col/col1485968/art/2026/art_9f41ce3fe58544fbb613eb86e8804665.html'], ['2018公共车库开放与管理背景 · 非现价', publicStandard], ['都市快报2025闻涛路夜跑与骑行用途', 'https://www.hzzx.gov.cn/cshz/content/2025-09/01/content_9073473.htm'], ['2026秋冬亮灯安排', lighting], ['钱塘实验小学实际边界 · P为公众车库片区', 'https://www.openstreetmap.org/way/443568400']],
      notes: ['建议18:30—20:30；沿江风大时缩短行程，遇防汛、观潮或施工管控结束该段。', '南岸照明数据单独计算，未拿北岸之江路的lit标记补足南岸；自备前后灯。', '暂无本段已核完整夜间营业窗口的咖啡餐厅，带水；不把接送学生的短时免停当作夜骑免费。'],
      nightRide: { window: '建议18:30—20:30；最晚取车时间先在入口确认', lighting: '闻涛路有夜间运动资料，经过路段有部分lit=yes记录；照明未逐盏实测。钱塘江两岸秋冬景观亮灯18:00—22:30，不据景观灯保证骑行道全程亮度。', parking: wentaoParking.condition, supply: selfSupply, source: riverParking, lightingSource: lighting }
    },
    {
      id: 'qianjiang-city-night', number: '30', familyId: 'qianjiang-city-night', familyTitle: '钱江新城 · 街区夜景短骑',
      region: 'qianjiang', city: '杭州市', area: '杭州 · 大剧院与钱江新城街道', title: '钱江新城 · 街区灯火一圈',
      subtitle: '在城市街道短骑，停车步行看城市阳台夜景。',
      duration: '0.5—1小时', level: '城市混行', shape: '环线', window: 'night',
      dedicated: false, isolated: false, lane: '公共街道 · 局部路网骑行道',
      laneDetail: '主线经剧院路、江锦路、庆春东路、富春路与新业路等公共街道及可骑连接段；地图实际只约0.7公里cycleway，不标全程隔离或专用。排除机动车隧道与停车通道，城市阳台、地下商场内部只步行参观。',
      parking: bolangParking, tags: ['杭州夜骑', '钱江新城', '大剧院', '城市阳台周边', '收费停车'],
      description: '波浪文化城公众车库是运营方2026夜景观演推荐停车点。推行接到大剧院北侧公共道路起点，沿钱江新城街道骑一圈回到原点；4.0公里不含车库与步行观景。城市阳台作为骑前骑后下车步行选择，不把观景平台或商场通道画进骑行主线。',
      stopNames: ['大剧院北侧公共道路起点', '剧院路与江锦路片区', '庆春东路片区节点', '民心路街区节点', '新业路与富春路片区', '返回大剧院北侧'],
      stopNotes: ['从公众步行出口推行至道路，按指示装卸车。', '城市路口减速，按非机动车道标识通行。', '按实际允许路口过街，不进入地面机动车车道或地下隧道。', '不穿楼宇、商场或封闭小区。', '返回公共道路起点。', '下车推行取车；城市阳台观景另计步行。'],
      food: [{ id: 'bolang-zhoufan', name: '粥饭之家（砂之船店）', kind: '餐厅', point: [120.2086726, 30.2464021], gcj: gcj([120.2086726, 30.2464021]), location: '剧院路人马街002B · 商场片区参考', source: 'https://www.openstreetmap.org/node/4774726522', status: '具名分店地图记录 · 夜间营业未核 · 2026-10-16', description: '起终点周边的可选正餐线索，进入商业空间后推行；到店绕行与用餐另计，不能依赖夜间开门完成补给。', query: '粥饭之家 砂之船店', namedNavigation: true, placement: 'nearby', mapLabel: '粥饭之家 · 砂之船' }],

      mapWater: { name: '钱塘江', point: [120.222, 30.246] },
      sources: [['杭州能源集团2026夜游停车指南 · 实际浏览器已读', energyParking], ['波浪文化城公共停车场具名地图记录', 'https://www.amap.com/place/B0IG2UASAV'], ['2026秋冬景观与灯光秀安排', lighting], ['具名餐厅地图记录', 'https://www.openstreetmap.org/node/4774726522']],
      notes: ['建议18:30—20:00；灯光秀停下车步行观看，不边骑边拍。', '秋冬灯光秀周五/六18:30和19:30，其他日19:30，适用期至2027-04-14；临时调整以运营公告为准。', '多数道路缺少单独照明标签，景观亮灯不保证路面照度；灯具必备，遇暗段折返。', selfSupply],
      nightRide: { window: '建议18:30—20:00；步行观景、用餐及取车时间另留', lighting: '2026秋冬钱江新城景观亮灯18:00—22:30。灯光秀周五/六18:30、19:30，其他日19:30，至2027-04-14；夜景资料不等于全线骑行照明已实测。', parking: bolangParking.condition, supply: selfSupply, source: energyParking, lightingSource: lighting }
    }
  ];
  records.find(r => r.id === 'qianjiang-city-night').food.push({
    id: 'starbucks-hangzhou-sasseur', name: '星巴克（杭州砂之船店）', kind: '咖啡',
    point: [120.2098236, 30.2461291], gcj: gcj([120.2098236, 30.2461291]),
    location: '波浪文化城砂之船人马街026-B、028号 · 商场片区参考，非店门坐标',
    source: 'https://us.trip.com/restaurant/china/hangzhou/detail/restaurant-118703747/',
    status: '已读完整分店及平台08:00—22:00参考时段 · 非实时营业核验 · 2026-10-16',
    description: '骑前骑后的可选咖啡。平台列08:00—22:00，出发前仍需核对当日营业；商场内推行，进店支线不计里程，不能依赖开门作为路线完成条件。',
    query: '星巴克 杭州砂之船店', namedNavigation: true, placement: 'nearby', mapLabel: '星巴克 · 砂之船（片区）'
  });
  const long = records.find(r => r.id === 'binjiang-wentao-night');
  records.splice(2, 0, {
    ...clone(long), id: 'binjiang-wentao-short-night', number: '29',
    title: '闻涛路 · 3公里轻松夜骑', subtitle: '同一公众车库，选择更短的江边往返。',
    area: '杭州 · 东信大道至闻涛路西段', duration: '0.5小时左右',
    description: '共用钱塘实验小学地下公众车库，沿东信大道接入闻涛路，在西段道路节点折返。3.0公里包含道路接驳，去回单独遵循方向；是6.9公里版的短版本，不重复算主线、片区或停车点。',
    stopNames: ['东信大道公共道路起点', '闻涛路东信大道口', '闻涛路西段折返节点', '闻涛路东信大道口', '返回东信大道起点'],
    tags: [...long.tags, '入门短线']
  });
  for (const r of records) {
    const plan = REGIONAL_PLANS[r.id];
    Object.assign(r, { distance: plan.distance, sourceChecked: checked, geometryWays: plan.wayIds, geometrySource: plan.geometrySource, mapCyclewayKm: plan.cyclewayKm, lightingMappedKm: plan.lightingMappedKm });
    r.start = { name: r.stopNames[0], point: plan.anchors[0], gcj: gcj(plan.anchors[0]) };
    r.stops = plan.anchors.map((point, i) => ({ name: r.stopNames[i], note: r.stopNotes[i], point, gcj: gcj(point) }));
    const seen = new Set();
    r.rest = r.stops.slice(1, -1).filter(p => { const key = p.point.join(','); if (seen.has(key)) return false; seen.add(key); return true; }).map(p => ({
      id: 'night-rest-' + p.point.join(','), name: p.name + ' · 歇脚建议', kind: '歇脚', point: p.point, gcj: p.gcj,
      description: '只是在允许停留、不影响通行的位置下车休息的建议；未核座椅、厕所、饮水或修车设施。',
      location: r.area + ' · 公共道路片区', source: 'https://www.openstreetmap.org/',
      status: '规划位置建议 · 非设施核验', mapLabel: p.name, query: p.name, namedNavigation: true, placement: 'along'
    }));
    if (r.id === 'westlake-nanshan-night') r.rest = clone(west.rest);
    r.supply = [...r.food, ...r.rest]; ROUTES.push(r);
  }

  EXPANSION_CANDIDATES.push(
    {
      id: 'hangzhou-baima-night-research', researchCity: 'hangzhou', city: '杭州市', area: '杭州 · 滨江白马湖',
      title: '白马湖荧光夜骑', direction: '湖岸跑步区与骑行区分别核对。',
      status: '已复核 · 可骑区与停车仍须对应', reviewOutcome: 'geometry-parking-unmatched', checked, reviewedAt: checked,
      note: '2025夜跑报道确认荧光跑道分跑步区和骑行区，2026南P1/P2车场价目已有原文；但当前几何只有未标自行车准入的湖岸步道，不能把整圈直接画成骑行线。',
      missing: '具体可骑区几何、南P1/P2公众入口与夜间取车窗口；照明实效。',
      parkingNote: '2026-04-23杭州发布/市发改委资料列南P1/P2参考4元/小时、每天6小时封顶，首15分钟免费。地图白马湖P4是另一个场地，不套用P1/P2价目或活动临时免费。',
      roadNote: '已取得本轮真实OSM快照，但不能以荧光路面代替道路照明；未定位具体骑行区，不将未标准入的footway补作可骑连接。',
      foodNote: '夜间商户与公众设施窗口未核，不依赖补给。',
      sources: [['2026政府定价车场资料', 'https://www.hzzx.gov.cn/cshz/content/2026-04/23/content_9210933.htm'], ['2025跑步区与骑行区报道', 'https://www.hzzx.gov.cn/cshz/content/2025-09/01/content_9073473.htm']],
      query: '杭州 白马湖公园'
    },
    {
      id: 'hangzhou-qingshan-night-research', researchCity: 'hangzhou', city: '杭州市', area: '杭州 · 临安青山湖',
      title: '青山湖夜间方向', direction: '恢复开放与夜间准入分开核对。',
      status: '已复核 · 夜间恢复依据仍缺', reviewOutcome: 'night-reopening-unresolved', checked, reviewedAt: checked,
      note: '9月1日绿道因电力受损限制至18:30；后来已有景区恢复开放的报道，但不等于绿道夜间照明和准入已恢复。暂不提供夜骑方案。',
      missing: '绿道夜间恢复开放的明确公告、连续照明、可夜间取车的具名停车场与道路几何。',
      parkingNote: '尚未取得匹配本线的夜间公众车场入口与取车公示；景区恢复开放不能代替停车开放窗口。',
      roadNote: '9月14日报道景区恢复迎客和鹿园开放；没有说明夜间绿道电力及分时管理取消。不把旧闭园公告说成景区现在全天仍关闭。',
      foodNote: '夜间补给未核，不生成商户和设施承诺。',
      sources: [['杭州发布9月1日分时公告', 'https://www.sina.cn/news/detail/5338254884997555.html'], ['9月14日恢复开放报道 · 非夜间绿道公告', 'https://fashion.hangzhou.com.cn/content/2026-09/14/content_9306605.html']],
      query: '杭州 临安 青山湖绿道'
    }
  );
  // Replace only the west-section research direction actually supplied here.
  window.EXPANSION_CANDIDATES = EXPANSION_CANDIDATES.filter(c => c.id !== 'hangzhou-binjiang-night-research');
})();
