/**
 * 🧩 Layer Manager Plugin
 * Interface for GeoJSON injection and CDN-Mesh metadata integration
 */

export const layerPlugin = (engineState) => {
  const { map } = engineState;

  const addCustomLayer = (layerId, geojsonData, metadata = {}) => {
    if (!map || map.getSource(layerId)) return;

    // ESNext: Nullish Coalescing and Optional Chaining
    const color = metadata?.style?.color ?? '#64FFDA';
    const opacity = metadata?.style?.opacity ?? 0.8;
    const glow = metadata?.style?.glow ?? true;

    map.addSource(layerId, {
      type: 'geojson',
      data: geojsonData
    });

    // Main Fill Layer (Glassmorphism effect)
    map.addLayer({
      id: `${layerId}-fill`,
      type: 'fill',
      source: layerId,
      paint: {
        'fill-color': color,
        'fill-opacity': opacity,
        'fill-outline-color': '#FFFFFF'
      }
    });

    if (glow) {
      // Add a subtle outer glow (Frutiger Aero aesthetic)
      map.addLayer({
        id: `${layerId}-glow`,
        type: 'line',
        source: layerId,
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-blur': 4,
          'line-opacity': 0.4
        }
      });
    }

    console.log(`[Plugin] Layer Injected: ${layerId} | Origin: CDN-Mesh`);
  };

  const removeLayer = (layerId) => {
    const layers = [`${layerId}-fill`, `${layerId}-glow`];
    layers.forEach(l => {
      if (map.getLayer(l)) map.removeLayer(l);
    });
    if (map.getSource(layerId)) map.removeSource(layerId);
  };

  // Expose methods to the engine state or as a return object
  engineState.layers = {
    add: addCustomLayer,
    remove: removeLayer
  };
};
