# 浦阳江百度手机整线验证（独立试验）

用户要求优先验证手机百度地图：从本站打开起点、多个途经点、终点并显示骑行路线。此页是可撤回的兼容性试验，不是正式导航能力上线，不改变44方案资料或现有按钮。

入口：`experiments/puyang-baidu/`。引用`src/data/index.js`的当前浦阳江数据；没有重复维护坐标或地名。

## 官方依据

- [百度iOS调起API](https://lbsyun.baidu.com/docs/webapi?title=mapadjustment/uri/ios)：2.2.3，`baidumap://map/direction`，骑行`mode=riding`；`viaPoints`为编码后的`{"viaPoints":[{"name","lat","lng"}]}`。
- [百度Android调起API](https://lbsyun.baidu.com/docs/webapi?title=mapadjustment/uri/andriod)：2.3.2，浏览器示例使用`bdapp://map/direction`；原生示例使用`baidumap://`。提供显式备用链接，不使用定时跳转或无依据判定App已打开。
- 坐标来自本站GCJ-02，起终点纬度在前，途经点lat/lng分开，保留六位小数；整段参数只编码一次，空格为%20。
- 本地安装的baidu-map-webapi skill骑行Web服务只列起终点，返回算路数据且需要AK；不能把它与手机调起接口混为一谈。本试验不调用Web服务，不需要AK。

## 验证设计

1. 起终点基础骑行：临浦外道路起点→义桥方向折返点，不带途经点。
2. 去程：临浦→绿道口→滨水中段→义桥方向折返点（2途经点）。
3. 返程：反向同走廊（2途经点）。
4. 完整往返：临浦→绿道口→中段→义桥方向折返→中段→绿道口→临浦（5途经点）。检测同起终点与重复点是否被压缩/删除。

本站约16.7km是往返；单程算路距离不能冒充完整往返。百度重新规划道路，不保证复现本站385个几何点；须核对走廊、河岸、允许骑行道路及返回路段。

## 证据边界

- 文档核对完成，链接参数与移动网页可在本机验证。
- **尚无iPhone/Android百度App实测结果**，不得写作“整线兼容已通过”。桌面移动视口或模拟User-Agent不是真机验证。
- 手机待核：系统/百度版本；是否唤起App；是否自行车；起终点与途经点顺序；地图及公里数；往返是否保留。
- 若仅去返程有效，可分段使用；若途经点被忽略，应继续研究官方分享路线，不把基础起终点路线作为整线成功。

## 本机检查记录

- `npm test`：57项通过。
- `npm run test:browser`及`RIDE_TEST_BASE_PATH=/ride npm run test:browser`：44方案，1440/390px，无页面错误或资源404。
- 试验页专项：根路径和`/ride/`，iOS/Android User-Agent，390/360px；4组链接、平台切换、备用入口、点击链接参数、地图解码、返回路线地址通过。截图保存在本机`/private/tmp/ride-puyang-baidu-{root,subpath}-{ios,android}.png`。
- iOS/Android各4组参数检查：骑行模式、GCJ-02纬度经度顺序、途经点数0/2/2/5、返程顺序、同起终点、备用scheme和编码通过。
- 这些检查**没有运行手机百度App**，没有算出百度路线，也没有证明App保留途经点或完整往返。
