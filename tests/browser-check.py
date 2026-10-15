"""Local browser integration check; requires Playwright and Chromium."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from urllib.parse import urlparse, parse_qs
import json, shutil
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1050},device_scale_factor=1)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
    page.goto(url)
    page.wait_for_selector('.route-card')
    assert page.locator('.route-card').count()==11
    assert page.locator('#total-plans').inner_text()=='16'
    assert page.locator('#total-parking').inner_text()=='08'
    ids=page.evaluate('ROUTES.map(r=>r.id)')
    for route in ids:
        page.evaluate('(id)=>location.hash="route="+id',route)
        page.wait_for_function('(id)=>document.querySelector("#selected-heading h2").textContent===ROUTES.find(r=>r.id===id).title',arg=route)
        assert page.locator('#map-container svg').count()==1
        assert page.locator('#map-container [data-poi="parking"]').count()==1
        hrefs=page.locator('#route-detail a').evaluate_all('(links)=>links.map(a=>a.href)')
        assert all('undefined' not in u and 'NaN' not in u for u in hrefs),route
        for provider in ['uri.amap.com/navigation','api.map.baidu.com/direction']:
            assert any(provider in h for h in hrefs),route
    page.select_option('#region-filter','qiandao')
    assert page.locator('.route-card').count()==1
    assert page.locator('.variant-picker button').count()==2
    page.locator('[data-variant="qiandao-peninsula"]').click()
    assert page.locator('[data-cycleway]').count()>0
    page.locator('[data-supply-kind="咖啡"]').click()
    assert page.locator('#supply-content .food-card').count()==2
    page.locator('[data-locate]').first.click()
    assert not page.locator('#poi-popup').is_hidden()
    page.locator('#selected-heading').scroll_into_view_if_needed()
    page.screenshot(path='/tmp/ride-desktop.png',full_page=False)
    page.locator('#lane-filter').select_option('cycleway')
    assert page.locator('.variant-picker button').count()==1
    page.locator('#region-filter').select_option('tonglu')
    assert page.locator('.route-card').count()==1
    page.select_option('#lane-filter','all')
    page.select_option('#region-filter','qiantangpark')
    assert page.locator('.route-card').count()==1
    assert '萧围东线海塘' in page.locator('.lane-box').inner_text()
    page.select_option('#region-filter','all')
    page.select_option('#lane-filter','dedicated')
    assert page.locator('.empty').count()==1
    assert page.locator('#route-view').is_hidden()
    page.locator('#clear-filters').click()
    assert page.locator('.route-card').count()==11
    page.locator('.research-preview summary').click()
    assert page.locator('.research-preview img').is_visible()
    # Huzhou research is visible but excluded from published ride counts/navigation.
    page.select_option('#research-region','huzhou')
    assert page.locator('.expansion-card').count()==6
    assert '6 个待核查方向' in page.locator('#research-summary').inner_text()
    assert page.locator('.research-preview').count()==1
    page.locator('.research-evidence summary').first.click()
    assert '风车打卡点的配套泊位' in page.locator('.research-evidence').first.inner_text()
    hrefs=page.locator('.expansion-links a').evaluate_all('(links)=>links.map(a=>a.href)')
    assert all('navigation?' not in href and '/direction?' not in href for href in hrefs)
    assert all(parse_qs(urlparse(href).query)['city' if 'amap' in href else 'region']==['湖州市'] for href in hrefs)
    assert page.locator('#total-plans').inner_text()=='16'
    page.select_option('#research-region','all')
    assert page.locator('.expansion-card').count()==6
    page.select_option('#parking-filter','paid')
    assert page.locator('.route-card').count()==4
    assert '收费停车' in page.locator('.parking-box').inner_text()
    page.select_option('#parking-filter','free')
    assert page.locator('.route-card').count()==7
    page.select_option('#parking-filter','all')
    # Isolated mobile context checks overflow, selection and persisted favorites.
    mobile=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
    mp=mobile.new_page();mp.on('pageerror',lambda e:errors.append(str(e)))
    mp.goto(url+'#route=qiandao-peninsula');mp.wait_for_selector('#map-container svg')
    assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth'),mp.evaluate('document.documentElement.scrollWidth')
    mp.locator('[data-save="qiandao-peninsula"]').click()
    mp.reload();mp.wait_for_selector('.route-card')
    assert mp.locator('#saved-count').inner_text()=='1'
    mp.locator('#selected-heading').scroll_into_view_if_needed()
    mp.screenshot(path='/tmp/ride-mobile.png',full_page=False)
    mp.select_option('#research-region','huzhou')
    mp.locator('.research-evidence summary').first.click()
    assert mp.locator('.expansion-card').count()==6
    assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth')
    mp.locator('#next-regions').scroll_into_view_if_needed()
    mp.screenshot(path='/tmp/ride-huzhou-mobile.png',full_page=False)
    assert not errors,errors
    print(json.dumps({'routes':len(ids),'families':11,'regions':8,'browser_errors':errors,'desktop_screenshot':'/tmp/ride-desktop.png','mobile_screenshot':'/tmp/ride-mobile.png'}))
    browser.close()
server.shutdown()
