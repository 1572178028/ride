# 千岛湖统一浏览入口 Implementation Plan

> **For agentic workers:** 使用 executing-plans，在当前会话执行并验证。

**Goal:** 按用户已确认方案，将秀水、半岛、上江埠、东北湖区收进一个千岛湖入口，按钮显示名称和距离。
**Architecture:** 保留独立familyId、region、地图、收藏与导航。新增可选browseGroup描述展示分组；纯领域函数统一列表、切换、片区筛选和片区统计，其他地区沿用既有行为。
**Tech Stack:** 原生ES Modules与现有HTML/CSS，无依赖新增。
**Spec:** 本轮对话中已确认的四方案结构。

## Global Constraints
保持46方案、29独立主线、30停车；片区展示合并后27。版本1.1.14与原标签不动，Release补充代码更新。沿用DESIGN.md颜色、字体、按钮与UX-CONTRACT.md原生筛选。

## Review Focus
直接打开旧hash仍选中正确方案；搜索/收藏/距离过滤后只展示匹配项；切换更新停车/照片/导航；东北环线不误拆单程；手机长名称换行无横向溢出。

### Task 1: 统一展示分组与验收
- [x] 在tests/qiandao-grouping.test.cjs写筛选必须命中四方案、单卡选中与稳定主线统计断言，先观察失败。
- [x] 在src/domain/route-groups.js提供browseGroupId、browseRegion；src/app.js、card.js、filters/index.js、route-filters.js、catalog-summary.js共同消费。
- [x] 四方案添加browseGroup和shortTitle，按钮保留现有样式显示真实名称，展示卡标题为千岛湖。
- [x] 更新浏览器检查：同片区四方案切换、搜索/距离/收藏恢复、根路径及/ride/、390px与1440px、名称/地图/导航一致。
- [x] npm test及两次浏览器通过；独立审查，记录证据和维护约定，更新有意字段的指纹。
- [x] 按已有授权提交合并推送，Release追加说明，核对Cloudflare。

验收：72项检查通过；根路径与/ride/的46方案1440/390px回归通过。独立审查无重要问题。长摘要溢出先用浏览器断言复现失败，再修改共享样式转绿；发布状态以远程工作流核对为准。
