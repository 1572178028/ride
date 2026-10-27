import huzhouCandidates from "./huzhou-20261027.js";

export default [
  ...huzhouCandidates,
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
{
  "id": "anding-linfeng-research",
  "researchCity": "hangzhou",
  "city": "杭州市",
  "area": "杭州 · 富阳与萧山山地",
  "title": "安顶山—石牛山—林峰山环线",
  "direction": "行者#2720833，原页40公里、累计爬升1236米；发布于2019-11-03。",
  "status": "原路书已读取 · 完整方案待核查",
  "note": "原路书仅作方向线索；未取得并重新核验完整轨迹，不计入正式里程、爬升或路线数。",
  "missing": "具名公众停车费用/取车条件、完整40公里道路几何、林道与公共道路属性、近期施工封闭和连续陡坡下撤均待核；1236米爬升为平台旧路书数据，不是实测当前轨迹。",
  "parkingNote": "原路书未提供覆盖完整骑行的可靠停车规则；现有短线停车点不能替代长线接驳核对。",
  "roadNote": "具名公众停车费用/取车条件、完整40公里道路几何、林道与公共道路属性、近期施工封闭和连续陡坡下撤均待核；1236米爬升为平台旧路书数据，不是实测当前轨迹。",
  "foodNote": "长线沿线补给与营业窗口继续核对；自备水及基础修车工具。",
  "sources": [
    [
      "行者原路书#2720833",
      "https://www.imxingzhe.com/routes/2720833"
    ]
  ],
  "checked": "2026-10-23",
  "photos": [],
  "query": "杭州富阳安顶山 石牛山 林峰山",
  "reviewedAt": "2026-10-23",
  "reviewOutcome": "parking-access-and-full-geometry-pending"
},
];
