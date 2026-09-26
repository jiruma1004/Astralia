/* Puertas físicas y persecución sobre la misma cuadrícula que las colisiones. */
window.CONCEPT_QUESTIONS=[
 {title:'El carro encantado',text:'Un carro se mueve en línea recta con velocidad constante sobre un suelo horizontal. ¿Cuál es la fuerza neta sobre él?',answers:['Hacia delante','Es cero','Hacia atrás'],correct:1,hint:'Piensa qué mide la aceleración. Una velocidad constante no implica que no existan fuerzas.',explanation:'Velocidad constante significa aceleración cero: la suma de fuerzas es cero.'},
 {title:'Un instante en lo alto',text:'Lanzas una pelota verticalmente hacia arriba. Sin resistencia del aire, ¿qué aceleración tiene justo en su punto más alto?',answers:['Cero','g hacia arriba','g hacia abajo','Depende de su masa'],correct:2,hint:'Distingue velocidad de aceleración. ¿La gravedad desaparece cuando la pelota se detiene un instante?',explanation:'En la cima la velocidad es cero, pero la aceleración sigue siendo g hacia abajo.'},
 {title:'Dos esferas, un vacío',text:'Dejas caer dos esferas de masas distintas, desde la misma altura y al mismo tiempo, en el vacío. ¿Cuál llega primero al suelo?',answers:['La más pesada','La más ligera','Llegan juntas'],correct:2,hint:'Relaciona el peso mg con F = ma. ¿Qué pasa con la masa al despejar la aceleración?',explanation:'Sin aire, ambas tienen la misma aceleración g y llegan juntas.'},
 {title:'El giro del centinela',text:'Una esfera gira en una circunferencia con rapidez constante. ¿Hacia dónde apunta su aceleración?',answers:['Hacia fuera','Es cero','Tangente al círculo','Hacia el centro'],correct:3,hint:'La rapidez no cambia, pero la dirección de la velocidad sí. Imagina la diferencia entre dos vectores velocidad cercanos.',explanation:'El cambio de dirección requiere aceleración centrípeta, dirigida hacia el centro.'}
];
window.ConceptMaze=class {
 constructor(room,onEvent){this.room=room;this.onEvent=onEvent;this.reset();}
 reset(keepPursuer=false){
  this.stage=0;this.passed=new Set();this.finished=false;this.chasing=keepPursuer;this.bite=0;this.path=[];this.pathClock=0;
  this.enemy={x:1.5,y:10.5};this.doors=[];
  this.room.map=Array.from({length:13},(_,y)=>Array.from({length:35},(_,x)=>x===0||x===34||y===0||y===12||[8,16,24,32].includes(x)?1:0));
  // Contrafuertes que obligan a rodear las galerías y dan refugio visual.
  for(let stage=0;stage<4;stage++)for(const y of [1,2,3,9,10,11])this.room.map[y][stage*8+4]=1;
  CONCEPT_QUESTIONS.forEach((q,stage)=>{const rows=q.answers.length===3?[3,6,9]:[2,5,8,10];q.answers.forEach((text,choice)=>{const door={x:(stage+1)*8,y:rows[choice],stage,choice,text,letter:'ABCD'[choice]};this.doors.push(door);this.room.map[door.y][door.x]=2;});});
 }
 doorAt(x,y){return this.doors.find(d=>d.x===x&&d.y===y);}
 choose(door){
  if(!door||door.stage!==this.stage||this.passed.has(this.stage)||this.finished)return null;
  const q=CONCEPT_QUESTIONS[this.stage];
  if(door.choice===q.correct){this.passed.add(this.stage);this.room.map[door.y][door.x]=0;this.onEvent('correct','La puerta se abre. Cruza para continuar.');return true;}
  const awakened=this.chasing||this.stage>=1;this.reset(awakened);this.onEvent('wrong',q.explanation+(awakened?' ¡EPI Ivan te persigue! Regresa a las puertas y sigue avanzando.':' Vuelves al inicio. Esta vez Ivan sigue dormido.'));return false;
 }
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
  if(this.passed.has(this.stage)&&player.x>(this.stage+1)*8+1){this.stage++;if(this.stage===CONCEPT_QUESTIONS.length){this.finished=true;this.onEvent('complete','¡Superaste el laberinto!');return;}this.onEvent('advance','Nuevo tramo. Lee la pregunta y elige una puerta.');}
  if(!this.chasing||this.finished)return;
  this.pathClock-=dt;
  const atCenter=Math.hypot(this.enemy.x-Math.floor(this.enemy.x)-.5,this.enemy.y-Math.floor(this.enemy.y)-.5)<.001;
  if(!this.path.length||(this.pathClock<=0&&atCenter)){this.path=this.routeTo(player);this.pathClock=.6;}
  const target=this.path[0];if(target){const dx=target.x-this.enemy.x,dy=target.y-this.enemy.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*.72);if(d>0){this.enemy.x+=dx/d*step;this.enemy.y+=dy/d*step;}if(d<=step+.00001){this.enemy.x=target.x;this.enemy.y=target.y;this.path.shift();}}
  if(Math.hypot(this.enemy.x-player.x,this.enemy.y-player.y)<.6){this.reset(true);this.bite=1.2;this.onEvent('caught','¡Ñam! EPI Ivan te alcanzó. Vuelves al inicio; el reloj sigue corriendo.');}
 }
};
