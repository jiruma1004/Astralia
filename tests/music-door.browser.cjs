const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto(process.env.EPIK_TEST_URL||'http://127.0.0.1:8767/?dev=1');
  await page.evaluate(()=>document.querySelector('#epik-dev')?.close());
  assert.equal(await page.evaluate(()=>Sound.sceneTrack),'grassland');
  await page.evaluate(()=>prologue.advance());
  for(const expected of ['villain','villain','missing','grassland']){
   await page.evaluate(()=>{prologue.reveal();prologue.advance()});
   assert.equal(await page.evaluate(()=>Sound.sceneTrack),expected);
  }
  await page.evaluate(()=>{window.grasslandPlayId=Sound.playIds.grassland;prologue.reveal();prologue.advance()});
  assert(await page.evaluate(()=>arrival.active));
  assert.equal(await page.evaluate(()=>Sound.playIds.grassland),await page.evaluate(()=>grasslandPlayId),'Carriage keeps the same track without restarting');
  await page.evaluate(()=>{arrival.finish();document.querySelector('#maze-notice').hidden=true;});
  assert.equal(await page.evaluate(()=>Sound.sceneTrack),'grassland');
  for(const [kind,track] of [['trial','grassland'],['roulette','seal'],['conceptual','maze'],['physics','music']]){
   await page.evaluate(kind=>load(rooms.findIndex(r=>r[kind])),kind);assert.equal(await page.evaluate(()=>Sound.sceneTrack),track);
  }
  for(const name of ['grassland','ceremony','seal','maze']){
   const result=await page.evaluate(async name=>{const a=Sound.tracks[name];await new Promise((resolve,reject)=>{if(a.readyState>=1)return resolve();a.addEventListener('loadedmetadata',resolve,{once:true});a.addEventListener('error',()=>reject(new Error(name+' decode error')),{once:true});a.load()});return {duration:a.duration,loop:a.loop,src:a.src};},name);
   assert(result.duration>0);assert(result.loop);
  }
  for(const id of ['ceremonia-ignitia','ceremonia-karla']){
   await page.evaluate(id=>cinematics.play(id),id);await page.evaluate(()=>cinematics.ready);assert.equal(await page.evaluate(()=>Sound.sceneTrack),'ceremony');
   await page.evaluate(()=>document.querySelector('#cinema-replay').click());assert.equal(await page.evaluate(()=>Sound.sceneTrack),'ceremony');await page.evaluate(()=>cinematics.close());
  }
  // The first automatic prompt used to appear outside the confirmation radius.
  for(const distance of [2.35,2.39,2.1]){
   await page.evaluate(distance=>{load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:51-distance,y:4.5,jumpHeight:0});corridor.tick(.001,player)},distance);
   assert(await page.locator('#eric-ready').isVisible());await page.click('#eric-ready-yes');assert(await page.evaluate(()=>opened));assert(await page.evaluate(()=>classroom.session.state(rooms[index].id).solved));
   await page.evaluate(()=>document.querySelector('#eric-ready-yes').click());assert(await page.evaluate(()=>opened));
  }
  await page.evaluate(()=>{load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true;player.x=48.65;player.y=4.5;corridor.tick(.001,player)});
  await page.click('#eric-ready-wait');assert.equal(await page.evaluate(()=>opened),false);
  await page.evaluate(()=>{player.x=10;document.querySelector('#eric-ready-yes').click()});assert.equal(await page.evaluate(()=>opened),false);
  assert.deepEqual(errors,[]);console.log('PASS room music, MP3 metadata decode/loop, both ceremony routes/replay, first-click door at prompt edge, wait/far/double-click guards.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
