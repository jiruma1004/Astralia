const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const w={document:{hidden:false}};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync('src/cinematics/library.js','utf8'),w);
let draws=0,audio=0,closes=0;const cinema=Object.create(w.CinematicLibrary.prototype);
Object.assign(cinema,{active:true,item:w.CINEMATICS.find(c=>c.id==='ivan-descenso'),time:16,paused:true,finished:false,draw(){draws++},audio(){audio++},refresh(){},close(finish){assert(finish);closes++;this.active=false;}});
cinema.tick(12);assert.equal(cinema.time,16);assert.equal(audio,0);assert.equal(draws,1);
w.document.hidden=true;cinema.paused=false;cinema.tick(12);assert.equal(cinema.time,16);w.document.hidden=false;
w.Sound={stop(){}};cinema.story=true;cinema.time=34.99;cinema.tick(.02);assert.equal(cinema.time,35);assert.equal(closes,1);assert.equal(cinema.active,false);cinema.tick(1);assert.equal(closes,1,'El epílogo finaliza una sola vez');
Object.assign(cinema,{active:true,story:false,time:34.99,paused:false,finished:false});cinema.tick(.02);assert(cinema.active);assert(cinema.finished);assert(cinema.paused);assert.equal(closes,1,'La galería no ejecuta el cierre de capítulo');
const elements=new Map();class FakeAudio{constructor(){this.paused=true;this.currentTime=0;this.duration=10.488;}pause(){this.paused=true;}addEventListener(){}}
const a={Audio:FakeAudio,document:{hidden:false,querySelector(id){if(!elements.has(id))elements.set(id,{value:'1',checked:false,textContent:'',setAttribute(){}});return elements.get(id);},addEventListener(){}}};a.window=a;vm.createContext(a);vm.runInContext(fs.readFileSync('src/audio/sound.js','utf8'),a);
const s=a.Sound,v=s.tracks.victory;v.paused=false;v.currentTime=4.1;s.mix(.02);assert(!v.paused,'La victoria sigue sonando después de 4 s');v.currentTime=4.15;s.mix(.02);assert(Math.abs(s.victoryFade-.5)<1e-6,'La cola conserva el desvanecimiento de 0.7 s');v.currentTime=4.5;s.mix(.02);assert(v.paused);assert.equal(v.currentTime,0);
console.log('OK: pausa, pestaña oculta, epílogo único, galería sin avance y victoria de 4.5 s con desvanecimiento.');
