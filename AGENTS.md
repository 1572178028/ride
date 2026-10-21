# 骑遇维护入口

先读README.md、docs/architecture/route-maintenance.md和当前Git状态。本项目已于2026-10-21从全局脚本链迁移为原生ES Modules。

- 正式路线维护src/data/routes/<region>.js；待核查方向维护src/data/candidates/index.js；最终统计由src/domain/catalog-summary.js计算。
- 网页、测试、地图工具统一从src/data/index.js读取。禁止新建根目录catalog/update脚本或向window注入业务数据。
- 功能归src/features，共享能力归src/shared，纯业务判断归src/domain；视觉与交互维护依据DESIGN.md、UX-CONTRACT.md。
- 地图/图片资源在assets/maps、assets/photos；几何生成器通过scripts/lib/geometry.py更新src/data/generated。
- research保留来源证据。旧记录及扩线skill中出现的根目录catalog.js、map-data.js等路径属于迁移前名称，以当前维护说明为准；原有证据和业务门槛继续适用。
- 完成修改后运行npm test；交互或资源路径变化还应运行npm run test:browser并验证/ride/项目子路径。浏览器工具依赖使用已有运行时，不要求站点引入运行依赖。
- 本轮目录重构不增加路线，不改变版本号。用户已授权本次提交推送，并补充现有V1.1.5 Release代码更新说明；原标签不移动。不要纳入用户的.idea文件。
