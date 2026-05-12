import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * 🗺️ GeoCore Engine v1.0
 * Functional Architecture for Sovereign Map Rendering
 */

export const createMapEngine = (containerId, options = {}) => {
  const state = {
    map: null,
    ready: false,
    plugins: new Set()
  };

  const init = async () => {
    const { 
      style = '/assets/styles/deep-night.json',
      center = [-62.275, -38.725],
      zoom = 12,
      pitch = 45,
      bearing = 0
    } = options;

    state.map = new maplibregl.Map({
      container: containerId,
      style,
      center,
      zoom,
      pitch,
      bearing,
      antialias: true,
      hash: true // Use URL hash for state persistence
    });

    return new Promise((resolve) => {
      state.map.on('load', () => {
        state.ready = true;
        setupBaseControls(state.map);
        console.log('🚀 [Engine] GeoCore Initialized');
        resolve(state);
      });
    });
  };

  const setupBaseControls = (map) => {
    map.addControl(new maplibregl.NavigationControl({
      visualizePitch: true
    }), 'bottom-right');

    // Smooth hover effect on interactive features
    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point);
      map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    });
  };

  const use = (plugin) => {
    if (typeof plugin === 'function') {
      plugin(state);
    } else if (plugin?.install) {
      plugin.install(state);
    }
    state.plugins.add(plugin);
    return state;
  };

  return {
    init,
    use,
    get map() { return state.map; },
    get isReady() { return state.ready; }
  };
};
