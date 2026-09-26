const canvas=document.querySelector('#game'),renderer=new EscapeRenderer(canvas),keys=new Set(),rooms=window.ESCAPE_ROOMS,lab=new ProjectileLab();
let index=0,player,opened=false,flash=0,last=0,completed=false,death=null,checkpoint=null;
lab.hologram=new TrajectoryHologram(lab);
lab.onFeedback=text=>companions.toast(text);
const cannon=new CannonConsole(lab),companions=new RoomCompanions(),actors=new RoomActors();renderer.actors=actors;renderer.outdoor=new CastleExterior();let maze=null,corridor=null,boss=null;
const spawnPlayer=room=>({...room.spawn,pitch:0,jumpHeight:0,jumpVelocity:0});
const message=document.querySelector('#message'),nav=document.querySelector('#rooms');
const mission=new AdventureClock({onChange:updateCountdown,onExpire:expireAdventure});
const canPlay=()=>mission.state==='running'&&!completed&&!death&&!document.querySelector('#eric-ready').open&&document.querySelector('#maze-notice').hidden;
const camera=new FirstPersonControls(canvas,{canPlay,look:(dx,dy)=>{player.angle+=dx*.0035;player.pitch=Math.max(-.24,Math.min(.24,player.pitch-dy*.0015));},click:worldClick,clearKeys:()=>keys.clear()});
window.addEventListener('astralia:ui-open',()=>camera.release());
function updateCountdown({state,remaining,phase,phaseChanged,musicCue}){
 const timer=document.querySelector('#adventure-timer');timer.dataset.phase=phase;
 document.querySelector('#timer-value').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
 document.querySelector('#timer-label').textContent=state==='complete'?'DIVERGENCIA DETENIDA':'LA DIVERGENCIA';
 const hint=state==='ready'?'Esperando tu entrada':state==='complete'?'Lo lograste':phase==='expired'?'El Dr. Eric llegó primero':phase==='danger'?'¡Apresúrate!':phase==='warning'?'El experimento se acerca':'Tiempo restante';
 document.querySelector('#timer-hint').textContent=hint;
 if(phaseChanged){window.dispatchEvent(new CustomEvent('astralia:urgency',{detail:{phase,remainingSeconds:remaining,musicCue}}));if(phase==='warning'||phase==='danger')document.querySelector('#timer-announcement').textContent='Quedan '+Math.ceil(remaining/60)+' minutos. '+hint;}
}
function expireAdventure(){
 document.querySelector('#eric-ready').close();boss?.close();
 keys.clear();clearDeath();cannon.close();companions.closeHelp();companions.closeConsole();lab.hologram.hide();lab.dead=true;lab.lock(true);if(lab.shot)lab.shot.done=true;Sound.failure('timeout');
 document.querySelector('#door-status').textContent='TIEMPO AGOTADO';message.textContent='El Dr. Eric ha completado la divergencia.';
 document.querySelector('#adventure-expired').showModal();
}
function enterAdventure(){
 const intro=document.querySelector('#adventure-intro');if(intro.open)intro.close();keys.clear();mission.start();canvas.focus({preventScroll:true});canvas.scrollIntoView({block:'center'});
}
const prologue=new AdventurePrologue(enterAdventure);
document.querySelector('#adventure-expired').addEventListener('cancel',e=>e.preventDefault());
document.querySelector('#adventure-restart').onclick=()=>{document.querySelector('#adventure-expired').close();load(0);mission.restart();canvas.focus({preventScroll:true});};
document.addEventListener('visibilitychange',()=>{keys.clear();mission.tick();});
setInterval(()=>mission.tick(),250);
new ResizeObserver(entries=>{const r=entries[0].contentRect;if(r.width&&r.height){canvas.width=960;canvas.height=Math.round(960*r.height/r.width);}}).observe(canvas);
const roulette=new ProblemRoulette(()=>{if(!rooms[index].roulette)return;opened=rooms[index].canUnlock({problemSolved:true});document.querySelector('#door-status').textContent='SELLO ABIERTO';message.textContent='¡Sello roto! Rodea la mesa y atraviesa el portal luminoso.';});
roulette.canAnswer=()=>canPlay()&&rooms[index].roulette&&companions.consoleOpen&&companions.facing(player,rooms[index].answerSeal,renderer,opened);
rooms.forEach((room,i)=>{const button=document.createElement('button');button.innerHTML=`<b>${['I','II','III','IV','V','VI'][i]}</b><span>${room.name}<small>${room.challenge.implemented?room.challenge.title:'Por descubrir'}</small></span>`;button.onclick=()=>load(i);nav.append(button);});
function load(i){Sound.stop('laugh');boss?.close();for(const id of ['boss-mission','boss-panel'])if(document.getElementById(id))document.getElementById(id).hidden=true;document.querySelector('#eric-ready').close();clearDeath();Sound.selectBackground(rooms[i].roulette?'seal':rooms[i].conceptual?'maze':'music');Sound.recover(true);index=i;player=spawnPlayer(rooms[i]);opened=false;completed=false;keys.clear();flash=0;const room=rooms[i];
 document.querySelector('#room-title').textContent=`UMBRAL ${['I','II','III','IV','V','VI'][i]} / ${room.name.toUpperCase()}`;
 document.querySelector('#door-status').textContent=room.physics?'PUENTE DESACTIVADO':room.roulette?'SELLO CERRADO':room.conceptual?'LABERINTO · 1 / 4':room.corridor?'CAMINO A LA SALA PRINCIPAL':'PUERTA BLOQUEADA';
 message.textContent=room.physics?'Mira el cañón y pulsa E o haz clic para preparar tu disparo.':room.roulette?'Gira la rueda. Responde interactuando con el sello de la puerta.':room.conceptual?'Explora las puertas: clic o E cerca de ellas. Las puertas equivocadas esconden portales al calabozo.':room.corridor?'Esquiva los símbolos que vienen hacia ti. Shift corre · Espacio salta. ¡Un impacto termina el intento!':room.boss?'Calcula los dos puntos de corte y programa los láseres laterales.':'Acércate a la puerta y ábrela con clic o E.';
 cannon.load(room);document.querySelector('#trajectory-toggle').hidden=!room.physics;lab.hologram.hide();document.querySelector('#roulette-panel').hidden=true;
 document.querySelector('.scene-layout').classList.remove('has-station');document.querySelector('#equipment').textContent=room.physics?'CAÑÓN ASTRAL':room.roulette?'MESA DEL DESTINO':room.conceptual?'LABERINTO CONCEPTUAL':room.corridor?'SALTO Y SPRINT':room.boss?'DOS LÁSERES · DOS RAÍCES':'CAÑÓN DE IMPULSO';

 if(room.physics)lab.reset(room);if(room.roulette)roulette.reset();
 boss=room.boss?new EricEncounter(bossEvent):null;if(boss)boss.canFire=()=>canPlay()&&boss.active===boss.near(player,renderer,rooms[index],opened);
 corridor=room.corridor?new RelaxCorridor(corridorEvent):null;
 maze=room.conceptual?new ConceptMaze(room,mazeEvent):null;room.maze=maze;companions.load(room,roulette,maze);checkpoint={room:index,stage:0,position:spawnPlayer(room)};
 [...nav.children].forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-current',j===i?'true':'false');});
}
function mazeEvent(type,text){
 if(type==='caught'){die('ivan');return;}
 if(type==='return'){player=spawnPlayer(rooms[index]);checkpoint={room:index,stage:0,position:spawnPlayer(rooms[index])};keys.clear();}
 if(type==='dungeon'||type==='return'){keys.clear();companions.closeHelp();camera.release();}
 if(type==='presence')Sound.tone(85,.6,'sine',.11);
 else if(type==='wrong')Sound.tone(180,.25,'triangle',.15);
 else if(type==='correct')Sound.click();
 else if(type==='advance'){checkpoint={room:index,stage:maze.stage,position:maze.checkpointPosition()};}
 else if(type==='complete'){Sound.success();text='¡Laberinto superado! Abre la puerta de roble al final del pasaje.';}
 companions.updateConcept();companions.revealQuestion();if(maze.finished)document.querySelector('#question-bubble').hidden=true;companions.toast(text);message.textContent=text;
 document.querySelector('#door-status').textContent=maze.dungeon?'CALABOZO · RESUELVE EL SELLO':maze.finished?'LABERINTO SUPERADO':`LABERINTO · ${maze.stage+1} / 4`;
}
function openNearbyDoor(angle=player.angle,screenY=null){
 const room=rooms[index];if(room.physics||room.roulette)return false;
 const hit=renderer.cast(room,player.x,player.y,angle,opened);if(hit.tile!==2||hit.distance>1.8)return false;
 if(screenY!==null){const height=canvas.height/(hit.distance*Math.cos(angle-player.angle)),top=canvas.height*(.5+(player.pitch||0))-(.5-(player.jumpHeight||0))*height;if(screenY<top||screenY>top+height)return false;}
 if(room.oakDoor&&hit.cx===room.oakDoor.x&&hit.cy===room.oakDoor.y){
  if(room.corridor){corridorEvent('ready');return true;}
  if(room.boss){if(!boss.puzzle.solved)companions.toast('Primero corta los dos soportes de la parábola.');return true;}
  if(maze?.finished){opened=room.canUnlock({mazeSolved:true});Sound.click();companions.toast('La puerta de roble se abre. Continúa hacia el corredor.');return true;}
  return false;
 }
 if(maze){const door=maze.doorAt(hit.cx,hit.cy);if(door?.stage!==maze.stage)return false;maze.choose(door,player);return true;}
 opened=room.canUnlock({prototypeMode:true});if(opened){Sound.click();document.querySelector('#door-status').textContent='PUERTA ABIERTA';message.textContent='Cruza la puerta para continuar.';}return opened;
}
function bossEvent(type){if(type!=='solved')return;opened=rooms[index].canUnlock({parabolaCut:true});Sound.success();companions.toast('¡Dos cortes correctos! La plataforma cede, Eric se retira y la máquina se apaga. Cruza por el puente central.');document.querySelector('#door-status').textContent='SOPORTE CORTADO · PASO ABIERTO';}
function corridorEvent(type,text){
 if(type==='hit'){die('symbol');return;}
 if(type==='ready'){if(opened)return;keys.clear();camera.release();document.querySelector('#eric-ready').showModal();return;}
 companions.toast(text);Sound.tone(310,.08,'triangle',.06);
}
document.querySelector('#eric-ready-yes').onclick=()=>{document.querySelector('#eric-ready').close();if(!corridor)return;opened=rooms[index].canUnlock({ready:true});Sound.click();document.querySelector('#door-status').textContent='PUERTA DE ROBLE ABIERTA';companions.toast('Respira hondo. La sala principal te espera.');canvas.focus({preventScroll:true});};
document.querySelector('#eric-ready-wait').onclick=()=>{document.querySelector('#eric-ready').close();canvas.focus({preventScroll:true});};
async function interact(){
 if(!canPlay())return;
 if(rooms[index].physics){if(!cannon.open(player,renderer,opened))companions.toast('Acércate al cañón y míralo para abrir sus controles.');return;}
 if(openNearbyDoor())return;
 if(boss){if(boss.open(player,renderer,rooms[index],opened))keys.clear();else companions.toast('Acércate a uno de los láseres laterales y mira su panel.');return;}
 if(maze){companions.toast('Acércate a una puerta. Ábrela con clic o E para explorar su respuesta.');return;}
 if(!rooms[index].roulette)return;
 if(companions.nearConsole){if(companions.openConsole())keys.clear();else companions.toast('Primero pulsa el cristal de la mesa para seleccionar un problema.');return;}
 if(Math.hypot(player.x-rooms[index].table.x,player.y-rooms[index].table.y)>2.4){companions.toast('Acércate a la ruleta o mira el sello de la puerta.');return;}
 companions.closeConsole();roulette.spin();
}
function worldClick(x,y){
 companions.closeHelp();
 const contains=b=>b&&x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h;
 if(openNearbyDoor(player.angle+Math.atan((x/canvas.width*2-1)*.66),y))return false;
 if(boss&&boss.open(player,renderer,rooms[index],opened)){keys.clear();return true;}
 if(rooms[index].roulette){
  if(companions.nearConsole){if(companions.openConsole())return true;companions.toast('Acércate y mira el sello de la puerta. Primero necesitas un problema de la ruleta.');}
  if(renderer.tableButton&&Math.hypot(x-renderer.tableButton.x,y-renderer.tableButton.y)<renderer.tableButton.r+15)interact();
 }
 if(rooms[index].physics){if(contains(renderer.cannonBounds)&&cannon.open(player,renderer,opened))return true;cannon.close();}
 return false;
}
async function shoot(){if(!canPlay())return;if(rooms[index].roulette||rooms[index].conceptual){await interact();return;}if(rooms[index].physics){if(!cannon.near(player,renderer,opened)){companions.toast('Vuelve al cañón para preparar el disparo.');return;}if(!cannon.isOpen&&(!lab.loaded||!lab.valid)){cannon.open(player,renderer,opened);return;}if(cannon.isOpen)cannon.showTab('settings');if(opened){message.textContent='El puente está activo. Cruza por el centro.';return;}const launched=lab.launch(()=>{opened=rooms[index].canUnlock({targetHit:true});document.querySelector('#door-status').textContent='PUENTE ACTIVADO';message.textContent='¡Acertaste! Rodea la torreta y cruza por el centro del puente.';},()=>die('explosion'));if(launched)cannon.close();else if(!death)companions.toast(document.querySelector('#feedback').textContent);return;}
 interact();
}
function jump(){if(!canPlay()||player.jumpHeight>0||player.jumpVelocity!==0||!supported(player.x,player.y))return;player.jumpVelocity=2.1;}
window.addEventListener('keydown',e=>{if(!canPlay()||e.target.closest('button,a,input,select,textarea,summary'))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowleft','arrowright',' ','e','f','h','shift'].includes(key)){e.preventDefault();keys.add(key);if(key===' '&&!e.repeat)jump();if(key==='f'&&!e.repeat)shoot();if(key==='e'&&!e.repeat)interact();if(key==='h'&&!e.repeat)companions.help();}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('keydown',e=>{if(e.key==='Escape'){cannon.close();boss?.close();companions.closeHelp();companions.closeConsole();}});
document.querySelector('#station-fire').onclick=()=>shoot();
document.querySelector('#jump').onclick=()=>{jump();canvas.focus({preventScroll:true});};
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{if(!canPlay())return;b.setPointerCapture(e.pointerId);keys.add(b.dataset.key.toLowerCase());};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key.toLowerCase());});
function walkable(x,y){const room=rooms[index];if(room.bounds&&(y-.18<room.bounds.minY||y+.18>room.bounds.maxY))return false;if(boss?.lasers.some(l=>Math.hypot(x-l.x,y-l.y)<.45))return false;if(corridor?.blocks(x,y,player.jumpHeight))return false;if(room.answerDesk&&Math.hypot(x-room.answerDesk.x,y-room.answerDesk.y)<.65)return false;if(room.table&&Math.hypot(x-room.table.x,y-room.table.y)<.8)return false;if(room.physics&&Math.hypot(x-room.physics.originX,y-room.physics.originY)<.38)return false;return [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].every(([dx,dy])=>{const tile=room.map[Math.floor(y+dy)]?.[Math.floor(x+dx)]??1;return tile===0||(tile===2&&opened)||tile===3;});}
// El abismo permite caminar: perder el suelo inicia la caída.
function supported(x,y){const tile=rooms[index].map[Math.floor(y)]?.[Math.floor(x)];return tile!==3||(opened&&Math.floor(y)===(rooms[index].boss?7:3));}
function clearDeath(){death=null;camera.release();canvas.style.transform='';canvas.style.opacity='';const dialog=document.querySelector('#death-dialog');if(dialog.open)dialog.close();}
function die(type){if(death)return;cannon.close();boss?.close();death={type,t:0,shown:false,startedAt:performance.now()};camera.release();companions.closeHelp();companions.closeConsole();lab.hologram.hide();keys.clear();lab.dead=true;lab.lock(true);if(lab.shot&&!lab.shot.done){lab.shot.done=true;lab.history.push('Lanzamiento interrumpido por el fin del intento.');lab.renderHistory();}Sound.failure(type);message.textContent=type==='fall'?'Has perdido pie…':type==='ivan'?'¡EPI Ivan te alcanzó!':type==='symbol'?'¡Un símbolo te alcanzó!':type==='pit'?'Has caído en la fosa.':'¡Sobrecarga de la torreta!';}
function checkpointLabel(){return rooms[checkpoint.room].name+(checkpoint.room===2?` · tramo ${checkpoint.stage+1}`:'');}
function animateDeath(dt){if(!death)return;death.t=(performance.now()-death.startedAt)/1000;const t=death.t,c=renderer.ctx,w=canvas.width,h=canvas.height;
 if(death.type==='fall')drawBlackHoleFall(c,w,h,t);
 else if(death.type==='symbol'||death.type==='pit'){c.fillStyle=`rgba(12,16,30,${Math.min(.9,t)})`;c.fillRect(0,0,w,h);c.fillStyle='#ddadcb';c.textAlign='center';c.font='bold 130px Georgia';c.fillText(death.type==='symbol'?'∑':'↓',w/2,h/2);}
 else if(death.type==='ivan'){c.fillStyle=`rgba(85,9,28,${Math.min(.7,t*.5)})`;c.fillRect(0,0,w,h);if(actors.ivan.complete){const size=Math.min(w,h)*(.65+Math.min(t,.6)*.35),fw=actors.ivan.naturalWidth/2;c.save();c.imageSmoothingEnabled=false;c.drawImage(actors.ivan,fw,0,fw,actors.ivan.naturalHeight,(w-size)/2,(h-size)/2,size,size);c.restore();}}
 else{c.save();const fade=Math.max(0,1-t/1.5);c.fillStyle=`rgba(255,130,60,${fade*.3})`;c.fillRect(0,0,w,h);c.translate(w*.44,h*.6);for(let i=0;i<16;i++){const a=i*Math.PI/8,r=t*230+i%3*12;c.fillStyle=i%2?'#ffbf76':'#9eb8da';c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r+t*t*85);c.rotate(t*3+i);c.globalAlpha=fade;c.fillRect(-7,-7,14,14);c.restore();}c.restore();}
 if(t>=(death.type==='fall'?2.6:1.5)&&!death.shown){
  death.shown=true;const explosion=death.type==='explosion',ivan=death.type==='ivan';
  document.querySelector('#death-kind').textContent='GAME OVER · '+(explosion?'SOBRECARGA':ivan?'EPI IVAN':death.type==='symbol'?'IMPACTO':death.type==='pit'?'LA FOSA':'AGUJERO NEGRO');
  document.querySelector('#death-title').textContent=explosion?'Te pasaste de energía.':ivan?'Ivan te atrapó.':death.type==='symbol'?'Una idea te pasó por encima.':death.type==='pit'?'Cuidado con el borde.':'La singularidad ganó esta ronda.';
  document.querySelector('#death-quote').textContent=explosion?'en papel nada se quema':ivan?'Confundiste una salida con la hora de la comida.':death.type==='symbol'?'Las matemáticas también pueden ser un deporte de contacto.':'La gravedad funciona. Tu estrategia necesita ajustes.';
  document.querySelector('#death-detail').textContent=(explosion?'La torreta superó los 180 J. ':ivan?'La persecución terminó aquí. ':death.type==='symbol'?'Esquiva los carriles o salta sobre los símbolos. ':death.type==='pit'?'Corta el soporte para activar el puente central. ':'Has caído en el agujero negro. ')+`Volverás a tu último punto seguro: ${checkpointLabel()}. El reloj sigue corriendo.`;
  document.querySelector('#death-dialog').showModal();Sound.gameOver();
 }
}
function respawn(){
 if(!death)return;clearDeath();player={...checkpoint.position,pitch:0,jumpHeight:0,jumpVelocity:0};keys.clear();
 if(corridor)corridor=new RelaxCorridor(corridorEvent);
 if(maze){player={...maze.restoreCheckpoint(checkpoint.stage),pitch:0,jumpHeight:0,jumpVelocity:0};opened=false;companions.updateConcept();companions.revealQuestion();document.querySelector('#door-status').textContent=`LABERINTO · ${maze.stage+1} / 4`;}
 lab.dead=false;lab.destroyed=false;if(rooms[index].physics){lab.lock(false);lab.update();document.querySelector('#loaded-status').textContent=lab.loaded?`● Cargada: ${lab.loaded.name} · ${lab.loaded.mass} kg`:'Recámara vacía. Elige una bala y cárgala.';document.querySelector('#feedback').textContent='Nuevo intento: conservas el registro. Revisa la energía antes de disparar.';}
 Sound.recover();message.textContent=`Punto seguro: ${checkpointLabel()}. `+(maze?'Una presencia sigue recorriendo las galerías.':opened?'El puente sigue activo.':'Tienes otro intento.');companions.toast(message.textContent);canvas.focus({preventScroll:true});
}
document.querySelector('#respawn').onclick=respawn;
document.querySelector('#death-dialog').addEventListener('cancel',e=>{e.preventDefault();respawn();});

