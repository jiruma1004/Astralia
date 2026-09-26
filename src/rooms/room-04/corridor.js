/* Obstáculos amables: sin daño ni reinicios. Siempre queda sitio para rodearlos. */
window.RelaxCorridor=class {
 constructor(onEvent){this.onEvent=onEvent;this.time=0;this.slow=0;this.cooldown=0;this.readyShown=false;
  this.obstacles=[{x:10,y:4.5,width:1.4,height:.22},{x:18,y:2.5,width:1.2,height:.22},{x:24,y:5.7,width:1.3,height:.22}];
  this.symbols=[{x:7,y:3.2,text:'E = mc²'},{x:13,y:5.6,text:'∑ F = ma'},{x:16,y:3.5,text:'π'},{x:21,y:4.5,text:'∫'},{x:26,y:2.7,text:'Δv / Δt'}].map((s,i)=>({...s,phase:i*1.2}));this.art=new Map();
 }
 active(s){return (this.time+s.phase)%7<5;}
 blocks(x,y,height){return height<.25&&this.obstacles.some(o=>Math.abs(x-o.x)<.32&&Math.abs(y-o.y)<o.width/2+.18);}
 tick(dt,player){this.time+=dt;this.slow=Math.max(0,this.slow-dt);this.cooldown=Math.max(0,this.cooldown-dt);
  if(this.cooldown===0&&player.jumpHeight<.25&&this.symbols.some(s=>this.active(s)&&Math.hypot(player.x-s.x,player.y-s.y)<.55)){this.slow=.45;this.cooldown=2;this.onEvent('bump','¡Una idea se cruzó! Rodéala o salta; aquí no pierdes vidas.');}
  if(!this.readyShown&&Math.hypot(player.x-29,player.y-4.5)<2.4){this.readyShown=true;this.onEvent('ready');}
 }
 texture(obj,crate){const key=crate?'crate':obj.text;if(this.art.has(key))return this.art.get(key);const a=document.createElement('canvas');a.width=512;a.height=256;const c=a.getContext('2d');
  if(crate){c.fillStyle='#735338';c.fillRect(0,0,512,256);for(let i=0;i<8;i++){c.fillStyle=i%2?'#917046':'#7f603e';c.fillRect(i*64+3,5,57,246);}c.strokeStyle='#c2a371';c.lineWidth=14;c.strokeRect(8,8,496,240);c.beginPath();c.moveTo(15,240);c.lineTo(497,15);c.stroke();}
  else{c.fillStyle='#163c42dc';c.strokeStyle='#a3ebcc';c.lineWidth=5;c.beginPath();c.roundRect(14,36,484,190,35);c.fill();c.stroke();c.fillStyle='#d0ffe3';c.textAlign='center';c.font='bold 58px Georgia';c.fillText(obj.text,256,153);}
  this.art.set(key,a);return a;
 }
 draw(renderer,player,actors){const objs=[...this.obstacles.map(o=>({...o,crate:true})),...this.symbols.filter(s=>this.active(s))];objs.sort((a,b)=>Math.hypot(b.x-player.x,b.y-player.y)-Math.hypot(a.x-player.x,a.y-player.y));
  for(const o of objs){const p=actors.project(renderer,player,o.x,o.y,0);if(!p)continue;const art=this.texture(o,o.crate),width=p.scale*(o.width||1.1),height=p.scale*(o.crate?.22:.40),left=p.x-width/2,top=p.y-height-(o.crate?0:.07+Math.sin(this.time*2+o.phase)*.025)*p.scale,c=renderer.ctx;
   for(let x=Math.max(0,Math.floor(left/3)*3);x<Math.min(renderer.canvas.width,left+width);x+=3){if(p.depth>(renderer.depths[x]??Infinity)+.04)continue;const u=Math.max(0,(x-left)/width);c.drawImage(art,u*512,0,Math.min(512-u*512,3/width*512),256,x,top,3,height);}
  }
 }
};
window.makeOakDoor=function(){
 const a=document.createElement('canvas');a.width=a.height=512;const c=a.getContext('2d');c.fillStyle='#38291d';c.fillRect(0,0,512,512);
 for(let i=0;i<8;i++){const x=16+i*60;c.fillStyle=['#886031','#966b38','#795029'][i%3];c.fillRect(x,12,57,488);for(let j=0;j<12;j++){c.strokeStyle=j%2?'#b48a4a77':'#49301d88';c.lineWidth=1+j%2;c.beginPath();c.moveTo(x+4+j*4,14);c.bezierCurveTo(x+17+j*3,140,x+j*4,330,x+5+j*4,498);c.stroke();}}
 c.strokeStyle='#c19b63';c.lineWidth=12;c.strokeRect(8,8,496,496);
 for(const y of [99,370]){c.fillStyle='#262c30';c.fillRect(17,y,478,25);c.fillStyle='#b0a17f';for(const x of [35,110,210,302,402,478]){c.beginPath();c.arc(x,y+12,4,0,Math.PI*2);c.fill();}}
 c.strokeStyle='#d0ac62';c.lineWidth=9;c.beginPath();c.arc(405,257,23,0,Math.PI*2);c.stroke();c.fillStyle='#25231c';c.fillRect(399,289,12,20);
 return a;
};
