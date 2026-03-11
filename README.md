
---

# Maps Tudex

**Maps Tudex** es un visor de mapas soberano desarrollado por [Tudex Networks][], de código abierto y sin dependencias de terceros propietarios. Permite visualizar, consultar y publicar cualquier información geoetiquetada de forma autónoma.

Está diseñado como una alternativa soberana a Google Maps: cualquier organización o individuo puede desplegarlo en su propia infraestructura y mostrarlo sin depender de servicios externos.

## ¿Qué hace Maps Tudex?

- 🗺️ **Muestra mapas base** desde servidores de teselas propios o de terceros (OSM, etc.)
- 📌 **Visualiza cualquier información geoetiquetada**: puntos, polígonos, rutas, servicios WMS/WMTS, archivos GeoJSON, y más
- 🔍 **Consulta datos espaciales** directamente desde el mapa
- 🧩 **Extensible mediante capas y plugins**: configurable vía JSON sin tocar código
- 🔒 **Soberanía total**: sin telemetría, sin dependencias de Google o servicios cloud propietarios
- 🚀 **Ligero y autónomo**: basado en [Leaflet][], sólo requiere un servidor web para funcionar

## Casos de uso

- Visualización de datos geográficos institucionales
- Mapas internos de infraestructura de red
- Portales de datos abiertos geoespaciales
- Alternativa soberana a Google Maps para organizaciones

## Documentación

- Guía rápida de [instalación][instalación]
- [Configurar][] capas, mapas base y estilos
- [Funcionalidades][]
- [Colaborar][] con el desarrollo

## Stack

- [Leaflet][] — motor de renderizado de mapas
- Servidores de teselas OGC-compatibles (WMS, WMTS, TileJSON)
- Configuración declarativa en JSON
- Sin frameworks pesados, sin dependencias propietarias

---

[Tudex Networks]: https://tudexnetworks.com
[Leaflet]: https://leafletjs.com/
[README_en]: src/docs/en/README.md
[instalación]: src/docs/deployment.md
[Configurar]: src/docs/configuration.md
[Funcionalidades]: src/docs/features.md
[Colaborar]: src/docs/contributing.md
