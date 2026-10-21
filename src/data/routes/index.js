import xianghu from "./xianghu.js";
import wengjin from "./wengjin.js";
import qiandao from "./qiandao.js";
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
import order from "./order.js";
const positions = new Map(order.map((id, index) => [id, index]));
export const ROUTES = [
  ...xianghu,
  ...wengjin,
  ...qiandao,
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
].sort(
  (a, b) =>
    (positions.get(a.id) ?? Infinity) - (positions.get(b.id) ?? Infinity),
);
