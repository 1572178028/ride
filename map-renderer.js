(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.makeMapSVG=function(route,options={}){
 const W=1000,H=610,path=MAP_DATA.paths[route.id],data=MAP_DATA.maps[route.region];
 const markerScale=options.markerScale||1;
 const markerTransform=(x,y)=>markerScale===1?'':` transform="translate(${x} ${y}) scale(${markerScale}) translate(${-x} ${-y})"`;
 const supply=(route.supply||route.food).filter(f=>!options.supplyKind||options.supplyKind==='all'||f.kind===options.supplyKind);
 const all=[...path,...(route.supply||route.food).map(f=>f.point),...route.stops.map(s=>s.point),...(route.parking?[route.parking.point]:[])];
 let xmin=Math.min(...all.map(p=>p[0])),xmax=Math.max(...all.map(p=>p[0])),ymin=Math.min(...all.map(p=>p[1])),ymax=Math.max(...all.map(p=>p[1]));
 const lonFactor=Math.cos(((ymin+ymax)/2)*Math.PI/180),dx=(xmax-xmin)*lonFactor,dy=ymax-ymin;
 let scale=Math.min((W-190)/Math.max(dx,.001),(H-170)/Math.max(dy,.001)),cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
 const project=p=>[W/2+(p[0]-cx)*lonFactor*scale,H/2-(p[1]-cy)*scale];
 const poly=pts=>pts.map(p=>{const [x,y]=project(p);return x.toFixed(1)+','+y.toFixed(1)}).join(' ');
 const within=p=>{const [x,y]=project(p);return x>=-150&&x<=W+150&&y>=-150&&y<=H+150};
 const roadVisible=r=>r.points.some(within);
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(route.title)}路线地图" style="font-family:'Noto Sans CJK SC','PingFang SC','Microsoft YaHei',sans-serif"><title>${esc(route.title)} · ${route.distance} km</title><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#a9b7c8" stroke-width=".5" opacity=".19"/></pattern><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#172b4d" flood-opacity=".16"/></filter></defs><rect width="1000" height="610" fill="#eef1f5"/><rect width="1000" height="610" fill="url(#grid)"/>`;
 for(const area of data.waterAreas||[]){const d=area.rings.map(r=>'M'+r.map(p=>project(p).map(n=>n.toFixed(1)).join(',')).join('L')+'Z').join('');svg+=`<path data-water-area="${area.source}" d="${d}" fill="#b9ddec" stroke="#99c7dc" stroke-width=".7" fill-rule="evenodd"/>`;}
 for(const points of data.water){if(points.some(within))svg+=`<polygon points="${poly(points)}" fill="#b9ddec" stroke="#99c7dc" stroke-width=".7"/>`;}
 const roads=data.roads.filter(roadVisible);
 for(const r of roads){
  const major=['motorway','trunk','primary','secondary','tertiary'].includes(r.kind),shared=['footway','path','cycleway','pedestrian'].includes(r.kind);
  svg+=`<polyline points="${poly(r.points)}" fill="none" stroke="${major?'#ffffff':shared?'#c2ceda':'#d7dfe8'}" stroke-width="${major?4:shared?1.3:2}" stroke-linecap="round" stroke-linejoin="round"/>`;
 }
 const roadNames=new Set();let named=0;
 for(const r of roads){if(!r.name||roadNames.has(r.name)||named>12||r.points.length<4||r.name.includes('绿道')||r.name.length>7||['footway','path'].includes(r.kind))continue;const mid=r.points[Math.floor(r.points.length/2)];const [x,y]=project(mid);if(x<70||x>W-90||y<60||y>H-80)continue;roadNames.add(r.name);named++;svg+=`<text x="${x}" y="${y}" fill="#708096" font-size="10" text-anchor="middle" style="paint-order:stroke" stroke="#eef1f5" stroke-width="3">${esc(r.name)}</text>`;}
 svg+=`<polyline points="${poly(path)}" fill="none" stroke="#ffffff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${poly(path)}" fill="none" stroke="#cc4c22" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
 // Overlay only actual mapped cycleway segments, keeping the full route visible.
 const plan=typeof REGIONAL_PLANS!=='undefined'&&REGIONAL_PLANS[route.id];
 if(plan)plan.segments.forEach((seg,i)=>{if(seg.kind==='cycleway')svg+=`<polyline data-cycleway="true" points="${poly(path.slice(i,i+2))}" fill="none" stroke="#0d7c66" stroke-width="5.5" stroke-linecap="round"/>`;});
 // Direction arrows make loop and return geometries readable without a map App.
 for(let i=Math.max(1,Math.floor(path.length/6));i<path.length;i+=Math.max(1,Math.floor(path.length/5))){const a=project(path[i-1]),b=project(path[i]),angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;svg+=`<path d="M-4 -4L2 0L-4 4" transform="translate(${b[0]} ${b[1]}) rotate(${angle})" fill="none" stroke="#ffffff" stroke-width="2"/>`;}
 const water=route.mapWater||{name:route.region==='xianghu'?'湘湖':'钱塘江',point:route.region==='xianghu'?[120.209,30.135]:[120.486,30.384]};
 for(const item of route.mapWaters||[water]){
  const waterPosition=project(item.point);
  svg+=`<text x="${waterPosition[0]}" y="${waterPosition[1]}" fill="#467f9a" font-size="25" font-weight="400" letter-spacing="8" text-anchor="middle">${esc(item.name)}</text>`;
 }
 const near=(a,b)=>Math.hypot((a[0]-b[0])*lonFactor,a[1]-b[1])*111.2<.08;
 const [sx,sy]=project(path[0]);
 const startSeparated=route.separateStart||!route.parking||Math.hypot((path[0][0]-route.parking.point[0])*lonFactor,path[0][1]-route.parking.point[1])*111.2>=.008;
 const [originalPX,originalPY]=project(route.parking?route.parking.point:path[0]);
 let px=originalPX,py=originalPY;
 if(route.parking&&startSeparated&&Math.hypot(px-sx,py-sy)<40*markerScale){
  px+=(markerScale>1&&px<W/2?27:-27)*markerScale;
  py+=(markerScale>1&&py>H/2?-24:24)*markerScale;
  px=Math.max(18*markerScale,Math.min(W-18*markerScale,px));
  py=Math.max(18*markerScale,Math.min(H-18*markerScale,py));
 }
 const stopPositions=[];
 route.stops.slice(1).forEach((s,i)=>{
  // A rest marker already names this location; avoid stacking duplicate pins/labels.
  if(near(s.point,path[0])||stopPositions.some(p=>near(p,s.point))||(route.parking&&near(s.point,route.parking.point))||supply.some(f=>f.kind==='歇脚'&&near(s.point,f.point)))return;
  stopPositions.push(s.point);
  const [x,y]=project(s.point);
  svg+=`<g data-poi="stop-${i+1}"${markerTransform(x,y)} tabindex="0" role="button" aria-label="${esc(s.name)}"><circle cx="${x}" cy="${y}" r="9" fill="#ffffff" stroke="#385777" stroke-width="2.5"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#29445f" font-size="10" font-weight="600">${i+2}</text></g>`;
 });
 const pinPositions=[project(path[0]),...stopPositions.map(project)];
 if(route.parking)pinPositions.push([originalPX,originalPY],[px,py]);
 supply.forEach(f=>{
  const i=(route.supply||route.food).indexOf(f),[anchorX,anchorY]=project(f.point),short=String(i+1);
  let x=anchorX,y=anchorY;
  for(let attempt=0;attempt<24&&pinPositions.some(p=>Math.hypot(p[0]-x,p[1]-y)<26*markerScale);attempt++){const angle=attempt*2.4,radius=(28+attempt*4)*markerScale;x=Math.max(20*markerScale,Math.min(W-20*markerScale,anchorX+Math.cos(angle)*radius));y=Math.max(20*markerScale,Math.min(H-20*markerScale,anchorY+Math.sin(angle)*radius));}
  pinPositions.push([x,y]);
  if(x!==anchorX||y!==anchorY)svg+=`<path d="M${anchorX} ${anchorY}L${x} ${y}" stroke="#667d97" stroke-width="1" stroke-dasharray="3 2"/><circle cx="${anchorX}" cy="${anchorY}" r="2" fill="#667d97"/>`;
  const rest=f.kind==='歇脚',color=rest?'#116797':['咖啡','茶饮'].includes(f.kind)?'#6636b6':'#b23b32',symbol=rest?'R':f.kind==='咖啡'?'C':f.kind==='茶饮'?'T':'F';
  svg+=`<g data-poi="supply-${i}"${markerTransform(x,y)} tabindex="0" role="button" aria-label="${symbol}${short} · ${esc(f.name)}"><title>${esc(f.name)}</title><circle r="20" cx="${x}" cy="${y}" fill="transparent"/><circle cx="${x}" cy="${y}" r="12" fill="${color}" stroke="#ffffff" stroke-width="2.5"/><text x="${x}" y="${y+3}" font-size="9" text-anchor="middle" fill="white" pointer-events="none">${symbol}${short}</text></g>`;
 });
 if(route.parking){
 if(px!==originalPX||py!==originalPY)svg+=`<path d="M${originalPX} ${originalPY}L${px} ${py}" stroke="#667d97" stroke-width="1" stroke-dasharray="3 2"/>`;
 svg+=`<g data-poi="parking"${markerTransform(px,py)} tabindex="0" role="button" aria-label="${esc(route.parking.name)}停车与骑行起点"><rect x="${px-14}" y="${py-14}" width="28" height="28" rx="7" fill="#172b4d" stroke="#ffffff" stroke-width="3" filter="url(#shadow)"/><text x="${px}" y="${py+6}" font-size="18" font-weight="600" fill="#ffffff" text-anchor="middle" pointer-events="none">P</text></g>`;
 }
 svg+=`<g transform="translate(950 26)"><path d="M0 25L8 0L16 25L8 18Z" fill="#405773"/><text x="8" y="-5" fill="#405773" text-anchor="middle" font-size="10">N</text></g>`;
 if(startSeparated)svg+=`<g data-poi="start"${markerTransform(sx,sy)} tabindex="0" role="button" aria-label="道路骑行起点"><circle cx="${sx}" cy="${sy}" r="20" fill="transparent"/><circle cx="${sx}" cy="${sy}" r="10" fill="#cc4c22" stroke="#ffffff" stroke-width="3"/><text x="${sx}" y="${sy+4}" text-anchor="middle" fill="white" font-size="11">S</text></g>`;
 const kmWidth=scale/111.2,scaleKm=kmWidth>250?.5:kmWidth>70?1:2,barWidth=kmWidth*scaleKm;
 svg+=`<g transform="translate(35 555)"><path d="M0 -6V0H${barWidth}V-6" fill="none" stroke="#52657e" stroke-width="2"/><text y="17" font-size="10" fill="#52657e">${scaleKm} km</text></g><text x="965" y="576" text-anchor="end" font-size="9" fill="#52657e">© OpenStreetMap contributors · ODbL</text>`;
 if(options.export)svg+=`<rect x="25" y="20" width="550" height="49" rx="6" fill="#ffffff" fill-opacity=".96"/><text x="40" y="42" fill="#172b4d" font-size="16" font-weight="600">骑遇 · ${esc(route.title)}</text><text x="40" y="59" fill="#52657e" font-size="10">${route.distance} km ${route.shape} · ${esc(route.parking?route.parking.rule:route.id==='westlake-research'?'历史研究图 · 未计入当前路线统计':'研究图 · 停车与接驳未确认，不计入路线库')}</text>`;
 if(options.export)svg+=`<rect x="0" y="584" width="1000" height="26" fill="#ffffff" fill-opacity=".96"/><text x="25" y="601" fill="#52657e" font-size="10">P 停车 / S 起点 / 数字 途经点 / C 咖啡 / T 茶饮 / F 餐厅 / R 休息 · 编号对应地点列表；绿线可能行人共用</text>`;
 return svg+'</svg>';
};
})();
