const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/classroom/ranks.js','utf8'),ctx);const R=ctx.window.EpikRanks;
const room={id:'bridge',name:'Bridge',trial:true},state={solved:true,assisted:false,deaths:0,attempts:5,passedAttempt:5,incorrect:0};
const session={rooms:[room],state:()=>state,events:Array.from({length:5},(_,i)=>({room_id:'bridge',event_type:'attempt_result',objective_id:'plank-'+i,result:'correct',submitted_answer:'true'}))};
assert.equal(R.room(session,room).score,100,'five distinct correct answers are not five failed attempts');
for(const [score,stars] of [[0,1],[39,1],[40,2],[59,2],[60,3],[79,3],[80,4],[99,4],[100,5]])assert.equal(R.stars(score),stars);
for(const [errors,value] of [[0,100],[1,80],[2,60],[3,40],[4,20],[20,0]])assert.equal(R.academicValue(errors),value);
session.events.push({room_id:'bridge',event_type:'attempt_result',objective_id:'plank-0',result:'incorrect',submitted_answer:'movement'});assert.equal(R.room(session,room).score,100,'movement failure not counted twice');
session.events.push({room_id:'bridge',event_type:'attempt_result',objective_id:'plank-0',result:'interrupted'});assert.equal(R.room(session,room).score,100);
session.events.push({room_id:'bridge',event_type:'normal_help'});assert.equal(R.room(session,room).score,100);assert(R.room(session,room).hints);
state.deaths=3;assert.equal(R.room(session,room).score,94);state.deaths=100;assert.equal(R.room(session,room).score,80);
const corridor={id:'bridge',corridor:true};state.deaths=7;assert.equal(R.room(session,corridor).score,0);assert.equal(R.room(session,corridor).stars,1);
state.assisted=true;assert.equal(R.room(session,room).score,20);assert.equal(R.room(session,room).stars,1);assert(R.room(session,room).titles);
state.assisted=false;state.solved=false;assert.equal(R.room(session,room).stars,0);
assert.equal(R.titles.trial[2][0],'Pequeño Mapache Fanfarrón');assert.equal(R.titles.conceptual[4][0],'Maestro de la Teoría');
state.solved=true;state.deaths=0;assert.equal(R.room(session,{id:'bridge',physics:true}).weight,2);assert.equal(R.room(session,room).weight,1);
console.log('PASS star boundaries, answer-error scoring, deaths, no double penalties, hints, one-star AI and weighted calculations');

state.deaths=0;
for(let errors=0;errors<6;errors++){
 session.events=Array.from({length:errors},()=>({room_id:'bridge',event_type:'attempt_result',result:'incorrect',submitted_answer:'answer',objective_id:'q'}));
 const result=R.room(session,room);assert.equal(result.score,[100,84,68,52,36,20][errors]);assert.equal(result.stars,[5,4,3,2,1,1][errors]);
}
session.events=[];state.deaths=1;assert.equal(R.room(session,room).stars,4);
console.log('PASS stricter error scale, first-death penalty, one-star AI floor');
