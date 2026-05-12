/**
 * 🌎 Projection Manager Plugin
 * Toggle between Globe and Mercator views
 */

export const projectionPlugin = (engineState) => {
  const { map } = engineState;

  const setProjection = (name) => {
    if (!map) return;
    
    // MapLibre GL JS supports 'globe' and 'mercator'
    map.setProjection({ name });
    console.log(`[Plugin] Projection changed to: ${name}`);
  };

  engineState.projections = {
    set: setProjection,
    toGlobe: () => setProjection('globe'),
    toMercator: () => setProjection('mercator')
  };
};
