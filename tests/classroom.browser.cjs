const {
    chromium
  } = require(process.env.PLAYWRIGHT_MODULE || 'playwright'),
  assert = require('node:assert/strict'),
  fs = require('node:fs');
(async () => {
  const b = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  });
  const publicPage = await b.newPage({
      viewport: {
        width: 1440,
        height: 1000
      }
    }),
    errors = [];
  publicPage.on('pageerror', e => errors.push(e.message));
  await publicPage.addInitScript(() => window.requestAnimationFrame = () => 0);
  await publicPage.goto('http://127.0.0.1:8765');
  assert.equal(await publicPage.locator('#rooms,#story-skip,#cinematics-open,#cinema-skip').count(), 0);
  assert.equal(await publicPage.evaluate(() => typeof load), 'undefined');
  assert.equal(await publicPage.evaluate(() => typeof classroom), 'undefined');
  await publicPage.keyboard.press('Escape');
  assert(await publicPage.locator('#adventure-intro').isVisible());
  for (let i = 0; i < 11; i++) await publicPage.locator('#adventure-start').click();
  assert(await publicPage.locator('#cart-arrival').isVisible());
  await publicPage.evaluate(() => {
    document.querySelector('#eric-ready-yes').click();
    const fake = document.createElement('button');
    fake.dataset.room = '5';
    document.body.append(fake);
    fake.click();
  });
  assert.match(await publicPage.locator('#room-title').textContent(), /sendero/i);
  await publicPage.close();
  const p = await b.newPage({
    viewport: {
      width: 1440,
      height: 1050
    }
  });
  p.on('pageerror', e => errors.push(e.message));
  await p.addInitScript(() => window.requestAnimationFrame = () => 0);
  await p.goto('http://127.0.0.1:8765/?dev=1');
  await p.locator('#story-skip').click();
  const notice = async () => p.evaluate(() => {
    document.querySelector('#maze-notice').hidden = true;
  });
  const next = async () => p.evaluate(() => {
    player.x = rooms[index].exitX + .05;
    player.y = rooms[index].boss ? 7.5 : rooms[index].corridor ? 4.5 : rooms[index].physics ? 3.5 : rooms[index].roulette ? 3.5 : player.y;
    tick(last + 16);
  });
  async function dialogueScene(id) {
    assert.equal(await p.evaluate(() => cinematics.item.id), id);
    await p.evaluate(() => cinematics.ready);
    const n = await p.evaluate(() => cinematics.dialogueStops?.length || 0);
    if (!n) {
      await p.evaluate(() => {
        const id = cinematics.item.id;
        for (let i = 0; i < 65 && cinematics.item?.id === id; i++) cinematics.tick(1);
      });
      return;
    }
    for (let i = 0; i < n; i++) await p.evaluate(() => {
      cinematics.tick(100);
      cinematics.inputAfter = 0;
      cinematics.advanceDialogue();
      cinematics.advanceDialogue();
    });
  }
  for (const [route, assisted] of [['particle', true], ['wave', false], ['particle', false], ['wave', true]]) {
    await p.evaluate(() => newClassroomGame());
    await notice();
    assert.equal(await p.evaluate(() => advanceRoom(5)), false);
    await p.evaluate(() => {
      for (let n = 0; n < 5; n++) {
        const q = trial.platforms().find(p => p.stage === trial.stage && p.answer === trial.question.answer);
        Object.assign(player, {
          x: q.x + .5,
          y: q.y + .5,
          jumpHeight: 0
        });
        trial.land(player);
      }
    });
    await next();
    assert.equal(await p.evaluate(() => rooms[index].id), 'room-01');
    await notice();
    await p.evaluate(async () => {
      Object.assign(player, {
        x: 2.6,
        y: 3.5,
        angle: 0
      });
      lab.mode.value = 'speed';
      lab.a.value = 45;
      lab.az.value = 0;
      lab.selected = 0;
      lab.v.value = 10;
      lab.loadAmmo();
      await shoot();
      lab.tick(20);
      lab.loadAmmo();
      await shoot();
      lab.tick(20);
    });
    assert.equal(await p.evaluate(() => classroom.session.state('room-01').incorrect), 2);
    if (assisted) {
      await p.locator('#extra-help').click();
      assert(await p.locator('#extra-help-answer').isVisible());
      assert.equal(await p.evaluate(() => classroom.session.state('room-01').assisted), true);
      await p.locator('#extra-help').click();
      assert.equal(await p.evaluate(() => classroom.session.events.filter(e=>e.event_type==='solution_revealed').length),1);
      await p.locator('#extra-help-close').click();
      await p.evaluate(()=>{die('fall');respawn();Object.assign(player,{x:2.6,y:3.5,angle:0})});
      assert.equal(await p.evaluate(()=>classroom.session.state('room-01').assisted),true);
    }

    await p.evaluate(async () => {
      const a = EpikSolutions.cannon(lab);
      lab.v.value = a.speed;
      lab.loadAmmo();
      await shoot();
      lab.tick(20);
    });
    assert.equal(await p.evaluate(() => opened), true);
    await next();
    assert.equal(await p.evaluate(() => rooms[index].id), 'room-02');
    await notice();
    await p.evaluate(() => {
      roulette.present(8);
      Object.assign(player, {
        x: 6,
        y: 3.5,
        angle: 0
      });
      companions.tick(.01, player, renderer, false, true);
      companions.openConsole();
      for (let i = 0; i < roulette.current.fields.length; i++) document.querySelector('#answer-' + i).value = roulette.current.fields[i][2];
      roulette.check();
      roulette.check();
    });
    assert.equal(await p.evaluate(() => classroom.session.state('room-02').attempts), 1);
    await p.evaluate(() => {
      player.x = 7.8;
      tick(last + 16);
    });
    assert.equal(await p.evaluate(() => rooms[index].id), 'room-03');
    await notice();
    await p.evaluate(route => {
      for (let stage = 0; stage < 4; stage++) {
        const d = maze.doors.find(d => d.stage === stage && d.correct && (stage !== 3 || d.choice === (route === 'particle' ? 0 : 1)));
        maze.choose(d, player);
        player.x = stage === 3 ? 48.3 : (stage + 1) * 12 + 1.1;
        player.y = d.y + .5;
        maze.tick(.001, player);
      }
    }, route);
    await next();
    assert.equal(await p.evaluate(() => rooms[index].id), 'room-04');
    await notice();
    await p.evaluate(() => document.querySelector('#eric-ready-yes').click());
    assert.equal(await p.evaluate(() => opened), false, 'Cannot open corridor exit from spawn via DOM');
    await p.evaluate(() => {
      Object.assign(player, {
        x: 50.3,
        y: 4.5,
        angle: 0
      });
      document.querySelector('#eric-ready-yes').click();
    });
    assert.equal(await p.evaluate(() => opened), true);
    await next();
    assert.equal(await p.evaluate(() => rooms[index].id), 'room-05');
    await notice();
    await p.evaluate(() => {
      boss.wave.phase = 'warning';
      boss.wave.timer = 1;
      tick(last + 16);
    });
    await p.locator('.scene-view').screenshot({
      path: '/tmp/epik-flame-warning.png'
    });
    await p.evaluate(() => {
      boss.resetAttacks();
      for (let i = 0; i < 2; i++) {
        const l = boss.lasers[i];
        Object.assign(player, {
          x: l.x - .8,
          y: l.y,
          angle: 0
        });
        boss.open(player, renderer, rooms[index], opened);
        const q = boss.puzzle.support.intersections[i];
        document.querySelector('#boss-x').value = q[0];
        document.querySelector('#boss-y').value = q[1];
        boss.fire();
      }
      ignitia.tick(11.1);
      ignitia.reveal();
      document.querySelector('#ignitia-next').click();
    });
    assert.equal(await p.evaluate(() => opened), true);
    await next();
    assert.equal(await p.evaluate(() => rooms[index].id), 'room-06');
    await p.evaluate(() => {
      Object.assign(player, {
        x: 6.4,
        y: 5.5,
        angle: 0
      });
      ignitia.open(player);
      const s = ignitia.simulator;
      s.params = EpikSolutions.intercept(s);
      s.sync();
      s.startTrial();
      for (let i = 0; i < 250 && s.running; i++) s.tick(.04);
    });
    assert.equal(await p.evaluate(() => classroom.session.totals().valid), true);
    await dialogueScene('ignitia-intercepcion');
    await dialogueScene(route === 'particle' ? 'ceremonia-ignitia' : 'ceremonia-karla');
    assert(await p.locator('#certificate-csv').isVisible());
    assert.equal(await p.evaluate(() => classroom.session.totals().stars), assisted ? 6 : 7);
    const csv = await p.evaluate(() => classroom.session.csv());
    if (route === 'particle' && assisted) fs.writeFileSync('examples/resultados-ejemplo.csv', csv);
    const download = p.waitForEvent('download');
    await p.locator('#certificate-csv').click();
    const f = await download;
    assert.match(f.suggestedFilename(), /Aventura_EPIK_/);
    assert.equal(await p.evaluate(() => classroom.session.csv()), csv);
    assert.equal(await p.evaluate(() => cinematics.item.id), route === 'particle' ? 'ceremonia-ignitia' : 'ceremonia-karla');
    await p.evaluate(() => I18n.set('en'));
    assert.equal(await p.locator('#certificate-results').textContent(), '');
    assert.equal(await p.locator('.certificate-score').textContent(), (assisted?6:7)+' / 7');
    assert.equal(await p.locator('#ceremony-certificate h3').textContent(), 'CREDITED CHALLENGES');
    assert.equal(await p.locator('#certificate-csv').textContent(), 'Download results CSV');
    await p.evaluate(() => I18n.set('es'));
    await p.locator('.scene-view').screenshot({
      path: '/tmp/epik-certificate-' + route + '.png'
    });
    await p.evaluate(() => {
      cinematics.inputAfter = 0;
      document.querySelector('#certificate-continue').click();
      document.querySelector('#certificate-continue').click();
    });
    await dialogueScene(route === 'particle' ? 'eric-fuga' : 'ivan-descenso');
    assert.equal(await p.evaluate(() => ignitia.mode), 'ending');
  }
  assert.deepEqual(errors, []);
  await b.close();
  console.log('PASS public controls, progression, 7 real challenge validations, single-click aid/penalty/death, attempt logs, both diplomas/CSV/epilogues, duplicate clicks');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
