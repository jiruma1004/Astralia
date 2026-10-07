const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.goto(process.env.GAME_URL||'http://127.0.0.1:8765');await page.locator('#story-skip').click();
 for(const i of [6,0,1,2,3,4,5]){
  await page.evaluate(i=>load(i),i);
  assert.equal(await page.locator('#maze-notice').isVisible(),i!==5);
  if(i!==5){assert.equal(await page.evaluate(()=>canPlay()),false);assert((await page.locator('#maze-notice p').allTextContents()).every(p=>p.length>30));await page.locator('#maze-understood').click();}
  assert.equal(await page.evaluate(()=>canPlay()),true);
 }
 // Eric's fall and launch continue without clicks.
 await page.evaluate(()=>{load(4);document.querySelector('#maze-notice').hidden=true;window.escapeSounds=[];const original=Sound.play.bind(Sound);Sound.play=(name,...args)=>{escapeSounds.push(name);return original(name,...args);};ignitia.startEscape(player);ignitia.tick(4.1);});
 assert.equal(await page.evaluate(()=>ignitia.ignited),true);await page.evaluate(()=>ignitia.tick(7));assert.equal(await page.evaluate(()=>ignitia.mode),'briefing');
 assert.equal(await page.evaluate(()=>escapeSounds.filter(n=>n==='rocket').length),1);assert(await page.locator('#ignitia-dialog').isVisible());
 await page.evaluate(()=>{ignitia.reveal();document.querySelector('#ignitia-next').click();});assert.equal(await page.evaluate(()=>ignitia.mode),'idle');
 await page.waitForFunction(()=>Object.values(cinematics.images).every(i=>i.complete&&i.naturalWidth));
 // Every catalog entry uses click gates and remains stopped without input.
 const ids=await page.evaluate(()=>Object.keys(SceneDialogueStops));
 for(const id of ids){
  await page.evaluate(id=>{cinematics.play(id);cinematics.tick(100);},id);
  assert.equal(await page.evaluate(()=>cinematics.time),await page.evaluate(()=>cinematics.dialogueStops[0]));
  const t=await page.evaluate(()=>cinematics.time);await page.evaluate(()=>cinematics.tick(100));assert.equal(await page.evaluate(()=>cinematics.time),t);
  await page.evaluate(()=>cinematics.close());
 }
 await page.evaluate(()=>{cinematics.play('eric-fuga');cinematics.time=.13;cinematics.draw();});assert(await page.locator('#angelica-radio-face').isVisible());
 const mouthA=await page.locator('#angelica-radio-face').screenshot();await page.evaluate(()=>{cinematics.time=.26;cinematics.draw();});const mouthB=await page.locator('#angelica-radio-face').screenshot();assert(!mouthA.equals(mouthB),'Mouth frames must differ');
 await page.evaluate(()=>{cinematics.close();cinematics.play('ivan-descenso');cinematics.time=19;cinematics.draw();});assert.match(await page.locator('#cinema-newspaper').textContent(),/no pusieran referencias/);
 await page.evaluate(()=>{cinematics.close();I18n.set('en');load(6);I18n.apply();});assert.match(await page.locator('#maze-notice').textContent(),/old bridge crosses a crater/);
 await page.evaluate(()=>{I18n.set('es');I18n.apply();});assert.match(await page.locator('#maze-notice').textContent(),/puente viejo cruza un cráter/);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: six entry notices, no rocket notice, continuous Eric escape, single ignition, ceremonies and alternative epilogues wait, talking radio portrait, wanted copy and language toggle.');
})().catch(e=>{console.error(e);process.exit(1)});
