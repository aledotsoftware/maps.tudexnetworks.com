import { createMapEngine } from './engine/index.js';
import { layerPlugin } from './plugins/layerPlugin.js';
import { projectionPlugin } from './plugins/projectionPlugin.js';

/**
 * 🚀 GeoCore App Initialization
 */

const startApplication = async () => {
  const engine = createMapEngine('map-container', {
    zoom: 13,
    pitch: 60
  });

  engine.use(layerPlugin);
  engine.use(projectionPlugin);

  const { layers, projections } = await engine.init();

  // Setup UI Interactions
  document.getElementById('btn-projection').addEventListener('click', () => {
    const current = engine.map.getProjection().name;
    projections.set(current === 'globe' ? 'mercator' : 'globe');
  });

  // Test Layer
  layers.add('geocore-center', {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: { name: 'GeoCore Alpha Node' },
      geometry: { type: 'Point', coordinates: [-62.272, -38.718] }
    }]
  }, { 
    style: { color: '#64FFDA', opacity: 0.6, glow: true } 
  });

  window.GeoCore = engine;
};

startApplication().catch(console.error);
