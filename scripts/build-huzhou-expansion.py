"""Build Huzhou public-road rides from dated OSM API snapshots (WGS84)."""
from lib.geometry import update_geometry
import json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
h=runpy.run_path(str(ROOT/'scripts/build-verified-maps.py'))
specs=[('badu-ginkgo-road','badu-expansion',[[119.7981727,31.0219635],[119.7996493,31.0242022],[119.7764773,31.0139025],[119.7996493,31.0242022],[119.7981727,31.0219635]]),('yigao-village-road','lougang-expansion',[[120.2853228,30.9292976],[120.3125021,30.9339041],[120.2853228,30.9292976]])]
paths={};plans={};maps={}
for id,snapshot,anchors in specs:
 d=h['snapshot'](snapshot);c,g,turns,roads,water=h['network'](d)
 points,segments,actual=h['route_path'](c,g,turns,anchors)
 connector,cs,_=h['route_path'](c,g,turns,actual[:2])
 if id=='yigao-village-road':
  # The first public-road start is beside the roadside bays; no off-road connector invented.
  cs=[]
 paths[id]=points
 plans[id]={'distance':round(sum(s['km'] for s in segments),1),'cyclewayKm':round(sum(s['km'] for s in segments if s['kind']=='cycleway'),2),'anchors':actual,'segments':segments,'wayIds':list(dict.fromkeys(s['way'] for s in segments)),'checked':'2026-10-20','coordinateSystem':'WGS84','snapshot':snapshot,'geometrySource':d['source']['url'],'connectorKm':round(sum(s['km'] for s in cs),3)}
 bounds=[min(p[i] for p in points)-.006 for i in (0,1)]+[max(p[i] for p in points)+.006 for i in (0,1)]
 inside=lambda p:bounds[0]<=p[0]<=bounds[2] and bounds[1]<=p[1]<=bounds[3]
 maps['badu' if id.startswith('badu') else 'yigao']={'roads':[r for r in roads if any(inside(p) for p in r['points'])],'water':[w for w in water if any(inside(p) for p in w)],'waterAreas':[]}
 # Preserve actual OSM multipolygon shoreline; never close incomplete fragments.
 for e in d['elements']:
  if e['type']=='relation' and e.get('tags',{}).get('natural')=='water':
   rings=h['regional'].joined_rings(e.get('members',[]),'outer')+h['regional'].joined_rings(e.get('members',[]),'inner')
   rings=[h['regional'].clipped_ring(r,bounds) for r in rings];rings=[r for r in rings if r]
   if rings:maps['badu' if id.startswith('badu') else 'yigao']['waterAreas'].append({'source':e['id'],'rings':rings})
 print(id,plans[id]['distance'],'km',len(points),'nodes')
update_geometry(ROOT, maps=maps, paths=paths, plans=plans)
