"""Build public-road Shuanglong ride and a partial East Lake research preview."""
import json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];h=runpy.run_path(str(ROOT/'scripts/build-verified-maps.py'))
paths={};plans={};maps={}
specs=[('shuanglong-road','shuanglong','shuanglong-connection',[[119.6220365028964,29.167465878495083],[119.6186647,29.2043198],[119.6220365028964,29.167465878495083]]),('eastlake-connection-research','eastlake-connection','eastlake-connection',[[120.63869,29.9956],[120.6337598,29.9988155],[120.6341,30.0033],[120.6337598,29.9988155],[120.63869,29.9956]])]
for id,region,snapshot,anchors in specs:
 d=h['snapshot'](snapshot);c,g,turns,roads,water=h['network'](d)
 # End before the West Gate stairway; no service yards, pedestrian paths or steps.
 if region=='shuanglong':
  g={n:[(v,e) for v,e in es if e['kind'] not in ('service','path','footway','pedestrian')] for n,es in g.items()};g={n:es for n,es in g.items() if es}
 points,segments,actual=h['route_path'](c,g,turns,anchors)
 paths[id]=points;plans[id]={'distance':round(sum(e['km'] for e in segments),1),'cyclewayKm':round(sum(e['km'] for e in segments if e['kind']=='cycleway'),2),'anchors':actual,'segments':segments,'wayIds':list(dict.fromkeys(e['way'] for e in segments)),'checked':'2026-10-21','coordinateSystem':'WGS84','snapshot':snapshot,'geometrySource':d['source']['url'],'parkingSnapMetres':10 if region=='shuanglong' else None,'elevationStatus':'累计爬升未核，不采用导航时间作为爬坡用时'}
 bounds=[min(p[i] for p in points)-.006 for i in (0,1)]+[max(p[i] for p in points)+.006 for i in (0,1)]
 inside=lambda p:bounds[0]<=p[0]<=bounds[2] and bounds[1]<=p[1]<=bounds[3]
 maps[region]={'roads':[r for r in roads if any(inside(p) for p in r['points'])],'water':[w for w in water if any(inside(p) for p in w)],'waterAreas':[]}
 print(id,plans[id]['distance'],len(points),'anchors',actual)
(ROOT/'shuanglong-map-data.js').write_text('Object.assign(MAP_DATA.maps,'+json.dumps(maps,separators=(',',':'))+');\nObject.assign(MAP_DATA.paths,'+json.dumps(paths,separators=(',',':'))+');\nObject.assign(REGIONAL_PLANS,'+json.dumps(plans,ensure_ascii=False,separators=(',',':'))+');\n')
