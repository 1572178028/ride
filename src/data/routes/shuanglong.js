export default [
  {
    id: "shuanglong-road",
    number: "37",
    familyId: "shuanglong-road",
    familyTitle: "金华 · 双龙山路",
    region: "shuanglong",
    city: "金华市",
    area: "金华 · 罗店至双龙洞西门附近",
    title: "双龙 · 罗电线山路往返",
    subtitle: "沿山路上行，在西门台阶前的公共道路折返。",
    distance: 12.6,
    duration: "2—3 小时",
    level: "持续爬坡 · 山路进阶",
    shape: "往返环路",
    window: "day",
    separateStart: true,
    dedicated: false,
    isolated: false,
    lane: "普通山路混行 · 专用道未确认",
    laneDetail:
      "主线只用公开路网普通道路，避开台阶、步道、服务区与私人道路。无已核自行车专用或连续隔离车道；注意公交、景交车和弯道会车。",
    mapCyclewayKm: 0,
    tags: ["金华", "双龙", "罗电线", "爬坡", "日间"],
    description:
      "从智者街路侧泊位附近公共道路接入罗电线，持续上行至双龙洞西门附近的罗电线节点，沿允许方向下山返回。约12.6公里为OSM逐段累计往返里程；高德至景区POI约6.1公里单程，百度附近路口至西门约6.2公里，端点不同不强行对齐。终点停留在公共道路，不骑进西门台阶、洞内或霞客古道。",
    parking: {
      id: "shuanglong-roadside-B0MDB6G8XL",
      poiid: "B0MDB6G8XL",
      name: "智者街-路侧停车场",
      query: "智者街-路侧停车场 金华市 智者街与罗电线交叉口东北80米",
      address: "金华市婺城区智者街与罗电线交叉口东北80米",
      point: [119.6220365028964, 29.167465878495083],
      gcj: [119.626725, 29.164525],
      feeType: "free",
      feeBasis: "user-default-roadside",
      price: "¥0",
      priceSummary: "路侧泊位默认免费",
      rule: "路侧停车位默认免费，实际收费及禁停以现场标志为准",
      condition:
        "默认免费是用户规划约定，不是运营方免费承诺。仅用现场合法公共划线泊位；有收费、限时、专用或禁停规则则按实际执行。入场先确认停放能覆盖卸装车、2—3小时山路骑行、休息与取车；不满足则取消方案，不占路肩或消防通道。",
      source: "https://www.amap.com/ssr/search/poi_detail?id=B0MDB6G8XL",
      sourceTitle: "高德具名路侧泊位及双向骑行规划",
      published: "地图无发布日期；费用默认规则2026-10-20",
      checked: "2026-10-21",
      verification:
        "读取地图分类、地址、导航坐标及双向自行车路线；对照百度山路明细",
      evidence:
        "地图明确路边停车场，费用按用户路侧默认规则处理。未电话/现场核验，不承诺全天开放。",
      mapLabel: "智者街路侧P",
      precision:
        "P为地图POI参考，S为附近约10米公共道路节点；车位实际位置与进出口以现场为准。",
      namedNavigation: true,
    },
    start: {
      name: "智者街路侧泊位旁公共道路起点",
      point: [119.6219386, 29.1674624],
      gcj: [119.62662704700833, 29.164521423044217],
      note: "按高德具名泊位查找合法划线车位；P与S约10米，卸装车及移至道路时推行，实际出口以现场为准。",
    },
    stops: [
      {
        name: "智者街路侧泊位旁公共道路起点",
        point: [119.6219386, 29.1674624],
        gcj: [119.62662704700833, 29.164521423044217],
        note: "按高德具名泊位查找合法划线车位；P与S约10米，卸装车及移至道路时推行，实际出口以现场为准。",
      },
      {
        name: "双龙洞西门附近罗电线折返点",
        point: [119.6186647, 29.2043198],
        gcj: [119.62335468640505, 29.20140381318903],
        note: "停留在罗电线公共道路；不转入西门台阶、洞内或服务院落。仅在现场允许且不妨碍交通的位置安全折返。",
      },
      {
        name: "返回智者街道路起点",
        point: [119.6219386, 29.1674624],
        gcj: [119.62662704700833, 29.164521423044217],
        note: "按道路允许方向下山返回原泊位，不依赖景交车运自行车。",
      },
    ],
    food: [],
    rest: [
      {
        name: "智者街路侧泊位旁公共道路起点 · 道路片区歇脚建议",
        kind: "歇脚",
        point: [119.6219386, 29.1674624],
        gcj: [119.62662704700833, 29.164521423044217],
        location: "公共道路片区",
        mapLabel: "道路片区短休",
        description:
          "仅在现场允许、离开行车道且不阻碍交通的位置下车休息；未核座椅、饮水或厕所。不在弯道、桥面和台阶口停留。",
        source:
          "https://www.openstreetmap.org/api/0.6/map?bbox=119.605,29.158,119.634,29.21",
        sourceTitle: "OSM公共道路位置",
        checked: "2026-10-21",
        status: "道路片区建议 · 非设施核验",
        precision: "道路片区",
        placement: "along",
      },
      {
        name: "双龙洞西门附近罗电线折返点 · 道路片区歇脚建议",
        kind: "歇脚",
        point: [119.6186647, 29.2043198],
        gcj: [119.62335468640505, 29.20140381318903],
        location: "公共道路片区",
        mapLabel: "道路片区短休",
        description:
          "仅在现场允许、离开行车道且不阻碍交通的位置下车休息；未核座椅、饮水或厕所。不在弯道、桥面和台阶口停留。",
        source:
          "https://www.openstreetmap.org/api/0.6/map?bbox=119.605,29.158,119.634,29.21",
        sourceTitle: "OSM公共道路位置",
        checked: "2026-10-21",
        status: "道路片区建议 · 非设施核验",
        precision: "道路片区",
        placement: "along",
      },
    ],
    supply: [
      {
        name: "智者街路侧泊位旁公共道路起点 · 道路片区歇脚建议",
        kind: "歇脚",
        point: [119.6219386, 29.1674624],
        gcj: [119.62662704700833, 29.164521423044217],
        location: "公共道路片区",
        mapLabel: "道路片区短休",
        description:
          "仅在现场允许、离开行车道且不阻碍交通的位置下车休息；未核座椅、饮水或厕所。不在弯道、桥面和台阶口停留。",
        source:
          "https://www.openstreetmap.org/api/0.6/map?bbox=119.605,29.158,119.634,29.21",
        sourceTitle: "OSM公共道路位置",
        checked: "2026-10-21",
        status: "道路片区建议 · 非设施核验",
        precision: "道路片区",
        placement: "along",
      },
      {
        name: "双龙洞西门附近罗电线折返点 · 道路片区歇脚建议",
        kind: "歇脚",
        point: [119.6186647, 29.2043198],
        gcj: [119.62335468640505, 29.20140381318903],
        location: "公共道路片区",
        mapLabel: "道路片区短休",
        description:
          "仅在现场允许、离开行车道且不阻碍交通的位置下车休息；未核座椅、饮水或厕所。不在弯道、桥面和台阶口停留。",
        source:
          "https://www.openstreetmap.org/api/0.6/map?bbox=119.605,29.158,119.634,29.21",
        sourceTitle: "OSM公共道路位置",
        checked: "2026-10-21",
        status: "道路片区建议 · 非设施核验",
        precision: "道路片区",
        placement: "along",
      },
    ],
    photos: [
      {
        id: "shuanglong-luodian-press",
        group: "shuanglong",
        kind: "road",
        routeIds: ["shuanglong-road"],
        src: "assets/photos/shuanglong-luodian-road-press.jpg",
        storage: "local",
        source:
          "https://jhwcw.zjol.com.cn/wcnews/system/2025/07/07/035000391.shtml",
        originalUrl:
          "https://img2.zjolcdn.com/pic/003/012/109/00301210919_82446c7b.jpg",
        author: "曹静怡 / 婺城新闻网（文署名；摄影未单列）",
        date: "2025-07-07报道；拍摄日未单列",
        checked: "2026-10-21",
        captureDate: "2026-10-21",
        sourceType: "press-photo",
        license: "原作者版权 · 未声明开放许可",
        caption: "罗电线 · 双龙公路服务驿站旁弯道（同路参考）",
        relation:
          "报道明确罗电线，图中可读双龙公路服务驿站并可见山路路面和弯道。具体站位未定位，可能在本方案折返点外，只作同路名参考，不据此认定本方案经过该驿站。原始文件400×204，保持真实尺寸不放大。",
        verification:
          "读取原文并逐图目视原始图片；同路名合理关联，未确认摄影站位。",
        pixelWidth: 400,
        pixelHeight: 204,
        modification: "保存媒体原始400×204文件，未放大、改写或裁切画面",
        referenceOnly: true,
        matchAssessment: {
          source: 20,
          location: 30,
          track: 0,
          visual: 10,
          reason:
            "原文罗电线行程与道路主体清楚；摄影点未定位，仅同路参考，轨迹不加分。",
        },
      },
    ],
    sourceChecked: "2026-10-21",
    geometrySource:
      "https://www.openstreetmap.org/api/0.6/map?bbox=119.605,29.158,119.634,29.21",
    geometryWays: [
      763327796, 988957183, 988957184, 727652588, 1115827307, 1115827306,
      1115827320, 1115829453,
    ],
    sources: [
      ["双龙洞实际位置", "https://www.openstreetmap.org/node/370303616"],
      [
        "浙江在线刊载景区条例全文 · 非实时限行公告",
        "https://jinhua.zjol.com.cn/jsbd/202205/t20220530_24301094_ext.shtml",
      ],
      [
        "景区账号 · 鹿女湖环湖骑行与99道拐原帖",
        "https://www.xiaohongshu.com/explore/6ac5b91f000000000202821b",
      ],
      [
        "婺城新闻网 · 罗电线实际骑行与沿线村落",
        "https://jhwcw.zjol.com.cn/wcnews/system/2025/07/07/035000391.shtml",
      ],
      [
        "2026国庆景区交通公告转载 · 仅该假期",
        "https://www.sohu.com/a/1081865181_123007306",
      ],
      [
        "景区2026停车与服务说明转载 · 非独立运营核验",
        "https://www.sohu.com/a/967399275_121117448",
      ],
      [
        "高德 · 智者街路侧停车场",
        "https://www.amap.com/ssr/search/poi_detail?id=B0MDB6G8XL",
      ],
      [
        "高德 · 智者街泊位至双龙洞景区自行车规划",
        "https://www.amap.com/ssr/dir?dname=%E5%8F%8C%E9%BE%99%E6%B4%9E%E6%99%AF%E5%8C%BA&dlat=29.200776&dlon=119.624455&did=B024303DEU&fname=%E6%99%BA%E8%80%85%E8%A1%97-%E8%B7%AF%E4%BE%A7%E5%81%9C%E8%BD%A6%E5%9C%BA&flat=29.164525&flon=119.626725&fid=B0MDB6G8XL&type=3&dpoitype=110202",
      ],
      [
        "百度 · 附近路口至双龙洞西门，末端有阶梯",
        "https://map.baidu.com/dir/%E6%99%BA%E8%80%85%E8%A1%97%E7%BD%97%E7%94%B5%E7%BA%BF%E8%B7%AF%E5%8F%A3/%E5%8F%8C%E9%BE%99%E6%B4%9E-%E8%A5%BF%E9%97%A8/@13315042.018518519,3378654,14.81z?querytype=cycle&da_src=shareurl&c=333&sc=333&ec=333&sy=0&drag=0&sn=1$$c513b0483cc23c0f83a00cf1$$13317533.74,3376183.74$$%E6%99%BA%E8%80%85%E8%A1%97%E7%BD%97%E7%94%B5%E7%BA%BF%E8%B7%AF%E5%8F%A3$$$$$$&en=1$$67a679fee7cc8f700ab93a4a$$13317173.25,3381082.48$$%E5%8F%8C%E9%BE%99%E6%B4%9E-%E8%A5%BF%E9%97%A8$$$$$$&sq=%E6%99%BA%E8%80%85%E8%A1%97%E4%B8%8E%E7%BD%97%E7%94%B5%E7%BA%BF%E4%BA%A4%E5%8F%89%E5%8F%A3&eq=%E9%87%91%E5%8D%8E%E5%8F%8C%E9%BE%99%E6%B4%9E%E6%99%AF%E5%8C%BA&version=6&vehicle=0&spath_type=1",
      ],
      [
        "最新公开道路快照",
        "https://www.openstreetmap.org/api/0.6/map?bbox=119.605,29.158,119.634,29.21",
      ],
    ],
    notes: [
      "普通山路持续爬坡、弯道较多，不作为亲子入门或轻松湖岸线；提前检查刹车与轮胎，控制下坡速度，雨雾、结冰、落石或临时管制时取消。",
      "累计爬升未独立核算。景区另一条10公里鹿女湖行程称爬升500米以上，仅作片区强度参考，不当作本方案爬升值；2—3小时为保守规划估时，非高德35—39分钟。",
      "未核本线准确店门与公众到店支线，暂无已核实餐厅或咖啡店；自带足量饮水、能量和修车工具，不依赖景交车、商家开门或景区饮水完成路线。",
      "收费景区车场与路侧泊位是不同停车实体；2026国庆临时机动车限行不外推为全年自行车禁行，当日交通管理标志优先。",
      "规划依据公开路网及两家地图交叉核对，未实骑、电话或现场核验；到达西门附近在台阶之前合法折返。",
    ],
    photoTarget: 3,
    photoMissing: 2,
    photoGap: "道路图目标3张，仍待补2张。已展示图片含关联参考，详见评分依据。",
    cityGroup: "jinhua",
  },
];
