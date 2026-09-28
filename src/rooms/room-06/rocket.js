// Timeline shared by rendering and tests; the cable pulls Iván by one ankle.
window.IvanLaunchScene={
 state(t){if(t>=RocketFinaleScene.releaseAt)return RocketFinaleScene.fall(t,this.state(RocketFinaleScene.releaseAt-.000001));const rise=Math.max(0,t-8.5),rocketZ=.16*rise*rise,turnStart=8.5+Math.sqrt(3.4/.16),u=Math.max(0,t-turnStart),turn=Math.min(1,u/1.2),ease=turn*turn*(3-2*turn),swing=.55*Math.cos(u*2.4)*Math.exp(-u*.22);
  const base={x:15.2,y:9.125,footZ:0,rotation:0,rocketZ,visible:true,scream:false};
  if(t<4)return {...base,phase:'warning',visible:false,frame:0,caption:''};
  if(t<7.5)return {...base,phase:'search',frame:Math.floor((t-4)/.28)%2,y:10.7-(t-4)*.45,caption:'Iván: «¿Eric? ¿Dónde te metiste?»'};
  return {...base,phase:u>0?'ascent':'tangle',frame:u>0?3:2,x:15.2+.5*ease,y:9.125+(7.8+2.4*Math.sin(swing)-9.125)*ease,footZ:Math.max(0,rocketZ+1.2-2.4*Math.cos(swing))*ease,rotation:Math.PI*ease+swing*ease,scream:u>0,caption:u>0?'¡Pasajero inesperado! Iván va rumbo a las estrellas.':'Iván: «Un momento… ¿qué es este cable?»'};
 }
};
/* Despegue idealizado: masa y aceleración neta constantes, sin aire. No es una órbita lunar. */
window.RocketPuzzle=class {
 static evaluate(a,t,force){
  if(![a,t,force].every(Number.isFinite)||a<=0||t<=0||force<=0)return false;
  return Math.abs(a*t-120)<=1.2&&Math.abs(.5*a*t*t-1800)<=18&&Math.abs(force-1000*(a+9.81))<=138.1;
 }
};
window.IgnitiaMission=class {
 constructor(onEvent){
  this.onEvent=onEvent;this.mode='idle';this.time=0;this.scene=null;this.rocket=new Image();this.rocket.src='assets/sprites/ignitia-rocket.png';this.jose=new Image();this.jose.src='assets/sprites/jose-luis-talk.png';this.rider=new Image();this.rider.src='assets/sprites/eric-cockpit-rocket.png';this.jose.onload=()=>this.drawPortrait();this.ivan=new Image();this.ivan.src='assets/sprites/ivan-launch-sheet.png';this.launchIgnited=false;
  document.querySelector('.scene-view').insertAdjacentHTML('beforeend',`<aside id="ignitia-dialog" hidden><canvas id="ignitia-portrait" width="160" height="160" aria-label="José Luis hablando"></canvas><div><p class="eyebrow">JOSÉ LUIS · LÍDER DE IGNITIA</p><p id="ignitia-text"></p><button id="ignitia-next">Mostrar todo</button></div></aside><section id="rocket-console" class="world-console" hidden><button id="rocket-close" class="bubble-fold" aria-label="Cerrar panel">×</button><p class="eyebrow">IGNITIA · CONTROL DE VUELO</p><h2>Programa el ascenso</h2><p>Parte del reposo. Al apagar el motor: altura <b>1800 m</b>, rapidez <b>120 m/s</b>. Masa constante: <b>1000 kg</b>; g = 9.81 m/s².</p><p>Modelo de despegue vertical idealizado, sin aire. Calculas solo la primera fase del ascenso; el piloto automático continúa la misión lunar.</p><p class="formula">v = at · h = ½at² · F = m(a + g)</p><form id="rocket-form"><label>Aceleración neta (m/s²)<input id="rocket-a" type="number" min="0.01" step="any" required></label><label>Tiempo de encendido (s)<input id="rocket-t" type="number" min="0.01" step="any" required></label><label>Empuje del motor (N)<input id="rocket-force" type="number" min="1" step="any" required></label><button class="primary">Validar y despegar</button></form><p id="rocket-feedback" role="status"></p></section><div id="flight-banner" hidden role="status"></div>`);
  document.querySelector('#rocket-close').onclick=()=>this.closeConsole();
  this.walk=new Image();this.walk.src='assets/sprites/ivan-walk-v2.png';this.paola=new Image();this.paola.src='assets/sprites/epi-paola-teacher.png';this.speaker='jose';
  document.querySelector('.scene-view').insertAdjacentHTML('beforeend','<details id="completion-card" hidden><summary>ASTRALIA · DESAFÍO COMPLETADO</summary><strong>6 / 6</strong><p>¡Muchas felicidades! Has completado todas las pruebas. Toma una captura de esta pantalla y súbela a la actividad junto con tus apuntes y los procedimientos de los ejercicios.</p></details>');
  document.querySelector('#ignitia-next').onclick=()=>{if(this.speaking){this.reveal();return;}document.querySelector('#ignitia-dialog').hidden=true;if(this.mode==='debrief'){this.finishLaunch();}if(this.mode==='briefing'){this.mode='idle';this.onEvent('escapeDone');}document.querySelector('#game').focus({preventScroll:true});};
  document.querySelector('#rocket-form').onsubmit=e=>{e.preventDefault();this.submit();};
 }
 get blocking(){return ['escape','briefing','launch','debrief','complete'].includes(this.mode);}
 reset(room){this.scene=room;this.launchIgnited=false;this.warningDone=false;this.mode='idle';this.time=0;this.speaking=false;Sound.silence=false;Sound.stop('rocket');for(const id of ['ignitia-dialog','rocket-console','flight-banner','completion-card'])document.querySelector('#'+id).hidden=true;document.querySelector('#completion-card').open=false;if(room.rocket)this.speak('Ignitia tiene un cohete listo. Soy José Luis: programa el primer ascenso para alcanzar 1800 m y 120 m/s al apagar el motor. Calcula aceleración neta, tiempo de encendido y empuje. Acércate al terminal azul y pulsa E. Las ecuaciones y los datos están en el panel. ¡Eric va rumbo a la Luna!');}
 speak(text,speaker='jose'){this.speaker=speaker;document.querySelector('#ignitia-dialog .eyebrow').textContent=speaker==='paola'?'EPI PAOLA':'JOSÉ LUIS · LÍDER DE IGNITIA';document.querySelector('#ignitia-portrait').setAttribute('aria-label',speaker==='paola'?'Epi Paola hablando':'José Luis hablando');this.source=text;this.text=window.I18n?I18n.t(text):text;this.count=0;this.clock=0;this.voiceTime=0;this.speaking=true;this.drawPortrait();document.querySelector('#ignitia-text').textContent='';document.querySelector('#ignitia-next').textContent='Mostrar todo';document.querySelector('#ignitia-dialog').hidden=false;window.dispatchEvent(new Event('astralia:ui-open'));}
 reveal(){this.count=this.text.length;this.speaking=false;this.drawPortrait();document.querySelector('#ignitia-text').textContent=this.text;document.querySelector('#ignitia-next').textContent=this.mode==='complete'?'Misión completada':'Continuar';}
 startEscape(player){this.mode='escape';this.time=0;this.ignited=false;this.closeConsole();document.querySelector('#boss-mission').hidden=true;player.angle=Math.atan2(7.5-player.y,21-player.x);player.pitch=.02;window.dispatchEvent(new Event('astralia:ui-open'));}
 near(player){return this.scene?.rocket&&Math.hypot(player.x-7.5,player.y-5.5)<2.4&&Math.cos(Math.atan2(5.5-player.y,7.5-player.x)-player.angle)>.8;}
 open(player){if(!this.near(player)||this.blocking)return false;document.querySelector('#rocket-console').hidden=false;document.querySelector('#ignitia-dialog').hidden=true;window.dispatchEvent(new Event('astralia:ui-open'));document.querySelector('#rocket-a').focus({preventScroll:true});return true;}
 closeConsole(){document.querySelector('#rocket-console').hidden=true;document.querySelector('#game').focus({preventScroll:true});}
 submit(){if(this.blocking||!this.canLaunch?.())return;const values=['a','t','force'].map(id=>{const v=document.querySelector('#rocket-'+id).value;return v.trim()?Number(v):NaN;});if(!RocketPuzzle.evaluate(...values)){document.querySelector('#rocket-feedback').textContent='El ascenso no coincide. Comprueba v = at, h = ½at² y recuerda que el empuje debe vencer también al peso. Tolerancia: 1 %.';Sound.tone(180,.2,'triangle',.1);return;}
  this.closeConsole();this.mode='launch';this.time=0;this.launchIgnited=false;this.warningDone=false;this.onEvent('launch');this.speak('¡Espera! Algo se mueve detrás del cohete…','paola');
 }
 finishLaunch(){if(this.mode!=='debrief')return;this.mode='complete';this.speaking=false;this.onEvent('complete');document.querySelector('#ignitia-dialog').hidden=true;const card=document.querySelector('#completion-card');card.hidden=false;card.open=true;}
 updateCamera(player){if(this.scene?.rocket&&['launch','debrief','complete'].includes(this.mode))player.pitch=RocketFinaleScene.state(this.time).pitch;}
 tick(dt){if(document.hidden)return;if(!['debrief','complete'].includes(this.mode))this.time+=dt;this.voiceTime=(this.voiceTime||0)+dt;this.drawPortrait();
  if(this.speaking){this.clock-=dt;if(this.clock<=0){this.count=Math.min(this.text.length,this.count+2);document.querySelector('#ignitia-text').textContent=this.text.slice(0,this.count);Sound.dialogueBlip(this.count);this.clock=.035;if(this.count===this.text.length)this.reveal();}}
  if(this.mode==='escape'){
   if(this.time>=2.5)Sound.silence=true;
   if(this.time>=4&&!this.ignited){this.ignited=true;Sound.play('rocket',true);}
   if(this.time>=11){Sound.silence=false;Sound.stop('rocket');Sound.selectBackground('transformation');this.mode='briefing';this.speak('¡Aquí José Luis, líder de Ignitia! Eric ha escapado. Planea activar su máquina de divergencia en la Luna. Apresúrate a la siguiente sala: nuestro grupo tiene un cohete preparado. Solo faltan los parámetros de lanzamiento. ¡Todavía podemos alcanzarlo!');}
  }
  if(this.mode==='launch'&&this.time>=4&&!this.warningDone){this.warningDone=true;this.speaking=false;document.querySelector('#ignitia-dialog').hidden=true;}
  if(this.mode==='launch'&&this.time>=8.5&&!this.launchIgnited){this.launchIgnited=true;Sound.play('rocket',true);}
  if(this.mode==='launch'&&this.time>=RocketFinaleScene.dialogueAt){this.time=RocketFinaleScene.dialogueAt;Sound.stop('rocket');this.mode='debrief';this.speak('Ese era nuestro mejor cohete… La carga inesperada de Iván alteró el centro de masa y, al soltarse, dejó desajustado el control de vuelo. Sin querer, ha echado a perder nuestros planes. Tus cálculos eran correctos; ahora tendremos que diseñar un cohete nuevo. ¡Ignitia no se rinde!');}
  const banner=document.querySelector('#flight-banner');banner.hidden=!(this.mode==='escape'||this.mode==='launch'&&this.time>=4&&(!IvanLaunchScene.state(this.time).scream||this.time>=RocketFinaleScene.releaseAt));banner.textContent=this.mode==='escape'?(this.time<4?'El soporte cede…':'¡Eric está escapando!'):this.time>=RocketFinaleScene.releaseAt?RocketFinaleScene.state(this.time).caption:window.IvanLaunchScene.state(this.time).caption;
 }
 draw(renderer,player,actors){
  if(this.mode==='escape'&&this.time>=4){const h=4.8,z=-h+(this.time-4)**2*.48;this.drawRocket(renderer,player,actors,21,7.5,z,h,true);}
  if(this.scene?.rocket){const c=renderer.ctx,deck=[[13,5],[19,5],[19,10],[13,10]].map(([x,y])=>actors.project(renderer,player,x,y,.04));if(deck.every(Boolean)){c.fillStyle='#465d72';c.strokeStyle='#a2d8e7';c.lineWidth=3;c.beginPath();deck.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();c.stroke();}
   for(const [x,y] of [[12,4.5],[12,10.5],[18,4.5],[18,10.5]]){const p=actors.project(renderer,player,x,y,0);if(p){c.fillStyle='#85d7ef';c.fillRect(p.x-4,p.y-p.scale,8,p.scale);}}
   const launching=['launch','debrief','complete'].includes(this.mode),flight=RocketFinaleScene.state(this.time),z=launching?flight.rocketZ:0;this.drawRocket(renderer,player,actors,launching?flight.x:16,launching?flight.y:7.5,z,5,false,launching?flight.rotation:0);if(launching)this.drawIvanLaunch(renderer,player,actors);else this.drawCable(renderer,player,actors,{x:15.2,y:9.125,z:.025},0,false);
   const p=actors.project(renderer,player,7.5,5.5,0);if(p&&!launching){c.save();c.fillStyle='#263f56';c.fillRect(p.x-p.scale*.5,p.y-p.scale*.9,p.scale,p.scale*.9);c.fillStyle='#83e8ff';c.fillRect(p.x-p.scale*.42,p.y-p.scale*.83,p.scale*.84,p.scale*.4);c.fillStyle='#112d44';c.textAlign='center';c.font=`bold ${Math.max(12,p.scale*.11)}px Georgia`;c.fillText('IGNITIA · E',p.x,p.y-p.scale*.60);c.restore();}
  }
 }
 drawCable(renderer,player,actors,foot,rocketZ,taut){
  const a=actors.project(renderer,player,16,7.8,rocketZ+1.2),b=actors.project(renderer,player,foot.x,foot.y,foot.z);if(!a||!b)return;const c=renderer.ctx;c.save();c.strokeStyle='#ddba75';c.lineWidth=Math.max(2,Math.min(5,b.scale*.025));c.beginPath();c.moveTo(a.x,a.y);const sag=b.scale*(taut?.07:.3);c.quadraticCurveTo((a.x+b.x)/2+Math.sin(this.time*2)*sag*.2,Math.max(a.y,b.y)+sag,b.x,b.y);c.stroke();c.restore();
 }
 drawIvanLaunch(renderer,player,actors){
  const state=IvanLaunchScene.state(this.time),foot={x:state.x,y:state.y,z:state.footZ},p=actors.project(renderer,player,foot.x,foot.y,foot.z);if(state.phase!=='fall')this.drawCable(renderer,player,actors,state.phase==='search'||!state.visible?{x:15.2,y:9.125,z:.025}:foot,state.rocketZ,state.phase==='ascent');if(!state.visible)return;
  if(!p||!this.ivan.complete||!this.ivan.naturalWidth)return;const c=renderer.ctx,fw=this.ivan.naturalWidth/4,fh=this.ivan.naturalHeight,height=p.scale*1.7,width=height*fw/fh;
  if(state.phase==='search'&&this.walk.complete&&this.walk.naturalWidth){const sw=this.walk.naturalWidth/2,sh=this.walk.naturalHeight,ww=height*sw/sh;c.save();c.imageSmoothingEnabled=false;c.translate(p.x,p.y);c.drawImage(this.walk,state.frame*sw,0,sw,sh,-ww*.5,-height*.94,ww,height);c.restore();return;}
  c.save();c.imageSmoothingEnabled=false;c.translate(p.x,p.y);c.rotate(state.rotation);if(state.phase==='search')c.scale(-1,1);const ankle=state.frame===3?.51:.55,trim=state.frame===3?.14:0;c.drawImage(this.ivan,(state.frame+trim)*fw,0,fw*(1-trim),fh,width*(trim-ankle),-height*.90,width*(1-trim),height);
  if(state.phase!=='search'&&state.phase!=='fall'){c.strokeStyle='#ddba75';c.lineWidth=3;c.beginPath();c.ellipse(0,0,width*.09,height*.025,0,0,Math.PI*2);c.stroke();}c.restore();
  if(state.scream){const headX=p.x+Math.sin(state.rotation)*height*.7,headY=p.y-Math.cos(state.rotation)*height*.7,w=188,h=44,left=Math.max(10,Math.min(renderer.canvas.width-w-10,headX+20)),top=headY-h/2;if(top>0&&top<renderer.canvas.height-h){c.save();c.fillStyle='#fff3d5';c.strokeStyle='#725047';c.lineWidth=2;c.beginPath();c.roundRect(left,top,w,h,10);c.fill();c.stroke();c.beginPath();c.moveTo(left+10,top+h);c.lineTo(headX,headY);c.lineTo(left+30,top+h);c.fill();c.stroke();c.fillStyle='#35213e';c.font='bold 22px sans-serif';c.textAlign='center';c.fillText('AAAAAAAAHHHH',left+w/2,top+29);c.restore();}}
 }
 drawPortrait(){
  const canvas=document.querySelector('#ignitia-portrait');if(!canvas)return;const c=canvas.getContext('2d'),portrait=this.speaker==='paola'?this.paola:this.jose;c.clearRect(0,0,160,160);if(!portrait?.complete||!portrait.naturalWidth)return;
  const frame=this.speaking?Math.floor((this.voiceTime||0)/.14)%2:0,fw=portrait.naturalWidth/2;canvas.dataset.frame=String(frame);c.imageSmoothingEnabled=false;c.drawImage(portrait,frame*fw,0,fw,portrait.naturalHeight,0,0,160,160);
 }
 drawRocket(renderer,player,actors,x,y,z,h,withEric,rotation=0){
  const art=withEric?this.rider:this.rocket;if(!art.complete||!art.naturalWidth)return;
  const c=renderer.ctx;c.save();
  if(!withEric&&this.time>=RocketFinaleScene.releaseAt&&['launch','debrief','complete'].includes(this.mode)){
   const p=actors.project(renderer,player,x,y,z+h/2);
   if(p){const height=h*p.scale,width=height*.7;c.translate(p.x,p.y);c.rotate(rotation);c.imageSmoothingEnabled=false;
    // El cabo suelto sigue unido al fuselaje, ya sin Iván.
    c.strokeStyle='#ddba75';c.lineWidth=Math.max(2,p.scale*.03);c.beginPath();c.moveTo(width*.08,height*.26);c.quadraticCurveTo(width*.55,height*.55,width*.2+Math.sin(this.time*4)*width*.2,height*.85);c.stroke();
    c.drawImage(art,-width/2,-height/2,width,height);
   }c.restore();return;
  }
  // La proyección del suelo tapa la parte del cohete que aún está bajo tierra.
  if(withEric){const ground=actors.project(renderer,player,x,y,0);if(!ground){c.restore();return;}c.beginPath();c.rect(0,0,renderer.canvas.width,Math.max(0,Math.min(renderer.canvas.height,ground.y)));c.clip();}
  WorldBillboard(renderer,player,actors,art,x,y,z,h*(withEric?art.naturalWidth/art.naturalHeight:.7),h,true);c.restore();
 }
};
