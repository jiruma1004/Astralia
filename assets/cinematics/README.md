# Recursos de las cinemáticas

Arte generado con la herramienta integrada `image_gen`, sin CLI ni clave de API. Las fotografías de Karla se usaron como referencias de identidad; la foto del arco, como referencia arquitectónica. El cartel es parte de la ficción cómica de Astralia.

Archivos finales:

- [Karla, retrato pixelado transparente](karla-pixel.webp).
- [Arco de piedra transparente](castle-arch.webp).
- [Bosque, cabaña e interiores apagado/encendido](ivan-descent-atlas.webp): atlas 2 × 2, en orden de lectura.
- [Verja animada, GIF reutilizable](castle-portcullis.gif): 256 × 256, 12 fps, apertura y cierre en bucle.
- [Prompts completos y referencias](prompts.json).
- [Prompts de carteles, pasos derechos, espacio y explosión](space-prompts.json), incluidas las refinaciones de los dos primeros.
- [Iván caminando hacia la derecha](ivan-walk-right.webp): dos fotogramas distintos, con zancada y paso de apoyo; solo reemplaza la caminata a la cabaña.
- [Carteles de Karla y Eric](wanted-portraits.webp): retratos impresos en blanco y negro, papel envejecido y márgenes reservados para textos traducibles.
- [Lanzamiento, espacio, prisión y celda](space-interception-atlas.webp): atlas 2 × 2 de fondos del final alternativo.
- [Explosión espacial](space-explosion.webp): cuatro fotogramas transparentes, atlas 2 × 2.

La verja del juego utiliza el mismo dibujo animado en Canvas, en `src/rooms/room-01/castle-gate.js`, para sincronizar la apertura con el impacto real. Se queda abierta tras acertar; el GIF es una copia independiente para reutilizar o previsualizar.

El sprite de aterrizaje de Iván, los cohetes y el cuerpo del Dr. Eric se reutilizan desde `assets/sprites`. Las animaciones, polvo, venda, paracaídas, reja y letras de los carteles se componen en código. Los rostros ya están integrados en el arte de los papeles. Los PNG originales de la primera tanda se conservan fuera del repositorio en `work/cinematics-sources`; la segunda tanda conserva sus originales en la carpeta de imágenes generadas y sus versiones finales WebP en esta carpeta.

## Ignitia y prisión moderna

- `ignitia-star-rocket.webp`: estrella del logotipo aportado, adaptada al fuselaje del cohete durante la intercepción espacial; fondo transparente.
- `modern-prison.webp`: dos paneles cuadrados; exterior de prisión moderna e interior con paneles de aluminio y ventana de barrotes de hierro oxidados. Sustituye solo los fondos de prisión de la película espacial. Los barrotes del primer plano se animan en Canvas.
- `lava-prison-prompts.json`: prompts completos y referencias de estas dos imágenes, generadas con la herramienta integrada `image_gen`. Los PNG originales se conservan en la carpeta de imágenes generadas.

La lava y sus cinco plataformas se dibujan en Canvas sobre el suelo del corredor, sin imágenes externas.

## Ceremonia de Ignitia

- `ceremony-hall.webp`: salón ceremonial de la academia, con espacio para el emblema dibujado en Canvas.
- `ceremony-teachers.webp`: Angélica (fila superior) y la versión A de EPI Paola (inferior), de pie, con boca cerrada/abierta. Se conserva como versión anterior; la ceremonia ahora utiliza los atlas de gestos individuales.
- `ceremony-prompts.json`: prompts y referencias de las imágenes, creadas con la herramienta integrada `image_gen`. La foto aportada de Angélica guía su aspecto; Paola conserva el personaje ilustrado aprobado anteriormente.

Los PNG originales se conservan en la carpeta de imágenes generadas. El emblema de Ignitia, el confeti y el certificado bilingüe se dibujan en Canvas/HTML, por separado, para conservar nitidez y legibilidad.

## Gestos e interior de la cabaña

Generados con la herramienta integrada `image_gen`, usando los sprites anteriores como referencias. Prompts completos en `gesture-prompts.json`.

- `ivan-cabin-idle.webp` y `.gif`: Iván centrado, mirando a la izquierda, con parpadeo y sin la marca marrón en el pantalón.
- `angelica-gesture.webp` y `.gif`: libro, saludo hacia la izquierda y regreso al libro.
- `paola-gesture.webp` y `.gif`: libro, saludo hacia la derecha y regreso al libro.

El juego anima los atlas en Canvas mediante `src/cinematics/gesture-sprites.js`, anclados a los pies para evitar saltos entre poses. Los GIF son exportaciones transparentes de la misma animación, a 12 fps. Las profesoras gesticulan mientras hablan y sostienen el libro al escuchar.
