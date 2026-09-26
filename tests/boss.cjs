const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');const w={};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/rooms/room-05/boss.js'),'utf8'),w);const p=new w.ParabolaPuzzle();
for(const [side,x,y] of [[-1,0,0],[-1,4,6],[1,-2,3],[1,NaN,6],[1,4,Infinity],[-1,-2,4],[1,2,3]])assert.equal(p.submit(side,x,y),false);
assert.equal(p.submit(-1,-2,3),true);assert(!p.solved);assert.equal(p.submit(-1,-2,3),true);assert(!p.solved,'Repetir un láser no sustituye el segundo corte');assert.equal(p.submit(1,4,6),true);assert(p.solved);
// Solución independiente: x² − 2x − 8 = 0, discriminante 36.
for(const x of [(2-Math.sqrt(36))/2,(2+Math.sqrt(36))/2]){const y=x/2+4;assert.equal(y,x*x/4+2);}
console.log('OK: intersecciones de recta/parábola, rama de cada láser, números finitos y dos cortes distintos.');
