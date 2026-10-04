# El puente de Galileo

Objetivo: explorar elevación, azimut, rapidez, masa y energía mediante predicciones y ensayos.

El cañón se sitúa en (3.5, 3.5) casillas. Su boca está a 1.2 m sobre la plataforma y el botón a 4.5 m, centrado sobre el arco de la verja en x = 19. Cada casilla equivale a 2 m; el blanco está 31 m adelante, sin desplazamiento lateral. La sala pasa de 28 a 21 columnas (25 % menos). El vacío mantiene sus extremos x = 6 y x = 17.25; el recorte elimina el exceso de terreno después del puente. Se acierta al cruzar el plano del botón con una desviación radial máxima de 0.5 m, antes de caer por debajo de la plataforma o chocar con una pared lateral. El impacto despliega el puente y eleva la verja en 1.4 s. El cierre del pasillo es de piedra.

Elegir bala no basta: hay que cargarla. Cada disparo consume una bala. Masas: 0.5, 1, 2 y 4 kg. A rapidez fijada la masa no modifica el movimiento; a energía fijada v₀ = √(2E/m). No hay rozamiento. φ = 0 apunta al botón; φ positivo desvía a la derecha. Giro limitado a ±60°, elevación de 5° a 80°.

Referencia docente: θ = 45°, φ = 0°, Δy = 3.3 m y x = 31 m. De Δy = x tan θ − gx²/(2v₀² cos² θ), resulta v₀ = √(9.81 × 31²/(31 − 3.3)) ≈ 18.45 m/s. Una bala de 1 kg requiere unos 170.2 J, dentro de capacidad; 0.5 kg también es segura. Con esa rapidez, 2 o 4 kg sobrecargan la torreta. El punto de cámara inicial está separado del cañón para observarlo; moverse o girar la cámara no modifica el origen ni los ángulos del disparo.

Secuencia didáctica: predecir, cargar, disparar, comparar el registro, cambiar una sola variable. Contrastar dos masas con igual rapidez y luego con igual energía. Comparar elevaciones complementarias y explicar el efecto de un giro horizontal sobre un blanco puntual.


## Caída y sobrecarga

La torreta Prisma tiene `physics.maxEnergy = 180` J. Se calcula E = ½mv² en ambos modos. El indicador avisa antes de disparar; más de 180 J consume la bala y provoca explosión y derrota. 180 J exactos siguen dentro de capacidad. La frase de derrota es «en papel nada se quema».

El jugador puede entrar en las casillas del abismo; perder el suelo inicia una animación de caída. El puente soporta únicamente la fila central cuando está activo. Reaparecer conserva progreso e intentos, repara la torreta y cancela cualquier lanzamiento que estuviera en vuelo al morir. La física del disparo ideal sigue siendo independiente de la masa a velocidad fija; la sobrecarga es una regla de capacidad del equipo del juego.
