# Tiles personalizados de Tudex

Este documento define un flujo base para generar y publicar tiles propios en:

`/tiles/{z}/{x}/{y}.png`

## Objetivo

- Evitar CORS y rate limits de terceros.
- Controlar estilo, cobertura, zoom y cache.
- Servir teselas desde `maps.tudexnetworks.com`.

## Estructura esperada en servidor

```text
/var/www/maps.tudexnetworks.com/
  tiles/
    0/0/0.png
    1/0/0.png
      ...
```

## Pipeline recomendado (ráster simple)

1. Partir de un GeoTIFF/MBTiles base (ej. mosaico propio o capa base procesada).
2. Generar XYZ PNG con GDAL.
3. Publicar carpeta resultante en `tiles/`.

### Ejemplo con GDAL (`gdal2tiles.py`)

```bash
gdal2tiles.py \
  --xyz \
  --zoom=0-14 \
  --processes=4 \
  -w none \
  input.tif \
  ./tiles
```

## Pipeline recomendado (vectorial, mejor escalabilidad)

1. Generar `.mbtiles` vectorial (OpenMapTiles/Tilemaker/Tegola).
2. Renderizar estilo propio en servidor de tiles (TileServer GL o Tegola + renderer).
3. Exponer endpoint PNG en `/tiles/{z}/{x}/{y}.png`.

## Nginx (cache agresiva)

```nginx
location /tiles/ {
  add_header Access-Control-Allow-Origin "*" always;
  expires 30d;
  add_header Cache-Control "public, max-age=2592000, immutable";
  try_files $uri =404;
}
```

## Checklist de calidad

- Validar que `z/x/y` exista para todos los niveles publicados.
- Revisar seams/bordes entre tiles.
- Verificar legibilidad en `z=4,8,12,14`.
- Confirmar peso por tile (objetivo: <150KB promedio en PNG).
- Probar fallback en el visor (si falta tile, no romper render).
