# 结构重构验收 · 2026-10-21

## 结果

路线资料、功能模块、静态资源及维护文档已分离；HTML仅加载src/main.js。页面、测试和离线地图生成器共用src/data/index.js。根目录不再存放业务JavaScript或CSS，现有37方案、20主线及版本1.1.5保持不变。

## 实际执行

| 验证 | 结果 |
| --- | --- |
| 迁移前node --test tests/catalog.test.cjs tests/puyang-route.test.cjs | 40项通过 |
| 迁移后npm test | 46项通过；增加统一入口、无浏览器全局依赖、迁移指纹、收藏恢复、筛选边界、几何合并检查 |
| 迁移前后11组数据逐字段比对 | 全部一致；仅允许maps/photos本地路径增加assets前缀 |
| node tests/browser-check.cjs | 37方案、1440px桌面、390px手机通过，errors为空 |
| RIDE_TEST_BASE_PATH=/ride node tests/browser-check.cjs | 同一完整回归通过，errors为空；子路径CSS、模块、照片、地图和下载可用 |
| 东湖、浦阳江、双龙、湖州、西湖完整环线几何生成器 | 全部执行成功；重建后11组数据与基线一致 |
| node scripts/generate-maps.cjs | 37正式方案及4研究图导出成功 |
| node scripts/export-maps.cjs | 41张PNG导出成功；本次保留原资源字节，临时生成图用于验证 |
| node scripts/build-photo-updates.cjs | 37方案照片资料重建成功；重建后与迁移前一致 |
| 全部源/工具/测试JavaScript语法与Python compileall | 通过 |
| 135个迁移资源与Git基线blob比对 | 地图、照片、favicon内容字节全部一致 |
| git diff --check | 通过 |

浏览器检查使用已有Playwright及本机Chrome，含筛选空结果、城市片区联动、方案切换、导航、照片弹窗、补给筛选、地图键盘操作、收藏刷新、PNG下载与资源错误检查。人工查看了桌面地图与手机照片页面截图。没有新增远程数据请求或提交业务，因此不新增远程搜索、鉴权、离线提交等状态矩阵。

## Design skill静态审计

已运行frontend-design-premium的audit_project.py --mode strict，原始输出见[premium-audit-2026-10-21.json](premium-audit-2026-10-21.json)。补齐公共滚动条标准属性、WebKit回退及高对比模式后，仍返回3项affordance.actionless-button。

这3项是静态分析器的事件委托识别限制：其按钮规则只识别标签上的onclick等绑定，不追踪addEventListener与data属性。对应控件分别是方案切换（src/app.js）、照片放大（features/photos，监听位于app与research模块）、补给筛选（features/routes/supply，监听位于app）。对应真实事件均在浏览器完整回归中通过。没有为绕过审计添加空onclick、禁用按钮或放宽规则；不将这次审计称为严格通过。

DESIGN.md记录已有视觉与token来源，UX-CONTRACT.md明确公共交互所有者。本次没有宣称完成全站设计系统、全部硬编码颜色或历史交互细节的治理。

## 交付边界

本轮验证完成后，用户已授权提交推送与补充现有V1.1.5 Release代码更新说明；版本号及原标签保持不变。实际远程执行状态以本次交付说明为准。用户原有.idea目录已通过.gitignore排除。原始资料与历史记录保留；历史加载顺序不再作为当前接入方式。维护入口为README及[路线维护说明](route-maintenance.md)。
