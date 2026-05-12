import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LayerManager } from './LayerManager.js';

export class MapEngine {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.layerManager = null;
  }

  async init() {
    this.map = new maplibregl.Map({
      container: this.containerId,
      // Load the generated functional style
      style: '/assets/styles/deep-night.json',
      center: [-83.064, 58.882],
      zoom: 3,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    this.layerManager = new LayerManager(this.map);

    return new Promise((resolve) => {
      this.map.on('load', () => {
        this.setupControls();
        resolve(this);
      });
    });
  }

  setupControls() {
    // Add modern controls
    this.map.addControl(new maplibregl.NavigationControl({
      visualizePitch: true
    }), 'bottom-right');
    
    // Frutiger Aero specific interactions
    this.map.on('mousemove', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);
      if (features.length) {
        this.map.getCanvas().style.cursor = 'pointer';
      } else {
        this.map.getCanvas().style.cursor = '';
      }
    });
  }

  flyTo(lat, lon, zoom = 10) {
    this.map.flyTo({
      center: [lon, lat],
      zoom,
      essential: true,
      speed: 1.2,
      curve: 1.42
    });
  }
}
