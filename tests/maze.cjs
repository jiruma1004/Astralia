const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={};world.window=world;vm.createContext(world);
for(const file of ['src/rooms/room-03/room.js','src/rooms/room-03/maze.js','src/rooms/room-00/approach.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),world);
const room=world.ESCAPE_ROOMS[0],events=[],maze=new world.ConceptMaze(room,(type,text)=>events.push({type,text}));
const door=(stage,choice)=>maze.doors.find(d=>d.stage===stage&&d.choice===choice);
function pass(){const d=door(maze.stage,[world.CONCEPT_QUESTIONS[maze.stage].correct].flat()[0]);assert.equal(maze.choose(d),true);maze.tick(.016,{x:d.x+5.3,y:d.y+.5});}
assert.equal(maze.choose(door(1,0)),null);
const bad=door(0,0),traveler={x:7,y:3.5};assert.equal(room.map[3][10],1,'No hay cuarto vacío tras el portal');
assert.equal(maze.choose(bad,traveler),false);assert.equal(maze.dungeon,true,'La selección castiga inmediatamente, sin esperar movimiento ni tick');assert.equal(traveler.x,6.5);assert.equal(maze.doors.length,2);assert.equal(room.environment.moss,true);assert.equal(maze.chasing,true);
const saved=maze.savedWorld.map;assert.equal(saved[3][8],0);maze.choose(maze.doors.find(d=>!d.correct),traveler);assert(maze.dungeon,'Una respuesta incorrecta en el calabozo no permite salir');maze.choose(maze.doors.find(d=>d.correct),traveler);assert(!maze.dungeon);assert.equal(room.map,saved);assert.equal(maze.stage,0);assert(maze.openDoors.has('0:0'));assert.equal(events.at(-1).type,'return');
traveler.x=8.1;traveler.y=3.5;maze.tick(.016,traveler);assert(maze.dungeon,'El portal conservado vuelve a funcionar al cruzarlo');maze.grace=0;
const initial={...maze.enemy};maze.tick(.1,traveler);assert(Math.abs(Math.hypot(maze.enemy.x-initial.x,maze.enemy.y-initial.y)-.083349)<1e-8,'Velocidad 0.83349 celdas/s');
for(let i=0;i<1000&&!maze.caught;i++){maze.tick(.02,traveler);assert.equal(room.map[Math.floor(maze.enemy.y)][Math.floor(maze.enemy.x)],0);}
assert(maze.caught);assert.equal(events.at(-1).type,'caught');const count=events.length;maze.tick(.2,traveler);assert.equal(events.length,count);
maze.restoreCheckpoint(0);assert(!maze.dungeon);assert.equal(room.environment.moss,undefined);pass();assert.equal(maze.stage,1);assert(!maze.chasing);maze.choose(door(1,2));assert(maze.chasing,'Segunda puerta correcta despierta la presencia');maze.tick(.016,{x:25.3,y:10.5});assert.equal(maze.stage,2);pass();pass();assert(maze.finished);
maze.restoreCheckpoint(1);assert.equal(maze.stage,1);assert(!maze.chasing);assert.equal(room.map[8][8],0);maze.restoreCheckpoint(2);assert(maze.chasing);assert(maze.grace>0);
console.log('OK: penalización inmediata, sin cuartos vacíos, dos respuestas, retorno con puertas abiertas, reentrada, velocidad, captura y progreso correcto.');
maze.reset();
for(let stage=0;stage<4;stage++){
 const doors=maze.doors.filter(d=>d.stage===stage);assert.equal(doors.length,stage===3?2:3);assert.equal(doors.filter(d=>d.correct).length,stage===3?2:1);
 const correct=doors.find(d=>d.correct);assert.equal(room.map[correct.y][correct.x+4],0,'El pasaje coincide con la respuesta correcta');
}
const cycle=world.DUNGEON_QUESTIONS.length;assert.equal(cycle,12);
maze.questionPool=[];maze.lastDungeonQuestion=null;const questions=[];
for(let i=0;i<cycle*3;i++)questions.push(maze.nextDungeonQuestion().title);
for(let i=0;i<3;i++)assert.equal(new Set(questions.slice(i*cycle,(i+1)*cycle)).size,cycle,'Sin repetir dentro de cada ciclo');
for(let i=1;i<questions.length;i++)assert.notEqual(questions[i],questions[i-1],'Sin repetición consecutiva entre ciclos');
maze.nextDungeonQuestion();const remaining=maze.questionPool.length;maze.restoreCheckpoint(0);assert.equal(maze.questionPool.length,remaining,'Morir no reinicia el banco');
maze.choose(door(0,0),traveler);maze.choose(maze.doors.find(d=>d.correct),traveler);assert.equal(maze.grace,5);assert(maze.returnGrace);
const still={...maze.enemy};const near={x:still.x+.1,y:still.y};for(let i=0;i<49;i++)maze.tick(.1,near);
assert.equal(maze.enemy.x,still.x);assert.equal(maze.enemy.y,still.y);assert(!maze.caught,'No captura durante el margen de regreso');maze.tick(.2,near);assert(maze.caught,'La persecución se reanuda al terminar el margen');
console.log('OK: tres puertas en los primeros tramos y dos respuestas válidas en el último, banco de 12 sin repeticiones y margen de regreso de 5 segundos sin movimiento ni captura.');

maze.reset();
assert.equal(room.oakDoor,null,'No shared exit door');
assert.equal(room.exitX,48.25);
for(const x of [45,46,47,48,49])assert.equal(room.map[8][x],1,'A wall separates the red and blue passages');
for(const choice of [0,1]){const d=door(3,choice);for(const x of [45,46,47,48,49])assert.equal(room.map[d.y][x],0,'Each door has its own passage');}
console.log('OK: blue and red exits remain physically separate.');
