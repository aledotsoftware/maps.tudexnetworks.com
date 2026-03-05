/**
 * WW3 Infographic - Conflict Zone Data
 * Each zone defines a theater of operations with:
 *   - point: center marker [lat, lng]
 *   - theater: polygon coordinates for the operational area
 *   - region: color-coded grouping
 *   - severity: 1-5 (1=tension, 5=total war)
 *   - factions: { side1, side2 }
 *   - crossLinks: connections to other conflicts
 */

const WW3_REGIONS = {
    middleEast: {
        name: "Medio Oriente y Golfo Pérsico",
        color: "#ff4444",
        fillColor: "rgba(255, 68, 68, 0.15)",
        icon: "fa-fire",
        subtitle: "Zona de Máxima Fricción"
    },
    europe: {
        name: "Europa Oriental y Cáucaso",
        color: "#ff9900",
        fillColor: "rgba(255, 153, 0, 0.15)",
        icon: "fa-shield-halved",
        subtitle: "Desgaste y Expansión"
    },
    asiaPacific: {
        name: "Asia - Pacífico",
        color: "#ffee00",
        fillColor: "rgba(255, 238, 0, 0.12)",
        icon: "fa-bolt",
        subtitle: "Puntos de Ignición"
    },
    africa: {
        name: "África",
        color: "#cc44ff",
        fillColor: "rgba(204, 68, 255, 0.15)",
        icon: "fa-skull-crossbones",
        subtitle: "Golpes, Mercenarios y Colapso"
    },
    americas: {
        name: "América",
        color: "#00ccff",
        fillColor: "rgba(0, 204, 255, 0.15)",
        icon: "fa-flag",
        subtitle: "Soberanía y Seguridad Interna"
    }
};

