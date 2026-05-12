import fs from 'node:fs/promises';
import path from 'node:path';

// ==========================================
// 🎨 CONFIGURADOR DE ESTILOS DEL MAPA
// Aquí es donde eliges CÓMO se ve la data.
// Cambia estos colores hexadecimales para crear tu propia estética (Clara, Oscura, Neón, etc.)
// ==========================================
const PALETTE = {
  background: '#0B0D17', // Color de fondo base (espacio/vacío)
  water: '#0A192F',      // Color de océanos y ríos
  land: '#112240',       // Color de la masa terrestre/parques
  boundary: '#64FFDA',   // Fronteras administrativas
  roads: {
    highway: '#E6F1FF',  // Autopistas principales
    main: '#8892B0',     // Avenidas secundarias
    street: '#233554'    // Calles vecinales
  },
  text: {
    primary: '#CCD6F6',  // Nombres de ciudades principales
    secondary: '#8892B0' // Nombres de lugares menores
  }
};

// Pipeline operators & Functional composition utilities (ESNext style)
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// Base Style Generator
const createBaseStyle = () => ({
  version: 8,
  name: 'Tudex Custom Style',
  metadata: {
    'tudex:version': '2.0.0'
  },
  sources: {
    'openmaptiles': {
      type: 'vector',
      // Conexión a tu Servidor Local de Teselados (Generados con Planetiler)
      url: 'http://localhost:8080/data/v3.json'
    }
  },
  // Apuntamos a los sprites y fuentes open-source válidos para evitar errores 404
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite',
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  layers: []
});

// Layer generators (Pure Functions)
const addBackgroundLayer = (style) => ({
  ...style,
  layers: [
    ...style.layers,
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': PALETTE.background }
    }
  ]
});

const addWaterLayer = (style) => ({
  ...style,
  layers: [
    ...style.layers,
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: {
        'fill-color': PALETTE.water,
        'fill-opacity': 0.8
      }
    }
  ]
});

const addLandLayer = (style) => ({
  ...style,
  layers: [
    ...style.layers,
    {
      id: 'landcover',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      paint: { 'fill-color': PALETTE.land }
    }
  ]
});

const addRoadLayers = (style) => {
  const roadLayers = [
    {
      id: 'road_minor',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'minor'],
      paint: {
        'line-color': PALETTE.roads.street,
        'line-width': 1,
        'line-opacity': 0.5
      }
    },
    {
      id: 'road_main',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'primary'],
      paint: {
        'line-color': PALETTE.roads.main,
        'line-width': 2,
        // Glassmorphism/Glow effect using blur
        'line-blur': 1
      }
    },
    {
      id: 'road_highway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'motorway'],
      paint: {
        'line-color': PALETTE.roads.highway,
        'line-width': 3,
        'line-blur': 1,
        'line-opacity': 0.9
      }
    }
  ];

  return { ...style, layers: [...style.layers, ...roadLayers] };
};

const addBoundaryLayer = (style) => ({
  ...style,
  layers: [
    ...style.layers,
    {
      id: 'boundary_country',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['==', 'admin_level', 2],
      paint: {
        'line-color': PALETTE.boundary,
        'line-width': 1.5,
        'line-dasharray': [4, 4],
        'line-opacity': 0.8
      }
    }
  ]
});

const addLabelLayers = (style) => ({
  ...style,
  layers: [
    ...style.layers,
    {
      id: 'place_label_city',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['==', 'class', 'city'],
      layout: {
        'text-field': '{name}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 14
      },
      paint: {
        'text-color': PALETTE.text.primary,
        'text-halo-color': PALETTE.background,
        'text-halo-width': 2,
        'text-halo-blur': 1
      }
    }
  ]
});

// Build the complete style using the pipeline
const generateMapStyle = () => pipe(
  createBaseStyle,
  addBackgroundLayer,
  addWaterLayer,
  addLandLayer,
  addRoadLayers,
  addBoundaryLayer,
  addLabelLayers
)();

// Main execution
const run = async () => {
  try {
    const outputDir = path.resolve(process.cwd(), 'public/assets/styles');
    await fs.mkdir(outputDir, { recursive: true });
    
    const finalStyle = generateMapStyle();
    const outputPath = path.join(outputDir, 'deep-night.json');
    
    await fs.writeFile(outputPath, JSON.stringify(finalStyle, null, 2));
    console.log(`[OK] Deep Night Map Style successfully generated at: ${outputPath}`);
  } catch (error) {
    console.error('[Error] Failed to generate map style:', error);
    process.exit(1);
  }
};

run();
