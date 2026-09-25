/* MP3 aportados por el usuario + efectos breves sintetizados. Compatible con file://. */
window.Sound={
 enabled:false,ctx:null,master:null,dead:false,hiddenPlaying:new Set(),
 tracks:{music:new Audio('assets/audio/ambiente.mp3'),victory:new Audio('assets/audio/victoria.mp3'),explosion:new Audio('assets/audio/explosion.mp3')},
 async enable(){try{if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);}await this.ctx.resume();this.enabled=true;this.apply();this.ui();if(!this.dead)this.play('music');}catch(e){document.querySelector('#audio-status').textContent='El navegador no pudo iniciar el audio. Pulsa Activar sonido para reintentar.';}},
 async play(name,restart=false){if(!this.enabled||document.hidden)return;const t=this.tracks[name];if(restart)t.currentTime=0;try{const playback=t.play();this.apply();await playback;this.apply();}catch(e){if(e.name!=='AbortError')document.querySelector('#audio-status').textContent='No se pudo reproducir '+name+'. Comprueba el audio o vuelve a activarlo.';}},
 gain(id){return document.querySelector('#'+id+'-mute').checked?0:Number(document.querySelector('#'+id).value);},
 apply(){const main=this.enabled?this.gain('volume'):0;if(this.master)this.master.gain.setTargetAtTime(main*this.gain('effects-volume'),this.ctx.currentTime,.03);const duck=!this.tracks.victory.paused ? 0.18 : 1;this.tracks.music.volume=main*this.gain('music-volume')*duck;this.tracks.victory.volume=main*this.gain('victory-volume');this.tracks.explosion.volume=main*this.gain('effects-volume');for(const id of ['volume','music-volume','victory-volume','effects-volume'])document.querySelector('#'+id+'-value').textContent=Math.round(Number(document.querySelector('#'+id).value)*100)+' %';},
 ui(){const b=document.querySelector('#sound-toggle');b.textContent=this.enabled?'♫ Sonido activado':'♫ Activar sonido';b.setAttribute('aria-pressed',String(this.enabled));},
 stop(name){this.tracks[name].pause();this.tracks[name].currentTime=0;this.hiddenPlaying.delete(name);},
 toggle(){if(!this.enabled)return this.enable();this.enabled=false;this.tracks.music.pause();this.stop('victory');this.stop('explosion');this.apply();this.ui();},
 success(){if(this.dead)return;this.play('victory',true);},
 failure(kind){this.dead=true;this.tracks.music.pause();this.stop('victory');this.stop('explosion');if(kind==='explosion')this.play('explosion',true);else{this.tone(330,.35,'triangle',.24);this.tone(180,.7,'sine',.23,.15);}},
 recover(preserveVictory=false){this.dead=false;this.stop('explosion');if(!preserveVictory)this.stop('victory');this.apply();if(this.enabled)this.play('music');},
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
document.addEventListener('visibilitychange',()=>{if(document.hidden){Sound.hiddenPlaying.clear();for(const [name,t] of Object.entries(Sound.tracks)){if(!t.paused){Sound.hiddenPlaying.add(name);t.pause();}}if(Sound.ctx)Sound.ctx.suspend();}else if(Sound.enabled){Sound.ctx?.resume();for(const name of Sound.hiddenPlaying)Sound.play(name);Sound.hiddenPlaying.clear();}});
Sound.apply();
