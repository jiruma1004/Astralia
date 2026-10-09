const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const w={ESCAPE_ROOMS:[]};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync('src/rooms/room-00/approach.js','utf8'),w);const events=[],room=w.ESCAPE_ROOMS[0],trial=new w.ApproachTrial(room,t=>events.push(t));
const bad=trial.platforms()[0],good=trial.platforms()[1];
trial.land({x:bad.x+.7,y:bad.y+.7,jumpHeight:0});assert.equal(events[0],'break');assert(!trial.supports(bad.x+.7,bad.y+.7));trial.restore();assert(!trial.supports(bad.x+.7,bad.y+.7),'Respawn preserves broken wood');trial.land({x:bad.x+.7,y:bad.y+.7,jumpHeight:0});assert.equal(events.length,1,'No repeated break sound');
trial.land({x:good.x+.7,y:good.y+.7,jumpHeight:0});assert.equal(trial.stage,1,'False is correct in question one');assert(trial.supports(good.x+.7,good.y+.7));
// A skipped question must not permanently remove its correct platform.
const future=trial.platforms().find(p=>p.stage===3&&p.answer===true);trial.land({x:future.x+.7,y:future.y+.7,jumpHeight:0});assert(!trial.broken.has(future.key));
const fresh=new w.ApproachTrial(room,()=>{});assert(fresh.supports(bad.x+.7,bad.y+.7));console.log('OK: wrong planks remain broken, valid False survives, sound event once, skips cannot destroy the solution and room reset restores wood.');

// Even without choosing any wrong answer, exactly five boards survive.
const perfect=new w.ApproachTrial(room,()=>{});
for(let stage=0;stage<5;stage++){
 const correct=perfect.platforms().find(p=>p.stage===stage&&p.answer===w.APPROACH_QUESTIONS[stage].answer);
 const incorrect=perfect.platforms().find(p=>p.stage===stage&&p!==correct);
 perfect.land({x:correct.x+.7,y:correct.y+.7,jumpHeight:0});
 assert(perfect.supports(correct.x+.7,correct.y+.7));
 assert(!perfect.supports(incorrect.x+.7,incorrect.y+.7));
 perfect.restore();assert(!perfect.supports(incorrect.x+.7,incorrect.y+.7));
}
assert.equal(perfect.platforms().filter(p=>!perfect.broken.has(p.key)).length,5);
