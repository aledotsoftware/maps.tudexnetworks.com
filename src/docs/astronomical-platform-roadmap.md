# Plataforma Cartográfica-Astronómica - Roadmap de Implementación

## Objetivo
Evolucionar el visor actual hacia una plataforma multi-escala y multi-dominio:
- Tierra: calles, rutas, estados, naciones, capas temáticas.
- Cielo cercano: Sol, Luna, planetas, satélites, NEOs.
- Escala estelar: estrellas, constelaciones, galaxias, catálogos científicos.

## Principios
1. Precisión científica por defecto.
2. Arquitectura por capas (datos, cálculo, render, UX).
3. Escalabilidad temporal (pasado/presente/futuro).
4. Compatibilidad incremental con el visor actual.

## Fase 1 - Núcleo unificado (en curso)
- Modo astronómico accesible desde el globo.
- Día/noche en tiempo real por subpunto solar.
- Marcadores de subpuntos planetarios (aproximados) con leyenda.
- Contratos de datos base para objetos terrestres y celestes.

## Fase 2 - Precisión astronómica
- Integrar efemérides de mayor exactitud (SPA/VSOP/SPICE).
- Soporte de sistemas de referencia (ICRF, ECI, ECEF).
- Validación cruzada con fuentes externas.

## Fase 3 - Motor cartográfico planetario
- Tiles por viewport (no atlas global único).
- LOD adaptativo por zoom/latencia/dispositivo.
- Capas vectoriales y raster sincronizadas por tiempo.

## Fase 4 - Conocimiento de la humanidad
- Grafo semántico geohistórico (lugares, hechos, fronteras, rutas).
- Búsqueda semántica por contexto (espacio-tiempo-tema).
- Anotaciones colaborativas y trazabilidad de fuentes.

## Fase 5 - Escala estelar y galáctica
- Catálogos estelares (magnitude, spectral type, proper motion).
- Órbitas y trayectorias de objetos.
- Transición continua entre escalas (Tierra -> Sistema Solar -> Galaxia).

## Hitos técnicos mínimos
1. Contratos de datos estabilizados.
2. API interna de efemérides desacoplada del renderer.
3. Pruebas de precisión con tolerancias declaradas.
4. Capa de observabilidad (latencia, error astronómico, memoria, FPS).

