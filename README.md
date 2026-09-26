# Astralia · Academia de los seis umbrales

Escape room educativo en HTML, CSS y JavaScript, con menús de RPG clásico: azul nocturno, cristal, detalles dorados y letras más grandes. Seis habitaciones; las tres primeras tienen retos completos y las otras tres reservan futuros desafíos. Vista 2.5D por raycasting con objetos dibujados en canvas, sin dependencias externas. Las paredes incluyen estandartes, un retrato ilustrado original de Einstein y ecuaciones grafiteadas.

## Abrir

Abre `index.html` en un navegador moderno. No requiere instalación ni conexión. Opcionalmente: `python3 -m http.server 8000` desde esta carpeta.

## El castillo del Dr. Eric

La aventura recorre seis ambientes: **bosque del abismo** (I), **portal del castillo** (II), **laberinto de Ivan** (III), **Gabinete de la tormenta** (IV), **Cripta cuántica** (V) y **laboratorio del Dr. Eric** (VI). El bosque tiene límites de árboles y maleza; la entrada conserva cielo y un portal rúnico. Desde la sala III hay techo de piedra con vigas, sin cielo.

La galería incluye ilustraciones de Doofenshmirtz, Planck, Tesla, Curie y el Dr. Eric, con marcos y paletas distintas. Los personajes históricos aparecen caracterizados como villanos ficticios dentro de la historia. Los retos IV–VI siguen reservados para futuras actividades.

Resolver la ruleta rompe el sello violeta y activa un portal turquesa atravesable. La mesa está ligeramente desplazada para que se vea la entrada detrás.

Al entrar aparece una introducción: el Dr. Eric se oculta en un castillo abandonado y prepara la divergencia, un experimento que unirá la gravedad y el espacio. Las paredes son de ladrillo antiguo con juntas alternadas, grietas y humedad; se conservan los cuadros, grafitis y estandartes.

Pulsa **Entrar al castillo** para iniciar una aventura de **30 minutos**. El reloj permanece en la esquina inferior derecha: verde al principio, naranja cuando quedan **10 minutos** y rojo en los últimos **3 minutos**. El texto también indica la urgencia.

El tiempo es global: sigue corriendo al cambiar de habitación, reiniciar un reto, caer, reaparecer o cambiar de pestaña. Al llegar a cero, el Dr. Eric completa la divergencia, se detiene la partida y puedes **Volver a intentarlo** desde la primera sala con otros 30 minutos. Salir por el sexto umbral detiene el reloj. Recargar la página inicia una sesión nueva, con su introducción y sin progreso guardado.

La música futura de tensión tiene su espacio reservado en `assets/audio/tension/README.md` y sus eventos en `src/engine/adventure.js`; todavía no se añaden pistas ni se cambia la música según la fase.

## Primera sala · El puente de Galileo

1. Elige una bala en el estante: Saphir (0.5 kg), Ambre (1 kg), Rubis (2 kg) o Améthyste (4 kg).
2. Pulsa **Cargar orbe**, o toca el cañón de la escena después de elegirla. La recámara se ilumina con su color. La torreta Prisma tiene una base hexagonal y un cabezal de cristal, sin tubo largo ni ruedas.
3. Calcula y escribe elevación θ, giro horizontal φ y rapidez o energía en campos numéricos. No hay deslizadores de tiro. Gira hacia atrás desde el inicio: el muro de piedra tiene cinco ecuaciones grafiteadas directamente sobre los ladrillos, sin pizarra ni marco para que elijas las pertinentes. Los campos vacíos o fuera de sus límites no disparan ni consumen el orbe.
4. Dispara. Cada lanzamiento consume la bala cargada; hay suministro ilimitado en el estante.
5. Al alcanzar el botón suspendido, suena el MP3 de victoria y se activa el puente. Cruza por el centro; pisar el abismo provoca una caída. Rodea la torreta: es un objeto sólido.
6. Si disparas con más de 180 J, la torreta explota y tu personaje queda fuera de combate. Aparece «en papel nada se quema». La capacidad es una regla del equipo ficticio, no un umbral físico universal.
7. Tras caer o explotar, pulsa **Volver a la plataforma** (también Escape). Conservas el registro y el puente si ya estaba activo; la torreta se repara. Una explosión consume la bala. Un disparo interrumpido por caída no activa el puente.