function tick(time){const dt=Math.min((time-last)/1000,.04);last=time;flash=Math.max(0,flash-dt);Sound.mix(dt);prologue.tick(dt);mission.tick();
 if(canPlay()){player.angle+=((keys.has('arrowright')?1:0)-(keys.has('arrowleft')?1:0))*dt*1.8;const f=(keys.has('w')?1:0)-(keys.has('s')?1:0),s=(keys.has('d')?1:0)-(keys.has('a')?1:0),speed=dt*2.3*(keys.has('shift')?1.55:1)/Math.max(1,Math.hypot(f,s));const nx=player.x+(Math.cos(player.angle)*f-Math.sin(player.angle)*s)*speed,ny=player.y+(Math.sin(player.angle)*f+Math.cos(player.angle)*s)*speed;
 if(walkable(nx,player.y))player.x=nx;if(walkable(player.x,ny))player.y=ny;
 // Altura en celdas (2 m en Galileo): salto corto, sin doble salto ni apoyo sobre el vacío.
 if(player.jumpHeight>0||player.jumpVelocity>0){player.jumpVelocity-=4.905*dt;player.jumpHeight=Math.max(0,player.jumpHeight+player.jumpVelocity*dt);if(player.jumpHeight===0)player.jumpVelocity=0;}
 if(player.jumpHeight===0&&!supported(player.x,player.y))die(rooms[index].boss?'pit':'fall');
 if(!death&&opened&&player.x>(rooms[index].exitX??7.6)){if(index<5)load(index+1);else if(mission.finish()){completed=true;message.textContent='Has cruzado los seis umbrales. ¡Has detenido al Dr. Eric!';document.querySelector('#door-status').textContent='SALIDA ALCANZADA';keys.clear();}}
 }
 if(canPlay()&&maze){maze.tick(dt,player);if(maze.chasing&&!maze.caught)Sound.pursuit(dt,Math.hypot(maze.enemy.x-player.x,maze.enemy.y-player.y));}
 if(canPlay()&&corridor)corridor.tick(dt,player);
 if(canPlay()&&boss)boss.tick(dt,player,renderer,rooms[index],opened);
 companions.tick(dt,player,renderer,opened,canPlay());cannon.tick(player,renderer,opened,canPlay());
 if(rooms[index].physics){const hint=document.querySelector('#interaction-hint');hint.hidden=!canPlay()||cannon.isOpen;hint.textContent=cannon.near(player,renderer,opened)?'Clic o E · Usar el cañón':'Acércate al cañón para configurar el disparo';}
 if(boss)document.querySelector('#interaction-hint').textContent=boss.near(player,renderer,rooms[index],opened)>=0?'Clic o E · Programar láser':'Busca los láseres a ambos lados';
 if(canPlay()&&rooms[index].physics)lab.tick(dt);if(canPlay()&&rooms[index].roulette)roulette.tick(dt);
 renderer.draw(rooms[index],player,opened,flash,time,rooms[index].physics?lab:null,rooms[index].roulette?roulette:null);actors.draw(renderer,rooms[index],player,opened,time,maze);if(corridor)corridor.draw(renderer,player,actors);if(boss)boss.draw(renderer,player,actors);if(rooms[index].environment.kind==='courtyard')renderer.outdoor.draw(renderer,rooms[index],player,actors,time);animateDeath(dt);requestAnimationFrame(tick);
}
document.querySelector('#reset-lab').onclick=()=>load(index);document.querySelector('#reset-roulette').onclick=()=>load(index);load(0);mission.notify();document.querySelector('#adventure-intro').showModal();Sound.enable({automatic:true});requestAnimationFrame(tick);
