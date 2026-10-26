# 当前路线维护与模块边界

## 单一入口

`src/data/index.js`导出ROUTES、MAP_DATA、REGIONAL_PLANS、EXPANSION_CANDIDATES、RESEARCH_MAPS、别名与标签。页面、数据测试、SVG工具直接import/require该入口，不维护脚本加载清单。浏览器业务数据不挂到window。

## 人工源与生成字段

- 正式路线：`src/data/routes/<region>.js`，直接维护最终资料。不要通过追加补丁覆盖其他地区。`order.js`记录现有展示顺序；新增方案需加入顺序表，新地区需在`routes/index.js`导入。地区/城市标签在`data/labels.js`。familyId、编号、cityGroup等字段显式保留，统计从实际记录计算。
- 研究方向：`src/data/candidates/index.js`；路线关联的入口延伸研究放该路线的researchExtensions，不能混入正式路线统计；研究地图在`candidates/maps.js`。
- 地图几何：`src/data/generated/{maps,paths,plans,metadata}.js`，机器生成的JSON字面量ESM。人工维护research快照和相应Python生成器，通过`scripts/lib/geometry.py`合并生成器拥有的键；未涉及的键必须保留。不要格式化这些大文件，也不要手动编辑坐标。
- 照片：`research/photo-licenses.json`维护许可、出处、关联ID及评分；`npm run photos:generate`更新当前地区和研究资料中的photos/photoTarget/photoMissing/photoGap字段，保持其余字段。`src/data/photos/catalog.js`保留迁移前历史图片索引，供核查旧关联，不作为新增图片接入口。
- 导出资源：`assets/maps`、`assets/photos`。数据中的本地src和preview路径相对站点首页，例如assets/photos/example.jpg；不得使用根绝对路径，以兼容项目子路径。

## 几何重建边界

现有Python生成算法、锚点和证据规则保留。运行对应地区生成器后检查生成差异、重新导出SVG/PNG并执行测试。较早的regional/verified生成器包含多个区域、可能重建共享地图背景；不要为修改一条新线路而无故全量运行。西湖完整环线应在其更早背景之后生成；需要调整共有背景时汇总相关方案的范围并复核所有方案。合并写入只防止无关键被删除，不自动解决同一地图键的语义冲突。

## 功能边界

app.js只协调选中路线、筛选、收藏与视图。features/routes维护卡片、详情、补给；features/map维护交互视口与独立SVG渲染器；filters管理筛选读数与城市/片区联动；photos管理图片展示与弹窗；research管理研究卡片。shared提供导航、坐标、DOM和提示，domain不访问DOM。

所有导航城市以路线数据为准。保留稳定ID、familyId、别名和ride-atlas-favorites存储键，避免破坏旧链接及收藏。新数据需保留停车证据、真实路网边、道路准入和照片核查门槛；本轮收拢数据不代表重新核查了这些事实。

## 验证与部署

完整骑行路程入口由src/features/routes/full-route.js自动覆盖所有正式方案，src/domain/route-navigation.js归一化几何及折返，route-waypoints.js按长度和弯道选点。新增路线须命名明确折返点；闭合环线不能按起终点相同误拆。新方案优先存完整合法回程，旧“原路往返”单程数据只有在可逆方向已核对时才展开。单行接驳需独立生成方向参考，由scripts/build-navigation-geometry.py及scripts/lib/geometry.py合并src/data/generated/navigation.js，通过src/data/index.js导出NAVIGATION_GEOMETRY；不得手工改生成坐标。主/备用点数由实际路线确定，不把浦阳江的手机实测结论外推给其他路线。新增接入要求也维护在项目expand-cycling-routes skill中。

npm test覆盖数据完整性和模块边界；npm run test:browser覆盖1440/390px、46方案、筛选、地图、导航、收藏、照片和下载。以RIDE_TEST_BASE_PATH=/ride运行同一浏览器检查验证子路径。迁移指纹位于tests/fixtures/catalog-migration-sha256.json；有意修改资料时，在核对相应字段和专项测试后更新指纹，不应为通过测试盲目替换。

静态部署仍发布仓库根目录，没有public映射或dist构建步骤。仅结构重构不修改版本号、标签或Release。根README与本说明优先于历史文档和旧扩线skill参考中的目录说明；原有业务证据规则仍适用。

## 展示区域与独立路线

可选`browseGroup: {id, title, region, area}`描述共享页面入口，`shortTitle`提供切换按钮名称。千岛湖四方案统一为`qiandao-cafe / 千岛湖 / qiandao / 淳安 · 千岛湖`，各自原familyId、region、几何键、停车和路线ID不变。列表与方案切换使用browseGroupId，片区筛选与片区统计使用browseRegion；未声明时回退既有familyId/region。独立主线统计仍按familyId，不能用卡片数替代。
