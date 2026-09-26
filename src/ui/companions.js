/* Conversaciones y paneles dentro de la vista del juego, sin desplazarse abajo. */
window.RoomCompanions=class {
 constructor(){
  const view=document.querySelector('.scene-view');
  view.insertAdjacentHTML('beforeend',`<aside id="question-bubble" class="world-bubble" hidden aria-label="Pregunta de la habitación"><button id="question-fold" class="bubble-fold" aria-expanded="true">−</button><p class="eyebrow" id="question-owner">LA RUEDA PREGUNTA</p><div id="question-content"></div></aside>
  <section id="answer-console" class="world-console" hidden aria-label="Panel de respuestas"><button id="console-close" class="bubble-fold" aria-label="Cerrar panel">×</button><p class="eyebrow">MESA DE RESPUESTAS</p><h2>Tu propuesta</h2><p class="console-note">Usa g = 9.81 m/s². Escribe números sin unidades.</p></section>
  <aside id="paola-dialog" class="paola-dialog" hidden aria-label="Ayuda de Epi Paola"><button id="paola-close" class="bubble-fold" aria-label="Cerrar ayuda">×</button><span class="paola-avatar" aria-hidden="true">✦</span><div><p class="eyebrow">EPI PAOLA · TU GUÍA</p><p id="paola-text"></p></div></aside>
  <aside id="maze-notice" class="maze-notice" hidden role="status"><strong>El laberinto de EPI Ivan</strong><p>Si te equivocas, el EPI Ivan te perseguirá.</p><p>Cuatro tramos. Acércate a una puerta, mira su respuesta y pulsa E. Cada error te devuelve al inicio; Ivan despierta al fallar desde el segundo tramo.</p><button id="maze-understood">Entendido · A explorar</button></aside>
  <div id="chase-indicator" class="chase-indicator" hidden>EPI IVAN TE SIGUE · ¡MUÉVETE!</div><p id="world-toast" class="world-toast" role="status" hidden></p>`);
  const bubble=document.querySelector('#question-content');
  bubble.append(document.querySelector('#roulette-status'),document.querySelector('#problem-card'));
  const panel=document.querySelector('#answer-console');
  for(const id of ['answer-form','answer-feedback','hint-details','solution-details'])panel.append(document.getElementById(id));
  panel.append(document.querySelector('.source-note'),document.querySelector('#reset-roulette'));
  const credits=document.createElement('details');credits.innerHTML='<summary>Acerca de estos problemas</summary>';credits.append(document.querySelector('.source-note'));panel.append(credits);
  document.querySelector('#question-fold').setAttribute('aria-label','Minimizar o mostrar la pregunta');
  document.querySelector('#roulette-panel').hidden=true;
  document.querySelector('.controls').insertAdjacentHTML('beforeend','<button id="ask-paola">✦ Epi Paola · Ayuda</button>');
  document.querySelector('#ask-paola').onclick=()=>this.help();
  document.querySelector('#paola-close').onclick=()=>document.querySelector('#paola-dialog').hidden=true;
  document.querySelector('#console-close').onclick=()=>this.closeConsole();
  document.querySelector('#maze-understood').onclick=()=>{document.querySelector('#maze-notice').hidden=true;document.querySelector('#game').focus({preventScroll:true});};
  document.querySelector('#question-fold').onclick=e=>{const collapsed=bubble.hidden=!bubble.hidden;e.target.textContent=collapsed?'+':'−';e.target.setAttribute('aria-expanded',String(!collapsed));};
  bubble.insertAdjacentHTML('beforeend','<div id="concept-question" hidden><p class="badge" id="concept-level"></p><h3 id="concept-title"></h3><p id="concept-text"></p><p class="concept-instruction">Lee las respuestas en las puertas. Acércate y pulsa E para elegir.</p></div>');
 }
 load(room,roulette,maze){
  this.room=room;this.roulette=roulette;this.maze=maze;this.consoleOpen=false;this.nearConsole=false;this.toastTime=0;this.lastProblem=null;
  room.guide=room.physics?{x:2.5,y:1.8}:room.roulette?{x:2,y:1.7}:room.conceptual?{x:3,y:9.5}:null;
  for(const id of ['answer-console','paola-dialog','world-toast','chase-indicator'])document.getElementById(id).hidden=true;
  document.querySelector('.scene-view').classList.toggle('has-world-question',!!(room.roulette||room.conceptual));
  document.querySelector('#question-bubble').hidden=!(room.roulette||room.conceptual);
  document.querySelector('#question-owner').textContent=room.conceptual?'EL LABERINTO PREGUNTA':'LA RUEDA PREGUNTA';
  document.querySelector('#roulette-status').hidden=!room.roulette;document.querySelector('#problem-card').hidden=true;
  document.querySelector('#concept-question').hidden=!room.conceptual;document.querySelector('#maze-notice').hidden=!room.conceptual;
  document.querySelector('#ask-paola').hidden=!room.guide;
  document.querySelector('#question-content').hidden=false;document.querySelector('#question-fold').textContent='−';document.querySelector('#question-fold').setAttribute('aria-expanded','true');
  this.updateConcept();
 }
 revealQuestion(){document.querySelector('#question-content').hidden=false;document.querySelector('#question-fold').textContent='−';document.querySelector('#question-fold').setAttribute('aria-expanded','true');}
 updateConcept(){if(!this.maze)return;const stage=Math.min(this.maze.stage,CONCEPT_QUESTIONS.length-1),q=CONCEPT_QUESTIONS[stage];document.querySelector('#concept-level').textContent=`TRAMO ${stage+1} / ${CONCEPT_QUESTIONS.length}`;document.querySelector('#concept-title').textContent=q.title;document.querySelector('#concept-text').textContent=q.text;}
 facing(player,target,renderer,opened,maxDistance=2.2){if(!target)return false;const dx=target.x-player.x,dy=target.y-player.y,d=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);return d<maxDistance&&Math.cos(angle-player.angle)>.90&&renderer.cast(this.room,player.x,player.y,angle,opened).distance+.1>=d;}
 tick(dt,player,renderer,opened,playing){
  document.querySelector('#roulette-status').hidden=!this.room.roulette||!!this.roulette.current;
  if(this.room.roulette&&this.roulette.current!==this.lastProblem){this.lastProblem=this.roulette.current;this.revealQuestion();}
  this.nearConsole=!!(playing&&this.room.answerDesk&&this.facing(player,this.room.answerDesk,renderer,opened));
  if(this.consoleOpen&&(!this.nearConsole||!this.roulette.current))this.closeConsole();
  this.activeDoor=null;
  if(this.maze&&playing){const hit=renderer.cast(this.room,player.x,player.y,player.angle,false);if(hit.tile===2&&hit.distance<1.8){const d=this.maze.doorAt(hit.cx,hit.cy);if(d?.stage===this.maze.stage&&!this.maze.passed.has(d.stage))this.activeDoor=d;}}
  const button=document.querySelector('#table-interact');button.hidden=!(this.room.roulette||this.room.conceptual);
  button.textContent=this.room.conceptual?(this.activeDoor?`E · Elegir ${this.activeDoor.letter}: ${this.activeDoor.text}`:'Acércate y mira una puerta'):this.nearConsole?(this.roulette.current?'E · Abrir panel de respuestas':'Primero gira la rueda'):'E · Pulsar la mesa de la ruleta';
  button.disabled=!playing||(this.room.conceptual&&!this.activeDoor);
  document.querySelector('#chase-indicator').hidden=!this.maze?.chasing;
  if(this.toastTime>0){this.toastTime-=dt;if(this.toastTime<=0)document.querySelector('#world-toast').hidden=true;}
 }
 openConsole(){if(!this.nearConsole||!this.roulette.current)return false;this.consoleOpen=true;document.querySelector('#answer-console').hidden=false;document.querySelector('#answer-fields input')?.focus({preventScroll:true});return true;}
 closeConsole(){this.consoleOpen=false;const panel=document.querySelector('#answer-console');if(panel.contains(document.activeElement)){document.activeElement.blur();document.querySelector('#game').focus({preventScroll:true});}panel.hidden=true;}
 help(){const q=this.roulette?.current;document.querySelector('#paola-text').textContent=this.room.physics?'Tal vez podrías mirar atrás… quizá ahí tengas la respuesta. En el muro hay ecuaciones escritas con tiza. Elige las que relacionen el movimiento horizontal y el vertical.':this.room.roulette?(q?`${q.hint} Cuando tengas tu resultado, busca la otra mesa: su panel verde te permite escribirlo. Mira hacia él y pulsa E.`:'Pulsa el cristal de la mesa central para elegir un problema. Luego separa los datos de lo que te piden. La segunda mesa, a la derecha del portal, guarda el panel de respuestas.'):CONCEPT_QUESTIONS[Math.min(this.maze.stage,3)].hint;document.querySelector('#paola-dialog').hidden=false;}
 toast(text){document.querySelector('#world-toast').textContent=text;document.querySelector('#world-toast').hidden=false;this.toastTime=8;}
};
