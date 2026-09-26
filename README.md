# Astralia · Academia de los seis umbrales

Escape room educativo en HTML, CSS y JavaScript, con menús de RPG clásico: azul nocturno, cristal, detalles dorados y letras más grandes. Seis habitaciones; las cinco primeras tienen actividades y la última reserva un futuro desafío. Vista 2.5D por raycasting con objetos dibujados en canvas, sin dependencias externas. Las paredes incluyen estandartes, un retrato ilustrado original de Einstein y ecuaciones grafiteadas.

## Abrir

Abre `index.html` en un navegador moderno. No requiere instalación ni conexión. Opcionalmente: `python3 -m http.server 8000` desde esta carpeta.

## El castillo del Dr. Eric

La aventura recorre seis ambientes: **bosque del abismo** (I), **portal del castillo** (II), **laberinto de los ecos** (III), **corredor de las ideas** (IV), **parábola de Eric** (V) y **laboratorio del Dr. Eric** (VI). El bosque tiene límites de árboles y maleza; la entrada conserva cielo y un portal rúnico. La sala III tiene techo de piedra; IV y V son patios abiertos bajo el cielo.

La galería incluye ilustraciones de Doofenshmirtz, Planck, Tesla, Curie y el Dr. Eric, con marcos y paletas distintas. Los personajes históricos aparecen caracterizados como villanos ficticios dentro de la historia. El reto VI sigue reservado para una futura actividad.

Resolver la ruleta rompe el sello violeta y activa un portal turquesa atravesable. La mesa está ligeramente desplazada para que se vea la entrada detrás.

Antes de entrar, Epi Paola narra un prólogo de cinco escenas. Los retratos alternan Paola, Eric enfadado con bata de laboratorio, Paola, Iván en un recorte de periódico con el titular «DESAPARECIDO» y Paola. Eric se cansó de que los alumnos no pusieran títulos a las gráficas y prepara la divergencia para unificar la gravedad y el espacio. Iván está desaparecido desde que Eric se fue; se dice que se perdió en un bosque. Al final, Paola recuerda que puedes pedirle ayuda con H. El texto aparece letra por letra; puedes mostrarlo completo, avanzar o saltar el relato. Las paredes son de ladrillo antiguo con juntas alternadas, grietas y humedad; se conservan los cuadros, grafitis y estandartes.

Pulsa **Entrar al mundo** al terminar el prólogo, o **Saltar relato y entrar**, para iniciar una aventura de **30 minutos**. Durante toda la narración el contador permanece detenido. El reloj permanece en la esquina inferior derecha: verde al principio, naranja cuando quedan **10 minutos** y rojo en los últimos **3 minutos**. El texto también indica la urgencia.

El tiempo es global: sigue corriendo al cambiar de habitación, reiniciar un reto, caer, reaparecer o cambiar de pestaña. Al llegar a cero, el Dr. Eric completa la divergencia, se detiene la partida y puedes **Volver a intentarlo** desde la primera sala con otros 30 minutos. Salir por el sexto umbral detiene el reloj. Recargar la página inicia una sesión nueva, con su introducción y sin progreso guardado.

La música futura de tensión tiene su espacio reservado en `assets/audio/tension/README.md` y sus eventos en `src/engine/adventure.js`; todavía no se añaden pistas ni se cambia la música según la fase.

## Primera sala · El puente de Galileo