En **rapidez fijada**, la masa cambia la energía, pero no la trayectoria ideal. En **energía fija**, la rapidez depende de la masa: v = √(2E/m). Modelo sin resistencia del aire, g = 9.81 m/s². El cañón permanece fijo: mirar alrededor no modifica su puntería. La gráfica lateral muestra x e y; los fallos informan también del desvío lateral z.

## Segunda sala · La rueda del destino

Acércate a la mesa y pulsa su cristal, el botón **Pulsar mesa** o la tecla **E**. Suena una campanada y la rueda gira durante 3.8 segundos. Selecciona sin repetir uno de diez problemas de MRUA, caída libre y tiro parabólico. Dos sectores rojos contienen retos avanzados de intercepción y optimización.

El enunciado aparece en un globo a la derecha de la vista, que puedes minimizar. Busca la **segunda mesa, con panel verde**, a la derecha del portal: acércate, mira hacia él y pulsa **E** o haz clic en la pantalla. Solo así se abre el formulario; al apartar la mirada o alejarte se cierra. Introduce las dos respuestas numéricas en las unidades indicadas. Se acepta punto o coma decimal. Resolver un problema abre la puerta; puedes seguir girando para practicar el resto. Cada problema incluye pista y desarrollo. Reiniciar cierra la puerta y restablece la rueda.

Los enunciados son originales, inspirados temáticamente en la cinemática universitaria de Serway y Jewett; no son transcripciones ni números de ejercicios de una edición concreta. Consulta `docs/FUENTES.md`.

## Tercera sala · El laberinto de Ivan

Cuatro galerías conectadas, con tres o cuatro puertas por tramo. La pregunta conceptual aparece a la derecha; cada puerta lleva una respuesta abreviada. Acércate, mira la puerta y pulsa **E** (o el botón de interacción) para elegir. La correcta abre un paso físico; cruzarlo muestra la siguiente pregunta. Se trabajan fuerza neta, aceleración en la cima de un lanzamiento, caída en el vacío y aceleración centrípeta.

Un error devuelve al inicio y cierra todas las puertas, mostrando una explicación breve. Los fallos del primer tramo no despiertan a Ivan. El primer error desde el segundo tramo activa la persecución: **EPI Ivan** aparece pixelado, alterna reposo y mordida y camina a 0.72 celdas/s, frente a las 2.3 del jugador. Busca un camino por las casillas libres, sin atravesar paredes. Si te alcanza, vuelves al inicio; seguirá persiguiéndote. El reloj no se reinicia. Al salir de la sala III desaparece. Cambiar de sala con el menú restablece el reto, como en las demás habitaciones.

## Epi Paola · Pistas durante la aventura

Hay una guía provisional en las primeras tres salas. Haz clic en ella, acércate y mírala con **E**, o pulsa **Epi Paola · Ayuda**. En Galileo invita a mirar las ecuaciones detrás del inicio; en la ruleta orienta según el problema; en el laberinto ofrece una pista conceptual para el tramo actual. Su figura aún no reproduce a Paola: está preparada para reemplazarse con la foto que aportará el usuario. El sprite de Ivan y el prompt de generación están documentados en `assets/sprites/README.md`.

## Controles y audio

