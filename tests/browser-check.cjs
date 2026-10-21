// Real browser checks; use an installed Playwright and Chromium/Chrome.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const { ROUTES } = require('../src/data/index.js');
const routeLookup = Object.fromEntries(ROUTES.map(r => [r.id, r]));
const basePath = process.env.RIDE_TEST_BASE_PATH || '';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!requested.startsWith(basePath + '/')) { res.writeHead(404).end(); return; }
  const file = path.resolve(root, '.' + requested.slice(basePath.length).replace(/\/$/, '/index.html'));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404).end(); return; } res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(data); });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    const chrome = process.env.CHROME_EXECUTABLE_PATH || (process.platform === 'darwin' && fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome') ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
    browser = await chromium.launch({ headless: true, ...(chrome ? { executablePath: chrome } : {}) });
    const url = `http://127.0.0.1:${server.address().port}${basePath}/`, errors = [];
    const watch = p => { p.on('pageerror', e => errors.push(e.message)); p.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); }); };
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce', acceptDownloads: true });
    watch(page); await page.goto(url); await page.waitForSelector('.route-card');
    assert.equal(await page.evaluate(() => innerWidth), 1440);
    assert.equal(await page.locator('.route-card').count(), 20);
    assert.equal(await page.locator('#total-plans').innerText(), '37');
    assert.equal(await page.locator('#total-parking').innerText(), '21');
    const ids = ROUTES.map(r => r.id);
    const select = async (p, id) => { await p.evaluate(id => { location.hash = 'route=' + id; }, id); await p.waitForFunction(title => document.querySelector('#selected-heading h2').textContent === title, routeLookup[id].title); };
    await page.selectOption('#region-filter','xianghu');
    assert.equal(await page.locator('.route-card').count(),1);
    assert.equal(await page.locator('.variant-picker button').count(),5);
    for (const id of ['xianghu-lakeside','xianghu-shanshan','xianghu-color','xianghu-hegong','xianghu-two-lakes']) {
      await page.locator(`[data-variant="${id}"]`).click();
      assert.equal(await page.locator('.route-card').count(),1);
      assert.equal(await page.locator('#map-container svg').count(),1);
      assert.equal(await page.locator('#route-detail .photo-open').count(),id==='xianghu-hegong'?3:['xianghu-color','xianghu-two-lakes'].includes(id)?5:0);
    }
    await page.locator('#selected-heading').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-unified-xianghu-desktop.png'});
    await page.selectOption('#region-filter','all');
    await page.selectOption('#region-filter','wengjin');
    assert.equal(await page.locator('.route-card').count(),1);
    assert.equal(await page.locator('.variant-picker button').count(),3);
    for (const id of ['wengjin-short','wengjin-middle','wengjin-yanguan']) {
      await page.locator(`[data-variant="${id}"]`).click();
      assert.equal(await page.locator('#selected-heading h2').innerText(),routeLookup[id].title);
      assert.equal(await page.locator('.route-card').count(),1);
      assert.equal(await page.locator('#route-detail .photo-open').count(),3);
    }
    await page.locator('#route-detail .route-photos').scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll('#route-detail .photo-open img')) {
        img.loading = 'eager';
        await img.decode();
      }
    });
    await page.screenshot({path:'/private/tmp/ride-photo-wengjin-desktop.png'});
    await page.locator('#route-detail .photo-open').first().click();
    await page.evaluate(async () => { await document.querySelector('#photo-dialog img').decode(); });
    assert.ok((await page.locator('#photo-dialog').innerText()).includes('具体拍摄段未标明'));
    await page.screenshot({path:'/private/tmp/ride-photo-wengjin-modal.png'});
    await page.keyboard.press('Escape');
    await page.selectOption('#region-filter','all');
    await page.selectOption('#city-filter','hangzhou');
    await page.selectOption('#region-filter','westlake');
    assert.equal(await page.locator('.route-card').count(),1);
    assert.equal(await page.locator('.variant-picker button').count(),6);
    assert.equal(await page.locator('#selected-heading h2').innerText(),'西湖 × 梅灵南北路 · 茶山江景环线');
    assert.ok((await page.locator('.variant-picker').innerText()).includes('停车起点可能不同'));
    for(const id of ['westlake-road','westlake-tea-road','meiling-south-road','westlake-hills-loop']){
      await page.locator(`[data-variant="${id}"]`).click();
      assert.equal(await page.locator('.route-card').count(),1);
      assert.equal(await page.locator('#map-container svg').count(),1);
      assert.equal(await page.locator('#selected-heading h2').innerText(),routeLookup[id].title);
    }
    await page.locator('#selected-heading').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-unified-westlake-desktop.png'});
    await page.locator('#map-container').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-unified-westlake-map.png'});
    await page.selectOption('#region-filter','all');await page.selectOption('#city-filter','all');
    await page.evaluate(() => {location.hash='route=westlake-20261018';});
    await page.waitForFunction(()=>location.hash==='#route=westlake-hills-loop');
    assert.equal(await page.locator('#map-container svg').count(),1);
    assert.equal(await page.locator('img[src*="my-rides"]').count(),0);
    assert.equal(await page.locator('.navigation-actions a').count(),4);
    for (const id of ids) {
      await select(page, id);
      assert.equal(await page.locator('#map-container svg').count(), 1);
      assert.ok(await page.locator('#map-container [data-poi] text').evaluateAll(ns=>ns.every(n=>/^(P|S|[FCRT]\d+|\d+)$/.test(n.textContent.trim()))),id);
      const firstSupply=page.locator('#map-container [data-poi="supply-0"]');
      await (await firstSupply.count()?firstSupply:page.locator('#map-container [data-poi="parking"]')).focus();
      await page.keyboard.press('Enter');
      assert.ok(await page.locator('#poi-popup').isVisible(),id);
      assert.ok(await page.evaluate(()=>document.querySelector('#poi-popup').getBoundingClientRect().top>=document.querySelector('#map-container').getBoundingClientRect().bottom),id+': details must sit below the map');
      assert.ok((await page.locator('#poi-popup b').innerText()).length>0);
      await page.locator('#close-poi').click();
      for(const badge of await page.locator('#route-detail .photo-match:not(.unscored)').allTextContents())assert.match(badge,/^\d+%$/);
      const locals=page.locator('#route-detail .photo-open img[src^="assets/photos/"]:visible');
      if(await locals.count())await page.waitForFunction(()=>[...document.querySelectorAll('#route-detail .photo-open img[src^="assets/photos/"]')].filter(i=>i.getClientRects().length>0).every(i=>i.complete&&i.naturalWidth>0));

      assert.equal(await page.locator('#map-container [data-poi="parking"]').count(), 1);
      const links = await page.locator('.navigation-actions a').evaluateAll(ns => ns.map(n => n.href));
      assert.ok(links.every(u => !/undefined|NaN/.test(u)), id);
      const a = new URL(links[2]), b = new URL(links[3]);
      assert.equal(a.searchParams.get('coordinate'), 'gaode'); assert.equal(a.searchParams.get('mode'), 'ride');
      assert.equal(b.searchParams.get('coord_type'), 'gcj02'); assert.equal(b.searchParams.get('mode'), 'riding');
      const r = { ...routeLookup[id], point: routeLookup[id].start.gcj, fee: routeLookup[id].parking.feeType };
      assert.ok(a.searchParams.get('to').startsWith(r.point.join(',')));
      if (['nanhu', 'jinhua', 'canal'].includes(r.region)) { assert.equal(new URL(links[0]).searchParams.get('city'), r.city); assert.equal(new URL(links[1]).searchParams.get('region'), r.city); }
      if (r.fee !== 'free') assert.ok(!(await page.locator('.parking-box').innerText()).includes('¥0'));
    }

    await select(page,'jinhua-city');
    await page.locator('#map-container').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-marker-jinhua-desktop.png'});
    await select(page,'qiandao-cafe');
    await page.locator('#route-detail .route-photos').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-photo-qiandao-desktop.png'});
    await page.locator('#route-detail .photo-open').first().click();
    assert.ok((await page.locator('#photo-dialog').innerText()).includes('赛事期间'));
    await page.keyboard.press('Escape');
    await select(page,'xianghu-shanshan');
    assert.ok(await page.locator('.photo-empty').isVisible());

    // Switching from a lower detail section must reveal the new route heading.
    const assertRouteTop = async p => {
      await p.waitForFunction(() => {
        const heading = document.querySelector('#selected-heading').getBoundingClientRect();
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return heading.top >= header.bottom && heading.top < header.bottom + 80;
      });
    };
    const switchFromSupply = async p => {
      await p.locator('[data-family="canal-streets"]').click();
      await assertRouteTop(p);
      await p.locator('.food-card').first().scrollIntoViewIfNeeded();
      assert.ok(await p.locator('#selected-heading').evaluate(e => e.getBoundingClientRect().top < 0));
      await p.locator('[data-family="wengjin-short"]').click();
      await assertRouteTop(p);
      await p.locator('[data-variant="wengjin-yanguan"]').click();
      await assertRouteTop(p);
      assert.equal(await p.locator('#selected-heading h2').innerText(), '翁金线 · 向盐官骑去');
    };
    await switchFromSupply(page);
    const beforeSave = await page.locator('#selected-heading').evaluate(e => e.getBoundingClientRect().top);
    await page.locator('[data-save="wengjin-yanguan"]').click();
    assert.ok(Math.abs(await page.locator('#selected-heading').evaluate(e => e.getBoundingClientRect().top) - beforeSave) < 16);
    await page.locator('[data-save="wengjin-yanguan"]').click();
    await page.selectOption('#city-filter', 'hangzhou');
    await page.selectOption('#parking-filter', 'night');
    assert.equal(await page.locator('#result-count').innerText(), '4 条主线 · 10 种里程方案');
    for (const id of ['westlake-nanshan-night','binjiang-wentao-night','binjiang-wentao-short-night','qianjiang-city-night']) {
      await select(page, id);
      assert.ok((await page.locator('.night-box').innerText()).includes('建议'));
      assert.equal(await page.locator('#map-container [data-poi="parking"]').count(), 1);
      assert.equal(await page.locator('#map-container [data-poi="start"]').count(), 1);
    }
    await page.selectOption('#city-filter', 'jiaxing');
    assert.deepEqual(await page.locator('#region-filter option').evaluateAll(ns => ns.map(n => n.value)), ['all', 'wengjin', 'nanhu']);
    await page.selectOption('#region-filter', 'nanhu'); assert.equal(await page.locator('.route-card').count(), 1);
    assert.equal(await page.locator('.variant-picker button').count(), 2); await page.locator('[data-variant="nanhu-short"]').click();
    await page.selectOption('#city-filter', 'jinhua'); assert.equal(await page.locator('#region-filter').inputValue(), 'all');
    await page.selectOption('#city-filter', 'all'); await page.selectOption('#parking-filter', 'unknown'); assert.equal(await page.locator('.route-card').count(), 6);
    await page.selectOption('#lane-filter', 'dedicated'); assert.ok(await page.locator('#route-view').isHidden());
    await page.locator('#clear-filters').click(); assert.equal(await page.locator('.route-card').count(), 20);
    await page.locator('#route-library').scrollIntoViewIfNeeded();
    assert.ok(await page.locator('#route-list').evaluate(el => el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY === 'auto'));
    await page.locator('.card-select').last().click();
    assert.ok(await page.locator('.route-card.selected').evaluate(el => { const c = el.getBoundingClientRect(), l = el.parentElement.getBoundingClientRect(); return c.top >= l.top - 2 && c.bottom <= l.bottom + 2; }));
    await page.locator('#route-list').focus(); await page.locator('#route-list').evaluate(el => { el.scrollTop = 0; });
    await page.keyboard.press('ArrowDown'); await page.waitForTimeout(200); assert.ok(await page.locator('#route-list').evaluate(el => el.scrollTop > 0));
    await select(page, 'meiling-south-road');
    assert.equal(await page.locator('#route-detail .photo-open').count(), 2);
    await page.locator('#route-detail .photo-open').first().click();
    assert.ok(await page.locator('#photo-dialog img').evaluate(i => i.complete && i.naturalWidth > 0));
    assert.ok((await page.locator('#photo-dialog').innerText()).includes('中午吃什么')); await page.keyboard.press('Escape');
    assert.ok(!await page.locator('#photo-dialog').evaluate(d => d.open));
    await page.locator('#route-detail .photo-open').nth(1).click(); await page.locator('.photo-close').click();
    await select(page, 'westlake-beishan-night'); assert.ok((await page.locator('.night-box').innerText()).includes('lit=yes'));
    await page.locator('#zoom-in').click(); assert.notEqual(await page.locator('#map-container svg').getAttribute('viewBox'), '0 0 1000 610');
    await page.locator('#reset-map').click(); assert.equal(await page.locator('#map-container svg').getAttribute('viewBox'), '0 0 1000 610');
    const downloading = page.waitForEvent('download'); await page.locator('#download-map').click(); const download = await downloading;
    assert.equal(await download.failure(), null); assert.ok(download.suggestedFilename().endsWith('.png'));
    assert.equal(await page.locator('#research-library').getAttribute('open'), null);
    assert.equal(await page.locator('#expansion-cards').isVisible(), false);
    assert.equal(await page.locator('#research-count').innerText(), '8');
    await page.locator('#research-library > summary').click();
    assert.equal(await page.locator('#expansion-cards').isVisible(), true);
    await page.selectOption('#research-region', 'huzhou');
    await page.locator('#research-library > summary').click();
    assert.equal(await page.locator('#expansion-cards').isVisible(), false);
    await page.locator('#research-library > summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#research-region').inputValue(), 'huzhou');
    for (const [region, count] of [['huzhou', 2], ['shaoxing', 2], ['hangzhou', 3]]) { await page.selectOption('#research-region', region); assert.equal(await page.locator('#expansion-cards .expansion-card').count(), count); }
    for(const id of ['badu-ginkgo-road','yigao-village-road']){
      await select(page,id);
      assert.ok((await page.locator('.parking-box').innerText()).includes(id.startsWith('badu')?'当前价格待入场确认':'默认免费'));
      assert.equal(await page.locator('.navigation-actions a').count(),4);
      assert.equal(await page.locator('#map-container [data-poi="parking"]').count(),1);
      assert.equal(await page.locator('#map-container [data-poi="start"]').count(),1);
      if(id==='badu-ginkgo-road'){
        assert.equal(await page.locator('#route-detail .photo-open').count(),2);
        await page.locator('#route-detail .route-photos').scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>Array.from(document.querySelectorAll('#route-detail .photo-open img')).every(i=>i.complete&&i.naturalWidth===1280));
        await page.screenshot({path:'/private/tmp/ride-badu-photos-desktop.png'});
        await page.locator('#route-detail .photo-open').first().click();
        assert.ok((await page.locator('#photo-dialog').innerText()).includes('朱高祥'));
        await page.keyboard.press('Escape');
      }
      await page.locator('#map-container').scrollIntoViewIfNeeded();
      await page.screenshot({path:'/private/tmp/ride-'+id+'-desktop.png'});
    }
    await page.selectOption('#research-region','huzhou');
    assert.equal(await page.locator('#expansion-cards .parking-option').count(),3);
    assert.equal(await page.locator('#expansion-cards [data-fee-basis="user-default-roadside"]').count(),2);
    const hzParkingLinks=await page.locator('#expansion-cards .parking-option a').evaluateAll(ns=>ns.map(n=>n.href));
    assert.equal(hzParkingLinks.length,9);
    assert.ok(hzParkingLinks.every(u=>!u.includes('undefined')&&!u.includes('NaN')));
    await page.locator('[data-research-id="huzhou-nanxun-research"] .research-parking').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-huzhou-parking-desktop.png'});
    await page.selectOption('#city-filter','shaoxing');
    await page.selectOption('#region-filter','eastlake');
    assert.equal(await page.locator('.route-card').count(),1);
    assert.equal(await page.locator('#selected-heading h2').innerText(),'东湖外围 · 湖山北路与敬宾路短线');
    assert.ok((await page.locator('#route-detail').innerText()).includes('不到东湖景区入口、不环湖'));
    assert.ok((await page.locator('.parking-box').innerText()).includes('路侧停车位默认免费'));
    assert.equal(await page.locator('#map-container [data-poi="start"]').count(),1);
    const eastNav=await page.locator('.navigation-actions a').evaluateAll(ns=>ns.map(n=>n.href));
    assert.ok(eastNav.some(u=>decodeURIComponent(u).includes('绍兴市')));
    assert.ok(eastNav.every(u=>!u.includes('undefined')&&!u.includes('NaN')));
    await page.locator('#map-container').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-eastlake-map-desktop.png'});
    await page.selectOption('#region-filter','all');await page.selectOption('#city-filter','all');
    await select(page,'shuanglong-road');
    assert.ok((await page.locator('.parking-box').innerText()).includes('路侧停车位默认免费'));
    assert.ok((await page.locator('#route-detail').innerText()).includes('累计爬升未独立'));
    assert.equal(await page.locator('#map-container [data-poi="parking"]').count(),1);
    assert.equal(await page.locator('#map-container [data-poi="start"]').count(),1);
    await page.locator('#map-container').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-shuanglong-map-desktop.png'});
    await select(page,'eastlake-outskirts');
    await page.locator('.route-extension-research>summary').click();
    assert.equal(await page.locator('#expansion-cards [data-research-id="shaoxing-eastlake-research"]').count(),0);
    const eastlake=page.locator('[data-research-id="shaoxing-eastlake-research"]');
    await page.locator('.route-extension-research .photo-open img').evaluateAll(async ns=>{for(const img of ns){img.loading='eager';await img.decode();}});
    assert.ok((await eastlake.innerText()).includes('4小时内10元'));
    await eastlake.locator('.research-evidence summary').first().click();
    assert.ok((await eastlake.innerText()).includes('242米'));
    await eastlake.scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-eastlake-research-desktop.png'});
    await page.selectOption('#research-region', 'shaoxing'); await page.locator('[data-research-id="shaoxing-didang-research"] .research-preview summary').click(); assert.ok(await page.locator('[data-research-id="shaoxing-didang-research"] .research-preview img').isVisible());
    await page.locator('[data-research-id="shaoxing-eastlake-research"] .photo-open').first().click(); assert.ok((await page.locator('#photo-dialog').innerText()).includes('Logan Wenger')); await page.locator('.photo-close').click();
    await page.selectOption('#research-region', 'hangzhou');
    await select(page,'puyang-greenway');
    assert.ok((await page.locator('.parking-box').innerText()).includes('费用及取车时间须入场确认'));
    assert.equal(await page.locator('#map-container [data-poi="parking"]').count(),1);
    assert.equal(await page.locator('#route-detail .photo-open').count(),1);
    const puyangLinks=await page.locator('.navigation-actions a').evaluateAll(ns=>ns.map(n=>n.href));
    assert.equal(puyangLinks.length,4);
    assert.ok(puyangLinks.every(u=>!u.includes('undefined')&&!u.includes('NaN')));
    await page.locator('#selected-heading').scrollIntoViewIfNeeded();
    await page.screenshot({path:'/private/tmp/ride-puyang-desktop.png'});
    assert.ok((await page.locator('.expansion-links a').evaluateAll(ns => ns.map(n => n.href))).every(u => !u.includes('/navigation?') && !u.includes('/direction?')));
    await select(page, 'nanhu-roads'); await page.locator('#selected-heading').scrollIntoViewIfNeeded(); await page.screenshot({ path: '/private/tmp/ride-desktop.png' });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }), mobile = await context.newPage(); watch(mobile);
    await mobile.goto(url + '#route=nanhu-roads'); await mobile.waitForSelector('.route-card'); assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await mobile.locator('[data-save="nanhu-roads"]').click(); await mobile.reload(); assert.equal(await mobile.locator('#saved-count').innerText(), '1');
    await select(mobile,'meiling-south-road'); await mobile.locator('#route-detail .photo-open').first().click(); assert.ok(await mobile.locator('#photo-dialog').evaluate(d => d.open));
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await mobile.locator('.photo-close').click();
    await mobile.locator('#selected-heading').scrollIntoViewIfNeeded(); await mobile.screenshot({ path: '/private/tmp/ride-mobile.png' });
    await select(mobile,'westlake-hills-loop');
    await mobile.locator('#selected-heading').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-unified-westlake-mobile.png'});
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await select(mobile,'shuanglong-road');
    await mobile.locator('#map-container').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-shuanglong-map-mobile.png'});
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await select(mobile,'eastlake-outskirts');
    await mobile.locator('#map-container').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-eastlake-map-mobile.png'});
    assert.ok((await mobile.locator('#route-detail').innerText()).includes('不环湖'));
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await mobile.locator('.route-extension-research>summary').click();
    assert.equal(await mobile.locator('#route-detail .parking-option').count(),2);
    await mobile.locator('#route-detail .route-extension-research .photo-open').first().click();
    assert.ok((await mobile.locator('#photo-dialog').innerText()).includes('Logan Wenger'));
    await mobile.locator('.photo-close').click();
    await mobile.locator('.route-extension-research').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-eastlake-merged-mobile.png'});
    await select(mobile,'jinhua-city');
    await mobile.locator('#map-container').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-marker-jinhua-mobile.png'});
    await mobile.locator('#map-container [data-poi="supply-0"]').focus();
    await mobile.keyboard.press('Enter');
    assert.ok(await mobile.locator('#poi-popup').isVisible());
    assert.ok(await mobile.evaluate(()=>document.querySelector('#poi-popup').getBoundingClientRect().top>=document.querySelector('#map-container').getBoundingClientRect().bottom));
    await mobile.locator('#close-poi').click();
    await select(mobile,'binjiang-wentao-night');
    await mobile.locator('#route-detail .route-photos').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-photo-binjiang-mobile.png'});
    await switchFromSupply(mobile);
    assert.equal(await mobile.locator('#expansion-cards').isVisible(), false);
    await mobile.locator('#research-library > summary').click();
    assert.equal(await mobile.locator('#expansion-cards').isVisible(), true);
    await mobile.selectOption('#research-region', 'shaoxing'); assert.equal(await mobile.locator('#expansion-cards .expansion-card').count(), 2);
    await mobile.selectOption('#research-region', 'hangzhou'); assert.equal(await mobile.locator('#expansion-cards .expansion-card').count(), 3);
    await select(mobile,'puyang-greenway');
    await mobile.locator('#selected-heading').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-puyang-mobile.png'});
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    for(const id of ['badu-ginkgo-road','yigao-village-road']){
      await select(mobile,id);
      await mobile.locator('#map-container').scrollIntoViewIfNeeded();
      await mobile.screenshot({path:'/private/tmp/ride-'+id+'-mobile.png'});
      if(id==='badu-ginkgo-road'){
        await mobile.locator('#route-detail .route-photos').scrollIntoViewIfNeeded();
        await mobile.waitForFunction(()=>Array.from(document.querySelectorAll('#route-detail .photo-open img')).every(i=>i.complete&&i.naturalWidth===1280));
        await mobile.locator('#route-detail .photo-open img').evaluateAll(async ns=>Promise.all(ns.map(i=>i.decode())));
        await mobile.screenshot({path:'/private/tmp/ride-badu-photos-mobile.png'});
      }

      assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await mobile.selectOption('#research-region','huzhou');
    assert.equal(await mobile.locator('#expansion-cards .parking-option').count(),3);
    await mobile.locator('[data-research-id="huzhou-lijiaxiang-research"] .research-parking').scrollIntoViewIfNeeded();
    await mobile.screenshot({path:'/private/tmp/ride-huzhou-parking-mobile.png'});
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.deepEqual(errors, []); console.log(JSON.stringify({ routes: ids.length, desktop: 1440, mobile: 390, errors }));
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
