/**
 * WW3 Infographic - Layer Renderer
 * Renders all conflict zones, theaters, connection lines,
 * pulse animations, and info panels onto the Leaflet map.
 */

const WW3Layer = {
    conflictLayers: {},
    theaterLayers: {},
    connectionLines: [],
    legendControl: null,
    infoPanelOpen: false,

    SEVERITY_LABELS: {
        1: "Tensión Diplomática",
        2: "Tensión Fronteriza",
        3: "Conflicto Latente",
        4: "Conflicto Armado Activo",
        5: "Guerra Total"
    },

    SEVERITY_PULSE_SIZE: {
        1: 18, 2: 22, 3: 28, 4: 34, 5: 42
    },

    /**
     * Initialize and render all WW3 layers on the map
     */
    init: function (map) {
        this.map = map;
        this.layerGroup = L.layerGroup().addTo(map);

        this._renderTheaters();
        this._renderConnectionLines();
        this._renderConflictMarkers();
        this._addLegend();
        this._addInfoPanel();
        this._addRegionFilterControl();
    },

    /**
     * Create custom HTML marker with pulsing animation
     */
    _createPulseIcon: function (conflict) {
        const region = WW3_REGIONS[conflict.region];
        const size = this.SEVERITY_PULSE_SIZE[conflict.severity];
        const innerSize = Math.round(size * 0.5);

        return L.divIcon({
            className: 'ww3-marker-wrapper',
            iconSize: [size * 2.5, size * 2.5],
            iconAnchor: [size * 1.25, size * 1.25],
            html: `
        <div class="ww3-pulse-marker" style="--pulse-color: ${region.color}; --pulse-size: ${size}px;">
          <div class="ww3-pulse-ring ww3-pulse-ring-1"></div>
          <div class="ww3-pulse-ring ww3-pulse-ring-2"></div>
          ${conflict.severity >= 4 ? '<div class="ww3-pulse-ring ww3-pulse-ring-3"></div>' : ''}
          <div class="ww3-marker-core" style="width:${innerSize}px;height:${innerSize}px;background:${region.color};">
            <i class="fa-solid ${region.icon}" style="font-size:${Math.max(10, innerSize - 8)}px;"></i>
          </div>
        </div>
      `
        });
    },

    /**
     * Generate popup HTML for a conflict
     */
    _createPopupContent: function (conflict) {
        const region = WW3_REGIONS[conflict.region];
        const severityLabel = this.SEVERITY_LABELS[conflict.severity];
        const severityBars = Array.from({ length: 5 }, (_, i) =>
            `<span class="ww3-sev-bar ${i < conflict.severity ? 'active' : ''}" style="${i < conflict.severity ? `background:${region.color}` : ''}"></span>`
        ).join('');

        const linkedConflicts = conflict.crossLinks.map(id => {
            const linked = WW3_CONFLICTS.find(c => c.id === id);
            return linked ? `<span class="ww3-cross-link" onclick="WW3Layer.flyToConflict('${id}')">${linked.name}</span>` : '';
        }).filter(Boolean).join('');

        return `
      <div class="ww3-popup" style="--region-color: ${region.color}">
        <div class="ww3-popup-header">
          <div class="ww3-popup-region-tag" style="background:${region.color}">
            <i class="fa-solid ${region.icon}"></i> ${region.name}
          </div>
          <h3 class="ww3-popup-title">${conflict.name}</h3>
          <div class="ww3-popup-status" style="border-color:${region.color}">
            <i class="fa-solid fa-circle-exclamation"></i> ${conflict.status}
          </div>
        </div>
        <div class="ww3-popup-body">
          <div class="ww3-severity-row">
            <span class="ww3-severity-label">Severidad:</span>
            <div class="ww3-severity-bars">${severityBars}</div>
            <span class="ww3-severity-text">${severityLabel}</span>
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

    /**
     * Render theater of operations polygons
     */
    _renderTheaters: function () {
        WW3_CONFLICTS.forEach(conflict => {
            if (!conflict.theater) return;
            const region = WW3_REGIONS[conflict.region];

            const polygon = L.polygon(conflict.theater, {
                color: region.color,
                weight: 1.5,
                opacity: 0.6,
                fillColor: region.color,
                fillOpacity: 0.08,
                dashArray: '8, 6',
                className: `ww3-theater ww3-theater-${conflict.region}`
            });

            polygon.on('mouseover', function () {
                this.setStyle({ fillOpacity: 0.18, weight: 2.5, opacity: 0.9 });
            });
            polygon.on('mouseout', function () {
                this.setStyle({ fillOpacity: 0.08, weight: 1.5, opacity: 0.6 });
            });

            polygon.addTo(this.layerGroup);
            this.theaterLayers[conflict.id] = polygon;
        });
    },

    /**
     * Render connection lines between linked conflicts
     */
    _renderConnectionLines: function () {
        WW3_CONNECTIONS.forEach(conn => {
            const fromConflict = WW3_CONFLICTS.find(c => c.id === conn.from);
            const toConflict = WW3_CONFLICTS.find(c => c.id === conn.to);
            if (!fromConflict || !toConflict) return;

            const line = L.polyline(
                [fromConflict.point, toConflict.point],
                {
                    color: '#ffffff',
                    weight: 1,
                    opacity: 0.25,
                    dashArray: '4, 8',
                    className: 'ww3-connection-line'
                }
            );

            // Add label at midpoint
            const midLat = (fromConflict.point[0] + toConflict.point[0]) / 2;
            const midLng = (fromConflict.point[1] + toConflict.point[1]) / 2;

            const label = L.marker([midLat, midLng], {
                icon: L.divIcon({
                    className: 'ww3-connection-label',
                    html: `<span>${conn.label}</span>`,
                    iconSize: [120, 20],
                    iconAnchor: [60, 10]
                }),
                interactive: false
            });

            line.addTo(this.layerGroup);
            label.addTo(this.layerGroup);
            this.connectionLines.push({ line, label });
        });
    },

    /**
     * Render conflict point markers
     */
    _renderConflictMarkers: function () {
        WW3_CONFLICTS.forEach(conflict => {
            const icon = this._createPulseIcon(conflict);
            const marker = L.marker(conflict.point, {
                icon: icon,
                zIndexOffset: conflict.severity * 100
            });

            marker.bindPopup(this._createPopupContent(conflict), {
                maxWidth: 420,
                minWidth: 340,
                className: 'ww3-popup-container'
            });

            marker.on('click', () => {
                this._highlightTheater(conflict.id);
            });

            marker.addTo(this.layerGroup);
            this.conflictLayers[conflict.id] = marker;
        });
    },

    /**
     * Highlight a theater of operations
     */
    _highlightTheater: function (conflictId) {
        // Reset all theaters
        Object.values(this.theaterLayers).forEach(poly => {
            poly.setStyle({ fillOpacity: 0.08, weight: 1.5, opacity: 0.6 });
        });
        // Highlight selected
        if (this.theaterLayers[conflictId]) {
            this.theaterLayers[conflictId].setStyle({
                fillOpacity: 0.22, weight: 3, opacity: 1
            });
        }
    },

    /**
     * Fly to a specific conflict (also used from popup cross-links)
     */
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

    /**
     * Add legend control
     */
    _addLegend: function () {
        const LegendControl = L.Control.extend({
            options: { position: 'bottomright' },
            onAdd: function () {
                const div = L.DomUtil.create('div', 'ww3-legend');
                let html = '<h4><i class="fa-solid fa-globe"></i> TEATROS DE OPERACIONES</h4>';

                for (const [key, region] of Object.entries(WW3_REGIONS)) {
                    const count = WW3_CONFLICTS.filter(c => c.region === key).length;
                    html += `
            <div class="ww3-legend-item" data-region="${key}" onclick="WW3Layer.toggleRegion('${key}')">
              <span class="ww3-legend-color" style="background:${region.color}"></span>
              <span class="ww3-legend-name">${region.name}</span>
              <span class="ww3-legend-count">${count}</span>
            </div>
          `;
                }

                html += '<div class="ww3-legend-severity-section"><h5>SEVERIDAD</h5>';
                for (const [level, label] of Object.entries(WW3Layer.SEVERITY_LABELS)) {
                    html += `
            <div class="ww3-legend-severity">
              <span class="ww3-legend-sev-dot" style="opacity:${0.3 + (level * 0.14)};width:${8 + level * 3}px;height:${8 + level * 3}px;"></span>
              <span>${label}</span>
            </div>
          `;
                }
                html += '</div>';

                div.innerHTML = html;
                L.DomEvent.disableClickPropagation(div);
                return div;
            }
        });

        this.legendControl = new LegendControl();
        this.map.addControl(this.legendControl);
    },

    /**
     * Toggle visibility of a region's markers
     */
    toggleRegion: function (regionKey) {
        const legendItem = document.querySelector(`.ww3-legend-item[data-region="${regionKey}"]`);
        const isHidden = legendItem.classList.toggle('ww3-legend-hidden');

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

    /**
     * Add the info panel with conflict list
     */
    _addInfoPanel: function () {
        const panel = document.createElement('div');
        panel.id = 'ww3-info-panel';
        panel.className = 'ww3-info-panel';

        let listHTML = '';
        for (const [key, region] of Object.entries(WW3_REGIONS)) {
            const conflicts = WW3_CONFLICTS.filter(c => c.region === key);
            listHTML += `
        <div class="ww3-panel-region">
          <div class="ww3-panel-region-header" style="border-left: 3px solid ${region.color}">
            <i class="fa-solid ${region.icon}" style="color:${region.color}"></i>
            <span>${region.name}</span>
            <small>${region.subtitle}</small>
          </div>
          ${conflicts.map(c => `
            <div class="ww3-panel-conflict" onclick="WW3Layer.flyToConflict('${c.id}')">
              <span class="ww3-panel-sev" style="background:${region.color};opacity:${0.4 + c.severity * 0.12}">
                ${c.severity}
              </span>
              <div class="ww3-panel-conflict-info">
                <strong>${c.name}</strong>
                <small>${c.status}</small>
              </div>
            </div>
          `).join('')}
        </div>
      `;
        }

        panel.innerHTML = `
      <div class="ww3-panel-header">
        <h3><i class="fa-solid fa-crosshairs"></i> CONFLICTOS ACTIVOS</h3>
        <span class="ww3-panel-count">${WW3_CONFLICTS.length} zonas</span>
      </div>
      <div class="ww3-panel-body">${listHTML}</div>
    `;

        document.body.appendChild(panel);
    },

    _addRegionFilterControl: function () {
        // Compact summary counter in top bar
        const counter = document.createElement('div');
        counter.id = 'ww3-conflict-counter';
        counter.className = 'ww3-conflict-counter';

        const total = WW3_CONFLICTS.length;
        const critical = WW3_CONFLICTS.filter(c => c.severity >= 4).length;

        counter.innerHTML = `
      <span class="ww3-counter-badge ww3-counter-total">
        <i class="fa-solid fa-crosshairs"></i> ${total} Conflictos
      </span>
      <span class="ww3-counter-badge ww3-counter-critical">
        <i class="fa-solid fa-triangle-exclamation"></i> ${critical} Críticos
      </span>
    `;

        const navbar = document.querySelector('.navbar .container-fluid .row');
        if (navbar) {
            navbar.appendChild(counter);
        }
    }
};

// Auto-initialize when the map is ready
const ww3InitInterval = setInterval(() => {
    if (typeof mapa !== 'undefined' && mapa && mapa.hasOwnProperty('_leaflet_id')) {
        clearInterval(ww3InitInterval);
        // Wait a bit for all map plugins to load
        setTimeout(() => {
            WW3Layer.init(mapa);
        }, 2000);
    }
}, 200);
