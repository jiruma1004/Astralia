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

La mesa y el cañón tienen colisión en main.js. La ruleta se detiene con el sector elegido bajo su indicador; todas las animaciones avanzan con el bucle principal y dejan de actualizarse al cambiar de sala. El único intervalo global actualiza el reloj de la aventura.

## Cámara, salto y decoración

Cada sala declara `environment`: `kind` (`forest`, `gateway` o `interior`), `label`, `tint`, `portraits` y `portal`. `scenery.js` genera vegetación, las dos fases del portal y cinco retratos ilustrados. No necesita imágenes remotas. El bosque sustituye el material y eleva visualmente sus límites a 2.6 celdas, conservando las colisiones y la física del reto.

Los interiores proyectan suelo y techo en coordenadas del mundo, incluidos los movimientos de cámara y el salto. Cada habitación utiliza un tinte y una pareja de retratos distintos; los retratos ajustan su ancho visual al formato del canvas para conservar sus proporciones.

El portal de la sala II ocupa la puerta existente (x=7, y entre 3 y 4). Cerrado se dibuja sobre el muro bloqueante; abierto conserva su aura, respeta las oclusiones y deja pasar al jugador. El sello usa la condición de victoria de la ruleta. Si cambia la puerta de lugar, hay que adaptar `drawPortal`. La mesa se sitúa en (4.5, 2.9) para mostrar el portal desde la entrada.

Arrastrar sobre el canvas modifica `player.angle` y `player.pitch`; el giro vertical está limitado para conservar una vista útil. Pointer capture permite terminar el gesto aunque el mouse salga del canvas. Un desplazamiento mayor de 5 píxeles suprime el clic de interacción. Se mantiene la alternativa de flechas para girar y no se cambia la puntería de la torreta.

Espacio activa un salto de velocidad inicial 2.1 celdas/s y gravedad 4.905 celdas/s² (9.81 m/s² con 2 m/celda). `jumpHeight` eleva la cámara y cambia la proyección de paredes, objetos y suelo. No se permite saltar en el aire ni desde el vacío. Las colisiones laterales continúan activas; aterrizar sin apoyo inicia la derrota. Reaparecer restablece altura y orientación. El alcance de este salto es mucho menor que el abismo de Galileo.

Shift multiplica la velocidad de 2.3 celdas/s por 1.55. Se aplica antes de normalizar el desplazamiento diagonal y utiliza las mismas colisiones. Las teclas se limpian al perder el foco, morir o cambiar de habitación.

`TrajectoryHologram` usa `Projectile.sample`, los parámetros del lanzamiento y `shot.t`; no ejecuta otra simulación. Se abre después de un disparo válido y conserva su traza. La sala I declara `calculationMode:true`: desactiva la predicción, oculta los resultados previos al disparo y usa entradas numéricas con validación de campos activos. Los límites se conservan: rapidez 6–20 m/s, energía 10–240 J, elevación 5–80° y giro −60–60°. Un intento inválido no consume munición. El muro detrás del spawn (cara interior x=1, y=3.25…4.75) contiene cinco fórmulas grafiteadas sin fondo ni marco: las ecuaciones de desplazamiento horizontal y vertical del proyectil, más F = ma, Eₖ = ½mv² y v = v₀ + at; `chalkWall` se genera en `scenery.js`. La escala se calcula con el recorrido y la altura máxima del tiro, no con su posición instantánea, para evitar saltos de escala en vuelo. El panel se oculta al morir o cambiar de habitación.

`decor.js` construye cuatro texturas de canvas sin descargas externas: ladrillos, retrato, ecuaciones y estandartes. Los ladrillos tienen ocho hiladas alternadas y una semilla fija para las grietas, manchas y variaciones de color. Se generan una vez, no en cada fotograma. El raycasting DDA devuelve la cara exacta y la casilla del muro; la coordenada de impacto fija la columna de textura. Las puertas conservan su identificación dorada.

`renderer.decorate` proyecta retrato, ecuaciones y estandartes sobre las caras interiores norte y sur del mapa, respetando la oclusión de los muros. Las ubicaciones asumen la planta actual de siete filas; si cambia, adapta sus coordenadas.

## Aventura y cuenta atrás

`AdventureClock` usa una fecha límite absoluta de `Date.now()`. El reloj comienza al cerrar la introducción con **Entrar al castillo** (también Escape). Se consulta desde el bucle, cada 250 ms y al cambiar la visibilidad. No depende de la tasa de cuadros ni se pausa al ocultar la pestaña; si el navegador suspende los temporizadores, al volver recupera el tiempo real transcurrido.

Estados: `ready`, `running`, `expired`, `complete`. `canPlay()` permite movimiento e interacción solo durante la partida. Caducar cancela el proyectil, cierra un diálogo de caída si lo había y abre el desenlace; reiniciar vuelve a la sala I. Morir o cambiar de habitación conserva la fecha límite. Completar la salida congela el tiempo restante. No hay persistencia entre recargas.

`ADVENTURE_CONFIG` define duración (1800 s), aviso (600 s), peligro (180 s) y reservas de música. `astralia:urgency` se emite una vez por cambio de fase con `phase`, `remainingSeconds` y `musicCue`. Consulta `assets/audio/tension/README.md` para conectar pistas futuras al mezclador. El contador usa `role="timer"` sin anunciar cada segundo; un mensaje separado anuncia los umbrales y los diálogos describen los desenlaces. La animación roja respeta movimiento reducido.

`node tests/adventure.cjs` comprueba los límites exactos, el tiempo transcurrido fuera del bucle, la expiración única, el reinicio, la finalización y los cruces del raycasting.

## Derrota y audio

`death` pausa controles y lógica del reto. `die` cancela el disparo activo; `animateDeath` muestra la caída o fragmentos de explosión y abre un diálogo. `respawn` restablece la posición sin cerrar un puente ganado ni borrar intentos. Cambiar de sala restablece el reto como antes.

Sound usa HTMLAudioElement para MP3, de modo que index.html continúa funcionando mediante file:// sin fetch/CORS. Los efectos sintetizados pasan por Web Audio. Cada canal multiplica su volumen por el general. Al entrar se intenta reproducir el ambiente; si el navegador devuelve NotAllowedError, se reintenta con un gesto. AudioContext se crea al interactuar y no se espera a resume() para continuar el juego. Desactivar el sonido cancela el inicio automático durante la sesión.

`Sound.mix(dt)` se actualiza desde el bucle principal: aplica una entrada de ambiente de 1.2 s, atenúa gradualmente durante la victoria y cruza las pistas durante los últimos 2.2 s del MP3. El volumen general y los silencios se aplican después de las envolventes, de modo que silenciar es inmediato. La victoria puede mantenerse al cambiar de habitación. La derrota detiene fondo/victoria; reaparecer recupera el fondo con una entrada gradual. Ocultar la pestaña pausa el audio y conserva el progreso de las pistas.