const WW3_CONFLICTS = [
    // ========== MEDIO ORIENTE ==========
    {
        id: "iran-war",
        name: "Guerra de Irán (Escalada 2026)",
        region: "middleEast",
        severity: 5,
        point: [32.4, 53.7],
        theater: [
            [39.5, 44.0], [39.5, 63.5], [25.0, 63.5],
            [25.0, 44.0], [39.5, 44.0]
        ],
        factions: {
            side1: "EE.UU. e Israel",
            side2: "Irán y Eje de la Resistencia"
        },
        description: "EE.UU. e Israel enfrentan a Irán y su 'Eje de la Resistencia'. Países europeos (como España) apoyan a Israel pero bloquean el uso de sus bases para atacar a Irán, temiendo una guerra global.",
        crossLinks: ["israel-gaza", "yemen-redsea", "russia-ukraine"],
        status: "CONFLICTO ACTIVO - ESCALADA MÁXIMA"
    },
    {
        id: "israel-gaza",
        name: "Israel, Gaza y Líbano",
        region: "middleEast",
        severity: 5,
        point: [31.8, 34.8],
        theater: [
            [34.5, 33.5], [34.5, 36.5], [29.5, 36.5],
            [29.5, 33.5], [34.5, 33.5]
        ],
        factions: {
            side1: "Israel (Fuerzas de Defensa - IDF)",
            side2: "Hamás (Gaza) / Hezbolá (Líbano)"
        },
        description: "Operaciones continuas de Israel contra Hamás en Gaza y Hezbolá en el sur del Líbano. Múltiples frentes abiertos con bombardeos aéreos y operaciones terrestres sostenidas.",
        crossLinks: ["iran-war"],
        status: "OPERACIONES CONTINUAS"
    },
    {
        id: "yemen-redsea",
        name: "Crisis del Mar Rojo (Yemen)",
        region: "middleEast",
        severity: 4,
        point: [15.5, 44.2],
        theater: [
            [20.0, 36.0], [20.0, 50.0], [12.0, 50.0],
            [12.0, 36.0], [20.0, 36.0]
        ],
        factions: {
            side1: "EE.UU. y Reino Unido (Coalición Naval)",
            side2: "Hutíes (Ansar Allah)"
        },
        description: "Los hutíes atacan el tráfico marítimo comercial internacional en el Mar Rojo y el Estrecho de Bab el-Mandeb. EE.UU. y Reino Unido responden con bombardeos directos en territorio yemení.",
        crossLinks: ["iran-war"],
        status: "BLOQUEO NAVAL ACTIVO"
    },

    // ========== EUROPA ORIENTAL ==========
    {
        id: "russia-ukraine",
        name: "Rusia vs. Ucrania",
        region: "europe",
        severity: 5,
        point: [48.5, 37.5],
        theater: [
            [52.5, 22.0], [52.5, 42.0], [44.0, 42.0],
            [44.0, 22.0], [52.5, 22.0]
        ],
        factions: {
            side1: "Ucrania + OTAN/UE (apoyo armamentístico)",
            side2: "Rusia (+ drones iraníes, munición norcoreana)"
        },
        description: "Guerra de desgaste masiva. Ucrania recibe armas de la OTAN/UE. Rusia utiliza drones suministrados por Irán y munición de Corea del Norte, conectando este conflicto con el de Medio Oriente y Asia.",
        crossLinks: ["iran-war", "korea"],
        status: "GUERRA DE DESGASTE - FRENTE ESTÁTICO"
    },
    {
        id: "caucasus",
        name: "Cáucaso Sur",
        region: "europe",
        severity: 2,
        point: [40.0, 44.5],
        theater: [
            [42.5, 43.0], [42.5, 50.5], [38.5, 50.5],
            [38.5, 43.0], [42.5, 43.0]
        ],
        factions: {
            side1: "Azerbaiyán (respaldado por Turquía)",
            side2: "Armenia (tensión fronteriza latente)"
        },
        description: "Azerbaiyán consolida el control sobre Nagorno Karabaj tras la ofensiva de 2023. Tensión fronteriza latente con Armenia. Turquía respalda a Bakú; Rusia reduce su influencia en la región.",
        crossLinks: ["russia-ukraine"],
        status: "TENSIÓN FRONTERIZA LATENTE"
    },

    // ========== ASIA-PACÍFICO ==========
    {
        id: "taiwan",
        name: "Taiwán y Mar de China Meridional",
        region: "asiaPacific",
        severity: 4,
        point: [23.5, 121.0],
        theater: [
            [30.0, 110.0], [30.0, 130.0], [5.0, 130.0],
            [5.0, 110.0], [30.0, 110.0]
        ],
        factions: {
            side1: "China (Ejército Popular de Liberación)",
            side2: "EE.UU., Japón y Filipinas (Alianzas Navales)"
        },
        description: "Bloqueos militares simulados por China alrededor de Taiwán. EE.UU., Japón y Filipinas refuerzan alianzas navales en contraposición. Peligro de escalada por incidentes marítimos o aéreos.",
        crossLinks: ["korea"],
        status: "BLOQUEOS SIMULADOS - RIESGO CRÍTICO"
    },
    {
        id: "korea",
        name: "Península Coreana",
        region: "asiaPacific",
        severity: 4,
        point: [38.0, 127.0],
        theater: [
            [43.0, 124.0], [43.0, 132.0], [33.0, 132.0],
            [33.0, 124.0], [43.0, 124.0]
        ],
        factions: {
            side1: "Corea del Norte (Régimen de Kim Jong-un)",
            side2: "Corea del Sur + EE.UU. + Japón"
        },
        description: "Corea del Norte abandona acuerdos de paz, fortifica la frontera sur y realiza pruebas de misiles balísticos sobre el Mar del Japón. Exporta munición a Rusia a cambio de tecnología.",
        crossLinks: ["russia-ukraine", "taiwan"],
        status: "PRUEBAS BALÍSTICAS ACTIVAS"
    },
    {
        id: "myanmar",
        name: "Birmania (Myanmar)",
        region: "asiaPacific",
        severity: 4,
        point: [19.8, 96.2],
        theater: [
            [28.5, 92.0], [28.5, 101.5], [10.0, 101.5],
            [10.0, 92.0], [28.5, 92.0]
        ],
        factions: {
            side1: "Junta Militar (Tatmadaw)",
            side2: "Alianza de Guerrillas Étnicas (PDFs, KIA, TNLA, AA)"
        },
        description: "Guerra civil total. La junta militar pierde terreno frente a una alianza de guerrillas étnicas armadas que controlan amplias zonas del norte y el este del país.",
        crossLinks: [],
        status: "GUERRA CIVIL TOTAL"
    },

    // ========== ÁFRICA ==========
    {
        id: "sahel",
        name: "El Sahel (Níger, Mali, Burkina Faso)",
        region: "africa",
        severity: 4,
        point: [14.0, 2.0],
        theater: [
            [25.0, -12.0], [25.0, 16.0], [9.0, 16.0],
            [9.0, -12.0], [25.0, -12.0]
        ],
        factions: {
            side1: "Juntas Militares + Mercenarios Rusos (Africa Corps)",
            side2: "Insurgencias Yihadistas (JNIM, ISGS)"
        },
        description: "Juntas militares expulsan fuerzas occidentales (Francia, EE.UU.) y contratan mercenarios rusos (Africa Corps/ex-Wagner) para combatir insurgencias yihadistas que se expanden por la región.",
        crossLinks: ["russia-ukraine"],
        status: "INTERVENCIÓN DE MERCENARIOS"
    },
    {
        id: "sudan",
        name: "Sudán",
        region: "africa",
        severity: 5,
        point: [15.6, 32.5],
        theater: [
            [22.0, 22.0], [22.0, 38.5], [9.5, 38.5],
            [9.5, 22.0], [22.0, 22.0]
        ],
        factions: {
            side1: "Ejército Sudanés (SAF - Gen. al-Burhan)",
            side2: "Fuerzas de Apoyo Rápido (RSF - Gen. Hemedti)"
        },
        description: "Guerra de aniquilación entre el Ejército (SAF) y los paramilitares (RSF). Crisis humanitaria catastrófica con millones de desplazados. La peor hambruna del mundo en 2026.",
        crossLinks: ["horn-africa"],
        status: "GUERRA DE ANIQUILACIÓN"
    },
    {
        id: "horn-africa",
        name: "Cuerno de África",
        region: "africa",
        severity: 3,
        point: [9.0, 42.0],
        theater: [
            [15.0, 36.0], [15.0, 51.0], [1.0, 51.0],
            [1.0, 36.0], [15.0, 36.0]
        ],
        factions: {
            side1: "Etiopía (Abiy Ahmed)",
            side2: "Somalia + Al-Shabaab (amenaza regional)"
        },
        description: "Tensión crítica entre Etiopía y Somalia por el reconocimiento etíope de la región separatista de Somalilandia a cambio de acceso al mar (puerto de Berbera). Riesgo de conflicto armado directo.",
        crossLinks: ["sudan"],
        status: "TENSIÓN DIPLOMÁTICA CRÍTICA"
    },
    {
        id: "drc-congo",
        name: "República Democrática del Congo",
        region: "africa",
        severity: 4,
        point: [-1.5, 29.0],
        theater: [
            [5.5, 25.0], [5.5, 32.0], [-5.0, 32.0],
            [-5.0, 25.0], [5.5, 25.0]
        ],
        factions: {
            side1: "Ejército Congoleño (FARDC) + MONUSCO",
            side2: "Milicia M23 (respaldada por Ruanda)"
        },
        description: "El ejército congoleño combate a la milicia M23 en el este del país, con acusaciones directas de que Ruanda financia y arma a los rebeldes. Recursos minerales como motor del conflicto.",
        crossLinks: [],
        status: "GUERRA PROXY - CONFLICTO ARMADO"
    },

    // ========== AMÉRICAS ==========
    {
        id: "malvinas",
        name: "Atlántico Sur (Islas Malvinas)",
        region: "americas",
        severity: 2,
        point: [-51.8, -59.0],
        theater: [
            [-49.0, -64.0], [-49.0, -55.0], [-53.5, -55.0],
            [-53.5, -64.0], [-49.0, -64.0]
        ],
        factions: {
            side1: "Argentina (Reclamo diplomático soberano)",
            side2: "Reino Unido (Ocupación militar - Mount Pleasant)"
        },
        description: "Conflicto de soberanía. Argentina mantiene el reclamo diplomático frente a la ocupación británica, la militarización en Mount Pleasant y la explotación unilateral de recursos petroleros y pesqueros.",
        crossLinks: [],
        status: "DISPUTA DE SOBERANÍA"
    },
    {
        id: "ecuador-mexico",
        name: "Ecuador y México",
        region: "americas",
        severity: 3,
        point: [14.0, -90.0],
        theater: [
            [33.0, -118.0], [33.0, -75.0], [-5.0, -75.0],
            [-5.0, -118.0], [33.0, -118.0]
        ],
        factions: {
            side1: "Fuerzas Armadas Estatales (Ecuador, México)",
            side2: "Cárteles Transnacionales (Sinaloa, CJNG, Los Choneros)"
        },
        description: "Conflictos armados internos. Los Estados despliegan a las Fuerzas Armadas para recuperar el control territorial de manos de cárteles transnacionales que operan como fuerzas paramilitares.",
        crossLinks: [],
        status: "OPERACIONES MILITARES INTERNAS"
    },
    {
        id: "haiti",
        name: "Haití",
        region: "americas",
        severity: 4,
        point: [18.9, -72.3],
        theater: [
            [20.0, -74.5], [20.0, -71.5], [18.0, -71.5],
            [18.0, -74.5], [20.0, -74.5]
        ],
        factions: {
            side1: "Policía Nacional + Misión Multinacional (Kenia)",
            side2: "Bandas Armadas (G9, 400 Mawozo, Gran Grif)"
        },
        description: "Colapso del Estado. Bandas armadas controlan Puerto Príncipe frente a una superada policía nacional y misiones extranjeras. Sin gobierno funcional, infraestructura destruida.",
        crossLinks: [],
        status: "ESTADO FALLIDO - COLAPSO TOTAL"
    }
];

// Connection lines between linked conflicts
const WW3_CONNECTIONS = [
    { from: "iran-war", to: "israel-gaza", label: "Eje de Resistencia" },
    { from: "iran-war", to: "yemen-redsea", label: "Apoyo hutí" },
    { from: "iran-war", to: "russia-ukraine", label: "Drones iraníes" },
    { from: "russia-ukraine", to: "korea", label: "Munición norcoreana" },
    { from: "russia-ukraine", to: "sahel", label: "Mercenarios rusos" },
    { from: "taiwan", to: "korea", label: "Alianzas del Pacífico" },
    { from: "sudan", to: "horn-africa", label: "Desestabilización regional" }
];
