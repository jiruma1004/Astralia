/* Puertas físicas y persecución sobre la misma cuadrícula que las colisiones. */
window.CONCEPT_QUESTIONS=[
 {title:'El carro encantado',text:'Un carro se mueve en línea recta con velocidad constante sobre un suelo horizontal. ¿Cuál es la fuerza neta sobre él?',answers:['Hacia delante','Es cero','Hacia atrás'],correct:1,hint:'Piensa qué mide la aceleración. Una velocidad constante no implica que no existan fuerzas.',explanation:'Velocidad constante significa aceleración cero: la suma de fuerzas es cero.'},
 {title:'Un instante en lo alto',text:'Lanzas una pelota verticalmente hacia arriba. Sin resistencia del aire, ¿qué aceleración tiene justo en su punto más alto?',answers:['Cero','g hacia arriba','g hacia abajo','Depende de su masa'],correct:2,hint:'Distingue velocidad de aceleración. ¿La gravedad desaparece cuando la pelota se detiene un instante?',explanation:'En la cima la velocidad es cero, pero la aceleración sigue siendo g hacia abajo.'},
 {title:'Dos esferas, un vacío',text:'Dejas caer dos esferas de masas distintas, desde la misma altura y al mismo tiempo, en el vacío. ¿Cuál llega primero al suelo?',answers:['La más pesada','La más ligera','Llegan juntas'],correct:2,hint:'Relaciona el peso mg con F = ma. ¿Qué pasa con la masa al despejar la aceleración?',explanation:'Sin aire, ambas tienen la misma aceleración g y llegan juntas.'},
 {title:'El giro del centinela',text:'Una esfera gira en una circunferencia con rapidez constante. ¿Hacia dónde apunta su aceleración?',answers:['Hacia fuera','Es cero','Tangente al círculo','Hacia el centro'],correct:3,hint:'La rapidez no cambia, pero la dirección de la velocidad sí. Imagina la diferencia entre dos vectores velocidad cercanos.',explanation:'El cambio de dirección requiere aceleración centrípeta, dirigida hacia el centro.'}
];
window.DUNGEON_QUESTIONS=[
 {title:'El sello de inercia',text:'Si la fuerza neta sobre un cuerpo es cero, ¿qué ocurre con su velocidad?',answers:['Permanece constante','Siempre se hace cero'],correct:0,hint:'F = ma: sin fuerza neta no hay aceleración. Puede estar en reposo o seguir moviéndose.'},
 {title:'El sello de gravedad',text:'En el punto más alto de un lanzamiento vertical, sin aire, ¿cuál afirmación es correcta?',answers:['Velocidad y aceleración son cero','v = 0; a apunta hacia abajo'],correct:1,hint:'La gravedad sigue actuando incluso cuando la pelota se detiene por un instante.'},
 {title:'El sello del vacío',text:'En caída libre sin aire, al duplicar la masa de un objeto, su aceleración…',answers:['No cambia','Se duplica'],correct:0,hint:'Escribe mg = ma y cancela la masa en ambos lados.'},
 {title:'El sello del giro',text:'En movimiento circular uniforme, ¿por qué hay aceleración?',answers:['Porque aumenta la rapidez','Porque cambia la dirección'],correct:1,hint:'La velocidad es un vector: importa tanto su magnitud como su dirección.'}
];
window.ConceptMaze=class {
 constructor(room,onEvent){this.room=room;this.onEvent=onEvent;this.reset();}
 reset(){
  this.dungeon=false;this.room.environment=this.baseEnvironment||this.room.environment;this.baseEnvironment=this.room.environment;this.stage=0;this.passed=new Set();this.finished=false;this.chasing=false;this.caught=false;this.bite=0;this.path=[];this.pathClock=0;this.doors=[];this.openDoors=new Set();this.grace=0;
  this.enemy={x:1.5,y:8.5};
  // Solo la respuesta correcta tiene un pasaje. Las incorrectas son portales sin cuarto detrás.
  this.room.map=Array.from({length:17},()=>Array(51).fill(1));
  CONCEPT_QUESTIONS.forEach((q,stage)=>{
   const base=stage*12;
   for(let y=1;y<=15;y++)for(let x=base+1;x<=base+7;x++)this.room.map[y][x]=0;
   for(const y of [1,2,3,13,14,15])this.room.map[y][base+4]=1;
   const rows=q.answers.length===3?[3,8,13]:[2,6,10,14];
   q.answers.forEach((text,choice)=>{
    const door={x:base+8,y:rows[choice],stage,choice,text,letter:'ABCD'[choice],correct:choice===q.correct};this.doors.push(door);this.room.map[door.y][door.x]=2;
    if(door.correct)for(let y=door.y-1;y<=door.y+1;y++)for(let x=base+9;x<=base+11;x++)this.room.map[y][x]=0;
    if(door.correct){this.room.map[door.y][base+12]=0;if(stage===3)this.room.map[door.y][49]=0;}
   });
  });
 }
 get question(){return this.dungeon?this.dungeonQuestion:CONCEPT_QUESTIONS[Math.min(this.stage,3)];}
 enterDungeon(player,door){
  this.savedWorld={map:this.room.map,doors:this.doors};this.dungeon=true;this.dungeonQuestion=DUNGEON_QUESTIONS[door.stage];
  this.room.environment={kind:'interior',label:'Calabozo del error',tint:'#395338',moss:true,portraits:[]};
  this.room.map=Array.from({length:13},(_,y)=>Array.from({length:15},(_,x)=>x===0||x===14||y===0||y===12?1:0));
  this.doors=this.dungeonQuestion.answers.map((text,choice)=>({x:13,y:choice===0?3:9,stage:this.stage,choice,text,letter:'AB'[choice],correct:choice===this.dungeonQuestion.correct,dungeon:true}));
  for(const d of this.doors)this.room.map[d.y][d.x]=2;
  Object.assign(player,{x:6.5,y:6.5,angle:0,pitch:0,jumpHeight:0,jumpVelocity:0});
  this.chasing=true;this.enemy={x:2.5,y:6.5};this.path=[];this.pathClock=0;this.grace=1.5;
  this.onEvent('dungeon','El portal te arrastra al calabozo. Resuelve el sello de dos puertas para volver al inicio. Cuidado, alguien te persigue.');
 }
 leaveDungeon(){
  this.room.map=this.savedWorld.map;this.doors=this.savedWorld.doors;this.room.environment=this.baseEnvironment;this.dungeon=false;this.stage=0;this.savedWorld=null;
  this.enemy={x:1.5,y:8.5};this.path=[];this.pathClock=0;this.grace=2.5;
  this.onEvent('return','Sello resuelto. Regresas al inicio del laberinto; las puertas que abriste siguen abiertas.');
 }
 doorAt(x,y){return this.doors.find(d=>d.x===x&&d.y===y);}
 choose(door,player={}){
  if(this.dungeon){
   if(!door||!this.doors.includes(door)||this.caught)return null;
   if(door.correct){this.leaveDungeon();return true;}
   this.onEvent('wrong','Ese sello no responde. '+this.dungeonQuestion.hint+' ¡Iván sigue acercándose!');return false;
  }
  if(!door||door.stage!==this.stage||this.finished||this.caught||this.openDoors.has(door.stage+':'+door.choice))return null;
  this.room.map[door.y][door.x]=0;this.openDoors.add(door.stage+':'+door.choice);
  if(!door.correct||this.openDoors.size>=2)this.awaken();
  if(door.correct){this.passed.add(this.stage);this.onEvent('correct','La puerta se abre. Explora el pasaje y cruza hasta la siguiente galería.');return true;}
  this.enterDungeon(player,door);
  return false;
 }
 awaken(silent=false){if(this.chasing)return;this.chasing=true;this.enemy={x:this.stage*12+1.5,y:8.5};this.path=[];this.pathClock=0;this.grace=2.5;if(!silent)this.onEvent('presence','Oyes pasos entre los muros. No estás solo.');}
 checkpointPosition(stage=this.stage){if(stage===0)return {...this.room.spawn};const previous=this.doors.find(d=>d.stage===stage-1&&d.correct);return {x:stage*12+1.5,y:previous.y+.5,angle:0};}
 restoreCheckpoint(stage){this.reset();this.stage=Math.max(0,Math.min(3,stage));for(const door of this.doors)if(door.stage<this.stage&&door.correct){this.room.map[door.y][door.x]=0;this.passed.add(door.stage);this.openDoors.add(door.stage+':'+door.choice);}if(this.openDoors.size>=2)this.awaken(true);return this.checkpointPosition();}
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
  if(!this.dungeon&&!this.caught){
   const portal=this.doors.find(d=>!d.correct&&this.openDoors.has(d.stage+':'+d.choice)&&player.x>=d.x&&player.x<d.x+4&&Math.abs(player.y-(d.y+.5))<1.5);
   if(portal){this.enterDungeon(player,portal);return;}
  }
  if(!this.dungeon&&this.passed.has(this.stage)&&player.x>(this.stage+1)*12+1){this.stage++;if(this.stage===CONCEPT_QUESTIONS.length){this.finished=true;this.onEvent('complete','¡Superaste el laberinto!');return;}this.onEvent('advance','Punto seguro guardado. Nueva galería: lee la pregunta y elige una puerta.');}
  if(!this.chasing||this.finished||this.caught)return;
  this.grace=Math.max(0,this.grace-dt);if(this.grace>0)return;
  this.pathClock-=dt;
  const atCenter=Math.hypot(this.enemy.x-Math.floor(this.enemy.x)-.5,this.enemy.y-Math.floor(this.enemy.y)-.5)<.001;
  if(!this.path.length||(this.pathClock<=0&&atCenter)){this.path=this.routeTo(player);this.pathClock=.6;}
  const target=this.path[0];if(target){const dx=target.x-this.enemy.x,dy=target.y-this.enemy.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*(.72*1.05));if(d>0){this.enemy.x+=dx/d*step;this.enemy.y+=dy/d*step;}if(d<=step+.00001){this.enemy.x=target.x;this.enemy.y=target.y;this.path.shift();}}
  if(Math.hypot(this.enemy.x-player.x,this.enemy.y-player.y)<.6){this.caught=true;this.bite=1.2;this.onEvent('caught','¡Ñam! EPI Ivan te alcanzó.');}
 }
};
