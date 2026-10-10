const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage(),requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto(process.env.EPIK_TEST_URL||'http://127.0.0.1:8767/?dev=1');assert(!requests.some(p=>p.includes('bloopers-backgrounds')));
 await page.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);cinematics.open()});await page.click('#bloopers-gallery');
 for(let i=0;i<5;i++){
  await page.evaluate(()=>cinematics.bloopers.ready);assert.equal(await page.evaluate(()=>cinematics.bloopers.index),i);
  assert(await page.locator('#blooper-next').isHidden());
  const before=await page.evaluate(()=>cinematics.bloopers.time);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});cinematics.bloopers.tick(20);delete document.hidden});
  assert.equal(await page.evaluate(()=>cinematics.bloopers.time),before,'hidden tabs pause scene time');
  await page.evaluate(()=>cinematics.bloopers.tick(2.7));
  if(i===0){
   await page.locator('#epik-bloopers').screenshot({path:'/tmp/epik-ivan-running.png'});
   const frames=await page.evaluate(()=>{const b=cinematics.bloopers,orig=b.actor.bind(b),frames=[];b.actor=(im,bo,sx,...args)=>frames.push(sx);b.ivan(b.c,b.assets.images,4);b.ivan(b.c,b.assets.images,4.13);b.actor=orig;return frames});
   assert.equal(frames[0],frames[1],'Ivan stops cycling legs after falling');
  }
  if(i===1){
   const frames=await page.evaluate(()=>{const b=cinematics.bloopers,orig=b.atlasActor.bind(b),frames=[];b.atlasActor=(key,frame)=>frames.push(frame);for(const t of [0,.11,.22,.33])b.eric(b.c,b.assets.images,t);b.atlasActor=orig;return frames});
   assert.deepEqual(frames,[0,1,2,3],'Eric uses four gait poses');
   const poses=await page.evaluate(()=>[4.8,5.8,6.15,8,12].map(t=>cinematics.bloopers.ericPose(t)));
   assert.equal(await page.evaluate(()=>cinematics.bloopers.ericPose(2).x-cinematics.bloopers.ericPose(1).x),90,'Eric moves 20% faster: 75 to 90 stage pixels/s');
   assert(poses.every(p=>p.lamp===0),'headlamp stays fully off');
   assert(poses[1].x>poses[0].x&&poses[2].x>poses[1].x,'Eric keeps walking in the dark');
   assert(poses[3].hit&&poses[3].x<poses[2].x,'collision recoils from wall');
   assert.equal(poses[3].x,poses[4].x,'Eric never walks through the wall');
   await page.evaluate(()=>{window.blooperTones=[];window.originalTone=Sound.tone;Sound.tone=(frequency,...args)=>{blooperTones.push(frequency);return originalTone.call(Sound,frequency,...args)}});

  }
  await page.evaluate(()=>cinematics.bloopers.tick(5));
  await page.locator('#epik-bloopers').screenshot({path:'/tmp/epik-blooper-v2-'+i+'.png'});
  if(i===1){
   await page.locator('#epik-bloopers').screenshot({path:'/tmp/epik-eric-wall-impact.png'});
   await page.evaluate(()=>cinematics.bloopers.tick(1));
   assert.deepEqual(await page.evaluate(()=>blooperTones),[220,75],'failure and impact SFX trigger once');
   await page.evaluate(()=>{Sound.tone=originalTone});
  }
  if(i===2){
   const poses=await page.evaluate(()=>[5,5.5,6.2,6.8,9].map(t=>cinematics.bloopers.workshopRocketPose(t)));
   assert.equal(poses[0].x,575);assert(poses[1].x>575);assert.notEqual(poses[2].angle,poses[3].angle);assert.equal(poses[4].visible,false);
   const safe=await page.evaluate(()=>Array.from({length:17},(_,i)=>cinematics.bloopers.workshopRocketPose(5.8+i*.1)).every(p=>p.x>=660));assert(safe,'rocket loop stays to the right of José Luis');
   const reaction=await page.evaluate(()=>{const b=cinematics.bloopers,orig=b.actor.bind(b);let used=false;b.actor=(im,...args)=>{used ||= im===b.assets.images.blooperJoseReaction;orig(im,...args)};b.jose(b.c,b.assets.images,8);b.actor=orig;return used});assert(reaction,'new sweat reaction replaces hammering pose');
  }
  if(i===4){
   assert.equal(await page.locator('#blooper-speaker').innerText(),'Angélica');
   assert.match(await page.locator('#blooper-line').innerText(),/Solo falta encontrar al Dr. Eric/);
   const reactions=await page.evaluate(()=>{const b=cinematics.bloopers,orig=b.atlasActor.bind(b),keys=[];b.atlasActor=(key)=>keys.push(key);for(const t of [6,8,11])b.office(b.c,b.assets.images,t);b.atlasActor=orig;return keys});assert.deepEqual(reactions,['blooperTea','blooperTea','blooperTea','blooperKarlaReaction','blooperTea','blooperTea']);
  }
  if(i===0){assert.match(await page.locator('#blooper-line').innerText(),/Todos mis planes/);}
  await page.evaluate(()=>cinematics.bloopers.tick(6.4));
 }
 assert.equal(await page.evaluate(()=>cinematics.active),false);assert(await page.locator('#epik-bloopers').isHidden());
 // Retry is the only scene button, and failed/loading scenes cannot skip credits.
 await page.evaluate(()=>{cinematics.open();document.querySelector('#bloopers-gallery').click()});await page.evaluate(()=>cinematics.bloopers.ready);
 await page.evaluate(()=>{const b=cinematics.bloopers;b.failed=true;b.draw();b.tick(30)});
 assert(await page.locator('#blooper-next').isVisible());assert.equal(await page.evaluate(()=>cinematics.bloopers.index),0);
 await page.click('#blooper-next');await page.evaluate(()=>cinematics.bloopers.ready);assert(await page.locator('#blooper-next').isHidden());
 assert.equal(await page.locator('#epik-bloopers').count(),1);await page.evaluate(()=>load(0));assert(await page.locator('#epik-bloopers').isHidden());
 // Split credits: desktop right column, stacked layout on narrow screens.
 await page.evaluate(()=>{window.overlayCredits=new EpikCredits();overlayCredits.open(()=>{});overlayCredits.tick(5)});await page.evaluate(()=>overlayCredits.bloopers.ready);
 for(const viewport of [{width:1440,height:1050},{width:390,height:844}]){
  await page.setViewportSize(viewport);
  await page.evaluate(()=>{overlayCredits.step=4;overlayCredits.render();overlayCredits.bloopers.time=2;overlayCredits.bloopers.draw()});await page.waitForTimeout(500);
  const rect=await page.evaluate(()=>{const a=document.querySelector('#credits-card').getBoundingClientRect(),b=document.querySelector('#epik-bloopers').getBoundingClientRect();return{left:a.left,top:a.top,sceneRight:b.right,sceneBottom:b.bottom,font:getComputedStyle(document.querySelector('.credits-name')).fontFamily}});
  if(viewport.width>700)assert(rect.left>=rect.sceneRight,'credits on the right');else assert(rect.top>=rect.sceneBottom,'stacked mobile credits');
  assert(rect.font.includes('Georgia'),'natural serif credit font');
  await page.locator('#epik-credits').screenshot({path:'/tmp/epik-split-'+viewport.width+'.png'});
 }
 await page.evaluate(()=>overlayCredits.close());
 // Real animation clock: credits must start without clicks, not just via test ticks.
 await page.evaluate(()=>{window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),16);window.cancelAnimationFrame=clearTimeout;window.testCredits=overlayCredits;testCredits.open(()=>{});testCredits.introTime=4.8});
 await page.waitForFunction(()=>testCredits.phase==='reel',null,{polling:50});await page.evaluate(()=>testCredits.bloopers.ready);
 await page.waitForFunction(()=>testCredits.bloopers.time>.2,null,{polling:50});await page.evaluate(()=>{testCredits.close();});assert(await page.locator('#epik-bloopers').isHidden());
 assert.deepEqual(errors,[]);console.log('PASS automatic five-scene reel, hidden-tab pause, frozen fall, four-step gait, retry, cleanup and live RAF');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
