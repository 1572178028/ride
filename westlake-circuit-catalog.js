/* One West Lake family, with a fully planned Meiling/river circuit. */
(() => {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const gcj = RIDE_COORDS.wgs84ToGcj02;
  const lake = ROUTES.find(r => r.id === 'westlake-road');
  const south = ROUTES.find(r => r.id === 'meiling-south-road');
  const plan = REGIONAL_PLANS['westlake-hills-loop'];
  const tunnelSource = 'https://hznews.hangzhou.com.cn/chengshi/content/2019-01/10/content_7130855.htm';
  const roadSource = 'https://mqjwb.tidenews.com.cn/epaper/article/2024-08-20/4259329';
  const checked = '2026-10-19';
  const positions = [0, 2, 3, 5, 6, 7, 9, 11, 12, 13];
  const names = ['北山街公共道路起点', '龙井路接梅灵北路', '梅灵隧道慢行入口', '梅家坞村口', '云栖竹径外围', '梅灵南路接之江路', '六和塔外围与虎跑路', '南山路湖景段', '北山街东段', '返回岳湖停车片区'];
  const notes = [
    '确认岳庙停车场当天收费、取车窗口与装卸车条件，按出入口推行接入北山街。',
    '沿公共道路接入梅灵北路，不进入龙井村古道或十里琅珰；弯坡推行标志优先。',
    '仅沿现场开放的慢行通道通过梅灵隧道，约1.1公里；礼让行人，不进入机动车道。慢行通道关闭时选不穿隧道的分段方案。',
    '经过梅灵南路村口，可下车推行探店；不能停在行车道或茶田内。',
    '骑行保持在梅灵南路，景区内部游步道和石阶不属于路线。',
    '按信号与非机动车标志接入之江路地面慢行道路；避开之江路机动车隧道及施工封闭处。',
    '只到六和塔外围公共道路，不骑入塔院或登山空间；沿允许方向接虎跑路。',
    '遵守路口车道与推行标志，游客密集处下车；不用湖岸步道抄近路。',
    '经湖东公共道路到北山街，按允许方向返回；湖滨步行空间不作为自行车捷径。',
    '回到同一北山街道路节点，推行返回车场取车。'
  ];
  const stops = positions.map((index, i) => ({name:names[i], point:plan.anchors[index], gcj:gcj(plan.anchors[index]), note:notes[i]}));
  const restPlace = (id, name, index, label) => ({
    id, name, kind:'歇脚', point:plan.anchors[index], gcj:gcj(plan.anchors[index]), mapLabel:label,
    description:'仅在现场允许停留、不妨碍行人车辆的公共空间短休；不是已核实的厕所、饮水、座椅或修车设施。',
    location:'公共道路外围片区 · 实际停留位置依现场标识', source:roadSource,
    checked, status:'片区歇脚建议 · 非设施核验', placement:'along', namedNavigation:true
  });
  const food = [...clone(lake.food), ...clone(south.food)];
  food[food.length-1].placement = 'along';
  ['楼外楼（孤山路）','绿茶（龙井总店）','Costa（西湖天地）','春娟茶楼（梅家坞）'].forEach((label,i)=>{food[i].mapLabel=label;});
  const rest = [
    restPlace('westlake-meijiawu-rest','梅家坞村口 · 歇脚建议',5,'梅家坞村口歇脚'),
    clone(south.rest[0]),
    restPlace('westlake-liuhe-rest','六和塔外围 · 歇脚建议',9,'六和塔外围歇脚')
  ];
  const parking = clone(lake.parking);
  parking.checked = checked;
  parking.verification = '2026-09-30公开收费原文重新读取 · 未电话或现场核验';
  parking.condition += ' 本完整环线建议预留4—5小时骑行、推行和休息，另留装卸车与探店时间；入场确认停车可覆盖全部行程。';
  const route = {
    id:'westlake-hills-loop', number:'33', familyId:'westlake-road', familyTitle:'西湖 · 龙井与梅灵茶山',
    region:'westlake', city:'杭州市', area:'杭州 · 西湖、梅家坞与钱塘江北岸',
    title:'西湖 × 梅灵南北路 · 茶山江景环线', shortTitle:'茶山江景完整环线',
    subtitle:'岳湖出发，串联梅灵南北路、梅家坞、之江路与西湖。',
    distance:plan.distance, duration:'4—5小时', level:'山路进阶', shape:'环线', window:'day',
    dedicated:false, isolated:true, mapCyclewayKm:plan.cyclewayKm,
    lane:'部分非机动车道 · 山路与路口混行',
    laneDetail:'梅灵南北路有弯坡和窄非机动车道；梅灵隧道仅走慢行通道，存在行人共用。之江路、虎跑路、南山路按现场非机动车标志通行；绿色只标实际经过的独立cycleway路网段，不代表全程自行车独享。机动车之江路隧道、苏堤白堤及景区内部步道不纳入路线。',
    tags:['西湖','龙井路','梅灵北路','梅灵南路','梅林南路','梅家坞','六和塔','之江路','钱塘江','环线','日间','收费停车'],
    description:'串联西湖、梅灵茶山与钱塘江北岸的完整环线。从岳湖停车片区出发，经龙井路口、梅灵北路与梅灵隧道慢行通道到梅家坞，再沿梅灵南路到之江路地面道路，经六和塔外围、虎跑路和南山路，绕湖东返回北山街。33.8公里是道路节点累计结果，停车接驳、探店支线和步行游览另计。',
    parking, start:stops[0], stops, food, rest, supply:[...food,...rest],
    leads:clone(south.leads), mapWater:clone(lake.mapWater), labelLayout:'nearest',
    mapWaters:[clone(lake.mapWater), {name:'钱塘江',point:[120.136,30.187]}],
    sources:[...lake.sources, ...south.sources, ['杭州网：梅灵隧道慢行通道的历史实地报道',tunnelSource], ['钱江晚报：梅灵路、之江路骑行与非机动车道实访',roadSource], ['新增南侧连接道路快照',plan.geometrySource]],
    sourceChecked:checked, geometrySource:plan.geometrySource, geometryWays:plan.wayIds,
    notes:[
      '完整环线仅按日间方案安排，约4—5小时含慢行与必要推行；爬升未测，里程按本方案实际道路累计。',
      '隧道有慢行通道的历史报道与OSM cycleway=track记录，但未实测当前开放。到场按标志通过；通道关闭时停止完整环线，改选不穿隧道的分段方案，不进入机动车道绕行。',
      '钱江晚报实访提到龙井弯坡推行标志、梅灵南路车道较窄和部分非机动车道不连续；遵守推行要求，单列慢骑。',
      '之江路仅走地面慢行道路；临时施工、防汛或其他封闭时按管理要求结束该段。',
      '没有确认全程专用自行车道或全程照明，自备饮水和基础补给；商户当日营业需另确认，探店支线与停车场内推行不计主线里程。'
    ]
  };
  ROUTES.push(route);
  for (const r of ROUTES.filter(r => r.region==='westlake' || r.id==='meiling-south-road')) {
    r.region='westlake'; r.familyId='westlake-road'; r.familyTitle=route.familyTitle;
  }
  ['westlake-hills-loop','westlake-road','westlake-tea-road','meiling-south-road','westlake-beishan-night','westlake-nanshan-night'].forEach((id,i)=>{ROUTES.find(r=>r.id===id).planOrder=i;});
  lake.area='杭州 · 西湖与梅灵茶山';
  lake.preferredPlanId=route.id;
  lake.shortTitle='西湖外围湖景';
  ROUTES.find(r => r.id==='westlake-tea-road').shortTitle='龙井与梅灵北路折返';
  south.shortTitle='梅灵南路分段折返';
  south.description=south.description.replace('独立茶乡路线','茶乡分段方案');
  ROUTES.find(r => r.id==='westlake-beishan-night').shortTitle='北山街夜骑';
  ROUTES.find(r => r.id==='westlake-nanshan-night').shortTitle='北山南山夜骑';
  window.ROUTE_ALIASES = {'westlake-20261018':route.id};
})();
