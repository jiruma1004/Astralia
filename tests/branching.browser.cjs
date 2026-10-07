const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:8765');await page.locator('#story-skip').click();await page.locator('#maze-understood').click();
 await page.evaluate(()=>Promise.all(CINEMATICS.map(scene=>cinematics.assets.preload(scene.id))));
 assert.equal(await page.evaluate(()=>rooms[index].trial),true);assert.equal(await page.locator('#rooms button').count(),7);
 await page.evaluate(()=>{tick(16);companions.help();companions.finishDialogue();});assert.match(await page.locator('#paola-text').textContent(),/hacia dónde/);
 await page.evaluate(()=>{companions.closeHelp();Object.assign(player,{x:4.05,y:2.95,angle:0});jump();keys.add('w');for(let n=0;n<58;n++)tick(last+16);keys.clear();});
 assert.equal(await page.evaluate(()=>death?.type),'pit');assert.equal(await page.evaluate(()=>trial.stage),0);
 await page.evaluate(()=>{respawn();Object.assign(player,{x:4.05,y:4.75,angle:0});jump();keys.add('w');for(let n=0;n<54;n++)tick(last+16);keys.clear();});
 assert.equal(await page.evaluate(()=>death),null);assert.equal(await page.evaluate(()=>trial.stage),1);
 for(let stage=1;stage<5;stage++){
  const result=await page.evaluate(stage=>{
   const p=trial.platforms().find(p=>p.stage===stage&&p.answer===APPROACH_QUESTIONS[stage].answer),tx=p.x+.7,ty=p.y+.7;
   player.x+=.3;player.angle=Math.atan2(ty-player.y,tx-player.x);jump();keys.add('w');keys.add('shift');
   for(let n=0;n<54;n++){if(Math.hypot(player.x-tx,player.y-ty)<.12)keys.clear();tick(last+16);}keys.clear();
   return {stage:trial.stage,death:death?.type,x:player.x,y:player.y};
  },stage);assert.equal(result.death,undefined,JSON.stringify(result));assert.equal(result.stage,stage+1);
 }
 assert.equal(await page.evaluate(()=>opened),true);
 await page.evaluate(()=>{Object.assign(player,{x:15.5,y:4.75,angle:0});jump();keys.add('w');keys.add('shift');for(let n=0;n<60;n++)tick(last+16);keys.clear();});
 assert.equal(await page.evaluate(()=>rooms[index].id),'room-01');
 // Both electron doors are valid and have separate exits; no third door.
 for(const choice of [0,1]){
  await page.evaluate(choice=>{load(2);document.querySelector('#maze-notice').hidden=true;maze.restoreCheckpoint(3);const ds=maze.doors.filter(d=>d.stage===3);window.lastDoors=ds.map(d=>({correct:d.correct,text:d.text}));maze.choose(ds[choice],player);Object.assign(player,{x:48.3,y:ds[choice].y+.5});maze.tick(.016,player);},choice);
  assert.deepEqual(await page.evaluate(()=>lastDoors),[{correct:true,text:'Partícula'},{correct:true,text:'Onda'}]);
  assert.equal(await page.evaluate(()=>StoryRoute.choice),choice===0?'particle':'wave');assert.equal(await page.evaluate(()=>maze.finished),true);
  await page.evaluate(()=>tick(last+16));assert.equal(await page.evaluate(()=>rooms[index].corridor),true,'Each separate exit leads into the corridor');
  await page.evaluate(()=>{load(3);document.querySelector('#maze-notice').hidden=true;die('symbol');respawn();});assert.equal(await page.evaluate(()=>StoryRoute.choice),choice===0?'particle':'wave');
 }
 async function advanceAll(id){
  assert.equal(await page.evaluate(()=>cinematics.item.id),id);
  if(await page.evaluate(()=>!cinematics.dialogueStops)){await page.evaluate(()=>{const id=cinematics.item.id;for(let t=0;t<70&&cinematics.item?.id===id;t++)cinematics.tick(1);});return;}
  const n=await page.evaluate(()=>cinematics.dialogueStops.length);
  for(let i=0;i<n;i++){
   await page.evaluate(()=>{cinematics.paused=false;cinematics.tick(100);});
   const before=await page.evaluate(()=>({time:cinematics.time,index:cinematics.dialogueIndex,id:cinematics.item.id}));
   await page.evaluate(()=>cinematics.tick(100));assert.equal(await page.evaluate(()=>cinematics.time),before.time,'dialogue must wait');
   await page.evaluate(()=>{cinematics.inputAfter=0;cinematics.advanceDialogue();cinematics.advanceDialogue();});
   if(i<n-1)assert.equal(await page.evaluate(()=>cinematics.dialogueIndex),i+1,'double click advances once');
  }
 }
 for(const route of ['particle','wave']){
  await page.evaluate(route=>{load(5);document.querySelector('#maze-notice').hidden=true;StoryRoute.choose(route);Object.assign(player,{x:6,y:5.5,angle:0});ignitia.open(player);
   window.flow=[];if(!window.basePlay)window.basePlay=cinematics.play.bind(cinematics);cinematics.play=(id,o)=>{flow.push(id);return basePlay(id,o);};
   const s=ignitia.simulator;s.missionTime=20;const duration=100,delay=10,t=20+duration+delay,vx=InterceptionPhysics.eric(t).x/duration,vy=(InterceptionPhysics.eric(t).y+.5*.00981*duration*duration)/duration;
   s.params={speed:Math.hypot(vx,vy),angle:Math.atan2(vy,vx)*180/Math.PI,delay,duration};s.sync();s.startTrial();for(let n=0;n<200&&s.running;n++)s.tick(.04);
  },route);
  await advanceAll('ignitia-intercepcion');
  const ceremony=route==='particle'?'ceremonia-ignitia':'ceremonia-karla',secret=route==='particle'?'eric-fuga':'ivan-descenso';
  await advanceAll(ceremony);
  assert(await page.locator('#ceremony-certificate').isVisible());assert.equal(await page.locator('.certificate-score').textContent(),'7 / 7');
  await page.evaluate(()=>cinematics.tick(100));assert.equal(await page.evaluate(()=>cinematics.item.id),ceremony);
  await page.evaluate(()=>{cinematics.inputAfter=0;document.querySelector('#certificate-continue').click();document.querySelector('#certificate-continue').click();});
  assert.equal(await page.evaluate(()=>cinematics.item.id),secret);
  await advanceAll(secret);
  assert.equal(await page.evaluate(()=>ignitia.mode),'ending');assert(await page.locator('#chapter-ending').isVisible());
  assert.deepEqual(await page.evaluate(()=>flow),['ignitia-intercepcion',ceremony,secret]);
  // A new full run resets the mission clock (a room reload is only a preview).
  await page.evaluate(()=>mission.restart());
 }
 await page.evaluate(()=>{load(0);document.querySelector('#maze-notice').hidden=true;cinematics.play('ceremonia-karla');cinematics.finish();cinematics.inputAfter=0;cinematics.requestClose();});
 assert.equal(await page.evaluate(()=>completed),false);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: five real jumps, wrong landing/checkpoint, both routes, click gates/double click, 7/7, diploma secrets, gallery isolation.');
})().catch(e=>{console.error(e);process.exit(1)});
