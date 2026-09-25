// Sala independiente. Añade aquí la lógica de su único reto.
window.ESCAPE_ROOMS = window.ESCAPE_ROOMS || [];
window.ESCAPE_ROOMS.push({
  id: 'room-06', name: 'El laboratorio del Dr. Eric', color: [128, 135, 98],
  environment:{kind:'interior',label:'El laboratorio del Dr. Eric',tint:'#714657',portraits:['eric','tesla']},
  spawn: { x: 2.5, y: 3.5, angle: 0 },
  challenge: { id: 'challenge-06', title: 'Reto por definir', implemented: false },
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
