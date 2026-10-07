const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');const w={};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/rooms/room-05/boss.js'),'utf8'),w);
assert.equal(w.EricVariants.bank.length,20);const formulas=new Set();
const expr=(text,x)=>Function('x','return '+text.replaceAll('−','-').replaceAll('x²','(x*x)').replace(/(\d)x/g,'$1*x'))(x);
for(const support of w.EricVariants.bank){
 const p=new w.ParabolaPuzzle(support),f=support.parabola,l=support.line;formulas.add(support.parabolaText+'='+support.lineText);
 // Solve from sampled polynomial coefficients, independently of stored intersections.
 const c=f(0),a=(f(1)+f(-1)-2*c)/2,m=l(1)-l(0),b=l(0),D=m*m-4*a*(c-b);
 const roots=[(m-Math.sqrt(D))/(2*a),(m+Math.sqrt(D))/(2*a)];assert(roots[0]<0&&roots[1]>0);
 for(const x of [-6,-2,0,3,6]){assert(Math.abs(expr(support.parabolaText,x)-f(x))<1e-10);assert(Math.abs(expr(support.lineText,x)-l(x))<1e-10);}
 for(const [side,x,y] of [[-1,0,0],[1,NaN,6],[1,4,Infinity],[-1,roots[1],l(roots[1])]])assert.equal(p.submit(side,x,y),false);
 roots.forEach((x,i)=>{const y=l(x);assert(Math.abs(x-support.intersections[i][0])<1e-10);assert(Math.abs(y-f(x))<1e-10);assert(!p.submit(i?1:-1,x,y+1));assert(p.submit(i?1:-1,x,Math.round(y*100)/100));if(!i){assert(!p.solved);p.submit(-1,x,y);assert(!p.solved);}});assert(p.solved);
}
assert.equal(formulas.size,20);let prev=null;for(let cycle=0;cycle<3;cycle++){const ids=[];for(let n=0;n<20;n++){const s=w.EricVariants.take();if(n===0)assert.notEqual(s.id,prev);ids.push(s.id);prev=s.id;}assert.equal(new Set(ids).size,20);}
console.log('OK: 20 distinct rendered equations, independent quadratic solutions, rounding, incorrect answers, branch checks and no-repeat bag.');

const events=[],hazards=new w.EricPotions(type=>events.push(type));
for(let i=0;i<80;i++)hazards.tick(.1,{x:i<68?3:8,y:7.5});hazards.tick(.01,{x:8,y:7.5});assert.equal(hazards.bottles.length,1);assert.equal(hazards.bottles[0].x,3,'Apunta a la posición anterior, no a la actual');
for(let i=0;i<16;i++)hazards.tick(.1,{x:8,y:7.5});assert.equal(hazards.pools.length,1);assert(events.includes('splash'));assert(!hazards.caught);
hazards.tick(.1,{x:3,y:7.5,jumpHeight:.3});assert(!hazards.caught,'Se puede saltar sobre el charco');hazards.tick(.1,{x:3,y:7.5,jumpHeight:0});assert(hazards.caught);assert.equal(events.filter(e=>e==='hit').length,1);hazards.tick(1,{x:3,y:7.5});assert.equal(events.filter(e=>e==='hit').length,1);
hazards.reset();hazards.pools=[{x:3,y:7.5,expires:2}];hazards.tick(1.99,{x:8,y:7.5});assert.equal(hazards.pools.length,1);hazards.tick(.02,{x:3,y:7.5});assert.equal(hazards.pools.length,0);assert(!hazards.caught);assert.equal(hazards.bottles.length,0);
console.log('OK: pociones con posición retrasada, aviso de vuelo, charco de dos segundos, salto, captura única y reinicio limpio.');