1. Elige una bala en el estante: Saphir (0.5 kg), Ambre (1 kg), Rubis (2 kg) o Améthyste (4 kg).
2. Pulsa **Cargar orbe**, o toca el cañón de la escena después de elegirla. La recámara se ilumina con su color. La torreta Prisma tiene una base hexagonal y un cabezal de cristal, sin tubo largo ni ruedas.
3. Calcula y escribe elevación θ, giro horizontal φ y rapidez o energía en campos numéricos. No hay deslizadores de tiro. Gira hacia atrás desde el inicio: el muro de piedra tiene cinco ecuaciones grafiteadas directamente sobre los ladrillos, sin pizarra ni marco para que elijas las pertinentes. Los campos vacíos o fuera de sus límites no disparan ni consumen el orbe.
4. Dispara. Cada lanzamiento consume la bala cargada; hay suministro ilimitado en el estante.
5. Al alcanzar el botón suspendido, suena el MP3 de victoria y se activa el puente. Cruza por el centro; pisar el vacío provoca una caída a una singularidad. Rodea la torreta: es un objeto sólido.
6. Si disparas con más de 180 J, la torreta explota y tu personaje queda fuera de combate. Aparece «en papel nada se quema». La capacidad es una regla del equipo ficticio, no un umbral físico universal.
7. Al caer se muestra una viñeta en tercera persona: el personaje cae desde el borde, gira y se pierde en un agujero negro. El canvas permanece fijo; tras **2.6 segundos** aparece **Game Over** y suena el MP3 aportado. Una explosión conserva su animación y muestra Game Over tras 1.5 segundos. Pulsa **Volver al último punto seguro** (también Escape). Conservas el registro y el puente si ya estaba activo; la torreta se repara. Una explosión consume la bala. Un disparo interrumpido por caída no activa el puente.

En **rapidez fijada**, la masa cambia la energía, pero no la trayectoria ideal. En **energía fija**, la rapidez depende de la masa: v = √(2E/m). Modelo sin resistencia del aire, g = 9.81 m/s². El cañón permanece fijo: mirar alrededor no modifica su puntería. La gráfica lateral muestra x e y; los fallos informan también del desvío lateral z.

## Segunda sala · La rueda del destino

Acércate a la mesa y pulsa su cristal o la tecla **E**. Suena una campanada y la rueda gira durante 3.8 segundos. Selecciona sin repetir uno de diez problemas de MRUA, caída libre y tiro parabólico. Dos sectores rojos contienen retos avanzados de intercepción y optimización.

El enunciado aparece en un globo a la derecha de la vista, que puedes minimizar. Acércate al **sello de la puerta**, míralo y pulsa **E** o haz clic. Solo así se abre el formulario; al apartar la mirada o alejarte se cierra. Introduce las dos respuestas numéricas en las unidades indicadas. Se acepta punto o coma decimal. Resolver un problema abre la puerta; puedes seguir girando para practicar el resto. Cada problema incluye pista y desarrollo. Reiniciar cierra la puerta y restablece la rueda.

Los enunciados son originales, inspirados temáticamente en la cinemática universitaria de Serway y Jewett; no son transcripciones ni números de ejercicios de una edición concreta. Consulta `docs/FUENTES.md`.

## Tercera sala · El laberinto de los ecos

Cuatro galerías conectadas, con exactamente tres puertas por tramo. La pregunta conceptual aparece a la derecha; cada puerta lleva una respuesta abreviada. Acércate y usa **clic o E** para abrirla. Todas las opciones abren puertas físicas: las incorrectas activan un portal violeta sin cuarto vacío detrás. Al elegir una respuesta incorrecta, te teletransportas inmediatamente a un calabozo mohoso con Iván y un quiz de dos puertas, elegido de un banco de 12 preguntas conceptuales. Fallar el sello te mantiene dentro mientras Iván se acerca; acertar te devuelve al inicio del laberinto con todas tus puertas abiertas conservadas. Volver a cruzar una puerta incorrecta abierta activa de nuevo su portal. La correcta conecta con la siguiente galería. Se trabajan fuerza neta, aceleración en la cima de un lanzamiento, caída en el vacío y aceleración centrípeta.

