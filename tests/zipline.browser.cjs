const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);newClassroomGame();document.querySelector('#maze-notice').hidden=true;});
 for(let i=0;i<2;i++){await p.evaluate(()=>{die('pit');respawn();classroom.aid.update()});assert(await p.locator('#extra-help').isHidden());}
 await p.evaluate(()=>{die('pit');respawn();classroom.aid.update()});assert(await p.locator('#extra-help').isVisible());assert.equal(await p.locator('#extra-help b').innerText(),'Ayuda IA');
 await p.click('#extra-help');await p.evaluate(()=>{classroom.aid.open();jump();interact()});assert(await p.evaluate(()=>trial.zipline.active));assert(await p.locator('#extra-help-panel').isHidden());assert(await p.evaluate(()=>classroom.session.state(rooms[index].id).assisted));
 await p.evaluate(()=>{for(let i=0;i<88;i++)tick(last+40)});assert(await p.evaluate(()=>player.x>4.2&&player.x<16.7&&player.jumpHeight>0&&!death));
 await p.locator('#game').screenshot({path:'/tmp/epik-zipline.png'});
 await p.evaluate(()=>{mission.pause();window.beforeZip=trial.zipline.time;tick(last+40)});assert.equal(await p.evaluate(()=>trial.zipline.time),await p.evaluate(()=>beforeZip));
 await p.evaluate(()=>{mission.resume();for(let i=0;i<110;i++)tick(last+40)});assert(await p.evaluate(()=>trial.finished&&opened&&!death&&!trial.zipline.active));assert(await p.evaluate(()=>player.x===17.6&&player.jumpHeight===0));
 const state=await p.evaluate(()=>classroom.session.state(rooms[index].id));assert(state.assisted&&state.solved);assert.equal(state.attempts,3);assert.equal(state.deaths,3);assert(await p.locator('#extra-help').isHidden());
 await p.evaluate(()=>{player.x=18.6;tick(last+40)});assert(await p.evaluate(()=>rooms[index].physics));assert(!await p.evaluate(()=>classroom.session.state(rooms[index].id).assisted));
 await p.evaluate(()=>{load(rooms.findIndex(r=>r.trial));document.querySelector('#maze-notice').hidden=true});assert.equal(await p.evaluate(()=>trial.zipline),undefined);
 assert.deepEqual(errors,[]);console.log('PASS third-failure unlock, penalty, no fake correct attempts, single ride, pause, safe landing, next room, reset, no JS errors');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
