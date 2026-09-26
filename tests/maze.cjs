const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={};world.window=world;vm.createContext(world);
for(const file of ['src/rooms/room-03/room.js','src/rooms/room-03/maze.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),world);
const room=world.ESCAPE_ROOMS[0],events=[],maze=new world.ConceptMaze(room,(type,text)=>events.push({type,text}));
const door=(stage,choice)=>maze.doors.find(d=>d.stage===stage&&d.choice===choice);
function pass(){const d=door(maze.stage,world.CONCEPT_QUESTIONS[maze.stage].correct);assert.equal(maze.choose(d),true);maze.tick(.016,{x:d.x+5.3,y:d.y+.5});}
assert.equal(maze.choose(door(1,0)),null);
const bad=door(0,0),traveler={x:7,y:3.5};assert.equal(room.map[3][10],1,'No hay cuarto vacío tras el portal');
assert.equal(maze.choose(bad,traveler),false);assert.equal(maze.dungeon,true,'La selección castiga inmediatamente, sin esperar movimiento ni tick');assert.equal(traveler.x,6.5);assert.equal(maze.doors.length,2);assert.equal(room.environment.moss,true);assert.equal(maze.chasing,true);
const saved=maze.savedWorld.map;assert.equal(saved[3][8],0);maze.choose(maze.doors.find(d=>!d.correct),traveler);assert(maze.dungeon,'Una respuesta incorrecta en el calabozo no permite salir');maze.choose(maze.doors.find(d=>d.correct),traveler);assert(!maze.dungeon);assert.equal(room.map,saved);assert.equal(maze.stage,0);assert(maze.openDoors.has('0:0'));assert.equal(events.at(-1).type,'return');
traveler.x=8.1;traveler.y=3.5;maze.tick(.016,traveler);assert(maze.dungeon,'El portal conservado vuelve a funcionar al cruzarlo');maze.grace=0;
const initial={...maze.enemy};maze.tick(.1,traveler);assert(Math.abs(Math.hypot(maze.enemy.x-initial.x,maze.enemy.y-initial.y)-.0756)<1e-8,'Velocidad 0.756 celdas/s');
for(let i=0;i<1000&&!maze.caught;i++){maze.tick(.02,traveler);assert.equal(room.map[Math.floor(maze.enemy.y)][Math.floor(maze.enemy.x)],0);}
assert(maze.caught);assert.equal(events.at(-1).type,'caught');const count=events.length;maze.tick(.2,traveler);assert.equal(events.length,count);
maze.restoreCheckpoint(0);assert(!maze.dungeon);assert.equal(room.environment.moss,undefined);pass();assert.equal(maze.stage,1);assert(!maze.chasing);maze.choose(door(1,2));assert(maze.chasing,'Segunda puerta correcta despierta la presencia');maze.tick(.016,{x:25.3,y:10.5});assert.equal(maze.stage,2);pass();pass();assert(maze.finished);
maze.restoreCheckpoint(1);assert.equal(maze.stage,1);assert(!maze.chasing);assert.equal(room.map[8][8],0);maze.restoreCheckpoint(2);assert(maze.chasing);assert(maze.grace>0);
console.log('OK: penalización inmediata, sin cuartos vacíos, dos respuestas, retorno con puertas abiertas, reentrada, velocidad, captura y progreso correcto.');
