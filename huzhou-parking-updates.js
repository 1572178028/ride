/* Map parking search 2026-10-20. Fee defaults are explicit planning assumptions. */
(() => {
  const checked='2026-10-20';
  const roadsideRule='路侧停车位默认免费，实际收费及禁停以现场标志为准。仅使用现场合法划线泊位，限时或专用车位按公示执行。';
  const option=(name,address,provider,poiId,extra={})=>({name,address,provider,poiId,city:'湖州市',checked,query:name+' '+address,source:provider==='amap'?'https://www.amap.com/ssr/search/poi_detail?id='+poiId:'https://map.baidu.com/poi/?uid='+poiId,feeType:'unknown',feeBasis:'unpublished',feeLabel:'费用与开放窗口待确认',note:'地图条目已读取；位置为平台参考，非入口实测。停车至骑行道路接驳尚需核对。',...extra});
  const roadside=(name,address,provider,poiId,extra={})=>option(name,address,provider,poiId,{roadside:true,feeType:'free',feeBasis:'user-default-roadside',feeLabel:'路侧泊位 · 默认免费',rule:roadsideRule,...extra});
  const records=[
    {id:'huzhou-badu-research',missing:'景区车场当前收费及取车窗口；从车场接入小柏线的实际道路与古街自行车准入。',options:[option('八都岕景区大门南停车场','长兴县小浦镇小浦村','amap','B0FFLC9ZT2',{gcj:[119.802933,31.019709],feeType:'paid',feeBasis:'visitor-paid-reference',feeLabel:'收费参考 · 现价入场确认',rule:'高德参考08:00—16:30；2025-11-25访客记录约3小时收费10元，不作为2026现价。',note:'具名景区车场，不是路侧泊位。地图列地面停车场，2026年7月有出入评价；景区营业时间不等于完整取车窗口。'})]},
    {id:'huzhou-lijiaxiang-research',missing:'路侧泊位到李家巷镇区/水乡方向的合法骑行接驳，避开G318及高速匝道；沿线餐咖与连续道路核对。',options:[roadside('路侧停车场','长兴县318国道与创智路交叉口西北400米','amap','B0M1SANVF3',{gcj:[119.973675,30.941925],note:'地图明确分类为路边停车场。不是G318路肩；仅按具名点查找现场泊位。距所选骑行起点的道路距离未核，不把园区泊位直接当作镇区出发口。'})]},
    {id:'huzhou-lougang-research',missing:'路侧泊位入口到义皋/溇港湖岸可骑道路的实际接驳与准入；公共服务设施与补给地址。',options:[roadside('义皋村露营地东侧-路边停车场','吴兴区湖薛路','baidu','a250f54380f4fd4e00ff2dec',{note:'百度详情明确分类为路侧停车场，位于湖薛路；不是营地消费专享车位的证明，现场须核对划线和公众使用条件。'}),roadside('路侧停车场','吴兴区义皋大道与湖薛路交叉口北140米','amap','B0MRK15GPC',{gcj:[120.289825,30.927075],note:'高德详情明确为路边停车场。与百度营地东侧条目分别登记，未证明同一地块，不合并为一个车场；接驳路线仍待核对。'})]},
    {id:'huzhou-nanxun-research',missing:'荻港古村车场入口现行收费/取车规则及公开道路接驳；和孚镇区路侧备选至古村的实际距离，不将古村步道默认作骑行道。',options:[option('荻港古村-西门地上停车场','南浔区和孚镇荻港村，丝绸小镇·荻港景区','baidu','cb15b249831fd38af8221399',{rule:'具名景区车场，不适用路侧默认免费规则。已有2026年收费转载线索，当前价格与适用车场范围仍须看入口公示。',note:'百度搜索及打开条目已读。区别西侧停车场、东南侧车场和酒店车场；未把它们拼成同一停车入口。'}),roadside('荻港路-路侧停车场','南浔区荻港路和孚镇人民政府东侧约210米','baidu','7db98ae511fa742fd518b73a',{note:'位于和孚镇区，作为区域备选，不是荻港古村门口。尚未计算至古村的实际道路接驳，不能标成古村沿线即停即骑。排除搜索中的安吉县同名荻港路。'})]}
  ];
  for(const record of records){
    const c=EXPANSION_CANDIDATES.find(c=>c.id===record.id);
    c.parkingOptions=record.options;c.parkingReviewedAt=checked;c.missing=record.missing;
    c.status='停车点已补 · 骑行接驳待核查';
    c.note='已通过高德/百度补入'+record.options.length+'处可查找的停车备选。路侧泊位按用户规则默认免费，已知收费车场单列；完整骑行方案仍须补齐卡片所列接驳与准入。';
    c.parkingNote=record.options.map(p=>p.name+'（'+p.address+'）：'+p.feeLabel+'。'+(p.rule||'费用及取车窗口须现场核对。')+p.note).join(' ');
    for(const p of record.options)c.sources.push([(p.provider==='amap'?'高德':'百度')+'停车条目：'+p.name,p.source]);
  }
})();
