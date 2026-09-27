# VI · Rumbo a la Luna

Programa el ascenso de Ignitia desde el terminal del mundo. MRUA vertical idealizado: v₀ = 0, h = 1800 m, v = 120 m/s, m = 1000 kg constante, g = 9.81 m/s²; sin aire. Con v = at y h = ½at² se obtiene t = 30 s, a = 4 m/s². El empuje debe vencer el peso: F = m(a + g) = 13810 N. El piloto automático ficticio gestiona la continuación lunar; no se presenta este modelo como una trayectoria orbital.

rocket.js valida altura, velocidad y empuje; también gestiona la huida de Eric, el mensaje de José Luis y el despegue final. Todos los controles permanecen dentro de la escena. El reloj termina únicamente al completar el ascenso. Tests: tests/rocket.cjs.
