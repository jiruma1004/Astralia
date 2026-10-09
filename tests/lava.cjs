const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const w={};w.window=w;vm.createContext(w);for(const f of ['src/rooms/room-04/room.js','src/rooms/room-04/corridor.js'])vm.runInContext(fs.readFileSync(f,'utf8'),w);
const lava=w.CORRIDOR_LAVA,room=w.ESCAPE_ROOMS[0],corridor=new w.RelaxCorridor(()=>{});
assert.equal(lava.visualDepth,.31);
for(const p of lava.platforms){const original=p.id==='cross'?1.35:p.id==='exit'?1.9:1.7;assert(Math.abs(p.size*p.size/original**2-.7)<1e-10);}
assert(lava.start>room.spawn.x+10&&lava.end<room.exitX-10,'Solo el tramo central tiene lava');
assert(lava.supports(lava.start-.01,4.5)&&lava.supports(lava.end,4.5));
for(const y of [room.bounds.minY,2.5,4.5,6.5,room.bounds.maxY])assert(!lava.supports(22.45,y),'No existe un paso lateral entre plataformas');
for(const p of lava.platforms){assert(lava.supports(p.x,p.y));assert(!corridor.blocks(p.x,p.y,0),'Aterrizaje sin cajas');}
// Con la integración semimplícita del juego, todos los centros se alcanzan antes de tocar lava.
for(const dt of [1/120,1/60,1/30,.04])for(const route of lava.routes){
 let x=19.7,y=4.5;
 for(const target of [...route.map(id=>lava.platforms.find(p=>p.id===id)),{x:33.4,y:4.5}]){
  let z=0,v=2.1,time=0;const dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;let moved=0;
  do {const step=Math.min(dt*2.3*1.55,d-moved);x+=ux*step;y+=uy*step;moved+=step;v-=4.905*dt;z=Math.max(0,z+v*dt);time+=dt;}while(z>0&&time<2);
  assert.equal(z,0);assert(lava.supports(x,y),`Salto alcanzable a ${1/dt} fps`);assert(Math.hypot(x-target.x,y-target.y)<.01);
 }
}
corridor.symbols=[{x:30,y:3,age:1,text:'Δx'}];corridor.spawnClock=100;corridor.tick(.5,{x:35,y:6,jumpHeight:0});assert.equal(corridor.symbols[0].x,29.2);assert.equal(corridor.symbols[0].y,3);
console.log('OK: zona central, sin atajos laterales, plataformas libres, rutas izquierda/derecha/cruzada a 25/30/60/120 fps y símbolos activos.');
