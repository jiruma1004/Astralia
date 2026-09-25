// node tests/physics.cjs · sin dependencias de terceros
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),world={};world.window=world;vm.createContext(world);
for(const file of ['src/rooms/room-01/room.js','src/rooms/room-01/projectile.js','src/rooms/room-02/problems.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),world);
const {Projectile:P,PHYSICS_PROBLEMS:qs}=world,p=world.ESCAPE_ROOMS[0].physics;
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
assert.equal(qs.length,10);assert.equal(qs.filter(q=>q.hard).length,2);
assert.ok(P.evaluate(13,45,p).hit);assert.ok(!P.evaluate(13,45,p,15).hit);assert.ok(!P.evaluate(10,35,p).hit);assert.ok(!P.evaluate(18,45,p).hit);
const q=P.sample(13,45,1,p,30);close(Math.hypot(q.x,q.z),13*Math.cos(Math.PI/4));close(q.y,1.2+13/Math.sqrt(2)-4.905);
close(Math.sqrt(2*85/.5)/Math.sqrt(2*85/2),2);close(P.evaluate(16,30,p).range,P.evaluate(16,60,p).range);
const a=i=>qs[i-1].fields.map(f=>f[2]),g=9.81,r=d=>d*Math.PI/180;
{const [d,t]=a(1);close(t,.65+27/4.5);close(d,27*.65+27**2/9);}
{const[t,x]=a(2);close(x,8*t+.6*t*t);close(x,60+4*t);}
{const[v,h]=a(3);close(12,v*.4+.5*g*.4**2);close(v*v,2*g*h);}
{const[t,x]=a(4);close(0,35+22*Math.sin(r(32))*t-.5*g*t*t);close(x,22*Math.cos(r(32))*t);}
{const[y,v]=a(5),t=30/(25*Math.cos(r(40)));close(y,25*Math.sin(r(40))*t-.5*g*t*t);close(v,25*Math.sin(r(40))-g*t);}
{const[h,t]=a(6);close(h,20+100/(2*g));close(0,20+10*t-.5*g*t*t);}
{const[d,v]=a(7);close(d,.5*2.4*8**2+19.2*5+.5*19.2*6);close(v,d/19);}
{for(const theta of a(8))close(40,24**2*Math.sin(2*r(theta))/g);}
{const[t,theta]=a(9);close(25*Math.cos(r(theta))*t,30+4*t);close(25*Math.sin(r(theta))*t-.5*g*t*t,12);assert.ok(t>0&&t<2);}
{const[v,theta]=a(10),u=Math.tan(r(theta));close(9,28*u-g*28**2*(1+u*u)/(2*v*v));close(v**4-2*g*9*v*v-g*g*28*28,0,1e-6);}
console.log('OK: movimiento 3D, impacto, desvíos y soluciones independientes de los 10 problemas.');
