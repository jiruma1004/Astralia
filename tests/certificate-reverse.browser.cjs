const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1440,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true)});
 for(const ceremony of ['ceremonia-ignitia','ceremonia-karla']){
  await p.evaluate(async id=>{
   const s=classroom.session;s.preview=false;s.started=1;s.finished=1000;s.events=[];
   s.rooms.forEach((r,i)=>{const v=s.state(r.id);Object.assign(v,{solved:true,assisted:i===1,attempts:5,passedAttempt:5,incorrect:4,deaths:i===4?7:0,entered:1,exitAt:900});
    for(let k=0;k<4;k++)s.events.push({room_id:r.id,event_type:'attempt_result',objective_id:'question',result:'incorrect',submitted_answer:'answer'});
    s.events.push({room_id:r.id,event_type:'attempt_result',objective_id:'question',result:'correct',submitted_answer:'answer'});
   });
   cinematics.isComplete=()=>classroom.session.totals().valid;window.csvBefore=s.csv();window.closeCount=0;cinematics.play(id,{story:true,onComplete:()=>closeCount++});await cinematics.ready;cinematics.dialogueIndex=cinematics.dialogueStops.length;cinematics.time=40;cinematics.draw();cinematics.refreshDialogue();
  },ceremony);
  assert(await p.locator('#certificate-front').isVisible());await p.click('#certificate-flip');assert(await p.locator('#certificate-back').isVisible());assert.equal(await p.locator('.rank-card').count(),4);
  assert.match(await p.locator('.rank-card').nth(0).innerText(),/Catador de Tablones/);
  assert.match(await p.locator('.rank-card').nth(1).innerText(),/Alquimista del Casi Sale/);
  assert.equal(await p.evaluate(()=>classroom.session.csv()),await p.evaluate(()=>csvBefore));assert.equal(await p.evaluate(()=>closeCount),0);
  const overflow=await p.evaluate(()=>document.querySelector('#certificate-back').scrollWidth>document.querySelector('#certificate-back').clientWidth+1);assert(!overflow);
  await p.locator('#ceremony-certificate').screenshot({path:'/tmp/certificate-reverse-'+ceremony+'.png'});
  await p.evaluate(()=>I18n.set('en'));assert.match(await p.locator('#certificate-back').innerText(),/Plank Taster/);await p.evaluate(()=>I18n.set('es'));
  await p.click('#certificate-flip');assert(await p.locator('#certificate-front').isVisible());assert(await p.locator('#certificate-back').isHidden());await p.click('#certificate-flip');
  await p.setViewportSize({width:390,height:844});await p.waitForTimeout(100);assert.equal(await p.locator('.rank-card').count(),2);
  assert(await p.evaluate(()=>document.querySelector('#ceremony-certificate').scrollHeight<=document.querySelector('#ceremony-certificate').clientHeight+1));
  await p.locator('.rank-card').last().scrollIntoViewIfNeeded();assert(await p.locator('.rank-card').last().isVisible());
  await p.locator('#ceremony-certificate').screenshot({path:'/tmp/certificate-reverse-mobile.png'});
  await p.evaluate(()=>{cinematics.inputAfter=0;document.querySelector('#certificate-continue').click();document.querySelector('#certificate-continue').click()});assert.equal(await p.evaluate(()=>closeCount),1);
  await p.setViewportSize({width:1440,height:1050});
 }
 await p.evaluate(async()=>{classroom.session.preview=true;cinematics.play('ceremonia-ignitia');await cinematics.ready;cinematics.time=40;cinematics.draw()});assert(await p.locator('#certificate-front').isVisible());await p.click('#certificate-flip');assert.equal(await p.locator('.rank-card').count(),0);assert.match(await p.locator('#certificate-back').innerText(),/Vista previa/);
 assert.deepEqual(errors,[]);console.log('PASS both diploma routes, reversible ranks, Spanish/English, one-star AI, mobile pages, unchanged CSV, preview and single continuation');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
