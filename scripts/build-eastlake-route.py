"""Build the verified southern outskirts ride; never bridge the G104 data gap."""
from lib.geometry import update_geometry
import json, runpy
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
data = h['snapshot']('eastlake-connection')
c, g, turns, roads, water = h['network'](data)
# Do not send this route through the metro works at Renmin East/Jingbin,
# the G104 main road, service yards or unconfirmed pedestrian paths.
allowed = {475429839, 117171989, 1029952587, 488807319}
g = {n: [(v, e) for v, e in es if e['way'] in allowed] for n, es in g.items()}
g = {n: es for n, es in g.items() if es}
parking = h['regional'].wgs([120.639789, 29.995421])
anchors = [parking, [120.6337598,29.9988155], [120.6341371,30.0036195],
           [120.6337598,29.9988155], [120.6396891,29.9961933], parking]
points, segments, actual = h['route_path'](c,g,turns,anchors)
plan = {'distance':round(sum(e['km'] for e in segments),1), 'cyclewayKm':0,
        'anchors':actual, 'segments':segments, 'wayIds':list(dict.fromkeys(e['way'] for e in segments)),
        'checked':'2026-10-21','coordinateSystem':'WGS84','snapshot':'eastlake-connection',
        'geometrySource':data['source']['url'], 'parkingSnapMetres':round(h['regional'].km(parking,points[0])*1000,1),
        'parkingPoint':parking,'scope':'湖山北路—敬宾路南侧外围；不接景区入口，不使用G104或人民东路施工口'}
bounds=[min(p[i] for p in points)-.005 for i in (0,1)]+[max(p[i] for p in points)+.005 for i in (0,1)]
inside=lambda p:bounds[0]<=p[0]<=bounds[2] and bounds[1]<=p[1]<=bounds[3]
background={'roads':[r for r in roads if any(inside(p) for p in r['points'])], 'water':[w for w in water if any(inside(p) for p in w)],'waterAreas':h['regional'].water_areas('eastlake',bounds)}
update_geometry(ROOT, maps={'eastlake': background}, paths={'eastlake-outskirts': points}, plans={'eastlake-outskirts': plan})
print('eastlake-outskirts',plan['distance'],'km',len(points),'nodes',plan['parkingSnapMetres'],'m parking/node difference')
