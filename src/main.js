const canvas=document.querySelector('#game'),renderer=new EscapeRenderer(canvas),keys=new Set(),rooms=window.ESCAPE_ROOMS,lab=new ProjectileLab();
let index=0,player,opened=false,flash=0,last=0,completed=false,death=null,lookDrag=null,suppressClick=false;
const spawnPlayer=room=>({...room.spawn,pitch:0,jumpHeight:0,jumpVelocity:0});
const message=document.querySelector('#message'),nav=document.querySelector('#rooms');
new ResizeObserver(entries=>{const r=entries[0].contentRect;if(r.width&&r.height){canvas.width=960;canvas.height=Math.round(960*r.height/r.width);}}).observe(canvas);
const roulette=new ProblemRoulette(()=>{if(!rooms[index].roulette)return;opened=rooms[index].canUnlock({problemSolved:true});document.querySelector('#door-status').textContent='SELLO ABIERTO';message.textContent='Desafío resuelto. Rodea la mesa y cruza la puerta del fondo.';});
rooms.forEach((room,i)=>{const button=document.createElement('button');button.innerHTML=`<b>${['I','II','III','IV','V','VI'][i]}</b><span>${room.name}<small>${room.challenge.implemented?room.challenge.title:'Por descubrir'}</small></span>`;button.onclick=()=>load(i);nav.append(button);});
function load(i){clearDeath();Sound.recover(true);index=i;player=spawnPlayer(rooms[i]);opened=false;completed=false;keys.clear();flash=0;const room=rooms[i];
 document.querySelector('#room-title').textContent=`UMBRAL ${['I','II','III','IV','V','VI'][i]} / ${room.name.toUpperCase()}`;
 document.querySelector('#door-status').textContent=room.physics?'PUENTE DESACTIVADO':room.roulette?'SELLO CERRADO':'PUERTA BLOQUEADA';
 message.textContent=room.physics?'Elige una bala del estante y cárgala en el cañón.':room.roulette?'Pulsa el botón de la mesa para hacer girar la rueda.':'Apunta al núcleo dorado de la puerta.';
 document.querySelector('#lab').hidden=document.querySelector('#station').hidden=!room.physics;document.querySelector('#roulette-panel').hidden=document.querySelector('#table-interact').hidden=!room.roulette;
 document.querySelector('.scene-layout').classList.toggle('has-station',!!room.physics);document.querySelector('#equipment').textContent=room.physics?'CAÑÓN ASTRAL':room.roulette?'MESA DEL DESTINO':'CAÑÓN DE IMPULSO';
 document.querySelector('#fire').textContent=room.roulette?'✦ Pulsar mesa':'✧ Disparar';document.querySelector('#fire').disabled=false;
 if(room.physics)lab.reset(room);if(room.roulette)roulette.reset();
 [...nav.children].forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-current',j===i?'true':'false');});
}
async function interact(){if(death||!rooms[index].roulette)return;if(Math.hypot(player.x-rooms[index].table.x,player.y-rooms[index].table.y)>2.4){message.textContent='Acércate a la mesa para pulsar el botón.';return;}if(!Sound.ctx)await Sound.enable();roulette.spin();}
async function shoot(){if(completed||death)return;if(rooms[index].roulette){await interact();return;}if(rooms[index].physics){if(opened){message.textContent='El puente está activo. Cruza por el centro.';return;}if(!Sound.ctx&&lab.loaded)await Sound.enable();lab.launch(()=>{opened=rooms[index].canUnlock({targetHit:true});document.querySelector('#door-status').textContent='PUENTE ACTIVADO';message.textContent='¡Acertaste! Rodea la torreta y cruza por el centro del puente.';},()=>die('explosion'));return;}
 flash=.16;Sound.fire();const hit=renderer.cast(rooms[index],player.x,player.y,player.angle,opened);if(hit.tile===2&&rooms[index].canUnlock({prototypeMode:true})){opened=true;document.querySelector('#door-status').textContent='PUERTA ABIERTA';message.textContent='Cruza la puerta para continuar.';}else message.textContent='Apunta a la puerta y dispara.';
}
function jump(){if(completed||death||player.jumpHeight>0||player.jumpVelocity!==0||!supported(player.x,player.y))return;player.jumpVelocity=2.1;}
window.addEventListener('keydown',e=>{if(e.target.closest('button,a,input,select,textarea,summary'))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowleft','arrowright',' ','e','f'].includes(key)){e.preventDefault();keys.add(key);if(key===' '&&!e.repeat)jump();if(key==='f'&&!e.repeat)shoot();if(key==='e'&&!e.repeat)interact();}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();lookDrag=null;canvas.classList.remove('looking');});
document.querySelector('#fire').onclick=()=>{shoot();canvas.focus();};document.querySelector('#station-fire').onclick=()=>{shoot();};document.querySelector('#table-interact').onclick=()=>{interact();};
canvas.addEventListener('pointerdown',e=>{if(death||e.button!==0)return;canvas.focus({preventScroll:true});suppressClick=false;lookDrag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('looking');});
canvas.addEventListener('pointermove',e=>{if(!lookDrag||lookDrag.id!==e.pointerId||death)return;const dx=e.clientX-lookDrag.x,dy=e.clientY-lookDrag.y;if(Math.hypot(e.clientX-lookDrag.startX,e.clientY-lookDrag.startY)>5)suppressClick=true;if(suppressClick){player.angle+=dx*.005;player.pitch=Math.max(-.24,Math.min(.24,player.pitch-dy*.0015));}lookDrag.x=e.clientX;lookDrag.y=e.clientY;});
function endLook(){lookDrag=null;canvas.classList.remove('looking');}
canvas.addEventListener('pointerup',endLook);canvas.addEventListener('pointercancel',()=>{suppressClick=true;endLook();});canvas.addEventListener('lostpointercapture',endLook);
canvas.onclick=e=>{if(death||suppressClick)return;canvas.focus({preventScroll:true});const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)*canvas.width/rect.width,y=(e.clientY-rect.top)*canvas.height/rect.height;if(rooms[index].roulette&&renderer.tableButton&&Math.hypot(x-renderer.tableButton.x,y-renderer.tableButton.y)<renderer.tableButton.r+15)interact();if(rooms[index].physics&&renderer.cannonBounds){const b=renderer.cannonBounds;if(x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h)lab.loadAmmo();}};
document.querySelector('#jump').onclick=()=>{jump();canvas.focus({preventScroll:true});};
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);keys.add(b.dataset.key.toLowerCase());};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key.toLowerCase());});
function walkable(x,y){const room=rooms[index];if(room.table&&Math.hypot(x-room.table.x,y-room.table.y)<.8)return false;if(room.physics&&Math.hypot(x-room.physics.originX,y-room.physics.originY)<.38)return false;return [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].every(([dx,dy])=>{const tile=room.map[Math.floor(y+dy)]?.[Math.floor(x+dx)]??1;return tile===0||(tile===2&&opened)||tile===3;});}
// El abismo permite caminar: perder el suelo inicia la caída.
function supported(x,y){const tile=rooms[index].map[Math.floor(y)]?.[Math.floor(x)];return tile!==3||(opened&&Math.floor(y)===3);}
function clearDeath(){death=null;endLook();canvas.style.transform='';canvas.style.opacity='';const dialog=document.querySelector('#death-dialog');if(dialog.open)dialog.close();}
function die(type){if(death)return;death={type,t:0,shown:false};keys.clear();lab.dead=true;lab.lock(true);if(lab.shot&&!lab.shot.done){lab.shot.done=true;lab.history.push('Lanzamiento interrumpido por caída del explorador.');lab.renderHistory();}Sound.failure(type);message.textContent=type==='fall'?'Has perdido pie…':'¡Sobrecarga de la torreta!';}
function animateDeath(dt){if(!death)return;death.t+=dt;const t=death.t,c=renderer.ctx,w=canvas.width,h=canvas.height;
 if(death.type==='fall'){const u=Math.min(t/1.3,1);canvas.style.transform=`translateY(${u*u*48}%) scale(${1-u*.3}) rotate(${u*5}deg)`;canvas.style.opacity=String(1-u*.9);}
 else{c.save();const fade=Math.max(0,1-t/1.5);c.fillStyle=`rgba(255,130,60,${fade*.3})`;c.fillRect(0,0,w,h);c.translate(w*.44,h*.6);for(let i=0;i<16;i++){const a=i*Math.PI/8,r=t*230+i%3*12;c.fillStyle=i%2?'#ffbf76':'#9eb8da';c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r+t*t*85);c.rotate(t*3+i);c.globalAlpha=fade;c.fillRect(-7,-7,14,14);c.restore();}c.restore();}
 if(t>=1.5&&!death.shown){death.shown=true;const explosion=death.type==='explosion';document.querySelector('#death-kind').textContent=explosion?'SOBRECARGA · EXPERIMENTO TERMINADO':'CAÍDA AL ABISMO';document.querySelector('#death-title').textContent=explosion?'Te pasaste de energía.':'La gravedad ganó esta ronda.';document.querySelector('#death-quote').textContent=explosion?'en papel nada se quema':'La gravedad funciona. Tu estrategia necesita ajustes.';document.querySelector('#death-detail').textContent=explosion?'La torreta superó su capacidad de 180 J. Tu personaje ha quedado fuera de combate. Vuelve, carga otra bala y reduce la energía.':'Vuelve a la plataforma y cruza por el centro cuando el puente esté activo. Tus intentos y el puente desbloqueado se conservan.';document.querySelector('#death-dialog').showModal();}
}
function respawn(){if(!death)return;clearDeath();player=spawnPlayer(rooms[index]);keys.clear();lab.dead=false;lab.destroyed=false;lab.lock(false);lab.update();Sound.recover();document.querySelector('#loaded-status').textContent=lab.loaded?`● Cargada: ${lab.loaded.name} · ${lab.loaded.mass} kg`:'Recámara vacía. Elige una bala y cárgala.';message.textContent=opened?'Has reaparecido. El puente sigue activo.':'Has reaparecido. Ajusta tu próximo intento.';document.querySelector('#feedback').textContent='Nuevo intento: conservas el registro. Revisa la energía antes de disparar.';canvas.focus();}
document.querySelector('#respawn').onclick=respawn;
document.querySelector('#death-dialog').addEventListener('cancel',e=>{e.preventDefault();respawn();});
function tick(time){const dt=Math.min((time-last)/1000,.04);last=time;flash=Math.max(0,flash-dt);
 if(!completed&&!death){player.angle+=((keys.has('arrowright')?1:0)-(keys.has('arrowleft')?1:0))*dt*1.8;const f=(keys.has('w')?1:0)-(keys.has('s')?1:0),s=(keys.has('d')?1:0)-(keys.has('a')?1:0),speed=dt*2.3/Math.max(1,Math.hypot(f,s));const nx=player.x+(Math.cos(player.angle)*f-Math.sin(player.angle)*s)*speed,ny=player.y+(Math.sin(player.angle)*f+Math.cos(player.angle)*s)*speed;
 if(walkable(nx,player.y))player.x=nx;if(walkable(player.x,ny))player.y=ny;
 // Altura en celdas (2 m en Galileo): salto corto, sin doble salto ni apoyo sobre el vacío.
 if(player.jumpHeight>0||player.jumpVelocity>0){player.jumpVelocity-=4.905*dt;player.jumpHeight=Math.max(0,player.jumpHeight+player.jumpVelocity*dt);if(player.jumpHeight===0)player.jumpVelocity=0;}
 if(player.jumpHeight===0&&!supported(player.x,player.y))die('fall');
 if(!death&&opened&&player.x>(rooms[index].exitX??7.6)){if(index<5)load(index+1);else{completed=true;message.textContent='Has cruzado los seis umbrales.';document.querySelector('#door-status').textContent='SALIDA ALCANZADA';keys.clear();}}
 }
 if(!death&&rooms[index].physics)lab.tick(dt);if(!death&&rooms[index].roulette)roulette.tick(dt);
 renderer.draw(rooms[index],player,opened,flash,time,rooms[index].physics?lab:null,rooms[index].roulette?roulette:null);animateDeath(dt);requestAnimationFrame(tick);
}
document.querySelector('#reset-lab').onclick=()=>load(index);document.querySelector('#reset-roulette').onclick=()=>load(index);load(0);requestAnimationFrame(tick);
