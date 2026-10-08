# Versión para aula — Aventura EPIK

Implementación `csv-simple-20261008`. Sigue siendo HTML, CSS y JavaScript estático, con Canvas/raycasting. No usa servidor, cuentas ni API de IA. Los siete retos, las dos rutas, la carga progresiva y la rapidez de Eric (0.308 km/s) se conservan.

## Interfaz, progresión y ayuda

La interfaz pública ya no ofrece navegación entre salas, galería ni botones para omitir escenas. Mantiene Espacio, Shift, mouse/Escape, pantalla completa, volumen e idioma. El código central comprueba la resolución real, la apertura de la salida y la interacción correspondiente antes de avanzar. Las instancias de la partida viven en un ámbito privado.

**Un punto por reto, siete como máximo.** Completar una sala para avanzar y acreditarla en el diploma son resultados distintos. IA solo está disponible en Galileo, la rueda y la parábola de Eric, después de dos fallos del objetivo actual. El botón rojo advierte «Resta 1 punto»; un clic revela directamente la solución y penaliza esa sala para toda la partida. La ventana se puede arrastrar por su encabezado y redimensionar desde la esquina. Reabrirla no vuelve a descontar puntos. Morir, reaparecer y reiniciar la sala no devuelven la estrella. Una partida nueva sí reinicia el registro. H continúa dando pistas gratuitas. La ayuda no introduce valores, dispara, mueve al jugador ni desactiva peligros. Los paneles de ayuda mantienen las reglas de tiempo del juego.

| Reto | Intento real y disponibilidad de IA |
| --- | --- |
| Sendero | Elegir una plataforma al aterrizar; caer cuenta como fallo motor. Una plataforma incorrecta y su caída son un solo intento. Sin IA. |
| Galileo | Un disparo con bala y datos válidos; fallar o sobrecargar cuenta. Disparar sin bala o con campos inválidos no cuenta. Los fallos se conservan cuando se mueve el blanco, y la solución usa la nueva distancia y la masa vigente. |
| Rueda | Envío numérico válido desde el sello. Cada pregunta tiene su contador. Cambiar de pregunta no mezcla sus fallos. |
| Laberinto | Elegir una puerta disponible; cada etapa y pregunta del calabozo tiene su contador. Sin IA. Onda y partícula mantienen sus rutas, sin anunciar el resultado de la elección. La muerte de Iván se registra separadamente de las respuestas. |
| Corredor | Morir por lava, caída o símbolos es un fallo motor. Llegar e interactuar con la salida es el intento exitoso. Sin IA. |
| Parábola | Enviar coordenadas válidas a un láser todavía pendiente. Cada corte tiene su contador; el registro conserva las ecuaciones y raíces de la variante. Una poción no es un error matemático. |
| Intercepción | Empezar un ensayo crea un intento; al terminar se registra acierto o fallo. Cancelar/reiniciar un ensayo produce `interrupted`, que no desbloquea ayuda. Mover sliders no cuenta. Sin IA; se conserva la pista normal de José Luis. |

La ayuda revelada se registra una vez por objetivo/variante; la penalización se aplica una sola vez por sala. Clics repetidos sobre una respuesta ya resuelta no conceden estrellas ni respuestas adicionales.

Ambos diplomas muestran únicamente los retos acreditados: por ejemplo, 6/7 si se penalizó una sala. No aparecen categorías de «con ayuda» o «sin ayuda». El CSV mantiene las métricas completas de progreso y ayuda para análisis. Descargar CSV no avanza la historia; **Continuar** activa el epílogo de la ruta: partícula → Paola → celda vacía; onda → Karla → descenso de Iván. La ayuda no bloquea epílogos.

## Onda verde

Configuración en `src/rooms/room-05/flame-wave.js`: primer aviso a los 15 s, preparación 2.2 s, velocidad 4 celdas/s, altura de colisión 0.24 celdas, espera posterior exactamente 5 s y 19 s adicionales hasta la siguiente preparación. El aviso espera a que no haya botellas ni charcos activos. Mientras se prepara o cruza la onda no se lanzan pociones. Al terminar los cinco segundos se reanuda una sola poción, sin ráfagas acumuladas. Como toda simulación discretizada, el efecto se materializa en el primer frame que cruza ese instante.

La colisión usa el cruce entre las posiciones anteriores y actuales del jugador y la onda, interpolando la altura del salto. Esto detecta impactos aunque el frente avance más de un jugador entre cuadros. Morir, resolver, cambiar de sala o empezar la escena limpia ataques y efectos.

## Organización para revisión

- `src/classroom/session.js`: registro, tiempo, reglas de estrellas, persistencia y CSV.
- `src/classroom/runtime.js`: integración con eventos reales de los siete retos y datos de variantes.
- `src/classroom/assistance.js`: cálculo de soluciones locales separado de la ventana movible de solución.
- `src/rooms/room-05/flame-wave.js`: estado y colisión del segundo ataque.
- `src/main.js`: comprobaciones de transición y conexión de los sistemas; no contiene un proveedor de IA.
- `src/cinematics/ceremony.js` y `library.js`: diploma, descarga y continuación de la secuencia.

No se añadieron dependencias al juego. No se escriben métricas en cada frame: solo ante eventos relevantes. Los cronómetros se actualizan en memoria. La galería de desarrollo solo se habilita con `?dev=1` en `localhost` o `127.0.0.1`. Cargar una vista previa marca el registro como tal y no concede un certificado válido. Estas herramientas son para pruebas locales, no para evaluar alumnos.

