const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto('http://127.0.0.1:8765/?dev=1');await page.locator('#story-skip').click();
 await page.evaluate(()=>{document.querySelector('#maze-notice').hidden=true;tick(last+16)});
 await page.locator('.scene-view').screenshot({path:'/tmp/epik-crater-depth.png'});
 const renderTimes=await page.evaluate(()=>{
  const original=trial.drawCrater;let baseline=0,depth=0;
  for(let pass=0;pass<2;pass++){trial.drawCrater=pass?original:()=>{};const start=performance.now();for(let n=0;n<45;n++)renderer.draw(rooms[index],player,false,0,n*16,lab,roulette);if(pass)depth=(performance.now()-start)/45;else baseline=(performance.now()-start)/45;}trial.drawCrater=original;return {baseline,depth};
 });console.log('Canvas ms/frame (headless, indicative only):',renderTimes);
 await page.evaluate(()=>{Object.assign(player,{x:5.75,y:4.75,angle:1.3,pitch:.12});renderer.draw(rooms[index],player,false,0,16,lab,roulette)});
 await page.locator('.scene-view').screenshot({path:'/tmp/epik-crater-side.png'});
 for(const id of ['room-00','room-03','room-04','room-06','room-01','room-02','room-05']){
  const eligible=['room-01','room-02','room-05'].includes(id);
  await page.evaluate(id=>{load(rooms.findIndex(r=>r.id===id));document.querySelector('#maze-notice').hidden=true;if(rooms[index].roulette)roulette.present(0);const c=classroom.context();classroom.session.attempt(c,'wrong',{},false);classroom.session.attempt(c,'wrong',{},false);classroom.session.attempt(c,'wrong',{},false);classroom.aid.update()},id);
  assert.equal(await page.locator('#extra-help').isVisible(),eligible,id);
  if(!eligible){await page.evaluate(()=>classroom.aid.open());assert.equal(await page.locator('#extra-help-panel').isVisible(),false,id+' cannot reveal via stale callback');continue;}
  await page.locator('#extra-help').click();assert(await page.locator('#extra-help-answer').isVisible());assert((await page.locator('#extra-help-answer').textContent()).length>40);
  const count=await page.evaluate(()=>classroom.session.events.filter(e=>e.event_type==='solution_revealed').length);
  await page.locator('#extra-help').click();assert.equal(await page.evaluate(()=>classroom.session.events.filter(e=>e.event_type==='solution_revealed').length),count);
  const panel=page.locator('#extra-help-panel'),before=await panel.boundingBox(),handle=await page.locator('#extra-help-handle').boundingBox();
  if(id==='room-01')assert(before.x>700,'Initial help opens opposite the answer panel');
  await page.mouse.move(handle.x+50,handle.y+25);await page.mouse.down();await page.mouse.move(handle.x-100,handle.y-90,{steps:6});await page.mouse.up();const moved=await panel.boundingBox();assert(moved.x<before.x-70&&moved.y<before.y-50);
  await page.mouse.move(moved.x+moved.width-3,moved.y+moved.height-3);await page.mouse.down();await page.mouse.move(moved.x+moved.width+40,moved.y+moved.height+40,{steps:6});await page.mouse.up();const resized=await panel.boundingBox();assert(resized.width>moved.width+10,'resizable panel');
  await page.evaluate(()=>I18n.set('en'));assert.match(await page.locator('#extra-help-copy').textContent(),/does not count/);await page.evaluate(()=>I18n.set('es'));
  await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);
 }
 await page.evaluate(()=>{load(rooms.findIndex(r=>r.conceptual));document.querySelector('#maze-notice').hidden=true;maze.stage=3;companions.updateConcept();companions.help()});
 assert.equal(await page.locator('#concept-text').textContent(),'¿Cómo se comporta el electrón?');assert.match(await page.locator('.concept-instruction').textContent(),/Puerta azul o puerta roja/);assert(!await page.evaluate(()=>/ambas|válidas|no hay una respuesta incorrecta/.test(maze.question.text+maze.question.hint+document.querySelector('#maze-notice').textContent)));
 assert.equal(await page.evaluate(()=>CONCEPT_QUESTIONS[3].correct.length),2);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS eligible IA rooms, one-click penalty, no duplicate deduction, drag/resize/Escape, translations, spoiler-free doors, crater views');
})().catch(e=>{console.error(e);process.exit(1)});
