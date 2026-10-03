const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),w={};w.window=w;vm.createContext(w);
for(const f of ['src/rooms/room-01/room.js','src/rooms/room-015/room.js','src/rooms/room-015/measurement.js'])vm.runInContext(fs.readFileSync(f,'utf8'),w);
const p=w.MeasurementPuzzle,answer={height:'243',width:'126.4',area:'30720',uncertainty:'60'};
assert(Math.abs(p.area-30715.2)<1e-8);assert(Math.abs(p.uncertainty-Math.sqrt(126.4**2*.5**2+243**2*.05**2))<1e-8);assert.equal(p.evaluate(answer),null);assert.equal(p.evaluate({...answer,area:'3.072e4',uncertainty:'6e1'}),null);
for(const bad of [{height:'244'},{width:'126'},{area:'30715.2'},{uncertainty:'64.36'},{area:'30720.0'},{uncertainty:'60.0'},{area:'Infinity'},{area:''}])assert(p.evaluate({...answer,...bad}));
assert.equal(p.evaluate({...answer,width:'126,4'}),null);assert.equal(w.MEASUREMENT_ENABLED,false);assert.equal(w.ESCAPE_ROOMS.length,1);assert.equal(w.ESCAPE_ROOMS[0].measurementEntrance,undefined);assert.notEqual(w.ESCAPE_ROOMS[0].map[0][23],4);
// Preserve the optional room as a working, re-enableable module.
vm.runInContext(fs.readFileSync('src/rooms/room-015/room.js','utf8').replace('MEASUREMENT_ENABLED=false','MEASUREMENT_ENABLED=true'),w);assert.equal(w.ESCAPE_ROOMS[0].map[0][23],4);assert(w.ESCAPE_ROOMS[1].measurement);assert(!w.ESCAPE_ROOMS[1].canUnlock({measured:false}));assert(w.ESCAPE_ROOMS[1].canUnlock({measured:true}));
assert(w.MeasurementArt.closeup('width').includes('M290 130'));assert(w.MeasurementArt.closeup('height').includes('M172 300'));
console.log('OK: mediciones, propagación independiente, redondeo, cifras significativas, coma decimal y marcas de las reglas.');
