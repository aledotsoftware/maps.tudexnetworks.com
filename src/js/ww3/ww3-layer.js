/**
 * WW3 Infographic - Layer Renderer v3
 * Severity-based color scale for markers.
 * Region colors only for theater polygons and panel grouping.
 */

const WW3Layer = {
  conflictLayers: {},
  theaterLayers: {},
  connectionLines: [],
  legendControl: null,

  // Severity color scale: red (worst) → orange → yellow → white (least)
  SEVERITY_COLORS: {
    5: "#FF1744",   // Guerra Total — bright red
    4: "#FF5722",   // Conflicto Armado — deep orange-red
    3: "#FF9100",   // Conflicto Latente — orange
    2: "#FFD740",   // Tensión Fronteriza — amber/yellow
    1: "#E0E0E0"    // Tensión Diplomática — near-white
  },

  SEVERITY_LABELS: {
    1: "Tensión Diplomática",
    2: "Tensión Fronteriza",
    3: "Conflicto Latente",
    4: "Conflicto Armado Activo",
    5: "Guerra Total"
  },

  SEVERITY_PULSE_SIZE: {
    1: 16, 2: 20, 3: 26, 4: 32, 5: 40
  },

  init: function (map) {
    this.map = map;
    this.layerGroup = L.layerGroup().addTo(map);
    this._renderTheaters();
    this._renderConnectionLines();
    this._renderConflictMarkers();
    this._addLegend();
    this._addInfoPanel();
    this._addTopBarCounter();
  },

  _getSeverityColor: function (severity) {
    return this.SEVERITY_COLORS[severity] || "#E0E0E0";
  },

  _createPulseIcon: function (conflict) {
    const color = this._getSeverityColor(conflict.severity);
    const size = this.SEVERITY_PULSE_SIZE[conflict.severity];
    const innerSize = Math.round(size * 0.5);

    return L.divIcon({
      className: 'ww3-marker-wrapper',
      iconSize: [size * 2.5, size * 2.5],
      iconAnchor: [size * 1.25, size * 1.25],
      html: `
        <div class="ww3-pulse-marker" style="--pulse-color: ${color}; --pulse-size: ${size}px;">
          <div class="ww3-pulse-ring ww3-pulse-ring-1"></div>
          <div class="ww3-pulse-ring ww3-pulse-ring-2"></div>
          ${conflict.severity >= 4 ? '<div class="ww3-pulse-ring ww3-pulse-ring-3"></div>' : ''}
          <div class="ww3-marker-core" style="width:${innerSize}px;height:${innerSize}px;background:${color};">
            <i class="fa-solid ${WW3_REGIONS[conflict.region].icon}" style="font-size:${Math.max(9, innerSize - 8)}px;"></i>
          </div>
        </div>
      `
    });
  },

  _createPopupContent: function (conflict) {
    const region = WW3_REGIONS[conflict.region];
    const sevColor = this._getSeverityColor(conflict.severity);
    const severityLabel = this.SEVERITY_LABELS[conflict.severity];

    const severityBars = Array.from({ length: 5 }, (_, i) =>
      `<span class="ww3-sev-bar ${i < conflict.severity ? 'active' : ''}" style="${i < conflict.severity ? `background:${sevColor}` : ''}"></span>`
    ).join('');

    const linkedConflicts = conflict.crossLinks.map(id => {
      const linked = WW3_CONFLICTS.find(c => c.id === id);
      return linked ? `<span class="ww3-cross-link" onclick="WW3Layer.flyToConflict('${id}')">${linked.name}</span>` : '';
    }).filter(Boolean).join('');

    return `
      <div class="ww3-popup" style="--region-color: ${sevColor}">
        <div class="ww3-popup-header">
          <div class="ww3-popup-region-tag" style="background:${region.color}">
            <i class="fa-solid ${region.icon}"></i> ${region.name}
          </div>
          <h3 class="ww3-popup-title">${conflict.name}</h3>
          <div class="ww3-popup-status" style="border-color:${sevColor};color:${sevColor}">
            <i class="fa-solid fa-circle-exclamation"></i> ${conflict.status}
          </div>
        </div>
        <div class="ww3-popup-body">
          <div class="ww3-severity-row">
            <span class="ww3-severity-label">Severidad:</span>
            <div class="ww3-severity-bars">${severityBars}</div>
            <span class="ww3-severity-text" style="color:${sevColor}">${severityLabel}</span>
          </div>
          <div class="ww3-factions">
            <div class="ww3-faction ww3-faction-1">
              <span class="ww3-faction-label"><i class="fa-solid fa-flag"></i> Bando 1</span>
              <span class="ww3-faction-name">${conflict.factions.side1}</span>
            </div>
            <div class="ww3-vs">VS</div>
            <div class="ww3-faction ww3-faction-2">
              <span class="ww3-faction-label"><i class="fa-solid fa-flag"></i> Bando 2</span>
              <span class="ww3-faction-name">${conflict.factions.side2}</span>
            </div>
          </div>
          <p class="ww3-popup-desc">${conflict.description}</p>
          ${linkedConflicts ? `
            <div class="ww3-cross-links">
              <span class="ww3-cross-title"><i class="fa-solid fa-link"></i> Conflictos relacionados:</span>
              ${linkedConflicts}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  _renderTheaters: function () {
    WW3_CONFLICTS.forEach(conflict => {
      if (!conflict.theater) return;
      const sevColor = this._getSeverityColor(conflict.severity);

      const polygon = L.polygon(conflict.theater, {
        color: sevColor,
        weight: 1.2,
        opacity: 0.4,
        fillColor: sevColor,
        fillOpacity: 0.07,
        dashArray: '6, 5',
        className: `ww3-theater ww3-theater-${conflict.region}`
      });

      polygon.on('mouseover', function () {
        this.setStyle({ fillOpacity: 0.18, weight: 2, opacity: 0.8 });
      });
      polygon.on('mouseout', function () {
        this.setStyle({ fillOpacity: 0.07, weight: 1.2, opacity: 0.4 });
      });

      polygon.addTo(this.layerGroup);
      this.theaterLayers[conflict.id] = polygon;
    });
  },

  _renderConnectionLines: function () {
    WW3_CONNECTIONS.forEach(conn => {
      const from = WW3_CONFLICTS.find(c => c.id === conn.from);
      const to = WW3_CONFLICTS.find(c => c.id === conn.to);
      if (!from || !to) return;

      const line = L.polyline([from.point, to.point], {
        color: '#62B1F6', weight: 1.5, opacity: 0.35,
        dashArray: '5, 6', className: 'ww3-connection-line'
      });

      // Popup with description on click
      if (conn.desc) {
        const fromName = from.name;
        const toName = to.name;
        const popupHtml = `
          <div class="ww3-conn-popup">
            <div class="ww3-conn-popup-header">
              <i class="fa-solid fa-link"></i> ${conn.label}
            </div>
            <div class="ww3-conn-popup-endpoints">
              <span class="ww3-conn-from" onclick="WW3Layer.flyToConflict('${conn.from}')">${fromName}</span>
              <i class="fa-solid fa-arrows-left-right"></i>
              <span class="ww3-conn-to" onclick="WW3Layer.flyToConflict('${conn.to}')">${toName}</span>
            </div>
            <p class="ww3-conn-popup-desc">${conn.desc}</p>
          </div>
        `;
        line.bindPopup(popupHtml, {
          maxWidth: 380, minWidth: 280, className: 'ww3-popup-container ww3-conn-popup-container'
        });
      }

      // Hover effect
      line.on('mouseover', function () {
        this.setStyle({ opacity: 0.8, weight: 3, color: '#90CAF9' });
      });
      line.on('mouseout', function () {
        this.setStyle({ opacity: 0.35, weight: 1.5, color: '#62B1F6' });
      });

      const midLat = (from.point[0] + to.point[0]) / 2;
      const midLng = (from.point[1] + to.point[1]) / 2;

      const label = L.marker([midLat, midLng], {
        icon: L.divIcon({
          className: 'ww3-connection-label',
          html: `<span>${conn.label}</span>`,
          iconSize: [120, 20], iconAnchor: [60, 10]
        }),
        interactive: false
      });

      line.addTo(this.layerGroup);
      label.addTo(this.layerGroup);
      this.connectionLines.push({ line, label });
    });
  },

  _renderConflictMarkers: function () {
    WW3_CONFLICTS.forEach(conflict => {
      const icon = this._createPulseIcon(conflict);
      const marker = L.marker(conflict.point, {
        icon, zIndexOffset: conflict.severity * 100
      });

      marker.bindPopup(this._createPopupContent(conflict), {
        maxWidth: 420, minWidth: 340, className: 'ww3-popup-container'
      });

      marker.on('click', () => this._highlightTheater(conflict.id));
      marker.addTo(this.layerGroup);
      this.conflictLayers[conflict.id] = marker;
    });
  },

  _highlightTheater: function (conflictId) {
    Object.values(this.theaterLayers).forEach(p =>
      p.setStyle({ fillOpacity: 0.06, weight: 1.2, opacity: 0.4 })
    );
    if (this.theaterLayers[conflictId]) {
      this.theaterLayers[conflictId].setStyle({ fillOpacity: 0.2, weight: 2.5, opacity: 1 });
    }
  },

  flyToConflict: function (conflictId) {
    const conflict = WW3_CONFLICTS.find(c => c.id === conflictId);
    if (!conflict) return;
    this.map.flyTo(conflict.point, 5, { duration: 1.2 });
    setTimeout(() => {
      if (this.conflictLayers[conflictId]) {
        this.conflictLayers[conflictId].openPopup();
        this._highlightTheater(conflictId);
      }
    }, 1300);
  },

  _addLegend: function () {
    const self = this;
    const LegendControl = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'ww3-legend');

        // Severity scale (primary)
        let html = '<h4><i class="fa-solid fa-triangle-exclamation"></i> ESCALA DE SEVERIDAD</h4>';
        for (let s = 5; s >= 1; s--) {
          html += `
            <div class="ww3-legend-severity">
              <span class="ww3-legend-sev-dot" style="background:${self.SEVERITY_COLORS[s]};width:${8 + s * 3}px;height:${8 + s * 3}px;box-shadow:0 0 6px ${self.SEVERITY_COLORS[s]};"></span>
              <span style="color:${self.SEVERITY_COLORS[s]};font-weight:600;">${self.SEVERITY_LABELS[s]}</span>
              <span class="ww3-legend-sev-count">${WW3_CONFLICTS.filter(c => c.severity === s).length}</span>
            </div>
          `;
        }

        // Region grouping
        html += '<div class="ww3-legend-separator"></div>';
        html += '<h5 class="ww3-legend-subtitle"><i class="fa-solid fa-globe"></i> REGIONES</h5>';
        for (const [key, region] of Object.entries(WW3_REGIONS)) {
          const count = WW3_CONFLICTS.filter(c => c.region === key).length;
          if (count === 0) continue;
          html += `
            <div class="ww3-legend-item" data-region="${key}" onclick="WW3Layer.toggleRegion('${key}')">
              <span class="ww3-legend-color" style="background:${region.color};box-shadow:0 0 6px ${region.color};"></span>
              <span class="ww3-legend-name">${region.name}</span>
              <span class="ww3-legend-count">${count}</span>
            </div>
          `;
        }

        div.innerHTML = html;
        L.DomEvent.disableClickPropagation(div);
        return div;
      }
    });

    this.map.addControl(new LegendControl());
  },

  toggleRegion: function (regionKey) {
    const item = document.querySelector(`.ww3-legend-item[data-region="${regionKey}"]`);
    const isHidden = item.classList.toggle('ww3-legend-hidden');
    WW3_CONFLICTS.filter(c => c.region === regionKey).forEach(conflict => {
      if (isHidden) {
        if (this.conflictLayers[conflict.id]) this.layerGroup.removeLayer(this.conflictLayers[conflict.id]);
        if (this.theaterLayers[conflict.id]) this.layerGroup.removeLayer(this.theaterLayers[conflict.id]);
      } else {
        if (this.conflictLayers[conflict.id]) this.layerGroup.addLayer(this.conflictLayers[conflict.id]);
        if (this.theaterLayers[conflict.id]) this.layerGroup.addLayer(this.theaterLayers[conflict.id]);
      }
    });
  },

  _addInfoPanel: function () {
    const panel = document.createElement('div');
    panel.id = 'ww3-info-panel';
    panel.className = 'ww3-info-panel';

    let listHTML = '';
    for (const [key, region] of Object.entries(WW3_REGIONS)) {
      const conflicts = WW3_CONFLICTS.filter(c => c.region === key);
      if (conflicts.length === 0) continue;
      // Sort by severity desc
      conflicts.sort((a, b) => b.severity - a.severity);
      listHTML += `
        <div class="ww3-panel-region">
          <div class="ww3-panel-region-header" style="border-left: 3px solid ${region.color}">
            <i class="fa-solid ${region.icon}" style="color:${region.color}"></i>
            <span>${region.name}</span>
            <small>${region.subtitle}</small>
          </div>
          ${conflicts.map(c => {
        const sevColor = WW3Layer._getSeverityColor(c.severity);
        return `
              <div class="ww3-panel-conflict" onclick="WW3Layer.flyToConflict('${c.id}')">
                <span class="ww3-panel-sev" style="background:${sevColor}">
                  ${c.severity}
                </span>
                <div class="ww3-panel-conflict-info">
                  <strong>${c.name}</strong>
                  <small>${c.status}</small>
                </div>
              </div>
            `;
      }).join('')}
        </div>
      `;
    }

    panel.innerHTML = `
      <div class="ww3-panel-header">
        <h3><i class="fa-solid fa-crosshairs"></i> CONFLICTOS</h3>
        <span class="ww3-panel-count">${WW3_CONFLICTS.length} zonas</span>
      </div>
      <div class="ww3-panel-body">${listHTML}</div>
    `;
    document.body.appendChild(panel);
  },

  _addTopBarCounter: function () {
    const counter = document.createElement('div');
    counter.id = 'ww3-conflict-counter';
    counter.className = 'ww3-conflict-counter';

    const total = WW3_CONFLICTS.length;
    const critical = WW3_CONFLICTS.filter(c => c.severity >= 4).length;
    const wars = WW3_CONFLICTS.filter(c => c.severity === 5).length;

    counter.innerHTML = `
      <span class="ww3-counter-badge ww3-counter-total">
        <i class="fa-solid fa-crosshairs"></i> ${total}
      </span>
      <span class="ww3-counter-badge ww3-counter-critical" style="background:rgba(255,87,34,0.15);color:#FF5722;">
        <i class="fa-solid fa-triangle-exclamation"></i> ${critical} Activos
      </span>
      <span class="ww3-counter-badge ww3-counter-critical" style="background:rgba(255,23,68,0.18);color:#FF1744;">
        <i class="fa-solid fa-explosion"></i> ${wars} Guerras
      </span>
    `;

    const navbar = document.querySelector('.navbar .container-fluid .row');
    if (navbar) navbar.appendChild(counter);
  }
};

// Auto-init
const ww3InitInterval = setInterval(() => {
  if (typeof mapa !== 'undefined' && mapa && mapa.hasOwnProperty('_leaflet_id')) {
    clearInterval(ww3InitInterval);
    setTimeout(() => WW3Layer.init(mapa), 2000);
  }
}, 200);
