const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto('http://127.0.0.1:8765/?dev=1');await page.locator('#story-skip').click();
 await page.evaluate(()=>{load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true;tick(last+16)});
 assert(await page.locator('#touch-controls').isVisible());
 await page.waitForTimeout(150);await page.evaluate(()=>{tick(last+16);window.scrollTo(0,0)});
 const cdp=await context.newCDPSession(page),points=new Map();
 const send=async(type)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:[...points.values()]});
 const down=async(id,x,y)=>{points.set(id,{id,x,y});await send('touchStart')};
 const move=async(id,x,y)=>{points.set(id,{id,x,y});await send('touchMove')};
 const up=async id=>{const point=points.get(id);points.delete(id);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[point]})};
 const center=async s=>{const r=await page.locator(s).boundingBox();return {x:r.x+r.width/2,y:r.y+r.height/2,r}};
 const stick=await center('#touch-stick'),jump=await center('#touch-jump'),run=await center('#touch-run'),canvas=await center('#game');
 await page.screenshot({path:'/tmp/epik-touch-landscape.png'});
 // Toggle sprint, keep movement held, and jump with the OTHER finger. Real browser touch events.
 await down(3,run.x,run.y);await up(3);assert(await page.evaluate(()=>touch.sprinting));
 await down(1,stick.x,stick.y);await move(1,stick.x,stick.y-stick.r.width*.4);
 const before=await page.evaluate(()=>({x:player.x,y:player.y}));
 await down(2,jump.x,jump.y);assert(await page.evaluate(()=>player.jumpVelocity>0));await up(2);
 assert(await page.evaluate(()=>touch.forward>.99));
 await page.evaluate(()=>{for(let i=0;i<5;i++)tick(last+16)});
 const after=await page.evaluate(()=>({x:player.x,y:player.y,h:player.jumpHeight}));assert(Math.hypot(after.x-before.x,after.y-before.y)>.25);assert(after.h>0);
 // Movement continues while the right thumb looks; camera gesture does not interact or lock mouse.
 const angle=await page.evaluate(()=>player.angle);
 const lookX=canvas.r.x+canvas.r.width*.65,lookY=canvas.r.y+canvas.r.height*.35;
 await down(2,lookX,lookY);await move(2,lookX+45,lookY-12);await up(2);
 assert(await page.evaluate(a=>player.angle>a+.1,angle));assert(await page.evaluate(()=>touch.forward>.99&&!document.pointerLockElement));
 await up(1);assert.equal(await page.evaluate(()=>touch.forward),0);
 // Cancellation, blur, UI opening and death cannot leave a stuck joystick/sprint.
 await down(1,stick.x,stick.y-40);points.clear();await send('touchCancel');assert.equal(await page.evaluate(()=>touch.forward),0);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await page.evaluate(()=>touch.sprinting),false);
 await down(1,stick.x,stick.y-40);
 await page.evaluate(()=>{companions.help();tick(last+16)});assert.equal(await page.locator('#touch-controls').isVisible(),false);assert.equal(await page.evaluate(()=>touch.forward),0);await up(1);
 await page.evaluate(()=>{companions.closeHelp();tick(last+16)});assert(await page.locator('#touch-controls').isVisible());
 await page.evaluate(()=>{die('lava');tick(last+16)});assert.equal(await page.locator('#touch-controls').isVisible(),false);
 await page.evaluate(()=>{respawn();tick(last+16)});assert(await page.locator('#touch-controls').isVisible());
 // Manual override and keyboard remain independent of touch axes.
 await page.selectOption('#touch-mode','desktop');await page.evaluate(()=>tick(last+16));assert.equal(await page.locator('#touch-controls').isVisible(),false);
 await page.locator('#game').focus();await page.keyboard.down('w');assert(await page.evaluate(()=>keys.has('w')));await page.keyboard.up('w');assert.equal(await page.evaluate(()=>keys.has('w')),false);
 await page.selectOption('#touch-mode','touch');await page.evaluate(()=>{I18n.set('en');tick(last+16)});assert.equal(await page.locator('#touch-jump').innerText(),'↟ Jump');
 // Portrait/tablet and expanded layouts keep all touch targets inside the visible scene.
 for(const size of [{width:390,height:844},{width:1024,height:768}]){
  await page.setViewportSize(size);await page.waitForTimeout(100);await page.evaluate(()=>tick(last+16));
  for(const selector of ['#touch-stick','#touch-jump','#touch-use','#touch-run']){const r=await page.locator(selector).boundingBox();assert(r.width>=44&&r.height>=44);assert(r.x>=0&&r.x+r.width<=size.width);assert(r.y>=0&&r.y+r.height<=size.height)}
 }
 await page.screenshot({path:'/tmp/epik-touch-tablet.png'});
 await page.setViewportSize({width:844,height:390});await page.evaluate(()=>{document.documentElement.classList.add('expanded-game');tick(last+16)});await page.waitForTimeout(100);await page.evaluate(()=>tick(last+16));await page.screenshot({path:'/tmp/epik-touch-fullscreen.png'});
 // The Use button opens the existing in-world console and releases the joystick.
 await page.evaluate(()=>{load(rooms.findIndex(r=>r.physics));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:2,y:3.5,angle:0});tick(last+16)});
 await page.waitForTimeout(100);await page.evaluate(()=>tick(last+16));
 const use=await center('#touch-use');await down(5,use.x,use.y);await up(5);await page.evaluate(()=>tick(last+16));
 assert(await page.evaluate(()=>cannon.isOpen));assert.equal(await page.locator('#touch-controls').isVisible(),false);
 await page.locator('#cannon-close').click();await page.evaluate(()=>tick(last+16));assert(await page.locator('#touch-controls').isVisible());
 assert.deepEqual(errors,[]);
 const desktop=await browser.newPage();await desktop.addInitScript(()=>window.requestAnimationFrame=()=>0);await desktop.goto('http://127.0.0.1:8765/?dev=1');assert.equal(await desktop.evaluate(()=>document.documentElement.classList.contains('touch-mode')),false);
 await browser.close();console.log('PASS real multi-touch sprint + movement + jump + look, cancellation, overlays, death, keyboard, ES/EN, layouts and desktop detection');
})().catch(e=>{console.error(e);process.exit(1)});
