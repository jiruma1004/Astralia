const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),w={};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync('src/rooms/room-03/maze.js','utf8'),w);
const maze=new w.ConceptMaze({spawn:{x:2.5,y:8.5},environment:{kind:'interior'}},()=>{}),player={x:6.5,y:8.5};maze.routeTo=()=>[];
maze.tick(1,player);assert.equal(maze.speech,null,'Sin perseguidor no hay frases');maze.awaken(true);maze.grace=0;maze.tick(.1,player);assert.equal(maze.speech,'Soy inevitable');assert.equal(maze.speechLeft,3.5);
maze.tick(3.6,player);assert.equal(maze.speechLeft,0);maze.tick(6.5,player);assert.notEqual(maze.speech,'Soy inevitable');assert.equal(maze.tauntIndex,2);
maze.freezeLeft=7;const remaining=maze.tauntClock;maze.tick(1,player);assert.equal(maze.tauntClock,remaining,'Congelar suspende nuevas frases');maze.freezeLeft=0;maze.caught=true;maze.tick(20,player);assert.equal(maze.tauntIndex,2,'Después de captura no habla');maze.reset();assert.equal(maze.speech,null);assert.equal(maze.tauntIndex,0);
console.log('OK: frases solo al perseguir, primera frase, duración, intervalo, congelación, captura y reinicio.');