El aviso de entrada solo habla de una presencia y ecos extraños, sin identificar al perseguidor. **El primer error** despierta a EPI Ivan desde cualquier tramo; si no hay errores, aparece **al abrir la segunda puerta distinta**, antes de cruzarla. La aparición tiene un breve margen de 2.5 segundos para orientarse. Aparece pixelado, alterna reposo y mordida y camina a 0.7938 celdas/s (otro 5 % sobre 0.756), frente a las 2.3 del jugador. Busca un camino por las casillas libres, sin atravesar paredes, y también está esperando en el calabozo, con 1.5 segundos iniciales para orientarte. Si te alcanza, el intento termina con una animación de mordida y **Game Over**. No se reinicia automáticamente: el botón de continuar devuelve al último punto seguro. Ivan solo existe en la sala III. El aviso de persecución dice «Cuidado, alguien te persigue»; Paola también lo advierte al pedir ayuda con H. Resolver el calabozo fija el nuevo punto seguro en el inicio del laberinto. Al regresar, Iván permanece inmóvil y no puede capturarte durante 5 segundos; el aviso muestra el tiempo restante para alejarte. El banco del calabozo se baraja y se agota sin repeticiones antes de volver a mezclarlo, evitando repetir la última pregunta al cambiar de ciclo. Morir no reinicia esa bolsa; recargar o seleccionar de nuevo la sala sí.

## Puntos seguros y Game Over

Entrar en una sala guarda su inicio como punto seguro. En el laberinto, **cruzar completamente una puerta correcta hasta la siguiente galería** guarda ese nuevo tramo; abrirla sin cruzar aún no guarda progreso. Morir por captura, caída o sobrecarga reproduce `assets/audio/game-over.mp3`. En una explosión se escucha primero su efecto y luego Game Over. El contador global continúa durante la muerte y al reaparecer.

Al continuar en el laberinto se mantienen abiertas las puertas correctas de tramos anteriores, se cierran los cuartos equivocados. Si el punto seguro ya conserva al menos dos puertas correctas abiertas, la presencia vuelve con un margen inicial de 2.5 segundos; de lo contrario se activa con el primer error o la segunda apertura. En Galileo se conservan el puente desbloqueado y el registro de intentos. Elegir otra sala mediante el menú de pruebas o reiniciar un reto establece un nuevo punto seguro en su entrada. Recargar la página restablece la sesión completa; no hay guardado persistente.

## Epi Paola · Diálogo animado

En las primeras tres salas aparece un **globo de Epi Paola** dentro de la vista. Haz clic en él o pulsa **H**. Se abre su retrato pixelado, basado en la foto proporcionada, con dos gestos que se alternan mientras el texto se escribe letra por letra. Los zumbidos breves son sintetizados y se regulan con el canal **Efectos**; no son grabaciones de voz ni audio extraído de otro juego. **Mostrar todo** termina la escritura y la animación. Cerrar el diálogo o cambiar de sala detiene los sonidos.

Las pistas son contextuales: en Galileo invita a mirar las ecuaciones detrás del inicio; en la ruleta orienta según el problema; en el laberinto ofrece una pista del tramo actual. Los sprites y prompts de generación están documentados en `assets/sprites/README.md`.

El agujero negro es un recurso visual de la historia: el ejercicio del cañón conserva gravedad uniforme y no simula relatividad.

## Controles y audio

