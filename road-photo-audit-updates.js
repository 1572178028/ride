/* Road-photo audit: verified segment images and unassigned sources remain distinct. */
(()=>{
 const photos=[
  {
    "id": "badu-park-tidenews",
    "group": "badu",
    "kind": "road",
    "routeIds": [
      "badu-ginkgo-road"
    ],
    "src": "photos/badu-park-tidenews-202607.jpg",
    "storage": "local",
    "source": "https://tidenews.com.cn/news.html?id=3505512",
    "originalUrl": "https://meizi-chao-pub.8531.cn/2083058777824477184_1280px.jpg?height=720&width=1280",
    "author": "潮新闻记者 朱高祥",
    "date": "报道2026-07-19；拍摄日未单列",
    "checked": "2026-10-20",
    "downloadDate": "2026-10-20",
    "sourceType": "news-original-image",
    "license": "潮新闻版权 · 原文注明“转载请注明出处”",
    "caption": "小柏线 · 方一村古银杏公园旁道路",
    "relation": "原文在方一村采访段明确图注“小柏线两侧”；画面可见古银杏公园石牌、路名指示与公共道路标线。高德古银杏公园B023C02Z8N位于本方案经过的方一村小柏线旁。匹配到路段，未定位摄影者精确站位。",
    "verification": "原文在方一村采访段明确图注“小柏线两侧”；画面可见古银杏公园石牌、路名指示与公共道路标线。高德古银杏公园B023C02Z8N位于本方案经过的方一村小柏线旁。匹配到路段，未定位摄影者精确站位。",
    "pixelWidth": 1280,
    "pixelHeight": 720,
    "modification": "原图保存，保留潮新闻水印，未裁剪、放大或改写内容",
    "locationConfidence": "路段级 · 高，非精确摄影坐标"
  },
  {
    "id": "badu-village-tidenews",
    "group": "badu",
    "kind": "road",
    "routeIds": [
      "badu-ginkgo-road"
    ],
    "src": "photos/badu-village-tidenews-202607.jpg",
    "storage": "local",
    "source": "https://tidenews.com.cn/news.html?id=3505512",
    "originalUrl": "https://meizi-chao-pub.8531.cn/2083058777824477187_1280px.jpg?height=720&width=1280",
    "author": "潮新闻记者 朱高祥",
    "date": "报道2026-07-19；拍摄日未单列",
    "checked": "2026-10-20",
    "downloadDate": "2026-10-20",
    "sourceType": "news-original-image",
    "license": "潮新闻版权 · 原文注明“转载请注明出处”",
    "caption": "小柏线 · 方一村路口与村标",
    "relation": "画面可读“方一”村标，原文图注“方一村一景”，与前图同一采访段和小柏线村庄环境交叉对应。展示本线方一村路段道路环境，不据此承诺当天通行。",
    "verification": "画面可读“方一”村标，原文图注“方一村一景”，与前图同一采访段和小柏线村庄环境交叉对应。展示本线方一村路段道路环境，不据此承诺当天通行。",
    "pixelWidth": 1280,
    "pixelHeight": 720,
    "modification": "原图保存，保留潮新闻水印，未裁剪、放大或改写内容",
    "locationConfidence": "路段级 · 高，非精确摄影坐标"
  }
];
 const r=ROUTES.find(r=>r.id==='badu-ginkgo-road');
 r.photos=photos;r.photoTarget=3;r.photoMissing=1;r.photoGap='已补2张方一村小柏线路段道路图，仍待补1张不同路段或视角的照片。';
 r.notes=r.notes.filter(n=>!n.startsWith('对应本方案的道路实拍'));r.notes.push('已补两张2026年报道的方一村小柏线道路图，仍缺1张；历史图不证明当日通行。未电话、实地或实骑核验。');
 r.sources.push(['潮新闻：方一村小柏线道路实拍',photos[0].source]);
})();
