# Astralia · Academia de los seis umbrales

Escape room educativo en HTML, CSS y JavaScript, con menús de RPG clásico: azul nocturno, cristal, detalles dorados y letras más grandes. Seis habitaciones; las seis tienen actividades, incluida la plataforma de lanzamiento de Ignitia. Vista 2.5D por raycasting con objetos dibujados en canvas, sin dependencias externas. Las paredes incluyen estandartes, un retrato ilustrado original de Einstein y ecuaciones grafiteadas.

## Abrir

Abre `index.html` en un navegador moderno. No requiere instalación ni conexión. Opcionalmente: `python3 -m http.server 8000` desde esta carpeta.

## El castillo del Dr. Eric

La aventura recorre seis ambientes: **bosque del abismo** (I), **portal del castillo** (II), **laberinto de los ecos** (III), **corredor de las ideas** (IV), **parábola de Eric** (V) y **plataforma de Ignitia** (VI). El bosque tiene límites de árboles y maleza; la entrada conserva cielo y un portal rúnico. La sala III tiene techo de piedra; IV, V y VI son patios abiertos bajo el cielo.

La galería incluye ilustraciones de Doofenshmirtz, Planck, Tesla, Curie y el Dr. Eric, con marcos y paletas distintas. Los personajes históricos aparecen caracterizados como villanos ficticios dentro de la historia. La sala VI cierra esta etapa con un lanzamiento hacia la Luna.

Resolver la ruleta rompe el sello violeta y activa un portal turquesa atravesable. La mesa está ligeramente desplazada para que se vea la entrada detrás.

Antes de entrar, Epi Paola narra un prólogo de cinco escenas. Los retratos alternan Paola, Eric enfadado con bata de laboratorio, Paola, Iván en un recorte de periódico con el titular «DESAPARECIDO» y Paola. Eric se cansó de que los alumnos no pusieran títulos a las gráficas y prepara la divergencia para unificar la gravedad y el espacio. Iván está desaparecido desde que Eric se fue; se dice que se perdió en un bosque. Al final, Paola recuerda que puedes pedirle ayuda con H. El texto aparece letra por letra; puedes mostrarlo completo, avanzar o saltar el relato. Las paredes son de ladrillo antiguo con juntas alternadas, grietas y humedad; se conservan los cuadros, grafitis y estandartes.

Pulsa **Entrar al mundo** al terminar el prólogo, o **Saltar relato y entrar**, para iniciar una aventura de **60 minutos**. Durante toda la narración el contador permanece detenido. El reloj permanece en la esquina inferior derecha: verde al principio, naranja cuando quedan **10 minutos** y rojo en los últimos **3 minutos**. El texto también indica la urgencia.

El tiempo es global: sigue corriendo al cambiar de habitación, reiniciar un reto, caer, reaparecer o cambiar de pestaña. Al llegar a cero, el Dr. Eric completa la divergencia, se detiene la partida y puedes **Volver a intentarlo** desde la primera sala con otros 60 minutos. Completar el despegue de Ignitia detiene el reloj. Recargar la página inicia una sesión nueva, con su introducción y sin progreso guardado.

La música futura de tensión tiene su espacio reservado en `assets/audio/tension/README.md` y sus eventos en `src/engine/adventure.js`; todavía no se añaden pistas ni se cambia la música según la fase.

## Primera sala · El puente de Galileo

