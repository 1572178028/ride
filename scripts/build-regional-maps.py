from lib.geometry import update_geometry
import json,math,heapq,collections,gzip
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def km(a,b):
 x=(b[0]-a[0])*math.cos(math.radians((a[1]+b[1])/2));y=b[1]-a[1];return math.hypot(x,y)*111.195

def load(region):
 d=json.load(gzip.open(ROOT / 'research' / (region+'-osm.json.gz'),'rt'));coords={};graph=collections.defaultdict(list);roads=[];water=[]
 for e in d['elements']:
  t=e.get('tags',{});geo=e.get('geometry',[])
  if t.get('natural')=='water' and geo:water.append([[p['lon'],p['lat']] for p in geo])
  if e['type']!='way' or not t.get('highway') or not geo:continue
  pts=[[p['lon'],p['lat']] for p in geo];roads.append({'id':e['id'],'name':t.get('name',''),'kind':t['highway'],'points':[[round(p[0],5),round(p[1],5)] for p in pts]})
  if t['highway'] in ['motorway','motorway_link','trunk','trunk_link','construction','steps','proposed'] or t.get('bicycle') in ['no','private'] or t.get('access') in ['no','private']:continue
  if t['highway'] in ['footway','pedestrian','path'] and t.get('bicycle') not in ['yes','designated']:continue
  if t.get('service') in ['parking_aisle','driveway'] and t.get('access')=='customers':continue
  nodes=e.get('nodes',[])
  for node,pt in zip(nodes,pts):coords[node]=pt
  oneway=t.get('oneway:bicycle',t.get('oneway','no'));factor=.8 if t['highway']=='cycleway' else 1
  for a,b in zip(nodes,nodes[1:]):
   dist=km(coords[a],coords[b]);meta={'way':e['id'],'kind':t['highway'],'name':t.get('name',''),'shared':t.get('foot') in ['yes','designated']}
   if oneway!='-1':graph[a].append((b,dist*factor,dist,meta))
   if oneway not in ['yes','1','true']:graph[b].append((a,dist*factor,dist,meta))
 return coords,graph,roads,water,d

def nearest(coords,pt):return min(coords,key=lambda n:km(coords[n],pt))
def path(coords,graph,pts):
 ids=[nearest(coords,p) for p in pts];result=[];metas=[]
 for start,end in zip(ids,ids[1:]):
  queue=[(0,start)];cost={start:0};prev={}
  while queue:
   c,n=heapq.heappop(queue)
   if c!=cost[n]:continue
   if n==end:break
   for to,weight,dist,meta in graph[n]:
    nc=c+weight
    if nc<cost.get(to,math.inf):cost[to]=nc;prev[to]=(n,meta,dist);heapq.heappush(queue,(nc,to))
  if end not in cost:raise ValueError(('no path',coords[start],coords[end]))
  chain=[end];seg=[]
  while chain[-1]!=start:
   old,meta,dist=prev[chain[-1]];chain.append(old);seg.append({**meta,'km':dist})
  result.extend(list(reversed(chain)) if not result else list(reversed(chain))[1:]);metas.extend(reversed(seg))
 return [coords[n] for n in result],metas,[coords[n] for n in ids]
def joined_rings(members, role):
 parts=[[[p['lon'],p['lat']] for p in m.get('geometry',[]) if p] for m in members if m.get('type')=='way' and m.get('role','outer')==role]
 parts=[p for p in parts if len(p)>1];rings=[]
 while parts:
  chain=parts.pop()
  while chain[0]!=chain[-1]:
   match=next((i for i,p in enumerate(parts) if p[0]==chain[-1] or p[-1]==chain[-1]),None)
   if match is None:break
   other=parts.pop(match)
   if other[-1]==chain[-1]:other.reverse()
   chain.extend(other[1:])
  if chain[0]==chain[-1]:rings.append(chain)
 return rings

def clipped_ring(points, bounds):
 result=points[:-1] if points[0]==points[-1] else points[:]
 for axis,limit,side in [(0,bounds[0],1),(0,bounds[2],-1),(1,bounds[1],1),(1,bounds[3],-1)]:
  output=[]
  if not result:break
  previous=result[-1]
  for current in result:
   previous_in=(previous[axis]-limit)*side>=0;current_in=(current[axis]-limit)*side>=0
   if previous_in!=current_in:
    f=(limit-previous[axis])/(current[axis]-previous[axis]);output.append([previous[j]+f*(current[j]-previous[j]) for j in [0,1]])
   if current_in:output.append(current)
   previous=current
  result=output
 return [[round(p[0],6),round(p[1],6)] for p in result] if len(result)>2 else []

