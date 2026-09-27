/* Conversaciones y paneles dentro de la vista del juego, sin desplazarse abajo. */
window.RoomCompanions=class {
 constructor(){
  const view=document.querySelector('.scene-view');
  view.insertAdjacentHTML('beforeend',`<aside id="question-bubble" class="world-bubble" hidden aria-label="Pregunta de la habitación"><button id="question-fold" class="bubble-fold" aria-expanded="true">−</button><p class="eyebrow" id="question-owner">LA RUEDA PREGUNTA</p><div id="question-content"></div></aside>
  <section id="answer-console" class="world-console" hidden aria-label="Panel de respuestas"><button id="console-close" class="bubble-fold" aria-label="Cerrar panel">×</button><p class="eyebrow">SELLO DE LA PUERTA</p><h2>Tu propuesta</h2><p class="console-note">Usa g = 9.81 m/s². Escribe números sin unidades.</p></section>
  <aside id="paola-dialog" class="paola-dialog" hidden aria-label="Ayuda de Epi Paola"><button id="paola-close" class="bubble-fold" aria-label="Cerrar ayuda">×</button><canvas id="paola-portrait" width="128" height="128" aria-label="Epi Paola hablando"></canvas><div class="paola-words"><p class="eyebrow">EPI PAOLA · TU GUÍA</p><p id="paola-text" aria-hidden="true"></p><span id="paola-announcement" class="sr-only" role="status"></span><button id="paola-skip">Mostrar todo</button></div></aside>
  <aside id="maze-notice" class="maze-notice" hidden role="status"><strong>El laberinto de los ecos</strong><p>Al cruzar el umbral sientes una presencia. El eco de tus pasos parece llegar un instante tarde…</p><p>Cuatro tramos, tres puertas en cada uno. Abre una puerta con clic o E cuando estés cerca. Elegir una puerta equivocada te envía inmediatamente a un calabozo: resuelve otra pregunta para regresar al inicio, conservando las puertas abiertas. No te detengas más de lo necesario. Cada puerta correcta que cruces guarda un punto seguro.</p><button id="maze-understood">Entendido · A explorar</button></aside>
  <div id="chase-indicator" class="chase-indicator" hidden>CUIDADO, ALGUIEN TE PERSIGUE</div><p id="world-toast" class="world-toast" role="status" hidden></p><p id="interaction-hint" class="interaction-hint" hidden></p><small id="camera-hint">Clic en el mundo para mirar · Esc libera · H ayuda</small>`);
  const bubble=document.querySelector('#question-content');
  bubble.append(document.querySelector('#roulette-status'),document.querySelector('#problem-card'));
  const panel=document.querySelector('#answer-console');
  for(const id of ['answer-form','answer-feedback','hint-details','solution-details'])panel.append(document.getElementById(id));
  panel.append(document.querySelector('.source-note'),document.querySelector('#reset-roulette'));
  const credits=document.createElement('details');credits.innerHTML='<summary>Acerca de estos problemas</summary>';credits.append(document.querySelector('.source-note'));panel.append(credits);
  document.querySelector('#question-fold').setAttribute('aria-label','Minimizar o mostrar la pregunta');
  document.querySelector('#roulette-panel').hidden=true;
  view.insertAdjacentHTML('beforeend','<button id="ask-paola" class="paola-bubble" aria-controls="paola-dialog" aria-expanded="false"><span aria-hidden="true">···</span> <b id="helper-name">Epi Paola</b> <small>Una pista · H</small></button>');
  this.paolaPortrait=new Image();this.paolaPortrait.src='assets/sprites/epi-paola.png';this.josePortrait=new Image();this.josePortrait.src='assets/sprites/jose-luis-talk.png';this.portrait=this.paolaPortrait;this.dialogue=null;
  document.querySelector('#ask-paola').onclick=()=>this.help();
  document.querySelector('#paola-close').onclick=()=>this.closeHelp();
  document.querySelector('#paola-skip').onclick=()=>{if(this.dialogue?.speaking)this.finishDialogue();else this.closeHelp();};
  document.querySelector('#paola-text').onclick=()=>this.finishDialogue();
  document.querySelector('#console-close').onclick=()=>this.closeConsole();
  document.querySelector('#maze-understood').onclick=()=>{document.querySelector('#maze-notice').hidden=true;document.querySelector('#game').focus({preventScroll:true});};
  document.querySelector('#question-fold').onclick=e=>{const collapsed=bubble.hidden=!bubble.hidden;e.target.textContent=collapsed?'+':'−';e.target.setAttribute('aria-expanded',String(!collapsed));};
  bubble.insertAdjacentHTML('beforeend','<div id="concept-question" hidden><p class="badge" id="concept-level"></p><h3 id="concept-title"></h3><p id="concept-text"></p><p class="concept-instruction">Lee las respuestas en las puertas. Acércate y abre con clic o E.</p></div>');
 }
 load(room,roulette,maze){
  this.room=room;this.roulette=roulette;this.maze=maze;this.consoleOpen=false;this.nearConsole=false;this.toastTime=0;this.lastProblem=null;
  room.guide=null;this.closeHelp();this.portrait=room.rocket?this.josePortrait:this.paolaPortrait;
  document.querySelector('#helper-name').textContent=room.rocket?'José Luis':'Epi Paola';
  document.querySelector('#paola-dialog .eyebrow').textContent=room.rocket?'JOSÉ LUIS · LÍDER DE IGNITIA':'EPI PAOLA · TU GUÍA';
  document.querySelector('#paola-dialog').setAttribute('aria-label',room.rocket?'Ayuda de José Luis':'Ayuda de Epi Paola');
  document.querySelector('#paola-portrait').setAttribute('aria-label',room.rocket?'José Luis hablando':'Epi Paola hablando');
  for(const id of ['answer-console','paola-dialog','world-toast','chase-indicator'])document.getElementById(id).hidden=true;
  document.querySelector('.scene-view').classList.toggle('has-world-question',!!(room.roulette||room.conceptual||room.boss));
  document.querySelector('#question-bubble').hidden=!(room.roulette||room.conceptual);
  document.querySelector('#question-owner').textContent=room.conceptual?'EL LABERINTO PREGUNTA':'LA RUEDA PREGUNTA';
  document.querySelector('#roulette-status').hidden=!room.roulette;document.querySelector('#problem-card').hidden=true;
  document.querySelector('#concept-question').hidden=!room.conceptual;document.querySelector('#maze-notice').hidden=!room.conceptual;
  document.querySelector('#ask-paola').hidden=!(room.physics||room.roulette||room.conceptual||room.boss||room.rocket);
  document.querySelector('#question-content').hidden=false;document.querySelector('#question-fold').textContent='−';document.querySelector('#question-fold').setAttribute('aria-expanded','true');
  this.updateConcept();
 }
 revealQuestion(){document.querySelector('#question-content').hidden=false;document.querySelector('#question-fold').textContent='−';document.querySelector('#question-fold').setAttribute('aria-expanded','true');}
 updateConcept(){if(!this.maze)return;const stage=Math.min(this.maze.stage,CONCEPT_QUESTIONS.length-1),q=this.maze.question;document.querySelector('#concept-level').textContent=this.maze.dungeon?'CALABOZO · DOS SELLOS':`TRAMO ${stage+1} / ${CONCEPT_QUESTIONS.length}`;document.querySelector('#concept-title').textContent=q.title;document.querySelector('#concept-text').textContent=q.text;}
 facing(player,target,renderer,opened,maxDistance=2.2){if(!target)return false;const dx=target.x-player.x,dy=target.y-player.y,d=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);return d<maxDistance&&Math.cos(angle-player.angle)>.90&&renderer.cast(this.room,player.x,player.y,angle,opened).distance+.1>=d;}
 tick(dt,player,renderer,opened,playing){
  this.tickDialogue(dt);
  document.querySelector('#roulette-status').hidden=!this.room.roulette||!!this.roulette.current;
  if(this.room.roulette&&this.roulette.current!==this.lastProblem){this.lastProblem=this.roulette.current;this.revealQuestion();}
  this.nearConsole=!!(playing&&this.room.answerSeal&&this.facing(player,this.room.answerSeal,renderer,opened));
  if(this.consoleOpen&&(!this.nearConsole||!this.roulette.current))this.closeConsole();
  this.activeDoor=null;
  if(this.maze&&playing){const hit=renderer.cast(this.room,player.x,player.y,player.angle,false);if(hit.tile===2&&hit.distance<1.8){const d=this.maze.doorAt(hit.cx,hit.cy);if(d?.stage===this.maze.stage)this.activeDoor=d;}}
  const hint=document.querySelector('#interaction-hint');hint.hidden=!playing||!(this.room.roulette||this.room.conceptual||(!this.room.physics));
  hint.textContent=this.room.conceptual?(this.maze.finished?'Clic o E junto a la puerta de roble':this.activeDoor?`Clic o E · Abrir ${this.activeDoor.letter}: ${this.activeDoor.text}`:'Acércate a una puerta'):this.room.roulette?(this.nearConsole?(this.roulette.current?'Clic o E · Responder al sello':'Primero gira la rueda'):'Clic o E junto a la mesa · Girar la ruleta'):'Clic o E cerca de la puerta · Abrir';
  const chase=document.querySelector('#chase-indicator');chase.hidden=!this.maze?.chasing||this.maze.finished;chase.textContent=this.maze?.freezeLeft>0?`IVÁN CONGELADO · ${Math.ceil(this.maze.freezeLeft)} s`:this.maze?.returnGrace&&this.maze.grace>0?`IVÁN ESPERA · ${Math.ceil(this.maze.grace)} s PARA ALEJARTE`:'CUIDADO, ALGUIEN TE PERSIGUE';
  if(this.toastTime>0){this.toastTime-=dt;if(this.toastTime<=0)document.querySelector('#world-toast').hidden=true;}
 }
 openConsole(){if(!this.nearConsole||!this.roulette.current)return false;window.dispatchEvent(new Event('astralia:ui-open'));this.consoleOpen=true;document.querySelector('#answer-console').hidden=false;document.querySelector('#answer-fields input')?.focus({preventScroll:true});return true;}
 closeConsole(){this.consoleOpen=false;const panel=document.querySelector('#answer-console');if(panel.contains(document.activeElement)){document.activeElement.blur();document.querySelector('#game').focus({preventScroll:true});}panel.hidden=true;}
 help(){
  if(this.canHelp&&!this.canHelp())return;if(!this.room||!(this.room.physics||this.room.roulette||this.room.conceptual||this.room.boss||this.room.rocket))return;if(this.room.rocket)window.dispatchEvent(new Event('astralia:help-open'));
  const q=this.roulette?.current,text=this.room.rocket?'Relaciona altura, rapidez y tiempo. Recuerda que el empuje también debe vencer el peso. Los datos están en el terminal azul.':this.room.boss?'Iguala la parábola y la recta. Multiplica por cuatro para quitar las fracciones, lleva todo a un lado y factoriza. Obtendrás dos valores de x; sustituye cada uno en la recta para encontrar y. El láser izquierdo usa la raíz negativa y el derecho la positiva.':this.room.physics?'Tal vez podrías mirar atrás… quizá ahí tengas la respuesta. En el muro hay ecuaciones escritas con tiza. Elige las que relacionen el movimiento horizontal y el vertical.':this.room.roulette?(q?`${q.hint} Cuando tengas tu resultado, mira el sello de la puerta y pulsa E para escribir tu respuesta.`:'Pulsa el cristal de la mesa central para elegir un problema. Luego separa los datos de lo que te piden. La respuesta se escribe directamente en el sello de la puerta.'):this.maze.question.hint+(this.maze.stage===2&&!this.maze.dungeon?' Pisa la placa azul: congela a Iván durante 20 segundos, una sola vez. ':' ')+(this.maze.returnGrace&&this.maze.grace>0?' Iván está esperando unos segundos. Aprovecha para alejarte. ':this.maze.chasing?' Cuidado, alguien te persigue. ':' ')+(this.maze.dungeon?'Resuelve el sello y elige una de las dos puertas para volver al inicio del laberinto. Tus puertas abiertas se conservarán.':'Elegir una puerta equivocada te teletransporta de inmediato al calabozo: allí tendrás otra pregunta antes de volver al inicio.');
  window.dispatchEvent(new Event('astralia:ui-open'));this.dialogue={source:text,text:I18n.t(text),chars:[...I18n.t(text)],index:0,clock:0,elapsed:0,speaking:true};
  document.querySelector('#paola-text').textContent='';document.querySelector('#paola-announcement').textContent=text;document.querySelector('#paola-skip').textContent='Mostrar todo';document.querySelector('#paola-dialog').hidden=false;document.querySelector('#ask-paola').setAttribute('aria-expanded','true');Sound.tone(420,.08,'triangle',.09);
 }
 closeHelp(){this.dialogue=null;document.querySelector('#paola-dialog').hidden=true;document.querySelector('#ask-paola')?.setAttribute('aria-expanded','false');}
 finishDialogue(){if(!this.dialogue)return;this.dialogue.index=this.dialogue.chars.length;this.dialogue.speaking=false;document.querySelector('#paola-text').textContent=this.dialogue.text;document.querySelector('#paola-skip').textContent='Cerrar diálogo';this.drawPortrait(0);}
 tickDialogue(dt){
  const d=this.dialogue;if(!d||document.querySelector('#paola-dialog').hidden)return;d.elapsed+=dt;d.clock-=dt;
  if(d.speaking&&d.clock<=0){const char=d.chars[d.index++];document.querySelector('#paola-text').textContent=d.chars.slice(0,d.index).join('');if(/[^\s.,…:;!?¿¡]/u.test(char)&&d.index%2===0)Sound.dialogueBlip(d.index);d.clock=/[.!?…]/.test(char)?.22:/[,;:]/.test(char)?.1:.028;if(d.index>=d.chars.length)this.finishDialogue();}
  this.drawPortrait(d.speaking?Math.floor(d.elapsed/.13)%2:0);
 }
 drawPortrait(frame){const canvas=document.querySelector('#paola-portrait'),c=canvas.getContext('2d');c.clearRect(0,0,128,128);if(this.portrait.complete&&this.portrait.naturalWidth){c.imageSmoothingEnabled=false;const fw=this.portrait.naturalWidth/2;c.drawImage(this.portrait,frame*fw,0,fw,this.portrait.naturalHeight,0,0,128,128);}}
 toast(text){document.querySelector('#world-toast').textContent=text;document.querySelector('#world-toast').hidden=false;this.toastTime=8;}
};