1. Elige una bala en el estante: Saphir (0.5 kg), Ambre (1 kg), Rubis (2 kg) o Améthyste (4 kg).
2. Pulsa **Cargar orbe**, o toca el cañón de la escena después de elegirla. La recámara se ilumina con su color. La torreta Prisma tiene una base hexagonal y un cabezal de cristal, sin tubo largo ni ruedas.
3. Calcula y escribe elevación θ, giro horizontal φ y rapidez o energía en campos numéricos. No hay deslizadores de tiro. Gira hacia atrás desde el inicio: el muro de piedra tiene once expresiones y condiciones de uso grafiteadas directamente sobre los ladrillos, sin pizarra ni marco para que elijas las pertinentes. Los campos vacíos o fuera de sus límites no disparan ni consumen el orbe.
4. Dispara. Cada lanzamiento consume la bala cargada; hay suministro ilimitado en el estante.
5. Al alcanzar el botón suspendido, suena el MP3 de victoria y se activa el puente. Cruza por el centro; pisar el vacío provoca una caída a una singularidad. Rodea la torreta: es un objeto sólido.
6. Si disparas con más de 180 J, la torreta explota y tu personaje queda fuera de combate. Aparece «en papel nada se quema». La capacidad es una regla del equipo ficticio, no un umbral físico universal.
7. Al caer se muestra una viñeta en tercera persona: el personaje cae desde el borde, gira y se pierde en un agujero negro. El canvas permanece fijo; tras **2.6 segundos** aparece **Game Over** y suena el MP3 aportado. Una explosión conserva su animación y muestra Game Over tras 1.5 segundos. Pulsa **Volver al último punto seguro** (también Escape). Conservas el registro y el puente si ya estaba activo; la torreta se repara. Una explosión consume la bala. Un disparo interrumpido por caída no activa el puente.

En **rapidez fijada**, la masa cambia la energía, pero no la trayectoria ideal. En **energía fija**, la rapidez depende de la masa: v = √(2E/m). Modelo sin resistencia del aire, g = 9.81 m/s². El cañón permanece fijo: mirar alrededor no modifica su puntería. La gráfica lateral muestra x e y; los fallos informan también del desvío lateral z.

## Segunda sala · La rueda del destino

Acércate a la mesa y pulsa su cristal o la tecla **E**. Suena una campanada y la rueda gira durante 3.8 segundos. Selecciona sin repetir uno de diez problemas de MRUA, caída libre y tiro parabólico. Todos los sectores son normales: los dos avanzados se sustituyen por un arranque de MRUA y una caída desde el reposo.

El enunciado aparece en un globo a la derecha de la vista, que puedes minimizar. Acércate al **sello de la puerta**, míralo y pulsa **E** o haz clic. Solo así se abre el formulario; al apartar la mirada o alejarte se cierra. Introduce las dos respuestas numéricas en las unidades indicadas. Se acepta punto o coma decimal. Resolver un problema abre la puerta; puedes seguir girando para practicar el resto. Cada problema incluye pista y desarrollo. Reiniciar cierra la puerta y restablece la rueda.

Los enunciados son originales, inspirados temáticamente en la cinemática universitaria de Serway y Jewett; no son transcripciones ni números de ejercicios de una edición concreta. Consulta `docs/FUENTES.md`.

## Tercera sala · El laberinto de los ecos

Cuatro galerías conectadas, con exactamente tres puertas por tramo. La pregunta conceptual aparece a la derecha; cada puerta lleva una respuesta abreviada. Acércate y usa **clic o E** para abrirla. Todas las opciones abren puertas físicas: las incorrectas activan un portal violeta sin cuarto vacío detrás. Al elegir una respuesta incorrecta, te teletransportas inmediatamente a un calabozo mohoso con Iván y un quiz de dos puertas, elegido de un banco de 12 preguntas conceptuales. Fallar el sello te mantiene dentro mientras Iván se acerca; acertar te devuelve al inicio del laberinto con todas tus puertas abiertas conservadas. Volver a cruzar una puerta incorrecta abierta activa de nuevo su portal. La correcta conecta con la siguiente galería. Se trabajan fuerza neta, aceleración en la cima de un lanzamiento, caída en el vacío y aceleración centrípeta.

