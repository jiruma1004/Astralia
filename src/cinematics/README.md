# Lista de cinemáticas

El botón **Cinemáticas**, junto a los controles del juego, abre las tres escenas registradas en `window.CINEMATICS` dentro de `library.js`:

1. `ignitia-launch` — **Ignitia: despegue y caída**, 38 s. Reproduce el final anterior con una instancia visual separada: cohete, cable, Iván, pérdida de control y caída. No llama a los eventos de avance de la partida.
2. `ivan-descenso` — **Iván descenso**, 35 s. Caída al bosque (0–3 s), aterrizaje cómico (3–6), llegada a la cabaña (6–12), legado de Eric (12–16), periódico y Karla (16–24), frase de Iván (24–28), laboratorio iluminado y carteles de Eric (28–35).
3. `intercepcion-espacial` — **Intercepción espacial**, 43 s. Final alternativo sin Iván a bordo: despegue (0–6), ruta de intercepción (6–17), explosión animada y salida de Eric (17–20), paracaídas hacia la prisión (20–27), entrada en la celda (27–31), cierre de la reja (31–34) y amenazas de venganza (34–43). Termina con «Eric bajo custodia… por ahora».

La nueva escena espacial se encuentra en la galería; no sustituye el final de Iván y la cabaña. `space-interception.js` copia los parámetros de una ruta acertada en el simulador y dibuja ambos cohetes con el mismo reloj y las ecuaciones del reto. Si aún no hay una solución confirmada, construye una solución válida y la identifica como **Ruta de demostración**. Ver la película no consume tiempo lunar ni modifica controles, puertas, respuestas o progreso. La vuelta a la Tierra y el paracaídas son una transición de ficción, no una simulación orbital.

La caminata a la cabaña usa dos nuevos fotogramas con pies y rostro hacia la derecha (`ivan-walk-right.webp`). El aterrizaje conserva el sprite anterior. El interior apagado lleva una capa de oscuridad adicional del 70 %, que desaparece al encender la luz. Los retratos de Karla y Eric ya están impresos en el atlas de carteles; las letras se superponen en HTML/Canvas para mantener legibilidad y español/inglés.

En la historia, el botón **Continuar** de la tarjeta de desafío completado 6/6 reproduce **Iván descenso** antes de **Continuará en semana 10…**. La tarjeta de entrega y el progreso se conservan.

El reproductor ofrece pausa, repetición y salto. Cerrar o saltar durante el epílogo lleva al cierre de capítulo; en la galería solo regresa a la partida. La galería pausa al jugador, enemigos, reloj de aventura y avance de Eric hacia la Luna. Al salir restaura la música anterior. No abre puertas ni cambia habitaciones. Los diálogos HTML y los carteles admiten español e inglés; el diseño se adapta a móvil.

Recursos y prompts: `assets/cinematics/README.md`. Verificaciones: `tests/cinematics.cjs`, `tests/space-cinematic.cjs`, `tests/adventure.cjs` y `tests/physics.cjs`. Las pruebas de navegador comprueban disparo y acceso a la segunda sala, galería sin cambios de progreso, tres películas, ruta del alumno, reloj lunar en pausa, repetición/salto, carteles y diálogos bilingües, móvil y ausencia de errores JavaScript.
