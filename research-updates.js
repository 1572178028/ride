/* Missing evidence stays visible and never creates parking navigation. */
(() => {
  'use strict';
  const checked = '2026-10-16';
  const byId = id => EXPANSION_CANDIDATES.find(c => c.id === id);
  Object.assign(byId('huzhou-badu-research'), {
    checked, missing: '正规生态停车场准确实体、现行费用与取车窗口；停车到小柏线接驳及古街自行车准入。',
    parkingNote: '已读2025-12-09湖州日报：村民提供爱心庭院车位。没有逐院地址、主人许可或取车安排，不能作为固定公共停车；旧生态停车价目仍需复核。',
    roadNote: '小柏线已有真实路网；无名停车地块1259125300未能与景区生态停车场可靠对应，景交和步行游线不自动允许自行车。'
  });
  Object.assign(byId('huzhou-lijiaxiang-research'), {
    checked, missing: '停车站外位置与窗口、通向镇区的合法连续接驳；沿线餐咖分店。',
    parkingNote: '2026-06-17湖州日报明确长兴南、西站外服务站有免费停车及休息等功能；报道的假期24小时服务不能外推全年窗口。',
    roadNote: '站外至镇中心在当前允许路网不能连通；G104李家巷大道标为trunk，保留过滤，不画直线穿越高速或补齐缺段。'
  });
  Object.assign(byId('huzhou-lougang-research'), {
    missing: '义皋正规停车实体对应、公众准入及现行费用窗口；可合法接入的道路与商户。',
    parkingNote: '两处OSM停车地块和一个高德POI尚未完成可靠实体对应。古村免费门票不能证明停车免费，不能把两处地块合成一个车场。',
    roadNote: '已保存义皋片区实际路网，外围道路可以继续研究；田埂、生产便道和古桥步道仍须独立核准入。'
  });
  Object.assign(byId('huzhou-nanxun-research'), {
    missing: '荻港游客中心停车场的可靠公告、入口与取车条件；公开道路接驳及餐咖地址。',
    parkingNote: '搜索发现2026-03-04启动收费的转载线索，与早年免费游记冲突；未取得运营方正文和准确车场对应，不能继续标免费。练市的免费停车报道不套到荻港。',
    roadNote: '已有荻港道路快照，原拟锚点距允许道路超过350米，未放宽吸附阈值；古村游览与桑基鱼塘生产路不直接作为公共骑行主线。'
  });
  const candidate = (id, researchCity, area, title, direction, missing, parkingNote, roadNote, foodNote, sources, extra = {}) => ({
    id, researchCity, city: { jiaxing: '嘉兴市', shaoxing: '绍兴市', jinhua: '金华市', hangzhou: '杭州市' }[researchCity],
    area, title, direction, missing, parkingNote, roadNote, foodNote, sources, checked,
    status: '资料待核查 · 非可出行方案', note: '已保存研究证据；未满足停车或通行条件前不计入正式主线、停车或商户数量。', query: title, ...extra
  });
  EXPANSION_CANDIDATES.push(
    candidate('jiaxing-xiuzhou-research', 'jiaxing', '嘉兴 · 秀洲', '秀湖与石臼漾湿地', '湖岸与湿地外围公共道路。',
      '停车名称、公众准入与费用窗口；南段道路覆盖和湿地准入。',
      '停车way1127833983没有名称与对外规则，未把无名地块包装成公共免费停车。',
      '已保存秀洲路网；当前快照南段覆盖不足，不画线补洞。湿地木栈道自行车准入未知。',
      '没有与主线匹配的准确餐咖分店，先保存缺口。', [['OSM研究地块', 'https://www.openstreetmap.org/way/1127833983']]),
    candidate('shaoxing-didang-research', 'shaoxing', '绍兴 · 迪荡湖', '迪荡湖西南外围', '西施山路、迪荡湖路公共道路研究，园内游览另计。',
      '南停车场与OSM地块对应、实际出入口与骑行接驳；现价和完整取车窗口。',
      '已读2025-03-07媒体探访：南停车场参考5元/4小时，水木湾区车场参考5元/小时。西侧250余车位“暂免费”不作为常态免费；不把无名地块1289038459自动命名为南停车场。',
      '已生成5.4km真实公共道路研究图，无P。湖内步道、莲花阁引桥步梯不加入骑行；道路节点至停车出口未核实。',
      '一会儿下午茶有地图名称，但本线到店位置与合法支线待核；没有拿远处商圈店充作沿线。',
      [['绍兴网/浙江在线停车探访', 'https://zjnews.zjol.com.cn/zjnews/202503/t20250307_30865475.shtml?v=1.0'], ['OSM停车地块', 'https://www.openstreetmap.org/way/1289038459']],
      { preview: 'maps/didang-research.svg', previewNote: '仅为真实道路研究图；无停车导航，不计入正式方案。5.4km不包含未核实的停车接驳。' }),
    candidate('shaoxing-eastlake-research', 'shaoxing', '绍兴 · 东湖', '东湖景区外围', '纠正停车定位后再规划公众道路。',
      '景区正式停车场准确入口与到公共道路的合法接驳；餐咖店名与公众准入。',
      '2025官方出行指引确认景区有正式车场，假日路侧免费是临时措施。景区在WGS84约120.63/30.00；120.669/30.005的无名停车地块位于更东侧，不能当成景区停车。',
      'OSM景区relation10123511与湖relation17971763确认真实位置。入口附近G104主道为trunk，不能放宽过滤；景内步道也未确认准入。',
      '“绍味堂”实际为杭电绍兴校区食堂，未确认校外公众准入，已排除。',
      [['绍兴发布停车指引', 'https://m.thepaper.cn/baijiahao_30752523'], ['东湖景区实际边界', 'https://www.openstreetmap.org/relation/10123511'], ['杭电校区食堂说明', 'https://ic.hdu.edu.cn/2026/0916/c14110a300412/page.htm']]),
    candidate('shaoxing-jianhu-research', 'shaoxing', '绍兴 · 鉴湖', '鉴湖与柯岩外围', '重核湖面、停车与公共道路。',
      '正确停车与湖岸位置、现行费用及开放窗口、公众道路连续几何。',
      '当前研究没有取得可可靠对应的公众车场，不套用全市旅游景点通用价目。',
      '原bbox120.404—120.458/29.946—29.98未取得具名湖面与停车，不能发布完整鉴湖路线。',
      '主线位置未确定，暂不标注沿线餐厅咖啡。', [['OSM公开地图', 'https://www.openstreetmap.org/']]),
    candidate('jinhua-shuanglong-research', 'jinhua', '金华 · 双龙', '双龙山路', '山麓公共道路与景区接驳研究。',
      '正规停车公众准入与费用窗口；自行车准入、爬升与完整路网接驳。',
      '快照两处无名停车地块未核公众开放，不将假日接驳或景区免票等同常态免费停车。',
      '双龙洞实际节点370303616位于119.6203696/29.2042945；山路强度与换乘管理仍缺依据，洞内游线不是骑行路面。',
      '没有合法到店接驳与营业资料，不依赖山上商户补给。', [['双龙洞实际位置', 'https://www.openstreetmap.org/node/370303616']]),
    candidate('hangzhou-canal-night-research', 'hangzhou', '杭州 · 运河夜骑', '运河桥西夜间方向', '以公共街道照明和夜间停车窗口为前提。',
      '停车夜间出入/取车窗口、连续照明路网及夜间公众准入。',
      '湖墅51有具名公众收费地图记录，但未取得夜间取车窗口。已收录日间方案，不外推夜间可用。',
      '只用lit=yes的路网无法把停车周边与桥西北段完整连通，因此未发布“全程有灯”的夜骑。拱宸桥有台阶，不骑跨。',
      '觅会咖啡、院子餐厅有公开位置；夜间营业未知，自带补给。', [['湖墅51地图记录', 'https://www.openstreetmap.org/node/9737245752']]),
    candidate('hangzhou-binjiang-night-research', 'hangzhou', '杭州 · 滨江夜骑', '滨江闻涛路夜间方向', '核实钱塘江南岸道路和P+R车场。',
      '停车夜间窗口、现价、南岸连续照明与合法骑行几何。',
      '江陵路P+R有停车类型记录，未取得夜间费用与取车窗口；教工车场不是公众备选。',
      '已有快照的3条lit道路实际在北岸之江路，不能当南岸闻涛路照明证据。',
      '没有已核夜间补给窗口，不依赖沿岸商家。', [['江陵路P+R地图记录', 'https://www.openstreetmap.org/way/520287620']])
  );

  // Follow-up audit: checking a direction is distinct from clearing every gate.
  const review = (id, outcome, status, note, details, sources = []) => {
    const c = byId(id);
    Object.assign(c, { reviewedAt: checked, reviewOutcome: outcome, status, note, ...details });
    for (const source of sources) if (!c.sources.some(s => s[1] === source[1])) c.sources.push(source);
  };
  review('huzhou-badu-research', 'parking-unmatched', '已复核 · 停车与准入仍缺依据',
    '小柏线公共道路可以继续研究；村民爱心庭院车位需要逐户同意，不能作为固定公共停车起点。生态停车场的入口对应与现行管理仍未补齐。', {
      missing: '具名生态车场入口及现行费用、取车窗口；小柏线与古街、景区游线的自行车准入边界。',
      roadNote: '重新检查已存小柏线道路，保持真实连通和原路返回条件；不把景交车、观光小火车或收费游览步道并入骑行。',
      parkingNote: '本轮复核旧停车资料和路网地块：爱心车位不是固定公众车场，2020/2021旧价目不作为2026现价。新搜索中的停车改造/测绘项目也不能证明已经开放。'
    });
  review('huzhou-lijiaxiang-research', 'connector-unresolved', '已复核 · 免费依据有，接驳未通',
    '已重新读到长兴南站外开放式服务站免费停车的报道；但站外车位至李家巷的合法连续骑行接驳仍未解决，暂不发布出行方案。', {
      missing: '站外正式车位、出口与完整取车窗口；避开高速匝道和G104主道的连续接驳。',
      parkingNote: '2026-06-17湖州日报原文再次读取，确认长兴南/西开放式服务站提供免费停车、休息室和卫生间。报道的端午24小时便民服务不作为全年车场窗口。',
      foodNote: '服务站零售食品饮料有原文；没有具名餐厅或咖啡分店，不把零售服务计为已核商户。'
    });
  review('huzhou-lougang-research', 'parking-unmatched', '已复核 · 车场存在，位置待对应',
    '浙江日报实地报道确认义皋游客服务中心有停车场，新村另有停车场。当前两个地图地块仍未可靠对应到这些具名场所，费用与开放条件也未查明。', {
      missing: '游客中心车场与地图地块的对应、公众入口、现价和取车窗口；外围公共道路接驳。',
      parkingNote: '2023-06-07浙江日报记者实际到访，确认游客服务中心大巴停车及新村停车场；文章未列费用，古村免票不能推出停车免费。旧高德POI本轮正文未打开，不提升为入口核验。',
      foodNote: '报道有返乡经营饭店的居民，但未给完整店名和店门，不据人名创造商户。'
    }, [['浙江日报实地探访 · 游客中心与新村停车', 'https://zjnews.zjol.com.cn/zjnews/202306/t20230607_25828859.shtml']]);
  review('huzhou-nanxun-research', 'operator-confirmation-needed', '已复核 · 收费转载已读，入口待核',
    '已打开荻港停车收费公告的第三方转载：称游客中心大小车场自2026年3月4日起收费。不能继续沿用早年“停车免费”攻略；原始运营公告和车场入口仍需补齐。', {
      missing: '荻港原始运营公告、游客中心大小车场准确入口与取车条件；接至公共道路的真实路径。',
      parkingNote: '2026-02-11转载称小车30分钟至6小时5元、6至24小时10元，不能把首30分钟免停算作完整骑行免费。只作为待核参考，未当作运营方现价承诺。',
      roadNote: '本轮重查荻港快照：仍没有可匹配的具名停车实体，原锚点不合格；不扩大吸附范围强接桑基鱼塘生产路。'
    }, [['停车收费公告第三方转载 · 已读，原公告待核', 'https://www.15386.cn/post/102109.html']]);
  review('jiaxing-xiuzhou-research', 'parking-location-needed', '已复核 · 找到具名停车和骑行资料',
    '2026年南湖晚报列出秀洲大道停车场、文化艺术中心地下车场及生态公园南停车场；国家体育总局资料明确介绍秀湖的骑行道。已补齐湖岸快照，具名车场入口与具体可骑段仍未完成对应。', {
      missing: '具名车场入口、现行公众开放/取车条件、园内具体可骑路径与外围接驳。',
      parkingNote: '2026-01-28出行指引：秀洲大道767号车场3小时内免费，文化艺术中心限时/扫码优惠；另列住建局地面车场和生态公园南车场免费。活动指引不外推为全年规则，也不把3小时免停变成不限时免费。',
      roadNote: '国家体育总局2020年报道秀湖智慧跑道分漫步道和骑行道，补充骑行用途依据；仍须核对具体经过哪一段。本轮已取得覆盖湖岸南段的新快照，新增无名停车地块1127834017邻近生态公园；但湖岸73条footway没有自行车准入标记，未将步道直接作为骑行主线。'
    }, [['南湖晚报2026停车点名与优惠条件', 'https://finance.sina.com.cn/roll/2026-01-28/doc-inhiwhqt7361512.shtml'], ['国家体育总局 · 秀湖漫步道与骑行道', 'https://www.sport.gov.cn/n14471/n14482/n14519/c948363/content.html']]);
  review('shaoxing-didang-research', 'parking-unmatched', '已复核 · 南、西车场明确分开',
    '南车场是西施山路转环湖支路的34车位场；西侧250余生态车位是另一处场地。已核对两篇建设/探访报道，不再把无名大地块套成南停车场。', {
      missing: '南车场或西侧生态车场与地图的可靠对应、真实出口接驳、现价与取车窗口。',
      parkingNote: '2024-03-25建设报道定位250生态车位在保利迪荡湖壹号西侧，当时仍在协商收费；2025-03-07实访称西侧暂免费、南场34位参考5元/4小时。建设与暂免费记录均不当现行长期免费。',
      roadNote: '仅保留5.4km外围公共道路研究图。报道允许骑自行车接驳的建议不等于环湖所有步道都允许骑行；莲花阁引桥步梯继续排除。'
    }, [['2024生态停车场建设与收费未定的原文', 'https://zjnews.zjol.com.cn/zjnews/202403/t20240325_26735453.shtml']]);
  review('shaoxing-eastlake-research', 'connector-unresolved', '已复核 · 景区车场有，准入未闭合',
    '已重新读取绍兴发布停车指引，确认东湖景区正式车场；假日临时路侧免费与科学园接驳均不能转成常态骑行停车。景区入口至可骑公共道路的连接仍缺依据。', {
      missing: '景区正式车场入口与现价/取车窗口，避开G104主道的合法连续骑行接驳。',
      parkingNote: '2025-04-30绍兴发布列景区车场约140位和五一临时泊位；水木湾区科学园是另一个车场，公交接驳也仅为假日安排，不将其收费套给东湖。',
      roadNote: '继续使用正确的东湖景区范围；不将东侧120.669附近地块当入口，不骑入未核准入的园内步道。'
    });
  review('shaoxing-jianhu-research', 'parking-access-unresolved', '已复核 · 湖岸可骑线已有，停车待核',
    '同程实际页面列出柯岩风景区停车场和柯岩大道558号，补上具名停车实体线索。新快照补上正确湖岸和标有自行车准入的鉴湖慢行步道；车场入口、管理与步道接驳仍须对应。', {
      missing: '柯岩或鉴湖江北岸车场公众入口、当前收费/取车条件；至可骑慢行道的完整接驳。',
      parkingNote: '同程无发布日期页面列5元/小时，又有每2小时10元、4小时内10元等口径；不选一个金额当现价。园区冬夏开放时间不等于停车取车窗口。',
      roadNote: '旧范围120.404—120.458/29.946—29.98未覆盖正确入口。古桥、岛屿和售票游览线不能视作骑行道；本轮已取得正确范围120.45—120.51/30.04—30.08，包含鉴湖relation11335116，以及1246053702等bicycle=designated慢行道。具名鉴湖江北岸车场1327461263标fee=yes、仅首30分钟免费，尚无完整开放/入口资料，不套用为柯岩景区车场。'
    }, [['同程 · 柯岩停车实体、地址与相互不同的参考口径', 'https://m.ly.com/scenery/scenerybddetail-5950.html'], ['OSM鉴湖慢行步道 · 标有自行车准入', 'https://www.openstreetmap.org/way/1246053702'], ['OSM鉴湖江北岸收费车场 · 入口窗口未核', 'https://www.openstreetmap.org/way/1327461263']]);
  review('jinhua-shuanglong-research', 'access-unresolved', '已复核 · 交通管理与停车仍须匹配',
    '双龙山路不能只凭地图能连通就收录。已读取景区条例全文中的通行管理要求；暑期限行公告另有搜索线索，未把特定年份的暑期规则外推到全年。', {
      missing: '具体车场公众入口、现价及取车条件；当前道路自行车准入、完整几何和爬升。',
      parkingNote: '两处山上停车地块仍未对应运营车场。2018临时停车/免费换乘不是常态免费依据，也不把景区门票优惠当停车优惠。',
      roadNote: '2022条例全文明确可按道路和流量对机动车、非机动车采取限行措施，应依公告。2025暑期限行只取得搜索正文，直接页面未打开，不标为本轮已读公告，更不写成2026永久禁骑。'
    }, [['浙江在线刊载景区条例全文 · 非实时限行公告', 'https://jinhua.zjol.com.cn/jsbd/202205/t20220530_24301094_ext.shtml']]);
  review('hangzhou-canal-night-research', 'night-window-unresolved', '已复核 · 夜间取车与连续照明待核',
    '新增小河公园地下车场的实地报道作为备选研究；报道中的夜间保洁不证明车库24小时可取车。现有运河日间方案继续有效，暂不复制为夜骑。', {
      missing: '湖墅51或小河公园车库的夜间取车公示、现价及停车出口；全程准入与照明路段。',
      parkingNote: '2025-03-06记者走访确认小河公园地下车库运营，运营方介绍夜间保洁安排；未写车库出入窗口。另有7×24电子开票采购线索，它是开票服务，不能当24小时车库开放。',
      roadNote: '本轮重查现存路网照明，湖墅51周边至桥西仍无法用已标照明路段完整连通；古拱宸桥台阶与未核的岸边步行空间继续排除。'
    }, [['都市快报实访与运营方回复 · 车库存在，夜取车未说明', 'https://hznews.hangzhou.com.cn/shehui/content/2025-03/06/content_8874182.htm']]);
  review('hangzhou-binjiang-night-research', 'parking-withdrawn', '已复核 · 原车场有停用公告',
    '江陵路站临时P+R车场有2024年4月1日起停用的现场公告报道，尚未找到恢复依据，已从可用停车候选中排除。闻涛路有真实骑行与亮灯报道，仍须另找可夜间取车的正式车场。', {
      direction: '闻涛路南岸道路；原江陵路临时P+R车场已排除。',
      missing: '替代公众车场的准确入口、夜间现价和完整取车窗口；南岸当前通行、照明及连续路网。',
      parkingNote: '2024-03-21都市快报现场核对通知，原车场自4月1日起停用；不能因为OSM仍保留parking标签就推荐停车。丹枫实验小学临时停车场只作为旧报道替代线索，未核现状。',
      roadNote: '2022-05-06报道七甲闸至西兴大桥段有步行道+骑行道及亮灯景观；其中24小时开放指室外篮球场，不是整段绿道或停车场。2016夜骑旧文只作历史背景，旧亮灯时刻不外推到2026。北岸之江路照明仍不套用南岸。',
      excludedParking: ['520287620'],
      sources: [['都市快报 · 江陵路临时车场停用公告实访', 'https://www.hzzx.gov.cn/cshz/content/2024-03/21/content_8704440.htm'], ['都市快报 · 闻涛路2.0开放路段与步骑用途', 'https://zjnews.zjol.com.cn/zjnews/hznews/202205/t20220506_24189324.shtml'], ['都市快报2016夜骑介绍 · 历史背景', 'https://hznews.hangzhou.com.cn/wenti/content/2016-05/04/content_6163836.htm']]
    });
  const puyangPlan = REGIONAL_PLANS['puyang-greenway-research'];
  const puyangStops = ['临浦外滩沿江慢行道南段', '浦阳江沿岸绿道中段', '义桥方向绿道北端'];
  const puyangNotes = [
    '研究路径从道路图上的cycleway南段节点起算；临浦外滩停车接驳距离未核实。',
    '经过浦阳江滨水慢行系统；按当日骑行标识与临时施工公告通行。',
    '义桥方向研究折返点，按原路返回。'
  ];
  EXPANSION_CANDIDATES.push({
    id: 'puyang-greenway-research', region: 'puyang', researchCity: 'hangzhou',
    city: '杭州市萧山区', area: '萧山 · 浦阳江沿江绿道',
    title: '浦阳江绿道 · 临浦至义桥沿江段',
    direction: '沿浦阳江萧山段堤顶慢行道，从临浦方向向义桥、渔浦一带骑行。',
    note: 'OSM可连通道路规划往返约 ' + puyangPlan.distance.toFixed(1) + ' km；绿色叠线仅标实际落在cycleway way上的路段。当前为停车接驳待核的研究预览。',
    missing: '临浦外滩10号足球公园免费停车的具体地块与入口、覆盖整段行程的开放和取车窗口；绿道入口接驳、现场准入以及沿线商家位置。',
    parkingNote: '2026-09-09报道写明临浦外滩10号足球公园桥下空间“停车免费”并称公园已开放；正文没有具体车位地块、入口、公众停车条件或免费取车窗口。邻近OSM停车地块尚无法可靠对应到该公园，所以研究图不放P，也不生成驾车到停车点导航。',
    roadNote: '萧山发布2020年报道记录浦阳江景观提升23公里、三期段12公里，并称堤顶空间改造为慢行系统；杭州亚运在萧山2022年介绍浦阳江绿道沿江而建。OSM 2026-10-20快照中，这条往返研究路径包含多个highway=cycleway分段。2025年路线文章与小红书实拍提供骑行到访佐证，但不代表所有路段全年准入。',
    foodNote: '2026-09-09报道记载临浦外滩10号足球公园内“外滩撤离点”提供果汁和咖啡，报道时提到营业至凌晨2点；当前营业、店门和骑行支线未复核，不计正式商户。其余沿线餐饮咖啡尚待定位核实。',
    sources: [
      ['萧山发布：浦阳江绿道建设进度与堤顶慢行系统（2020-12-06）', 'https://zzhz.zjol.com.cn/hz/fb/202012/t20201206_12461356.shtml'],
      ['亚运在萧山：浦阳江绿道（省级绿道1号线支线）（2022-07-29）', 'https://www.hangzhou2022.cn/sqzc/hzsq/202207/t20220729_51198.shtml'],
      ['萧山骑行路线介绍：浦阳江绿道与分流描述（2025-04-24）', 'https://www.163.com/dy/article/JTTEBB9705149IKJ.html'],
      ['临浦外滩10号足球公园报道（2026-09-09）', 'https://www.sohu.com/a/1073885682_121123734'],
      ['小红书：萧山浦阳江绿道｜5公里休闲骑行路线', 'https://www.xiaohongshu.com/explore/6ab11893000000003100d1cf'],
      ['OpenStreetMap版权与许可', 'https://www.openstreetmap.org/copyright']
    ],
    checked: '2026-10-20', reviewedAt: '2026-10-20',
    reviewOutcome: '真实慢行路网已连通；停车实体和完整免费窗口仍待核实，保留研究状态。',
    status: '道路已绘 · 停车与接驳待核查',
    query: '浦阳江绿道 临浦外滩 渔浦公园',
    preview: 'maps/puyang-greenway-research.svg',
    previewNote: puyangPlan.distance.toFixed(1) + ' km为沿公开道路节点计算的往返研究里程，不含停车接驳。此图没有停车标记、停车导航或免费承诺。',
    familyId: 'puyang-greenway-research', photoTarget: 3,
    photoMissing: 0, photoGap: '当前图注已注明拍摄段未标明；如后续拆分短线方案，再补能定位到具体短线的照片。',
    places: [{
      name: '外滩撤离点', kind: '咖啡',
      location: '临浦外滩10号足球公园桥下集装箱空间 · 店门待定位',
      note: '报道记录果汁、咖啡并称报道时营业至凌晨2点；当前营业与到店支线未核，不计正式补给。',
      source: 'https://www.sohu.com/a/1073885682_121123734'
    }]
  });
  RESEARCH_MAPS.push({
    id: 'puyang-greenway-research', region: 'puyang', research: true,
    title: '浦阳江沿江慢行道 · 停车接驳待核',
    distance: puyangPlan.distance, shape: '研究往返',
    stops: puyangPlan.anchors.map((point, index) => ({ name: puyangStops[index], point })),
    food: [], supply: [], mapWater: { name: '浦阳江', point: [120.215, 30.055] }
  });
})();