- WASD: caminar; flechas izquierda/derecha: girar la cámara. Arrastra el mouse dentro de la escena (o el dedo en pantalla táctil) para mirar horizontal y verticalmente. Un clic breve conserva la interacción con la torreta o el cristal.
- Mantén **Shift** mientras caminas para esprintar: 55 % más rápido. Soltarlo devuelve la velocidad normal; el movimiento diagonal conserva la misma rapidez y las colisiones siguen activas.
- Espacio o botón **Saltar**: salto corto, sin doble salto. Puedes caer si aterrizas en el abismo; necesitas activar el puente para cruzar la primera sala.
- F: disparar; en las salas II y III, interactuar. E: usar la ruleta, el panel, una puerta o hablar con la guía. En móvil hay botones de movimiento y pasos laterales junto a la escena.
- El **Cuaderno de física** reúne gráfica, fórmulas y pistas. **Sobre la torreta** explica la puntería, la masa y la capacidad del equipo. Ambos se despliegan cuando los necesitas.
- **Trayectoria** abre una pequeña proyección verde dentro de la escena. Se abre automáticamente al disparar, anima el recorrido real y conserva el último intento. En la primera sala solo se muestra el recorrido real: no hay predicción ni alcance calculado de antemano. La vista es lateral y el texto informa del desvío lateral. Puedes cerrarla con ×. No necesitas desplegar el cuaderno.
- El ambiente intenta sonar al entrar al mundo, con una entrada suave. Si el navegador bloquea la reproducción automática, comienza con el primer clic o tecla. **Activar sonido** permite reintentar o desactivar el audio; una desactivación explícita se respeta durante la sesión.
- El mezclador incluye volumen general, fondo, victoria y efectos, con silencio independiente. La victoria reduce gradualmente el fondo al 18 %. En sus últimos 2.2 segundos se desvanece mientras el ambiente recupera su volumen de forma progresiva. El audio se pausa al ocultar la pestaña.
- El menú permite probar cualquiera de las seis habitaciones. Cambiar de sala restablece su reto.

## Estructura

- `src/rooms/room-01/`: configuración, física del proyectil, masa, carga y laboratorio.
- `src/rooms/room-02/`: configuración, banco de problemas y controlador de ruleta.
- `src/rooms/room-03/`: mapa, banco conceptual, puertas, reinicios y persecución.
- `src/rooms/room-04/` a `room-06/`: espacios para futuros retos.
- `src/engine/actors.js`: mesas, guía, etiquetas de puertas y sprite animado de Ivan.
- `src/ui/companions.js` y `world-panels.css`: globos, pistas y formulario dentro de la escena.
- `src/engine/renderer.js`: raycasting, cámara con altura e inclinación, cañón, pantalla y mesa/ruleta.
- `src/engine/decor.js`: ladrillos envejecidos, retrato, grafitis y estandartes originales dibujados en canvas; proyección sobre las paredes.
- `src/engine/adventure.js`: contador global, umbrales y eventos para futura música de tensión.
- `src/audio/sound.js`: mezclador y reproducción de los MP3 locales aportados por el usuario; clics y disparos sintetizados.
- `assets/audio/ambiente.mp3`, `victoria.mp3`, `explosion.mp3`: copias de los tres archivos facilitados. Los originales de Descargas no se modifican.
- `src/main.js`: navegación, interacción y colisiones.
- `src/ui/styles.css` y `src/ui/rpg.css`: tema base y menús de RPG adaptables.
- `src/ui/trajectory-hologram.js`: proyección del tiro dentro de la escena, sincronizada con la física del orbe.
- `assets/`: carpetas reservadas para futuros recursos.
- `tests/maze.cjs`: puertas, progresión, errores, persecución y captura; ejecutar `node tests/maze.cjs`.
- `tests/physics.cjs`: comprobación de física y respuestas; ejecutar `node tests/physics.cjs`.
- `tests/adventure.cjs`: reloj, estados de tiempo y cruces de muros; ejecutar `node tests/adventure.cjs`.

Repositorio: https://github.com/jiruma1004/Astralia. Demo: https://jiruma1004.github.io/Astralia/. El progreso y los intentos viven en memoria; se reinician al recargar. Las salas 04–06 mantienen puertas de boceto que se abren con un disparo.
