export class LayerManager {
  constructor(mapInstance) {
    this.map = mapInstance;
    this.customLayers = new Map();
  }

  /**
   * Plugin interface to inject GeoJSON layers from CDN-Mesh
   * @param {string} layerId 
   * @param {Object} geojsonData 
   * @param {Object} metadata Identity metadata
   */
  addCustomLayer(layerId, geojsonData, metadata = {}) {
    if (this.map.getSource(layerId)) {
      console.warn(`Layer ${layerId} already exists.`);
      return;
    }

    // Use Nullish Coalescing for default values
    const color = metadata?.color ?? '#64FFDA';
    const opacity = metadata?.opacity ?? 0.8;

    this.map.addSource(layerId, {
      type: 'geojson',
      data: geojsonData
    });

    this.map.addLayer({
      id: `${layerId}-fill`,
      type: 'fill',
      source: layerId,
      paint: {
        'fill-color': color,
        'fill-opacity': opacity
      }
    });

    this.map.addLayer({
      id: `${layerId}-line`,
      type: 'line',
      source: layerId,
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 2
      }
    });

    this.customLayers.set(layerId, metadata);
    console.log(`[Plugin] Custom layer injected: ${layerId}`);
  }

  removeLayer(layerId) {
    if (this.map.getLayer(`${layerId}-fill`)) {
      this.map.removeLayer(`${layerId}-fill`);
      this.map.removeLayer(`${layerId}-line`);
      this.map.removeSource(layerId);
      this.customLayers.delete(layerId);
    }
  }
}
