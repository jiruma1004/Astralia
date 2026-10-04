const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');const w={};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/rooms/room-05/boss.js'),'utf8'),w);const p=new w.ParabolaPuzzle();
for(const [side,x,y] of [[-1,0,0],[-1,4,6],[1,-2,3],[1,NaN,6],[1,4,Infinity],[-1,-2,4],[1,2,3]])assert.equal(p.submit(side,x,y),false);
assert.equal(p.submit(-1,-3,4),true);assert(!p.solved);assert.equal(p.submit(-1,-3,4),true);assert(!p.solved,'Repetir un láser no sustituye el segundo corte');assert.equal(p.submit(1,4,19/3),true);assert(p.solved);
// Solución independiente: x² − x − 12 = 0, discriminante 49.
for(const x of [(1-Math.sqrt(49))/2,(1+Math.sqrt(49))/2]){const y=x/3+5;assert(Math.abs(y-(x*x/3+1))<1e-10);}
console.log('OK: intersecciones de recta/parábola, rama de cada láser, números finitos y dos cortes distintos.');

const events=[],hazards=new w.EricPotions(type=>events.push(type));
for(let i=0;i<80;i++)hazards.tick(.1,{x:i<68?3:8,y:7.5});hazards.tick(.01,{x:8,y:7.5});assert.equal(hazards.bottles.length,1);assert.equal(hazards.bottles[0].x,3,'Apunta a la posición anterior, no a la actual');
for(let i=0;i<16;i++)hazards.tick(.1,{x:8,y:7.5});assert.equal(hazards.pools.length,1);assert(events.includes('splash'));assert(!hazards.caught);
hazards.tick(.1,{x:3,y:7.5,jumpHeight:.3});assert(!hazards.caught,'Se puede saltar sobre el charco');hazards.tick(.1,{x:3,y:7.5,jumpHeight:0});assert(hazards.caught);assert.equal(events.filter(e=>e==='hit').length,1);hazards.tick(1,{x:3,y:7.5});assert.equal(events.filter(e=>e==='hit').length,1);
hazards.reset();hazards.pools=[{x:3,y:7.5,expires:2}];hazards.tick(1.99,{x:8,y:7.5});assert.equal(hazards.pools.length,1);hazards.tick(.02,{x:3,y:7.5});assert.equal(hazards.pools.length,0);assert(!hazards.caught);assert.equal(hazards.bottles.length,0);
console.log('OK: pociones con posición retrasada, aviso de vuelo, charco de dos segundos, salto, captura única y reinicio limpio.');
