# 骑遇 · 浙江 4+2 骑行路线库

自驾带车，使用注明费用与条件的正式停车点，再换上自行车。原生静态HTML/CSS/JavaScript，无后端和运行时依赖，支持GitHub Pages项目路径。

目录更新：**2026-10-16**。当前目录有 **16条主线、26种方案、13个片区、4个城市组**（杭州、湖州、嘉兴含海宁、金华）。**13处去重停车片区**分为5处免费条件、4处收费参考、4处费用待确认；26家去重餐饮咖啡茶饮店，32处去重歇脚建议。长短方案、同一家店与同一停车点分别去重。

数量表示资料目录，不代表到访当天准入、收费、车位或营业已现场确认。逐条原文发布日期、读取日期、定位范围与缺口见页面及[data-notes.md](data-notes.md)。

## 本轮优化与复核

点击左侧路线会回到新路线的标题与地图开头，桌面和手机均已实测；收藏保留阅读位置。11个研究方向逐项复核并更新卡片，补取秀湖与鉴湖真实路网，排除已有停用公告的江陵路临时P+R。收费转载、旧规则与当前已核事实分别注明，仍有缺口的方向继续留在研究区。本轮没有新增正式路线，详见[续轮复核记录](research/followup-verification-2026-10-16.md)。

## 本轮扩展

相对于已推送基线`95540e6`，增加5条主线、10种方案：

| 方向 | 道路规划里程 | 停车与适用边界 |
| --- | --- | --- |
| 北山街夜间短线（西湖主线变体） | 4.0km | 岳湖广场共用收费点；景区夜间20:00—次日8:00参考5元/次，具体车场出入取车须确认；所用道路在快照标有lit=yes，未现场测照度 |
| 长兴夹浦滨湖辅道 | 12.8 / 7.8km | 具名且access=yes的太湖观景台停车点；现价和窗口未知，不标免费 |
| 长兴画溪公园至城南 | 15.0 / 8.3km | 官方2026停车改造投用报道；公园片区参考，实际车场入口、费用与窗口待确认 |
| 嘉兴南湖外围街道 | 9.6 / 2.4km | 交管指南点名游客中心车场，具名OSM地块对应；费用窗口待确认；避开景区步道和铁路下穿隧道 |
| 金华江北铁路公园与老城 | 5.3 / 3.6km | 运营方说明从二七街找到地下车场；旧来源与当前核验边界明示，未将防台风临时免费当作常态 |
| 杭州运河桥西日间 | 4.9km | 湖墅51地图有access=yes/fee=yes；单价未知，日间先核取车窗口，不跨拱宸桥台阶 |

城市与片区联动筛选；桌面侧栏独立滚动并保持当前卡片可见；手机保留横向选线。夜骑详情分别说明照明、停车取车与补给。费用待确认方案不会显示¥0；未完成核验的品牌点留在探店线索，不计入正式商户。

照片优先道路环境，支持本地文件或原站外链、点击放大、作者/日期/出处/许可。当前正式路线关联5张本地湘湖/南湖景观照片和2张北山街湖边人行道景观外链，研究卡另展示3张东湖/双龙景点照片。历史照片与景点图不作为当前道路准入或夜间照明证明；外链不能加载时仍可打开出处。已通过登录的应用内浏览器读取小红书原笔记并保存两张道路候选截图；具体拍摄路段和转载许可待核，截图仅保留本地。见[小红书核查记录](research/xiaohongshu/README.md)。

## 待核查方向

共11个：湖州八都岕、李家巷、南太湖溇港/义皋、南浔/荻港；嘉兴秀湖/石臼漾；绍兴迪荡湖、东湖、鉴湖；金华双龙；杭州运河和滨江夜间方向。

迪荡湖有5.4km真实公共道路研究图，**没有P与停车导航，不计入正式路线**。东湖研究纠正了此前停车误定位，并排除未确认校外公众准入的大学食堂。“已研究”与“可出行方案”分开，证据缺口见[本轮核查记录](research/verification-2026-10-16.md)。

## 运行与检查

```sh
python3 -m http.server 3000 --bind 127.0.0.1
node tests/catalog.test.cjs
```

当前22项Node测试已通过。Node检查覆盖统计去重、来源日期/费用分类、真实OSM边、单行与往返方向、道路累计里程、照明标记、湖岸多边形、图片许可及所有地图资源。

真实桌面/手机交互检查使用Node Playwright与已安装的Chrome/Chromium：

```sh
node tests/browser-check.cjs
# 兼容旧入口：python3 tests/browser-check.py
```

若Playwright位于其他安装目录，设置`NODE_PATH`；可通过`CHROME_EXECUTABLE_PATH`指定浏览器。脚本覆盖1440px与390px、所有方案地图与导航、级联筛选、照片弹窗、侧栏键盘滚动、PNG下载、收藏刷新与资源错误。本轮通过Codex应用内浏览器实际操作完成了UI验收，使用[响应式预览](tests/responsive-preview.html)中的真实1440px/390px嵌入视口，核对了全部26方案、筛选、弹窗、侧栏键盘滚动、地图下载和收藏刷新。验收记录和截图见[research/qa](research/qa)。上述独立Playwright脚本本轮未另行执行；手机App调起仍未真机测试。

重建本轮地图：

```sh
python3 scripts/build-verified-maps.py
node scripts/generate-maps.cjs
node scripts/export-maps.cjs
```

最后一步需要sharp（可用`NODE_PATH`指向已有运行时）。SVG与PNG采用网页同一渲染器。`build-regional-maps.py`为较早区域的独立生成器，不应为更新本轮线路而无故覆盖其输出。

## 数据与文件

按顺序加载：

```text
map-data → catalog → planning-data → regional-map-data → regional-catalog
→ huzhou-research → verified-map-data → verified-catalog → expanded-catalog
→ city-catalog → research-updates → photo-data → catalog-metadata
→ map-renderer → app
```

`expanded-catalog.js`为北山夜骑/夹浦/画溪；`city-catalog.js`为本轮南湖/金华/运河与迪荡研究图；`research-updates.js`维护缺口；`catalog-metadata.js`统一汇总城市与最终统计；`photo-data.js`关联照片，原始许可元数据在`research/photo-licenses.json`。全部方案的SVG/PNG在`maps/`，道路配置及可重建快照在`research/`。

地图坐标WGS84，高德/百度坐标导航转GCJ-02。P为停车片区参考，S为实际道路节点；名称检索不等于入口实测，停车场内推行与探店绕行另计。橙线主线、绿色实际经过的OSM骑行道（可能行人共用）、紫C咖啡、红F餐厅、蓝R歇脚建议。无证据不宣称自行车独享或全天开放。

## 提交与上线状态

原远程仓库为`git@github.com:1572178028/ride.git`，发布分支为`main`。本批数据与功能验收已完成；正常提交推送的实际结果记录在[TASK_PROGRESS.md](TASK_PROGRESS.md)顶部。推送与GitHub Pages部署分别核实。

地图数据 © OpenStreetMap contributors，ODbL；路线为公开路网规划，非实骑轨迹。

项目扩充工作流：[expand-cycling-routes](.agents/skills/expand-cycling-routes/SKILL.md)。用户允许收费停车，免费、收费与未知费用分别标注；证据不足的方向保留研究状态。
