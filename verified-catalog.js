/* Checked public sources, 2026-10-15. Paid parking is explicitly authorised.
 * Road plans are not ride recordings; provider and visitor prices are references.
 */
(() => {
  'use strict';
  const checked = '2026-10-15', gcj = RIDE_COORDS.wgs84ToGcj02;
  const sources = {
    westlake: 'https://www.hzzx.gov.cn/cshz/content/2026-09/30/content_9324559.htm',
    westlakeTraffic: 'https://www.hangzhou.gov.cn/col/col812268/art/2026/art_49c79bb9a8374dae8a2cfebb155ea301.html',
    morning: 'https://ori.hangzhou.com.cn/ornews/content/2024-10/21/content_8802931.htm',
    yucunParking: 'https://www.xiaohongshu.com/explore/6a5c9d9e000000000f014258',
    yucunWalk: 'https://www.xiaohongshu.com/explore/69cbc92f000000002302726a',
    yucunService: 'https://zj.cnr.cn/zjyw/20250820/t20250820_527328293.shtml',
    moganParking: 'https://you.ctrip.com/sight/deqing1011/135799.html',
    moganCafe: 'https://m.36kr.com/p/3676861587939975',
    moganFood: 'https://you.ctrip.com/food/moganshan87/8602015.html',
    greenTea: 'https://you.ctrip.com/food/hangzhou14/4927384.html',
    taihuParking: 'https://www.sohu.com/a/1055844532_121124436',
    lakesideCafe: 'https://finance.sina.com.cn/roll/2026-04-18/doc-inhuwnkh1670379.shtml'
  };
  const place = (name, kind, point, description, location, source, extra = {}) => ({
    name, kind, point, gcj: gcj(point), description, location, source, checked,
    sourceTitle: '公开资料 · 来源状态见卡片', status: '来源正文已读取 · 当日营业与入口请确认',
    query: name, mapLabel: name, placement: 'along', precision: '片区参考，非店门实测', namedNavigation: true, ...extra
  });
  const parking = details => ({
    feeType: 'paid', price: '收费', checked, namedNavigation: true,
    verification: '公开收费资料已读取 · 未电话或现场核验',
    precision: '停车片区参考位置，非入口实测；按完整名称查找正式车位。', ...details,
    gcj: gcj(details.point)
  });
  const westlakeParking = parking({
    id: 'westlake-yuehu', name: '岳庙停车场（岳湖广场片区）', query: '杭州岳庙停车场 北山街 苏堤北口',
    address: '杭州西湖景区 · 北山街苏堤北口岳湖广场片区', point: [120.1302392, 30.2533585],
    priceSummary: '收费', rule: '工作日白天参考 ¥10/小时；旺季、节假日另计',
    condition: '按正式停车场入口公示计费。2026年9月官方报道列明日常白天8:00—20:00为10元/小时，夜间20:00—次日8:00为5元/次，2026国庆白天为30元/小时；其他旺季及假日以当日公示为准。停车取车窗口须入场确认，不能停在苏堤或景区禁停道路。',
    source: sources.westlake, sourceTitle: '杭州政协网转载杭州日报 · 2026秋季停车与限行提醒', published: '2026-09-30',
    evidence: '采用收费停车方案，不沿用葛岭路等旧免费攻略。P位置来自OSM停车地块975869996，仅作岳湖广场片区参考，不声称实测过车场入口。',
    mapLabel: '岳庙停车 · 收费'
  });
  const greenTea = place('绿茶餐厅（龙井船宴·品牌总店）', '餐厅', [120.11878, 30.23475],
    '龙井路上的正餐选择。按龙井总店完整名称查找，别导航到湖滨等其他分店；到店支线不计入主线里程。',
    '龙井路83号 · 公开店铺地址，地图为片区参考', sources.greenTea,
    { query: '绿茶餐厅 龙井路83号 龙井总店', mapLabel: '绿茶餐厅（龙井支线）', placement: 'detour' });
  const westlakeFood = [
    place('楼外楼（孤山路店）', '餐厅', [120.1360682, 30.2526548],
      '孤山方向的杭帮菜选择，需离开外围主线探店；进入拥挤游览空间后推行，不把游步道当骑行捷径。',
      '孤山路片区 · OSM餐厅点位3387263609', 'https://www.openstreetmap.org/node/3387263609',
      { query: '楼外楼 孤山路 杭州', mapLabel: '楼外楼（孤山支线）', placement: 'detour', status: 'OSM店名与位置已读取 · 营业及店门待核对' }),
    greenTea,
    place('Costa咖啡（西湖天地店）', '咖啡', [120.1546721, 30.2498757],
      '南山路西湖天地方向的咖啡停留选项，进商业公共空间后推行。地图资料不是当日营业保证。',
      '西湖天地商业片区 · OSM点位1563209637', 'https://www.openstreetmap.org/node/1563209637',
      { query: 'Costa咖啡 西湖天地 杭州', mapLabel: 'Costa（西湖天地）', status: 'OSM分店标记已读取 · 营业及店门待核对' })
  ];
  const records = [
    {
      id: 'westlake-road', number: '13', familyId: 'westlake-road', familyTitle: '西湖 · 外围道路环游',
      region: 'westlake', city: '杭州市', area: '杭州 · 西湖外围道路', title: '西湖 · 北山南山湖景环游',
      subtitle: '从岳湖广场片区出发，沿外围道路看湖。', duration: '1.5—2 小时', level: '轻松进阶', shape: '环线', window: 'day',
      dedicated: false, isolated: false, lane: '外围普通道路 · 景区步道不计',
      laneDetail: '沿北山街、南山路和杨公堤等公开道路规划，按非机动车标志与路口方向通行。未确认全程隔离骑行道；苏堤、白堤、湖岸步道没有默认纳入主线。',
      tags: ['西湖', '湖景', '收费停车', '杭帮菜', '日间'], parking: westlakeParking,
      description: '将原西湖研究方向转为收费停车方案。车停岳湖广场正式停车片区，推行到北山街允许的骑行入口，沿西湖外围道路完成一圈。骑行几何避开禁骑或准入未知的景区步道，餐厅和咖啡为可选支线。',
      stopNames: ['北山街道路起点', '北山街东段', '南山路南段', '杨公堤与茅家埠外围', '返回北山街起点'],
      stopNotes: ['停车区内卸车后按正式出入口推行接入。', '路口和游客密集处减速，按允许方向走。', '沿普通道路骑行，进入景点和商业空间时推行。', '不从景区内部步道抄近路。', '推行返回车场取车。'],
      food: westlakeFood, mapWater: { name: '西湖', point: [120.14, 30.245] },
      sources: [['2026秋季收费与机动车限行', sources.westlake], ['杭州政府出行指南', sources.westlakeTraffic], ['杭州文旅晨间杨公堤骑行方向', sources.morning]],
      notes: ['景区自驾存在单双号和部分区域“西湖通”限制，出发前查当天规则；自行车也须服从现场通行标识。', '规划不含景区门票、探店消费、车场内推行和探店绕行。', '收费停车与原免费路线分别筛选，不把夜间低价写成免费。']
    },
    {
      id: 'westlake-tea-road', number: '14', familyId: 'westlake-tea-road', familyTitle: '龙井 · 梅灵北路茶山',
      region: 'westlake', city: '杭州市', area: '杭州 · 龙井与梅灵北路', title: '龙井 × 梅灵北路 · 茶山折返',
      subtitle: '两段山路分开折返，不穿越准入未知的古道。', duration: '2—3 小时', level: '山路进阶', shape: '往返环路', window: 'day',
      dedicated: false, isolated: false, lane: '普通山路混行 · 含重复接驳',
      laneDetail: '龙井路与梅灵北路按普通道路规划，存在爬坡、弯道和机动车。龙井村段先返回道路交汇处，再去梅灵北路折返；未使用十里琅珰等古道，也没有穿越梅灵隧道。未确认连续自行车专用道。',
      tags: ['龙井', '梅灵北路', '茶山', '爬坡', '收费停车'], parking: westlakeParking,
      description: '共用岳湖广场收费停车点，先沿龙井路到龙井村外围，再回到龙井路与梅灵北路交汇处，走梅灵北路到隧道北口附近的公开道路折返。包含实际重复接驳，适合已有爬坡和下坡控速经验的骑友；没有编造穿山连接。',
      stopNames: ['北山街道路起点', '龙井寺外围道路', '龙井村道路折返点', '回到龙井路交汇处', '梅灵北路安全折返', '梅灵北路北段', '返回北山街'],
      stopNotes: ['停车取车条件同西湖外围方案。', '茶室为可选消费地点，不进入禁骑游步道。', '按现场标志选择允许掉头的位置。', '这段为真实重复接驳，已计入里程。', '不进隧道、不走古道，在开放的道路口安全折返。', '按单行和路口方向返回。', '留足推行回车场及取车时间。'],
      food: [greenTea, place('龙井茶室', '茶饮', [120.106989, 30.2241687], '茶山路段的茶饮停留选项，需离开车道、按茶室规则消费；不是免费补水设施。', '龙井寺外围 · OSM茶室点位13371708831', 'https://www.openstreetmap.org/node/13371708831', { mapLabel: '龙井茶室（茶饮）', status: 'OSM茶室记录已读取 · 当日营业与消费条件待确认' })],
      mapWater: { name: '西湖', point: [120.14, 30.245] }, sources: [['景区停车收费与限行', sources.westlake], ['龙井路总店资料', sources.greenTea]],
      notes: ['没有取得可靠爬升总量，不展示虚构的爬升米数；按山路进阶安排，雨天、夜间及缺少下坡经验时不采用。', '两段折返共用接驳路，19公里左右不代表一个不重复的茶山大环线。', '沿线优先茶饮，暂无本段已核对的咖啡分店；自带饮水和基础补给。']
    },
    {
      id: 'yucun-villages', number: '15', familyId: 'yucun-villages', familyTitle: '安吉 · 余村与银坑乡路',
      region: 'yucun', city: '湖州市安吉县', area: '湖州 · 安吉天荒坪', title: '余村 × 银坑 · 山麓乡路往返',
      subtitle: '在公开乡路上慢骑，把逛村和探店放在骑后。', duration: '0.5—1 小时', level: '乡路进阶', shape: '往返环路', window: 'day',
      dedicated: false, isolated: false, lane: '村镇普通道路 · 游览区推行',
      laneDetail: '只规划余村南侧与银坑村之间的公开道路，按村道混行安排；没有把矿坑游步道、索道区域或景区栈道作为骑行捷径。村内商业和游览空间按现场标志推行。',
      tags: ['安吉', '余村', '银坑', '乡村', '骑行社', '收费停车'],
      parking: parking({ id: 'yucun-one', name: '余村1号停车场', query: '安吉 天荒坪 余村1号停车场', address: '安吉县天荒坪镇 · 余村景区南侧停车片区', point: [119.6076, 30.5271], price: '参考 ¥10', priceSummary: '参考 ¥10', rule: '到访笔记记录收费 ¥10；当前计费单位与窗口须确认', condition: '使用正式1号停车场。小红书到访笔记写明停车费用10元、可扫码或ETC付费，但没有完整公示计费规则，也未显示年份；不能据此承诺当前10元/天或24小时出入。入场查看收费、开放和取车窗口，消费与停车分别计费。', source: sources.yucunParking, sourceTitle: '小红书 · Sophia的小日子《安吉自驾一日游》', published: '笔记显示07-19，未显示年份', verification: '个人到访收费记录已读取 · 现价及停车窗口未现场确认', evidence: '明确采用付费停车；没有把笔记中的观星台附近免费点推定为已核实公共泊位。P为景区南侧道路片区参考，导航按完整车场名查找。', mapLabel: '余村1号 · 收费参考' }),
      description: '以余村1号正式停车场为停车选择，推行到村南侧道路，沿公开乡路往银坑村方向骑行再返回。图书馆、乡音小馆和春林山庄可在出发前或回程后步行探店，银坑乡野骑行社是咖啡餐饮与骑行服务线索。',
      stopNames: ['余村南侧道路起点', '银坑村道路片区', '返回余村南侧'], stopNotes: ['先确认停车费和取车窗口，再按现场车场出口推行接入。', '村道注意来车，不进入田地、农户院落和禁止骑行空间。', '骑后按场所标识步行逛村、探店。'],
      food: [
        place('乡音小馆（余村）', '咖啡', [119.60683, 30.5274639], '小红书原始笔记介绍为旧水泥厂附近的音乐酒吧和咖啡停留点；与青年图书馆一起步行探访，不把自驾笔记里程当骑行里程。', '余村印象青年图书馆附近 · 村落片区参考', sources.yucunWalk, { placement: 'start', mapLabel: '乡音小馆（余村片区）', query: '余村 乡音小馆' }),
        place('春林山庄（余村）', '餐厅', [119.6070, 30.5278], '央广网实地报道的余村民宿与用餐地点。骑后可按完整店名寻找正餐，住店、餐饮与停车费用分开。', '安吉余村 · 村内片区参考', sources.yucunService, { placement: 'start', mapLabel: '春林山庄（余村片区）', query: '安吉 余村 春林山庄' }),
        place('乡野骑行社（银坑村）', '咖啡', [119.624967, 30.5102709], '央广网报道其提供咖啡餐饮、自行车存放和线路规划服务；同一店只收录一次。到店前确认具体入口和当天服务。', '安吉银坑村 · 蓝房子骑行社片区参考', sources.yucunService, { mapLabel: '乡野骑行社（银坑片区）', query: '安吉 银坑村 OKKA乡野骑行社' })
      ], mapWater: { name: '', point: [119.616, 30.526] }, sources: [['余村停车实际到访笔记', sources.yucunParking], ['余村探店原始笔记', sources.yucunWalk], ['央广网：余村餐饮与银坑骑行服务', sources.yucunService]],
      notes: ['小红书笔记中的半日动线是自驾与步行游览，本站5公里左右另按OSM道路规划。', '乡路有坡度，未核查爬升与全程照明，按日间进阶短骑安排。', '三个商户均为片区标记，探店绕行和园内步行不计入主线。']
    },
    {
      id: 'mogan-foothills', number: '16', familyId: 'mogan-foothills', familyTitle: '德清 · 庾村与劳岭水库',
      region: 'mogan', city: '湖州市德清县', area: '湖州 · 莫干山山麓', title: '庾村 × 劳岭 · 山麓咖啡骑',
      subtitle: '停在集散中心，骑乡路、逛庾村。', duration: '1—1.5 小时', level: '山麓进阶', shape: '往返环路', window: 'day',
      dedicated: false, isolated: false, lane: '普通乡路混行 · 不进入收费山上景区',
      laneDetail: '公开路网连接集散中心片区、庾村街区和劳岭水库周边道路。只走有道路几何且未标禁骑的普通道路，不把山上景交车道或莫干山登山步道算入方案；庾村人多处推行。',
      tags: ['莫干山', '庾村', '劳岭水库', '咖啡', '收费停车'],
      parking: parking({ id: 'mogan-transfer', name: '莫干山旅游集散（换乘）中心停车场', query: '德清 莫干山旅游集散换乘中心 停车场 燎原村', address: '德清县莫干山镇燎原村 · 别墅路与三莫线附近停车片区', point: [119.9044, 30.5963], price: '参考 ¥10', priceSummary: '参考 ¥10', rule: '停车30分钟—5小时参考 ¥10；更长停放分档收费', condition: '携程服务设施页列明：30分钟内免费、30分钟—5小时10元、5—10小时15元、10—15小时20元、15小时以上25元，属于参考价格，当前以场内公示为准。本方案按收费安排，不以30分钟短时免停包装免费。入场确认当天可取车时间；车停正规车位，骑行从地方道路接入，不进入景交专用区域。', source: sources.moganParking, sourceTitle: '携程景区服务设施 · 集散中心停车参考价格', published: '页面未标注停车规则更新日', verification: '平台停车参考规则已读取 · 入口公示与取车窗口需确认', evidence: '按用户允许的收费停车收录，明确参考价与现行公示的区别。P是集散中心停车片区参考，未声称实测车场入口。', mapLabel: '集散中心 · 收费' }),
      description: '以莫干山旅游集散中心的收费停车场为停车选择，从地方道路到庾村，再沿乡路去劳岭水库附近折返。全程不需要骑入山上收费景区；山麓路线也有起伏，并非平路入门环线。',
      stopNames: ['集散中心附近道路起点', '庾村街区外围', '劳岭水库道路折返点', '返回庾村街区', '返回集散中心片区'],
      stopNotes: ['按车场指示推行接入地方道路，停车入口按名称检索。', '进入广场和商户街区时推行。', '只在公共道路旁允许停留的位置看水库，不进入水库管理用地。', '咖啡和正餐可放在返程。', '预留推行与取车时间。'],
      food: [
        place('Red Cube（庾村）', '咖啡', [119.8942, 30.6012], '2026年悦游CNTraveler的庾村介绍中列有Red Cube，适合在镇区步行探店。与武康分店分别检索，不引用营销评分或价格。', '庾村商业街区 · 片区参考，具体店门待确认', sources.moganCafe, { mapLabel: 'Red Cube（庾村片区）', query: 'Red Cube 庾村 莫干山' }),
        place('金鱼妈妈 山野·食趣（广场店）', '餐厅', [119.8940, 30.6012], '公开页面的广场店地址为黄郛西路48号4号楼。平台点评混有山上青草荡店内容，导航须指定广场店，不照搬其他分店的体验。', '黄郛西路48号4号楼 · 庾村街区参考', sources.moganFood, { mapLabel: '金鱼妈妈（广场店）', query: '金鱼妈妈 广场店 黄郛西路48号 德清' }),
        place('Adventures Cafe（莫干山镇地图点）', '咖啡', [119.9002109, 30.6065848], '公开地图记录的咖啡点，位于主线北侧，需另走允许通行的道路。尚未核对当日营业，不能依赖它完成补给。', '莫干山镇北侧 · OSM点位4100960589', 'https://www.openstreetmap.org/node/4100960589', { mapLabel: 'Adventures Cafe（支线）', placement: 'detour', status: 'OSM店名与位置已读取 · 营业待核对' })
      ], mapWater: { name: '劳岭水库', point: [119.8890, 30.5879] }, sources: [['集散中心停车参考费用', sources.moganParking], ['2026庾村咖啡介绍', sources.moganCafe], ['广场店名称与地址', sources.moganFood]],
      notes: ['平台报价是参考费用，现场公示优先；停车、景区门票和餐饮是不同费用。', '劳岭水库的水面来自OSM reservoir地块，不将私人岸线、库区步道作为骑行道路。', 'Adventures Cafe为北侧额外支线；沿线商家营业和维修服务均不作当天保证。']
    }
  ];
  records.forEach(r => {
    const plan = REGIONAL_PLANS[r.id];
    r.distance = plan.distance; r.mapCyclewayKm = plan.cyclewayKm;
    r.geometryWays = plan.wayIds; r.geometrySource = plan.geometrySource; r.sourceChecked = checked;
    r.start = { name: r.stopNames[0], point: plan.anchors[0], gcj: gcj(plan.anchors[0]) };
    r.stops = plan.anchors.map((point, i) => ({ name: r.stopNames[i], point, gcj: gcj(point), note: r.stopNotes[i] }));
    r.parking = JSON.parse(JSON.stringify(r.parking));
    r.rest = [1, 2].filter(i => i < r.stops.length - 1).map(i => ({
      name: r.stops[i].name + ' · 歇脚建议', kind: '歇脚', point: r.stops[i].point, gcj: r.stops[i].gcj,
      query: r.stops[i].name, mapLabel: r.stops[i].name + '（歇脚）', placement: 'along',
      description: '在现场允许停留、不会妨碍行人车辆的位置短暂休息；不是已核查的厕所、座椅、饮水或修车设施。',
      location: r.area + ' · 道路途经片区', status: '规划歇脚建议 · 非设施核验',
      source: `https://www.openstreetmap.org/?mlat=${r.stops[i].point[1]}&mlon=${r.stops[i].point[0]}#map=17/${r.stops[i].point[1]}/${r.stops[i].point[0]}`, namedNavigation: true
    }));
    r.supply = [...r.food, ...r.rest];
    r.notes.push('路线为公开路网规划，未实骑或现场核验；按现场通行标志调整，补给绕行另计。');
    ROUTES.push(r);
  });
  ROUTES.forEach(r => { r.parking.feeType ||= 'free'; });
  // These four directions now have road plans and explicitly paid parking.
  window.EXPANSION_CANDIDATES = EXPANSION_CANDIDATES.filter(c => !['westlake-outer', 'westlake-tea', 'huzhou-moganshan-research', 'huzhou-anji-research'].includes(c.id));
  const jiapu = EXPANSION_CANDIDATES.find(c => c.id === 'huzhou-jiapu-research');
  Object.assign(jiapu, {
    status: '停车接驳待核查 · 已有南段道路研究图 · 非可出行方案',
    note: '已读交通部门风车点免费车位说明与2026停车指南，并通过OSM地图API取得真实道路。现有研究图覆盖滨湖大道辅道南段，尚未把风车免费泊位准确接入；停车指南提醒部分车场收费，不能整片区推定免费。',
    roadNote: '12.8km研究往返按实际滨湖大道辅道节点累计，绿色只覆盖该路径的cycleway段。此图不代表2026新建风车绿道的完整骑行几何，不延伸到缺少连通数据的北段。',
    missing: '风车泊位或其他正式停车场的准确定位、停车费用与取车窗口、合法接驳、实际沿线商户位置',
    preview: 'maps/jiapu-research.svg', previewNote: '12.8km南段道路研究，不含停车保证；风车点未标为起点。',
    foodNote: '9号湖畔咖啡有2026主理人报道；向·太湖在夹浦新街停车指南中出现。当前只能确认所在方向，未确认与南段研究线的到店道路距离。',
    sources: [...jiapu.sources, ['2026太湖9号停车指南：部分车场收费', sources.taihuParking], ['湖州日报：九号湖畔咖啡与骑行维修服务', sources.lakesideCafe]],
    places: [
      { name: '九号湖畔咖啡', kind: '咖啡', location: '太湖9号公路方向 · 具体店门与绕行待定位', note: '主理人报道明确咖啡、休憩与维修服务；服务时段和收费需另确认。', source: sources.lakesideCafe },
      { name: '向·太湖（Facing T）咖啡馆', kind: '咖啡', location: '夹浦新街、全民文艺文体中心附近', note: '2026停车指南点名，车场与店门位置尚未精确到地图。', source: sources.taihuParking }
    ]
  });
  const nanxun = EXPANSION_CANDIDATES.find(c => c.id === 'huzhou-nanxun-research');
  Object.assign(nanxun, {
    parkingNote: '2026湖州日报原文写练市镇公共停车场全部免费开放，但没有逐场名单和持续期限。不能把这一安排套用到南浔古镇、荻港或私人车场。',
    foodNote: '已读练市“春水德”乌程酒酿奶茶报道，可作为练市镇区探店线索；奶茶不是咖啡，镇区与荻港等其他方向分别规划。',
    places: [{ name: '春水德（练市）', kind: '茶饮', location: '练市镇大运河历史文化街区方向', note: '报道点名门店与酒酿奶茶，需进一步核对准确店门和营业；含酒酿的饮品应向店家确认成分后选择。', source: 'https://finance.sina.com.cn/roll/2026-04-30/doc-inhwfpqq6328586.shtml' }]
  });
  ['huzhou-huaxi-research', 'huzhou-lijiaxiang-research'].forEach(id => {
    const c = EXPANSION_CANDIDATES.find(c => c.id === id);
    c.parkingNote += ' 本次重读原文：24小时便民服务描述位于端午假期语境，不能外推为全年24小时停车及取车规则。';
  });
  EXPANSION_CANDIDATES.forEach(c => {
    c.status = c.status.replace('免费停车待核查', '停车与路网待核查');
    c.missing = c.missing.replace('免费停车条件与接驳复核', '停车费用、开放与接驳复核');
  });
  window.RESEARCH_MAPS = [RESEARCH_MAP, {
    id: 'jiapu-research', region: 'jiapu', title: '夹浦滨湖大道南段研究 · 停车接驳待核查',
    distance: REGIONAL_PLANS['jiapu-research'].distance, shape: '原路往返', research: true,
    stops: REGIONAL_PLANS['jiapu-research'].anchors.map((point, i) => ({ name: ['滨湖大道辅道南段', '夹浦南侧道路折返'][i], point })),
    supply: [], food: [], mapWater: { name: '太湖', point: [119.968, 31.098] }
  }];
  window.ROUTE_METADATA = {
    updated: checked, sourcesChecked: checked, routeCount: ROUTES.length,
    familyCount: new Set(ROUTES.map(r => r.familyId)).size,
    regionCount: new Set(ROUTES.map(r => r.region)).size,
    parkingCount: new Set(ROUTES.map(r => r.parking.id || r.parking.poiid)).size,
    freeParkingCount: new Set(ROUTES.filter(r => r.parking.feeType === 'free').map(r => r.parking.id || r.parking.poiid)).size,
    paidParkingCount: new Set(ROUTES.filter(r => r.parking.feeType === 'paid').map(r => r.parking.id || r.parking.poiid)).size,
    shopCount: new Set(ROUTES.flatMap(r => r.food.map(p => p.name))).size,
    restSuggestionCount: new Set(ROUTES.flatMap(r => r.rest.map(p => p.name))).size
  };
})();
