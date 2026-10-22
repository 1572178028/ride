export default [
  {
    "id": "tongjianhu-south",
    "number": "39",
    "familyId": "tongjianhu-south",
    "familyTitle": "杭州 · 铜鉴湖南岸",
    "region": "tongjianhu",
    "city": "杭州市",
    "cityGroup": "hangzhou",
    "area": "杭州 · 西湖区双浦",
    "title": "铜鉴湖南岸 · 九曲梅韵往返",
    "subtitle": "P1附近出发，沿东南岸慢骑，到九曲梅韵附近折返取车。",
    "distance": 3.8,
    "duration": "约半小时—1小时",
    "level": "湖岸休闲",
    "shape": "南岸往返",
    "window": "day",
    "separateStart": true,
    "dedicated": false,
    "isolated": true,
    "lane": "南岸步骑共用 · 非自行车专用",
    "laneDetail": "P1附近服务道路接东南岸慢行道；南岸在OSM标为footway，采用官方环湖骑行推荐及高德同走廊双向自行车规划的独立证据，仅支持本段，不外推全园。行人优先，人多及桥面按现场要求下车推行；遇禁骑、围挡或活动管控提前返回。无自行车独享或全程隔离承诺。",
    "mapCyclewayKm": 0,
    "mapWater": {
      "name": "铜鉴湖",
      "point": [
        120.06,
        30.121
      ]
    },
    "tags": [
      "杭州",
      "铜鉴湖",
      "南岸",
      "九曲梅韵",
      "短线",
      "日间"
    ],
    "description": "从铜鉴湖花海P1停车场附近的服务道路出发，经东南岸接南岸慢行道，到九曲梅韵/九曲梅轩附近道路节点折返，沿原路返回取车。约3.8公里包含实际道路双程，地图完整画出去回，不再乘二；未计停车位内装卸推行及探店绕行。此为南岸短线，区别于公开推荐7.58公里完整环湖线和其他平台长线，不经过北侧灵龙路、水上森林或西北岸连接缺口。",
    "parking": {
      "id": "tongjianhu-p1",
      "poiid": "B0ID4LQKY4",
      "name": "铜鉴湖花海P1停车场",
      "query": "铜鉴湖花海P1地面停车场入口 杭州市 西湖区 袁浦路201号",
      "address": "杭州市西湖区双浦镇袁浦路201号",
      "point": [
        120.0676334447145,
        30.119475873211893
      ],
      "gcj": [
        120.072434,
        30.117177
      ],
      "feeType": "paid",
      "feeBasis": "dated-tourism-reference",
      "price": "¥4/小时起（旧参考）",
      "priceSummary": "收费参考 · 4元/小时，封顶24元",
      "rule": "2025-03-28西湖文旅资料经凤凰网转载：P1停车4元/小时，封顶24元；现价以入口公示为准。",
      "condition": "收费方案，非免费停车。旧资料不证明当前费率；入场先核收费、开放/取车窗口及活动管控，建议覆盖装卸、约半小时—1小时骑行和休息共1.5—2小时。高德24小时条目仅是平台参考；无法确认覆盖全程则取消。不借用营地或单位专用车位。",
      "source": "https://zj.ifeng.com/c/8i4eLXfWjNp",
      "sourceTitle": "西湖文旅 · 铜鉴湖P1收费参考（凤凰网转载）",
      "published": "2025-03-28",
      "checked": "2026-10-22",
      "verification": "读取收费原文并对照2026-10-21高德具名车场与独立入口POI；未电话或现场核验",
      "evidence": "公开资料明确P1收费4元/小时、封顶24元；不把营地免费或活动停车外推为P1常态免费。",
      "precision": "P为车场POI，S为附近约2米的OSM服务道路节点；不是实测车位出口距离。汽车入口另在南侧约400米，采用具名入口检索，场内按标线卸装推行。",
      "mapLabel": "P1收费停车",
      "namedNavigation": true
    },
    "start": {
      "name": "P1附近服务道路起点",
      "point": [
        120.0676485,
        30.119464
      ],
      "gcj": [
        120.07244906458861,
        30.11716514709659
      ],
      "note": "P是车场参考点，S为服务道路节点；实际卸车后推行至允许出口再骑，不在停车车流中穿行。"
    },
    "stops": [
      {
        "name": "P1附近服务道路起点",
        "point": [
          120.0676485,
          30.119464
        ],
        "gcj": [
          120.07244906458861,
          30.11716514709659
        ],
        "note": "确认收费、取车窗口及当天通行，卸装后推行接入。"
      },
      {
        "name": "东南岸慢行道",
        "point": [
          120.064813,
          30.1178987
        ],
        "gcj": [
          120.0696112957998,
          30.115595783351043
        ],
        "note": "接南岸步骑共用段，行人优先，临水与桥面减速或推行。"
      },
      {
        "name": "九曲梅韵附近南岸折返点",
        "point": [
          120.0534351,
          30.1188359
        ],
        "gcj": [
          120.05822111069344,
          30.11651348680908
        ],
        "note": "下车在不妨碍通行的位置转向，原路返回。咖啡厅不是道路终点；未核店门接驳。"
      },
      {
        "name": "返回P1附近起点",
        "point": [
          120.0676485,
          30.119464
        ],
        "gcj": [
          120.07244906458861,
          30.11716514709659
        ],
        "note": "完整双程已计入3.8公里；回到原场取车。"
      }
    ],
    "food": [
      {
        "id": "tongjianhu-B0L01OHA7K",
        "poiid": "B0L01OHA7K",
        "name": "九曲梅轩咖啡厅",
        "query": "九曲梅轩咖啡厅 杭州市 西湖区 双浦镇",
        "kind": "咖啡",
        "point": [
          120.05300651203449,
          30.11950323542934
        ],
        "gcj": [
          120.057792,
          30.11718
        ],
        "location": "铜鉴湖九曲梅韵东北侧",
        "description": "南岸折返点附近咖啡选择；距道路节点约85米直线，仅为场所参考，未核到店出口与实际绕行距离，不计入3.8公里。可在现场允许的出口推行前往，无法合法到达时不绕入草坪或跨护栏。营业、价格及有无座位到店确认，自备水。",
        "source": "https://www.amap.com/ssr/search/poi_detail?id=B0L01OHA7K",
        "sourceTitle": "高德 · 九曲梅轩咖啡厅",
        "checked": "2026-10-21",
        "status": "地图POI参考 · 未电话/现场核验",
        "precision": "场所参考点；店门与开放情况现场确认",
        "mapLabel": "九曲梅轩咖啡厅",
        "placement": "nearby",
        "namedNavigation": true
      },
      {
        "id": "tongjianhu-B0FFIR2L7G",
        "poiid": "B0FFIR2L7G",
        "name": "原野餐厅",
        "query": "原野餐厅 杭州市 西湖区 双浦镇",
        "kind": "餐厅",
        "point": [
          120.06636572008352,
          30.115137712327215
        ],
        "gcj": [
          120.071165,
          30.112837
        ],
        "location": "双浦镇铜鉴湖P1入口附近",
        "description": "P1南侧汽车入口附近的餐厅备选，距本线起点约500米直线；仅作骑后周边用餐参考，实际到店道路距离未核，不计入里程。平台记录不保证当日开门，不穿停车车道探店。",
        "source": "https://www.amap.com/ssr/search/poi_detail?id=B0FFIR2L7G",
        "sourceTitle": "高德 · 原野餐厅",
        "checked": "2026-10-21",
        "status": "地图POI参考 · 未电话/现场核验",
        "precision": "场所参考点；店门与开放情况现场确认",
        "mapLabel": "原野餐厅",
        "placement": "nearby",
        "namedNavigation": true
      }
    ],
    "rest": [
      {
        "name": "铜鉴湖南岸折返处 · 岸边短休建议",
        "kind": "歇脚",
        "point": [
          120.0534351,
          30.1188359
        ],
        "gcj": [
          120.05822111069344,
          30.11651348680908
        ],
        "location": "九曲梅韵附近南岸",
        "description": "在离开通行带且允许的位置下车短休。未核座椅、饮水与厕所；不在桥面、临水边缘或狭窄路段停留。",
        "source": "https://www.openstreetmap.org/api/0.6/map?bbox=120.040,30.105,120.070,30.135",
        "sourceTitle": "OSM南岸道路位置",
        "checked": "2026-10-22",
        "status": "公共岸线建议 · 非设施核验",
        "precision": "道路片区",
        "mapLabel": "南岸折返短休",
        "placement": "along"
      }
    ],
    "supply": [
      {
        "id": "tongjianhu-B0L01OHA7K",
        "poiid": "B0L01OHA7K",
        "name": "九曲梅轩咖啡厅",
        "query": "九曲梅轩咖啡厅 杭州市 西湖区 双浦镇",
        "kind": "咖啡",
        "point": [
          120.05300651203449,
          30.11950323542934
        ],
        "gcj": [
          120.057792,
          30.11718
        ],
        "location": "铜鉴湖九曲梅韵东北侧",
        "description": "南岸折返点附近咖啡选择；距道路节点约85米直线，仅为场所参考，未核到店出口与实际绕行距离，不计入3.8公里。可在现场允许的出口推行前往，无法合法到达时不绕入草坪或跨护栏。营业、价格及有无座位到店确认，自备水。",
        "source": "https://www.amap.com/ssr/search/poi_detail?id=B0L01OHA7K",
        "sourceTitle": "高德 · 九曲梅轩咖啡厅",
        "checked": "2026-10-21",
        "status": "地图POI参考 · 未电话/现场核验",
        "precision": "场所参考点；店门与开放情况现场确认",
        "mapLabel": "九曲梅轩咖啡厅",
        "placement": "nearby",
        "namedNavigation": true
      },
      {
        "id": "tongjianhu-B0FFIR2L7G",
        "poiid": "B0FFIR2L7G",
        "name": "原野餐厅",
        "query": "原野餐厅 杭州市 西湖区 双浦镇",
        "kind": "餐厅",
        "point": [
          120.06636572008352,
          30.115137712327215
        ],
        "gcj": [
          120.071165,
          30.112837
        ],
        "location": "双浦镇铜鉴湖P1入口附近",
        "description": "P1南侧汽车入口附近的餐厅备选，距本线起点约500米直线；仅作骑后周边用餐参考，实际到店道路距离未核，不计入里程。平台记录不保证当日开门，不穿停车车道探店。",
        "source": "https://www.amap.com/ssr/search/poi_detail?id=B0FFIR2L7G",
        "sourceTitle": "高德 · 原野餐厅",
        "checked": "2026-10-21",
        "status": "地图POI参考 · 未电话/现场核验",
        "precision": "场所参考点；店门与开放情况现场确认",
        "mapLabel": "原野餐厅",
        "placement": "nearby",
        "namedNavigation": true
      },
      {
        "name": "铜鉴湖南岸折返处 · 岸边短休建议",
        "kind": "歇脚",
        "point": [
          120.0534351,
          30.1188359
        ],
        "gcj": [
          120.05822111069344,
          30.11651348680908
        ],
        "location": "九曲梅韵附近南岸",
        "description": "在离开通行带且允许的位置下车短休。未核座椅、饮水与厕所；不在桥面、临水边缘或狭窄路段停留。",
        "source": "https://www.openstreetmap.org/api/0.6/map?bbox=120.040,30.105,120.070,30.135",
        "sourceTitle": "OSM南岸道路位置",
        "checked": "2026-10-22",
        "status": "公共岸线建议 · 非设施核验",
        "precision": "道路片区",
        "mapLabel": "南岸折返短休",
        "placement": "along"
      }
    ],
    "photos": [],
    "photoTarget": 3,
    "photoMissing": 3,
    "photoGap": "道路实拍待补3张；游记图片仅保留原帖链接，未获得开放转载许可。",
    "sourceChecked": "2026-10-22",
    "geometrySource": "https://www.openstreetmap.org/api/0.6/map?bbox=120.040,30.105,120.070,30.135",
    "geometryWays": [
      1049568289,
      1049568302,
      1049568290,
      1180699649
    ],
    "sources": [
      [
        "杭州网 · 7.58公里环湖骑行推荐（本线只取南岸短段）",
        "https://hwyst.hangzhou.com.cn/z/rhdzqxyhcs/content/content_8828429.html"
      ],
      [
        "西湖文旅 · P1停车收费参考",
        "https://zj.ifeng.com/c/8i4eLXfWjNp"
      ],
      [
        "高德 · P1车场",
        "https://www.amap.com/ssr/search/poi_detail?id=B0ID4LQKY4"
      ],
      [
        "高德 · P1汽车入口",
        "https://www.amap.com/ssr/search/poi_detail?id=B0ID4LQDCC"
      ],
      [
        "高德 · 九曲梅轩咖啡厅",
        "https://www.amap.com/ssr/search/poi_detail?id=B0L01OHA7K"
      ],
      [
        "高德 · 原野餐厅",
        "https://www.amap.com/ssr/search/poi_detail?id=B0FFIR2L7G"
      ],
      [
        "OSM道路快照",
        "https://www.openstreetmap.org/api/0.6/map?bbox=120.040,30.105,120.070,30.135"
      ]
    ],
    "notes": [
      "南岸往返约3.8公里，非7.58公里完整环湖线；去回都已计入，不能再乘二。",
      "P1按收费方案收录。4元/小时、24元封顶是2025年资料，入场复核现价与取车条件；未实地或电话核验。",
      "步骑共用，行人优先；不承诺全程自行车专用道，不进入花山登山步道、水杉栈道、草坪或营地捷径。",
      "咖啡厅为折返点周边参考，原野餐厅为P1南侧骑后备选；到店绕行不计里程，不依赖营业完成骑行。",
      "自备水和基础修车工具。照片未取得开放转载许可，暂只保留原帖来源；导航App调起未真机验证。"
    ],
    "researchExtensions": [
      {
        "id": "tongjianhu-loop-research",
        "researchCity": "hangzhou",
        "city": "杭州市",
        "area": "杭州 · 铜鉴湖",
        "title": "铜鉴湖完整环线延伸",
        "direction": "从南岸短线继续核查西岸—西北接驳—北岸—里湖。",
        "status": "南岸短线已收录 · 完整环线待核查",
        "missing": "西北岸服务道路与北侧公共道路间约90米的连接缺少连续OSM几何；北侧灵山线存在单向标记，水上森林和木栈道不能默认可骑。",
        "note": "公开推荐7.58公里存在，但本项目尚未重建该完整环线；不把南岸3.8公里包装为环湖。",
        "parkingNote": "沿用P1收费参考；不采用露营活动、云栖大会临时免费政策。",
        "roadNote": "西岸服务道路1180699650北端与北侧路网不连通；约90米仅为端点直线差，不代表可通行连接。禁止画直线补洞或放宽全园footway过滤。",
        "foodNote": "九曲梅轩咖啡厅及P1南侧原野餐厅已作为短线周边参考；完整环线补给位置与实际出口继续核对。",
        "sources": [
          [
            "杭州网 · 7.58公里推荐",
            "https://hwyst.hangzhou.com.cn/z/rhdzqxyhcs/content/content_8828429.html"
          ],
          [
            "OSM快照",
            "https://www.openstreetmap.org/api/0.6/map?bbox=120.040,30.105,120.070,30.135"
          ],
          [
            "小红书 · 娃要出门玩（示意游记，不作法律准入依据）",
            "https://www.xiaohongshu.com/explore/6ad39e4c000000001b02da03"
          ]
        ],
        "checked": "2026-10-22",
        "photos": []
      }
    ]
  }
];
