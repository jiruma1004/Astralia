# Sala VI · Intercepción de Eric

El terminal abre un radar horizontal. Los estudiantes controlan rapidez inicial, ángulo, retraso de lanzamiento y tiempo de vuelo. Pueden arrastrar el extremo verde de la trayectoria (equivale a ajustar rapidez y ángulo), observar las rutas previstas y ensayar sin perder vidas. El reloj táctico de Eric empieza al entrar a la sala y continúa mientras se planifica o se cierra la consola (×1); durante los ensayos ambos cohetes avanzan a ×20. Los intentos fallidos y el botón de restablecer controles no rebobinan el reloj. Eric llega al destino lunar a t=600 s: activa game over, con el audio existente, y permite reintentar desde la plataforma. Solo reaparecer o volver a entrar a la sala reinicia esta persecución; el reloj general de la aventura conserva su comportamiento. Una intercepción lograda detiene el reloj e inicia automáticamente un único lanzamiento con una copia de la trayectoria confirmada. Iván queda enganchado, se suelta sin desviar el cohete y desaparece entre nubes. Continúan la intercepción, la prisión y la ceremonia. El diploma espera la interacción del estudiante; continuar o cerrar reproduce primero «Iván descenso» y después el cierre de capítulo.

Modelo local didáctico, **no una simulación orbital ni una misión lunar físicamente completa**. Coordenadas en km; tiempo en segundos. Cohete de Ignitia como partícula balística con rapidez inicial v₀, sin propulsión durante este tramo, sin aire, gravedad uniforme g=0.00981 km/s². Eric mantiene velocidad constante en este tramo gracias a su propio sistema de vuelo. La Luna es un destino narrativo fuera de escala.

- Ignitia: x=v₀ cos(θ)τ; y=v₀ sin(θ)τ−gτ²/2.
- Eric: xᴱ=120+0.22t; yᴱ=60+0.10t.
- Reloj común: t=t₀+d+τ, donde t₀ es el reloj táctico al comenzar el ensayo y d es el retraso de salida.
- Intercepción: distancia entre ambos ≤3 km en el instante elegido, sin haber caído antes al suelo y antes de t=600 s.

El icono sólido es Eric en el instante actual; el icono tenue con círculo discontinuo indica su posición futura al encuentro. El extremo verde es la posición prevista de Ignitia. Los ejes se ajustan a las trayectorias; durante el arrastre conservan su escala para evitar saltos. Las líneas discontinuas son previsiones; las continuas son el vuelo simulado.

Referencia para docentes: con t₀=0 s, d=0 s y τ=80 s, el punto de encuentro es (137.6,68) km. Se obtiene vx=1.72 km/s, vy=1.2424 km/s; v₀≈2.1219 km/s y θ≈35.84°. No se muestra esta solución al estudiante. Se aceptan muchas combinaciones distintas.

`interception.js` contiene el modelo puro y el panel. `rocket.js` conserva diálogos, retratos y cinemática. Cerrar, cambiar de habitación o agotar el tiempo cancela el ensayo. Cambiar cualquier parámetro invalida la confirmación previa. Se mantienen traducciones ES/EN.

Pruebas del modelo: `node tests/interception.cjs`. La sala de propagación de errores sigue archivada bajo `room-015`, con su bandera desactivada.

La Luna pixelada se dibuja con bloques locales en Canvas en el extremo de la ruta de Eric: (252,120) en el mapa didáctico reducido. No representa la distancia astronómica real a la Luna. El icono sólido de Eric se mueve también durante la planificación, y el punto de encuentro previsto se recalcula con el tiempo actual.
