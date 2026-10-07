/* Primer umbral: la respuesta se elige aterrizando, no mediante un formulario. */
window.APPROACH_QUESTIONS=[
 {text:'La rapidez es una magnitud vectorial.',answer:false,hint:'Distingue cuánto se mueve un objeto de hacia dónde se mueve.'},
 {text:'En el vacío, dos cuerpos de distinta masa caen con la misma aceleración.',answer:true,hint:'Piensa en qué cambia cuando desaparece la resistencia del aire.'},
 {text:'Si la fuerza neta es cero, un cuerpo necesariamente está en reposo.',answer:false,hint:'Recuerda qué puede conservarse cuando no hay aceleración.'},
 {text:'La pendiente de una gráfica de velocidad contra tiempo representa la aceleración.',answer:true,hint:'Observa las unidades de los dos ejes.'},
 {text:'En un tiro parabólico ideal, la aceleración horizontal es cero.',answer:true,hint:'Piensa hacia dónde actúa la gravedad.'}
];
window.ApproachTrial=class {
 constructor(room,onEvent){this.room=room;this.onEvent=onEvent;this.stage=0;this.broken=null;this.finished=false;this.art=new Map();}
 get question(){return APPROACH_QUESTIONS[Math.min(this.stage,4)];}
 platforms(){return this.tiles??=APPROACH_QUESTIONS.flatMap((q,stage)=>[true,false].map((answer,lane)=>({stage,answer,x:5+stage*2.3,y:lane?4.05:2.25,w:1.5,h:1.4,key:stage+':'+answer})));}
 platformAt(x,y){return this.platforms().find(p=>x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h);}
 supports(x,y){if(x<4.2||x>=16.7)return true;const p=this.platformAt(x,y);return !!p&&p.key!==this.broken;}
 land(player){if(this.finished||player.jumpHeight>0)return;const p=this.platformAt(player.x,player.y);if(!p||p.stage<this.stage)return;
  if(p.stage!==this.stage||p.answer!==this.question.answer){this.broken=p.key;this.onEvent('fall');return;}
  this.stage++;this.finished=this.stage===5;this.onEvent('safe',{x:p.x+.75,y:p.y+.7,angle:0});
 }
 restore(){this.broken=null;}
 background(r,player,time){
  const c=r.ctx,w=r.canvas.width,h=r.canvas.height,horizon=h*(.5+(player.pitch||0));
  const sky=c.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#28394f');sky.addColorStop(.7,'#889293');sky.addColorStop(1,'#dab889');c.fillStyle=sky;c.fillRect(0,0,w,horizon);
  for(let band=0;band<3;band++){c.fillStyle=['#708474','#627658','#536344'][band];c.beginPath();c.moveTo(0,horizon+70);for(let x=0;x<=w+8;x+=8){const a=player.angle+(x/w-.5)*1.32;c.lineTo(x,horizon-15-band*3-Math.sin(a*3+band)*18-Math.sin(a*7+band)*7);}c.lineTo(w,horizon+70);c.fill();}
  // El bosque cierra el horizonte frontal; los laterales quedan abiertos a la llanura.
  for(let i=0;i<75;i++){const y=-19+i*.62,p=r.actors.project(r,player,24+Math.sin(i)*2,y,0);if(!p)continue;
   const tall=1.7+(Math.sin(i*13)*.5+.5)*1.1;c.fillStyle=i%2?'#253e30':'#304b36';c.beginPath();c.moveTo(p.x-p.scale*.45,p.y);c.lineTo(p.x,p.y-p.scale*tall);c.lineTo(p.x+p.scale*.45,p.y);c.fill();}
 }
 color(x,y){
  const noise=Math.sin(Math.floor(x*20)*13+Math.floor(y*20)*37),p=this.platformAt(x,y);
  if(p&&p.key!==this.broken){
   const u=x-p.x,v=y-p.y,board=Math.floor(u/.25),seam=u% .25<.028;
   if(seam)return '#251a15';
   if((v<.10||v>p.h-.10)&&u%.25>.10&&u%.25<.14)return '#322c28';
   const grain=Math.sin(y*83+board*7)*Math.sin(y*17+board);
   return grain>.68?'#392a20':grain<-.6?'#a48459':board%2?'#795738':'#896643';
  }
  const rim=Math.pow(Math.abs((x-10.45)/6.6),8)+Math.pow(Math.abs((y-3.85)/5.5),4);
  if(x>=4.2&&x<16.7&&rim<1.1){const band=Math.floor(rim*9);return noise>.8?'#706150':rim>.86?'#a1855e':rim>.6?(band%2?'#76624d':'#8b7357'):rim>.3?(band%2?'#574b40':'#665746'):'#3b342f';}
  if(y<1.7||y>6.1)return noise>.25?'#6d784b':noise<-.4?'#52653d':'#627044';
  return noise>.3?'#9c815b':noise<-.4?'#806546':'#8b7250';
 }

 draw(r,player,actors){this.drawLights(r,player,actors);for(const p of [...this.platforms()].reverse()){if(p.key===this.broken||p.stage!==Math.min(this.stage,4))continue;const pos=actors.project(r,player,p.x+.75,p.y+.7,.13);if(!pos)continue;
   const c=r.ctx,label=I18n.t(p.answer?'VERDADERO':'FALSO');c.save();c.textAlign='center';c.font='bold '+Math.max(10,Math.min(34,pos.scale*.14))+'px Trebuchet MS';c.strokeStyle='#071321';c.lineWidth=4;c.strokeText(label,pos.x,pos.y);c.fillStyle='#ffedb9';c.fillText(label,pos.x,pos.y);c.restore();}
 }
 drawLights(r,player,actors){
  const c=r.ctx,segment=(a,b,color,width)=>{const p=actors.project(r,player,...a),q=actors.project(r,player,...b);if(!p||!q)return;c.strokeStyle=color;c.lineWidth=Math.max(1,Math.min(8,p.scale*width));c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();};
  for(const x of [3.5,17.5])for(const y of [1.65,6.05]){
   segment([x,y,0],[x,y,1.1],'#37312b',.05);segment([x,y,.86],[x,y-.23,.99],'#9a7c45',.035);segment([x,y,.86],[x,y+.23,.99],'#9a7c45',.035);
   for(const dy of [-.23,0,.23]){const p=actors.project(r,player,x,y+dy,1.05);if(!p)continue;const glow=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.scale*.32);glow.addColorStop(0,'#ffcb6866');glow.addColorStop(1,'#ffcb6800');c.fillStyle=glow;c.fillRect(p.x-p.scale*.32,p.y-p.scale*.32,p.scale*.64,p.scale*.64);c.fillStyle='#ffe1a0';c.fillRect(p.x-p.scale*.025,p.y-p.scale*.11,p.scale*.05,p.scale*.13);}
  }
  // Broken rope and timber edges do not block the jumps.
  for(const p of this.platforms()){if(p.key===this.broken)continue;for(const y of [p.y,p.y+p.h]){segment([p.x,y,0],[p.x+p.w,y,0],'#bd9a67',.025);segment([p.x,y,0],[p.x,y,.22],'#493223',.035);}}
 }

};
const approach={id:'room-00',label:'I',name:'El sendero de las decisiones',trial:true,color:[76,88,65],
 environment:{kind:'plain',label:'El puente viejo del cráter'},spawn:{x:2.5,y:3.85,angle:0},exitX:18.5,
 challenge:{id:'challenge-00',title:'Cinco saltos de verdadero o falso',implemented:true},canUnlock:()=>false,
 map:Array.from({length:8},(_,y)=>Array.from({length:21},(_,x)=>x===0||x===20||y===0||y===7?1:0))};
window.ESCAPE_ROOMS.push(approach);
window.ADVENTURE_ORDER=[approach,...ESCAPE_ROOMS.filter(r=>r!==approach&&!r.optional)];
ADVENTURE_ORDER.forEach((r,i)=>r.label=['I','II','III','IV','V','VI','VII'][i]);
window.StoryRoute={choice:'wave',chosen:false,reset(){this.choice='wave';this.chosen=false;},choose(choice){this.choice=choice;this.chosen=true;}};
