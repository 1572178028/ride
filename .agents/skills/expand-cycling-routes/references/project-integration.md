# 骑遇项目接入说明

这是当前静态站的接入参考，不是不可修改的架构。执行前读取实际代码；不要假设将来的字段、路径和统计仍与本文完全相同。

## 文件与加载顺序

网页与Node地图生成器目前均按以下顺序加载：

```text
map-data.js → catalog.js → planning-data.js
→ regional-map-data.js → regional-catalog.js → map-renderer.js
```

`app.js`最后加载，负责渲染、筛选、收藏、地图交互和导航。

| 文件 | 接入要求 |
| --- | --- |
| `catalog.js` | 初始路线数据，避免无关覆盖 |
| `planning-data.js` | 旧路线变体、坐标转换器 `RIDE_COORDS`、研究候选初始化 |
| `regional-catalog.js` | 当前新增区域路线、商家和证据，末尾计算 `ROUTE_METADATA` |
| `map-data.js` / `regional-map-data.js` | `MAP_DATA.maps[region]`、`MAP_DATA.paths[id]` 和 `REGIONAL_PLANS[id]` |
| `scripts/build-regional-maps.py` | 读取研究快照，生成新增区域几何和分段属性 |
| `scripts/generate-maps.cjs` | 用网站同一渲染器生成各方案SVG和研究图 |
| `scripts/export-maps.py` | 将所有SVG导出为PNG，使用Playwright/Chromium |
| `index.html` | 片区选项、覆盖介绍、默认计数、来源读取日期等静态文案 |
| `app.js` | `navCity()` 当前对少数区域有硬编码，跨城新增时必须接入正确城市 |
| `research/` | 道路、水域快照及逐区域证据笔记 |
| `data-notes.md` / `README.md` | 来源、边界、当前覆盖及运行方式 |
| `tests/` | 目录与浏览器检查，部分断言写死初始数量、日期和杭州经纬度范围 |

可以增设区域文件以避免单文件过大；新增文件必须同时接入网页、地图生成器和测试的加载顺序，放在元数据汇总之前。不能只让浏览器或导出工具中的一个看见新数据。

## 路线结构

参考 `regional-catalog.js` 的 `records` 及其归一化过程。下列是字段说明，不是可复制的虚构路线：

```text
id                     稳定唯一的英文短横线ID；对应地图资源文件名
number                 唯一展示编号；不能复用已有编号
familyId/familyTitle   独立地理主线与名称；主方案id等于familyId
region/city/area        机器片区ID、正确导航城市和可读区域
 title/subtitle         标题与一句概述
 distance               按实际道路几何计算，一位小数
 duration/level         骑行估时与强度；写清是否排除探店/休息
 shape                  现有“原路往返”“环线”“往返环路”等语义
 window                 当前筛选使用day或night；开放的更细条件写parking
 dedicated/isolated     专用属性、机动车分隔；必须有依据
 lane/laneDetail        清楚结论、覆盖范围、接驳和不确定性
 mapCyclewayKm          主线实际覆盖路网骑行道的里程
 tags/description       搜索标签、完整路线说明
 parking                下节的免费停车记录
 start                  {name, point:[经,纬], gcj:[经,纬]}
 stops                  [{name, point, gcj, note}, ...]
 food/rest/supply       餐饮列表、歇脚列表、合并列表（顺序决定地图编号）
 mapWater               {name, point}，实际在地图范围内的水域名
 sources                [[来源标题, URL], ...]
 sourceChecked          本方案实际读取资料的日期
 notes                  通行、窗口、补给、天气等与路线有关的说明
 geometrySource         几何来源和日期
 geometryWays           所用公开路网way IDs
```

当前新区域记录先定义 `stopNames/stopNotes`，再从 `REGIONAL_PLANS[id].anchors` 构造 `start/stops`。两组长度必须对应，不能出现缺失名称。

旧路线的 `planBasis` 会触发“复用原有道路段”的专用测试；使用全新合法路网的路线应记录自己的几何依据，不要为了显示一段文案误用此字段。

## 停车与地点字段

```text
parking:
  id（或已有真实poiid）  稳定停车实体ID；供去重使用
  name/query/address    完整停车名称、导航检索词及地址
  point/gcj             地图WGS84、导航GCJ-02
  price                 合格方案展示¥0；不能用该字段替代证据
  rule/condition        简明免费规则、完整开放/预约/人群/取车条件
  source/sourceTitle    实际读取的免费来源URL与标题
  published/checked     原文日期 / 本次实际读取日期，禁止混写
  verification/evidence 核验方式、证据强弱及免费原文含义
  mapLabel/precision    简短地图标签、定位精度说明
  namedNavigation       近似入口为true，以名称检索，不能假装精确坐标
  phone                 来源中确实存在的电话（可选，不能假称已拨打）

place:
  name/kind             完整分店名；kind为“咖啡”“餐厅”或“歇脚”
  point/gcj             有来源的坐标；片区点必须注明精度
  description/location  选择理由与地址，不写伪造体验
  source/sourceTitle    所读取来源
  checked/status        实际读取日及营业/设施核验状态
  mapLabel              简短且与卡片可对应的标记名称
  placement             along / start / detour
  query/poiid           完整名称或已取得的真实POI ID
  precision             近似位置写“片区”等明确说明
  namedNavigation       仅片区位置时用名称检索
```

当前 `app.js` 的琥珀色停车状态特判千岛湖，不能将它当作所有地区证据状态的通用设计。新增正常合格记录沿用既有样式；如需展示其他不确定记录，先完善通用证据状态，不能只靠区域ID判断。用户本次五项硬要求下，新证据不足的方向应放待核查区。

## 道路快照与重建

