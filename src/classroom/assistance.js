/* Deterministic local solutions. Rendering the answer never executes a game action. */
window.EpikSolutions = {
  cannon(lab) {
    const p = lab.room.physics,
      D = (p.targetX - p.originX) * p.metersPerCell,
      dy = p.targetHeight - p.height,
      a = 45 * Math.PI / 180,
      v = Math.sqrt(p.gravity * D * D / (2 * Math.cos(a) ** 2 * (D * Math.tan(a) - dy))),
      mass = lab.loaded?.mass ?? lab.ammo[lab.selected ?? 0].mass,
      energy = .5 * mass * v * v;
    return {
      distance: D,
      height: p.targetHeight,
      angle: 45,
      azimuth: 0,
      speed: v,
      mass,
      energy,
      overload: energy > p.maxEnergy
    };
  },
  intercept(sim) {
    for (let duration = 140; duration >= 40; duration--) {
      const epoch = sim.missionTime,
        target = InterceptionPhysics.eric(epoch + duration),
        p = InterceptionPhysics.aimAt({
          delay: 0,
          duration
        }, target.x, target.y);
      p.speed = Number(p.speed.toFixed(2));
      p.angle = Number(p.angle.toFixed(1));
      if (InterceptionPhysics.evaluate(p, epoch).hit) return {
        ...p,
        epoch
      };
    }
    return null;
  },
  text(g) {
    const {
        room,
        lab,
        maze,
        roulette,
        boss,
        trial,
        ignitia
      } = g,
      es = I18n.lang !== 'en',
      say = (a, b) => es ? a : b;
    if (room.trial) return say('La respuesta es ', 'The answer is ') + (trial.question.answer ? say('Verdadero.', 'True.') : say('Falso.', 'False.')) + ' ' + I18n.t(trial.question.hint) + say(' Salta tú a esa plataforma.', ' Jump onto that platform yourself.');
    if (room.physics) {
      const q = this.cannon(lab);
      return say(`Blanco a ${q.distance} m y ${q.height} m de altura. Usa elevación 45°, giro 0° y rapidez ${q.speed.toFixed(3)} m/s. Con ${q.mass} kg, E = ½mv² = ${q.energy.toFixed(2)} J. `, `Target: ${q.distance} m away, ${q.height} m high. Use elevation 45°, bearing 0°, speed ${q.speed.toFixed(3)} m/s. With ${q.mass} kg, E = ½mv² = ${q.energy.toFixed(2)} J. `) + (q.overload ? say(`Esa masa sobrecarga la torreta: elige el orbe Saphir de 0.5 kg y conserva la rapidez; con ese orbe usa ${(0.25 * q.speed * q.speed).toFixed(2)} J.`, `That mass overloads the cannon: choose the 0.5 kg Saphir orb and keep the speed; with that orb use ${(0.25 * q.speed * q.speed).toFixed(2)} J.`) : say('Carga el orbe y realiza el disparo.', 'Load the orb and fire.'));
    }
    if (room.roulette) {
      const q = roulette.current;
      return q ? I18n.t(q.solution) + '\n' + q.fields.map(f => I18n.t(f[0]) + ': ' + Number(f[2].toFixed(4)) + ' ' + f[1]).join('\n') : say('Primero gira la rueda.', 'Spin the wheel first.');
    }
    if (room.conceptual) {
      const q = maze.question;
      if (q.branch) return say('Ambas respuestas son válidas: el electrón presenta dualidad onda-partícula. Elige libremente la ruta.', 'Both answers are valid: the electron exhibits wave-particle duality. Choose either route.');
      const d = maze.doors.find(d => d.correct && (maze.dungeon || d.stage === maze.stage));
      return say('Elige la puerta: ', 'Choose the door: ') + I18n.t(d?.text || '') + '. ' + I18n.t(q.hint);
    }
    if (room.corridor) return say('En la lava puedes seguir los apoyos de la izquierda: primero el central izquierdo, luego los dos cercanos al muro izquierdo y después vuelve hacia el centro para salir. Corre con Shift, suelta el avance al aterrizar y salta con Espacio. Los símbolos avanzan rectos: cambia de carril.', 'Across the lava, follow the left supports: start on the middle-left stone, then the two near the left wall, then return towards the center to exit. Sprint with Shift, release forward movement on landing, and jump with Space. Symbols travel straight: change lanes.');
    if (room.boss) {
      const s = boss.puzzle.support;
      return say('Iguala ', 'Set ') + s.parabolaText + ' = ' + s.lineText + say('. Las raíces son ', '. The roots are ') + s.intersections.map(([x, y], i) => (i === 0 ? say('láser izquierdo', 'left laser') : say('láser derecho', 'right laser')) + `: (${x}, ${Number(y.toFixed(6))})`).join('; ') + say('. Sustituye cada x en la recta para obtener y. Introduce las coordenadas en cada láser.', '. Substitute each x in the line to get y. Enter the coordinates at each laser.');
    }
    const q = this.intercept(ignitia.simulator);
    return q ? say(`Solución actualizada para t₀ = ${q.epoch.toFixed(1)} s: v₀ = ${q.speed} km/s, θ = ${q.angle}°, retraso = 0 s y vuelo = ${q.duration} s. Usa x = v₀ cosθ τ e y = v₀ senθ τ − ½gτ². Eric sigue avanzando: esta propuesta se recalcula mientras lees. Introduce los valores y ensaya de inmediato.`, `Updated solution for t₀ = ${q.epoch.toFixed(1)} s: v₀ = ${q.speed} km/s, θ = ${q.angle}°, delay = 0 s, flight = ${q.duration} s. Use x = v₀ cosθ τ and y = v₀ sinθ τ − ½gτ². Eric keeps moving: these values update while you read. Enter them and run the trial promptly.`) : say('Ya no queda tiempo para interceptarlo con los límites disponibles. Tras el game over, vuelve a intentarlo desde el punto seguro.', 'There is not enough time for an intercept within the available limits. After game over, try again from the checkpoint.');
  }
};
window.EpikAssistance = class {
  constructor(session, getGame, getContext) {
    this.session = session;
    this.game = getGame;
    this.context = getContext;
    this.revealed = false;
    this.elapsed = 0;
    document.querySelector('.controls').insertAdjacentHTML('beforeend', '<button id="extra-help" hidden>IA</button>');
    document.querySelector('.scene-view').insertAdjacentHTML('beforeend', '<section id="extra-help-panel" class="world-console" hidden><button id="extra-help-close" class="bubble-fold" aria-label="Cerrar ayuda">×</button><h2>IA · Ayuda automática local</h2><p id="extra-help-copy"></p><pre id="extra-help-answer" hidden></pre><button id="extra-help-confirm" class="primary">Ver solución</button><button id="extra-help-cancel">Seguir intentando</button></section>');
    this.button = document.querySelector('#extra-help');
    this.panel = document.querySelector('#extra-help-panel');
    this.button.onclick = () => this.open();
    document.querySelector('#extra-help-confirm').onclick = () => this.reveal();
    for (const id of ['extra-help-close', 'extra-help-cancel']) document.querySelector('#' + id).onclick = () => this.close();
  }
  update() {
    const hidden = !this.session.available(this.context().objective_id) || !this.canUse?.();
    if (this.button.hidden !== hidden) this.button.hidden = hidden;
  }
  open() {
    if (!this.canUse?.() || !this.session.available(this.context().objective_id)) return;
    this.revealed = false;
    this.contextAtOpen = this.context().objective_id;
    this.panel.hidden = false;
    document.querySelector('#extra-help-answer').hidden = true;
    document.querySelector('#extra-help-confirm').hidden = false;
    document.querySelector('#extra-help-copy').textContent = I18n.t('Usar esta ayuda revelará la solución. Podrás continuar jugando, pero este reto no contará como resuelto sin ayuda y perderás su estrella.');
    window.dispatchEvent(new Event('astralia:ui-open'));
    document.querySelector('#extra-help-confirm').focus();
  }
  reveal() {
    if (!this.canUse?.() || this.panel.hidden || this.revealed || this.contextAtOpen !== this.context().objective_id) return;
    if (!this.session.assist(this.context(), this.game().snapshot())) return;
    this.revealed = true;
    document.querySelector('#extra-help-answer').hidden = false;
    document.querySelector('#extra-help-confirm').hidden = true;
    document.querySelector('#extra-help-copy').textContent = I18n.t('Solución asistida · este reto ya no aporta estrella. El juego continúa mientras lees.');
    this.render();
  }
  render() {
    const el = document.querySelector('#extra-help-answer'),
      text = EpikSolutions.text(this.game());
    if (el.textContent !== text) el.textContent = text;
  }
  tick(dt) {
    this.update();
    if (this.panel.hidden) return;
    if (!this.canUse?.() || this.contextAtOpen !== this.context().objective_id) {
      this.close();
      return;
    }
    if (this.revealed) {
      this.elapsed += dt;
      if (this.elapsed >= .25) {
        this.elapsed = 0;
        this.render();
      }
    }
  }
  close() {
    this.panel.hidden = true;
    this.revealed = false;
  }
};
