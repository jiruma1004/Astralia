// Sala independiente. Añade aquí la lógica de su único reto.
window.ESCAPE_ROOMS = window.ESCAPE_ROOMS || [];
window.ESCAPE_ROOMS.push({
  id: 'room-05', name: 'Cripta cuántica', color: [128, 105, 119],
  environment:{kind:'interior',label:'Cripta cuántica',tint:'#46664a',portraits:['planck','doof']},
  spawn: { x: 2.5, y: 3.5, angle: 0 },
  challenge: { id: 'challenge-05', title: 'Reto por definir', implemented: false },
  canUnlock(context) { return context.prototypeMode === true; },
  map: [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,2,0,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
  ]
});
