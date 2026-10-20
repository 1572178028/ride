"""Build Puyang road plan and its parking connector from the saved OSM snapshot."""
import json, runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
h=runpy.run_path(str(ROOT/'scripts/build-verified-maps.py'))
d=h['snapshot']('puyangjiang')
c,g,turns,roads,water=h['network'](d)
anchors=[[120.2482145,30.0385209],[120.2409335,30.0382399],[120.2105597,30.0568696],[120.1896101,30.0733146]]
points,segments,actual=h['route_path'](c,g,turns,anchors)
# A complete directed return path prevents reversing one-way streets.
back,back_segments,_=h['route_path'](c,g,turns,list(reversed(actual)))
connector,connector_segments,_=h['route_path'](c,g,turns,actual[:2])
points+=back[1:];segments+=back_segments
plan={'distance':round(sum(s['km'] for s in segments),1),'cyclewayKm':round(sum(s['km'] for s in segments if s['kind']=='cycleway'),2),'anchors':actual,'segments':segments,'wayIds':list(dict.fromkeys(s['way'] for s in segments)),'checked':'2026-10-20','coordinateSystem':'WGS84','snapshot':'puyangjiang','geometrySource':d['source']['url'],'connectorKm':round(sum(s['km'] for s in connector_segments),3),'parkingPoiGcj':[120.252843,30.036164]}
id='puyang-greenway'
out='Object.assign(MAP_DATA.paths,'+json.dumps({id:points},separators=(',',':'))+');\n'
out+='Object.assign(REGIONAL_PLANS,'+json.dumps({id:plan},ensure_ascii=False,separators=(',',':'))+');\n'
(ROOT/'puyang-map-data.js').write_text(out)
print(plan['distance'],'km; connector',plan['connectorKm'],'km; cycleway',plan['cyclewayKm'],'km;',len(points),'nodes')
