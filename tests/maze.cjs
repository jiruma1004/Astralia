const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={};world.window=world;vm.createContext(world);
for(const file of ['src/rooms/room-03/room.js','src/rooms/room-03/maze.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),world);
const room=world.ESCAPE_ROOMS[0],events=[],maze=new world.ConceptMaze(room,(type,text)=>events.push({type,text}));
const door=(stage,choice)=>maze.doors.find(d=>d.stage===stage&&d.choice===choice);
assert.equal(maze.choose(door(1,0)),null,'No responder desde otro tramo');
const wrong=door(0,0);assert.equal(maze.choose(wrong),false);assert.equal(maze.stage,0);assert.equal(maze.chasing,true,'El primer error despierta la presencia');
assert.equal(room.map[wrong.y][wrong.x],0,'La puerta incorrecta sí se abre');
assert.equal(room.map[wrong.y][wrong.x+2],0,'Hay un cuarto físico detrás');
assert.equal(room.map[wrong.y][wrong.x+4],1,'La pared del fondo impide pasar al siguiente tramo');
function pass(){const stage=maze.stage,d=door(stage,world.CONCEPT_QUESTIONS[stage].correct);assert.equal(maze.choose(d),true);assert.equal(room.map[d.y][d.x+4],0);maze.tick(.016,{x:d.x+5.3,y:d.y+.5});}
maze.reset();pass();assert.equal(maze.chasing,false,'Primera puerta correcta sin persecución');
const second=door(1,world.CONCEPT_QUESTIONS[1].correct);maze.choose(second);assert.equal(maze.chasing,true,'La segunda puerta correcta activa la presencia aun sin errores');const presenceCount=events.filter(e=>e.type==='presence').length;maze.choose(second);assert.equal(events.filter(e=>e.type==='presence').length,presenceCount,'No repetir aparición');
maze.reset();pass();assert.equal(maze.stage,1);const w2=door(1,0);assert.equal(maze.choose(w2),false);assert.equal(maze.stage,1,'Equivocarse no teletransporta');assert.equal(maze.chasing,true);
const target={x:w2.x-.8,y:w2.y+.5};let traveled=0;maze.grace=0;
for(let i=0;i<450;i++){const prev={...maze.enemy};maze.tick(.02,target);traveled+=Math.hypot(maze.enemy.x-prev.x,maze.enemy.y-prev.y);for(const [dx,dy] of [[-.15,-.15],[.15,-.15],[-.15,.15],[.15,.15]])assert.equal(room.map[Math.floor(maze.enemy.y+dy)][Math.floor(maze.enemy.x+dx)],0,'Ivan no atraviesa muros ni corta esquinas');}
assert(traveled>6.7&&traveled<6.9,'La persecución mantiene 0.756 celdas/s');
for(let i=0;i<2000&&!maze.caught;i++)maze.tick(.02,target);
assert.equal(maze.caught,true,'Ivan puede entrar en un cuarto incorrecto y alcanzar al jugador');assert.equal(events.at(-1).type,'caught');const count=events.length;maze.tick(.5,target);assert.equal(events.length,count,'Una sola muerte');assert.equal(maze.stage,1,'La muerte espera a que se pulse continuar');
const safe=maze.restoreCheckpoint(1);assert.equal(maze.stage,1);assert.equal(maze.chasing,false);assert.equal(maze.caught,false);assert.equal(room.map[8][8],0,'La puerta correcta anterior se conserva');assert.equal(room.map[w2.y][w2.x],2,'El cuarto equivocado vuelve a cerrarse');assert.equal(safe.x,13.5);assert.equal(room.map[Math.floor(safe.y)][Math.floor(safe.x)],0);
for(let i=1;i<4;i++)pass();assert.equal(maze.finished,true);assert.equal(events.at(-1).type,'complete');assert.equal(room.canUnlock({mazeSolved:true}),true);assert.equal(room.canUnlock({prototypeMode:true}),false);
maze.restoreCheckpoint(2);assert.equal(maze.chasing,true,'Dos puertas previas mantienen la condición al reaparecer');assert(maze.grace>0,'Breve margen para orientarse al volver');
maze.reset();assert.equal(maze.stage,0);assert.equal(maze.finished,false);
console.log('OK: puertas transitables, cuartos sin salida, avance solo por ruta correcta, persecución sin cortar muros, captura única y recuperación del último tramo seguro.');

maze.reset();const bad=door(0,0);maze.choose(bad);const traveler={x:bad.x+.1,y:bad.y+.5};maze.tick(.016,traveler);
assert.equal(maze.dungeon,true);assert.equal(maze.doors.length,2);assert.equal(room.environment.moss,true);assert.equal(traveler.x,6.5);assert.equal(maze.chasing,true);
const openedMap=maze.savedWorld.map;const no=maze.doors.find(d=>!d.correct);maze.choose(no);assert.equal(maze.dungeon,true,'Un error en el sello no permite salir');
maze.choose(maze.doors.find(d=>d.correct));assert.equal(maze.dungeon,false);assert.equal(maze.stage,0);assert.equal(room.map,openedMap);assert.equal(room.map[bad.y][bad.x],0,'La puerta incorrecta permanece abierta');assert(maze.openDoors.has('0:0'));assert.equal(events.at(-1).type,'return');
traveler.x=bad.x+.1;traveler.y=bad.y+.5;maze.tick(.016,traveler);assert(maze.dungeon,'Cruzar otra vez el portal vuelve a castigar');maze.restoreCheckpoint(0);assert.equal(maze.dungeon,false);assert.equal(room.environment.moss,undefined);
console.log('OK: portal, quiz de dos puertas, error sin escape, retorno al inicio, puerta abierta conservada, reentrada y recuperación tras muerte.');
