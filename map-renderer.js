(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.makeMapSVG=function(route,options={}){
 const W=1000,H=610,path=MAP_DATA.paths[route.id],data=MAP_DATA.maps[route.region];
 const supply=(route.supply||route.food).filter(f=>!options.supplyKind||options.supplyKind==='all'||f.kind===options.supplyKind);
 const all=[...path,...(route.supply||route.food).map(f=>f.point),...route.stops.map(s=>s.point),...(route.parking?[route.parking.point]:[])];
 let xmin=Math.min(...all.map(p=>p[0])),xmax=Math.max(...all.map(p=>p[0])),ymin=Math.min(...all.map(p=>p[1])),ymax=Math.max(...all.map(p=>p[1]));
 const lonFactor=Math.cos(((ymin+ymax)/2)*Math.PI/180),dx=(xmax-xmin)*lonFactor,dy=ymax-ymin;
 let scale=Math.min((W-190)/Math.max(dx,.001),(H-170)/Math.max(dy,.001)),cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
 const project=p=>[W/2+(p[0]-cx)*lonFactor*scale,H/2-(p[1]-cy)*scale];
 const poly=pts=>pts.map(p=>{const [x,y]=project(p);return x.toFixed(1)+','+y.toFixed(1)}).join(' ');
 const within=p=>{const [x,y]=project(p);return x>=-150&&x<=W+150&&y>=-150&&y<=H+150};
 const roadVisible=r=>r.points.some(within);
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(route.title)}路线地图" style="font-family:'Noto Sans CJK SC','PingFang SC','Microsoft YaHei',sans-serif"><title>${esc(route.title)} · ${route.distance} km</title><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#a7b89a" stroke-width=".5" opacity=".19"/></pattern><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1b4939" flood-opacity=".16"/></filter></defs><rect width="1000" height="610" fill="#edf2e8"/><rect width="1000" height="610" fill="url(#grid)"/>`;
 for(const area of data.waterAreas||[]){const d=area.rings.map(r=>'M'+r.map(p=>project(p).map(n=>n.toFixed(1)).join(',')).join('L')+'Z').join('');svg+=`<path data-water-area="${area.source}" d="${d}" fill="#bed9d2" stroke="#a8cbc2" stroke-width=".7" fill-rule="evenodd"/>`;}
 for(const points of data.water){if(points.some(within))svg+=`<polygon points="${poly(points)}" fill="#bed9d2" stroke="#a8cbc2" stroke-width=".7"/>`;}
 const roads=data.roads.filter(roadVisible);
 for(const r of roads){
  const major=['motorway','trunk','primary','secondary','tertiary'].includes(r.kind),shared=['footway','path','cycleway','pedestrian'].includes(r.kind);
  svg+=`<polyline points="${poly(r.points)}" fill="none" stroke="${major?'#fffdf5':shared?'#c3d1b8':'#d6dfcc'}" stroke-width="${major?4:shared?1.3:2}" stroke-linecap="round" stroke-linejoin="round"/>`;
 }
 const labelBoxes=[{x:25,y:15,w:540,h:58}];
 function label(x,y,text,opts={}){
  let width=text.length*(opts.size||13)+18,tx=x+14,ty=y-13;
  if(opts.left||tx+width>W-18)tx=x-width-14;
  ty=Math.max(30,Math.min(H-40,ty));tx=Math.max(14,Math.min(W-width-14,tx));
  for(let k=0;k<24;k++){
   if(!labelBoxes.some(b=>tx<b.x+b.w&&tx+width>b.x&&ty-20<b.y+b.h&&ty+8>b.y))break;
   ty+=29;if(ty>H-32){ty=75+(k*31)%(H-160);}
  }
  labelBoxes.push({x:tx,y:ty-20,w:width,h:30});
  const lx=Math.max(tx,Math.min(tx+width,x)),ly=Math.max(ty-20,Math.min(ty+9,y));
  const leader=Math.hypot(lx-x,ly-y)>15?`<path d="M${x} ${y}L${lx} ${ly}" fill="none" stroke="${opts.color||'#8a9c82'}" stroke-opacity=".55" stroke-width=".8"/>`:'';
  return leader+`<rect x="${tx}" y="${ty-20}" width="${width}" height="29" rx="5" fill="${opts.fill||'#fffef8'}" fill-opacity=".94" stroke="#d5decf" stroke-width=".7"/><text x="${tx+9}" y="${ty}" fill="${opts.color||'#44633e'}" font-size="${opts.size||13}" font-weight="500">${esc(text)}</text>`;
 }
 const roadNames=new Set();let named=0;
 for(const r of roads){if(!r.name||roadNames.has(r.name)||named>12||r.points.length<4||r.name.includes('绿道')||r.name.length>7||['footway','path'].includes(r.kind))continue;const mid=r.points[Math.floor(r.points.length/2)];const [x,y]=project(mid);if(x<70||x>W-90||y<60||y>H-80)continue;roadNames.add(r.name);named++;svg+=`<text x="${x}" y="${y}" fill="#a5b298" font-size="10" text-anchor="middle" style="paint-order:stroke" stroke="#edf2e8" stroke-width="3">${esc(r.name)}</text>`;}
 svg+=`<polyline points="${poly(path)}" fill="none" stroke="#fffdf6" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${poly(path)}" fill="none" stroke="#d7653e" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
 // Overlay only actual mapped cycleway segments, keeping the full route visible.
 const plan=typeof REGIONAL_PLANS!=='undefined'&&REGIONAL_PLANS[route.id];
 if(plan)plan.segments.forEach((seg,i)=>{if(seg.kind==='cycleway')svg+=`<polyline data-cycleway="true" points="${poly(path.slice(i,i+2))}" fill="none" stroke="#237b65" stroke-width="5.5" stroke-linecap="round"/>`;});
 // Direction arrows make loop and return geometries readable without a map App.
 for(let i=Math.max(1,Math.floor(path.length/6));i<path.length;i+=Math.max(1,Math.floor(path.length/5))){const a=project(path[i-1]),b=project(path[i]),angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;svg+=`<path d="M-4 -4L2 0L-4 4" transform="translate(${b[0]} ${b[1]}) rotate(${angle})" fill="none" stroke="#fffdf6" stroke-width="2"/>`;}
 const water=route.mapWater||{name:route.region==='xianghu'?'湘湖':'钱塘江',point:route.region==='xianghu'?[120.209,30.135]:[120.486,30.384]};
 const waterPosition=project(water.point);
 svg+=`<text x="${waterPosition[0]}" y="${waterPosition[1]}" fill="#73a599" font-size="25" font-weight="400" letter-spacing="8" text-anchor="middle">${esc(water.name)}</text>`;
 const near=(a,b)=>Math.hypot((a[0]-b[0])*lonFactor,a[1]-b[1])*111.2<.08;
 const stopPositions=[];
 route.stops.slice(1).forEach((s,i)=>{
  // A rest marker already names this location; avoid stacking duplicate pins/labels.
  if(near(s.point,path[0])||stopPositions.some(p=>near(p,s.point))||(route.parking&&near(s.point,route.parking.point))||supply.some(f=>f.kind==='歇脚'&&near(s.point,f.point)))return;
  stopPositions.push(s.point);
  const [x,y]=project(s.point);
  svg+=`<g data-poi="stop-${i+1}" tabindex="0" role="button" aria-label="${esc(s.name)}"><circle cx="${x}" cy="${y}" r="9" fill="#fffef7" stroke="#2e6143" stroke-width="2.5"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#275938" font-size="10" font-weight="600">${i+2}</text>${label(x,y,s.name)}</g>`;
 });
 const pinPositions=[];
 supply.forEach(f=>{
  const i=(route.supply||route.food).indexOf(f),[anchorX,anchorY]=project(f.point),short=(i+1)+'. '+(f.mapLabel||f.name);
  let x=anchorX,y=anchorY;
  for(let attempt=0;attempt<24&&pinPositions.some(p=>Math.hypot(p[0]-x,p[1]-y)<26);attempt++){const angle=attempt*2.4,radius=28+attempt*4;x=anchorX+Math.cos(angle)*radius;y=anchorY+Math.sin(angle)*radius;}
  pinPositions.push([x,y]);
  if(x!==anchorX||y!==anchorY)svg+=`<path d="M${anchorX} ${anchorY}L${x} ${y}" stroke="#8a9c82" stroke-width="1" stroke-dasharray="3 2"/><circle cx="${anchorX}" cy="${anchorY}" r="2" fill="#8a9c82"/>`;
  const rest=f.kind==='歇脚',color=rest?'#648987':'#b8854d',symbol=rest?'R':f.kind==='咖啡'?'C':'F';
  svg+=`<g data-poi="supply-${i}" tabindex="0" role="button" aria-label="${esc(f.name)}"><circle cx="${x}" cy="${y}" r="9" fill="${color}" stroke="#fffdf9" stroke-width="2.5"/><text x="${x}" y="${y+3}" font-size="9" text-anchor="middle" fill="white" pointer-events="none">${symbol}</text>${label(x,y,short,{color:rest?'#4d7371':'#997342',size:12,left:true})}</g>`;
 });
 const [sx,sy]=project(path[0]);
 let [px,py]=project(route.parking?route.parking.point:path[0]);
 if(route.parking){
 if(!near(path[0],route.parking.point)&&Math.hypot(px-sx,py-sy)<40){svg+=`<path d="M${px} ${py}L${px-27} ${py+24}" stroke="#8a9c82" stroke-width="1" stroke-dasharray="3 2"/>`;px-=27;py+=24;}
 svg+=`<g data-poi="parking" tabindex="0" role="button" aria-label="${esc(route.parking.name)}免费停车与骑行起点"><rect x="${px-14}" y="${py-14}" width="28" height="28" rx="7" fill="#1b4939" stroke="#fffef8" stroke-width="3" filter="url(#shadow)"/><text x="${px}" y="${py+6}" font-size="18" font-weight="600" fill="#fffaf0" text-anchor="middle" pointer-events="none">P</text>${label(px,py,route.parking.mapLabel||(route.region==='xianghu'?'老虎洞 · 停车 / 起点':'奥莱 · 停车 / 起点'),{fill:'#f6faef',color:'#274f32',size:13})}</g>`;
 }
 svg+=`<g transform="translate(950 26)"><path d="M0 25L8 0L16 25L8 18Z" fill="#5c7950"/><text x="8" y="-5" fill="#5c7950" text-anchor="middle" font-size="10">N</text></g>`;
 if(!route.parking||!near(path[0],route.parking.point))svg+=`<g data-poi="start" tabindex="0" role="button" aria-label="道路骑行起点"><circle cx="${sx}" cy="${sy}" r="10" fill="#d7653e" stroke="#fffdf6" stroke-width="3"/><text x="${sx}" y="${sy+4}" text-anchor="middle" fill="white" font-size="11">S</text>${label(sx,sy,route.research?'研究起点 · 停车待查':'道路骑行起点')}</g>`;
 const kmWidth=scale/111.2,scaleKm=kmWidth>250?.5:kmWidth>70?1:2,barWidth=kmWidth*scaleKm;
 svg+=`<g transform="translate(35 555)"><path d="M0 -6V0H${barWidth}V-6" fill="none" stroke="#6d835f" stroke-width="2"/><text y="17" font-size="10" fill="#6d835f">${scaleKm} km</text></g><text x="965" y="576" text-anchor="end" font-size="9" fill="#819477">© OpenStreetMap contributors · ODbL</text>`;
 if(options.export)svg+=`<rect x="25" y="20" width="550" height="49" rx="6" fill="#fffdf6" fill-opacity=".96"/><text x="40" y="42" fill="#1b4939" font-size="16" font-weight="600">骑遇 · ${esc(route.title)}</text><text x="40" y="59" fill="#6c8262" font-size="10">${route.distance} km ${route.shape} · ${esc(route.parking?route.parking.rule:'研究图 · 免费停车未确认，不计入路线库')}</text>`;
 if(options.export)svg+=`<rect x="0" y="584" width="1000" height="26" fill="#fffdf6" fill-opacity=".96"/><text x="25" y="601" fill="#6c8262" font-size="10">P 停车片区 / S 道路起点 / C 咖啡 / F 餐厅 / R 休息 · 绿线为路网骑行道，部分行人共用；片区点非精确入口</text>`;
 return svg+'</svg>';
};
})();
