/* Coordenadas del panel (X,Y), distintas de las coordenadas del suelo del motor. */
window.ParabolaPuzzle=class {
 constructor(){this.cuts=[false,false];}
 submit(side,x,y){
  if(!Number.isFinite(x)||!Number.isFinite(y)||![-1,1].includes(side))return false;
  // Puntos comunes a y = x²/4 + 2 e y = x/2 + 4. Cada láser corta su rama.
  if((side<0?x>=0:x<=0)||Math.abs(y-(x*x/4+2))>.04||Math.abs(y-(x/2+4))>.04)return false;
  this.cuts[side<0?0:1]=true;return true;
 }
 get solved(){return this.cuts.every(Boolean);}
};
window.EricEncounter=class {
 constructor(onEvent){this.onEvent=onEvent;this.puzzle=new ParabolaPuzzle();this.elapsed=0;this.fall=0;this.active=-1;this.speech=null;this.speechLeft=0;this.tauntClock=2;this.tauntIndex=0;this.lastLaugh=-20;this.lasers=[{x:11.5,y:2.2,side:-1},{x:11.5,y:12.8,side:1}];this.eric=new Image();this.eric.src='assets/sprites/dr-eric-standing.png';this.art=new Map();
  if(!document.querySelector('#boss-mission'))document.querySelector('.scene-view').insertAdjacentHTML('beforeend',`<aside id="boss-mission" class="world-bubble"><button id="boss-fold" class="bubble-fold" aria-label="Minimizar o mostrar el reto" aria-expanded="true">−</button><div id="boss-mission-content"><p class="eyebrow">EL SOPORTE DE ERIC</p><h3>Dos cortes, una parábola</h3><p>Parábola: <b>y = x²/4 + 2</b><br>Recta de corte: <b>y = x/2 + 4</b></p><p>Calcula sus dos intersecciones (x, y). Ve a cada láser lateral y pulsa E para programar el corte de su rama.</p><p id="boss-progress">0 / 2 cortes</p><small>X aumenta hacia la derecha; Y es altura. Unidades del plano del soporte.</small></div></aside><section id="boss-panel" class="world-console" hidden><button id="boss-close" class="bubble-fold" aria-label="Cerrar láser">×</button><p class="eyebrow" id="boss-laser-label"></p><h2>Punto de corte</h2><p>Iguala x²/4 + 2 = x/2 + 4. Escribe las coordenadas de la intersección de esta rama.</p><form id="boss-form"><label>Coordenada x<input id="boss-x" type="number" step="any" required inputmode="decimal"></label><label>Coordenada y<input id="boss-y" type="number" step="any" required inputmode="decimal"></label><button class="primary">Disparar láser</button></form><p id="boss-feedback" role="status"></p></section>`);
  document.querySelector('#boss-mission').hidden=false;document.querySelector('#boss-mission-content').hidden=false;document.querySelector('#boss-fold').onclick=e=>{const hidden=document.querySelector('#boss-mission-content').hidden=!document.querySelector('#boss-mission-content').hidden;e.target.textContent=hidden?'+':'−';e.target.setAttribute('aria-expanded',String(!hidden));};document.querySelector('#boss-panel').hidden=true;document.querySelector('#boss-progress').textContent='0 / 2 cortes';document.querySelector('#boss-close').onclick=()=>this.close();document.querySelector('#boss-form').onsubmit=e=>{e.preventDefault();this.fire();};
 }
 near(player,renderer,room,opened){return this.lasers.findIndex(l=>{const d=Math.hypot(player.x-l.x,player.y-l.y),a=Math.atan2(l.y-player.y,l.x-player.x);return d<2.2&&Math.cos(a-player.angle)>.80&&renderer.cast(room,player.x,player.y,a,opened).distance+.1>=d;});}
 open(player,renderer,room,opened){const n=this.near(player,renderer,room,opened);if(n<0)return false;this.active=n;window.dispatchEvent(new Event('astralia:ui-open'));document.querySelector('#boss-laser-label').textContent=n===0?'LÁSER IZQUIERDO · RAÍZ NEGATIVA':'LÁSER DERECHO · RAÍZ POSITIVA';document.querySelector('#boss-form').reset();document.querySelector('#boss-feedback').textContent=this.puzzle.cuts[n]?'Este soporte ya está cortado.':'';document.querySelector('#boss-panel').hidden=false;document.querySelector('#boss-x').focus();return true;}
 close(){this.active=-1;document.querySelector('#boss-panel').hidden=true;}
 fire(){if(this.active<0||!this.canFire?.())return;const ix=document.querySelector('#boss-x'),iy=document.querySelector('#boss-y'),feedback=document.querySelector('#boss-feedback');if(!ix.value.trim()||!iy.value.trim()){feedback.textContent='Escribe ambas coordenadas.';return;}
  const ok=this.puzzle.submit(this.lasers[this.active].side,Number(ix.value),Number(iy.value));feedback.textContent=ok?'¡Intersección correcta! El láser corta el soporte.':'Ese punto no pertenece a ambas curvas en esta rama. Sustituye x e y en las dos ecuaciones.';
  if(!ok)this.say('¡Ja, ja! Ese punto no está en mis dos curvas.',true);
  if(ok){this.close();document.querySelector('#game').focus({preventScroll:true});this.say(this.puzzle.solved?'¡Mi soporte! ¡Esto no estaba en la gráfica!':'¿Un corte? Todavía te falta la otra intersección.',false);Sound.tone(900,.25,'sawtooth',.06);document.querySelector('#boss-progress').textContent=this.puzzle.cuts.filter(Boolean).length+' / 2 cortes';if(this.puzzle.solved){this.close();this.onEvent('solved');}}
 }
 say(text,laugh=false){this.speech=text;this.speechLeft=6;if(laugh&&this.elapsed-this.lastLaugh>=12){Sound.laugh();this.lastLaugh=this.elapsed;}}
 tick(dt,player,renderer,room,opened){this.elapsed+=dt;this.speechLeft=Math.max(0,this.speechLeft-dt);this.tauntClock-=dt;
  if(!this.puzzle.solved&&this.tauntClock<=0){const lines=['¡Ja, ja, ja! Mi parábola sostiene el futuro.','¿Encontraste x? No olvides calcular también y.','Dos curvas, dos cortes… ¡demuéstralo!','¡Al menos ponle título a esa gráfica!'];this.say(lines[this.tauntIndex++%lines.length],true);this.tauntClock=18;}
 if(this.puzzle.solved)this.fall=Math.min(2,this.fall+dt);if(this.active>=0&&this.near(player,renderer,room,opened)!==this.active)this.close();}
 texture(kind){if(this.art.has(kind))return this.art.get(kind);const a=document.createElement('canvas');a.width=512;a.height=512;const c=a.getContext('2d');
  if(kind==='rig'){c.fillStyle='#28303e';c.fillRect(15,25,482,477);c.strokeStyle='#788b9a';c.lineWidth=14;c.strokeRect(15,25,482,477);for(let x=45;x<490;x+=92){c.fillStyle='#161e2a';c.fillRect(x,60,60,390);c.fillStyle='#91dabd';c.fillRect(x+18,85,24,240);}c.strokeStyle='#a178d2';c.lineWidth=20;c.beginPath();c.arc(256,245,150,0,7);c.stroke();c.fillStyle='#c0afff';c.beginPath();c.arc(256,245,64,0,7);c.fill();}
  else{c.fillStyle='#30364b';c.fillRect(108,190,296,322);c.fillStyle='#677589';c.fillRect(87,360,338,35);c.fillStyle='#203b45';c.fillRect(106,70,300,135);c.strokeStyle='#a2f9db';c.lineWidth=8;c.strokeRect(106,70,300,135);c.fillStyle='#c3ffe0';c.font='bold 40px Georgia';c.textAlign='center';c.fillText(kind==='left'?'LÁSER −':'LÁSER +',256,128);c.font='25px Georgia';c.fillText('PUNTO (x, y)',256,173);c.fillStyle='#a9b7c5';c.fillRect(211,3,90,66);}
  this.art.set(kind,a);return a;
 }
 draw(renderer,player,actors){const c=renderer.ctx,project=(x,y,z)=>actors.project(renderer,player,x,y,z),pt=(x,y)=>project(21,7.5+x,.20*y),line=(a,b,color,width=3)=>{if(!a||!b)return;c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();};
  c.save();if(this.puzzle.solved)c.globalAlpha=.3;WorldBillboard(renderer,player,actors,this.texture('rig'),23.5,7.5,0,9,4.5);c.restore();
  // Plano del soporte: anclado a los dos muros laterales en X = −6.5 y +6.5.
  for(let x=-6.5;x<6.5;x+=.12){if(this.puzzle.solved&&x>-2&&x<4)continue;line(pt(x,x*x/4+2),pt(x+.12,(x+.12)**2/4+2),'#e8c783',7);}
  for(const x of [-6.5,6.5]){const p=pt(x,x*x/4+2);if(p){c.fillStyle='#b9c4d5';c.fillRect(p.x-9,p.y-9,18,18);}}
  // Ejes de referencia y recta guía; los disparos se ven sólidos al acertar.
  line(pt(-6.5,0),pt(6.5,0),'#99b4cd',1);line(pt(0,0),pt(0,12),'#99b4cd',1);
  c.setLineDash([7,7]);line(pt(-6,1),pt(6,7),'#6eaab4',2);c.setLineDash([]);
  for(const x of [-6,-4,-2,0,2,4,6]){const p=pt(x,0);if(p){c.fillStyle='#d9e5e8';c.font='12px Georgia';c.textAlign='center';c.fillText(String(x),p.x,p.y+14);}}
  for(const y of [2,4,6,8,10,12]){const p=pt(0,y);if(p){c.fillStyle='#d9e5e8';c.font='12px Georgia';c.fillText(String(y),p.x+8,p.y);}}
  if(this.eric.complete&&this.eric.naturalWidth&&this.fall<1.5)WorldBillboard(renderer,player,actors,this.eric,20.9,7.5,.4-this.fall*.7,1.7,1.7);
  for(let i=0;i<2;i++){const l=this.lasers[i];WorldBillboard(renderer,player,actors,this.texture(i===0?'left':'right'),l.x,l.y,0,1,1);if(this.puzzle.cuts[i]){const root=i===0?[-2,3]:[4,6];line(project(l.x,l.y,1),pt(...root),i===0?'#97f6d0':'#d8a6ff',4);}}
  this.drawSpeech(renderer,player,actors);
 }
 drawSpeech(renderer,player,actors){
  if(!this.speech||this.speechLeft<=0||this.fall>=1.5||Sound.dead)return;
  const c=renderer.ctx,w=renderer.canvas.width,h=renderer.canvas.height,head=actors.project(renderer,player,20.9,7.5,2.1-this.fall*.7);
  if(!head||head.x<0||head.x>w||head.y<0||head.y>h)return;
  const unit=w/Math.max(320,renderer.canvas.clientWidth),font=15*unit,width=Math.min(w*.56,250*unit),pad=12*unit;
  c.save();c.font=`${font}px Georgia`;const lines=[];let line='';for(const word of this.speech.split(' ')){const test=(line+' '+word).trim();if(c.measureText(test).width>width-2*pad&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);
  const height=lines.length*font*1.35+pad*2,left=Math.max(8,Math.min(w-width-8,head.x-width-20*unit)),top=Math.max(8,Math.min(h-height-8,head.y-height*.7));
  c.fillStyle='#f3e4c7';c.strokeStyle='#725047';c.lineWidth=2*unit;c.beginPath();c.roundRect(left,top,width,height,13*unit);c.fill();c.stroke();c.beginPath();c.moveTo(left+width-16*unit,top+height*.7);c.lineTo(head.x-4*unit,head.y+6*unit);c.lineTo(left+width-4*unit,top+height*.45);c.fill();c.stroke();c.fillStyle='#342439';c.textAlign='left';lines.forEach((text,i)=>c.fillText(text,left+pad,top+pad+font+i*font*1.35));c.restore();
 }

};
