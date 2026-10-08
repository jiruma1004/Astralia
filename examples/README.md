# CSV de ejemplo local

`tests/classroom.browser.cjs` genera `examples/resultados-ejemplo.csv` durante el recorrido sintético de la ruta partícula con una ayuda. No contiene actividad de un estudiante. Sus tiempos son artificialmente cortos y no sirven como referencia de rendimiento académico.

El archivo tiene siete filas (una por sala) y las columnas Sala, Tiempo total (minutos), Muertes, Errores, Intentos hasta pasar, Usó pistas y Usó IA.

Los CSV quedan fuera de Git para evitar publicar resultados de actividad. El formato completo, los campos y las reglas están en [Aula y métricas](../docs/AULA-Y-METRICAS.md). El juego permite descargar cada resultado desde el diploma sin enviarlo a servidores.

Para regenerarlo, sirve la carpeta del juego en el puerto 8765 y ejecuta con Node `tests/classroom.browser.cjs`, con Playwright disponible (o indicando su ruta en `PLAYWRIGHT_MODULE`) y Chrome en `/usr/bin/google-chrome`.
