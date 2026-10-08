const assert = require('node:assert/strict'),
  fs = require('node:fs'),
  vm = require('node:vm'),
  crypto = require('node:crypto');
const w = {
  crypto,
  window: null,
  performance: {
    now: () => 0
  },
  I18n: {
    lang: 'es'
  }
};
w.window = w;
vm.createContext(w);
for (const f of ['classroom/session', 'rooms/room-05/flame-wave', 'rooms/room-06/interception', 'rooms/room-01/projectile', 'classroom/assistance']) vm.runInContext(fs.readFileSync('src/' + f + '.js', 'utf8'), w);
let now = 0;
const rooms = Array.from({
    length: 7
  }, (_, i) => ({
    id: 'r' + i,
    name: 'Reto ' + i,
    challenge: {
      id: 'physics'
    }
  })),
  store = new Map(),
  s = new w.EpikSession(rooms, {
    now: () => now,
    wall: () => new Date(0).toISOString(),
    storage: {
      setItem: (k, v) => store.set(k, v)
    }
  });
s.start();
assert(!s.canEnter('r1'));
const ctx = {
  objective_id: 'main',
  question_id: 'q'
};
let id = s.begin(ctx, '=1+1', {
  a: 1
});
s.resolve(id, 'incorrect');
assert(!s.resolve(id, 'incorrect'));
s.attempt(ctx, -3, {
  a: 2
}, false);
assert(s.available('main'));
assert(s.assist(ctx, {}));
assert(s.assist(ctx, {}));
assert.equal(s.events.filter(e => e.event_type === 'solution_revealed').length, 1);
s.clock(true);
now = 1000;
s.clock(false);
now = 3000;
s.clock(false);
assert.equal(s.state('r0').active, 1000);
s.solve();
s.solve();
s.leave();
assert(s.canEnter('r1'));
for (let i = 1; i < 7; i++) {
  s.enter('r' + i);
  s.attempt(ctx, 'correct', {}, true);
  now += 100;
  s.solve();
  s.leave();
}
assert(s.finish());
assert(!s.finish());
assert.equal(s.totals().stars, 6);
const csv = s.csv();
now += 100000;
assert.equal(s.csv(), csv);
assert(csv.includes("'=1+1"));
assert.equal(w.EpikSession.cell(-3), '"-3"');
assert.equal(w.EpikSession.cell('a,"b\nc'), '"a,""b\nc"');
assert.equal(s.rows().filter(r => r.record_type === 'room_summary').length, 7);
fs.writeFileSync('/tmp/epik-csv-unit-example.csv', csv);
assert(store.size > 0);
const broken = new w.EpikSession(rooms, {
  storage: {
    setItem() {
      throw Error('quota');
    }
  }
});
broken.start();
broken.event('test');
assert.equal(broken.storageOK, false);
const C = w.EricFlameWave;
let events = [];
let wave = new C(e => events.push(e)),
  p = {
    x: 3,
    jumpHeight: 0
  };
wave.tick(15, p, true);
assert.equal(wave.phase, 'warning');
wave.tick(2.2, p);
assert.equal(wave.phase, 'wave');
wave.tick(4, p);
assert.equal(events.filter(e => e === 'hit').length, 1);
wave.tick(10, p);
assert.equal(events.filter(e => e === 'hit').length, 1);
wave = new C(e => events.push(e));
p = {
  x: 3,
  jumpHeight: .43
};
wave.tick(17.2, p);
wave.tick((C.config.startX - C.config.endX) / C.config.speed, p);
assert.equal(wave.phase, 'cooldown');
wave.tick(4.999, p);
assert(wave.blocksPotions);
wave.tick(.001, p);
assert.equal(wave.phase, 'idle');
assert(!wave.blocksPotions);
wave.reset();
assert.equal(wave.phase, 'idle');
assert(!wave.caught);
// Analytic helpers must follow every current cannon target and the current lunar epoch.
for (const targetX of [19, 16, 18, 14.5, 17]) {
  const physics = {
      originX: 3.5,
      targetX,
      metersPerCell: 2,
      height: 1.2,
      targetHeight: 4.5,
      gravity: 9.81,
      tolerance: .55,
      maxEnergy: 180,
      maxDistance: 37
    },
    lab = {
      room: {
        physics
      },
      ammo: [{
        mass: .5
      }],
      selected: 0
    };
  const a = w.EpikSolutions.cannon(lab);
  assert(w.Projectile.evaluate(a.speed, 45, physics, 0).hit);
  assert(a.energy <= 180);
}
for (const time of [0, 50, 150, 300]) {
  const a = w.EpikSolutions.intercept({
    missionTime: time
  });
  assert(a && w.InterceptionPhysics.evaluate(a, time).hit);
}
console.log('PASS session, penalties, deduplication, clocks, CSV, storage failure, swept flame and exact cooldown, dynamic solutions');
