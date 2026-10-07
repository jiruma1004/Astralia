/* Diálogos por clic: la animación termina su gesto y espera al jugador. */
window.SceneDialogueStops={
 'ignitia-intercepcion':[3.9,7.45,24.9,38.9,50.9,61.9],
 'intercepcion-espacial':[5.9,19.9,26.9,42.9],
 'ceremonia-ignitia':[7.95,15.95,23.95,32.95,37.95],
 'ceremonia-karla':[7.95,15.95,23.95,32.95,37.95],
 'ivan-descenso':[5.9,11.9,15.9,23.9,27.9,34.9],
 'eric-fuga':[5.9,12.9,19.9]
};
window.EricEscapeScene=class {
 constructor(lib){this.lib=lib;this.lines=[
 {at:0,until:6,text:'La celda está vacía… Eric debió escapar mientras estábamos en la ceremonia.'},
 {at:6,until:13,text:'El aluminio y el óxido de hierro… Esto parece el rastro de una reacción de termita. La reja está fundida.'},
 {at:13,until:20,text:'Hay un fósforo quemado. ¿Alguien se lo dio? No explica por sí solo lo ocurrido… Me temo que Eric recibió ayuda.'}
 ];}
 draw(t){const l=this.lib,c=l.ctx,w=l.canvas.width,h=l.canvas.height,img=l.images.escapedCell;
  if(img.complete&&img.naturalWidth){const s=Math.max(w/img.naturalWidth,h/img.naturalHeight);c.drawImage(img,(w-img.naturalWidth*s)/2,(h-img.naturalHeight*s)/2,img.naturalWidth*s,img.naturalHeight*s);}
  const line=this.lines.find(p=>t>=p.at&&t<p.until);
  CinematicSpriteMotion.draw(c,l.images.angelicaGesture,'angelicaGesture',line?CinematicSpriteMotion.gestureFrame(t-line.at):0,w*.19,h*.91,h*.60,{speaking:!!line,time:t});
  document.querySelector('#ceremony-dialogue').hidden=!line;
  document.querySelector('#ceremony-speaker').textContent='ANGÉLICA · DIRECTORA DE CIENCIAS';
  if(line)document.querySelector('#ceremony-words').textContent=I18n.t(line.text).slice(0,Math.floor((t-line.at)*38));
  return 'Después de la ceremonia · Una ausencia inesperada';
 }
};
(()=>{
const P=CinematicLibrary.prototype,play=P.play,tick=P.tick,refresh=P.refresh,close=P.requestClose;
P.play=function(id,options){
 this.dialogueStops=SceneDialogueStops[id]||null;this.dialogueIndex=0;this.dialogueWaiting=false;
 if(!document.querySelector('#scene-next')){
  this.player.insertAdjacentHTML('beforeend','<button id="scene-next" class="primary" hidden>Continuar ▸</button>');
  document.querySelector('#scene-next').onclick=()=>this.advanceDialogue();
  this.player.addEventListener('click',e=>{if(e.target.closest('#ceremony-dialogue')||e.target===this.canvas)this.advanceDialogue();});
 }
 const result=play.call(this,id,options);this.player.dataset.dialogues=this.dialogueStops?'click':'timed';
 if(id==='eric-fuga'){this.escape=new EricEscapeScene(this);this.draw();}
 return result;
};
P.advanceDialogue=function(){
 if(!this.active||!this.item||!this.dialogueStops||!this.acceptInput()||this.finished)return;
 const gate=this.dialogueStops[this.dialogueIndex];if(gate===undefined)return;
 if(!this.dialogueWaiting){
  if(this.item.id.startsWith('ceremonia-')||this.item.id==='eric-fuga'){this.time=gate;this.dialogueWaiting=true;this.draw();this.inputAfter=performance.now()+450;}
  return;
 }
 this.inputAfter=performance.now()+450;this.dialogueWaiting=false;this.dialogueIndex++;
 if(this.dialogueIndex===this.dialogueStops.length&&!this.item.id.startsWith('ceremonia-')){this.finish();return;}
 this.time=gate+.1;this.refresh();this.draw();
};
P.tick=function(dt){
 if(!this.active||!this.item||document.hidden)return;
 const gate=this.dialogueStops?.[this.dialogueIndex];
 if(gate!==undefined&&!this.paused&&!this.finished){
  if(this.time+dt>=gate){this.time=gate;this.dialogueWaiting=true;this.audio();this.draw();this.refresh();return;}
 }
 tick.call(this,dt);this.refreshDialogue();
};
P.refreshDialogue=function(){
 const b=document.querySelector('#scene-next');if(!b)return;
 const gate=this.dialogueStops?.[this.dialogueIndex];
 b.hidden=!this.active||!this.item||gate===undefined||this.finished;
 b.disabled=!this.dialogueWaiting&&!this.item?.id.startsWith('ceremonia-')&&this.item?.id!=='eric-fuga';
 b.textContent=this.dialogueWaiting?'Continuar ▸':'Mostrar todo';
};
P.refresh=function(){refresh.call(this);this.refreshDialogue();};
P.requestClose=function(){
 if(this.story&&this.dialogueStops&&this.dialogueIndex<this.dialogueStops.length){this.advanceDialogue();return;}
 close.call(this);
};
})();
