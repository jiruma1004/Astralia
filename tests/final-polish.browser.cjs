const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1280,height:720}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');
 await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:11,y:2.2});ignitia.startEscape(player)});
 assert.deepEqual(await p.evaluate(()=>[player.x,player.y,player.angle]),[11.5,7.5,0]);
 await p.evaluate(()=>{ignitia.time=5;tick(last+16)});
 await p.locator('.scene-view').screenshot({path:'/tmp/epik-eric-centered.png'});
 await p.evaluate(()=>{load(rooms.findIndex(r=>r.rocket));document.querySelector('#ignitia-dialog').hidden=true;ignitia.speaking=false;tick(last+16)});
 await p.waitForTimeout(100);await p.evaluate(()=>tick(last+16));
 await p.locator('.scene-view').screenshot({path:'/tmp/epik-operations.png'});
 assert(await p.evaluate(()=>{Object.assign(player,{x:6.4,y:5.5,angle:0});return ignitia.open(player)}));
 assert(await p.locator('#rocket-console').isVisible());await p.evaluate(()=>ignitia.closeConsole());
 assert.equal(await p.evaluate(()=>SpaceInterception.advance(25,1,25,36)),26.3);
 assert(await p.evaluate(()=>{const a=EpikBloopers.prototype.ericPose(2),b=EpikBloopers.prototype.ericPose(2.5),end=EpikBloopers.prototype.ericPose(3.2);return Math.abs(b.x-a.x-90)<.001&&end.hit&&end.lamp===0}));
 for(const route of ['ceremonia-ignitia','ceremonia-karla']){
  await p.evaluate(async route=>{
   const s=classroom.session;s.preview=false;s.started=1;s.finished=1000;s.studentName='Jesús Iván Ruiz Martínez';s.events=[];
   s.rooms.forEach((r,i)=>{Object.assign(s.state(r.id),{solved:true,assisted:i===1,attempts:i+1,passedAttempt:i+1,incorrect:i,deaths:i,entered:1,exitAt:900});for(let k=0;k<i;k++)s.events.push({room_id:r.id,event_type:'attempt_result',objective_id:'main',result:'incorrect',submitted_answer:'answer'})});
   cinematics.isComplete=()=>true;window.closeCount=0;window.csvBefore=s.csv();
   cinematics.play(route,{story:true,onComplete:()=>closeCount++});await cinematics.ready;cinematics.dialogueIndex=cinematics.dialogueStops.length;cinematics.time=40;cinematics.draw();cinematics.refreshDialogue();
  },route);
  for(const viewport of [{width:1280,height:720},{width:390,height:844},{width:844,height:390}]){
   await p.setViewportSize(viewport);await p.waitForTimeout(150);
   if(await p.locator('#certificate-back').isVisible())await p.click('#certificate-flip');
   const fits=()=>p.evaluate(()=>{
    const outer=document.querySelector('#ceremony-certificate').getBoundingClientRect(),sheet=document.querySelector('.certificate-sheet').getBoundingClientRect();
    return sheet.top>=outer.top&&sheet.bottom<=outer.bottom+1&&sheet.left>=outer.left-1&&sheet.right<=outer.right+1;
   });
   assert(await fits(),'Full front and action buttons fit '+JSON.stringify(viewport));
   await p.locator('#ceremony-certificate').screenshot({path:'/tmp/diploma-'+viewport.width+'.png'});
   await p.click('#certificate-flip');await p.waitForTimeout(60);
   assert(await fits(),'Rank page fits '+JSON.stringify(viewport));
   assert.equal(await p.locator('.rank-card').nth(1).locator('.rank-stars').innerText(),'★☆☆☆☆');
   const seen=new Set();
   do{
    for(const id of await p.locator('.rank-card').evaluateAll(es=>es.map(e=>e.dataset.room)))seen.add(id);
    const next=p.locator('.rank-pagination button').last();if(await next.isDisabled())break;await next.click();
   }while(true);
   assert.equal(seen.size,7);
   await p.locator('#ceremony-certificate').screenshot({path:'/tmp/ranks-'+viewport.width+'.png'});
  }
  assert.equal(await p.evaluate(()=>classroom.session.csv()),await p.evaluate(()=>csvBefore));
  await p.evaluate(()=>{cinematics.inputAfter=0;document.querySelector('#certificate-continue').click();document.querySelector('#certificate-continue').click()});assert.equal(await p.evaluate(()=>closeCount),1);
 }
 await p.evaluate(async()=>{window.secretDone=0;cinematics.play('ivan-descenso',{story:true,onComplete:()=>secretDone++});await cinematics.ready;for(let i=0;i<36;i++)cinematics.tick(1)});
 assert.equal(await p.evaluate(()=>secretDone),1);assert(await p.locator('#scene-next').isHidden());
 assert.deepEqual(errors,[]);console.log('PASS centered camera, operations console interaction, 30% space approach, fast dark tunnel collision, responsive full diplomas/rank pages, one-star AI, automatic Ivan ending, no duplicate continuation.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
