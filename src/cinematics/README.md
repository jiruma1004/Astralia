# Lista de cinemáticas

El botón **Cinemáticas**, junto a los controles del juego, abre las dos escenas registradas en `window.CINEMATICS` dentro de `library.js`:

1. `ignitia-launch` — **Ignitia: despegue y caída**, 38 s. Reproduce el final anterior con una instancia visual separada: cohete, cable, Iván, pérdida de control y caída. No llama a los eventos de avance de la partida.
2. `ivan-descenso` — **Iván descenso**, 35 s. Caída al bosque (0–3 s), aterrizaje cómico (3–6), llegada a la cabaña (6–12), legado de Eric (12–16), periódico y Karla (16–24), frase de Iván (24–28), laboratorio iluminado y carteles de Eric (28–35).

En la historia, el botón **Continuar** de la tarjeta de desafío completado 6/6 reproduce **Iván descenso** antes de **Continuará en semana 10…**. La tarjeta de entrega y el progreso se conservan.

El reproductor ofrece pausa, repetición y salto. Cerrar o saltar durante el epílogo lleva al cierre de capítulo; en la galería solo regresa a la partida. La galería pausa al jugador, enemigos, reloj de aventura y avance de Eric hacia la Luna. Al salir restaura la música anterior. No abre puertas ni cambia habitaciones. Los diálogos HTML y los carteles admiten español e inglés; el diseño se adapta a móvil.

Recursos y prompts: `assets/cinematics/README.md`. Verificaciones: `tests/cinematics.cjs`, `tests/adventure.cjs` y `tests/physics.cjs`. La prueba de navegador comprueba disparo y acceso a la segunda sala, galería sin cambios de progreso, ambos finales, cartel bilingüe, móvil y ausencia de errores JavaScript.
