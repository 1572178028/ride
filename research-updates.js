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
})();
