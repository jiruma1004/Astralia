// Sala independiente. Añade aquí la lógica de su único reto.
window.ESCAPE_ROOMS = window.ESCAPE_ROOMS || [];
window.ESCAPE_ROOMS.push({
  id: 'room-02', name: 'La rueda del destino', color: [105, 115, 137],
  spawn: { x: 2.5, y: 3.5, angle: 0 },
  roulette: true, table: {x:4.5,y:3.5},
  challenge: { id: 'challenge-02', title: 'Ruleta de cinemática', implemented: true },
  canUnlock(context) { return context.problemSolved === true; },
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
