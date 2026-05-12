import { MapEngine } from './MapEngine.js';

// Setup Service Worker for aggressive caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Instantiate modern map engine
const initApp = async () => {
  const engine = new MapEngine('map-container');
  await engine.init();

  // Test the Custom Layers Plugin Interface (Simulating CDN-Mesh injection)
  engine.layerManager.addCustomLayer('tudex-zone-alpha', {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-84.0, 58.0],
          [-82.0, 58.0],
          [-82.0, 59.0],
          [-84.0, 59.0],
          [-84.0, 58.0]
        ]]
      }
    }]
  }, { color: '#64FFDA', opacity: 0.3 });

  // Expose for testing
  window.TudexMaps = engine;
};

initApp();
