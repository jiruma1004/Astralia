const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto(process.env.GAME_URL||'http://127.0.0.1:8765');await page.locator('#story-skip').click();await page.locator('#maze-understood').click();
 await page.evaluate(()=>{window.breaks=0;const play=Sound.woodBreak.bind(Sound);Sound.woodBreak=()=>{breaks++;play();};const p=trial.platforms()[0];player.x=p.x+.7;player.y=p.y+.7;trial.land(player);});assert.equal(await page.evaluate(()=>breaks),1);assert.equal(await page.evaluate(()=>death.type),'pit');
 await page.evaluate(()=>respawn());assert.equal(await page.evaluate(()=>trial.supports(5.7,2.95)),false);await page.evaluate(()=>{tick(16);});fs.mkdirSync('/tmp/astralia-wood',{recursive:true});await page.locator('.scene-view').screenshot({path:'/tmp/astralia-wood/broken.png'});
 await page.evaluate(()=>{load(6);document.querySelector('#maze-notice').hidden=true;tick(last+16);});await page.locator('.scene-view').screenshot({path:'/tmp/astralia-wood/start.png'});
 for(let n=0;n<20;n++){
  const values=await page.evaluate(n=>{EricVariants.bag=[EricVariants.bank[n]];load(4);document.querySelector('#maze-notice').hidden=true;return {id:boss.puzzle.support.id,p:boss.puzzle.support.parabolaText,l:boss.puzzle.support.lineText,roots:boss.puzzle.support.intersections};},n);
  assert.equal(await page.locator('#boss-parabola').textContent(),'y = '+values.p);assert.equal(await page.locator('#boss-line').textContent(),'y = '+values.l);
  for(let i=0;i<2;i++){
   await page.evaluate(i=>{Object.assign(player,{x:10.3,y:i?12.8:2.2,angle:0});boss.open(player,renderer,rooms[index],opened);},i);
   await page.locator('#boss-x').fill(String(values.roots[i][0]));await page.locator('#boss-y').fill(String(Math.round(values.roots[i][1]*100)/100));await page.locator('#boss-form button').click();assert(await page.locator('#boss-panel').isHidden());
   if(!i){await page.evaluate(()=>{die('pit');respawn();});assert.equal(await page.evaluate(()=>boss.puzzle.support.id),values.id);assert.equal(await page.evaluate(()=>boss.puzzle.cuts[0]),true);}
  }
  assert.equal(await page.evaluate(()=>boss.puzzle.solved),true);
 }
 await page.evaluate(()=>{load(2);document.querySelector('#maze-notice').hidden=true;maze.restoreCheckpoint(3);maze.chasing=false;Object.assign(player,{x:38.8,y:8.5,angle:0,pitch:0});companions.updateConcept();document.querySelector('#question-content').hidden=true;});await page.waitForFunction(()=>renderer.choiceMeme.complete&&renderer.choiceMeme.naturalWidth>1000);await page.evaluate(()=>tick(last+16));await page.locator('.scene-view').screenshot({path:'/tmp/astralia-wood/meme.png'});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: persistent broken plank, wood sound once, 20 visible variants accepted via both panels, same equations and cut after respawn, HD meme loaded, no JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});