- WASD: caminar; flechas izquierda/derecha: girar la cámara. En escritorio, un clic en el mundo captura el mouse: mueve el ratón para mirar sin mantener pulsado. **Esc** libera el cursor. Abrir la ayuda o el formulario, morir o cambiar de sala también lo libera. Si el navegador no permite capturarlo, se activa mirada con el mouse dentro de la escena; siguen disponibles las flechas. En pantalla táctil se mantiene el arrastre con el dedo. Un toque breve interactúa con los objetos cercanos.
- Mantén **Shift** mientras caminas para esprintar: 55 % más rápido. Soltarlo devuelve la velocidad normal; el movimiento diagonal conserva la misma rapidez y las colisiones siguen activas.
- Espacio o botón **Saltar**: salto corto, sin doble salto. Puedes caer si aterrizas en el abismo; necesitas activar el puente para cruzar la primera sala.
- F: disparar; en las salas II y III, interactuar. Clic o E: usar la ruleta, el panel o abrir una puerta cercana. H: hablar con Epi Paola. No hay botón genérico de acción; la torreta mantiene su control de disparo. En móvil hay botones de movimiento y pasos laterales junto a la escena.
- El **Cuaderno de física** reúne gráfica, fórmulas y pistas. **Sobre la torreta** explica la puntería, la masa y la capacidad del equipo. Ambos se despliegan cuando los necesitas.
- **Trayectoria** abre una pequeña proyección verde dentro de la escena. Se abre automáticamente al disparar, anima el recorrido real y conserva el último intento. En la primera sala solo se muestra el recorrido real: no hay predicción ni alcance calculado de antemano. La vista es lateral y el texto informa del desvío lateral. Puedes cerrarla con ×. No necesitas desplegar el cuaderno.
- El fondo usa `ambiente.mp3` en las salas habituales y **Clues in the Dark** (`laberinto.mp3`) en la sala III, en bucle. El prólogo cambia a `dramatic-villain.mp3` al mostrar a Eric y a `missing-person.mp3` al hablar de Iván. Los cambios de pista tienen fundidos; el canal **Fondo e historia** regula todas estas músicas. Al acercarse la presencia, se oyen pulsos graves sintetizados regulados por **Efectos**. El ambiente intenta sonar al entrar, con una entrada suave. Si el navegador bloquea la reproducción automática, comienza con el primer clic o tecla. **Activar sonido** permite reintentar o desactivar el audio; una desactivación explícita se respeta durante la sesión.
- El mezclador incluye volumen general, fondo, victoria, **Game Over** y efectos, con silencio independiente. La victoria reduce gradualmente el fondo al 18 %. En sus últimos 2.2 segundos se desvanece mientras el ambiente recupera su volumen de forma progresiva. El audio se pausa al ocultar la pestaña.
- El menú permite probar cualquiera de las seis habitaciones. Cambiar de sala restablece su reto.

## Estructura

- `src/rooms/room-01/`: configuración, física del proyectil, masa, carga y laboratorio.
- `src/rooms/room-02/`: configuración, banco de problemas y controlador de ruleta.
- `src/rooms/room-03/`: mapa, banco conceptual, puertas, reinicios y persecución.
- `src/rooms/room-04/` a `room-06/`: espacios para futuros retos.
- `src/engine/actors.js`: mesas, etiquetas de puertas y sprite animado de Ivan.
- `src/ui/prologue.js` y `prologue.css`: relato de Paola, cinco escenas, retratos y cues musicales.
- `src/engine/black-hole.js`: viñeta de caída con avatar, sin transformar la pantalla.
- `src/engine/first-person.js`: captura del mouse, liberación del cursor, clics y controles táctiles.
- `src/ui/companions.js`, `world-panels.css` y `dialogue.css`: globos, diálogo animado de Paola, pistas y formulario dentro de la escena.
- `src/engine/renderer.js`: raycasting, cámara con altura e inclinación, cañón, pantalla y mesa/ruleta.
- `src/engine/decor.js`: ladrillos envejecidos, retrato, grafitis y estandartes originales dibujados en canvas; proyección sobre las paredes.
- `src/engine/adventure.js`: contador global, umbrales y eventos para futura música de tensión.
- `src/audio/sound.js`: mezclador y reproducción de los MP3 locales aportados por el usuario; clics y disparos sintetizados.
- `assets/audio/ambiente.mp3`, `victoria.mp3`, `explosion.mp3`: copias de los tres archivos facilitados. `assets/audio/game-over.mp3` es la música de derrota proporcionada después. Los originales de Descargas no se modifican.
- `src/main.js`: navegación, interacción y colisiones.
- `src/ui/styles.css` y `src/ui/rpg.css`: tema base y menús de RPG adaptables.
- `src/ui/trajectory-hologram.js`: proyección del tiro dentro de la escena, sincronizada con la física del orbe.
- `assets/`: carpetas reservadas para futuros recursos.
- `tests/maze.cjs`: puertas, progresión, errores, persecución y captura; ejecutar `node tests/maze.cjs`.
- `tests/physics.cjs`: comprobación de física y respuestas; ejecutar `node tests/physics.cjs`.
- `tests/adventure.cjs`: reloj, estados de tiempo y cruces de muros; ejecutar `node tests/adventure.cjs`.

