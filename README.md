# Astralia · Academia de los seis umbrales

Escape room educativo en HTML, CSS y JavaScript, con menús de RPG clásico: azul nocturno, cristal, detalles dorados y letras más grandes. Seis habitaciones; las dos primeras tienen retos completos y las otras cuatro reservan futuros desafíos. Vista 2.5D por raycasting con objetos dibujados en canvas, sin dependencias externas. Las paredes incluyen estandartes, un retrato ilustrado original de Einstein y ecuaciones grafiteadas.

## Abrir

Abre `index.html` en un navegador moderno. No requiere instalación ni conexión. Opcionalmente: `python3 -m http.server 8000` desde esta carpeta.

## Primera sala · El puente de Galileo

1. Elige una bala en el estante: Saphir (0.5 kg), Ambre (1 kg), Rubis (2 kg) o Améthyste (4 kg).
2. Pulsa **Cargar orbe**, o toca el cañón de la escena después de elegirla. La recámara se ilumina con su color. La torreta Prisma tiene una base hexagonal y un cabezal de cristal, sin tubo largo ni ruedas.
3. Ajusta elevación θ, giro horizontal φ y rapidez o energía. La pantalla del cañón refleja los ángulos.
4. Dispara. Cada lanzamiento consume la bala cargada; hay suministro ilimitado en el estante.
5. Al alcanzar el botón suspendido, suena el MP3 de victoria y se activa el puente. Cruza por el centro; pisar el abismo provoca una caída. Rodea la torreta: es un objeto sólido.
6. Si disparas con más de 180 J, la torreta explota y tu personaje queda fuera de combate. Aparece «en papel nada se quema». La capacidad es una regla del equipo ficticio, no un umbral físico universal.
7. Tras caer o explotar, pulsa **Volver a la plataforma** (también Escape). Conservas el registro y el puente si ya estaba activo; la torreta se repara. Una explosión consume la bala. Un disparo interrumpido por caída no activa el puente.

En **rapidez fijada**, la masa cambia la energía, pero no la trayectoria ideal. En **energía fija**, la rapidez depende de la masa: v = √(2E/m). Modelo sin resistencia del aire, g = 9.81 m/s². El cañón permanece fijo: mirar alrededor no modifica su puntería. La gráfica lateral muestra x e y; los fallos informan también del desvío lateral z.

## Segunda sala · La rueda del destino

Acércate a la mesa y pulsa su cristal, el botón **Pulsar mesa** o la tecla **E**. Suena una campanada y la rueda gira durante 3.8 segundos. Selecciona sin repetir uno de diez problemas de MRUA, caída libre y tiro parabólico. Dos sectores rojos contienen retos avanzados de intercepción y optimización.

Introduce las dos respuestas con las unidades indicadas. Se acepta punto o coma decimal. Resolver un problema abre la puerta; puedes seguir girando para practicar el resto. Cada problema incluye pista y desarrollo. Reiniciar cierra la puerta y restablece la rueda.

Los enunciados son originales, inspirados temáticamente en la cinemática universitaria de Serway y Jewett; no son transcripciones ni números de ejercicios de una edición concreta. Consulta `docs/FUENTES.md`.

## Controles y audio

- WASD: caminar; flechas izquierda/derecha: girar la cámara. Arrastra el mouse dentro de la escena (o el dedo en pantalla táctil) para mirar horizontal y verticalmente. Un clic breve conserva la interacción con la torreta o el cristal.
- Espacio o botón **Saltar**: salto corto, sin doble salto. Puedes caer si aterrizas en el abismo; necesitas activar el puente para cruzar la primera sala.
- F: disparar; en la segunda sala, acciona la mesa. E: interactuar con la mesa. En móvil hay botones de movimiento y pasos laterales junto a la escena.
- El **Cuaderno de física** reúne gráfica, fórmulas y pistas. **Sobre la torreta** explica la puntería, la masa y la capacidad del equipo. Ambos se despliegan cuando los necesitas.
- **Activar sonido**: reproduce `assets/audio/ambiente.mp3` en bucle. También se activa al primer disparo con bala cargada o al pulsar la mesa. El mezclador incluye volumen general, música de fondo, victoria y efectos, con silencio independiente. La victoria baja el fondo al 18 % de su volumen mientras suena. El audio se pausa al ocultar la pestaña.
- El menú permite probar cualquiera de las seis habitaciones. Cambiar de sala restablece su reto.

## Estructura

- `src/rooms/room-01/`: configuración, física del proyectil, masa, carga y laboratorio.
- `src/rooms/room-02/`: configuración, banco de problemas y controlador de ruleta.
- `src/rooms/room-03/` a `room-06/`: espacios para futuros retos.
- `src/engine/renderer.js`: raycasting, cámara con altura e inclinación, cañón, pantalla y mesa/ruleta.
- `src/engine/decor.js`: retrato, grafitis y estandartes originales dibujados en canvas; proyección sobre las paredes.
- `src/audio/sound.js`: mezclador y reproducción de los MP3 locales aportados por el usuario; clics y disparos sintetizados.
- `assets/audio/ambiente.mp3`, `victoria.mp3`, `explosion.mp3`: copias de los tres archivos facilitados. Los originales de Descargas no se modifican.
- `src/main.js`: navegación, interacción y colisiones.
- `src/ui/styles.css` y `src/ui/rpg.css`: tema base y menús de RPG adaptables.
- `assets/`: carpetas reservadas para futuros recursos.
- `tests/physics.cjs`: comprobación de física y respuestas; ejecutar `node tests/physics.cjs`.

Repositorio: https://github.com/jiruma1004/Astralia. Demo: https://jiruma1004.github.io/Astralia/. El progreso y los intentos viven en memoria; se reinician al recargar. Las salas 03–06 mantienen puertas de boceto que se abren con un disparo.
