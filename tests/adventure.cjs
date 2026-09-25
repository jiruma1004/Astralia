// node tests/adventure.cjs — reloj real y cruces de muro, sin navegador.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={};world.window=world;vm.createContext(world);
for(const file of ['src/engine/adventure.js','src/engine/renderer.js','src/rooms/room-01/room.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),world);
let now=0,expired=0;const phases=[];
const clock=new world.AdventureClock({now:()=>now,onChange:s=>{if(s.phaseChanged)phases.push(s.phase);},onExpire:()=>expired++});
clock.notify();now=100000;clock.tick();assert.equal(clock.remaining,1800);assert.equal(clock.state,'ready');
clock.start();const deadline=clock.deadline;now+=1000;clock.start();assert.equal(clock.deadline,deadline,'No reiniciar con un doble clic');clock.tick();assert.equal(clock.remaining,1799);
now=deadline-601000;clock.tick();assert.equal(clock.phase,'calm');now+=1000;clock.tick();assert.equal(clock.phase,'warning');
now=deadline-180000;clock.tick();assert.equal(clock.phase,'danger');
now=deadline+90000;clock.tick();clock.tick();assert.equal(clock.remaining,0);assert.equal(expired,1);assert.deepEqual(phases,['calm','warning','danger','expired']);assert.equal(clock.finish(),false);
clock.restart();assert.equal(clock.remaining,1800);assert.equal(clock.state,'running');now+=12345;assert.equal(clock.finish(),true);const remaining=clock.remaining;now+=9999999;clock.tick();assert.equal(clock.remaining,remaining);assert.equal(expired,1);
const room=world.ESCAPE_ROOMS[0],cast=(x,y,a,open=false)=>world.EscapeRenderer.prototype.cast(room,x,y,a,open);
const east=cast(2.5,3.5,0);assert.equal(east.tile,2);assert.equal(east.distance,19.5);assert.equal(cast(2.5,3.5,0,true).tile,1);
const north=cast(5,3,-Math.PI/2);assert.equal(north.cy,0);assert.equal(north.axis,'y');assert.equal(north.py,1);assert.equal(north.distance,2);
const south=cast(5,3,Math.PI/2);assert.equal(south.cy,6);assert.equal(south.distance,3);
for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5,Math.PI*2,-Math.PI/2]){const hit=cast(2,3,a);assert(Number.isFinite(hit.distance)&&Number.isFinite(hit.px)&&Number.isFinite(hit.py));}
console.log('OK: inicio, umbrales exactos, tiempo real, expiración única, reinicio, victoria, puertas y caras del muro.');