Repositorio: https://github.com/jiruma1004/Astralia. Demo: https://jiruma1004.github.io/Astralia/. El progreso y los intentos viven en memoria; se reinician al recargar. La sala 06 mantiene una puerta de boceto que se abre con clic o E estando cerca.

## Respaldos

Los ZIP independientes del juego se guardan fuera del repositorio, en `../backups/`, con un archivo SHA-256. Se conserva una copia anterior a este prólogo y otra con la versión final. Para restaurar, extrae el ZIP y abre `escape-room/index.html`; incluye scripts, imágenes y todos los audios. El historial de Git conserva también cada versión publicada.

## IV · El corredor de las ideas

Acceso exterior al castillo: cielo, torres altas al fondo, antorchas de pie y camino central de adoquín. El ancho interior pasa de 7 a 5.6 celdas (20 % menos); las colisiones y los muros visibles usan los mismos límites. Las cajas son saltables y se pueden rodear. Los símbolos π, Σ e ∫ avanzan a 1.6 celdas/s hacia la entrada, por carriles fijos: no persiguen al jugador. Aparecen cada 2.78125 segundos: el doble de la frecuencia media anterior (5.5625 s). Nacen en x=24, cinco celdas antes de la puerta x=29, y se eliminan al salir por la entrada. Los recién creados parpadean durante 0.65 s antes de poder impactar. Esquiva o salta; un impacto inicia Game Over y su música. Reapareces al principio del corredor con una nueva oleada. Shift permite sprint; hay botón táctil.

La puerta de roble final pregunta «¿Estás listo para enfrentarte al Dr. Eric?». Puedes esperar o abrir y continuar a la sala V. El reloj global sigue corriendo durante ese mensaje.

## V · La parábola de Eric

Patio amplio abierto al cielo, muros de piedra, fosa y máquina tecnológica. Eric, de cuerpo completo y con bata, está sobre el soporte parabólico anclado a ambos muros. Hay dos aparatos láser en los laterales; acércate, mira el aparato y pulsa E o haz clic para introducir (x, y).

El plano del soporte usa **y = x²/4 + 2** y la recta de corte **y = x/2 + 4**. Son coordenadas educativas del soporte, no coordenadas del suelo del motor. Igualarlas da x² − 2x − 8 = 0: raíces −2 y 4, puntos **(−2, 3)** y **(4, 6)**. Cada aparato comprueba pertenencia a ambas curvas, números finitos y la rama que le corresponde (izquierda negativa, derecha positiva), con tolerancia 0.04. Paola ofrece una pista de planteamiento con H.

Un corte ilumina el haz recto hasta su intersección. Dos cortes hacen ceder la parte central, retiran a Eric y apagan la máquina. Se habilita el puente por el centro de la fosa y la puerta a VI. La fosa causa Game Over antes de tener puente; los cortes ya hechos se conservan al reaparecer. La sala VI sigue como boceto. Archivos: `src/rooms/room-05/boss.js`, `src/engine/outdoor.js`; pruebas `tests/boss.cjs` y `tests/corridor.cjs`.

### Risas y globos de Eric

`assets/audio/eric-laugh.mp3` es la risa 8-bit aportada por el usuario, sin modificar. Usa el canal Efectos y respeta el silencio general. Eric habla al entrar, cada 18 segundos y reacciona a los intentos; las risas tienen una separación mínima de 12 segundos para evitar solapamientos. El globo dura seis segundos y se proyecta junto a su cabeza, sin quedar fijo en una esquina. Risa y globos se detienen al morir, derrotarlo o abandonar la sala. Estas frases no modifican las ecuaciones del reto.
