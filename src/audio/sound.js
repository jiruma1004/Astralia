/* MP3 aportados por el usuario + efectos breves sintetizados. Compatible con file://. */
window.Sound={
 enabled:false,ctx:null,master:null,dead:false,hiddenPlaying:new Set(),autoPending:true,userDisabled:false,duck:1,entryFade:0,victoryFade:1,playIds:{},
 tracks:{music:new Audio('assets/audio/ambiente.mp3'),victory:new Audio('assets/audio/victoria.mp3'),explosion:new Audio('assets/audio/explosion.mp3')},
 async enable({automatic=false}={}){if(automatic&&this.userDisabled)return;this.userDisabled=false;this.enabled=true;
  // No esperamos a resume(): algunos navegadores lo dejan pendiente hasta un gesto.
  if(!automatic){try{if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);}this.ctx.resume().catch(()=>{});}catch(e){/* Los MP3 aún pueden funcionar sin efectos Web Audio. */}}
  this.apply();this.ui();if(!this.dead)return this.play('music');
 },
 async play(name,restart=false){if(!this.enabled||document.hidden)return false;const t=this.tracks[name],id=(this.playIds[name]??0)+1;this.playIds[name]=id;if(restart)t.currentTime=0;
  try{this.apply();await t.play();if(id!==this.playIds[name]||!this.enabled)return false;if(name==='music'){this.autoPending=false;document.querySelector('#audio-status').textContent='El ambiente te acompaña. Ajusta cada canal a tu gusto.';}this.apply();this.ui();return true;}
  catch(e){if(id!==this.playIds[name])return false;if(name==='music'&&e.name==='NotAllowedError'){this.autoPending=!this.userDisabled;this.enabled=false;this.apply();this.ui();document.querySelector('#audio-status').textContent='La música empezará con tu primer clic o tecla.';}else if(e.name!=='AbortError')document.querySelector('#audio-status').textContent='No se pudo reproducir '+name+'. Puedes reintentar con Activar sonido.';return false;}
 },
 gain(id){return document.querySelector('#'+id+'-mute').checked?0:Number(document.querySelector('#'+id).value);},
 mix(dt){if(document.hidden)return;const v=this.tracks.victory,playing=!v.paused&&!v.ended,tail=playing&&Number.isFinite(v.duration)?Math.max(0,Math.min(1,(v.duration-v.currentTime)/2.2)):1;
  this.victoryFade=playing?Math.min(1,v.currentTime/.2,tail):0;
  const target=playing?1-.82*tail:1;this.duck+=(target-this.duck)*(1-Math.exp(-dt/(target<this.duck?.35:1.1)));
  if(!this.tracks.music.paused)this.entryFade=Math.min(1,this.entryFade+dt/1.2);this.apply();
 },
 apply(){const main=this.enabled?this.gain('volume'):0,effects=main*this.gain('effects-volume');
  if(this.master&&this.effectLevel!==effects){this.master.gain.setTargetAtTime(effects,this.ctx.currentTime,.03);this.effectLevel=effects;}
  this.tracks.music.volume=main*this.gain('music-volume')*this.duck*this.entryFade;this.tracks.victory.volume=main*this.gain('victory-volume')*this.victoryFade;this.tracks.explosion.volume=effects;
  for(const id of ['volume','music-volume','victory-volume','effects-volume']){const output=document.querySelector('#'+id+'-value'),text=Math.round(Number(document.querySelector('#'+id).value)*100)+' %';if(output.textContent!==text)output.textContent=text;}
 },
 ui(){const b=document.querySelector('#sound-toggle');b.textContent=this.enabled?'♫ Sonido activado':'♫ Activar sonido';b.setAttribute('aria-pressed',String(this.enabled));},
 stop(name){this.playIds[name]=(this.playIds[name]??0)+1;this.tracks[name].pause();this.tracks[name].currentTime=0;this.hiddenPlaying.delete(name);},
 toggle(){if(!this.enabled)return this.enable();this.userDisabled=true;this.autoPending=false;this.enabled=false;this.stop('music');this.stop('victory');this.stop('explosion');this.entryFade=0;this.apply();this.ui();},
 success(){if(this.dead)return;this.victoryFade=0;this.play('victory',true);},
 failure(kind){this.dead=true;this.tracks.music.pause();this.stop('victory');this.stop('explosion');if(kind==='explosion')this.play('explosion',true);else{this.tone(330,.35,'triangle',.24);this.tone(180,.7,'sine',.23,.15);}},
 recover(preserveVictory=false){const wasDead=this.dead;this.dead=false;this.stop('explosion');if(!preserveVictory)this.stop('victory');if(wasDead)this.entryFade=0;this.apply();if(this.enabled)this.play('music');},
 tone(hz,duration=.18,type='sine',volume=.3,delay=0){if(!this.enabled||!this.ctx||document.hidden)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g).connect(this.master);o.start(t);o.stop(t+duration+.02);},
 click(){this.tone(880,.12,'sine',.3);this.tone(1320,.2,'sine',.13,.04);},
 load(){this.tone(220,.12,'triangle',.3);this.tone(440,.22,'sine',.25,.1);},
 tick(){this.tone(640,.035,'triangle',.12);},
 fire(){if(!this.enabled||!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(35,t+.35);g.gain.setValueAtTime(.65,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g).connect(this.master);o.start();o.stop(t+.5);}
};
Sound.tracks.music.loop=true;
for(const [name,track] of Object.entries(Sound.tracks)){track.preload='metadata';track.addEventListener('error',()=>{document.querySelector('#audio-status').textContent='No se pudo cargar el archivo de '+name+'.';});}
Sound.tracks.victory.onended=()=>Sound.apply();
document.querySelector('#sound-toggle').onclick=()=>Sound.toggle();
for(const id of ['volume','music-volume','victory-volume','effects-volume']){document.querySelector('#'+id).oninput=()=>Sound.apply();document.querySelector('#'+id+'-mute').onchange=()=>Sound.apply();}
document.addEventListener('visibilitychange',()=>{if(document.hidden){Sound.hiddenPlaying.clear();for(const [name,t] of Object.entries(Sound.tracks)){if(!t.paused){Sound.hiddenPlaying.add(name);t.pause();}}if(Sound.ctx)Sound.ctx.suspend();}else if(Sound.enabled){Sound.ctx?.resume().catch(()=>{});for(const name of Sound.hiddenPlaying)if(!Sound.dead||name==='explosion')Sound.play(name);Sound.hiddenPlaying.clear();if(Sound.autoPending&&!Sound.dead)Sound.enable({automatic:true});}});
Sound.apply();
// Intenta entrar con música. Si se bloquea, el primer gesto vuelve a intentarlo.
for(const event of ['pointerdown','keydown'])document.addEventListener(event,e=>{if(e.target.closest('#sound-toggle')||Sound.userDisabled)return;if(Sound.autoPending||(Sound.enabled&&!Sound.ctx))Sound.enable();},{capture:true});
