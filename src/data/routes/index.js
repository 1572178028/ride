import xianghu from "./xianghu.js";
import wengjin from "./wengjin.js";
import qiandao from "./qiandao.js";
import qiandao_shangjiang from "./qiandao-shangjiang.js";
import qiandao_northeast from "./qiandao-northeast.js";
import tonglu from "./tonglu.js";
import qiantangpark from "./qiantangpark.js";
import westlake from "./westlake.js";
import yucun from "./yucun.js";
import mogan from "./mogan.js";
import jiapu from "./jiapu.js";
import huaxi from "./huaxi.js";
import nanhu from "./nanhu.js";
import jinhua from "./jinhua.js";
import canal from "./canal.js";
import binjiang from "./binjiang.js";
import qianjiang from "./qianjiang.js";
import puyang from "./puyang.js";
import badu from "./badu.js";
import yigao from "./yigao.js";
import shuanglong from "./shuanglong.js";
import eastlake from "./eastlake.js";
import tongjianhu from "./tongjianhu.js";
import jingshan_shuangxi from "./jingshan-shuangxi.js";
import liangzhu_village from "./liangzhu-village.js";
import chaoshan from "./chaoshan.js";
import xiasha_riverside from "./xiasha-riverside.js";
import lijiaxiang_roads from "./lijiaxiang-roads.js";
import hefu_digang from "./hefu-digang.js";
import order from "./order.js";
import xishanyang_ring from "./xishanyang-ring.js";
import longshan_chuanbu from "./longshan-chuanbu.js";
import miaoxin_road_return from "./miaoxin-road-return.js";
import xiazhuhu_west_road_return from "./xiazhuhu-west-road-return.js";
import nanxun_city_ring from "./nanxun-city-ring.js";
import yucun_north_road from "./yucun-north-road.js";
import taihu_nine_long from "./taihu-nine-long.js";
const positions = new Map(order.map((id, index) => [id, index]));
export const ROUTES = [
  ...xishanyang_ring,
  ...longshan_chuanbu,
  ...miaoxin_road_return,
  ...xiazhuhu_west_road_return,
  ...nanxun_city_ring,
  ...yucun_north_road,
  ...taihu_nine_long,
  ...lijiaxiang_roads,
  ...hefu_digang,
  ...xianghu,
  ...wengjin,
  ...qiandao,
  ...qiandao_shangjiang,
  ...qiandao_northeast,
  ...tonglu,
  ...qiantangpark,
  ...westlake,
  ...yucun,
  ...mogan,
  ...jiapu,
  ...huaxi,
  ...nanhu,
  ...jinhua,
  ...canal,
  ...binjiang,
  ...qianjiang,
  ...puyang,
  ...badu,
  ...yigao,
  ...shuanglong,
  ...eastlake,
  ...tongjianhu,
  ...jingshan_shuangxi,
  ...liangzhu_village,
  ...chaoshan,
  ...xiasha_riverside,
].sort(
  (a, b) =>
    (positions.get(a.id) ?? Infinity) - (positions.get(b.id) ?? Infinity),
);