快照路径采用 `research/<region>-osm.json.gz`；保留Overpass `elements` 中way的ID、nodes、geometry、tags。水域relation几何可保存为 `<region>-water.json.gz`。

按区域小范围分批查询道路及水域，设置合理超时，避免请求整个省份的庞大数据；记录查询、bbox、端点、取得时间和失败/缺失范围。推荐的Overpass查询结构（替换占位符后执行）：

```text
[out:json][timeout:60];
(
  way["highway"](south,west,north,east);
  way["natural"="water"](south,west,north,east);
  relation["natural"="water"](south,west,north,east);
);
out body geom;
```

路网有缺口时扩大必要范围或获取另一合法数据源，不可凭空补线；水域relation可单独查询补足岸线与岛屿。

`build-regional-maps.py` 当前的 `specs` 写死了若干方案，**每次重建会覆盖整个 `regional-map-data.js`**。扩充时必须同时保留旧方案和快照。它还按方案裁切背景并覆盖同片区地图，增加路线时应汇总同片区所有方案的bounds，避免最后一条方案把其他路线的背景路网裁掉。

路径生成注意检查：

- 起终锚点吸附到可通行且连通的道路节点，评估吸附距离与接驳；不能把隔水或隔离栏两侧的“最近点”当作可直达。
- 除现有过滤外，检查 `bicycle/access/vehicle`、条件通行、匝道、环岛、单向、桥隧和现场管理依据。OSM没有禁行标签不等于完成通行核验。
- 对 `oneway=yes/1/true/-1` 等正确解释，必要时处理明确的自行车例外。存在可用转向限制时遵循，不能忽略已知禁转关系。
- `REGIONAL_PLANS[id].segments.length === MAP_DATA.paths[id].length - 1`，每段对应真实way边，保存kind、way、km和shared等属性。
- 原路往返主线只存去程时，distance和cyclewayKm按双程计；环线/往返环路保存实际完整路径。
- `checked`用实际几何取得/核对日期，禁止沿用脚本中的历史日期冒充新核验。

## 来源笔记

建议保存 `research/<region>-sources.md`，至少记录：

```text
区域与查询边界；实际读取日期
候选主线与独立地理方向
停车实体、免费原文摘录、URL、发布日期、窗口和适用条件
来源可访问情况；相互冲突的规则及取舍
餐饮/歇脚：完整名称、地址、来源、营业/设施状态、沿线关系
道路准入、几何来源与坐标系
正式收录 / 待核查 / 不采用，以及原因和后续缺失项
```

不要批量更新历史记录的 `checked`、`verification` 或站点“全部来源核查日期”，除非确实重新读取了这些来源。新一批更新日期和各条证据的核对日期分别管理。

## 地图、导航与数量

- `MAP_DATA.maps[region]` 需要实际道路、水域（无水域可为空数组）；`MAP_DATA.paths[id]`存完整主线路径。
- 有新城市时检查 `navCity()`，优先复用记录中的city等结构化字段，不能默认所有新区域均为杭州市。
- 高德坐标导航使用现有 `navigation` 构造器，`coordinate=gaode`、骑行 `mode=ride`；百度现有direction构造器使用 `coord_type=gcj02`、骑行 `mode=riding`。遵循当时提供方接口，不把搜索链接宣传成精准入口导航。
- `ROUTE_METADATA` 在所有新增记录载入后汇总。主线按familyId、区域按真实region、停车按稳定实体ID、店铺按真实分店去重；同一家店的名称别名先归一化。
- 更新 `index.html` 中片区筛选和覆盖范围文字、无JS时的默认计数，`README.md`与数据说明要一致。不要只修改页面数字而漏掉真实数据。
- 研究方向目前使用 `EXPANSION_CANDIDATES`，研究图还存在西湖专用渲染文案。新增其他区域预览时需将文案和资源循环改为通用，不能出现“安吉研究图”却写“西湖”。

## 验证与交付命令

先检查依赖：Node、Python、Python Playwright与Chromium。网站运行本身不需要在线地图API或新增依赖；导出工具需要浏览器。

```sh
python3 scripts/build-regional-maps.py
node scripts/generate-maps.cjs
python3 scripts/export-maps.py
node tests/catalog.test.cjs
python3 tests/browser-check.py
git diff --check
```

只有几何配置或快照发生变化才运行第一步；不要无目的重写未变的生成文件。若更换构建工具，文档和命令一并更新。

现有测试写死过12方案、7主线、5区域、特定核对日、杭州经纬度范围，以及所有路线dedicated=false。这些是当前快照，新增时应更新预期或提取明确的独立预期数据，保留真实性校验。不能通过删除断言、放宽为任意非空或强制所有专用道为false来“修复”测试。

有意义的新增验证应覆盖：稳定唯一ID、主线/变体关系、停车条件和证据、实际几何和里程、每段合法方向、坐标转换、地图标记/资源完整、新区域筛选、正确城市导航。坐标转换测试不能假设全国所有点的偏移方向都与杭州相同。

桌面与至少390px手机宽度目视检查，并覆盖窄屏溢出；实际选择新增区域及每种新方案，核对：

- 正确展示主线/变体和去重数量；停车窗口显著，夜间条件不遗漏。
- 路线全线可见，P/S分开、商家与卡片编号一致、咖啡/餐厅/休息颜色和图例一致。
- 放大/全线/定位/筛选/收藏工作；SVG与PNG存在且内容对应。
- 百度和高德的目的地、城市、模式、坐标系有效；浏览器无异常或404。
- 研究候选没有¥0承诺、免费停车P或正式统计。

运行失败时定位并修复；环境缺少依赖或访问受限时明确报告未执行的检查，不能写成全部通过。提交/推送遵循当前授权，仅在实际成功后报告，线上更新另行检查。
