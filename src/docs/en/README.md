<img width="150" src="../../styles/images/argenmap-banner.svg" alt="Maps Tudex" />

---
[Spanish version][README]

# Maps Tudex

**Maps Tudex** is a sovereign map viewer developed by [Tudex Networks][], open source and free from proprietary third-party dependencies. It allows you to display, query, and publish any geotagged information autonomously.

It is designed as a sovereign alternative to Google Maps: any organization or individual can deploy it on their own infrastructure and serve it without relying on external services.

## What does Maps Tudex do?

- 🗺️ **Displays base maps** from self-hosted or third-party tile servers (OSM, etc.)
- 📌 **Visualizes any geotagged information**: points, polygons, routes, WMS/WMTS services, GeoJSON files, and more
- 🔍 **Queries spatial data** directly from the map
- 🧩 **Extensible via layers and plugins**: JSON-configurable without touching code
- 🔒 **Full sovereignty**: no telemetry, no Google or proprietary cloud dependencies
- 🚀 **Lightweight and self-contained**: based on [Leaflet][], only requires a web server to run

## Use Cases

- Institutional geographic data visualization
- Internal network infrastructure maps
- Geospatial open data portals
- Sovereign alternative to Google Maps for organizations

## Documentation

- [Deployment][] quick guide
- [Configure][] layers, base maps and styles
- [Features][]
- [Contribute][]

## Stack

- [Leaflet][] — map rendering engine
- OGC-compatible tile servers (WMS, WMTS, TileJSON)
- Declarative JSON configuration
- No heavy frameworks, no proprietary dependencies

---

[Tudex Networks]: https://tudexnetworks.com
[Leaflet]: https://leafletjs.com/
[README]: ../../../README.md
[Deployment]: deployment.md
[Configure]: configuration.md
[Features]: features.md
[Contribute]: contributing.md
