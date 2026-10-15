# 骑遇 · 全国 4+2 骑行路线库｜杭州站

从用户提供的公开站点 https://ride-atlas-hangzhou.tangybadge129.chatgpt.site/ 复制的静态网站。页面、CSS、JavaScript、四条线路数据、SVG 地图和 PNG 下载资源均保留原样；本地前版在 `/workspace/shared/ride-before-import-*` 下备份。

## 运行

无需安装依赖或构建：

```sh
cd /workspace/ride
python3 -m http.server 3000 --bind 0.0.0.0
```

也可部署到支持静态文件的站点托管服务。所有显示用地图资源均随站点提供，无需在线地图 API。导航及信息来源链接需联网。收藏存储于当前浏览器，不自动迁移旧站的收藏。

## GitHub Pages 托管

本站已按 GitHub Pages 的项目站点路径准备好，所有本地资源使用相对地址；根目录的 `.nojekyll` 文件确保直接发布静态文件，无需 Jekyll 或构建依赖。

仓库管理员首次启用：

1. 打开 https://github.com/1572178028/ride/settings/pages 。
2. 在 **Build and deployment → Source** 选择 **Deploy from a branch**。
3. Branch 选择 **main**，目录选择 **/ (root)**，点击 **Save**。
4. 在仓库 **Actions** 中查看 `pages build and deployment` 任务是否成功。

首次部署成功后，默认访问地址为 https://1572178028.github.io/ride/ （以 Pages 设置实际显示的地址为准）。启用前不要将此地址视为已上线。后续推送到 `main` 会触发更新，无需再次选择分支。

如果设置页提示套餐限制、仓库可见性要求或组织策略，请按 GitHub 提示处理；不要为部署而擅自更改仓库可见性。

## 原站内容

- 湘湖湖岸慢骑：约 10.5 km。
- 七彩绿道 · 定山湖慢游：约 10.2 km。
- 奥莱出发 · 翁金线初体验：约 15.8 km。
- 翁金线 · 向盐官骑去：约 41 km。

原站提供免费停车的适用条件、来源与发布日期：湘湖停车限夜间 18:00—次日 08:30；下沙奥特莱斯停车按商场当日开放及管理规则。信息来自原站公开资料，本次迁移未进行现场、电话或来源内容的独立复核。请勿把有条件免费理解为全天无条件免费。原站资料核对日期保持不变。

地图为规划参考、非实测轨迹。地图数据 © OpenStreetMap contributors，遵循原站标注的 ODbL；原始来源链接保留在页面内。

## 文件

`index.html` 页面；`styles.css` 样式；`catalog.js` 线路及停车、餐饮数据；`map-data.js` 道路、水域与参考路线数据；`map-renderer.js` 交互 SVG 地图渲染；`app.js` 筛选、收藏、导航与地图操作；`maps/` 地图缩略图及 PNG 下载文件。
