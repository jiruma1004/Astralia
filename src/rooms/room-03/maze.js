/* Puertas físicas y persecución sobre la misma cuadrícula que las colisiones. */
window.CONCEPT_QUESTIONS=[
 {title:'El carro encantado',text:'Un carro se mueve en línea recta con velocidad constante sobre un suelo horizontal. ¿Cuál es la fuerza neta sobre él?',answers:['Hacia delante','Es cero','Hacia atrás'],correct:1,hint:'Piensa qué mide la aceleración. Una velocidad constante no implica que no existan fuerzas.',explanation:'Velocidad constante significa aceleración cero: la suma de fuerzas es cero.'},
 {title:'Un instante en lo alto',text:'Lanzas una pelota verticalmente hacia arriba. Sin resistencia del aire, ¿qué aceleración tiene justo en su punto más alto?',answers:['Cero','g hacia arriba','g hacia abajo','Depende de su masa'],correct:2,hint:'Distingue velocidad de aceleración. ¿La gravedad desaparece cuando la pelota se detiene un instante?',explanation:'En la cima la velocidad es cero, pero la aceleración sigue siendo g hacia abajo.'},
 {title:'Dos esferas, un vacío',text:'Dejas caer dos esferas de masas distintas, desde la misma altura y al mismo tiempo, en el vacío. ¿Cuál llega primero al suelo?',answers:['La más pesada','La más ligera','Llegan juntas'],correct:2,hint:'Relaciona el peso mg con F = ma. ¿Qué pasa con la masa al despejar la aceleración?',explanation:'Sin aire, ambas tienen la misma aceleración g y llegan juntas.'},
 {title:'El giro del centinela',text:'Una esfera gira en una circunferencia con rapidez constante. ¿Hacia dónde apunta su aceleración?',answers:['Hacia fuera','Es cero','Tangente al círculo','Hacia el centro'],correct:3,hint:'La rapidez no cambia, pero la dirección de la velocidad sí. Imagina la diferencia entre dos vectores velocidad cercanos.',explanation:'El cambio de dirección requiere aceleración centrípeta, dirigida hacia el centro.'}
];
window.ConceptMaze=class {
 constructor(room,onEvent){this.room=room;this.onEvent=onEvent;this.reset();}
 reset(){
  this.stage=0;this.passed=new Set();this.finished=false;this.chasing=false;this.caught=false;this.bite=0;this.path=[];this.pathClock=0;this.doors=[];this.openDoors=new Set();
  this.enemy={x:1.5,y:8.5};
  // Cada galería tiene una franja de cuartos detrás de las puertas. Solo uno conecta con la siguiente.
  this.room.map=Array.from({length:17},()=>Array(51).fill(1));
  CONCEPT_QUESTIONS.forEach((q,stage)=>{
   const base=stage*12;
   for(let y=1;y<=15;y++)for(let x=base+1;x<=base+7;x++)this.room.map[y][x]=0;
   for(const y of [1,2,3,13,14,15])this.room.map[y][base+4]=1;
   const rows=q.answers.length===3?[3,8,13]:[2,6,10,14];
   q.answers.forEach((text,choice)=>{
    const door={x:base+8,y:rows[choice],stage,choice,text,letter:'ABCD'[choice],correct:choice===q.correct};this.doors.push(door);this.room.map[door.y][door.x]=2;
    for(let y=door.y-1;y<=door.y+1;y++)for(let x=base+9;x<=base+11;x++)this.room.map[y][x]=0;
    if(door.correct){this.room.map[door.y][base+12]=0;if(stage===3)this.room.map[door.y][49]=0;}
   });
  });
 }
 doorAt(x,y){return this.doors.find(d=>d.x===x&&d.y===y);}
 choose(door){
  if(!door||door.stage!==this.stage||this.finished||this.caught||this.openDoors.has(door.stage+':'+door.choice))return null;
  this.room.map[door.y][door.x]=0;this.openDoors.add(door.stage+':'+door.choice);
  if(door.correct){this.passed.add(this.stage);this.onEvent('correct','La puerta se abre. Explora el pasaje y cruza hasta la siguiente galería.');return true;}
  if(!this.chasing&&this.stage>=1){this.chasing=true;this.enemy={x:this.stage*12+1.5,y:8.5};this.path=[];this.pathClock=0;}
  this.onEvent('wrong','La puerta conduce a un cuarto sin salida. '+CONCEPT_QUESTIONS[this.stage].explanation+(this.chasing?' ¡Ivan se acerca! Retrocede y busca otra puerta.':' Retrocede y elige otra puerta.'));
  return false;
 }
 checkpointPosition(stage=this.stage){if(stage===0)return {...this.room.spawn};const previous=this.doors.find(d=>d.stage===stage-1&&d.correct);return {x:stage*12+1.5,y:previous.y+.5,angle:0};}
 restoreCheckpoint(stage){this.reset();this.stage=Math.max(0,Math.min(3,stage));for(const door of this.doors)if(door.stage<this.stage&&door.correct){this.room.map[door.y][door.x]=0;this.passed.add(door.stage);this.openDoors.add(door.stage+':'+door.choice);}return this.checkpointPosition();}
 routeTo(player){
  const start=[Math.floor(this.enemy.x),Math.floor(this.enemy.y)],goal=[Math.floor(player.x),Math.floor(player.y)],key=(x,y)=>x+','+y,queue=[start],parents=new Map([[key(...start),null]]);
  for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===goal[0]&&y===goal[1])break;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(this.room.map[ny]?.[nx]===0&&!parents.has(k)){parents.set(k,[x,y]);queue.push([nx,ny]);}}}
  if(!parents.has(key(...goal)))return [];
  const path=[];let cell=goal;while(cell){path.unshift({x:cell[0]+.5,y:cell[1]+.5});cell=parents.get(key(...cell));}
  // Recentrar antes de doblar evita cortar las esquinas de los muros.
  if(path.length===1)return [{x:player.x,y:player.y}];
  return path.slice(1);
 }
 tick(dt,player){
  this.bite=Math.max(0,this.bite-dt);
  if(this.passed.has(this.stage)&&player.x>(this.stage+1)*12+1){this.stage++;if(this.stage===CONCEPT_QUESTIONS.length){this.finished=true;this.onEvent('complete','¡Superaste el laberinto!');return;}this.onEvent('advance','Punto seguro guardado. Nueva galería: lee la pregunta y elige una puerta.');}
  if(!this.chasing||this.finished||this.caught)return;
  this.pathClock-=dt;
  const atCenter=Math.hypot(this.enemy.x-Math.floor(this.enemy.x)-.5,this.enemy.y-Math.floor(this.enemy.y)-.5)<.001;
  if(!this.path.length||(this.pathClock<=0&&atCenter)){this.path=this.routeTo(player);this.pathClock=.6;}
  const target=this.path[0];if(target){const dx=target.x-this.enemy.x,dy=target.y-this.enemy.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*.72);if(d>0){this.enemy.x+=dx/d*step;this.enemy.y+=dy/d*step;}if(d<=step+.00001){this.enemy.x=target.x;this.enemy.y=target.y;this.path.shift();}}
  if(Math.hypot(this.enemy.x-player.x,this.enemy.y-player.y)<.6){this.caught=true;this.bite=1.2;this.onEvent('caught','¡Ñam! EPI Ivan te alcanzó.');}
 }
};
