# Versión para aula — Aventura EPIK

Implementación `polish-20261008`. Sigue siendo HTML, CSS y JavaScript estático, con Canvas/raycasting. No usa servidor, cuentas ni API de IA. Los siete retos, las dos rutas, la carga progresiva y la rapidez de Eric (0.308 km/s) se conservan.

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

## CSV y diccionario

El archivo local `examples/resultados-ejemplo.csv` se entrega por separado y se genera con `tests/classroom.browser.cjs`; no se publica en el repositorio. Consulta [cómo generarlo](../examples/README.md). Es una sesión **sintética de prueba automatizada**, con movimientos acelerados, respuestas, muertes y ayuda; sus tiempos no representan a un estudiante. El identificador es aleatorio.

UTF-8 con BOM, separador coma, comillas escapadas y saltos CRLF. Campos no aplicables quedan vacíos. Los textos que podrían ejecutarse como fórmulas reciben un apóstrofo de protección; los números negativos legítimos se conservan. `parameters_json` es JSON dentro de una celda CSV. Nombre: `Aventura_EPIK_FECHA_UUID.csv`.

| Campo | Tipo / significado |
| --- | --- |
| schema_version | Entero; versión del contrato CSV, actualmente 1. |
| game_version | Texto; versión de implementación para interpretar bancos y reglas. |
| session_id | UUID aleatorio de la partida. |
| record_type | `event` o `room_summary`. |
| event_id | ID único de evento; vacío en resúmenes. |
| event_sequence | Orden creciente dentro de la partida; vacío en resúmenes. |
| timestamp_iso | Fecha UTC del evento; vacío en resúmenes. |
| elapsed_session_ms | Duración desde comienzo de partida hasta evento o cierre. |
| room_id | ID estable: `room-00` a `room-06`. |
| room_name | Nombre de la sala en el catálogo base. |
| challenge_type | ID estable del reto en el catálogo. |
| question_id | ID o título estable de la pregunta, si aplica. |
| variant_id | Variante, posición del blanco o visita al calabozo, si aplica. |
| objective_id | Subobjetivo al que corresponde el intento o ayuda. |
| attempt_id | ID compartido por envío y resultado de un mismo intento. Campo adicional para relacionarlos sin duplicarlos. |
| attempt_number | Número de intento del objetivo dentro de la sala. |
| event_type | Tipo descrito en la tabla siguiente. |
| submitted_answer | Número, texto o JSON de los valores enviados. |
| parameters_json | Fotografía de la pregunta/variante/condiciones: física del cañón, pregunta con campos y solución, ecuaciones y raíces, o época de Eric y parámetros de vuelo. No depende solo de un índice. |
| result | `correct`, `incorrect`, `interrupted` en resultados; `completed` o `incomplete` en resumen. |
| failure_reason | Razón estable: p. ej. `wrong_answer`, `wrong_door`, `overload`, `death`, `moon`, `flame`. |
| assistance_used | Booleano; si esa sala ya había recibido ayuda extraordinaria. |
| room_active_ms | Milisegundos activos acumulados de la sala. |
| room_elapsed_ms | Milisegundos totales desde su primera entrada. |
| room_solved_ms | Tiempo hasta resolver, en resumen; vacío si no se resolvió. Campo adicional. |
| room_exit_ms | Tiempo hasta salir, en resumen; vacío si no se salió. Campo adicional. |
| room_attempts_total | Intentos iniciados en esa sala, en resumen; incluye interrumpidos. |
| room_correct_total | Intentos terminados correctamente, en resumen. |
| room_incorrect_total | Intentos terminados incorrectamente, en resumen. |
| room_deaths_total | Muertes de esa sala, en resumen. |
| stars_earned | 1 si se completó sin IA, 0 si asistida o incompleta. No sumar eventos y resúmenes juntos. |
| final_route | `particle` o `wave`; vacío antes de elegir. Todos los resúmenes conservan la ruta final. |
| language | `es` o `en` vigente al crear la fila. |

| Evento | Momento |
| --- | --- |
| room_enter | Primera entrada real a una sala. |
| attempt_submitted | Inicio/envío de un intento válido. |
| attempt_result | Resultado asociado al mismo `attempt_id`. |
| objective_completed | Plataforma, puerta, pregunta o corte validado. En los retos de objetivo único el acierto y `room_solved` indican su resolución. |
| normal_help | Apertura de la ayuda normal H. |
| solution_revealed | Revelado de solución extraordinaria del objetivo/variante. |
| death / respawn | Muerte y reaparición. Una respuesta incorrecta que causa muerte se enlaza como intento aparte del evento de muerte, sin contar dos respuestas. |
| room_solved | Reto completado una sola vez. |
| room_exit | Salida resuelta a la siguiente sala. |
| route_selected | Elección final onda/partícula. |
| session_complete | Siete retos completados; resultados congelados. |

Para estadísticas de acierto usa **solo `attempt_result`**; para duración y estrellas usa **solo `room_summary`**. No cuentes cada fila como intento: el envío y el resultado comparten ID.

## Validación y límites

Pruebas en `tests/classroom.cjs`, `tests/classroom.browser.cjs`, `tests/classroom-controls.browser.cjs`, `tests/polish.browser.cjs` y `tests/cinema-loading.browser.cjs`. Cubren registro, fórmulas dinámicas, colisión barrida, pausa de pociones, controles, progreso, ambas rutas con/sin ayuda, diplomas, CSV, carga por ruta, sprites opacos, fallos/reintentos de recursos y dobles clics. El navegador automatizado coloca al jugador para recorrer las validaciones reales; no sustituye una prueba de habilidad con estudiantes ni se han probado 60 dispositivos simultáneos.

Las comprobaciones bloquean la navegación pública y los intentos ordinarios de conceder progreso modificando botones. **Un usuario que controla JavaScript, DevTools y almacenamiento puede alterar una aplicación estática.** Ni el diploma ni el CSV están firmados o son evidencia inviolable. Verificación fuerte requeriría servidor, identidad de sesión y validación/firma de resultados del lado del servidor; no se añadieron servicios externos.

Respaldo previo: rama local `backup/classroom-before-20261008`, commit `2f9929d4372e9146b7f300e6822d05af706bed93`. Puede consultarse sin borrar trabajo usando `git worktree add ../epik-antes-aula backup/classroom-before-20261008`.
