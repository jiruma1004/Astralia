const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const choice of ['particle','wave']){
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);await page.goto('http://127.0.0.1:8765/?dev=1');await page.locator('#story-skip').click();
 assert.deepEqual(await page.evaluate(()=>[...cinematics.assets.jobs.keys()]),[],'No gallery assets requested on startup');
 const forbidden=choice==='particle'?['karla-white-sweater.webp','ivan-descent-atlas.webp','wanted-portraits.webp']:['paola-glasses-a-gesture.webp','eric-escaped-cell.webp','angelica-radio-talk.webp'];
 await page.evaluate(choice=>{StoryRoute.choose(choice);load(3)},choice);await page.evaluate(()=>cinematics.assets.preload('ignitia-intercepcion'));
 assert.equal(await page.evaluate(()=>cinematics.assets.decoded.has('ceremonyHall')),false);
 await page.evaluate(()=>load(4));const ceremony=choice==='particle'?'ceremonia-ignitia':'ceremonia-karla';await page.evaluate(id=>cinematics.assets.preload(id),ceremony);
 await page.evaluate(()=>load(5));const secret=choice==='particle'?'eric-fuga':'ivan-descenso';await page.evaluate(id=>cinematics.assets.preload(id),secret);
 for(const file of forbidden)assert(!requests.some(url=>url.includes(file)),file+' must not download in '+choice);
 await page.evaluate(async id=>{cinematics.play(id);await cinematics.ready},ceremony);
 // Verify every gesture is drawn at full opacity, including dialogue transitions.
 const stats=await page.evaluate(()=>{const original=CinematicSpriteMotion.draw;let count=0,min=1;CinematicSpriteMotion.draw=function(c,...args){min=Math.min(min,c.globalAlpha);count++;return original.call(this,c,...args)};for(let i=0;i<250;i++){cinematics.time=i/30;cinematics.visualTime=i/30;cinematics.draw();}CinematicSpriteMotion.draw=original;return {min,count};});assert.equal(stats.min,1);assert.equal(stats.count,500);
 await page.locator('#cinema-canvas').screenshot({path:'/tmp/ceremony-'+choice+'.png'});
 await page.evaluate(()=>{cinematics.close();});assert.deepEqual(errors,[]);await page.close();
}
// Delayed decoding must hold the scene clock and clicks. Closing invalidates completion.
const p=await browser.newPage();await p.addInitScript(()=>window.requestAnimationFrame=()=>0);let release;const gate=new Promise(r=>release=r);await p.route('**/angelica-gesture.webp',async route=>{await gate;await route.continue()});await p.goto('http://127.0.0.1:8765/?dev=1');await p.locator('#story-skip').click();await p.evaluate(()=>{cinematics.play('ceremonia-karla');cinematics.tick(30);cinematics.inputAfter=0;cinematics.advanceDialogue()});assert.equal(await p.evaluate(()=>cinematics.loading),true);assert.equal(await p.evaluate(()=>cinematics.time),0);assert(await p.locator('#cinema-loading').isVisible());await p.evaluate(()=>cinematics.close());release();await p.evaluate(()=>cinematics.ready);assert.equal(await p.evaluate(()=>cinematics.active),false);
// Failed resource is retryable; it cannot leave the scene playing with missing people.
let fail=true;await p.route('**/paola-glasses-a-gesture.webp',r=>fail?r.abort():r.continue());await p.evaluate(async()=>{cinematics.play('ceremonia-ignitia');await cinematics.ready});assert(await p.locator('#cinema-retry').isVisible());assert.equal(await p.evaluate(()=>cinematics.time),0);fail=false;await p.locator('#cinema-retry').click();await p.evaluate(()=>cinematics.ready);assert.equal(await p.evaluate(()=>cinematics.loading),false);
await browser.close();console.log('PASS: staged loads, both routes exclude alternate assets, opaque gestures, slow network, cancellation and retry');})().catch(e=>{console.error(e);process.exit(1)});
