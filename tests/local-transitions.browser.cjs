const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1440,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>window.requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');
 await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);mission.restart();classroom.session.start()});
 for(const choice of [0,1]){
  await p.evaluate(choice=>{load(rooms.findIndex(r=>r.conceptual));mission.restart();document.querySelector('#maze-notice').hidden=true;maze.restoreCheckpoint(3);window.exitDoor=maze.doors.find(d=>d.branch&&d.choice===choice);Object.assign(player,{x:43.3,y:exitDoor.y+.5,angle:0,pitch:0});},choice);
  assert.equal(await p.evaluate(()=>advanceRoom(rooms.findIndex(r=>r.corridor))),false,'unsolved preview cannot advance');
  await p.evaluate(()=>{maze.choose(exitDoor,player);maze.freezeLeft=100;Object.assign(player,{x:rooms[index].exitX-.15,y:exitDoor.y+.5});});
  assert.deepEqual(await p.evaluate(()=>renderer.exitPortals(rooms[index],opened)),[{x:48.25,y:choice===0?6:10}]);
  await p.evaluate(()=>{keys.add('w');for(let i=0;i<8;i++)tick(last+40);keys.clear()});
  assert(await p.evaluate(()=>!!rooms[index].corridor),'walk through selected maze portal enters corridor');
  assert.equal(await p.evaluate(()=>classroom.session.preview),true,'preview stays excluded from real certificates');
 }
 await p.evaluate(()=>{Object.assign(player,{x:49,y:4.5,angle:0,pitch:0});document.querySelector('#maze-notice').hidden=true;corridor.tick(.001,player)});
 await p.click('#eric-ready-yes');assert(await p.evaluate(()=>opened));
 assert.deepEqual(await p.evaluate(()=>renderer.exitPortals(rooms[index],opened)),[{x:51.65,y:4}]);
 await p.evaluate(()=>{renderer.draw(rooms[index],player,opened,0,1000,null,null)});await p.locator('#game').screenshot({path:'/tmp/epik-corridor-exit-portal.png'});
 const slices=await p.evaluate(()=>{const c=renderer.ctx,orig=c.drawImage.bind(c);let n=0;c.drawImage=(img,...args)=>{if(img===renderer.art.portalOpen)n++;orig(img,...args)};renderer.draw(rooms[index],player,opened,0,1000,null,null);c.drawImage=orig;return n});assert(slices>10,'corridor portal visible at real crossing');
 await p.evaluate(()=>{player.x=51.5;keys.add('w');for(let i=0;i<8;i++)tick(last+40);keys.clear()});
 assert(await p.evaluate(()=>!!rooms[index].boss),'first confirmation then walk enters Eric room');
 await p.evaluate(()=>{classroom.session.preview=false});assert.equal(await p.evaluate(()=>advanceRoom(rooms.findIndex(r=>r.rocket))),false,'normal prerequisite validation remains enforced');
 assert.deepEqual(errors,[]);console.log('PASS both maze branches and corridor physical crossings in local preview; unsolved preview and normal progression guards; portal rendered at exit.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
