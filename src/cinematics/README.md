# Lista de cinemáticas

El botón **Cinemáticas**, junto a los controles del juego, abre las cinco escenas registradas en `window.CINEMATICS` dentro de `library.js`:

1. `ignitia-launch` — **Ignitia: despegue y caída**, 38 s. Reproduce el final anterior con una instancia visual separada: cohete, cable, Iván, pérdida de control y caída. No llama a los eventos de avance de la partida.
2. `ivan-descenso` — **Iván descenso**, 35 s. Caída al bosque (0–3 s), aterrizaje cómico (3–6), llegada a la cabaña (6–12), legado de Eric (12–16), periódico y Karla (16–24), frase de Iván (24–28), laboratorio iluminado y carteles de Eric (28–35).
3. `intercepcion-espacial` — **Intercepción espacial**, 43 s. Final alternativo sin Iván a bordo: despegue (0–6), ruta de intercepción (6–17), explosión animada y salida de Eric (17–20), paracaídas hacia la prisión (20–27), entrada en la celda (27–31), cierre de la reja (31–34) y amenazas de venganza (34–43). Termina con «Eric bajo custodia… por ahora».

La nueva escena espacial se encuentra en la galería; no sustituye el final de Iván y la cabaña. `space-interception.js` copia los parámetros de una ruta acertada en el simulador y dibuja ambos cohetes con el mismo reloj y las ecuaciones del reto. Si aún no hay una solución confirmada, construye una solución válida y la identifica como **Ruta de demostración**. Ver la película no consume tiempo lunar ni modifica controles, puertas, respuestas o progreso. La vuelta a la Tierra y el paracaídas son una transición de ficción, no una simulación orbital.

La caminata a la cabaña usa dos nuevos fotogramas con pies y rostro hacia la derecha (`ivan-walk-right.webp`). El aterrizaje conserva el sprite anterior. El interior apagado lleva una capa de oscuridad adicional del 70 %, que desaparece al encender la luz. Los retratos de Karla y Eric ya están impresos en el atlas de carteles; las letras se superponen en HTML/Canvas para mantener legibilidad y español/inglés.

En la historia actual, el diploma de la ceremonia espera una interacción: **Continuar** o cerrar activa **Iván descenso** antes de **Continuará en semana 10…**. No se activa automáticamente al comenzar ni al terminar la celebración.

El reproductor ofrece pausa, repetición y salto. Cerrar o saltar durante el epílogo lleva al cierre de capítulo; en la galería solo regresa a la partida. La galería pausa al jugador, enemigos, reloj de aventura y avance de Eric hacia la Luna. Al salir restaura la música anterior. No abre puertas ni cambia habitaciones. Los diálogos HTML y los carteles admiten español e inglés; el diseño se adapta a móvil.

Recursos y prompts: `assets/cinematics/README.md`. Verificaciones: `tests/cinematics.cjs`, `tests/space-cinematic.cjs`, `tests/adventure.cjs` y `tests/physics.cjs`. Las pruebas de navegador comprueban disparo y acceso a la segunda sala, galería sin cambios de progreso, tres películas, ruta del alumno, reloj lunar en pausa, repetición/salto, carteles y diálogos bilingües, móvil y ausencia de errores JavaScript.

La intercepción utiliza ahora el emblema de estrella de Ignitia en el cohete y una prisión moderna: paneles de aluminio, ventana de barrotes oxidados y reja delantera animada. El cartel de Karla resume su motivo: «Se cansó de escuchar “eso no lo vimos” y tener que explicar todo desde cero».

## Ceremonia de Ignitia

Cuarta película: `ceremonia-ignitia`, 46 segundos. Tras **Intercepción espacial**, el botón **Continuar a la ceremonia** abre el reconocimiento de Angélica y EPI Paola. También está disponible directamente desde la lista. El final anterior de Iván se conserva.

Angélica y Paola aparecen de pie a izquierda/derecha, con gestos de brazos opuestos: levantan la mano al hablar y vuelven a abrazar el libro. Los cinco mensajes duran 38 segundos; el penúltimo incluye la broma de Paola sobre el químico, el aluminio y el óxido. Después aparece el certificado 6/6, que permanece visible al terminar, listo para captura. Incluye confeti y el emblema de Ignitia.

La galería mantiene su carácter de vista previa: no modifica el progreso. Si no se ha completado la partida, el certificado lleva una marca visible de vista previa. Al completar los seis retos, muestra las instrucciones de entrega de captura y apuntes sin esa marca. Admite español e inglés, reproducción, pausa y salto al certificado.

Dentro de la cabaña, Iván usa `ivan-cabin-idle.webp`: se sitúa en el centro, mira a la izquierda y parpadea. La caminata exterior conserva su dirección hacia la derecha. La música de victoria entre salas dura 4,5 segundos y conserva su desvanecimiento final.

## Final principal conectado

`ignitia-intercepcion` — **Ignitia: misión cumplida**, 55 s. `mission-ending.js` reutiliza los fondos, sprites y la intercepción existentes. Aviso (0–3), caminata (3–6), cable (6–7), ascenso (7–13), caída sin destino visible (13–18), vuelo sobre la ruta confirmada (18–29), impacto (29–32), paracaídas (32–39), celda y cierre de reja (39–46), captura (46–55). La caída de Iván no altera los parámetros del vuelo.

El ensayo acertado dispara `IgnitiaMission.startLaunch` una sola vez. La finalización enlaza automáticamente la ceremonia y marca los seis retos completados. El diploma permanece visible, incluso después de los 46 s. Continuar, cerrar o Escape desde el diploma abre el epílogo secreto; la misma interacción antes del diploma avanza al certificado y espera otro gesto. La escena secreta termina en el cierre de capítulo. Cada reproducción consume su callback una vez y bloquea clics durante los primeros 450 ms de una transición. Repetir se oculta en el recorrido principal.

`ignitia-launch` y `intercepcion-espacial` se conservan en la galería como versiones anteriores, sin participar en el final principal. El código anterior también está conservado en el commit `89569406fef10fc6ece03cc05efe2ba745c24ed2`; copia local adicional: `work/backups/final-anterior-8956940.zip`, fuera del sitio publicado.

Verificación de recorrido: `tests/final-flow.browser.js` (Playwright; `GAME_URL`, `PLAYWRIGHT_MODULE`, `CHROME_PATH` y `SCREENSHOT_DIR` opcionales). Comprueba solución real, lanzamiento único, ruta sin alteración, sonidos únicos, captura, ceremonia, espera del diploma, doble clic, epílogo, salida y separación de la galería.