## Tiempo y persistencia

Los tiempos de duración usan `performance.now()` y se expresan en **milisegundos**. La fecha absoluta usa ISO 8601 UTC. El reloj del registro comienza al finalizar la llegada en carreta; termina al iniciar el lanzamiento correcto de Ignitia, antes de la celebración.

- `room_solved_ms`: desde la primera entrada a la sala hasta resolverla.
- `room_exit_ms`: desde esa entrada hasta avanzar a la siguiente sala; en Ignitia, hasta comenzar el lanzamiento final.
- `room_elapsed_ms`: tiempo total de permanencia, incluidas pausas, muertes y pestaña oculta. No se reinicia al reaparecer.
- `room_active_ms`: tiempo con juego habilitado, incluida la simulación de vuelo en ejecución. Excluye pestaña oculta, game over, avisos que bloquean el movimiento y cinemáticas. Leer un panel que deja enemigos y reloj activos sigue contando. Escape por sí solo libera el cursor, no pausa la aventura.

Las pequeñas diferencias de un frame en los límites son esperables. Las descargas posteriores no alteran los tiempos finales.

Se guarda una instantánea local en **`epik.metrics.v1.latest`** en los eventos relevantes. Si el almacenamiento está bloqueado o lleno, el juego y el CSV siguen funcionando en memoria. El proyecto no tenía restauración completa de partidas: no se implementa una restauración parcial. Recargar la página inicia una partida nueva; al iniciarla se reemplaza la instantánea local anterior. El docente debe pedir la descarga antes de recargar o iniciar otra aventura. No se envían métricas a servidores ni se solicitan datos personales.

## CSV sencillo para el docente

La descarga del diploma contiene **siete filas, una por sala, y siete columnas en español**. No mezcla eventos, parámetros ni datos técnicos. El nombre del archivo conserva la fecha y el identificador aleatorio de partida para distinguir las entregas. La exportación es igual aunque el alumno juegue en inglés.

| Columna | Cómo leerla |
| --- | --- |
| Sala | Nombre del reto, en el orden en que se juega. |
| Tiempo total (minutos) | Desde entrar por primera vez hasta salir a la siguiente sala. Incluye muertes, reapariciones, lectura y pausas. Dos decimales: 2.5 significa dos minutos y medio. En la última sala termina al comenzar el lanzamiento final. |
| Muertes | Total de muertes en esa sala, aunque ocurran después de resolver el ejercicio. |
| Errores | Respuestas o ensayos que terminaron fallando. En retos motores incluye caídas/choques antes de superar el reto. Una muerte no añade automáticamente un error matemático: recibir una poción puede aumentar muertes sin aumentar errores. |
| Intentos hasta pasar | Respuestas o ensayos acumulados hasta resolver la sala, incluido el exitoso. En Galileo, dos disparos fallidos y uno acertado dan 3. En una sala con varias preguntas se suman sus respuestas: el sendero perfecto requiere 5 y los dos cortes de Eric requieren 2. Los ensayos iniciados y cancelados también cuentan como intentos, pero no como errores. No aumenta por morir después de resolver el ejercicio. |
| Usó pistas | Sí o No: abrió las pistas normales de Paola o José Luis, mediante H o su botón. No penaliza. |
| Usó IA | Sí o No: reveló la solución con el botón rojo. Conserva la penalización del certificado. |

Los valores se conservan al morir y reaparecer. Descargar otra vez no cambia los contadores ni los tiempos finales. El juego conserva su registro interno para calcular estas métricas, pero **ese registro detallado ya no se exporta**. Las filas no contienen datos personales ni se envían a servidores.

Formato: UTF-8 con BOM para acentos en Excel, separador coma y escape de comillas/saltos de línea. Se mantiene la protección frente a fórmulas en campos de texto. El CSV de ejemplo local `examples/resultados-ejemplo.csv` se genera con `tests/classroom.browser.cjs` y se entrega por separado; no se publica en Git. Sus datos son sintéticos y sus tiempos no representan a un estudiante.

## Validación y límites

Pruebas en `tests/classroom.cjs`, `tests/classroom.browser.cjs`, `tests/classroom-controls.browser.cjs`, `tests/polish.browser.cjs` y `tests/cinema-loading.browser.cjs`. Cubren registro, fórmulas dinámicas, colisión barrida, pausa de pociones, controles, progreso, ambas rutas con/sin ayuda, diplomas, CSV, carga por ruta, sprites opacos, fallos/reintentos de recursos y dobles clics. El navegador automatizado coloca al jugador para recorrer las validaciones reales; no sustituye una prueba de habilidad con estudiantes ni se han probado 60 dispositivos simultáneos.

Las comprobaciones bloquean la navegación pública y los intentos ordinarios de conceder progreso modificando botones. **Un usuario que controla JavaScript, DevTools y almacenamiento puede alterar una aplicación estática.** Ni el diploma ni el CSV están firmados o son evidencia inviolable. Verificación fuerte requeriría servidor, identidad de sesión y validación/firma de resultados del lado del servidor; no se añadieron servicios externos.

Respaldo previo: rama local `backup/classroom-before-20261008`, commit `2f9929d4372e9146b7f300e6822d05af706bed93`. Puede consultarse sin borrar trabajo usando `git worktree add ../epik-antes-aula backup/classroom-before-20261008`.