El aviso de entrada solo habla de una presencia y ecos extraños, sin identificar al perseguidor. **El primer error** despierta a EPI Ivan desde cualquier tramo; si no hay errores, aparece **al abrir la segunda puerta distinta**, antes de cruzarla. La aparición tiene un breve margen de 2.5 segundos para orientarse. Aparece pixelado, alterna reposo y mordida y camina a 0.83349 celdas/s (otro 5 % sobre 0.7938), frente a las 2.3 del jugador. Busca un camino por las casillas libres, sin atravesar paredes, y también está esperando en el calabozo, con 1.5 segundos iniciales para orientarte. Si te alcanza, el intento termina con una animación de mordida y **Game Over**. No se reinicia automáticamente: el botón de continuar devuelve al último punto seguro. Ivan solo existe en la sala III. El aviso de persecución dice «Cuidado, alguien te persigue»; Paola también lo advierte al pedir ayuda con H. Resolver el calabozo fija el nuevo punto seguro en el inicio del laberinto. Al regresar, Iván permanece inmóvil y no puede capturarte durante 5 segundos; el aviso muestra el tiempo restante para alejarte. El banco del calabozo se baraja y se agota sin repeticiones antes de volver a mezclarlo, evitando repetir la última pregunta al cambiar de ciclo. Morir no reinicia esa bolsa; recargar o seleccionar de nuevo la sala sí.

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
- F: disparar; en las salas II y III, interactuar. Clic o E: abrir los controles del cañón, usar la ruleta, el sello o abrir una puerta cercana. H: hablar con Epi Paola. No hay botón genérico de acción; la torreta mantiene su control de disparo. En móvil hay botones de movimiento y pasos laterales junto a la escena.
- El **Cuaderno de física** reúne gráfica, fórmulas y pistas. **Sobre la torreta** explica la puntería, la masa y la capacidad del equipo. Ambos se despliegan cuando los necesitas.
- **Trayectoria** abre una pequeña proyección verde dentro de la escena. Se abre automáticamente al disparar, anima el recorrido real y conserva el último intento. En la primera sala solo se muestra el recorrido real: no hay predicción ni alcance calculado de antemano. La vista es lateral y el texto informa del desvío lateral. Puedes cerrarla con ×. No necesitas desplegar el cuaderno.
- El fondo usa `ambiente.mp3` en las salas habituales , **Sellado Mágico** (`sellado-magico.mp3`) en la sala II y **Clues in the Dark** (`laberinto.mp3`) en la sala III, en bucle. El prólogo cambia a `dramatic-villain.mp3` al mostrar a Eric y a `missing-person.mp3` al hablar de Iván. Los cambios de pista tienen fundidos; el canal **Fondo e historia** regula todas estas músicas. Al acercarse la presencia, se oyen pulsos graves sintetizados regulados por **Efectos**. El ambiente intenta sonar al entrar, con una entrada suave. Si el navegador bloquea la reproducción automática, comienza con el primer clic o tecla. **Activar sonido** permite reintentar o desactivar el audio; una desactivación explícita se respeta durante la sesión.
- El mezclador incluye volumen general, fondo, victoria, **Game Over** y efectos, con silencio independiente. La victoria reduce gradualmente el fondo al 18 %. La victoria dura como máximo 3 segundos; en sus últimos 0.7 segundos se desvanece mientras el ambiente recupera su volumen de forma progresiva. El audio se pausa al ocultar la pestaña.
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

Acceso exterior al castillo: cielo, torres altas al fondo, antorchas de pie y camino central de adoquín. El ancho interior pasa de 7 a 5.6 celdas (20 % menos); las colisiones y los muros visibles usan los mismos límites. Las cajas son saltables y se pueden rodear. Los símbolos π, Σ, ∫, dy/dx, Δx y eˣ avanzan a 1.6 celdas/s hacia la entrada, desde posiciones dispersas por todo el ancho, en línea recta: no persiguen al jugador. Aparecen cada 1.324405 segundos: 50 % más emisiones que la versión anterior (1.986607 s), conservando su velocidad. Nacen en x=46, cinco celdas antes de la puerta x=51, y se eliminan al salir por la entrada. Los recién creados parpadean durante 0.65 s antes de poder impactar. Esquiva o salta; un impacto inicia Game Over y su música. Reapareces al principio del corredor con una nueva oleada. Shift permite sprint; hay botón táctil.

La puerta de roble final pregunta «¿Estás listo para enfrentarte al Dr. Eric?». Puedes esperar o abrir y continuar a la sala V. El reloj global sigue corriendo durante ese mensaje.

## V · La parábola de Eric

Patio amplio abierto al cielo, muros de piedra, fosa y máquina tecnológica. Eric, de cuerpo completo y con bata, está sobre el soporte parabólico anclado a ambos muros. Hay dos aparatos láser en los laterales; acércate, mira el aparato y pulsa E o haz clic para introducir (x, y).

