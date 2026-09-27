/* Despegue idealizado: masa y aceleración neta constantes, sin aire. No es una órbita lunar. */
window.RocketPuzzle=class {
 static evaluate(a,t,force){
  if(![a,t,force].every(Number.isFinite)||a<=0||t<=0||force<=0)return false;
  return Math.abs(a*t-120)<=1.2&&Math.abs(.5*a*t*t-1800)<=18&&Math.abs(force-1000*(a+9.81))<=138.1;
 }
};
window.IgnitiaMission=class {
 constructor(onEvent){
  this.onEvent=onEvent;this.mode='idle';this.time=0;this.scene=null;this.rocket=new Image();this.rocket.src='assets/sprites/ignitia-rocket.png';this.jose=new Image();this.jose.src='assets/sprites/jose-luis.png';this.eric=new Image();this.eric.src='assets/sprites/dr-eric-standing.png';
  document.querySelector('.scene-view').insertAdjacentHTML('beforeend',`<aside id="ignitia-dialog" hidden><img src="assets/sprites/jose-luis.png" alt="José Luis"><div><p class="eyebrow">JOSÉ LUIS · LÍDER DE IGNITIA</p><p id="ignitia-text"></p><button id="ignitia-next">Mostrar todo</button></div></aside><section id="rocket-console" class="world-console" hidden><button id="rocket-close" class="bubble-fold" aria-label="Cerrar panel">×</button><p class="eyebrow">IGNITIA · CONTROL DE VUELO</p><h2>Programa el ascenso</h2><p>Parte del reposo. Al apagar el motor: altura <b>1800 m</b>, rapidez <b>120 m/s</b>. Masa constante: <b>1000 kg</b>; g = 9.81 m/s².</p><p>Modelo de despegue vertical idealizado, sin aire. Calculas solo la primera fase del ascenso; el piloto automático continúa la misión lunar.</p><p class="formula">v = at · h = ½at² · F = m(a + g)</p><form id="rocket-form"><label>Aceleración neta (m/s²)<input id="rocket-a" type="number" min="0.01" step="any" required></label><label>Tiempo de encendido (s)<input id="rocket-t" type="number" min="0.01" step="any" required></label><label>Empuje del motor (N)<input id="rocket-force" type="number" min="1" step="any" required></label><button class="primary">Validar y despegar</button></form><p id="rocket-feedback" role="status"></p></section><div id="flight-banner" hidden role="status"></div>`);
  document.querySelector('#rocket-close').onclick=()=>this.closeConsole();
  document.querySelector('#ignitia-next').onclick=()=>{if(this.speaking){this.reveal();return;}document.querySelector('#ignitia-dialog').hidden=true;if(this.mode==='briefing'){this.mode='idle';this.onEvent('escapeDone');}document.querySelector('#game').focus({preventScroll:true});};
  document.querySelector('#rocket-form').onsubmit=e=>{e.preventDefault();this.submit();};
 }
 get blocking(){return ['escape','briefing','launch','complete'].includes(this.mode);}
 reset(room){this.scene=room;this.mode='idle';this.time=0;this.speaking=false;Sound.silence=false;Sound.stop('rocket');for(const id of ['ignitia-dialog','rocket-console','flight-banner'])document.querySelector('#'+id).hidden=true;if(room.rocket)this.speak('Ignitia tiene un cohete listo. Soy José Luis: programa el primer ascenso para alcanzar 1800 m y 120 m/s al apagar el motor. Calcula aceleración neta, tiempo de encendido y empuje. Acércate al terminal azul y pulsa E. Las ecuaciones y los datos están en el panel. ¡Eric va rumbo a la Luna!');}
 speak(text){this.source=text;this.text=window.I18n?I18n.t(text):text;this.count=0;this.clock=0;this.speaking=true;document.querySelector('#ignitia-text').textContent='';document.querySelector('#ignitia-next').textContent='Mostrar todo';document.querySelector('#ignitia-dialog').hidden=false;window.dispatchEvent(new Event('astralia:ui-open'));}
 reveal(){this.count=this.text.length;this.speaking=false;document.querySelector('#ignitia-text').textContent=this.text;document.querySelector('#ignitia-next').textContent=this.mode==='complete'?'Misión completada':'Continuar';}
 startEscape(player){this.mode='escape';this.time=0;this.ignited=false;this.closeConsole();document.querySelector('#boss-mission').hidden=true;player.angle=Math.atan2(7.5-player.y,21-player.x);player.pitch=.02;window.dispatchEvent(new Event('astralia:ui-open'));}
 near(player){return this.scene?.rocket&&Math.hypot(player.x-7.5,player.y-5.5)<2.4&&Math.cos(Math.atan2(5.5-player.y,7.5-player.x)-player.angle)>.8;}
 open(player){if(!this.near(player)||this.blocking)return false;document.querySelector('#rocket-console').hidden=false;document.querySelector('#ignitia-dialog').hidden=true;window.dispatchEvent(new Event('astralia:ui-open'));document.querySelector('#rocket-a').focus({preventScroll:true});return true;}
 closeConsole(){document.querySelector('#rocket-console').hidden=true;document.querySelector('#game').focus({preventScroll:true});}
 submit(){if(this.blocking||!this.canLaunch?.())return;const values=['a','t','force'].map(id=>{const v=document.querySelector('#rocket-'+id).value;return v.trim()?Number(v):NaN;});if(!RocketPuzzle.evaluate(...values)){document.querySelector('#rocket-feedback').textContent='El ascenso no coincide. Comprueba v = at, h = ½at² y recuerda que el empuje debe vencer también al peso. Tolerancia: 1 %.';Sound.tone(180,.2,'triangle',.1);return;}
  this.closeConsole();this.mode='launch';this.time=0;Sound.play('rocket',true);this.onEvent('launch');
 }
 tick(dt){if(document.hidden)return;this.time+=dt;
  if(this.speaking){this.clock-=dt;if(this.clock<=0){this.count=Math.min(this.text.length,this.count+2);document.querySelector('#ignitia-text').textContent=this.text.slice(0,this.count);Sound.dialogueBlip(this.count);this.clock=.035;if(this.count===this.text.length)this.reveal();}}
  if(this.mode==='escape'){
   if(this.time>=2.5)Sound.silence=true;
   if(this.time>=4&&!this.ignited){this.ignited=true;Sound.play('rocket',true);}
   if(this.time>=11){Sound.silence=false;Sound.stop('rocket');Sound.selectBackground('transformation');this.mode='briefing';this.speak('¡Aquí José Luis, líder de Ignitia! Eric ha escapado. Planea activar su máquina de divergencia en la Luna. Apresúrate a la siguiente sala: nuestro grupo tiene un cohete preparado. Solo faltan los parámetros de lanzamiento. ¡Todavía podemos alcanzarlo!');}
  }
  if(this.mode==='launch'&&this.time>=8){Sound.stop('rocket');this.mode='complete';this.onEvent('complete');this.speak('¡Despegue confirmado! El piloto automático toma el control. Ignitia va rumbo a la Luna para alcanzar al Dr. Eric. Has completado las seis pruebas. La persecución continúa entre las estrellas…');}
  const banner=document.querySelector('#flight-banner');banner.hidden=!(this.mode==='escape'||this.mode==='launch');banner.textContent=this.mode==='escape'?(this.time<4?'El soporte cede…':'¡Eric está escapando!'):'IGNITIA · DESPEGUE CONFIRMADO';
 }
 draw(renderer,player,actors){
  if(this.mode==='escape'&&this.time>=4){const z=-3+(this.time-4)**2*.36;this.drawRocket(renderer,player,actors,21,7.5,z,3.7,true);}
  if(this.scene?.rocket){const c=renderer.ctx,deck=[[13,5],[19,5],[19,10],[13,10]].map(([x,y])=>actors.project(renderer,player,x,y,.04));if(deck.every(Boolean)){c.fillStyle='#465d72';c.strokeStyle='#a2d8e7';c.lineWidth=3;c.beginPath();deck.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();c.stroke();}
   for(const [x,y] of [[12,4.5],[12,10.5],[18,4.5],[18,10.5]]){const p=actors.project(renderer,player,x,y,0);if(p){c.fillStyle='#85d7ef';c.fillRect(p.x-4,p.y-p.scale,8,p.scale);}}
   const z=this.mode==='launch'||this.mode==='complete'?this.time*this.time*.13:0;this.drawRocket(renderer,player,actors,16,7.5,z,5,false);
   const p=actors.project(renderer,player,7.5,5.5,0);if(p){c.save();c.fillStyle='#263f56';c.fillRect(p.x-p.scale*.5,p.y-p.scale*.9,p.scale,p.scale*.9);c.fillStyle='#83e8ff';c.fillRect(p.x-p.scale*.42,p.y-p.scale*.83,p.scale*.84,p.scale*.4);c.fillStyle='#112d44';c.textAlign='center';c.font=`bold ${Math.max(12,p.scale*.11)}px Georgia`;c.fillText('IGNITIA · E',p.x,p.y-p.scale*.60);c.restore();}
  }
 }
 drawRocket(renderer,player,actors,x,y,z,h,withEric){if(!this.rocket.complete||!this.rocket.naturalWidth)return;WorldBillboard(renderer,player,actors,this.rocket,x,y,z,h*.7,h,false);if(withEric&&this.eric.complete&&this.eric.naturalWidth)WorldBillboard(renderer,player,actors,this.eric,x-.1,y+.35,z+h*.35,.95,1.25,false);}
};
