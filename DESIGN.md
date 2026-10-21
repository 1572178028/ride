---
version: alpha
name: "骑遇 Ride Atlas"
description: "自驾带车出发的骑行路线资料库，以地图、停车条件和来源证据帮助选择路线。"
colors:
  primary: "#1d4ed8"
  ink: "#172b4d"
  text: "#25354b"
  muted: "#526177"
  border: "#d6dee9"
  paper: "#ffffff"
  background: "#f1f4f8"
  route: "#be4315"
  cycleway: "#0d6a51"
  coffee: "#6636b6"
  food: "#b23b32"
  rest: "#116797"
  scrollbarThumb: "#b7c5da"
  scrollbarTrack: "#e7edf5"
  scrollbarHover: "#8b9fbf"
  scrollbarActive: "#6b82a5"
typography:
  sans:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
omitted:
  - section: rounded
    reason: "沿用现有组件半径，尚未建立统一半径token，本轮不改变视觉。"
  - section: spacing
    reason: "沿用现有布局，尚未建立统一间距token，本轮不改变视觉。"
components:
  button: {}
  card: {}
  dialog: {}
---

# 骑遇 Design System

## Overview

### Creative North Star

延续现有“道路地图与出发手册”的视觉：橙色路线、冷蓝灰地图与纸白信息卡。地图和可核查的出行条件是主体。

### Product context and register

用户是在中国境内自驾带车的休闲骑行者；依据README与现有路线资料，目前覆盖浙江五个城市组。中文界面，英文只作为次要栏目标识；内容日期保留资料本来的日期，不以本次重构日期替换。产品兼具介绍首页和路线探索工具，在桌面准备行程、手机查看起点与导航。

本次保留既有身份和交互。避免企业后台表格式首页、装饰性数据面板，以及没有照片证据时用景点图冒充道路实拍。

**Token ownership/runtime mapping:** 已有运行时样式是权威来源。`src/styles/tokens.css`定义颜色与字体变量，`src/styles/app.css`消费这些变量，`src/styles/index.css`作为唯一CSS入口；本文记录运行时值，不生成另一份主题。地图离线SVG需自包含，颜色由`src/features/map/renderer.js`维护；路线橙与页面提示橙原有深浅差异保留，不宣称已统一所有历史字面颜色。

## Colors

primary对应--blue，ink对应--ink，text对应--text，muted对应--muted，border对应--line，paper对应--paper，background对应--bg，route对应--orange，cycleway对应--green，coffee/food/rest对应同名变量。公共滚动条沿用现有蓝灰色，thumb/track/hover/active分别映射--scrollbar-thumb/track/hover/active，并提供标准属性与WebKit回退、forced-colors原生配色。费用和照片关联强度同时用文字表达，不单靠颜色。当前仅维护浅色主题，未来新增深色主题需同步地图与交互状态。

## Typography

--sans是唯一页面字体栈；正文15px、1.75行高，标题h2为32px，h3为20px。中文回退使用系统中文字体。地图采用其独立中文字体回退，确保导出不依赖网页字体加载。

## Layout

保留现有shell、桌面侧栏和详情的布局；760px及以下切换手机模式，路线卡片横向滚动。详情长内容使用文档滚动，桌面路线列表拥有独立滚动区域。图片和地图保持现有几何；不得通过隐藏页面溢出来掩盖内容超宽。

## Elevation & Depth

层级沿用纸白卡片、边框、已选路线强调与原生dialog顶层。地图信息弹层不挤压文档。结构重构不得增加无业务意义的阴影与悬浮层。

## Shapes

延续既有卡片、按钮与图片圆角；不在模块拆分时引入另一套半径。地图标记的P/S、途经点数字及补给编号具有业务意义，保留编号和下方清单对应。

## Components

### Foundational visual states

沿用既有hover、focus-visible、aria-pressed、selected与图片失败提示。筛选空结果提供重置按钮；费用未知与实拍待补保留明确文案。当前数据通过本地ESM同步初始化，没有远程搜索或提交状态。本次没有新增busy/skeleton体验。

### Buttons and actions

导航使用链接，收藏和方案切换使用按钮。地图标记维持Enter/Space操作，缩放和平移有键盘替代。提示消息由shared/feedback.js统一维护。

### Navigation and data display

路线与方案拥有稳定ID；hash链接和旧别名保持可用；收藏沿用现有localStorage键。研究方向与正式路线分别展示，不能因为目录迁移计入正式方案。

### Forms and overlays

筛选使用原生input/select，接受平台拥有下拉弹层几何和键盘行为。覆盖范围与照片放大使用原生dialog及showModal，支持Escape关闭和焦点恢复。没有编辑提交、删除、身份或支付流程。

## Do's and Don'ts

优先扩展现有功能模块；公共交互只有一个所有者，见UX-CONTRACT.md。保持证据、日期、费用、坐标系与资料边界。不得为视觉重组修改路线事实，不得把生成数据当人工维护源，也不得恢复全局脚本补丁链。
