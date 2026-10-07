const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const w={};w.window=w;vm.createContext(w);vm.runInContext(fs.readFileSync('src/rooms/room-06/interception.js','utf8'),w);
const physics=w.InterceptionPhysics;
// Independent analytic construction: solve both position equations at t = d + τ.
for(const delay of [0,20,60])for(const duration of [70,90,120]){
 const x=120+(.308*11/Math.hypot(11,5))*(delay+duration),y=60+(.308*5/Math.hypot(11,5))*(delay+duration),vx=x/duration,vy=y/duration+.5*.00981*duration;
 const p={speed:Math.hypot(vx,vy),angle:Math.atan2(vy,vx)*180/Math.PI,delay,duration};
 assert(physics.evaluate(p).hit);assert(physics.evaluate(p).distance<1e-10);
 const drag=physics.aimAt({...physics.initial,delay,duration},x,y);assert(physics.evaluate(drag).hit);
 // Same geometric destination at the wrong clock time is NOT an intercept.
 const wrong={...p,delay:delay===60?0:60};assert(!physics.evaluate(wrong).hit);
}
assert(!physics.evaluate(physics.initial).hit);
assert(physics.evaluate({speed:.8,angle:5,delay:0,duration:140}).ground);
for(const bad of [{speed:NaN},{duration:Infinity},{angle:0},{delay:-1},{speed:9},{duration:0}])assert(!physics.evaluate({...physics.initial,...bad}).valid);
const limited=physics.aimAt(physics.initial,1e5,1e5);assert(physics.valid(limited));
const p=physics.aimAt({...physics.initial,delay:0,duration:80},physics.eric(80).x,physics.eric(80).y);assert(physics.evaluate(p).hit);
assert(Math.abs(physics.rocket(p,0).x)<1e-10);assert.equal(physics.eric(0).x,120);
console.log('OK: intercepción simultánea, retraso, soluciones analíticas, arrastre, límites, caída y entradas inválidas.');
for(const epoch of [50,150,300,340]){
 const params={...physics.initial,delay:0,duration:120},target=physics.eric(epoch+120),aimed=physics.aimAt(params,target.x,target.y);
 assert(physics.evaluate(aimed,epoch).hit);assert(!physics.evaluate(aimed,0).hit,'El tiempo anterior al ensayo cambia el punto de encuentro');
}
const lunarTarget=physics.eric(physics.moonTime),late=physics.aimAt({...physics.initial,delay:0,duration:120},lunarTarget.x,lunarTarget.y);
assert(physics.evaluate(late,physics.moonTime-120).valid);assert(physics.evaluate(late,physics.moonTime-120).late);assert(!physics.evaluate(late,physics.moonTime-120).hit);
assert(!physics.evaluate(physics.initial,NaN).valid);assert(!physics.evaluate(physics.initial,-1).valid);
console.log('OK: época de salida, encuentro antes de la Luna y rechazo de llegada tardía.');

assert(Math.abs(Math.hypot(physics.ericVelocity.x,physics.ericVelocity.y)-.308)<1e-12);assert(Math.abs(physics.eric(physics.moonTime).x-252)<1e-10);assert(Math.abs(physics.eric(physics.moonTime).y-120)<1e-10);