El plano del soporte usa **y = x²/4 + 2** y la recta de corte **y = x/2 + 4**. Son coordenadas educativas del soporte, no coordenadas del suelo del motor. Igualarlas da x² − 2x − 8 = 0: raíces −2 y 4, puntos **(−2, 3)** y **(4, 6)**. Cada aparato comprueba pertenencia a ambas curvas, números finitos y la rama que le corresponde (izquierda negativa, derecha positiva), con tolerancia 0.04. Paola ofrece una pista de planteamiento con H.

Un corte ilumina el haz recto hasta su intersección. Dos cortes hacen ceder la parte central. Eric cae; tras 2.5 s se desvanece Final Stand, a los 4 s arranca su cohete y a los 11 s comienza The Transformation y el mensaje de José Luis. Se habilita el puente por el centro de la fosa y la puerta a VI. La fosa causa Game Over antes de tener puente; los cortes ya hechos se conservan al reaparecer. La sala VI contiene el cohete de Ignitia. Archivos: `src/rooms/room-05/boss.js`, `src/engine/outdoor.js`; pruebas `tests/boss.cjs` y `tests/corridor.cjs`.

### Risas y globos de Eric

`assets/audio/eric-laugh.mp3` es la risa 8-bit aportada por el usuario, sin modificar. Usa el canal Efectos y respeta el silencio general. Eric habla al entrar, cada 18 segundos y reacciona a los intentos; las risas tienen una separación mínima de 12 segundos para evitar solapamientos. El globo dura seis segundos y se proyecta junto a su cabeza, sin quedar fijo en una esquina. Risa y globos se detienen al morir, derrotarlo o abandonar la sala. Estas frases no modifican las ecuaciones del reto.

### Controles del cañón dentro del mundo
Acércate a la torreta y mírala: clic o E abre su panel sobre la escena. «Ajustes y orbes» contiene parámetros numéricos, masas, carga y disparo; «Datos y registro» reúne instrucciones, cuaderno y resultados. X o Escape cierra el panel. F permite disparar una carga ya preparada mientras miras el cañón. Al lanzar, se cierra el panel y aparece la trayectoria; los resultados también se muestran dentro de la escena. La sala II reproduce Sellado Mágico en bucle, con el mismo mezclador y fundidos que el resto del fondo.


## VI · Ignitia y la intercepción de Eric
José Luis, líder de Ignitia, avisa que Eric pretende usar la máquina de divergencia en la Luna. Su retrato pixelado acompaña el diálogo. Al terminar el mensaje se habilita el puente de V. En VI, acércate al terminal azul y pulsa E/clic: el radar horizontal permite ajustar rapidez, ángulo, retraso de salida y tiempo de vuelo; también se puede arrastrar el extremo verde de la trayectoria. Los ensayos muestran ambos cohetes con el mismo reloj. Para interceptar deben quedar a no más de 3 km en el instante elegido. Un ensayo exitoso habilita «Confirmar y despegar» y conserva la cinemática de Iván, José Luis y la conclusión 6/6. Es un modelo didáctico local de gravedad uniforme, no mecánica orbital. Ecuaciones, parámetros y referencia docente: `src/rooms/room-06/README.md`. La sala 1.5 se conserva desactivada en `src/rooms/room-015`.

En la tercera galería del laberinto hay una placa cuadrada azul en (27.5, 8.5). Al pisarla congela a Iván 20 segundos, sin congelar al jugador ni las puertas. Solo se activa una vez por intento; reaparecer restablece la placa.

Música: Juanillo 8 bit en IV, Final Stand en V, The Transformation durante el aviso de Ignitia y Final Phase en VI. Rocket ignition usa el canal de efectos durante los despegues. Los originales aportados por el usuario se conservan sin cambios.

El selector English / Español funciona también desde el prólogo. Cambia interfaz, preguntas, pistas, diálogos y rótulos dibujados; mantiene el progreso y los parámetros. Solo se guarda la preferencia de idioma en localStorage, no la partida. Diccionario: src/ui/translations.js; motor: src/ui/i18n.js. Recursos y prompts de los dos nuevos sprites: assets/sprites/IGNITIA.md.

