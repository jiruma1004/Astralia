const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const w={};w.window=w;vm.createContext(w);
for(const path of ['src/rooms/room-06/finale.js','src/rooms/room-06/rocket.js','src/ui/translations.js'])vm.runInContext(fs.readFileSync(path,'utf8'),w);
const flight=w.RocketFinaleScene,ivan=w.IvanLaunchScene;
const before=ivan.state(19-.000001),released=ivan.state(19);
assert.equal(flight.state(18.99).attached,true);
assert.equal(flight.state(19).attached,false);
assert.equal(released.phase,'fall');
assert(Math.abs(before.footZ-released.footZ)<.0001,'No salta de posición al soltarse');
assert(Math.abs(before.rotation-released.rotation)<.0001,'Conserva orientación al soltarse');
assert(ivan.state(19.1).footZ>released.footZ,'Conserva algo de velocidad ascendente');
assert(ivan.state(21).footZ<released.footZ,'La gravedad lo hace caer');
assert.equal(ivan.state(24).visible,false);
assert.equal(flight.state(19).rotation,0);
assert(flight.state(25).rotation>Math.PI*4,'Da varias vueltas completas');
assert(flight.state(24).y!==flight.state(25).y,'Pierde la trayectoria recta');
for(let t=16;t<27;t+=.1){const s=flight.state(t),center=.5+s.pitch-(s.rocketZ+2)/(s.x-3);assert(center>.15&&center<.6,'La cámara mantiene visible el cohete durante el giro');}
const dive=flight.state(27);assert.equal(dive.phase,'dive');
assert(Math.abs(dive.rocketZ-flight.state(26.99999).rocketZ)<.001,'La caída empieza sin salto');
assert(flight.state(29).rocketZ<dive.rocketZ,'El cohete cae');
assert.equal(flight.state(29).pitch,dive.pitch,'La cámara permanece en el cielo');
const impact=flight.state(flight.impactAt);assert.equal(impact.rocketZ,0);assert.equal(impact.visible,false);
assert.equal(impact.pitch,dive.pitch);
assert.deepEqual(flight.state(33),flight.state(60),'Fondo estable durante diálogo y captura');
for(const t of [18,19.1,22])assert(w.ENGLISH[flight.state(t).caption],'Avisos traducidos');
console.log('OK: desprendimiento continuo, caída por gravedad, giro múltiple, seguimiento de cámara, cierre estable y traducciones.');

vm.runInContext(fs.readFileSync('src/cinematics/mission-ending.js','utf8'),w);
for(const t of [0,4,8,8.5,12,16,18.99]){const old=w.RocketFinaleScene.state(t),current=w.MissionEnding.state(t);for(const k of ['x','y','rocketZ','rotation','pitch'])assert(Math.abs(old[k]-current[k])<1e-8,'Reutiliza el ascenso aprobado: '+k);}
for(const t of [19,21,24.9]){const s=w.MissionEnding.state(t);assert.equal(s.rotation,0);assert.equal(s.x,16);assert.equal(s.y,7.5);assert(s.rocketZ>w.MissionEnding.state(t-.01).rocketZ);}
console.log('OK: misma cámara y despegue que la escena anterior; después de soltarse Iván, el cohete sigue recto.');
