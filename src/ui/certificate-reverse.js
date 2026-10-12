/* One reversible diploma, shared by both ceremony routes. No progress mutations. */
window.CertificateReverse = class {
  constructor() {
    const certificate = this.el = document.querySelector('#ceremony-certificate');
    this.front = document.createElement('div');this.front.id = 'certificate-front';
    const buttons = [...certificate.querySelectorAll('button')];
    for (const child of [...certificate.children])
      if (!buttons.includes(child) && child.id !== 'ceremony-preview') this.front.append(child);
    certificate.append(this.front);
    this.back = document.createElement('section');this.back.id = 'certificate-back';this.back.hidden = true;
    certificate.append(this.back);
    const actions = document.createElement('div');actions.className = 'certificate-actions';
    this.flip = document.createElement('button');this.flip.id = 'certificate-flip';this.flip.type = 'button';
    this.flip.setAttribute('aria-controls', 'certificate-front certificate-back');
    this.flip.onclick = () => {this.back.hidden = !this.back.hidden;this.front.hidden = !this.back.hidden;this.updateButton();certificate.scrollTop = 0;};
    actions.append(this.flip, ...buttons);certificate.append(actions);
    window.addEventListener('astralia:language', () => this.render());
  }
  reset(performance, verified) {
    this.performance = performance;this.verified = verified;
    this.front.hidden = false;this.back.hidden = true;this.el.scrollTop = 0;this.render();
  }
  updateButton() {
    const en = I18n.lang === 'en';
    this.flip.textContent = this.back.hidden ? (en ? 'View stars and titles ↻' : 'Ver estrellas y títulos ↻') : (en ? 'Return to certificate ↺' : 'Volver al certificado ↺');
    this.flip.setAttribute('aria-pressed', String(!this.back.hidden));
    this.el.classList.toggle('showing-ranks', !this.back.hidden);
  }
  render() {
    this.updateButton();this.back.replaceChildren();
    const en = I18n.lang === 'en', say = (es, english) => en ? english : es;
    const add = (parent, tag, text, className) => {const el = document.createElement(tag);el.textContent = text;if(className)el.className = className;parent.append(el);return el;};
    add(this.back, 'small', 'AVENTURA EPIK · IGNITIA', 'rank-eyebrow');
    add(this.back, 'h2', say('Tu leyenda, sala por sala', 'Your legend, room by room'));
    if (!this.verified || !this.performance) {
      add(this.back, 'p', say('Vista previa · Completa la aventura para conocer tus estrellas y títulos.', 'Preview · Complete the adventure to reveal your stars and titles.'));
      return;
    }
    const {rooms, score, stars} = this.performance;
    add(this.back, 'p', `${'★'.repeat(stars)}${'☆'.repeat(5-stars)} · ${score} / 100`, 'rank-total');
    add(this.back, 'p', say('Puntaje de aventura · Los retos de cálculo tienen doble peso.', 'Adventure score · Calculation challenges carry double weight.'), 'rank-caption');
    const list = add(this.back, 'ol', '', 'rank-list');
    rooms.forEach((r, index) => {
      const item = add(list, 'li', '', 'rank-card');item.dataset.room = r.id;
      add(item, 'small', `${index + 1} · ${I18n.t(r.name)}`, 'rank-room');
      const rating = add(item, 'span', r.stars ? '★'.repeat(r.stars)+'☆'.repeat(5-r.stars) : '—', 'rank-stars');
      rating.setAttribute('aria-label', say(`${r.stars} de 5 estrellas`, `${r.stars} out of 5 stars`));
      add(item, 'strong', r.titles ? r.titles[en?1:0] : r.assisted ? say('Sin acreditar · IA', 'Not credited · AI') : say('Pendiente', 'Pending'), 'rank-title');
      add(item, 'span', `${r.score} / 100`, 'rank-score');
      add(item, 'p', say(`Intentos: ${r.attempts} · Errores: ${r.errors} · Muertes: ${r.deaths}`, `Attempts: ${r.attempts} · Errors: ${r.errors} · Deaths: ${r.deaths}`), 'rank-metrics');
      add(item, 'p', say(`Pistas: ${r.hints?'sí':'no'} · IA: ${r.assisted?'sí':'no'}`, `Hints: ${r.hints?'yes':'no'} · AI: ${r.assisted?'yes':'no'}`), 'rank-metrics');
    });
    const details = document.createElement('details');details.className = 'rank-rules';this.back.append(details);
    add(details, 'summary', say('Cómo se obtienen las estrellas', 'How stars are earned'));
    add(details, 'p', say('5★: 90–100 · 4★: 75–89 · 3★: 60–74 · 2★: 40–59 · 1★: 0–39.', '5★: 90–100 · 4★: 75–89 · 3★: 60–74 · 2★: 40–59 · 1★: 0–39.'));
    add(details, 'p', say('Cada sala: 80 % resolución y 20 % supervivencia. Cada pregunta parte de 100; pierde 10 por error, hasta un mínimo de 60. Se promedian las preguntas, sin penalizar por haber varias. La supervivencia parte de 100: las primeras 2 muertes no restan; las siguientes restan 10 cada una. En el corredor solo cuenta la supervivencia.', 'Each room: 80% problem solving and 20% survival. Each question starts at 100 and loses 10 per error, down to 60. Questions are averaged, so having several is not a penalty. Survival starts at 100: the first 2 deaths are free, then each death deducts 10. The corridor uses survival only.'));
    add(details, 'p', say('Usar IA deja la sala en 0 puntos y sin estrellas. Las pistas y el tiempo no restan. Estas estrellas son logros del juego, no una calificación oficial del curso.', 'AI assistance leaves that room at 0 points with no stars. Hints and time do not deduct points. These stars are game achievements, not an official course grade.'));
  }
};
