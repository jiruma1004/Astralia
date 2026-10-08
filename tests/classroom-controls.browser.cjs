const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto('http://127.0.0.1:8765/?dev=1');await page.locator('#story-skip').click();
 await page.evaluate(()=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true});
 await page.locator('#game').click({position:{x:400,y:200}});
 await page.waitForFunction(()=>document.pointerLockElement!==null);
 const before=await page.evaluate(()=>player.angle);await page.mouse.move(520,250);
 assert.notEqual(await page.evaluate(()=>player.angle),before);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.pointerLockElement);
 await page.locator('#game').focus();await page.keyboard.down('Space');
 assert(await page.evaluate(()=>player.jumpVelocity>0));await page.keyboard.up('Space');
 const speeds=await page.evaluate(()=>{Object.assign(player,{x:3,y:7.5,angle:0,jumpHeight:0,jumpVelocity:0});keys.add('w');tick(last+40);const normal=player.x-3;player.x=3;keys.add('shift');tick(last+40);const fast=player.x-3;keys.clear();return {normal,fast}});
 assert(Math.abs(speeds.fast/speeds.normal-1.55)<.0001);
 // Opening panels releases the cursor; closing does not recapture it.
 await page.locator('#game').click({position:{x:400,y:200}});await page.waitForFunction(()=>document.pointerLockElement!==null);
 await page.evaluate(()=>companions.help());await page.waitForFunction(()=>!document.pointerLockElement);
 await page.evaluate(()=>companions.closeHelp());assert.equal(await page.evaluate(()=>document.pointerLockElement),null);
 // The real encounter scheduler waits for existing pools and delays potions exactly five seconds.
 const result=await page.evaluate(()=>{
  boss.resetAttacks();Object.assign(player,{x:3,y:7.5,jumpHeight:.43});
  boss.potions.pools.push({x:12,y:2,expires:100});boss.wave.timer=0;
  boss.tick(.1,player,renderer,rooms[index],false);const waited=boss.wave.phase==='idle';
  boss.potions.reset();boss.potions.nextThrow=1000;
  boss.tick(.001,player,renderer,rooms[index],false);const warning=boss.wave.phase==='warning'&&boss.speech.includes('expectativas');
  boss.wave.timer=0;boss.tick(.001,player,renderer,rooms[index],false);
  for(let i=0;i<400&&boss.wave.phase==='wave';i++)boss.tick(.01,player,renderer,rooms[index],false);
  const jumpSafe=!death&&boss.wave.phase==='cooldown',left=boss.wave.timer;
  boss.tick(left-.001,player,renderer,rooms[index],false);const noPotion=boss.potions.bottles.length===0;
  boss.tick(.001,player,renderer,rooms[index],false);const resumed=boss.potions.bottles.length===1;
  boss.stopAttacks();boss.tick(25,player,renderer,rooms[index],false);const clean=boss.potions.bottles.length===0&&boss.wave.phase==='idle';
  return {waited,warning,jumpSafe,noPotion,resumed,clean};
 });assert.deepEqual(result,{waited:true,warning:true,jumpSafe:true,noPotion:true,resumed:true,clean:true});
 await page.evaluate(()=>{boss.resetAttacks();Object.assign(player,{x:3,y:7.5,angle:0,jumpHeight:0});boss.wave.phase='wave';boss.wave.x=5.5;boss.wave.previousPlayer={x:3,z:0};tick(last+16)});
 await page.locator('.scene-view').screenshot({path:'/tmp/epik-green-wave.png'});
 await page.evaluate(()=>boss.tick(1,player,renderer,rooms[index],false));
 assert.equal(await page.evaluate(()=>death.type),'flame');assert.equal(await page.evaluate(()=>boss.potions.bottles.length),0);
 await page.evaluate(()=>respawn());assert.equal(await page.evaluate(()=>boss.wave.phase),'idle');assert.equal(await page.evaluate(()=>boss.attacksStopped),false);
 // Re-entering the same room preserves assistance, while previews cannot certify it.
 await page.evaluate(()=>{load(0);document.querySelector('#maze-notice').hidden=true;const c=classroom.context();classroom.session.attempt(c,'x',{},false);classroom.session.attempt(c,'x',{},false);classroom.aid.open();classroom.aid.reveal();advanceRoom(index)});
 assert.equal(await page.evaluate(()=>classroom.session.state(rooms[index].id).assisted),true);assert.equal(await page.evaluate(()=>classroom.session.totals().valid),false);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS mouse/Escape/panels, jump/sprint, integrated warning/wave/jump/death/cleanup/potion cooldown, persisted penalty on room reload');
})().catch(e=>{console.error(e);process.exit(1)});