Pruebas: node tests/physics.cjs, node tests/adventure.cjs, node tests/maze.cjs, node tests/corridor.cjs, node tests/boss.cjs, node tests/rocket.cjs y node tests/i18n.cjs.

## Estilo RPG y respaldo anterior
El aspecto de letras y diálogos se aplica mediante src/ui/classic-rpg.css: Pixelify Sans, cuadros azules y bordes plateados inspirados en la referencia del usuario. La fuente se distribuye localmente junto a su licencia OFL en assets/fonts/; las fórmulas conservan glifos matemáticos en una fuente de apoyo. Fuente original: https://github.com/google/fonts/tree/main/ofl/pixelifysans.

Antes de cambiar estilos se guardó ../backups/astralia-antes-estilo-rpg.zip y su SHA-256. También se conserva la versión anterior en el commit 22c4a266e0fcc03b5bd490e22913fe6070997abb. El ZIP contiene el juego completo bajo escape-room/.

José Luis mueve la boca mientras aparecen las letras y queda en reposo al mostrar todo. En la sala VI se puede pedirle ayuda con H o su globo; Paola conserva las salas anteriores. El idioma ocupa una esquina independiente de los controles de audio y de la narración del prólogo. Eric escapa sentado sobre el cohete: la imagen se recorta a la altura del suelo y se revela al ascender. El audio mantiene sus pistas, mezclas y tiempos. Recursos y prompts: assets/sprites/RPG-POLISH.md.

### Ajustes de ritmo y claridad
Diez obstáculos bajos alternados en el corredor. Risa de Eric recortada a 1.5 s con salida suave. Barandillas sólidas de madera en el puente del bosque y metálicas en el patio. La sala VI no muestra arma ni admite disparo con F; José Luis ofrece una pista breve. El sello y los láseres cierran su panel al validar una respuesta correcta.

El corredor recorre ahora 48.6 celdas entre la entrada y el centro de la puerta, un 10 % menos que las 54 anteriores. El abismo de Galileo tiene 15 celdas de largo (25 % más) y el botón está a 20 m del cañón. Las barandillas bloquean el movimiento lateral, incluso al saltar, solo después de desplegar el puente.

Eric lanza una poción a los 8 s y después cada 9 s. Apunta a la posición de hace 1.5 s, con vuelo de 1.6 s y un círculo de aviso. Al caer ríe y deja un charco verde de radio 0.7 celdas durante 2 s: tocarlo sin saltar causa Game Over. Los peligros desaparecen al vencerlo o reaparecer.

### Legibilidad y pasajero inesperado
El botón «Pantalla completa» amplía el mundo con sus paneles y reloj. El mismo botón permite salir; cuando el navegador no admite pantalla completa nativa se usa una vista ampliada dentro de la pestaña, que también se cierra con Escape.

La fuente local Oxanium sustituye a Pixelify Sans en la interfaz, con cifras más claras y campos numéricos grandes. Licencia OFL en `assets/fonts/Oxanium-OFL.txt`; fuente oficial: https://github.com/google/fonts/tree/main/ofl/oxanium. Los paneles de respuestas, láseres, cohete y cañón se adaptan a móvil, con foco visible y reloj compacto al escribir.

El prólogo conserva la pista de Eric durante la siguiente intervención de Paola. Cambia a `missing` al presentar a Iván desaparecido y vuelve a `music` con la última intervención de Paola.

El lanzamiento final dura 19 segundos. Primero Paola avisa durante 4 segundos; después Iván aparece caminando con dos pasos que conservan la orientación del torso. El cohete empieza a elevarse a los 8.5 segundos. Iván gira cuando el cohete alcanza 3.4 unidades de ascenso (dos alturas del sprite), cuelga por debajo del cable y se balancea con amplitud decreciente. Un globo junto a su cabeza muestra «AAAAAAAAHHHH». Al terminar aparece una tarjeta desplegable «6 / 6» con la indicación de tomar una captura y subirla a la actividad. La escena y la tarjeta se reinician al volver a entrar. Los recursos originales se documentan en `assets/sprites/IVAN-FINALE.md`; los nuevos pasos, en `assets/sprites/IVAN-WALK-V2.md`.
