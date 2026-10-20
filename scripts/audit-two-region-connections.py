"""Recheck graph connectivity; these are research results, not published rides."""
import json, runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
h=runpy.run_path(str(ROOT/'scripts/build-verified-maps.py'))
# GCJ-02 map destination points were read through Amap's visible route UI.
# Iterative inverse of the project's GCJ converter gives these WGS84 points.
specs=[('shuanglong','jinhua-shuanglong',[119.6220365028964,29.167465878495083],[119.6203696,29.2042945]),('eastlake','shaoxing-eastlake',[120.62529509667534,30.00460579425363],[120.634,30.006])]
results={}
for name,snapshot,p,end in specs:
 d=h['snapshot'](snapshot);c,g,t,roads,water=h['network'](d)
 near=min(g,key=lambda k:h['regional'].km(c[k],p))
 report={'parkingWgs':p,'roadStart':c[near],'snapMetres':round(h['regional'].km(c[near],p)*1000)}
 try:
  pts,segs,anchors=h['route_path'](c,g,t,[p,end])
  report.update(outboundKm=round(sum(s['km'] for s in segs),2),roads=list(dict.fromkeys(s.get('name','') for s in segs)),ways=list(dict.fromkeys(s['way'] for s in segs)),nodes=len(pts))
 except ValueError as e:report['error']=str(e)
 results[name]=report
out={'checked':'2026-10-20','snapshotDate':'2026-10-16','note':'既有公开路网可构图性检查；吸附不证明停车出口接驳或现场准入。','results':results}
(ROOT/'research/shuanglong-eastlake-geometry-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
