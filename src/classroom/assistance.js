/* Local calculation hints and an explicit assisted crossing for the first trial. */
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
    document.querySelector('.controls').insertAdjacentHTML('beforeend', '<button id="extra-help" hidden title="Revelar la solución resta un punto del certificado"><b>IA · Ver solución</b><small>Resta 1 punto</small></button>');
    document.querySelector('.scene-view').insertAdjacentHTML('beforeend', '<section id="extra-help-panel" class="world-console" hidden aria-label="Solución automática"><header id="extra-help-handle" tabindex="0" aria-label="Mover solución: arrastra o usa las flechas"><strong>IA · Solución</strong><small>Arrastra para mover · Ajusta desde la esquina</small></header><button id="extra-help-close" class="bubble-fold" aria-label="Cerrar ayuda">×</button><p id="extra-help-copy"></p><pre id="extra-help-answer"></pre></section>');
    this.button = document.querySelector('#extra-help');
    this.panel = document.querySelector('#extra-help-panel');
    this.handle = document.querySelector('#extra-help-handle');
    this.button.onclick = () => this.open();
    document.querySelector('#extra-help-close').onclick = () => this.close();
    this.handle.onpointerdown = event => {
      if (event.button !== 0) return;
      event.preventDefault();
      window.dispatchEvent(new Event('astralia:ui-open'));
      this.drag = {id:event.pointerId, x:event.clientX, y:event.clientY, left:this.panel.offsetLeft, top:this.panel.offsetTop};
      this.handle.setPointerCapture(event.pointerId);
    };
    this.handle.onpointermove = event => {
      if (this.drag?.id !== event.pointerId) return;
      this.position(this.drag.left + event.clientX - this.drag.x, this.drag.top + event.clientY - this.drag.y);
    };
    this.handle.onpointerup = this.handle.onpointercancel = this.handle.onlostpointercapture = () => { this.drag = null; };
    this.handle.onkeydown = event => {
      const delta = {ArrowLeft:[-24,0],ArrowRight:[24,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[event.key];
      if (!delta) return;
      event.preventDefault();event.stopPropagation();
      this.position(this.panel.offsetLeft + delta[0], this.panel.offsetTop + delta[1]);
    };
    // Keep the title and close control reachable after resize/fullscreen changes.
    this.boundsObserver = new ResizeObserver(() => this.keepInBounds());
    this.boundsObserver.observe(this.panel);
    this.boundsObserver.observe(this.panel.parentElement);
  }
  eligible() {
    const room = this.game().room;
    return !!(room.trial || room.physics || room.roulette || room.boss);
  }
  position(left, top) {
    const scene = this.panel.parentElement;
    this.panel.style.left = Math.max(8, Math.min(left, scene.clientWidth-this.panel.offsetWidth-8))+'px';
    this.panel.style.top = Math.max(8, Math.min(top, scene.clientHeight-this.panel.offsetHeight-8))+'px';
    this.panel.style.right = this.panel.style.bottom = 'auto';
  }
  keepInBounds() {
    if (this.panel.hidden) return;
    const scene=this.panel.parentElement;
    if(this.panel.offsetLeft<8 || this.panel.offsetTop<8 || this.panel.offsetLeft+this.panel.offsetWidth>scene.clientWidth-8 || this.panel.offsetTop+this.panel.offsetHeight>scene.clientHeight-8) this.position(this.panel.offsetLeft,this.panel.offsetTop);
  }
  update() {
    const hidden = !this.eligible() || !this.session.available(this.context().objective_id) || !this.canUse?.();
    if (this.button.hidden !== hidden) this.button.hidden = hidden;
    if (!hidden) {
      const trial = this.game().room.trial;
      this.button.querySelector('b').textContent = I18n.t(trial ? 'Ayuda IA' : 'IA · Ver solución');
      this.button.title = I18n.t(trial ? 'Cruzar en tirolesa resta un punto del certificado' : 'Revelar la solución resta un punto del certificado');
      const text = I18n.t(this.session.state(this.game().room.id).assisted ? 'Reto penalizado' : 'Resta 1 punto');
      const label=this.button.querySelector('small');
      if(label.textContent!==text)label.textContent=text;
    }
  }
  open() {
    if (!this.eligible() || !this.canUse?.() || !this.session.available(this.context().objective_id)) return;
    const context=this.context();
    // The visible button states the penalty; one click reveals the answer.
    // assist() is idempotent: reopening never deducts another point.
    if (!this.session.assist(context, this.game().snapshot())) return;
    if (this.game().room.trial) {
      this.close();
      window.dispatchEvent(new Event('astralia:ui-open'));
      this.game().trial.startZipline();
      this.update();
      return;
    }
    this.contextAtOpen = context.objective_id;
    this.revealed = true;
    this.panel.hidden = false;
    document.querySelector('#extra-help-copy').textContent = I18n.t('Este reto no suma al certificado. El juego continúa mientras lees.');
    this.render();this.keepInBounds();
    window.dispatchEvent(new Event('astralia:ui-open'));
    document.querySelector('#extra-help-close').focus({preventScroll:true});
  }
  render() {
    const el=document.querySelector('#extra-help-answer'), text=EpikSolutions.text(this.game());
    if(el.textContent!==text)el.textContent=text;
  }
  tick(dt) {
    this.update();
    if(this.panel.hidden)return;
    if(!this.eligible() || !this.canUse?.() || this.contextAtOpen!==this.context().objective_id){this.close();return;}
    this.elapsed+=dt;
    if(this.elapsed>=.25){this.elapsed=0;this.render();}
  }
  close() {
    if (this.panel.contains(document.activeElement)) document.querySelector('#game').focus({preventScroll:true});
    this.panel.hidden=true;this.revealed=false;this.drag=null;
  }
};
