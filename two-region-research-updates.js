/* Shuanglong / Shaoxing East Lake evidence update. Research only, 2026-10-20. */
(() => {
 const checked='2026-10-20';
 const poi=(name,address,city,id,extra)=>({name,address,city,query:name+' '+city,provider:'amap',poiId:id,source:'https://www.amap.com/ssr/search/poi_detail?id='+id,checked,...extra});
 const update=(id,fields,sources)=>{const c=EXPANSION_CANDIDATES.find(c=>c.id===id);Object.assign(c,{checked,reviewedAt:checked,...fields});for(const s of sources)if(!c.sources.some(x=>x[1]===s[1]))c.sources.push(s);};
 update('jinhua-shuanglong-research',{
  status:'已复核 · 路侧泊位与骑行攻略已补，接驳待核',reviewOutcome:'parking-found-connector-review',
  note:'已找到智者街具名路侧停车位，按用户约定默认免费；景区账号10月8日发布智者寺—双龙湖—双龙洞—鹿女湖骑行攻略。现有路网可构建至洞前方向约7.87公里单程，仍是研究结果，未确认为可出行方案。',
  missing:'路侧泊位合法出入与道路起点的实际接驳；完整去回路线、爬升和当日通行；沿线餐咖准确位置。鹿女湖方向超出现有快照北界，需补路网。',
  parkingNote:'高德B0MDB6G8XL明确为智者街路边停车场，位于智者街与罗电线交叉口东北80米。导航点GCJ-02为119.626725/29.164525；换算WGS84后距现有允许路网节点约10米，仅为吸附差，不能说已核实10米接驳。景区游客中心及二仙洞属于收费车场，不套用路侧默认免费。',
  roadNote:'景区小红书账号10-08发布10公里、爬升500米以上的99道拐骑行攻略；这是原帖行程，不能当作本项目精确里程或爬升。婺城新闻网2025-07-07实地报道罗电线骑行车队。2026国庆公告只限10月1—7日8:00—16:30部分机动车，不外推全年自行车禁行或无条件准入。山路与机动车混行，未核自行车专用道。雨雪、落石与临时管制需现场确认，洞内及霞客古道不作骑行路径。',
  foodNote:'已找到智者草堂、山野醺集和景区农家乐线索；只列可继续核对地点，未确认店门坐标、到店支路或当日营业，不计正式商户。游客中心开水服务有景区攻略转载说明，服务开放仍以现场为准。',
  parkingReviewedAt:checked,
  parkingOptions:[poi('智者街-路侧停车场','智者街与罗电线交叉口东北80米','金华市','B0MDB6G8XL',{feeType:'free',feeBasis:'user-default-roadside',feeLabel:'路侧泊位 · 默认免费（用户规划约定）',gcj:[119.626725,29.164525],rule:'路侧停车位默认免费，实际收费及禁停以现场标志为准。仅用合法划线泊位；限时、专用或明确收费标志优先。',note:'地图已明确路边停车场类型；未核现场泊位、出入方向及取车时限，暂不作为正式骑行停车导航。'})],
  places:[{kind:'茶饮 / 咖啡线索',name:'智者草堂',location:'双龙山麓智者寺周边，精确店门待核',note:'景区2026国庆交通攻略列智者寺（智者草堂）站；不采用游客帖中未经独立核对的停车免费或营业时间。',source:'https://www.sohu.com/a/1081865181_123007306'},{kind:'餐厅线索',name:'胡春华饭店',location:'双龙景区，准确分店与路段待核',note:'景区攻略转载列名的农家乐；未证实位于本研究路径沿线，不计正式补给。',source:'https://www.sohu.com/a/967399275_121117448'}]
 },[['景区账号 · 鹿女湖环湖骑行与99道拐原帖','https://www.xiaohongshu.com/explore/6ac5b91f000000000202821b'],['婺城新闻网 · 罗电线实际骑行与沿线村落','https://jhwcw.zjol.com.cn/wcnews/system/2025/07/07/035000391.shtml'],['2026国庆景区交通公告转载 · 仅该假期','https://www.sohu.com/a/1081865181_123007306'],['景区2026停车与服务说明转载 · 非独立运营核验','https://www.sohu.com/a/967399275_121117448'],['高德 · 智者街路侧停车场','https://www.amap.com/ssr/search/poi_detail?id=B0MDB6G8XL']]);
 update('shaoxing-eastlake-research',{
  status:'已复核 · 收费车场已定位，公开道路接驳待补',reviewOutcome:'parking-located-network-gap',
  note:'高德已确认绍兴东湖风景区停车场实体、24小时营业条目及近期收费评价；携程列4小时内10元参考。现有允许路网无法连接景区入口与外围目标道路，继续保留研究状态。',
  missing:'停车出口至外围可骑道路的真实连接，G104辅道/过街通行核对；完整连通路线及沿线补给。收费以入口公示为准。',
  parkingNote:'高德B023F0P6XD为绍兴东湖风景区地面停车场，导航点GCJ-02为120.629374/30.001979，条目显示24小时营业。2026-09-05用户评价称收费10元，属于到访参考。携程无发布日期页面列15分钟以上且4小时内10元；未取得超4小时规则，不承诺10元全天。2025五一临时免费泊位不外推常态。',
  roadNote:'导航点换算WGS84约120.625295/30.004606；距当前允许路网最近节点约242米，且到外围研究目标无法构图连通。该数为直线吸附差，不是骑行接驳距离；不放宽G104 trunk过滤或跨越步道补直线。景内船游、石壁步道与直升机环线均不作为自行车路线。',
  foodNote:'原候选绍味堂属高校食堂，继续排除。文旅文章推荐的niduu kafe在上大路223号，属于古城区域，不能当东湖沿线咖啡店；暂自备水和能量补给，不依赖商家完成研究线路。',
  parkingReviewedAt:checked,
  parkingOptions:[poi('绍兴东湖风景区停车场','越城区东湖镇，景区入口周边','绍兴市','B023F0P6XD',{feeType:'paid',feeBasis:'platform-reference',feeLabel:'收费参考 · 4小时内10元（平台资料）',gcj:[120.629374,30.001979],rule:'携程参考15分钟以上且4小时内10元；高德2026-09-05评价称收费10元，未说明时长。超时规则与现价入场确认。高德条目显示24小时营业，未电话或现场核验。',note:'已对应真实景区附近具名车场，排除120.669附近错误地块；停车至可骑道路接驳尚未闭合，不生成正式骑行停车导航。'}),poi('东湖路-路侧停车场','东湖路与人民东路交叉口南60米','绍兴市','B0L35RES87',{feeType:'free',feeBasis:'user-default-roadside',feeLabel:'路侧泊位 · 默认免费（区域备选）',gcj:[120.642742,29.992943],rule:'路侧停车位默认免费，实际收费及禁停以现场标志为准。只使用合法划线车位。',note:'与景区车场约1.6公里直线距离，不是景区门口；真实道路接驳尚未核实，不能把直线距离作为骑行距离。'})]
 },[['高德 · 东湖景区停车场实体、营业与评价','https://www.amap.com/ssr/search/poi_detail?id=B023F0P6XD'],['携程 · 东湖景区停车收费参考','https://you.ctrip.com/sight/shaoxing18/2206.html'],['绍兴文旅内容转载 · 咖啡店实在古城区','https://www.sohu.com/a/954416441_121106994']]);
})();
