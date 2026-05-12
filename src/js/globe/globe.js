(() => {
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;
  const MAX_MERCATOR_LAT = 85.05112878;
  const EARTH_AXIAL_TILT_RAD = 23.44 * DEG2RAD;

  const canvas = document.getElementById("globe-canvas");
  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) throw new Error("WebGL no disponible");

  const ui = {
    popup: document.getElementById("popup"),
    popupContent: document.getElementById("popup-content"),
    searchInput: document.getElementById("search-input"),
    searchResults: document.getElementById("search-results"),
    routePanel: document.getElementById("route-panel"),
    routeToggle: document.getElementById("route-toggle"),
    routeFromInput: document.getElementById("route-from"),
    routeToInput: document.getElementById("route-to"),
    routeBuild: document.getElementById("route-build"),
    routeInfo: document.getElementById("route-info"),
    basemapSelect: document.getElementById("basemap-select"),
    projectionSelect: document.getElementById("projection-select"),
    astroMode: document.getElementById("astro-mode"),
    astroModeFab: document.getElementById("astro-mode-fab"),
    layerMarkers: document.getElementById("layer-markers"),
    layerRoutes: document.getElementById("layer-routes"),
    layerGraticule: document.getElementById("layer-graticule"),
    statusBar: document.getElementById("status-bar"),
    astroLegend: document.getElementById("astro-legend"),
    debugPanel: document.getElementById("debug-panel"),
    resetMap: document.getElementById("reset-map"),
    attribution: document.getElementById("attribution"),
    zoomIn: document.getElementById("zoom-in"),
    zoomOut: document.getElementById("zoom-out"),
    resetNorth: document.getElementById("reset-north"),
    flipLatAxis: document.getElementById("flip-lat-axis"),
    locateMe: document.getElementById("locate-me"),
  };

  const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "1";
  if (debugEnabled) ui.debugPanel.classList.remove("hidden");

  const BASEMAPS = {
    tudex: {
      id: "tudex",
      label: "Tudex Personalizado",
      attribution: "© Tudex Networks",
      url: "/tiles/{z}/{x}/{y}.png",
      fallback: "topo",
      defaultZ: 2,
    },
    osm: {
      id: "osm",
      label: "OpenStreetMap",
      attribution: "Datos cartográficos © OpenStreetMap contributors",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      fallback: null,
      defaultZ: 2,
    },
    sat: {
      id: "sat",
      label: "Esri Satellite",
      attribution: "Imágenes satelitales © Esri",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      fallback: "topo",
      defaultZ: 2,
    },
    topo: {
      id: "topo",
      label: "Esri Topographic",
      attribution: "Mapa topográfico © Esri",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      fallback: "sat",
      defaultZ: 2,
    },
  };

  const PLANETS = [
    { key: "mercury", label: "Mercurio", color: [0.85, 0.82, 0.72, 1], periodDays: 87.9691, L0: 252.25084 },
    { key: "venus", label: "Venus", color: [0.96, 0.88, 0.62, 1], periodDays: 224.70069, L0: 181.97973 },
    { key: "mars", label: "Marte", color: [0.95, 0.44, 0.29, 1], periodDays: 686.98, L0: 355.433 },
    { key: "jupiter", label: "Júpiter", color: [0.91, 0.73, 0.5, 1], periodDays: 4332.59, L0: 34.351 },
    { key: "saturn", label: "Saturno", color: [0.89, 0.79, 0.58, 1], periodDays: 10759.22, L0: 50.077 },
    { key: "uranus", label: "Urano", color: [0.63, 0.92, 0.95, 1], periodDays: 30688.5, L0: 314.055 },
    { key: "neptune", label: "Neptuno", color: [0.38, 0.62, 0.95, 1], periodDays: 60182, L0: 304.348 },
  ];

  class RenderState {
    constructor() {
      this.textureStatus = "INIT";
      this.lastTextureError = null;
      this.activeProjection = "globe";
      this.activeBasemap = "tudex";
      this.errors = [];
    }

    setStatus(status, message, level = "ok") {
      this.textureStatus = status;
      ui.statusBar.textContent = message;
      ui.statusBar.className = `status-bar ${level}`;
      this.debug();
    }

    pushError(error) {
      this.lastTextureError = error;
      this.errors.push({ ...error, at: new Date().toISOString() });
      if (this.errors.length > 25) this.errors.shift();
      this.debug();
    }

    setProjection(mode) {
      this.activeProjection = mode;
      this.debug();
    }

    setBasemap(id) {
      this.activeBasemap = id;
      ui.attribution.textContent = BASEMAPS[id]?.attribution || BASEMAPS.osm.attribution;
      this.debug();
    }

    debug() {
      if (!debugEnabled) return;
      const payload = {
        textureStatus: this.textureStatus,
        activeProjection: this.activeProjection,
        activeBasemap: this.activeBasemap,
        lastTextureError: this.lastTextureError,
        recentErrors: this.errors.slice(-5),
      };
      ui.debugPanel.textContent = JSON.stringify(payload, null, 2);
    }
  }

  class TileProvider {
    constructor(glContext, texture, renderState) {
      this.gl = glContext;
      this.texture = texture;
      this.renderState = renderState;
      this.cache = new Map();
      this.requestVersion = 0;
      this.currentKey = "";
      this.placeholder = this.createPlaceholder();
      this.applyTextureSource(this.placeholder);
    }

    createPlaceholder() {
      const c = document.createElement("canvas");
      c.width = 2;
      c.height = 2;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#3a5877";
      ctx.fillRect(0, 0, 2, 2);
      ctx.fillStyle = "#2a3f57";
      ctx.fillRect(1, 0, 1, 1);
      ctx.fillRect(0, 1, 1, 1);
      return c;
    }

    classifyError(message) {
      const text = String(message || "").toLowerCase();
      if (text.includes("cross-origin") || text.includes("cors") || text.includes("security")) return "CORS_BLOCKED";
      if (text.includes("decode")) return "DECODE";
      if (text.includes("network") || text.includes("fetch")) return "NETWORK";
      if (text.includes("teximage2d") || text.includes("webgl")) return "WEBGL_UPLOAD";
      return "UNKNOWN";
    }

    applyTextureSource(source) {
      try {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);
      } catch (err) {
        const error = {
          code: this.classifyError(err?.message),
          stage: "WEBGL_UPLOAD",
          message: err?.message || String(err),
        };
        this.renderState.pushError(error);
        this.renderState.setStatus("DEGRADED", "Modo degradado (error al subir textura).", "warn");
      }
    }

    async loadImage(url, timeoutMs) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          cache: "default",
          signal: controller.signal,
        });
        if (!response.ok) {
          return {
            ok: false,
            code: response.status === 404 ? "HTTP_404" : "HTTP_ERROR",
            status: response.status,
            message: `Tile HTTP ${response.status}: ${url}`,
          };
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("decode"));
          img.src = objectUrl;
        });
        URL.revokeObjectURL(objectUrl);
        return { ok: true, image };
      } catch (err) {
        if (err?.name === "AbortError") {
          return { ok: false, code: "NETWORK", message: "Tile timeout" };
        }
        return { ok: false, code: "NETWORK", message: `Tile load failed: ${url}` };
      } finally {
        clearTimeout(timer);
      }
    }

    async fetchTile(z, x, y, basemapId) {
      const basemap = BASEMAPS[basemapId] || BASEMAPS.osm;
      const url = basemap.url.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
      const retries = [1800];
      for (let i = 0; i < retries.length; i++) {
        const result = await this.loadImage(url, retries[i]);
        if (result.ok) return { ok: true, image: result.image };
        if (result.code === "HTTP_404") return { ok: false, code: "HTTP_404", message: result.message };
      }
      return { ok: false, code: "NETWORK", message: `No se pudo cargar tile z${z}/${x}/${y}` };
    }

    async buildAtlas(basemapId, tileZoom) {
      const key = `${basemapId}:${tileZoom}`;
      if (this.cache.has(key)) return { ok: true, atlas: this.cache.get(key), key, fromCache: true };

      const n = 1 << tileZoom;
      const tileSize = 256;
      const atlas = document.createElement("canvas");
      atlas.width = n * tileSize;
      atlas.height = n * tileSize;
      const ctx = atlas.getContext("2d");

      let failures = 0;
      let missing404 = 0;
      const tasks = [];
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          tasks.push(async () => {
            const tile = await this.fetchTile(tileZoom, x, y, basemapId);
            if (!tile.ok) {
              failures += 1;
              if (tile.code === "HTTP_404") missing404 += 1;
              ctx.fillStyle = "#203247";
              ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
              return;
            }
            ctx.drawImage(tile.image, x * tileSize, y * tileSize);
          });
        }
      }
      const concurrency = 6;
      let taskIndex = 0;
      const workers = new Array(Math.min(concurrency, tasks.length)).fill(0).map(async () => {
        while (taskIndex < tasks.length) {
          const current = taskIndex;
          taskIndex += 1;
          await tasks[current]();
        }
      });
      await Promise.all(workers);
      this.cache.set(key, atlas);
      if (failures > 0) {
        return {
          ok: false,
          atlas,
          key,
          error: {
            code: missing404 === failures ? "HTTP_404" : "NETWORK",
            stage: "ATLAS_PARTIAL",
            message: `${failures} tiles fallaron${missing404 ? ` (${missing404} sin publicar)` : ""}`,
          },
        };
      }
      return { ok: true, atlas, key, fromCache: false };
    }

    clearCache() {
      this.cache.clear();
      this.currentKey = "";
      this.requestVersion += 1;
      this.applyTextureSource(this.placeholder);
    }

    async setBasemapWithFallback(basemapId, tileZoom, projectionMode) {
      const requestId = ++this.requestVersion;
      const projectionKey = `${projectionMode}`;
      const key = `${basemapId}:${tileZoom}:${projectionKey}`;
      if (key === this.currentKey) return;

      const primary = BASEMAPS[basemapId] || BASEMAPS.osm;
      const queue = [primary.id];
      if (primary.fallback) queue.push(primary.fallback);

      this.renderState.setStatus("LOADING", "Cargando mapa...", "ok");
      let applied = false;
      let lastError = null;

      for (const candidate of queue) {
        const atlasResult = await this.buildAtlas(candidate, tileZoom);
        if (requestId !== this.requestVersion) return;

        if (atlasResult.ok) {
          this.applyTextureSource(atlasResult.atlas);
          this.currentKey = `${candidate}:${tileZoom}:${projectionKey}`;
          this.renderState.setBasemap(candidate);
          this.renderState.setStatus("READY", atlasResult.fromCache ? "Mapa cargado (cache)." : "Mapa cargado.", "ok");
          applied = true;
          break;
        }

        lastError = atlasResult.error || { code: "UNKNOWN", stage: "ATLAS", message: "Fallo de atlas" };
        this.renderState.pushError(lastError);
        this.renderState.setStatus("RETRYING", `Reintentando con proveedor alternativo (${candidate} falló)...`, "warn");
      }

      if (!applied) {
        this.applyTextureSource(this.placeholder);
        this.currentKey = `placeholder:${tileZoom}:${projectionKey}`;
        this.renderState.setStatus("DEGRADED", "Modo degradado: no se pudieron cargar tiles.", "error");
        this.renderState.pushError(lastError || { code: "NETWORK", stage: "FALLBACK", message: "No basemap available" });
      }
    }
  }

  function compileProgram(vs, fs) {
    const mkShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, mkShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    return program;
  }

  const globeVs = `
    attribute vec3 aPos;
    uniform mat4 uMvp;
    varying vec3 vPos;
    void main() {
      vPos = normalize(aPos);
      gl_Position = uMvp * vec4(aPos, 1.0);
    }
  `;

  const globeFs = `
    precision mediump float;
    varying vec3 vPos;
    uniform sampler2D uTex;
    uniform vec3 uSunDir;
    void main() {
      const float PI = 3.141592653589793;
      const float MAX_LAT = 1.4844222297453324;
      float lon = atan(vPos.z, vPos.x);
      float lat = asin(clamp(vPos.y, -1.0, 1.0));
      lat = clamp(lat, -MAX_LAT, MAX_LAT);
      float u = 0.5 + lon / (2.0 * PI);
      float v = 0.5 - log(tan(PI * 0.25 + lat * 0.5)) / (2.0 * PI);
      vec3 base = texture2D(uTex, vec2(fract(u), clamp(v, 0.0, 1.0))).rgb;
      vec3 n = normalize(vPos);
      vec3 l = normalize(uSunDir);
      vec3 vdir = normalize(vec3(0.0, 0.0, 1.6));

      float ndotl = dot(n, l);
      float dayMask = smoothstep(-0.10, 0.04, ndotl);
      float twilight = exp(-abs(ndotl) * 16.0);

      float diffuse = max(ndotl, 0.0);
      float softDiffuse = pow(diffuse, 0.75);
      float nightMask = 1.0 - smoothstep(-0.35, -0.02, ndotl);

      vec3 h = normalize(l + vdir);
      float spec = pow(max(dot(n, h), 0.0), 52.0) * 0.22;

      vec3 dayColor = base * (0.55 + 0.55 * softDiffuse) + vec3(spec);
      vec3 nightColor = base * 0.08 + vec3(0.012, 0.02, 0.04);
      vec3 color = mix(nightColor, dayColor, dayMask);
      color += vec3(0.95, 0.45, 0.12) * twilight * 0.08;
      color *= mix(0.78, 1.0, 1.0 - nightMask * 0.25);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const flatVs = `
    precision mediump float;
    attribute vec2 aPos;
    varying vec2 vPos;
    void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
      vPos = aPos;
    }
  `;

  const flatFsMercator = `
    precision mediump float;
    varying vec2 vPos;
    uniform sampler2D uTex;
    uniform float uScale;
    uniform vec2 uPan;
    uniform float uAspect;
    uniform float uLatAxisSign;
    void main() {
      vec2 clip = vPos;
      clip.x *= uAspect;
      vec2 plane = (clip - uPan) / uScale;
      float u = plane.x * 0.5 + 0.5;
      float v = 0.5 - plane.y * 0.5;
      float vY = mix(1.0 - v, v, step(0.0, uLatAxisSign));
      if (vY < 0.0 || vY > 1.0) {
        gl_FragColor = vec4(0.02, 0.04, 0.08, 1.0);
      } else {
        gl_FragColor = vec4(texture2D(uTex, vec2(fract(u), vY)).rgb, 1.0);
      }
    }
  `;

  const flatFsEquidistant = `
    precision mediump float;
    varying vec2 vPos;
    uniform float uScale;
    uniform vec2 uPan;
    uniform vec2 uCenter;
    uniform float uAspect;
    uniform sampler2D uTex;
    uniform float uLatAxisSign;
    void main() {
      const float PI = 3.141592653589793;
      const float MAX_LAT = 1.4844222297453324;
      const float EPS = 0.000001;

      vec2 clip = vPos;
      clip.x *= uAspect;
      vec2 plane = (clip - uPan) / uScale;
      float x = plane.x * PI;
      float y = plane.y * PI;
      float c = length(vec2(x, y));

      if (c > PI) {
        gl_FragColor = vec4(0.02, 0.04, 0.08, 1.0);
        return;
      }

      float lat0 = uCenter.y;
      float lon0 = uCenter.x;
      float sinLat0 = sin(lat0);
      float cosLat0 = cos(lat0);

      float lat;
      float lon;
      if (c < EPS) {
        lat = lat0;
        lon = lon0;
      } else {
        float sinc = sin(c);
        float cosc = cos(c);
        lat = asin(cosc * sinLat0 + (y * sinc * cosLat0) / c);
        lon = lon0 + atan(x * sinc, c * cosLat0 * cosc - y * sinLat0 * sinc);
      }

      lat = clamp(lat, -MAX_LAT, MAX_LAT);
      float u = fract((lon + PI) / (2.0 * PI));
      
      float unorientedLat = lat * uLatAxisSign;
      float mercV = 0.5 - log(tan(PI * 0.25 + unorientedLat * 0.5)) / (2.0 * PI);
      vec3 color = texture2D(uTex, vec2(u, clamp(mercV, 0.0, 1.0))).rgb;

      float latDeg = lat * 180.0 / PI;
      float lonDeg = lon * 180.0 / PI;
      float latMod = mod(latDeg, 15.0);
      float lonMod = mod(lonDeg, 15.0);
      float latLine = min(latMod, 15.0 - latMod);
      float lonLine = min(lonMod, 15.0 - lonMod);
      
      float degPerPixel = 180.0 / (uScale * 300.0);
      if (latLine < degPerPixel || lonLine < degPerPixel) {
        color = mix(color, vec3(0.5, 0.7, 0.9), 0.35);
      }
      
      if (c > PI - 0.005 / uScale) {
        color = mix(color, vec3(0.3, 0.5, 0.7), 0.8);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const overlayVs = `
    attribute vec3 aPos;
    uniform mat4 uMvp;
    uniform vec4 uColor;
    varying vec4 vColor;
    void main() {
      vColor = uColor;
      gl_Position = uMvp * vec4(aPos, 1.0);
      gl_PointSize = 8.0;
    }
  `;

  const overlayFs = `
    precision mediump float;
    varying vec4 vColor;
    void main() { gl_FragColor = vColor; }
  `;

  const globeProgram = compileProgram(globeVs, globeFs);
  const flatMercatorProgram = compileProgram(flatVs, flatFsMercator);
  const flatEquidistantProgram = compileProgram(flatVs, flatFsEquidistant);
  const overlayProgram = compileProgram(overlayVs, overlayFs);

  function buildSphere(segments = 96, rings = 64) {
    const pos = [];
    const idx = [];
    for (let y = 0; y <= rings; y++) {
      const v = y / rings;
      const phi = v * Math.PI;
      for (let x = 0; x <= segments; x++) {
        const u = x / segments;
        const t = u * Math.PI * 2;
        pos.push(Math.sin(phi) * Math.cos(t), Math.cos(phi), Math.sin(phi) * Math.sin(t));
      }
    }
    for (let y = 0; y < rings; y++) {
      for (let x = 0; x < segments; x++) {
        const i = y * (segments + 1) + x;
        idx.push(i, i + segments + 1, i + 1, i + 1, i + segments + 1, i + segments + 2);
      }
    }
    return { pos: new Float32Array(pos), idx: new Uint16Array(idx) };
  }

  const sphere = buildSphere();
  const sphereVbo = gl.createBuffer();
  const sphereIbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVbo);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.pos, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIbo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.idx, gl.STATIC_DRAW);

  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const quadVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const renderState = new RenderState();
  const tileProvider = new TileProvider(gl, texture, renderState);
  let basemapRequestInFlight = false;
  let nextBasemapRetryAt = 0;

  const cam = {
    yaw: 0,
    viewPitch: 0,
    zoom: -2.6,
    zoomTarget: -2.6,
    velYaw: 0,
    velViewPitch: 0,
    flatScale: 1,
    flatScaleTarget: 1,
    flatPanX: 0,
    flatPanY: 0,
  };

  const world = {
    projection: "globe",
    basemap: "tudex",
    routeMode: false,
    routeFrom: null,
    routeTo: null,
    route: [],
    markers: [],
    selectedMarker: null,
    showMarkers: true,
    showRoutes: true,
    showGraticule: false,
    showSun: true,
    astronomicalMode: false,
    sunLat: 0,
    sunLon: 0,
    planets: [],
    latAxisSign: 1,
    equiCenterLat: 0,
    equiCenterLon: 0,
  };

  const latAxisSignForProjection = () => (world.projection === "globe" ? 1 : world.latAxisSign);
  const orientLat = (lat) => lat * latAxisSignForProjection();
  const unorientLat = (lat) => lat * latAxisSignForProjection();
  const updateLatAxisButton = () => {
    if (!ui.flipLatAxis) return;
    const reversed = world.latAxisSign < 0;
    ui.flipLatAxis.classList.toggle("active", reversed);
    ui.flipLatAxis.title = reversed ? "Eje Sur-Norte activo (click para volver)" : "Eje Norte-Sur activo (click para invertir)";
  };

  const mapEngine = {
    setProjection(mode) {
      if (!["globe", "mercator", "equidistant"].includes(mode)) return;
      world.projection = mode;
      renderState.setProjection(mode);
      if (mode !== "globe") {
        cam.velYaw = 0;
      }
    },
    setBasemap(id) {
      let resolved = BASEMAPS[id] ? id : "tudex";
      if (resolved === "osm") {
        resolved = "topo";
        renderState.setStatus("RETRYING", "OSM directo puede bloquear CORS/429 en WebGL; usando Topográfico.", "warn");
      }
      world.basemap = resolved;
      if (ui.basemapSelect && ui.basemapSelect.value !== resolved) ui.basemapSelect.value = resolved;
      renderState.setBasemap(world.basemap);
    },
    getHealth() {
      return {
        textureStatus: renderState.textureStatus,
        provider: renderState.activeBasemap,
        projection: renderState.activeProjection,
        errors: [...renderState.errors],
      };
    },
  };
  window.MapEngine = mapEngine;
  window.TileProvider = tileProvider;

  const I = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const mul = (a, b) => {
    const r = new Array(16).fill(0);
    for (let c = 0; c < 4; c++) for (let r0 = 0; r0 < 4; r0++) for (let k = 0; k < 4; k++) r[c * 4 + r0] += a[k * 4 + r0] * b[c * 4 + k];
    return r;
  };
  const perspective = (fov, aspect, near, far) => {
    const t = Math.tan(fov * 0.5);
    return [1 / (aspect * t), 0, 0, 0, 0, 1 / t, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0];
  };
  const rotY = (a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  };
  const rotX = (a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  };
  const rotZ = (a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };
  const trans = (z) => {
    const m = I();
    m[14] = z;
    return m;
  };

  const mercVFromLat = (lat) => {
    const clamped = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, lat));
    const r = clamped * DEG2RAD;
    return 0.5 - Math.log(Math.tan(Math.PI / 4 + r / 2)) / (2 * Math.PI);
  };
  const latFromMercV = (v) => Math.atan(Math.sinh(Math.PI * (1 - 2 * v))) * RAD2DEG;
  const clampLon = (lon) => {
    let v = lon;
    while (v > 180) v -= 360;
    while (v < -180) v += 360;
    return v;
  };
  const jdFromDate = (date) => date.getTime() / 86400000 + 2440587.5;
  const gmstDegrees = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const theta = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000;
    return ((theta % 360) + 360) % 360;
  };

  function subsolarPoint(date = new Date()) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const Mrad = M * DEG2RAD;
    const C = Math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T))
      + Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T)
      + Math.sin(3 * Mrad) * 0.000289;
    const trueLong = L0 + C;
    const omega = 125.04 - 1934.136 * T;
    const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG2RAD);
    const epsilon0 = 23 + (26 + ((21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60)) / 60;
    const epsilon = epsilon0 + 0.00256 * Math.cos(omega * DEG2RAD);

    const lambdaRad = lambda * DEG2RAD;
    const epsilonRad = epsilon * DEG2RAD;
    const decl = Math.asin(Math.sin(epsilonRad) * Math.sin(lambdaRad)) * RAD2DEG;

    const y = Math.tan(epsilonRad / 2) ** 2;
    const eqTime = 4 * RAD2DEG * (
      y * Math.sin(2 * L0 * DEG2RAD)
      - 2 * 0.016708634 * Math.sin(Mrad)
      + 4 * 0.016708634 * y * Math.sin(Mrad) * Math.cos(2 * L0 * DEG2RAD)
      - 0.5 * y * y * Math.sin(4 * L0 * DEG2RAD)
      - 1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * Mrad)
    );

    const minutesUtc = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    let subsolarLon = (720 - minutesUtc - eqTime) / 4;
    while (subsolarLon > 180) subsolarLon -= 360;
    while (subsolarLon < -180) subsolarLon += 360;
    return { lat: decl, lon: subsolarLon };
  }

  function eclipticLon(body, d) {
    const meanMotion = 360 / body.periodDays;
    return (body.L0 + meanMotion * d) % 360;
  }

  function computePlanetSubpoints(date = new Date()) {
    const jd = jdFromDate(date);
    const d = jd - 2451545.0;
    const eps = 23.439291 * DEG2RAD;
    const earthLon = eclipticLon({ periodDays: 365.256363004, L0: 100.466457 }, d) * DEG2RAD;
    const ex = Math.cos(earthLon);
    const ey = Math.sin(earthLon);
    const gmst = gmstDegrees(jd);

    return PLANETS.map((p) => {
      const lp = eclipticLon(p, d) * DEG2RAD;
      const px = Math.cos(lp);
      const py = Math.sin(lp);
      const gx = px - ex;
      const gy = py - ey;
      const rx = gx;
      const ry = gy * Math.cos(eps);
      const rz = gy * Math.sin(eps);
      const ra = Math.atan2(ry, rx);
      const dec = Math.atan2(rz, Math.hypot(rx, ry));
      const raDeg = ((ra * RAD2DEG) + 360) % 360;
      const gha = clampLon(gmst - raDeg);
      const subLon = clampLon(-gha);
      const subLat = dec * RAD2DEG;
      return { key: p.key, label: p.label, color: p.color, lat: subLat, lon: subLon };
    });
  }

  function updateAstronomicalState() {
    const now = new Date();
    const sun = subsolarPoint(now);
    world.sunLat = sun.lat;
    world.sunLon = sun.lon;
    world.planets = computePlanetSubpoints(now);

    if (!ui.astroLegend) return;
    if (!(world.astronomicalMode && world.projection === "globe")) {
      ui.astroLegend.classList.add("hidden");
      return;
    }
    const header = `Modo astronómico\nSol: ${sun.lat.toFixed(2)}°, ${sun.lon.toFixed(2)}°`;
    const lines = world.planets.map((p) => `${p.label}: ${p.lat.toFixed(1)}°, ${p.lon.toFixed(1)}°`);
    ui.astroLegend.textContent = `${header}\n${lines.join("\n")}`;
    ui.astroLegend.classList.remove("hidden");
  }

  function latLonToSphere(lat, lon, radius = 1.01) {
    const latR = lat * DEG2RAD;
    const lonR = lon * DEG2RAD;
    return [radius * Math.cos(latR) * Math.cos(lonR), radius * Math.sin(latR), radius * Math.cos(latR) * Math.sin(lonR)];
  }

  function globeModelMatrix() {
    const southUpRotation = world.latAxisSign < 0 ? Math.PI : 0;
    return mul(rotZ(EARTH_AXIAL_TILT_RAD + southUpRotation), rotY(cam.yaw));
  }

  function projectFlat(lat, lon, projection) {
    if (projection === "equidistant") {
      const latR = orientLat(lat) * DEG2RAD;
      const lonR = lon * DEG2RAD;
      const lat0 = orientLat(world.equiCenterLat) * DEG2RAD;
      const lon0 = world.equiCenterLon * DEG2RAD;
      const dlonRaw = lonR - lon0;
      const dlon = ((dlonRaw + Math.PI) % (2 * Math.PI)) - Math.PI;
      const sinLat = Math.sin(latR);
      const cosLat = Math.cos(latR);
      const sinLat0 = Math.sin(lat0);
      const cosLat0 = Math.cos(lat0);
      const cosc = Math.max(-1, Math.min(1, sinLat0 * sinLat + cosLat0 * cosLat * Math.cos(dlon)));
      const c = Math.acos(cosc);
      let x = 0;
      let y = 0;
      if (c > 1e-9) {
        const k = c / Math.sin(c);
        x = k * cosLat * Math.sin(dlon);
        y = k * (cosLat0 * sinLat - sinLat0 * cosLat * Math.cos(dlon));
      }
      const bx = x / Math.PI;
      const by = y / Math.PI;
      const clipX = bx * cam.flatScale + cam.flatPanX;
      const clipY = by * cam.flatScale + cam.flatPanY;
      const aspect = canvas.width / canvas.height;
      return [clipX / aspect, clipY, 0];
    }
    const u = (lon + 180) / 360;
    const orientedLat = orientLat(lat);
    const v = projection === "mercator" ? mercVFromLat(orientedLat) : (90 - orientedLat) / 180;
    const bx = u * 2 - 1;
    const by = 1 - 2 * v;
    const aspect = canvas.width / canvas.height;
    return [(bx * cam.flatScale + cam.flatPanX) / aspect, by * cam.flatScale + cam.flatPanY, 0];
  }

  function currentMvp() {
    const aspect = canvas.width / canvas.height;
    return mul(
      perspective(Math.PI / 3, aspect, 0.1, 50),
      mul(trans(cam.zoom), mul(rotX(cam.viewPitch), globeModelMatrix())),
    );
  }

  function pickLatLon(clientX, clientY) {
    if (world.projection === "globe") return pickGlobe(clientX, clientY);
    return pickFlat(clientX, clientY);
  }

  function pickFlat(clientX, clientY) {
    const aspect = canvas.width / canvas.height;
    const nx = (2 * clientX) / canvas.clientWidth - 1;
    const ny = 1 - (2 * clientY) / canvas.clientHeight;
    const clipX = nx * aspect;
    const clipY = ny;
    const bx = (clipX - cam.flatPanX) / cam.flatScale;
    const by = (clipY - cam.flatPanY) / cam.flatScale;
    if (bx < -1 || bx > 1 || by < -1 || by > 1) return null;
    if (world.projection === "equidistant") {
      const x = bx * Math.PI;
      const y = by * Math.PI;
      const c = Math.hypot(x, y);
      if (c > Math.PI) return null;
      const lat0 = orientLat(world.equiCenterLat) * DEG2RAD;
      const lon0 = world.equiCenterLon * DEG2RAD;
      let latR;
      let lonR;
      if (c < 1e-9) {
        latR = lat0;
        lonR = lon0;
      } else {
        const sinc = Math.sin(c);
        const cosc = Math.cos(c);
        latR = Math.asin(cosc * Math.sin(lat0) + (y * sinc * Math.cos(lat0)) / c);
        lonR = lon0 + Math.atan2(
          x * sinc,
          c * Math.cos(lat0) * cosc - y * Math.sin(lat0) * sinc,
        );
      }
      let lon = lonR * RAD2DEG;
      lon = ((lon + 540) % 360) - 180;
      return { lat: unorientLat(latR * RAD2DEG), lon };
    }
    const u = (bx + 1) * 0.5;
    const v = (1 - by) * 0.5;
    const lon = u * 360 - 180;
    const latOriented = world.projection === "mercator" ? latFromMercV(v) : 90 - v * 180;
    const lat = unorientLat(latOriented);
    return { lat, lon };
  }

  function mulVec4(m, v) {
    return [
      m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
      m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
      m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
      m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3],
    ];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function normalize(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  function inverse4(m) {
    const inv = new Array(16);
    inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (!det) return null;
    det = 1 / det;
    for (let i = 0; i < 16; i++) inv[i] *= det;
    return inv;
  }

  function pickGlobe(clientX, clientY) {
    const mvp = currentMvp();
    const inv = inverse4(mvp);
    if (!inv) return null;
    const x = (2 * clientX) / canvas.clientWidth - 1;
    const y = 1 - (2 * clientY) / canvas.clientHeight;
    const near = mulVec4(inv, [x, y, -1, 1]);
    const far = mulVec4(inv, [x, y, 1, 1]);
    const n = [near[0] / near[3], near[1] / near[3], near[2] / near[3]];
    const f = [far[0] / far[3], far[1] / far[3], far[2] / far[3]];
    const d = normalize([f[0] - n[0], f[1] - n[1], f[2] - n[2]]);
    const b = 2 * dot(n, d);
    const c = dot(n, n) - 1;
    const disc = b * b - 4 * c;
    if (disc < 0) return null;
    const t = (-b - Math.sqrt(disc)) / 2;
    const p = [n[0] + d[0] * t, n[1] + d[1] * t, n[2] + d[2] * t];
    return { lat: Math.asin(p[1]) * RAD2DEG, lon: Math.atan2(p[2], p[0]) * RAD2DEG };
  }

  function projectToScreen(marker) {
    if (world.projection === "globe") {
      const p = latLonToSphere(marker.lat, marker.lon, 1.03);
      const mvp = currentMvp();
      const cx = mvp[0] * p[0] + mvp[4] * p[1] + mvp[8] * p[2] + mvp[12];
      const cy = mvp[1] * p[0] + mvp[5] * p[1] + mvp[9] * p[2] + mvp[13];
      const cw = mvp[3] * p[0] + mvp[7] * p[1] + mvp[11] * p[2] + mvp[15];
      if (cw <= 0) return null;
      const nx = cx / cw;
      const ny = cy / cw;
      return { x: (nx * 0.5 + 0.5) * canvas.clientWidth, y: (1 - (ny * 0.5 + 0.5)) * canvas.clientHeight };
    }
    const p = projectFlat(marker.lat, marker.lon, world.projection);
    return { x: (p[0] * 0.5 + 0.5) * canvas.clientWidth, y: (1 - (p[1] * 0.5 + 0.5)) * canvas.clientHeight };
  }

  let lastPopupPos = null;
  function renderPopup() {
    if (!world.selectedMarker) {
      ui.popup.classList.add("hidden");
      lastPopupPos = null;
      return;
    }
    const pos = projectToScreen(world.selectedMarker);
    if (!pos) return;
    ui.popupContent.textContent = world.selectedMarker.label || `${world.selectedMarker.lat.toFixed(5)}, ${world.selectedMarker.lon.toFixed(5)}`;
    if (!lastPopupPos || Math.hypot(pos.x - lastPopupPos.x, pos.y - lastPopupPos.y) > 1.5) {
      ui.popup.style.left = `${pos.x + 12}px`;
      ui.popup.style.top = `${pos.y + 12}px`;
      lastPopupPos = pos;
    }
    ui.popup.classList.remove("hidden");
  }

  function zoomToTileZoom() {
    if (world.projection === "globe") {
      if (cam.zoomTarget > -1.2) return 5;
      if (cam.zoomTarget > -2.0) return 4;
      if (cam.zoomTarget > -3.0) return 3;
      return 2;
    }
    if (cam.flatScaleTarget > 18) return 5;
    if (cam.flatScaleTarget > 7) return 4;
    if (cam.flatScaleTarget > 2.5) return 3;
    return 2;
  }

  function drawBaseMap() {
    if (world.projection === "globe") {
      gl.useProgram(globeProgram);
      const aPos = gl.getAttribLocation(globeProgram, "aPos");
      const uMvp = gl.getUniformLocation(globeProgram, "uMvp");
      gl.bindBuffer(gl.ARRAY_BUFFER, sphereVbo);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIbo);
      gl.uniformMatrix4fv(uMvp, false, new Float32Array(currentMvp()));
      const sun = subsolarPoint(new Date());
      world.sunLat = sun.lat;
      world.sunLon = sun.lon;
      const sunDir = latLonToSphere(sun.lat, sun.lon, 1.0);
      gl.uniform3f(gl.getUniformLocation(globeProgram, "uSunDir"), sunDir[0], sunDir[1], sunDir[2]);
      gl.drawElements(gl.TRIANGLES, sphere.idx.length, gl.UNSIGNED_SHORT, 0);
      return;
    }
    const program = world.projection === "mercator" ? flatMercatorProgram : flatEquidistantProgram;
    const aspect = canvas.width / canvas.height;
    gl.useProgram(program);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(gl.getUniformLocation(program, "uScale"), cam.flatScale);
    gl.uniform2f(gl.getUniformLocation(program, "uPan"), cam.flatPanX, cam.flatPanY);
    gl.uniform1f(gl.getUniformLocation(program, "uAspect"), aspect);
    gl.uniform1f(gl.getUniformLocation(program, "uLatAxisSign"), world.latAxisSign);
    if (world.projection === "equidistant") {
      gl.uniform2f(
        gl.getUniformLocation(program, "uCenter"),
        world.equiCenterLon * DEG2RAD,
        orientLat(world.equiCenterLat) * DEG2RAD,
      );
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function drawOverlay() {
    gl.useProgram(overlayProgram);
    const aPos = gl.getAttribLocation(overlayProgram, "aPos");
    const uMvp = gl.getUniformLocation(overlayProgram, "uMvp");
    const uColor = gl.getUniformLocation(overlayProgram, "uColor");
    const mvp = world.projection === "globe" ? currentMvp() : I();
    gl.uniformMatrix4fv(uMvp, false, new Float32Array(mvp));

    const draw = (pts, mode, color) => {
      if (!pts.length) return;
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.uniform4f(uColor, color[0], color[1], color[2], color[3]);
      gl.drawArrays(mode, 0, pts.length / 3);
    };

    if (world.showRoutes && world.route.length > 1) {
      const pts = [];
      for (const p of world.route) {
        if (world.projection === "globe") pts.push(...latLonToSphere(p.lat, p.lon, 1.006));
        else pts.push(...projectFlat(p.lat, p.lon, world.projection));
      }
      draw(pts, gl.LINE_STRIP, [0.0, 0.85, 1.0, 1.0]);
    }

    if (world.showMarkers && world.markers.length) {
      const pts = [];
      for (const m of world.markers) {
        if (world.projection === "globe") pts.push(...latLonToSphere(m.lat, m.lon, 1.02));
        else pts.push(...projectFlat(m.lat, m.lon, world.projection));
      }
      draw(pts, gl.POINTS, [1.0, 0.32, 0.2, 1.0]);
    }

    if (world.projection === "globe" && world.showSun) {
      const sunPt = latLonToSphere(world.sunLat, world.sunLon, 1.035);
      draw(sunPt, gl.POINTS, [1.0, 0.95, 0.3, 1.0]);
    }
    if (world.projection === "globe" && world.astronomicalMode && world.planets.length) {
      for (const p of world.planets) {
        const pt = latLonToSphere(p.lat, p.lon, 1.03);
        draw(pt, gl.POINTS, p.color);
      }
    }

    if (world.showGraticule) {
      const pts = [];
      for (let lat = -80; lat <= 80; lat += 20) {
        for (let lon = -180; lon <= 180; lon += 6) {
          if (world.projection === "globe") pts.push(...latLonToSphere(lat, lon, 1.004));
          else pts.push(...projectFlat(lat, lon, world.projection));
        }
      }
      draw(pts, gl.POINTS, [0.7, 0.82, 1.0, 0.55]);
    }
  }

  function updateMotion() {
    if (world.projection === "globe") {
      if (!dragging) {
        cam.yaw += cam.velYaw;
        cam.viewPitch += cam.velViewPitch;
        cam.velYaw *= 0.94;
        cam.velViewPitch *= 0.9;
        if (Math.abs(cam.velYaw) < 1e-5) cam.velYaw = 0;
        if (Math.abs(cam.velViewPitch) < 1e-5) cam.velViewPitch = 0;
      }
      cam.viewPitch = Math.max(-1.1, Math.min(1.1, cam.viewPitch));
      cam.zoom += (cam.zoomTarget - cam.zoom) * 0.16;
    } else {
      cam.flatScale += (cam.flatScaleTarget - cam.flatScale) * 0.2;
      if (world.projection === "equidistant") {
        cam.flatPanX *= 0.82;
        cam.flatPanY *= 0.82;
        if (Math.abs(cam.flatPanX) < 1e-6) cam.flatPanX = 0;
        if (Math.abs(cam.flatPanY) < 1e-6) cam.flatPanY = 0;
      }
    }
  }

  async function ensureBasemap() {
    if (basemapRequestInFlight) return;
    if (Date.now() < nextBasemapRetryAt) return;
    basemapRequestInFlight = true;
    const tileZoom = zoomToTileZoom();
    try {
      await tileProvider.setBasemapWithFallback(world.basemap, tileZoom, world.projection);
      if (tileProvider.currentKey.startsWith("placeholder:")) {
        nextBasemapRetryAt = Date.now() + 8000;
      } else if (renderState.lastTextureError?.code === "HTTP_404") {
        nextBasemapRetryAt = Date.now() + 60000;
      } else {
        nextBasemapRetryAt = 0;
      }
    } finally {
      basemapRequestInFlight = false;
    }
  }

  function render() {
    updateMotion();
    updateAstronomicalState();
    const expected = `${renderState.activeBasemap}:${zoomToTileZoom()}:${world.projection}`;
    if (expected !== tileProvider.currentKey) ensureBasemap();

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.01, 0.02, 0.06, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawBaseMap();
    drawOverlay();
    renderPopup();
    requestAnimationFrame(render);
  }

  function resetRuntime() {
    world.routeMode = false;
    world.route = [];
    world.routeFrom = null;
    world.routeTo = null;
    world.markers = [];
    world.selectedMarker = null;
    ui.routeInfo.textContent = "";
    ui.routeFromInput.value = "";
    ui.routeToInput.value = "";
    ui.routePanel.classList.add("hidden");
    ui.popup.classList.add("hidden");
    cam.yaw = 0;
    cam.viewPitch = 0;
    cam.zoom = -2.6;
    cam.zoomTarget = -2.6;
    cam.flatScale = 1;
    cam.flatScaleTarget = 1;
    cam.flatPanX = 0;
    cam.flatPanY = 0;
    tileProvider.clearCache();
    renderState.setStatus("INIT", "Mapa restaurado. Re-cargando tiles...", "ok");
    ensureBasemap();
  }

  async function geocode(query) {
    const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=7`;
    return (await fetch(u, { headers: { Accept: "application/json" } })).json();
  }
  async function route(from, to) {
    const u = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;
    return (await fetch(u)).json();
  }

  function flyTo(lat, lon) {
    if (world.projection === "globe") {
      cam.yaw = -(lon * DEG2RAD);
      cam.viewPitch = Math.max(-1.0, Math.min(1.0, lat * DEG2RAD * 0.75));
    } else if (world.projection === "equidistant") {
      world.equiCenterLat = Math.max(-85, Math.min(85, lat));
      world.equiCenterLon = ((lon + 540) % 360) - 180;
      cam.flatPanX = 0;
      cam.flatPanY = 0;
    } else {
      const p = projectFlat(lat, lon, world.projection);
      cam.flatPanX = -p[0];
      cam.flatPanY = -p[1];
    }
  }

  let searchTimer = null;
  ui.searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    const q = ui.searchInput.value.trim();
    if (!q) return (ui.searchResults.style.display = "none");
    searchTimer = setTimeout(async () => {
      const results = await geocode(q);
      ui.searchResults.innerHTML = "";
      for (const item of results) {
        const row = document.createElement("div");
        row.className = "result-item";
        row.textContent = item.display_name;
        row.onclick = () => {
          const marker = { lat: parseFloat(item.lat), lon: parseFloat(item.lon), label: item.display_name };
          world.markers.push(marker);
          world.selectedMarker = marker;
          flyTo(marker.lat, marker.lon);
          ui.searchInput.value = marker.label;
          ui.searchResults.style.display = "none";
          if (world.routeMode) {
            if (!world.routeFrom) {
              world.routeFrom = marker;
              ui.routeFromInput.value = marker.label;
            } else {
              world.routeTo = marker;
              ui.routeToInput.value = marker.label;
            }
          }
        };
        ui.searchResults.appendChild(row);
      }
      ui.searchResults.style.display = results.length ? "block" : "none";
    }, 250);
  });

  document.addEventListener("click", (e) => {
    if (!ui.searchResults.contains(e.target) && e.target !== ui.searchInput) ui.searchResults.style.display = "none";
  });

  ui.routeToggle.onclick = () => {
    world.routeMode = !world.routeMode;
    ui.routePanel.classList.toggle("hidden", !world.routeMode);
  };

  ui.routeBuild.onclick = async () => {
    if (!world.routeFrom || !world.routeTo) return (ui.routeInfo.textContent = "Selecciona origen y destino.");
    const data = await route(world.routeFrom, world.routeTo);
    if (!data.routes?.length) return (ui.routeInfo.textContent = "No se pudo calcular la ruta.");
    const r = data.routes[0];
    world.route = r.geometry.coordinates.map(([lon, lat]) => ({ lat, lon }));
    ui.routeInfo.textContent = `Distancia: ${(r.distance / 1000).toFixed(1)} km | Tiempo: ${(r.duration / 60).toFixed(0)} min`;
  };

  ui.zoomIn.onclick = () => {
    if (world.projection === "globe") cam.zoomTarget = Math.min(-0.65, cam.zoomTarget + 0.3);
    else cam.flatScaleTarget = Math.min(80, cam.flatScaleTarget * 1.3);
  };
  ui.zoomOut.onclick = () => {
    if (world.projection === "globe") cam.zoomTarget = Math.max(-8, cam.zoomTarget - 0.3);
    else cam.flatScaleTarget = Math.max(0.45, cam.flatScaleTarget / 1.3);
  };
  ui.resetNorth.onclick = () => {
    cam.yaw = 0;
    cam.viewPitch = 0;
    cam.velYaw = 0;
    cam.velViewPitch = 0;
    cam.flatPanX = 0;
    cam.flatPanY = 0;
  };
  if (ui.flipLatAxis) {
    ui.flipLatAxis.onclick = () => {
      world.latAxisSign *= -1;
      updateLatAxisButton();
    };
  }
  ui.locateMe.onclick = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const marker = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Mi ubicación" };
      world.markers.push(marker);
      world.selectedMarker = marker;
      flyTo(marker.lat, marker.lon);
    });
  };

  ui.layerMarkers.onchange = () => { world.showMarkers = ui.layerMarkers.checked; };
  ui.layerRoutes.onchange = () => { world.showRoutes = ui.layerRoutes.checked; };
  ui.layerGraticule.onchange = () => { world.showGraticule = ui.layerGraticule.checked; };

  ui.basemapSelect.onchange = () => {
    mapEngine.setBasemap(ui.basemapSelect.value);
    ensureBasemap();
  };

  ui.projectionSelect.onchange = () => {
    mapEngine.setProjection(ui.projectionSelect.value);
    ensureBasemap();
  };
  const toggleAstronomicalMode = () => {
    world.astronomicalMode = !world.astronomicalMode;
    if (ui.astroMode) {
      ui.astroMode.classList.toggle("active", world.astronomicalMode);
      ui.astroMode.textContent = world.astronomicalMode ? "Modo astronómico: ON" : "Modo astronómico";
    }
    if (ui.astroModeFab) ui.astroModeFab.classList.toggle("active", world.astronomicalMode);
    if (world.astronomicalMode) {
      mapEngine.setProjection("globe");
      ui.projectionSelect.value = "globe";
    }
  };
  if (ui.astroMode) {
    ui.astroMode.onclick = () => {
      toggleAstronomicalMode();
    };
  }
  if (ui.astroModeFab) {
    ui.astroModeFab.onclick = () => {
      toggleAstronomicalMode();
    };
  }

  ui.resetMap.onclick = () => resetRuntime();

  let dragging = false;
  let lx = 0;
  let ly = 0;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lx = e.clientX;
    ly = e.clientY;
    cam.velYaw = 0;
    cam.velViewPitch = 0;
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    if (world.projection === "globe") {
      const spinStep = -dx * 0.005;
      const pitchStep = dy * 0.0035;
      cam.yaw += spinStep;
      cam.viewPitch += pitchStep;
      cam.viewPitch = Math.max(-1.1, Math.min(1.1, cam.viewPitch));
      cam.velYaw = spinStep * 0.25;
      cam.velViewPitch = pitchStep * 0.2;
    } else if (world.projection === "equidistant") {
      const lonScale = 180 / Math.max(0.4, cam.flatScale);
      const latScale = 90 / Math.max(0.4, cam.flatScale);
      world.equiCenterLon = ((world.equiCenterLon - (dx / canvas.clientWidth) * lonScale + 540) % 360) - 180;
      world.equiCenterLat = Math.max(-85, Math.min(85, world.equiCenterLat + (dy / canvas.clientHeight) * latScale));
    } else {
      cam.flatPanX += (dx / canvas.clientWidth) * 2;
      cam.flatPanY -= (dy / canvas.clientHeight) * 2;
    }
    lx = e.clientX;
    ly = e.clientY;
  });

  canvas.addEventListener("wheel", (e) => {
    if (world.projection === "globe") {
      cam.zoomTarget -= e.deltaY * 0.0015;
      cam.zoomTarget = Math.max(-8.0, Math.min(-0.65, cam.zoomTarget));
    } else {
      const factor = Math.exp(e.deltaY * 0.0012);
      cam.flatScaleTarget = Math.max(0.45, Math.min(80, cam.flatScaleTarget * factor));
    }
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("dblclick", () => {
    if (world.projection === "globe") cam.zoomTarget = Math.min(-0.65, cam.zoomTarget + 0.45);
    else cam.flatScaleTarget = Math.min(80, cam.flatScaleTarget * 1.35);
  });

  canvas.addEventListener("click", (e) => {
    const ll = pickLatLon(e.clientX, e.clientY);
    if (!ll) return;
    const marker = { lat: ll.lat, lon: ll.lon, label: `Lat ${ll.lat.toFixed(5)}, Lon ${ll.lon.toFixed(5)}` };
    world.markers.push(marker);
    world.selectedMarker = marker;
    if (world.routeMode) {
      if (!world.routeFrom) {
        world.routeFrom = marker;
        ui.routeFromInput.value = marker.label;
      } else if (!world.routeTo) {
        world.routeTo = marker;
        ui.routeToInput.value = marker.label;
      }
    }
  });

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);
  resize();

  renderState.setProjection(world.projection);
  renderState.setBasemap(world.basemap);
  if (ui.basemapSelect) ui.basemapSelect.value = world.basemap;
  updateLatAxisButton();
  renderState.setStatus("LOADING", "Cargando mapa...", "ok");
  ensureBasemap().finally(() => requestAnimationFrame(render));
})();
