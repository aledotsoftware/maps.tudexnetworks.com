/**
 * Web Worker for off-thread processing of map tiles and geometry data.
 * Adheres to functional programming paradigm.
 */

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_GEOJSON') {
    // Example: Process large GeoJSON features purely
    const processedFeatures = payload.features.map(feature => {
      // Simulate heavy data manipulation, e.g., coordinate transformation
      return {
        ...feature,
        properties: {
          ...feature.properties,
          _processedAt: Date.now()
        }
      };
    });

    self.postMessage({
      type: 'GEOJSON_PROCESSED',
      payload: { ...payload, features: processedFeatures }
    });
  }
};
