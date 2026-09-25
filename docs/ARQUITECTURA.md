# Ampliar el boceto

## Una habitación, un reto

Cada `src/rooms/room-XX/room.js` registra una sala en `window.ESCAPE_ROOMS`. Edita su nombre, color, posición inicial y cuadrícula. `0` es suelo, `1` muro y `2` puerta y `3` abismo. El abismo permite entrar; `supported` comprueba si el personaje conserva apoyo. Solo hay apoyo en la fila central cuando el puente está activo. Mantén el orden de los scripts del HTML.

Las salas 02–06 conservan una planta que mide 10 × 7 casillas. La puerta está en (7, 3), con un vestíbulo tras ella. La transición se dispara al superar `room.exitX` (7.6 por defecto) con la puerta abierta. La primera sala mide 25 × 7 casillas y sale en x = 22.6. Si cambias el mapa, adapta también esta condición en `src/main.js`.

`challenge` reserva la descripción del futuro reto. `canUnlock(context)` es el punto para comprobar si está resuelto antes de abrir la puerta o desplegar el puente. Las salas pendientes reciben `{ prototypeMode: true }`; la primera recibe `{ targetHit: true }` únicamente tras un impacto válido. La segunda recibe `{ problemSolved: true }` tras evaluar las dos respuestas. Al implementar un reto, añade su estado, actualiza ese contexto y sustituye la condición por su comprobación real.

## Orden sugerido

1. Definir objetivo, pista, interacción y solución en el RETO.md de una sala.
2. Implementar su interacción en esa carpeta.
3. Conectar el resultado a `canUnlock`.
4. Añadir recursos a assets y comprobar que la puerta permanece bloqueada hasta resolverlo.

## Comprobación

`node tests/physics.cjs` verifica ecuaciones, impacto/desvío y las respuestas de los diez problemas. Las pruebas en Chrome de desarrollo cubren recámara vacía, carga/consumo, giro horizontal, modos de masa y energía, audio, ruleta sin repeticiones, respuestas correctas/incorrectas y diseño móvil.

Recorrer manualmente: cargar y disparar en la primera sala, rodear el cañón, cruzar el puente centrado; pulsar mesa en la segunda, resolver el problema, rodear la mesa y salir. Las salas 03–06 siguen siendo bocetos.

## Objetos e interacción

El cañón permanece en el origen físico. Su elevación y giro se dibujan y actualizan desde ProjectileLab. La recámara muestra el color cargado. El renderizador publica áreas de clic para cañón y cristal de mesa; los botones HTML ofrecen las mismas acciones por teclado y móvil.

La mesa y el cañón tienen colisión en main.js. La ruleta se detiene con el sector elegido bajo su indicador; todas las animaciones avanzan con el bucle principal y dejan de actualizarse al cambiar de sala. No hay temporizadores de juego pendientes entre salas.

## Cámara, salto y decoración

Arrastrar sobre el canvas modifica `player.angle` y `player.pitch`; el giro vertical está limitado para conservar una vista útil. Pointer capture permite terminar el gesto aunque el mouse salga del canvas. Un desplazamiento mayor de 5 píxeles suprime el clic de interacción. Se mantiene la alternativa de flechas para girar y no se cambia la puntería de la torreta.

Espacio activa un salto de velocidad inicial 2.1 celdas/s y gravedad 4.905 celdas/s² (9.81 m/s² con 2 m/celda). `jumpHeight` eleva la cámara y cambia la proyección de paredes, objetos y suelo. No se permite saltar en el aire ni desde el vacío. Las colisiones laterales continúan activas; aterrizar sin apoyo inicia la derrota. Reaparecer restablece altura y orientación. El alcance de este salto es mucho menor que el abismo de Galileo.

`decor.js` construye tres texturas de canvas sin descargas externas. `renderer.decorate` las proyecta por columnas sobre las caras interiores norte y sur del mapa, respetando la oclusión de los muros. Las ubicaciones asumen la planta actual de siete filas; si cambia, adapta sus coordenadas.

## Derrota y audio

`death` pausa controles y lógica del reto. `die` cancela el disparo activo; `animateDeath` muestra la caída o fragmentos de explosión y abre un diálogo. `respawn` restablece la posición sin cerrar un puente ganado ni borrar intentos. Cambiar de sala restablece el reto como antes.

Sound usa HTMLAudioElement para MP3, de modo que index.html continúa funcionando mediante file:// sin fetch/CORS. Los efectos sintetizados pasan por Web Audio. Cada canal multiplica su volumen por el general. La victoria atenúa el fondo y se puede mantener al cambiar de habitación. La derrota detiene fondo/victoria; reaparecer recupera el fondo. Los navegadores requieren un gesto del usuario para iniciar audio.
