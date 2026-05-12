-- Habilitar PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Esquema para capas de la comunidad
CREATE SCHEMA IF NOT EXISTS community_layers;

-- Tabla de capas GeoJSON
CREATE TABLE IF NOT EXISTS community_layers.features (
    id SERIAL PRIMARY KEY,
    name TEXT,
    metadata JSONB,
    geom GEOMETRY(Geometry, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice espacial para rendimiento
CREATE INDEX IF NOT EXISTS features_geom_idx ON community_layers.features USING GIST (geom);
