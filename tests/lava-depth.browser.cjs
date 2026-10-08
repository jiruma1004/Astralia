const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1440,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>window.requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8765/?dev=1');await p.locator('#story-skip').click();
 await p.evaluate(()=>{load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true});await p.waitForTimeout(100);
 const views=[{name:'entrance',x:19.05,y:4.5,angle:0,pitch:0,jumpHeight:0},{name:'side',x:23.8,y:2.75,angle:.85,pitch:-.09,jumpHeight:0},{name:'exit',x:33.4,y:4.5,angle:Math.PI,pitch:0,jumpHeight:0},{name:'jump',x:26.5,y:4.5,angle:0,pitch:0,jumpHeight:.4}];
 for(const v of views){await p.evaluate(v=>{Object.assign(player,v);renderer.draw(rooms[index],player,false,0,1900,lab,roulette)},v);await p.locator('.scene-view').screenshot({path:'/tmp/lava-depth-'+v.name+'.png'});}
 const metrics=await p.evaluate(()=>{
  Object.assign(player,{x:19.05,y:4.5,angle:0,pitch:0,jumpHeight:0});
  const lava=rooms[index].lava,ray=lava.rayColor,supports=lava.drawSupports,times=[];
  for(let pass=0;pass<2;pass++){
   lava.rayColor=pass?ray:function(player,dx,dy,d,eye,time){return this.color(player.x+dx*d,player.y+dy*d,time)};lava.drawSupports=pass?supports:()=>{};
   const t=performance.now();for(let i=0;i<45;i++)renderer.draw(rooms[index],player,false,0,1900+i*16,lab,roulette);times.push((performance.now()-t)/45);
  }lava.rayColor=ray;lava.drawSupports=supports;
  return {baseline:times[0],depth:times[1],surface:lava.visualDepth};
 });assert(metrics.surface>0&&metrics.surface<1);console.log('Headless canvas ms/frame (indicative):',metrics);
 await p.evaluate(()=>{Object.assign(player,{x:22.45,y:4.5,angle:0,jumpHeight:0});tick(last+16)});assert.equal(await p.evaluate(()=>death.type),'lava');
 await p.evaluate(()=>{respawn();Object.assign(player,{x:23.8,y:2.75,angle:0,jumpHeight:0});tick(last+16)});assert.equal(await p.evaluate(()=>death),null);
 assert.deepEqual(errors,[]);await b.close();console.log('PASS lava entrance/side/exit/jump views, safe supports, lava death, bounded visual depth and no browser errors');
})().catch(e=>{console.error(e);process.exit(1)});
