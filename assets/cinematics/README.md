# Recursos de las cinemáticas

Arte generado con la herramienta integrada `image_gen`, sin CLI ni clave de API. Las fotografías de Karla se usaron como referencias de identidad; la foto del arco, como referencia arquitectónica. El cartel es parte de la ficción cómica de Astralia.

Archivos finales:

- [Karla, retrato pixelado transparente](karla-pixel.webp).
- [Arco de piedra transparente](castle-arch.webp).
- [Bosque, cabaña e interiores apagado/encendido](ivan-descent-atlas.webp): atlas 2 × 2, en orden de lectura.
- [Verja animada, GIF reutilizable](castle-portcullis.gif): 256 × 256, 12 fps, apertura y cierre en bucle.
- [Prompts completos y referencias](prompts.json).

La verja del juego utiliza el mismo dibujo animado en Canvas, en `src/rooms/room-01/castle-gate.js`, para sincronizar la apertura con el impacto real. Se queda abierta tras acertar; el GIF es una copia independiente para reutilizar o previsualizar.

El sprite de Iván y el retrato del Dr. Eric se reutilizan desde `assets/sprites`. Las animaciones, polvo, venda, cartel de Karla, texto y carteles de Eric se componen en código; así permanecen legibles y traducibles. Los originales PNG de la generación se conservan fuera del repositorio en `work/cinematics-sources`.
