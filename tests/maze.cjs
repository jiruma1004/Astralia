const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const world={};world.window=world;vm.createContext(world);
for(const file of ['src/rooms/room-03/room.js','src/rooms/room-03/maze.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),world);
const room=world.ESCAPE_ROOMS[0],events=[],maze=new world.ConceptMaze(room,(type,text)=>events.push({type,text}));
const door=(stage,choice)=>maze.doors.find(d=>d.stage===stage&&d.choice===choice);
assert.equal(maze.choose(door(1,0)),null,'No responder desde otro tramo');
assert.equal(maze.choose(door(0,0)),false);assert.equal(maze.stage,0);assert.equal(maze.chasing,false);
function pass(){const stage=maze.stage,d=door(stage,world.CONCEPT_QUESTIONS[stage].correct);assert.equal(maze.choose(d),true);assert.equal(room.map[d.y][d.x],0);maze.tick(.016,{x:d.x+1.3,y:d.y+.5});}
pass();assert.equal(maze.stage,1);assert.equal(maze.choose(door(1,0)),false);assert.equal(maze.stage,0);assert.equal(maze.chasing,true);assert.equal(room.map[6][8],2,'El error vuelve a cerrar el recorrido');
const target={x:6.5,y:9.5},startDistance=Math.hypot(maze.enemy.x-target.x,maze.enemy.y-target.y);
let traveled=0;for(let i=0;i<450;i++){const prev={...maze.enemy};maze.tick(.02,target);traveled+=Math.hypot(maze.enemy.x-prev.x,maze.enemy.y-prev.y);assert.equal(room.map[Math.floor(maze.enemy.y)][Math.floor(maze.enemy.x)],0,'Ivan no atraviesa muros');}
assert(traveled>5&&traveled<6.6,'La persecución avanza a velocidad lenta');
assert(Math.hypot(maze.enemy.x-target.x,maze.enemy.y-target.y)<startDistance,'Rodea el contrafuerte');
maze.tick(.016,{...maze.enemy});assert.equal(events.at(-1).type,'caught');assert.equal(maze.chasing,true);assert.equal(maze.stage,0);
maze.reset();for(let i=0;i<4;i++)pass();assert.equal(maze.finished,true);assert.equal(events.at(-1).type,'complete');assert.equal(room.canUnlock({mazeSolved:true}),true);assert.equal(room.canUnlock({prototypeMode:true}),false);
maze.reset();assert.equal(maze.chasing,false);assert.equal(maze.stage,0);assert.equal(maze.finished,false);
console.log('OK: 4 tramos, puerta correcta, error y reinicio, despertar desde tramo II, persecución lenta sin cruzar muros, captura y salida.');
