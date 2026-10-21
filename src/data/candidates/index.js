export default [
  {
    id: "huzhou-lijiaxiang-research",
    area: "湖州 · 长兴李家巷",
    title: "李家巷水乡方向",
    direction: "长兴南开放式服务站—镇村地方道路方向",
    query: "长兴南收费站 开放式服务站",
    status: "停车点已补 · 骑行接驳待核查",
    note: "已尝试从新增路侧停车点构图；现有快照最近可通行节点约397米，且局部道路与镇区路网不连通。不能画直线填补，继续保留待核查。",
    parkingNote:
      "路侧停车场（长兴县318国道与创智路交叉口西北400米）：路侧泊位 · 默认免费。路侧停车位默认免费，实际收费及禁停以现场标志为准。仅使用现场合法划线泊位，限时或专用车位按公示执行。地图明确分类为路边停车场。不是G318路肩；仅按具名点查找现场泊位。距所选骑行起点的道路距离未核，不把园区泊位直接当作镇区出发口。",
    roadNote:
      "站外至镇中心在当前允许路网不能连通；G104李家巷大道标为trunk，保留过滤，不画直线穿越高速或补齐缺段。",
    foodNote:
      "服务站零售食品饮料有原文；没有具名餐厅或咖啡分店，不把零售服务计为已核商户。",
    missing:
      "新增泊位周边最近可用路网节点仍约397米，缺少中间真实道路几何；至镇区须避开G318/G104和高速匝道的连续接驳。",
    sources: [
      [
        "湖州日报：点名长兴南、长兴西开放式服务站（2026-06-17）",
        "https://finance.sina.com.cn/roll/2026-06-17/doc-inicseyz7225171.shtml",
      ],
      [
        "高德停车条目：路侧停车场",
        "https://www.amap.com/ssr/search/poi_detail?id=B0M1SANVF3",
      ],
    ],
    city: "湖州市",
    researchCity: "huzhou",
    checked: "2026-10-16",
    reviewedAt: "2026-10-16",
    reviewOutcome: "connector-unresolved",
    parkingOptions: [
      {
        name: "路侧停车场",
        address: "长兴县318国道与创智路交叉口西北400米",
        provider: "amap",
        poiId: "B0M1SANVF3",
        city: "湖州市",
        checked: "2026-10-20",
        query: "路侧停车场 长兴县318国道与创智路交叉口西北400米",
        source: "https://www.amap.com/ssr/search/poi_detail?id=B0M1SANVF3",
        feeType: "free",
        feeBasis: "user-default-roadside",
        feeLabel: "路侧泊位 · 默认免费",
        note: "地图明确分类为路边停车场。不是G318路肩；仅按具名点查找现场泊位。距所选骑行起点的道路距离未核，不把园区泊位直接当作镇区出发口。",
        roadside: true,
        rule: "路侧停车位默认免费，实际收费及禁停以现场标志为准。仅使用现场合法划线泊位，限时或专用车位按公示执行。",
        gcj: [119.973675, 30.941925],
      },
    ],
    parkingReviewedAt: "2026-10-20",
  },
  {
    id: "huzhou-nanxun-research",
    area: "湖州 · 南浔",
    title: "南浔水乡与桑基鱼塘",
    direction: "古镇外围、和孚与荻港方向分别研究",
    query: "湖州市 南浔区 荻港",
    status: "停车点已补 · 骑行接驳待核查",
    note: "和孚镇区路侧停车条目不能替代荻港古村停车入口。现有荻港路网快照未可靠定位该镇区泊位与连续接驳；景区西门车场另有收费线索，古街步道准入仍未确认。",
    parkingNote:
      "荻港古村-西门地上停车场（南浔区和孚镇荻港村，丝绸小镇·荻港景区）：费用与开放窗口待确认。具名景区车场，不适用路侧默认免费规则。已有2026年收费转载线索，当前价格与适用车场范围仍须看入口公示。百度搜索及打开条目已读。区别西侧停车场、东南侧车场和酒店车场；未把它们拼成同一停车入口。 荻港路-路侧停车场（南浔区荻港路和孚镇人民政府东侧约210米）：路侧泊位 · 默认免费。路侧停车位默认免费，实际收费及禁停以现场标志为准。仅使用现场合法划线泊位，限时或专用车位按公示执行。位于和孚镇区，作为区域备选，不是荻港古村门口。尚未计算至古村的实际道路接驳，不能标成古村沿线即停即骑。排除搜索中的安吉县同名荻港路。",
    roadNote:
      "本轮重查荻港快照：仍没有可匹配的具名停车实体，原锚点不合格；不扩大吸附范围强接桑基鱼塘生产路。",
    foodNote:
      "已读练市“春水德”乌程酒酿奶茶报道，可作为练市镇区探店线索；奶茶不是咖啡，镇区与荻港等其他方向分别规划。",
    missing:
      "荻港古村车场入口现行收费/取车规则及公开道路接驳；和孚镇区路侧备选至古村的实际距离，不将古村步道默认作骑行道。",
    sources: [
      [
        "湖州日报：练市公共停车与小吃报道（2026-04-30）",
        "https://finance.sina.com.cn/roll/2026-04-30/doc-inhwfpqq6328586.shtml",
      ],
      [
        "荻港停车收费公告转载（须继续核对原公告）",
        "https://www.15386.cn/post/102109.html",
      ],
      [
        "百度停车条目：荻港古村-西门地上停车场",
        "https://map.baidu.com/poi/?uid=cb15b249831fd38af8221399",
      ],
      [
        "百度停车条目：荻港路-路侧停车场",
        "https://map.baidu.com/poi/?uid=7db98ae511fa742fd518b73a",
      ],
    ],
    city: "湖州市",
    researchCity: "huzhou",
    checked: "2026-10-15",
    places: [
      {
        name: "春水德（练市）",
        kind: "茶饮",
        location: "练市镇大运河历史文化街区方向",
        note: "报道点名门店与酒酿奶茶，需进一步核对准确店门和营业；含酒酿的饮品应向店家确认成分后选择。",
        source:
          "https://finance.sina.com.cn/roll/2026-04-30/doc-inhwfpqq6328586.shtml",
      },
    ],
    reviewedAt: "2026-10-16",
    reviewOutcome: "operator-confirmation-needed",
    parkingOptions: [
      {
        name: "荻港古村-西门地上停车场",
        address: "南浔区和孚镇荻港村，丝绸小镇·荻港景区",
        provider: "baidu",
        poiId: "cb15b249831fd38af8221399",
        city: "湖州市",
        checked: "2026-10-20",
        query: "荻港古村-西门地上停车场 南浔区和孚镇荻港村，丝绸小镇·荻港景区",
        source: "https://map.baidu.com/poi/?uid=cb15b249831fd38af8221399",
        feeType: "unknown",
        feeBasis: "unpublished",
        feeLabel: "费用与开放窗口待确认",
        note: "百度搜索及打开条目已读。区别西侧停车场、东南侧车场和酒店车场；未把它们拼成同一停车入口。",
        rule: "具名景区车场，不适用路侧默认免费规则。已有2026年收费转载线索，当前价格与适用车场范围仍须看入口公示。",
      },
      {
        name: "荻港路-路侧停车场",
        address: "南浔区荻港路和孚镇人民政府东侧约210米",
        provider: "baidu",
        poiId: "7db98ae511fa742fd518b73a",
        city: "湖州市",
        checked: "2026-10-20",
        query: "荻港路-路侧停车场 南浔区荻港路和孚镇人民政府东侧约210米",
        source: "https://map.baidu.com/poi/?uid=7db98ae511fa742fd518b73a",
        feeType: "free",
        feeBasis: "user-default-roadside",
        feeLabel: "路侧泊位 · 默认免费",
        note: "位于和孚镇区，作为区域备选，不是荻港古村门口。尚未计算至古村的实际道路接驳，不能标成古村沿线即停即骑。排除搜索中的安吉县同名荻港路。",
        roadside: true,
        rule: "路侧停车位默认免费，实际收费及禁停以现场标志为准。仅使用现场合法划线泊位，限时或专用车位按公示执行。",
      },
    ],
    parkingReviewedAt: "2026-10-20",
  },
  {
    id: "jiaxing-xiuzhou-research",
    researchCity: "jiaxing",
    city: "嘉兴市",
    area: "嘉兴 · 秀洲",
    title: "秀湖与石臼漾湿地",
    direction: "湖岸与湿地外围公共道路。",
    missing:
      "具名车场入口、现行公众开放/取车条件、园内具体可骑路径与外围接驳。",
    parkingNote:
      "2026-01-28出行指引：秀洲大道767号车场3小时内免费，文化艺术中心限时/扫码优惠；另列住建局地面车场和生态公园南车场免费。活动指引不外推为全年规则，也不把3小时免停变成不限时免费。",
    roadNote:
      "国家体育总局2020年报道秀湖智慧跑道分漫步道和骑行道，补充骑行用途依据；仍须核对具体经过哪一段。本轮已取得覆盖湖岸南段的新快照，新增无名停车地块1127834017邻近生态公园；但湖岸73条footway没有自行车准入标记，未将步道直接作为骑行主线。",
    foodNote: "没有与主线匹配的准确餐咖分店，先保存缺口。",
    sources: [
      ["OSM研究地块", "https://www.openstreetmap.org/way/1127833983"],
      [
        "南湖晚报2026停车点名与优惠条件",
        "https://finance.sina.com.cn/roll/2026-01-28/doc-inhiwhqt7361512.shtml",
      ],
      [
        "国家体育总局 · 秀湖漫步道与骑行道",
        "https://www.sport.gov.cn/n14471/n14482/n14519/c948363/content.html",
      ],
    ],
    checked: "2026-10-16",
    status: "已复核 · 找到具名停车和骑行资料",
    note: "2026年南湖晚报列出秀洲大道停车场、文化艺术中心地下车场及生态公园南停车场；国家体育总局资料明确介绍秀湖的骑行道。已补齐湖岸快照，具名车场入口与具体可骑段仍未完成对应。",
    query: "秀湖与石臼漾湿地",
    reviewedAt: "2026-10-16",
    reviewOutcome: "parking-location-needed",
  },
  {
    id: "shaoxing-didang-research",
    researchCity: "shaoxing",
    city: "绍兴市",
    area: "绍兴 · 迪荡湖",
    title: "迪荡湖西南外围",
    direction: "西施山路、迪荡湖路公共道路研究，园内游览另计。",
    missing:
      "南车场或西侧生态车场与地图的可靠对应、真实出口接驳、现价与取车窗口。",
    parkingNote:
      "2024-03-25建设报道定位250生态车位在保利迪荡湖壹号西侧，当时仍在协商收费；2025-03-07实访称西侧暂免费、南场34位参考5元/4小时。建设与暂免费记录均不当现行长期免费。",
    roadNote:
      "仅保留5.4km外围公共道路研究图。报道允许骑自行车接驳的建议不等于环湖所有步道都允许骑行；莲花阁引桥步梯继续排除。",
    foodNote:
      "一会儿下午茶有地图名称，但本线到店位置与合法支线待核；没有拿远处商圈店充作沿线。",
    sources: [
      [
        "绍兴网/浙江在线停车探访",
        "https://zjnews.zjol.com.cn/zjnews/202503/t20250307_30865475.shtml?v=1.0",
      ],
      ["OSM停车地块", "https://www.openstreetmap.org/way/1289038459"],
      [
        "2024生态停车场建设与收费未定的原文",
        "https://zjnews.zjol.com.cn/zjnews/202403/t20240325_26735453.shtml",
      ],
    ],
    checked: "2026-10-16",
    status: "已复核 · 南、西车场明确分开",
    note: "南车场是西施山路转环湖支路的34车位场；西侧250余生态车位是另一处场地。已核对两篇建设/探访报道，不再把无名大地块套成南停车场。",
    query: "迪荡湖西南外围",
    preview: "assets/maps/didang-research.svg",
    previewNote:
      "仅为真实道路研究图；无停车导航，不计入正式方案。5.4km不包含未核实的停车接驳。",
    reviewedAt: "2026-10-16",
    reviewOutcome: "parking-unmatched",
  },
  {
    id: "shaoxing-jianhu-research",
    researchCity: "shaoxing",
    city: "绍兴市",
    area: "绍兴 · 鉴湖",
    title: "鉴湖与柯岩外围",
    direction: "重核湖面、停车与公共道路。",
    missing:
      "柯岩或鉴湖江北岸车场公众入口、当前收费/取车条件；至可骑慢行道的完整接驳。",
    parkingNote:
      "同程无发布日期页面列5元/小时，又有每2小时10元、4小时内10元等口径；不选一个金额当现价。园区冬夏开放时间不等于停车取车窗口。",
    roadNote:
      "旧范围120.404—120.458/29.946—29.98未覆盖正确入口。古桥、岛屿和售票游览线不能视作骑行道；本轮已取得正确范围120.45—120.51/30.04—30.08，包含鉴湖relation11335116，以及1246053702等bicycle=designated慢行道。具名鉴湖江北岸车场1327461263标fee=yes、仅首30分钟免费，尚无完整开放/入口资料，不套用为柯岩景区车场。",
    foodNote: "主线位置未确定，暂不标注沿线餐厅咖啡。",
    sources: [
      ["OSM公开地图", "https://www.openstreetmap.org/"],
      [
        "同程 · 柯岩停车实体、地址与相互不同的参考口径",
        "https://m.ly.com/scenery/scenerybddetail-5950.html",
      ],
      [
        "OSM鉴湖慢行步道 · 标有自行车准入",
        "https://www.openstreetmap.org/way/1246053702",
      ],
      [
        "OSM鉴湖江北岸收费车场 · 入口窗口未核",
        "https://www.openstreetmap.org/way/1327461263",
      ],
    ],
    checked: "2026-10-16",
    status: "已复核 · 湖岸可骑线已有，停车待核",
    note: "同程实际页面列出柯岩风景区停车场和柯岩大道558号，补上具名停车实体线索。新快照补上正确湖岸和标有自行车准入的鉴湖慢行步道；车场入口、管理与步道接驳仍须对应。",
    query: "鉴湖与柯岩外围",
    reviewedAt: "2026-10-16",
    reviewOutcome: "parking-access-unresolved",
  },
  {
    id: "hangzhou-canal-night-research",
    researchCity: "hangzhou",
    city: "杭州市",
    area: "杭州 · 运河夜骑",
    title: "运河桥西夜间方向",
    direction: "以公共街道照明和夜间停车窗口为前提。",
    missing:
      "湖墅51或小河公园车库的夜间取车公示、现价及停车出口；全程准入与照明路段。",
    parkingNote:
      "2025-03-06记者走访确认小河公园地下车库运营，运营方介绍夜间保洁安排；未写车库出入窗口。另有7×24电子开票采购线索，它是开票服务，不能当24小时车库开放。",
    roadNote:
      "本轮重查现存路网照明，湖墅51周边至桥西仍无法用已标照明路段完整连通；古拱宸桥台阶与未核的岸边步行空间继续排除。",
    foodNote: "觅会咖啡、院子餐厅有公开位置；夜间营业未知，自带补给。",
    sources: [
      ["湖墅51地图记录", "https://www.openstreetmap.org/node/9737245752"],
      [
        "都市快报实访与运营方回复 · 车库存在，夜取车未说明",
        "https://hznews.hangzhou.com.cn/shehui/content/2025-03/06/content_8874182.htm",
      ],
    ],
    checked: "2026-10-16",
    status: "已复核 · 夜间取车与连续照明待核",
    note: "新增小河公园地下车场的实地报道作为备选研究；报道中的夜间保洁不证明车库24小时可取车。现有运河日间方案继续有效，暂不复制为夜骑。",
    query: "运河桥西夜间方向",
    reviewedAt: "2026-10-16",
    reviewOutcome: "night-window-unresolved",
  },
  {
    id: "hangzhou-baima-night-research",
    researchCity: "hangzhou",
    city: "杭州市",
    area: "杭州 · 滨江白马湖",
    title: "白马湖荧光夜骑",
    direction: "湖岸跑步区与骑行区分别核对。",
    status: "已复核 · 可骑区与停车仍须对应",
    reviewOutcome: "geometry-parking-unmatched",
    checked: "2026-10-16",
    reviewedAt: "2026-10-16",
    note: "2025夜跑报道确认荧光跑道分跑步区和骑行区，2026南P1/P2车场价目已有原文；但当前几何只有未标自行车准入的湖岸步道，不能把整圈直接画成骑行线。",
    missing: "具体可骑区几何、南P1/P2公众入口与夜间取车窗口；照明实效。",
    parkingNote:
      "2026-04-23杭州发布/市发改委资料列南P1/P2参考4元/小时、每天6小时封顶，首15分钟免费。地图白马湖P4是另一个场地，不套用P1/P2价目或活动临时免费。",
    roadNote:
      "已取得本轮真实OSM快照，但不能以荧光路面代替道路照明；未定位具体骑行区，不将未标准入的footway补作可骑连接。",
    foodNote: "夜间商户与公众设施窗口未核，不依赖补给。",
    sources: [
      [
        "2026政府定价车场资料",
        "https://www.hzzx.gov.cn/cshz/content/2026-04/23/content_9210933.htm",
      ],
      [
        "2025跑步区与骑行区报道",
        "https://www.hzzx.gov.cn/cshz/content/2025-09/01/content_9073473.htm",
      ],
    ],
    query: "杭州 白马湖公园",
  },
  {
    id: "hangzhou-qingshan-night-research",
    researchCity: "hangzhou",
    city: "杭州市",
    area: "杭州 · 临安青山湖",
    title: "青山湖夜间方向",
    direction: "恢复开放与夜间准入分开核对。",
    status: "已复核 · 夜间恢复依据仍缺",
    reviewOutcome: "night-reopening-unresolved",
    checked: "2026-10-16",
    reviewedAt: "2026-10-16",
    note: "9月1日绿道因电力受损限制至18:30；后来已有景区恢复开放的报道，但不等于绿道夜间照明和准入已恢复。暂不提供夜骑方案。",
    missing:
      "绿道夜间恢复开放的明确公告、连续照明、可夜间取车的具名停车场与道路几何。",
    parkingNote:
      "尚未取得匹配本线的夜间公众车场入口与取车公示；景区恢复开放不能代替停车开放窗口。",
    roadNote:
      "9月14日报道景区恢复迎客和鹿园开放；没有说明夜间绿道电力及分时管理取消。不把旧闭园公告说成景区现在全天仍关闭。",
    foodNote: "夜间补给未核，不生成商户和设施承诺。",
    sources: [
      [
        "杭州发布9月1日分时公告",
        "https://www.sina.cn/news/detail/5338254884997555.html",
      ],
      [
        "9月14日恢复开放报道 · 非夜间绿道公告",
        "https://fashion.hangzhou.com.cn/content/2026-09/14/content_9306605.html",
      ],
    ],
    query: "杭州 临安 青山湖绿道",
  },
];
