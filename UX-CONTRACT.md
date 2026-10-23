# 骑遇交互维护约定

本轮结构重构沿用现有交互，不新增业务流程。视觉依据DESIGN.md，数据规则依据README、docs/data-notes.md及research中的来源记录。

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Select/Listbox | src/features/filters/index.js、index.html | 原生select，平台管理弹层 | 城市、片区、费用、距离、道路；城市更新片区选项 | tests/browser-check.cjs |
| Scrollbar | src/styles/app.css | 既有文档与侧栏滚动规则 | 桌面独立侧栏、手机横向卡片 | tests/browser-check.cjs |
| Toast | src/shared/feedback.js | 单个#toast，role=status，aria-live=polite | 收藏存储失败、复制与下载反馈 | tests/browser-check.cjs |
| Dialog | src/features/photos/index.js、src/app.js | 原生dialog/showModal | 照片预览、覆盖说明 | tests/browser-check.cjs |
| Route navigation | src/app.js | 路线hash与src/data/aliases.js | 主线、里程方案、历史链接 | tests/browser-check.cjs |
| Favorites | src/features/favorites/storage.js | ride-atlas-favorites localStorage键 | 收藏过滤、刷新恢复、旧别名迁移 | tests/architecture.test.cjs、tests/browser-check.cjs |
| Map | src/features/map/controller.js、renderer.js | 同一几何及渲染器 | 交互地图、离线导出 | tests/catalog.test.cjs、tests/browser-check.cjs |

搜索与筛选保留现有页面内状态；本轮不改变URL协议（仅route hash持久化）或新增分页。地图下载和收藏保持同一方案ID。研究方向不可混入正式路线，照片关联分数不是定位概率。

## 维护边界

src/app.js负责页面状态协调与事件接线，features负责呈现和交互，domain不依赖DOM，data不依赖window/document。进入新地区时只更新地区数据、标签和必要的入口，不在HTML、测试和生成器复制加载顺序。来源缺口、照片失败、存储失败须提供已存在的文字说明。

## 已有技术债

本轮不做视觉改版。旧样式中的硬编码颜色、分散的间距/圆角及其他未触及的交互细节不视为已完成全面设计系统治理。后续变更应优先沿公共所有者收敛，避免新增分叉。

## 待核实路线库

研究方向集中在#research-library原生details中，默认折叠，summary始终显示真实方向数与状态说明；用户主动展开后才显示筛选、卡片和证据。展开/收起支持键盘，保留当前城市筛选；不写入收藏或改变正式路线选择。路线关联的入口延伸研究仍保留在对应详情中。公共所有者为index.html与src/features/research/index.js。

路线详情中的研究资料说明使用当前方案通用表述，不写死其他路线里程；旧停车备选不计入正式停车起点。

## 百度外部地图

坐标地点使用官方marker接口先展示目标（GCJ-02、纬度在前）；近似停车入口保持带城市的具名搜索。百度按钮明确“查看停车点/骑行起点”或“查找停车入口”，由百度页面“到这去”选择出发位置与交通方式，不把本站完整路线自动导入的能力写入文案。不得将“我的位置”作为普通地名交给旧direction接口，也不向网页direction接口传riding；不收集用户定位、不引入AK或服务端算路依赖。共享所有者src/shared/navigation.js，详情说明所有者src/features/routes/detail.js，验证tests/navigation.test.cjs及浏览器检查。