def water_areas(region,bounds):
 file=ROOT/'research'/(region+'-water.json.gz')
 if not file.exists():return []
 data=json.load(gzip.open(file,'rt'));areas=[]
 for element in data['elements']:
  if element['type']!='relation':continue
  rings=joined_rings(element.get('members',[]),'outer')+joined_rings(element.get('members',[]),'inner')
  rings=[clipped_ring(r,bounds) for r in rings];rings=[r for r in rings if r]
  if rings:areas.append({'source':element['id'],'rings':rings})
 return areas

def gcj(point):
 lng,lat=point;x=lng-105;y=lat-35;pi=math.pi
 a=-100+2*x+3*y+.2*y*y+.1*x*y+.2*math.sqrt(abs(x))
 b=300+x+2*y+.1*x*x+.1*x*y+.1*math.sqrt(abs(x))
 wave=(20*math.sin(6*x*pi)+20*math.sin(2*x*pi))*2/3
 a+=wave+(20*math.sin(y*pi)+40*math.sin(y/3*pi))*2/3+(160*math.sin(y/12*pi)+320*math.sin(y/30*pi))*2/3
 b+=wave+(20*math.sin(x*pi)+40*math.sin(x/3*pi))*2/3+(150*math.sin(x/12*pi)+300*math.sin(x/30*pi))*2/3
 r=lat*pi/180;m=1-.00669342162296594323*math.sin(r)**2;s=math.sqrt(m)
 return [lng+b*180/(6378245/s*math.cos(r)*pi),lat+a*180/(6378245*(1-.00669342162296594323)/(m*s)*pi)]

def wgs(point):
 v=point[:]
 for _ in range(6):
  converted=gcj(v);v=[v[i]+point[i]-converted[i] for i in [0,1]]
 return v

if __name__=='__main__':
 # Target coordinates are planning anchors. Each is snapped to a connected,
 # bicycle-permitted OSM way; no line between anchors becomes a road segment.
 specs={
  'qiandao-cafe':('qiandao',[[119.04305,29.6356],[119.03675,29.61814],[119.04305,29.6356]],'loop'),
  'qiandao-peninsula':('qiandao',[[119.04305,29.6356],[119.03675,29.61814],[119.01258,29.60148],[119.03675,29.61814],[119.04305,29.6356]],'loop'),
  'tonglu-riverside':('tonglu',[wgs([119.687311,29.789464]),[119.68583,29.80698],[119.69515,29.81282],wgs([119.687311,29.789464])],'loop'),
  'qiantang-seawall':('qiantangpark',[[120.6878,30.289],[120.682,30.309],[120.683,30.325]],'return'),
  'westlake-research':('westlake',[[120.147,30.258],[120.153,30.24],[120.125,30.245],[120.128,30.255],[120.147,30.258]],'loop')
 }
 maps={};paths={};plans={}
 for name,(region,anchors,shape) in specs.items():
  c,gr,roads,water,_=load(region)
  points,segments,stops=path(c,gr,anchors)
  distance=sum(s['km'] for s in segments)*(2 if shape=='return' else 1)
  ways=list(dict.fromkeys(s['way'] for s in segments))
  cycle=sum(s['km'] for s in segments if s['kind']=='cycleway')*(2 if shape=='return' else 1)
  # Keep only local context to avoid oversized reservoir polygons and remote ways.
  bounds=[min(p[i] for p in points)-.018 for i in [0,1]]+[max(p[i] for p in points)+.018 for i in [0,1]]
  within=lambda p:bounds[0]<=p[0]<=bounds[2] and bounds[1]<=p[1]<=bounds[3]
  maps[region]={'roads':[r for r in roads if any(within(p) for p in r['points'])],'water':[w for w in water if any(within(p) for p in w)],'waterAreas':water_areas(region,[bounds[0]-.08,bounds[1]-.08,bounds[2]+.08,bounds[3]+.08])}
  paths[name]=points
  # Segment-level metadata is retained for validation and lane overlays.
  plans[name]={'distance':round(distance,1),'anchors':stops,'wayIds':ways,'cyclewayKm':round(cycle,2),'segments':segments,'checked':'2026-10-15','coordinateSystem':'WGS84'}
  print(name,round(distance,1),'km',len(points),'points',round(cycle,2),'km mapped cycleway')
 update_geometry(ROOT, maps=maps, paths=paths, plans=plans)
