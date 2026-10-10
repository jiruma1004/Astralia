const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
 for(const choice of ['particle','wave']){
  const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[],requested=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requested.push(r.url()));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto(process.env.EPIK_TEST_URL||'http://127.0.0.1:8765/?dev=1');await page.evaluate(()=>document.querySelector('#epik-dev')?.close());await page.locator('#story-skip').click();
  assert(!requested.some(x=>x.includes('applause-')&&x.endsWith('.webp')));
  await page.evaluate(choice=>{
   StoryRoute.choose(choice);load(rooms.findIndex(r=>r.rocket));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:6,y:5.5,angle:0});ignitia.open(player);
   window.flow=[];const play=cinematics.play.bind(cinematics);cinematics.play=(id,opts)=>{flow.push(id);return play(id,opts)};
   const s=ignitia.simulator;s.missionTime=20;const duration=100,delay=10,t=20+duration+delay,vx=InterceptionPhysics.eric(t).x/duration,vy=(InterceptionPhysics.eric(t).y+.5*.00981*duration*duration)/duration;
   s.params={speed:Math.hypot(vx,vy),angle:Math.atan2(vy,vx)*180/Math.PI,delay,duration};s.sync();s.startTrial();for(let n=0;n<200&&s.running;n++)s.tick(.04);
  },choice);
  assert.equal(await page.evaluate(()=>cinematics.item.id),'ignitia-intercepcion');await page.evaluate(()=>cinematics.ready);
  await page.evaluate(()=>{ignitia.startLaunch();ignitia.startLaunch();for(let i=0;i<63&&cinematics.item.id==='ignitia-intercepcion';i++)cinematics.tick(1)});
  const ceremony=choice==='particle'?'ceremonia-ignitia':'ceremonia-karla',secret=choice==='particle'?'eric-fuga':'ivan-descenso';
  assert.equal(await page.evaluate(()=>cinematics.item.id),ceremony);await page.evaluate(()=>cinematics.ready);
  const advance=async()=>page.evaluate(()=>{while(cinematics.dialogueIndex<cinematics.dialogueStops.length&&cinematics.active){const id=cinematics.item.id;cinematics.time=cinematics.dialogueStops[cinematics.dialogueIndex];cinematics.dialogueWaiting=true;cinematics.inputAfter=0;cinematics.advanceDialogue();if(cinematics.item?.id!==id)break;}});
  await advance();await page.evaluate(()=>cinematics.tick(20));assert(await page.locator('#ceremony-certificate').isVisible());
  assert.deepEqual(await page.evaluate(()=>flow),['ignitia-intercepcion',ceremony]);
  await page.evaluate(()=>{cinematics.inputAfter=0;document.querySelector('#certificate-continue').click();document.querySelector('#certificate-continue').click()});
  assert.equal(await page.evaluate(()=>cinematics.item.id),secret);await page.evaluate(()=>cinematics.ready);
  if(choice==='wave'){
   for(const t of [11.6,30]){await page.evaluate(t=>{cinematics.time=t;cinematics.draw()},t);await page.locator('#cinema-canvas').screenshot({path:'/tmp/epik-ivan-'+t+'.png'});}
  }
  await advance();assert.equal(await page.evaluate(()=>ignitia.mode),'credits');
  assert(await page.locator('#chapter-ending').isHidden());
  await page.evaluate(()=>{ignitia.beginCredits();ignitia.beginCredits();});
  assert.equal(await page.evaluate(()=>cinematics.active),false);
  assert.deepEqual(await page.evaluate(()=>flow),['ignitia-intercepcion',ceremony,secret]);
  assert(!requested.some(x=>x.includes('applause-')&&x.endsWith('.webp')),'No applause images loaded in main story');
  assert(!requested.some(url=>url.includes(choice==='particle'?'karla-white-sweater.webp':'paola-glasses-a-gesture.webp')),'Unchosen ceremony asset stays unloaded');
  assert.equal(await page.evaluate(()=>ignitia.mode),'credits');assert(await page.locator('#epik-credits').isVisible());
  assert.equal(await page.locator('#credits-list section').count(),1);
  assert.equal(await page.locator('#credits-next').count(),0);
  await page.evaluate(()=>ignitia.credits.tick(5));
  for(let i=0;i<5;i++){
   await page.evaluate(()=>ignitia.credits.bloopers.ready);
   assert.equal(await page.evaluate(()=>ignitia.credits.bloopers.index),i);
   assert.equal(await page.evaluate(()=>ignitia.credits.step),1+i*2);
   assert(await page.locator('#epik-credits').isVisible());assert(await page.locator('#epik-bloopers').isVisible());
   assert(await page.locator('#blooper-next').isHidden());assert(await page.locator('#credits-close').isHidden());
   await page.evaluate(()=>ignitia.credits.tick(7.2));
   assert.equal(await page.evaluate(()=>ignitia.credits.step),2+i*2);
   assert.equal(await page.locator('#credits-list section').count(),1);
   if(choice==='wave'){
    await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
    await page.locator('#epik-credits').screenshot({path:'/tmp/epik-credits-mobile-'+i+'.png'});
    await page.setViewportSize({width:1440,height:1050});await page.waitForTimeout(100);
    await page.locator('#epik-credits').screenshot({path:'/tmp/epik-credits-blooper-'+i+'.png'});
   }
   await page.evaluate(()=>ignitia.credits.tick(6.9));
  }
  assert.equal(await page.evaluate(()=>ignitia.credits.phase),'final');
  assert(await page.locator('#credits-player').isVisible());assert(await page.locator('#epik-bloopers').isHidden());
  assert.equal(await page.evaluate(()=>ignitia.mode),'credits');
  await page.evaluate(()=>{ignitia.credits.inputAfter=0;document.querySelector('#credits-close').click();document.querySelector('#credits-close').click()});
  assert.equal(await page.evaluate(()=>ignitia.mode),'ending');assert(await page.locator('#epik-credits').isHidden());
  assert.deepEqual(errors,[]);await page.close();
 }
 const page=await browser.newPage();await page.addInitScript(()=>window.requestAnimationFrame=()=>0);await page.goto(process.env.EPIK_TEST_URL||'http://127.0.0.1:8765/?dev=1');await page.evaluate(()=>document.querySelector('#epik-dev')?.close());await page.locator('#story-skip').click();
 // Real cannon lifecycle, including a new shot while an old close countdown exists.
 await page.evaluate(()=>{load(0);document.querySelector('#maze-notice').hidden=true;lab.v.value='10';lab.a.value='35';lab.az.value='0';lab.selected=0;lab.loadAmmo();lab.launch(()=>{});lab.tick(10)});
 assert(await page.locator('#trajectory-hologram').isVisible());await page.evaluate(()=>lab.tick(2.9));assert(await page.locator('#trajectory-hologram').isVisible());await page.evaluate(()=>lab.tick(.11));assert(await page.locator('#trajectory-hologram').isHidden());
 await page.evaluate(()=>{lab.loadAmmo();lab.launch(()=>{});lab.tick(10);lab.tick(2.8);lab.loadAmmo();lab.launch(()=>{});lab.tick(.3)});assert(await page.locator('#trajectory-hologram').isVisible());assert.equal(await page.evaluate(()=>lab.hologram.closeAfter),null);
 await page.evaluate(()=>{load(0);document.querySelector('#maze-notice').hidden=true;const c=classroom.context();classroom.session.attempt(c,'bad',{},false);classroom.session.attempt(c,'bad',{},false);classroom.aid.update()});
 // This new room retained earlier misses; use a new session for the threshold assertion.
 await page.evaluate(()=>{classroom.newSession();load(0);classroom.session.start();document.querySelector('#maze-notice').hidden=true;const c=classroom.context();classroom.session.attempt(c,'bad',{},false);classroom.session.attempt(c,'bad',{},false);classroom.aid.update()});assert(await page.locator('#extra-help').isHidden());
 await page.evaluate(()=>{classroom.session.attempt(classroom.context(),'bad',{},false);classroom.aid.update()});assert(await page.locator('#extra-help').isVisible());
 console.log('PASS both solved-simulation routes, single launch, diploma gate, epilogues, direct credits without applause, dedup, progressive assets, hologram expiry/relaunch, IA at 3 failures');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
