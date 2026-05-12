
---

# Maps Tudex

**Maps Tudex** es un visor de mapas soberano desarrollado por [Tudex Networks][], de código abierto y sin dependencias de terceros propietarios. Permite visualizar, consultar y publicar cualquier información geoetiquetada de forma autónoma.

Está diseñado como una alternativa soberana a Google Maps: cualquier organización o individuo puede desplegarlo en su propia infraestructura y mostrarlo sin depender de servicios externos.
Aquí tienes el README completo para tu proyecto, estructurado con una arquitectura basada en soberanía tecnológica y autogestión de datos.

*Nota técnica:* Aunque mencionaste Leaflet, para soportar un "globo 3D" nativo y cambio fluido de proyecciones, **MapLibre GL JS** u **OpenLayers** son opciones arquitectónicamente superiores para el frontend. El stack propuesto refleja esto.

---

# GeoCore Map Engine 🌍

GeoCore es una plataforma cartográfica soberana de alto rendimiento. Diseñada para reemplazar dependencias de terceros (como Google Maps), renderiza, sirve y visualiza teselas (tiles) personalizadas a partir de datos de OpenStreetMap (OSM). Soporta múltiples proyecciones, herramientas de medición precisas y un sistema de capas colaborativas impulsadas por la comunidad.

## 🚀 Características Principales

* **Servidor de Teselas Propio:** Generación y servicio de Vector Tiles (MVT) directamente desde nuestra infraestructura, garantizando control total del diseño y rendimiento.
* **Proyecciones Dinámicas:**
* Mercator (EPSG:3857 - Estándar web).
* Cilíndrica Equidistante (EPSG:4326 - Flat/Plate Carrée).
* Globo 3D (Estilo Google Earth).
* Soporte para proyecciones personalizadas (Proj4js).


* **Herramientas GIS Integradas:**
* Medición de distancias (líneas y rutas).
* Medición de áreas (polígonos).
* Marcadores y ubicaciones personalizadas guardadas en el perfil del usuario.


* **Buscador Integrado (Geocoding):** Búsqueda de direcciones y Puntos de Interés (POIs) utilizando un motor propio (basado en Nominatim o Pelias).
* **Gestión de Capas y Comunidad:**
* Carga de datos de usuario (GeoJSON, KML, GPX).
* Directorio de capas comunitarias (ej. tráfico, zonas de calor, rutas de senderismo).
* Activación/desactivación de capas en tiempo real.



## 🏗 Arquitectura del Sistema

El proyecto se divide en tres capas principales (Soberanía de Datos, Backend de Servicio y Frontend):

1. **Capa de Datos (Base de Datos & Parsing):**
* **PostgreSQL + PostGIS:** Almacenamiento espacial de alto rendimiento.
* **Osm2pgsql:** Herramienta para importar el `planet.osm.pbf` a la base de datos PostGIS.


2. **Capa de Servicio (Tile Server & API):**
* **Martin / TileServer GL:** Servidor ultra-rápido (escrito en Rust o Node) para servir las teselas vectoriales (MVT) al vuelo desde PostGIS.
* **Node.js / Express (API REST):** Gestiona la autenticación, subida de archivos (GeoJSON), buscador (forward/reverse geocoding) y el CRUD de las capas comunitarias.


3. **Capa de Visualización (Frontend):**
* **MapLibre GL JS:** Motor de renderizado WebGL (Soporta Globo 3D nativo y aceleración por hardware, superando a Leaflet en este caso de uso).
* **Turf.js:** Motor de análisis espacial en el cliente (para cálculos de mediciones de distancias y áreas en tiempo real).
* **Vue.js / Nuxt o React:** Framework de UI para los menús, buscador y gestión de capas.



## ⚙️ Requisitos de Infraestructura (Bare-Metal/Self-Hosted)

* Servidor Linux (Ubuntu/Debian o entorno custom como éterOS).
* Mínimo 64GB RAM y almacenamiento NVMe (1TB+ recomendado para OSM Planet + índices).
* Docker y Docker Compose (opcional para despliegue modular).

## 🛠 Instalación y Configuración (Guía Rápida)

### 1. Preparar la Base de Datos Spatial

```bash
# Iniciar contenedor PostGIS
docker run --name geocore-db -e POSTGRES_PASSWORD=secret -d postgis/postgis

```

### 2. Importar datos de OpenStreetMap

```bash
# Descargar extracto o planeta completo (ejemplo: Argentina)
wget http://download.geofabrik.de/south-america/argentina-latest.osm.pbf

# Importar con osm2pgsql a PostGIS
osm2pgsql -d geocore -U postgres -H localhost -W --create --slim -G --hstore argentina-latest.osm.pbf

```

### 3. Levantar el Servidor de Teselas (Martin)

```bash
# Martin autodetectará las tablas espaciales en PostGIS y servirá los endpoints MVT
docker run -p 3000:3000 -e DATABASE_URL=postgres://postgres:secret@localhost:5432/geocore maplibre/martin

```

### 4. Inicializar el Frontend

```bash
cd frontend
npm install
npm run dev

```

## 🗺 Funciones del Frontend (MapLibre + Turf.js)

* **Cambio de Proyección:** Implementado mediante `map.setProjection({ name: 'globe' })` o `'mercator'`.
* **Carga de GeoJSON:** Uso de la API File para leer blobs locales y añadirlos como `map.addSource()`.
* **Estilos Custom:** Los estilos base (fondos oscuros, topografía) se definen en un archivo `style.json` servido desde nuestro backend, apuntando a nuestro propio Tile Server.

## 🤝 Contribución de Capas (Comunidad)

Los usuarios pueden subir sus datasets espaciales a través de la API. El backend valida la geometría, la sanitiza y la indexa en PostGIS bajo el esquema `community_layers`. Estas capas quedan disponibles en el endpoint `/api/v1/layers` para que cualquier usuario pueda activarlas en su visor.

## 📝 Roadmap

* [ ] Configuración de PostGIS y carga de OSM.
* [ ] Renderizado base con MapLibre GL (Proyección Mercator y Globo).
* [ ] Integración de Turf.js para herramientas de dibujo poligonal y métricas.
* [ ] Motor de búsqueda local (Pelias/Nominatim).
* [ ] Dashboard de carga de datos para usuarios (Soporte GeoJSON/KML).
* [ ] Soporte PWA para caché offline de tiles específicos.