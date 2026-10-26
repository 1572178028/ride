# 骑遇 · Ride Atlas

自驾带车，选择注明费用与开放条件的停车点，再换上自行车。当前44种道路方案、27条主线、27个片区、5个城市组。资料目录不代表到访当天准入、收费、车位或营业已现场确认。

原生HTML/CSS/JavaScript ES Modules，无框架、无运行时第三方依赖、无需打包；支持GitHub Pages项目子路径。

## 本地运行

需要Python 3；开发与数据检查使用Node.js 22.13或更高版本。

```sh
npm run dev
# 打开 http://127.0.0.1:3000
npm test
```

浏览器检查需要本机可用的Playwright和Chrome/Chromium，可用NODE_PATH指定已有包目录，CHROME_EXECUTABLE_PATH指定浏览器：

```sh
npm run test:browser
RIDE_TEST_BASE_PATH=/ride npm run test:browser
```

页面通过HTTP打开；ES Modules不支持直接以file://打开。

全部44方案在详情提供iPhone百度完整骑行路程查看：往返方案有全程、去程、返程，闭合环线只显示全程，关键点备用收在折叠帮助内。百度按点重新规划，非精确轨迹导入；各线真机验证范围和贺公堤单行接驳调整见[接入记录](research/all-route-baidu-navigation-20261026.md)。

## 目录与职责

```text
src/
  main.js                应用入口
  app.js                 页面状态协调与事件接线
  features/              路线、筛选、收藏、地图、照片、研究区
  domain/                纯业务判断与统计
  shared/                DOM、导航、坐标、提示等共享能力
  data/
    index.js             页面、测试和工具共用的数据入口
    routes/              按地区维护的当前正式路线
    candidates/          待核查方向及研究地图
    photos/              保留的历史图片索引
    generated/           地图背景、路径与道路核验元数据
  styles/                tokens与应用样式
assets/                  地图SVG/PNG、照片、favicon
scripts/                 数据与地图生成工具
tests/                   数据、架构和浏览器回归
research/                来源、路网快照、调研记录
docs/                    架构、资料说明、交接与历史记录
```

[路线维护说明](docs/architecture/route-maintenance.md)是当前接入指南；[结构设计](docs/architecture/2026-10-21-structure.md)说明本轮决策；[重构验证](docs/architecture/verification-2026-10-21.md)记录实际检查。视觉与公共交互分别见[DESIGN.md](DESIGN.md)、[UX-CONTRACT.md](UX-CONTRACT.md)。

## 数据与地图维护

新增或修订路线直接维护对应地区的最终记录，不再叠加updates脚本。来源与日期保留在[资料说明](docs/data-notes.md)及research；费用分免费条件、收费参考、待确认，研究方向单列。地图使用WGS84，导航按现有转换使用GCJ-02；规划路线不是实骑轨迹。

只运行目标区域对应的Python几何生成器，再统一导出：

```sh
python3 scripts/build-eastlake-route.py
npm run maps:generate
npm run maps:export
npm run photos:generate
npm test
```

PNG导出需要sharp；Python替代入口scripts/export-maps.py需要Playwright。几何、照片重建的所有权与限制见路线维护说明。新增省份、城市或独立路线时，仍按已有版本规则更新version.json及CHANGELOG；本轮纯结构重构不增加路线，不改变版本号。

## 接续与历史

[项目交接](docs/PROJECT_HANDOFF.md)、[历史过程](docs/history/TASK_PROGRESS.md)、[迁移前README](docs/history/README-before-modules.md)、[会话归档](docs/conversation-archive-2026-10-21.md)。历史记录中的旧文件名、数量和加载顺序仅反映当时状态，当前维护以本README及src/data/index.js为准。

地图数据 © OpenStreetMap contributors，ODbL；照片逐条保留出处、作者、许可与关联范围。
