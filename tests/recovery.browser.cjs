const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try {
  const p=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>window.requestAnimationFrame=()=>0);
  const url=(process.env.EPIK_TEST_BASE_URL||'http://127.0.0.1:8767')+'/?dev=1';
  await p.goto(url);await p.evaluate(()=>document.querySelector('#epik-dev')?.close());
  await p.locator('#adventure-start').click();
  assert.equal(await p.evaluate(()=>prologue.started),false,'Name is required');
  await p.locator('#story-student-name').fill('  Jesús Iván <EPI>  ');
  await p.evaluate(async()=>{await prologue.images.paola.decode();prologue.drawFace()});
  await p.locator('#adventure-intro').screenshot({path:'/tmp/epik-name.png'});
  await p.locator('#story-skip').click();
  await p.evaluate(()=>{
   classroom.session.preview=false;document.querySelector('#maze-notice').hidden=true;
   const tile=trial.platforms().find(p=>p.stage===0&&p.answer===trial.question.answer);
   Object.assign(player,{x:tile.x+.5,y:tile.y+.5,jumpHeight:0});trial.land(player);
   for(let n=0;n<3;n++){die('pit');respawn();}
   companions.help();companions.closeHelp();classroom.aid.open(); // penalized zipline in progress
   recovery.save();
  });
  const first=await p.evaluate(()=>JSON.parse(localStorage.getItem(EpikRecovery.key)));
  await p.reload();
  assert(await p.locator('#recovery-dialog').isVisible());
  await p.evaluate(()=>document.querySelector('#epik-dev')?.close());
  await p.locator('#recovery-dialog').screenshot({path:'/tmp/epik-recovery.png'});
  const stamp=await p.evaluate(()=>JSON.parse(localStorage.getItem(EpikRecovery.key)).savedAt);
  await p.evaluate(()=>recovery.save());
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem(EpikRecovery.key)).savedAt),stamp,'Prompt cannot extend the save');
  await p.locator('#recovery-yes').click();
  assert.equal(await p.evaluate(()=>classroom.session.studentName),'Jesús Iván <EPI>');
  assert.equal(await p.evaluate(()=>classroom.session.id),first.session.id);
  assert.equal(await p.evaluate(()=>trial.stage),1);
  assert(await p.evaluate(()=>trial.broken.has('0:true')));
  assert.equal(await p.evaluate(()=>classroom.session.state(rooms[index].id).deaths),3);
  assert(await p.evaluate(()=>classroom.session.state(rooms[index].id).assisted));
  assert.equal(await p.evaluate(()=>classroom.session.events.filter(e=>e.event_type==='normal_help').length),1);
  assert.equal(await p.evaluate(()=>player.jumpHeight),0);
  // Exercise each room's state adapter with a valid progression fixture.
  async function enterRoom(kind) {
   await p.evaluate(kind=>{
    const r=rooms.find(r=>r[kind]);
    for(const x of ADVENTURE_ORDER){if(x===r)break;classroom.session.state(x.id).solved=true;}
    load(rooms.indexOf(r));classroom.session.preview=false;
    document.querySelector('#maze-notice').hidden=true;
   },kind);
  }
  async function reload(){
   await p.evaluate(()=>recovery.save());await p.reload();
   await p.evaluate(()=>document.querySelector('#epik-dev')?.close());
   await p.locator('#recovery-yes').click();
   assert(await p.locator('#recovery-dialog').isHidden());
  }
  await enterRoom('physics');
  const target=await p.evaluate(()=>{
   lab.target.miss();lab.target.miss();lab.target.miss();
   lab.v.value='14';lab.a.value='42';lab.update();
   const s=classroom.session;s.attempt(classroom.context(),'wrong',{},false);s.attempt(classroom.context(),'wrong',{},false);s.attempt(classroom.context(),'wrong',{},false);classroom.aid.open();
   return rooms[index].physics.targetX;
  });
  await reload();
  assert.equal(await p.evaluate(()=>rooms[index].physics.targetX),target);
  assert.equal(await p.evaluate(()=>lab.a.value),'42');
  assert(await p.evaluate(()=>classroom.session.state(rooms[index].id).assisted));
  await enterRoom('roulette');await p.evaluate(()=>roulette.present(6));await reload();
  assert.equal(await p.evaluate(()=>roulette.current.id),7);
  await enterRoom('conceptual');
  await p.evaluate(()=>{maze.choose(maze.doors.find(d=>d.stage===0&&!d.correct),player);maze.usedFreezeButtons.add('dungeon-1')});
  await reload();assert(await p.evaluate(()=>maze.dungeon));assert(await p.evaluate(()=>maze.freezeUsed));
  await p.evaluate(()=>maze.choose(maze.doors.find(d=>d.correct),player));
  assert.equal(await p.evaluate(()=>maze.dungeon),false);
  await enterRoom('corridor');await reload();assert(await p.evaluate(()=>!!corridor));
  await enterRoom('boss');
  const variant=await p.evaluate(()=>{boss.puzzle.cuts[0]=true;return boss.puzzle.support.id});
  await reload();assert.equal(await p.evaluate(()=>boss.puzzle.support.id),variant);assert(await p.evaluate(()=>boss.puzzle.cuts[0]));
  await enterRoom('rocket');
  await p.evaluate(()=>{ignitia.simulator.missionTime=25;ignitia.simulator.params.angle=55});
  await reload();assert((await p.evaluate(()=>ignitia.simulator.missionTime))>=25);
  assert.equal(await p.evaluate(()=>ignitia.simulator.params.angle),55);
  // Offline time is deducted. Alter the fixture only after disabling pagehide saves.
  await p.evaluate(()=>{recovery.save();recovery.enabled=false;const d=JSON.parse(localStorage.getItem(EpikRecovery.key));d.savedAt-=60000;d.remaining=500;localStorage.setItem(EpikRecovery.key,JSON.stringify(d))});
  await p.reload();await p.evaluate(()=>document.querySelector('#epik-dev')?.close());await p.locator('#recovery-yes').click();
  assert((await p.evaluate(()=>mission.remaining))<=440);
  // A completed mission can still recover the diploma after power loss.
  await p.evaluate(()=>{
   for(const r of ADVENTURE_ORDER)classroom.session.state(r.id).solved=true;
   classroom.session.route='wave';StoryRoute.choose('wave');
   classroom.session.finish();mission.finish();recovery.save();
  });
  await reload();
  await p.evaluate(()=>cinematics.ready);
  assert.equal(await p.evaluate(()=>cinematics.item.id),'ceremonia-karla');
  assert.equal(await p.locator('#certificate-student').textContent(),'Jesús Iván <EPI>');
  assert.equal(await p.locator('#certificate-student epi').count(),0,'Name is text, never markup');
  assert(await p.evaluate(()=>classroom.session.totals().valid));
  await p.evaluate(()=>{cinematics.time=38;cinematics.draw()});
  await p.locator('#ceremony-certificate').screenshot({path:'/tmp/epik-named-diploma.png'});
  // Expiry also applies to completed games and cannot be renewed by reload.
  await p.evaluate(()=>{recovery.save();recovery.enabled=false;const d=JSON.parse(localStorage.getItem(EpikRecovery.key));d.savedAt-=420001;localStorage.setItem(EpikRecovery.key,JSON.stringify(d))});
  await p.reload();
  assert(await p.locator('#recovery-dialog').isHidden());
  assert.equal(await p.evaluate(()=>localStorage.getItem(EpikRecovery.key)),null);
  assert(await p.locator('#adventure-intro').isVisible());
  // Malformed saves fail closed without breaking the introduction.
  await p.evaluate(()=>localStorage.setItem(EpikRecovery.key,'{broken'));
  await p.reload();assert(await p.locator('#adventure-intro').isVisible());
  // A valid save that expires while the question is open must not restore.
  await p.evaluate(first=>{first.savedAt=Date.now();localStorage.setItem(EpikRecovery.key,JSON.stringify(first))},first);
  await p.reload();await p.evaluate(()=>document.querySelector('#epik-dev')?.close());
  await p.evaluate(()=>{const future=Date.now()+EpikRecovery.ttl+1;recovery.now=()=>future;document.querySelector('#recovery-yes').click()});
  assert(await p.locator('#recovery-yes').isDisabled());
  await p.locator('#recovery-no').click();
  assert(await p.locator('#adventure-intro').isVisible());
  assert.equal(await p.evaluate(()=>localStorage.getItem(EpikRecovery.key)),null);
  // Run the actual public entry point too: no exposed development state.
  await p.evaluate(first=>{first.savedAt=Date.now();localStorage.setItem(EpikRecovery.key,JSON.stringify(first))},first);
  await p.goto(url.replace('/?dev=1','/'));
  assert(await p.locator('#recovery-dialog').isVisible());
  assert.equal(await p.evaluate(()=>typeof classroom),'undefined');
  await p.locator('#recovery-yes').click();
  assert(await p.locator('#recovery-dialog').isHidden());
  assert.match(await p.locator('#room-title').innerText(),/sendero/i);
  await p.reload();await p.locator('#recovery-no').click();
  assert(await p.locator('#story-student-name').isVisible());
  assert.equal(await p.locator('#story-student-name').inputValue(),'');
  await p.setViewportSize({width:390,height:844});
  await p.locator('#story-student-name').fill('Estudiante móvil');
  await p.locator('#adventure-start').click();
  assert(await p.locator('#story-name-box').isHidden());
  assert.deepEqual(errors,[]);
  console.log('PASS required name, reload, stable checkpoints, seven room adapters, attempts/help/IA, original session ID, 7-minute TTL, offline timer, final diploma, corrupt save.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
