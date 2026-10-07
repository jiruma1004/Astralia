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
 color(x,y){if(x<4.2||x>=16.7){const n=Math.sin(Math.floor(x*9)*13+Math.floor(y*9)*37);return n>.3?'#86694a':n<-.4?'#604e38':'#746047';}
  const p=this.platformAt(x,y);if(!p||p.key===this.broken)return '#030715';
  const edge=x-p.x<.07||p.x+p.w-x<.07||y-p.y<.07||p.y+p.h-y<.07;
  return edge?'#e2cd9a':p.stage<this.stage&&p.answer===APPROACH_QUESTIONS[p.stage].answer?'#537963':'#5b626e';
 }
 draw(r,player,actors){for(const p of [...this.platforms()].reverse()){if(p.key===this.broken||p.stage!==Math.min(this.stage,4))continue;const pos=actors.project(r,player,p.x+.75,p.y+.7,.13);if(!pos)continue;
   const c=r.ctx,label=I18n.t(p.answer?'VERDADERO':'FALSO');c.save();c.textAlign='center';c.font='bold '+Math.max(10,Math.min(34,pos.scale*.14))+'px Trebuchet MS';c.strokeStyle='#071321';c.lineWidth=4;c.strokeText(label,pos.x,pos.y);c.fillStyle='#ffedb9';c.fillText(label,pos.x,pos.y);c.restore();}
 }
};
const approach={id:'room-00',label:'I',name:'El sendero de las decisiones',trial:true,color:[76,88,65],
 environment:{kind:'forest',label:'El camino al castillo'},spawn:{x:2.5,y:3.85,angle:0},exitX:18.5,
 challenge:{id:'challenge-00',title:'Cinco saltos de verdadero o falso',implemented:true},canUnlock:()=>false,
 map:Array.from({length:8},(_,y)=>Array.from({length:21},(_,x)=>x===0||x===20||y===0||y===7?1:0))};
window.ESCAPE_ROOMS.push(approach);
window.ADVENTURE_ORDER=[approach,...ESCAPE_ROOMS.filter(r=>r!==approach&&!r.optional)];
ADVENTURE_ORDER.forEach((r,i)=>r.label=['I','II','III','IV','V','VI','VII'][i]);
window.StoryRoute={choice:'wave',chosen:false,reset(){this.choice='wave';this.chosen=false;},choose(choice){this.choice=choice;this.chosen=true;}};
