/**
 * WW3 Infographic - Complete Conflict Zone Data v4
 * Severity-based color scale. 45+ conflict zones.
 */

const WW3_REGIONS = {
    middleEast: {
        name: "Medio Oriente",
        color: "#FF3D3D",
        fillColor: "rgba(255, 61, 61, 0.12)",
        icon: "fa-fire",
        subtitle: "Máxima Fricción"
    },
    europe: {
        name: "Europa y Cáucaso",
        color: "#FF8C00",
        fillColor: "rgba(255, 140, 0, 0.12)",
        icon: "fa-shield-halved",
        subtitle: "Desgaste y Expansión"
    },
    asiaPacific: {
        name: "Asia - Pacífico",
        color: "#FFD700",
        fillColor: "rgba(255, 215, 0, 0.10)",
        icon: "fa-bolt",
        subtitle: "Puntos de Ignición"
    },
    asiaInternal: {
        name: "Asia - Represión y Tensiones",
        color: "#E040FB",
        fillColor: "rgba(224, 64, 251, 0.10)",
        icon: "fa-lock",
        subtitle: "Control Estatal y Fricción"
    },
    africa: {
        name: "África",
        color: "#BA68C8",
        fillColor: "rgba(186, 104, 200, 0.12)",
        icon: "fa-skull-crossbones",
        subtitle: "Golpes, Mercenarios y Colapso"
    },
    americas: {
        name: "América",
        color: "#00E5FF",
        fillColor: "rgba(0, 229, 255, 0.10)",
        icon: "fa-flag",
        subtitle: "Soberanía y Seguridad Interna"
    },
    colonial: {
        name: "Legados Coloniales",
        color: "#26C6DA",
        fillColor: "rgba(38, 198, 218, 0.10)",
        icon: "fa-crown",
        subtitle: "Territorios disputados y colonias"
    },
    terrorism: {
        name: "Redes Terroristas Globales",
        color: "#FF1744",
        fillColor: "rgba(255, 23, 68, 0.08)",
        icon: "fa-crosshairs",
        subtitle: "Organizaciones y zonas de operación"
    },
    separatism: {
        name: "Movimientos Separatistas",
        color: "#78909C",
        fillColor: "rgba(120, 144, 156, 0.10)",
        icon: "fa-flag",
        subtitle: "Independentismo y autodeterminación"
    }
};

const WW3_CONFLICTS = [
    // ===================== MEDIO ORIENTE =====================
    {
        id: "iran-war",
        name: "Guerra de Irán (Escalada 2026)",
        region: "middleEast", severity: 5,
        point: [32.4, 53.7],
        theater: [[39.5, 44], [39.5, 63.5], [25, 63.5], [25, 44], [39.5, 44]],
        factions: { side1: "EE.UU. e Israel", side2: "Irán y Eje de la Resistencia" },
        description: "EE.UU. e Israel enfrentan a Irán y su 'Eje de la Resistencia'. Países europeos bloquean el uso de sus bases, temiendo una conflagración global.",
        crossLinks: ["israel-gaza", "yemen-redsea", "russia-ukraine"],
        status: "CONFLICTO ACTIVO — ESCALADA MÁXIMA"
    },
    {
        id: "israel-gaza",
        name: "Israel, Gaza y Líbano",
        region: "middleEast", severity: 5,
        point: [31.8, 34.8],
        theater: [[34.5, 33.5], [34.5, 36.5], [29.5, 36.5], [29.5, 33.5], [34.5, 33.5]],
        factions: { side1: "Israel (IDF)", side2: "Hamás (Gaza) / Hezbolá (Líbano)" },
        description: "Operaciones continuas de Israel contra Hamás en Gaza y Hezbolá en Líbano. Múltiples frentes abiertos.",
        crossLinks: ["iran-war", "kurdistan"],
        status: "OPERACIONES CONTINUAS"
    },
    {
        id: "yemen-redsea",
        name: "Crisis del Mar Rojo (Yemen)",
        region: "middleEast", severity: 4,
        point: [15.5, 44.2],
        theater: [[20, 36], [20, 50], [12, 50], [12, 36], [20, 36]],
        factions: { side1: "EE.UU. y Reino Unido (Coalición Naval)", side2: "Hutíes (Ansar Allah)" },
        description: "Hutíes atacan tráfico marítimo internacional. EE.UU. y Reino Unido bombardean territorio yemení.",
        crossLinks: ["iran-war"],
        status: "BLOQUEO NAVAL ACTIVO"
    },
    {
        id: "kurdistan",
        name: "Cuestión Kurda (Turquía, Siria, Irak)",
        region: "middleEast", severity: 4,
        point: [37.0, 43.0],
        theater: [[40, 36], [40, 47], [35, 47], [35, 36], [40, 36]],
        factions: { side1: "Turquía (TSK)", side2: "PKK / YPG-SDF" },
        description: "Turquía mantiene operaciones contra el PKK en Irak y las YPG/SDF en Siria. El pueblo kurdo exige autonomía en múltiples estados.",
        crossLinks: ["israel-gaza", "iran-war", "iraq-instability"],
        status: "OPERACIONES MILITARES CONTINUAS"
    },
    {
        id: "iraq-instability",
        name: "Irak — Milicias e Inestabilidad",
        region: "middleEast", severity: 3,
        point: [33.3, 44.3],
        theater: [[37.5, 38.5], [37.5, 48.5], [29, 48.5], [29, 38.5], [37.5, 38.5]],
        factions: { side1: "Gobierno iraquí + EE.UU.", side2: "Milicias pro-Irán (PMF)" },
        description: "Milicias pro-iraníes atacan bases estadounidenses. Irak como campo de batalla proxy entre Washington y Teherán.",
        crossLinks: ["iran-war", "kurdistan"],
        status: "ATAQUES PROXY RECURRENTES"
    },

    // ===================== EUROPA Y CÁUCASO =====================
    {
        id: "russia-ukraine",
        name: "Rusia vs. Ucrania",
        region: "europe", severity: 5,
        point: [48.5, 37.5],
        theater: [[52.5, 22], [52.5, 42], [44, 42], [44, 22], [52.5, 22]],
        factions: { side1: "Ucrania + OTAN/UE", side2: "Rusia (+ drones iraníes, munición norcoreana)" },
        description: "Guerra de desgaste masiva. Ucrania con armas OTAN. Rusia con drones de Irán y munición de Corea del Norte.",
        crossLinks: ["iran-war", "korea"],
        status: "GUERRA DE DESGASTE — FRENTE ESTÁTICO"
    },
    {
        id: "caucasus",
        name: "Cáucaso Sur (Azerbaiyán-Armenia)",
        region: "europe", severity: 2,
        point: [40.0, 44.5],
        theater: [[42.5, 43], [42.5, 50.5], [38.5, 50.5], [38.5, 43], [42.5, 43]],
        factions: { side1: "Azerbaiyán (+ Turquía)", side2: "Armenia" },
        description: "Azerbaiyán consolida Nagorno Karabaj. Tensión fronteriza latente con Armenia.",
        crossLinks: ["russia-ukraine"],
        status: "TENSIÓN FRONTERIZA LATENTE"
    },
    {
        id: "serbia-kosovo",
        name: "Serbia — Kosovo",
        region: "europe", severity: 2,
        point: [42.6, 21.0],
        theater: [[44.5, 19.5], [44.5, 22.5], [41.5, 22.5], [41.5, 19.5], [44.5, 19.5]],
        factions: { side1: "Serbia (no reconoce independencia)", side2: "Kosovo (+ EE.UU./UE)" },
        description: "Serbia rechaza la independencia de Kosovo. Incidentes armados, KFOR mantiene frágil paz.",
        crossLinks: ["russia-ukraine"],
        status: "TENSIÓN ÉTNICA — INCIDENTES ARMADOS"
    },
    {
        id: "transnistria",
        name: "Transnistria (Moldavia — Rusia)",
        region: "europe", severity: 2,
        point: [47.0, 29.5],
        theater: [[48.5, 28], [48.5, 31], [46, 31], [46, 28], [48.5, 28]],
        factions: { side1: "Moldavia (busca integración europea)", side2: "Transnistria (separatista pro-ruso, tropas rusas)" },
        description: "Región separatista de Moldavia con tropas rusas estacionadas desde 1992. Rodeada por el frente ucraniano. Moldavia teme una provocación rusa que abriría un segundo frente.",
        crossLinks: ["russia-ukraine"],
        status: "CONFLICTO CONGELADO — TROPAS RUSAS"
    },
    {
        id: "greenland",
        name: "Groenlandia — Amenaza de Anexión (EE.UU.)",
        region: "europe", severity: 2,
        point: [72.0, -40.0],
        theater: [[84, -73], [84, -12], [60, -12], [60, -73], [84, -73]],
        factions: { side1: "EE.UU. (Trump — presión de anexión)", side2: "Dinamarca / Gobierno autónomo de Groenlandia" },
        description: "Trump anuncia intención de adquirir Groenlandia por posición estratégica ártica y recursos minerales. Dinamarca rechaza. EE.UU. aumenta presencia en Thule Air Base.",
        crossLinks: ["russia-ukraine", "arctic-routes"],
        status: "AMENAZA DE ANEXIÓN — PRESIÓN DIPLOMÁTICA"
    },
    {
        id: "arctic-routes",
        name: "Ártico — Rutas Navegables y Militarización",
        region: "europe", severity: 2,
        point: [80.0, 50.0],
        theater: [[90, 0], [90, 180], [65, 180], [65, 0], [90, 0]],
        factions: { side1: "Rusia (Ruta del Mar del Norte — Flota del Norte)", side2: "EE.UU., Canadá, OTAN y Dinamarca (Paso del Noroeste)" },
        description: "El deshielo del Ártico abre dos rutas marítimas estratégicas: la Ruta del Mar del Norte (controlada por Rusia) y el Paso del Noroeste (disputado entre Canadá y EE.UU.). Rusia militariza sus bases árticas (Novaya Zemlya, Franz Josef), despliega submarinos nucleares y reclama la plataforma continental hasta el Polo Norte (Cordillera Lomonósov). Canadá reclama soberanía sobre el Paso del Noroeste; EE.UU. lo considera aguas internacionales. China se autoproclama 'Estado Cercano al Ártico' y construye rompehielos nucleares. Los recursos estimados: 13% del petróleo y 30% del gas no descubierto del mundo.",
        crossLinks: ["greenland", "russia-ukraine"],
        status: "MILITARIZACIÓN ÁRTICA — DISPUTA POR RUTAS Y RECURSOS"
    },

    // ===================== ASIA-PACÍFICO =====================
    {
        id: "taiwan",
        name: "Taiwán y Mar de China Meridional",
        region: "asiaPacific", severity: 4,
        point: [23.5, 121.0],
        theater: [[30, 110], [30, 130], [5, 130], [5, 110], [30, 110]],
        factions: { side1: "China (PLA)", side2: "EE.UU., Japón y Filipinas" },
        description: "Bloqueos militares simulados por China. EE.UU., Japón y Filipinas refuerzan alianzas navales.",
        crossLinks: ["korea", "india-china", "philippines-scs"],
        status: "BLOQUEOS SIMULADOS — RIESGO CRÍTICO"
    },
    {
        id: "korea",
        name: "Península Coreana",
        region: "asiaPacific", severity: 4,
        point: [38.0, 127.0],
        theater: [[43, 124], [43, 132], [33, 132], [33, 124], [43, 124]],
        factions: { side1: "Corea del Norte (Kim Jong-un)", side2: "Corea del Sur + EE.UU. + Japón" },
        description: "Corea del Norte abandona acuerdos de paz, pruebas de misiles balísticos. Exporta munición a Rusia.",
        crossLinks: ["russia-ukraine", "taiwan"],
        status: "PRUEBAS BALÍSTICAS ACTIVAS"
    },
    {
        id: "myanmar",
        name: "Birmania (Myanmar) — Guerra Civil",
        region: "asiaPacific", severity: 4,
        point: [19.8, 96.2],
        theater: [[28.5, 92], [28.5, 101.5], [10, 101.5], [10, 92], [28.5, 92]],
        factions: { side1: "Junta Militar (Tatmadaw)", side2: "Guerrillas Étnicas (PDFs, KIA, TNLA, AA)" },
        description: "Guerra civil total. La junta pierde terreno ante alianza de guerrillas étnicas.",
        crossLinks: [],
        status: "GUERRA CIVIL TOTAL"
    },

    // ===================== ASIA — REPRESIÓN Y TENSIONES =====================
    {
        id: "xinjiang",
        name: "China — Represión Uigur (Xinjiang)",
        region: "asiaInternal", severity: 3,
        point: [41.0, 82.0],
        theater: [[49, 73], [49, 97], [35, 97], [35, 73], [49, 73]],
        factions: { side1: "Gobierno de China (PCC)", side2: "Población uigur (minoría musulmana)" },
        description: "Campos de 'reeducación' masivos, vigilancia biométrica, esterilizaciones forzadas. ONU documenta posibles crímenes contra la humanidad.",
        crossLinks: ["taiwan", "tibet"],
        status: "REPRESIÓN SISTEMÁTICA — CRÍMENES CONTRA LA HUMANIDAD"
    },
    {
        id: "tibet",
        name: "China — Represión en Tíbet",
        region: "asiaInternal", severity: 2,
        point: [31.0, 88.0],
        theater: [[36.5, 78], [36.5, 99], [26.5, 99], [26.5, 78], [36.5, 78]],
        factions: { side1: "Gobierno de China (PCC)", side2: "Pueblo tibetano / Gobierno en exilio" },
        description: "Sinización forzada, restricción religiosa, vigilancia masiva. Dalai Lama en exilio.",
        crossLinks: ["xinjiang", "india-china"],
        status: "OCUPACIÓN Y ASIMILACIÓN FORZADA"
    },
    {
        id: "pak-afg",
        name: "Pakistán — Afganistán",
        region: "asiaInternal", severity: 4,
        point: [33.5, 69.5],
        theater: [[37.5, 60], [37.5, 75], [29, 75], [29, 60], [37.5, 60]],
        factions: { side1: "Pakistán (Fuerzas Armadas — ISI)", side2: "TTP / Gobierno Talibán Afgano" },
        description: "Operaciones contra el TTP. Ataques aéreos transfronterizos y deportaciones masivas de afganos.",
        crossLinks: ["iran-war", "kashmir"],
        status: "OPERACIONES TRANSFRONTERIZAS ACTIVAS"
    },
    {
        id: "kashmir",
        name: "India — Pakistán (Cachemira)",
        region: "asiaInternal", severity: 3,
        point: [34.5, 75.5],
        theater: [[37, 73], [37, 80], [32, 80], [32, 73], [37, 73]],
        factions: { side1: "India (Fuerzas Armadas)", side2: "Pakistán + insurgencia cachemir" },
        description: "India revocó la autonomía (Art. 370). Dos potencias nucleares enfrentadas con insurgencia activa.",
        crossLinks: ["pak-afg", "india-china"],
        status: "DISPUTA NUCLEAR — INSURGENCIA ACTIVA"
    },
    {
        id: "india-china",
        name: "India — China (Ladakh / LAC)",
        region: "asiaInternal", severity: 3,
        point: [34.8, 78.0],
        theater: [[36, 76], [36, 80.5], [33, 80.5], [33, 76], [36, 76]],
        factions: { side1: "India", side2: "China (PLA)" },
        description: "Enfrentamiento en Ladakh. Combates cuerpo a cuerpo letales (Galwan, 2020). Militarización fronteriza extrema.",
        crossLinks: ["taiwan", "kashmir"],
        status: "MILITARIZACIÓN FRONTERIZA — POTENCIAS NUCLEARES"
    },
    {
        id: "philippines-scs",
        name: "Filipinas — Mar de China Meridional",
        region: "asiaInternal", severity: 3,
        point: [14.5, 119.0],
        theater: [[18, 115], [18, 122], [8, 122], [8, 115], [18, 115]],
        factions: { side1: "China (guardacostas)", side2: "Filipinas (+ EE.UU.)" },
        description: "China acosa embarcaciones filipinas. Cañones de agua, láser militar. EE.UU. respalda a Manila.",
        crossLinks: ["taiwan"],
        status: "HOSTIGAMIENTO NAVAL CONTINUO"
    },

    // ===================== ÁFRICA =====================
    {
        id: "sahel",
        name: "El Sahel — Anti-imperialismo francés",
        region: "africa", severity: 4,
        point: [14.0, 2.0],
        theater: [[25, -12], [25, 16], [9, 16], [9, -12], [25, -12]],
        factions: { side1: "Juntas Militares + Mercenarios Rusos (Africa Corps)", side2: "Insurgencias Yihadistas + ex-influencia francesa" },
        description: "Níger, Mali y Burkina Faso expulsan fuerzas francesas. 'France Dégage' (Francia fuera). Mercenarios rusos reemplazan la presencia occidental. Colapso de la 'Françafrique'.",
        crossLinks: ["russia-ukraine", "libya", "boko-haram", "chad-car"],
        status: "REVOLUCIÓN ANTI-FRANCESA — MERCENARIOS RUSOS"
    },
    {
        id: "chad-car",
        name: "Chad y Rep. Centroafricana — Post-Francia",
        region: "africa", severity: 3,
        point: [7.0, 20.0],
        theater: [[15.5, 14], [15.5, 27.5], [2, 27.5], [2, 14], [15.5, 14]],
        factions: { side1: "Gobiernos locales + Africa Corps/ex-Wagner", side2: "Rebeldes + legado neocolonial francés" },
        description: "Chad fue la base militar francesa clave (Op. Épervier). La RCA expulsó a Francia por mercenarios rusos. Colapso del control francés post-colonial.",
        crossLinks: ["sahel", "drc-congo"],
        status: "TRANSICIÓN POST-COLONIAL — INFLUENCIA RUSA"
    },
    {
        id: "sudan",
        name: "Sudán — Guerra Civil",
        region: "africa", severity: 5,
        point: [15.6, 32.5],
        theater: [[22, 22], [22, 38.5], [9.5, 38.5], [9.5, 22], [22, 22]],
        factions: { side1: "Ejército (SAF — al-Burhan)", side2: "RSF (Hemedti)" },
        description: "Guerra de aniquilación. La peor crisis humanitaria y hambruna mundial en 2026.",
        crossLinks: ["horn-africa"],
        status: "GUERRA DE ANIQUILACIÓN"
    },
    {
        id: "horn-africa",
        name: "Cuerno de África (Etiopía-Somalia)",
        region: "africa", severity: 3,
        point: [9.0, 42.0],
        theater: [[15, 36], [15, 51], [1, 51], [1, 36], [15, 36]],
        factions: { side1: "Etiopía (Abiy Ahmed)", side2: "Somalia + Al-Shabaab" },
        description: "Tensión por reconocimiento de Somalilandia a cambio de acceso al mar.",
        crossLinks: ["sudan", "alshabaab"],
        status: "TENSIÓN DIPLOMÁTICA CRÍTICA"
    },
    {
        id: "drc-congo",
        name: "R.D. del Congo — Milicia M23",
        region: "africa", severity: 4,
        point: [-1.5, 29.0],
        theater: [[5.5, 25], [5.5, 32], [-5, 32], [-5, 25], [5.5, 25]],
        factions: { side1: "Ejército Congoleño (FARDC)", side2: "M23 (respaldada por Ruanda)" },
        description: "Conflicto por minerales estratégicos (coltán, cobalto). Masacres documentadas.",
        crossLinks: ["chad-car"],
        status: "GUERRA PROXY — CONFLICTO ARMADO"
    },
    {
        id: "libya",
        name: "Libia — División y Guerra Civil",
        region: "africa", severity: 3,
        point: [31.0, 17.0],
        theater: [[33.5, 9], [33.5, 25.5], [22, 25.5], [22, 9], [33.5, 9]],
        factions: { side1: "Trípoli (GNA, Turquía)", side2: "LNA (Haftar, Rusia/Egipto)" },
        description: "Dos gobiernos rivales. Mercenarios extranjeros, tráfico de armas.",
        crossLinks: ["sahel"],
        status: "ESTADO DIVIDIDO — GUERRA CONGELADA"
    },
    {
        id: "mozambique",
        name: "Mozambique — Insurgencia Cabo Delgado",
        region: "africa", severity: 3,
        point: [-12.5, 40.0],
        theater: [[-10, 38], [-10, 41.5], [-15.5, 41.5], [-15.5, 38], [-10, 38]],
        factions: { side1: "Ejército + Ruanda + SADC", side2: "ISIS-Mozambique" },
        description: "Insurgencia yihadista vinculada al ISIS. Tropas de Ruanda protegen proyectos gasíferos.",
        crossLinks: ["isis-network"],
        status: "INSURGENCIA YIHADISTA ACTIVA"
    },
    {
        id: "sahara-occidental",
        name: "Sahara Occidental (Marruecos — Polisario)",
        region: "africa", severity: 2,
        point: [24.5, -13.0],
        theater: [[27.5, -17.5], [27.5, -8.5], [21, -8.5], [21, -17.5], [27.5, -17.5]],
        factions: { side1: "Marruecos (ocupación militar)", side2: "Frente Polisario / RASD (República Saharaui)" },
        description: "Última colonia en África según la ONU. Marruecos ocupa y explota el territorio; el Frente Polisario reclama independencia desde los campamentos de refugiados en Tinduf (Argelia). EE.UU. reconoció la soberanía marroquí en 2020.",
        crossLinks: ["sahel"],
        status: "OCUPACIÓN — ÚLTIMA COLONIA EN ÁFRICA"
    },
    {
        id: "cameroon-anglophone",
        name: "Camerún — Crisis Anglófona (Ambazonia)",
        region: "africa", severity: 3,
        point: [5.5, 10.0],
        theater: [[7, 8.5], [7, 11.5], [4, 11.5], [4, 8.5], [7, 8.5]],
        factions: { side1: "Gobierno de Camerún (francófono)", side2: "Separatistas de Ambazonia (regiones anglófonas)" },
        description: "Las regiones anglófonas del noroeste y suroeste luchan por la independencia como 'República Federal de Ambazonia'. El gobierno francófono responde con represión militar, quema de aldeas y detenciones masivas. Más de 6.000 muertos y 700.000 desplazados.",
        crossLinks: ["sahel"],
        status: "CONFLICTO SEPARATISTA — REPRESIÓN MILITAR"
    },

    // ===================== AMÉRICAS =====================
    {
        id: "malvinas",
        name: "Islas Malvinas (Argentina — Reino Unido)",
        region: "americas", severity: 2,
        point: [-51.8, -59.0],
        theater: [[-49, -64], [-49, -55], [-53.5, -55], [-53.5, -64], [-49, -64]],
        factions: { side1: "Argentina (reclamo soberano permanente)", side2: "Reino Unido (ocupación militar — Base Mount Pleasant)" },
        description: "Disputa de soberanía sobre las Islas Malvinas, Georgias del Sur y Sandwich del Sur. Argentina reafirma su reclamo basado en proximidad geográfica, continuidad de plataforma continental y herencia del dominio español (uti possidetis juris). Reino Unido ocupa militarmente las islas desde 1833, con base aérea y naval en Mount Pleasant. Guerra de 1982. Explotación unilateral de recursos petroleros y pesqueros por parte de UK.",
        crossLinks: ["russia-ukraine", "arg-chile-shelf", "antarctica-claims", "gibraltar", "diego-garcia", "cyprus", "british-caribbean", "new-caledonia", "french-guiana", "puerto-rico", "sahara-occidental-colonial"],
        status: "OCUPACIÓN MILITAR — DISPUTA DE SOBERANÍA"
    },
    {
        id: "arg-chile-shelf",
        name: "Argentina — Chile (Plataforma Continental)",
        region: "americas", severity: 1,
        point: [-56.0, -68.0],
        theater: [[-52, -72], [-52, -62], [-58, -62], [-58, -72], [-52, -72]],
        factions: { side1: "Argentina (plataforma continental reconocida por la CLPC/ONU 2016)", side2: "Chile (presentó reclamo superpuesto sobre plataforma continental en 2021)" },
        description: "Argentina obtuvo en 2016 el reconocimiento de la Comisión de Límites de la Plataforma Continental (CLPC) de la ONU sobre su plataforma continental extendida, incluyendo zonas al sur de Tierra del Fuego. Chile presentó en 2021 un reclamo de plataforma continental que se superpone parcialmente con la zona reconocida a Argentina, generando una controversia bilateral sobre derechos marítimos y de fondo marino. Ambos países son aliados pero mantienen esta disputa técnico-jurídica.",
        crossLinks: ["malvinas", "antarctica-claims"],
        status: "SUPERPOSICIÓN DE PLATAFORMAS CONTINENTALES"
    },
    {
        id: "antarctica-claims",
        name: "Antártida — Triple Reclamación Superpuesta",
        region: "americas", severity: 1,
        point: [-75.0, -60.0],
        theater: [[-60, -75], [-60, -20], [-90, -20], [-90, -75], [-60, -75]],
        factions: { side1: "Argentina (Antártida Argentina) y Chile (Territorio Antártico Chileno)", side2: "Reino Unido (Territorio Antártico Británico)" },
        description: "Tres reclamaciones antárticas se superponen entre sí. Argentina reclama el sector entre 25°O y 74°O. Chile reclama entre 53°O y 90°O. Reino Unido reclama entre 20°O y 80°O. El Tratado Antártico de 1959 'congela' todas las reclamaciones territoriales mientras esté vigente. Argentina y Chile basan su reclamo en proximidad geográfica y herencia española. El tratado se puede revisar en 2048.",
        crossLinks: ["malvinas", "arg-chile-shelf"],
        status: "RECLAMACIONES CONGELADAS — TRATADO ANTÁRTICO 1959"
    },
    {
        id: "alberta-separatism",
        name: "Alberta — Separatismo pro-Trump (Canadá)",
        region: "separatism", severity: 2,
        point: [53.9, -116.6],
        theater: [[60, -120], [60, -110], [49, -110], [49, -120], [60, -120]],
        factions: { side1: "Alberta Prosperity Project (APP) + apoyo de Administración Trump", side2: "Gobierno Federal de Canadá (PM Mark Carney)" },
        description: "EE.UU. impulsa el separatismo en Alberta, la provincia petrolera de Canadá. La Administración Trump mantuvo 3 reuniones con el APP (grupo independentista de ultraderecha) desde abril 2025. El APP busca referéndum de secesión y propuso a la Casa Blanca una línea de crédito de 500.000M USD. Trump impuso aranceles del 35% a Canadá y habla de convertirla en el 'Estado 51'. Alberta concentra el 90% del petróleo canadiense. Encuestas: 34% apoya secesión, cae a 15% considerando consecuencias.",
        crossLinks: ["greenland"],
        status: "INJERENCIA EXTRANJERA — SEPARATISMO INDUCIDO"
    },
    {
        id: "mexico-narco",
        name: "México — Narcoguerra",
        region: "americas", severity: 4,
        point: [23.6, -102.5],
        theater: [[33, -118], [33, -86], [14, -86], [14, -118], [33, -118]],
        factions: { side1: "Fuerzas Armadas de México (SEDENA, Marina)", side2: "Cártel de Sinaloa, CJNG (Cártel Jalisco Nueva Generación)" },
        description: "Guerra total contra cárteles que controlan rutas de droga, extorsión y secuestro. El CJNG y Sinaloa operan como ejércitos paralelos con drones armados, blindados improvisados y control territorial. Más de 30.000 homicidios anuales.",
        crossLinks: ["centroamerica-maras", "ecuador-narco"],
        status: "NARCOGUERRA — VIOLENCIA EXTREMA"
    },
    {
        id: "ecuador-narco",
        name: "Ecuador — Crisis de Seguridad",
        region: "americas", severity: 4,
        point: [-1.8, -78.2],
        theater: [[2, -81], [2, -75], [-5, -75], [-5, -81], [2, -81]],
        factions: { side1: "Fuerzas Armadas de Ecuador (estado de excepción)", side2: "Los Choneros, Los Lobos, Latin Kings (vinculados a cárteles mexicanos)" },
        description: "Ecuador pasó de ser país de tránsito a epicentro de violencia narco. Bandas locales aliadas con los cárteles mexicanos. Toma de canal de TV en vivo, explosiones en prisiones. Presidente declara 'conflicto armado interno' y despliega militares.",
        crossLinks: ["mexico-narco", "colombia-guerrillas"],
        status: "CONFLICTO ARMADO INTERNO DECLARADO"
    },
    {
        id: "colombia-guerrillas",
        name: "Colombia — ELN y Disidencias FARC",
        region: "americas", severity: 3,
        point: [4.0, -72.0],
        theater: [[12, -79], [12, -67], [-4, -67], [-4, -79], [12, -79]],
        factions: { side1: "Gobierno de Colombia (Fuerzas Militares + Policía)", side2: "ELN + Disidencias FARC (Estado Mayor Central) + Clan del Golfo" },
        description: "Pese al acuerdo de paz de 2016, las disidencias de las FARC (Estado Mayor Central) y el ELN controlan zonas rurales. Producción de cocaína en récord histórico. Masacres, reclutamiento forzado y minas antipersonal persisten.",
        crossLinks: ["ecuador-narco", "venezuela-guyana"],
        status: "PAZ FALLIDA — MÚLTIPLES GRUPOS ARMADOS"
    },
    {
        id: "haiti",
        name: "Haití — Estado Fallido",
        region: "americas", severity: 4,
        point: [18.9, -72.3],
        theater: [[20, -74.5], [20, -71.5], [18, -71.5], [18, -74.5], [20, -74.5]],
        factions: { side1: "Policía Nacional + Misión (Kenia)", side2: "Bandas Armadas (G9, 400 Mawozo)" },
        description: "Colapso total del Estado. Bandas armadas controlan Puerto Príncipe. Crisis humanitaria extrema.",
        crossLinks: ["centroamerica-maras"],
        status: "ESTADO FALLIDO — COLAPSO TOTAL"
    },
    {
        id: "centroamerica-maras",
        name: "Centroamérica — Maras y Seguridad",
        region: "americas", severity: 3,
        point: [14.6, -87.0],
        theater: [[18, -92], [18, -83], [7, -83], [7, -92], [18, -92]],
        factions: { side1: "El Salvador (Bukele, régimen de excepción), Guatemala, Honduras", side2: "MS-13, Barrio 18, pandillas locales" },
        description: "El Salvador bajo régimen de excepción permanente de Bukele: 80.000+ detenidos, denuncias de abusos. Guatemala y Honduras enfrentan narcoviolencia y migración forzada. Caravanas migratorias hacia EE.UU. como consecuencia directa.",
        crossLinks: ["mexico-narco", "haiti"],
        status: "REGÍMENES DE EXCEPCIÓN — CRISIS MIGRATORIA"
    },
    {
        id: "venezuela-guyana",
        name: "Venezuela — Guyana (Esequibo)",
        region: "americas", severity: 2,
        point: [7.5, -60.0],
        theater: [[9, -62.5], [9, -57], [1.5, -57], [1.5, -62.5], [9, -62.5]],
        factions: { side1: "Venezuela (reclamo del Esequibo)", side2: "Guyana (+ EE.UU., UK, Brasil)" },
        description: "Venezuela reclama dos tercios de Guyana (Esequibo). Referéndum de anexión 2023. Presencia militar disuasoria internacional.",
        crossLinks: ["colombia-guerrillas"],
        status: "DISPUTA TERRITORIAL — RIESGO DE ESCALADA"
    },
    {
        id: "epp-paraguay",
        name: "Paraguay — Guerrilla EPP",
        region: "americas", severity: 3,
        point: [-22.5, -56.5],
        theater: [[-20, -58], [-20, -55], [-24, -55], [-24, -58], [-20, -58]],
        factions: { side1: "Fuerzas Armadas y Policía de Paraguay", side2: "Ejército del Pueblo Paraguayo (EPP)" },
        description: "Guerrilla marxista en el norte (Concepción, San Pedro, Amambay). Secuestros, emboscadas. Vinculada al narcotráfico. Fuerzas de Tarea Conjunta intentan neutralizarla.",
        crossLinks: ["colombia-guerrillas"],
        status: "GUERRILLA ACTIVA — OPERACIONES CONJUNTAS"
    },

    // ===================== LEGADOS COLONIALES =====================
    {
        id: "gibraltar",
        name: "Gibraltar (España — Reino Unido)",
        region: "colonial", severity: 1,
        point: [36.14, -5.35],
        theater: [[36.3, -5.5], [36.3, -5.2], [36.0, -5.2], [36.0, -5.5], [36.3, -5.5]],
        factions: { side1: "España (reclamo de soberanía)", side2: "Reino Unido (desde 1713)" },
        description: "España reclama Gibraltar. Base naval estratégica. Post-Brexit complica el estatus.",
        crossLinks: ["south-atlantic"],
        status: "DISPUTA DE SOBERANÍA COLONIAL"
    },
    {
        id: "diego-garcia",
        name: "Diego Garcia / Islas Chagos (RU — Mauricio)",
        region: "colonial", severity: 1,
        point: [-7.3, 72.4],
        theater: [[-5, 70], [-5, 74], [-9, 74], [-9, 70], [-5, 70]],
        factions: { side1: "Mauricio (soberanía ONU)", side2: "Reino Unido + EE.UU. (base militar)" },
        description: "Población nativa expulsada. EE.UU. opera base militar clave. CIJ y ONU reconocen soberanía de Mauricio.",
        crossLinks: ["south-atlantic"],
        status: "DESPLAZAMIENTO COLONIAL — BASE MILITAR"
    },
    {
        id: "cyprus",
        name: "Chipre — División turca y bases británicas",
        region: "colonial", severity: 2,
        point: [35.1, 33.4],
        theater: [[35.7, 32.2], [35.7, 34.6], [34.5, 34.6], [34.5, 32.2], [35.7, 32.2]],
        factions: { side1: "Turquía (ocupa norte)", side2: "República de Chipre (UE) + bases británicas" },
        description: "Dividido desde invasión turca 1974. Reino Unido mantiene bases soberanas (Akrotiri, Dekelia).",
        crossLinks: ["gibraltar"],
        status: "ISLA DIVIDIDA — OCUPACIÓN TURCA"
    },
    {
        id: "new-caledonia",
        name: "Nueva Caledonia — Revuelta Kanak (Francia)",
        region: "colonial", severity: 3,
        point: [-22.2, 166.5],
        theater: [[-19, 163], [-19, 170], [-23, 170], [-23, 163], [-19, 163]],
        factions: { side1: "Francia (control colonial)", side2: "Pueblo Kanak (FLNKS)" },
        description: "Revuelta indígena contra Francia. Ley electoral manipulada provocó disturbios 2024, muertos y estado de emergencia. 25% del níquel mundial.",
        crossLinks: ["sahel", "french-polynesia", "french-guiana"],
        status: "REVUELTA ANTI-COLONIAL — ESTADO DE EMERGENCIA"
    },
    {
        id: "french-polynesia",
        name: "Polinesia Francesa — Legado nuclear",
        region: "colonial", severity: 1,
        point: [-17.5, -149.5],
        theater: [[-14, -154], [-14, -134], [-24, -134], [-24, -154], [-14, -154]],
        factions: { side1: "Francia (territorio de ultramar)", side2: "Pueblos polinesios (independentistas)" },
        description: "193 pruebas nucleares francesas (1966-1996). Contaminación documentada. Movimiento independentista activo.",
        crossLinks: ["new-caledonia"],
        status: "LEGADO NUCLEAR — RECLAMO INDEPENDENTISTA"
    },
    {
        id: "french-guiana",
        name: "Guayana Francesa — Movimiento Independentista",
        region: "colonial", severity: 2,
        point: [4.0, -53.0],
        theater: [[6, -55], [6, -51], [2, -51], [2, -55], [6, -55]],
        factions: { side1: "Francia (departamento de ultramar, base espacial Kourou)", side2: "Movimientos independentistas guayaneses + protestas sociales" },
        description: "Territorio francés en Sudamérica donde Francia opera el Centro Espacial de Kourou (lanzamiento de cohetes Ariane). La población local sufre pobreza extrema, desempleo alto y dependencia total de París. Protestas masivas en 2017 paralizaron el territorio. Movimientos independentistas denuncian explotación neocolonial de recursos (oro, biodiversidad) mientras la población carece de servicios básicos.",
        crossLinks: ["new-caledonia", "venezuela-guyana"],
        status: "COLONIA ACTIVA — TENSIÓN SOCIAL Y SEPARATISMO"
    },
    {
        id: "sahara-occidental-colonial",
        name: "Sahara Occidental (legado colonial español)",
        region: "colonial", severity: 2,
        point: [25.5, -14.0],
        theater: [[27, -17], [27, -9], [22, -9], [22, -17], [27, -17]],
        factions: { side1: "Marruecos (ocupación)", side2: "Frente Polisario / RASD (república saharaui)" },
        description: "Última colonia en África (lista ONU). España abandonó el territorio en 1975, Marruecos invadió. Muro militar de 2.700 km ('Muro de la Vergüenza'). Polisario en campamentos de refugiados en Argelia desde hace 50 años.",
        crossLinks: ["sahel"],
        status: "ÚLTIMA COLONIA AFRICANA — MURO MILITAR"
    },

    // ===================== REDES TERRORISTAS =====================
    {
        id: "isis-network",
        name: "ISIS / Daesh — Red Global",
        region: "terrorism", severity: 4,
        point: [35.0, 40.0],
        theater: [[37, 35], [37, 44], [33, 44], [33, 35], [37, 35]],
        factions: { side1: "Coalición Internacional", side2: "ISIS (provincias en 4 continentes)" },
        description: "Perdió el califato pero opera red global: ISKP (Af/Pak), ISGS (Sahel), ISM (Mozambique). Atentado en Moscú 2024.",
        crossLinks: ["pak-afg", "sahel", "mozambique"],
        status: "RED TERRORISTA — CÉLULAS EN 4 CONTINENTES"
    },
    {
        id: "alqaeda",
        name: "Al-Qaeda — Red Fragmentada",
        region: "terrorism", severity: 3,
        point: [15.0, 48.0],
        theater: [[18, 42], [18, 54], [12, 54], [12, 42], [18, 42]],
        factions: { side1: "EE.UU. + aliados", side2: "Al-Qaeda (AQAP, AQIM, Al-Shabaab)" },
        description: "Franquicias: AQAP en Yemen, AQIM/JNIM en Sahel, Al-Shabaab en Somalia.",
        crossLinks: ["yemen-redsea", "sahel", "alshabaab"],
        status: "FRANQUICIAS ACTIVAS"
    },
    {
        id: "alshabaab",
        name: "Al-Shabaab (Somalia, Este de África)",
        region: "terrorism", severity: 4,
        point: [4.0, 45.0],
        theater: [[6, 40], [6, 50], [0, 50], [0, 40], [6, 40]],
        factions: { side1: "Somalia + AMISOM + EE.UU.", side2: "Al-Shabaab (Al-Qaeda)" },
        description: "Controla sur de Somalia, atentados en Mogadiscio y Kenia. Proto-estado terrorista.",
        crossLinks: ["horn-africa", "alqaeda"],
        status: "PROTO-ESTADO TERRORISTA"
    },
    {
        id: "boko-haram",
        name: "Boko Haram / ISWAP (Nigeria, Lago Chad)",
        region: "terrorism", severity: 4,
        point: [11.5, 13.5],
        theater: [[14, 10], [14, 16], [8, 16], [8, 10], [14, 10]],
        factions: { side1: "Nigeria + Chad + Camerún + Níger", side2: "Boko Haram / ISWAP (ISIS)" },
        description: "Noreste de Nigeria y Lago Chad. Secuestros masivos, miles de muertos anuales.",
        crossLinks: ["sahel", "isis-network"],
        status: "INSURGENCIA — MILES DE MUERTOS ANUALES"
    },

    // ===================== TERRITORIOS COLONIALES ADICIONALES =====================
    {
        id: "british-caribbean",
        name: "Territorios Británicos del Caribe",
        region: "colonial", severity: 1,
        point: [19.0, -63.0],
        theater: [[22, -68], [22, -59], [12, -59], [12, -68], [22, -68]],
        factions: { side1: "Anguila, Bermudas, BVI, Montserrat, Turcas y Caicos, Caimán", side2: "Reino Unido (administración y defensa)" },
        description: "Seis territorios británicos de ultramar en el Caribe figuran en la lista de descolonización de la ONU. Bermudas celebró referéndum independentista. Las Islas Vírgenes Británicas buscan mayor autonomía. Anguila, Montserrat y Turcas y Caicos participan activamente en el Comité de los 24 (Descolonización ONU).",
        crossLinks: ["south-atlantic", "gibraltar"],
        status: "LISTA ONU DE DESCOLONIZACIÓN — 6 TERRITORIOS"
    },
    {
        id: "british-atlantic-remote",
        name: "Territorios Británicos del Atlántico y Pacífico",
        region: "colonial", severity: 1,
        point: [-15.9, -5.7],
        theater: [[-7, -15], [-7, 0], [-40, 0], [-40, -15], [-7, -15]],
        factions: { side1: "Santa Elena, Ascensión, Tristán da Cunha, Pitcairn", side2: "Reino Unido (administración colonial)" },
        description: "Islas remotas bajo soberanía británica. Santa Elena fue prisión de Napoleón. Ascensión alberga una base militar compartida con EE.UU. (estación de seguimiento de misiles). Tristán da Cunha es el asentamiento habitado más remoto del mundo. Pitcairn en el Pacífico tiene apenas ~50 habitantes.",
        crossLinks: ["south-atlantic", "diego-garcia"],
        status: "POSESIONES ULTRAMARINAS — BASES MILITARES"
    },
    {
        id: "us-territories",
        name: "Territorios de EE.UU. (ONU)",
        region: "colonial", severity: 1,
        point: [13.4, 144.8],
        theater: [[15, 143], [15, 146], [12, 146], [12, 143], [15, 143]],
        factions: { side1: "Guam, Samoa Americana, Islas Vírgenes de EE.UU.", side2: "Estados Unidos (territorios no incorporados)" },
        description: "Tres territorios estadounidenses figuran en la lista de descolonización de la ONU. Guam alberga enormes bases militares (Anderson AFB, Naval Base Guam) y tiene un movimiento de autodeterminación chamorro activo. Islas Vírgenes de EE.UU. buscan mayor autonomía. Samoa Americana tiene un estatus especial donde sus habitantes son 'nacionales' pero no 'ciudadanos' plenos.",
        crossLinks: ["taiwan"],
        status: "LISTA ONU DESCOLONIZACIÓN — BASES MILITARES"
    },

    {
        id: "puerto-rico",
        name: "Puerto Rico (EE.UU. — Estatus colonial)",
        region: "colonial", severity: 2,
        point: [18.2, -66.5],
        theater: [[18.6, -67.3], [18.6, -65.5], [17.9, -65.5], [17.9, -67.3], [18.6, -67.3]],
        factions: { side1: "Movimientos independentistas y estadistas puertorriqueños", side2: "Gobierno Federal de EE.UU. (territorio no incorporado)" },
        description: "Puerto Rico es un 'Estado Libre Asociado' de EE.UU. desde 1952 — en la práctica, una colonia. 3.2 millones de ciudadanos estadounidenses sin representación con voto en el Congreso ni voto presidencial. Referéndums de estatus recurrentes (2012, 2017, 2020) con mayoría a favor de la estadidad, pero el Congreso no actúa. Deuda de 70.000M USD, quiebra fiscal (PROMESA 2016), devastación por huracán María (2017). Movimiento independentista histórico reprimido brutalmente (Masacre de Ponce, COINTELPRO). ONU ha pedido repetidamente la descolonización.",
        crossLinks: ["us-territories", "british-caribbean"],
        status: "COLONIA DE FACTO — SIN REPRESENTACIÓN PLENA"
    },

    // ===================== MOVIMIENTOS SEPARATISTAS =====================
    {
        id: "scotland",
        name: "Escocia — Independentismo (SNP)",
        region: "separatism", severity: 1,
        point: [56.5, -4.0],
        theater: [[58.7, -7.5], [58.7, -0.8], [54.6, -0.8], [54.6, -7.5], [58.7, -7.5]],
        factions: { side1: "Partido Nacional Escocés (SNP) + Scottish Greens", side2: "Gobierno del Reino Unido (Westminster)" },
        description: "El SNP busca un segundo referéndum de independencia tras el de 2014 (55% No). Brexit reavivó el independentismo escocés (Escocia votó 62% a favor de permanecer en la UE). Westminster bloquea un nuevo referéndum. Debate sobre moneda, frontera con Inglaterra y reingreso a la UE.",
        crossLinks: [],
        status: "INDEPENDENTISMO ACTIVO — REFERÉNDUM BLOQUEADO"
    },
    {
        id: "catalonia",
        name: "Cataluña — Separatismo",
        region: "separatism", severity: 1,
        point: [41.4, 2.2],
        theater: [[42.9, 0.2], [42.9, 3.3], [40.5, 3.3], [40.5, 0.2], [42.9, 0.2]],
        factions: { side1: "Movimiento independentista (ERC, Junts, ANC, Òmnium)", side2: "Gobierno de España" },
        description: "Referéndum unilateral de 2017 declarado ilegal por el Tribunal Constitucional. Líderes independentistas encarcelados y luego amnistiados. Puigdemmont en exilio. El movimiento perdió fuerza pero sigue latente con base social significativa.",
        crossLinks: ["scotland"],
        status: "SEPARATISMO LATENTE — POST-REFERÉNDUM"
    },
    {
        id: "kashmir-sep",
        name: "Baluchistán — Separatismo (Pakistán/Irán)",
        region: "separatism", severity: 3,
        point: [28.0, 65.0],
        theater: [[32, 58], [32, 70], [24, 70], [24, 58], [32, 58]],
        factions: { side1: "Pakistán e Irán (represión militar)", side2: "Ejército de Liberación de Baluchistán (BLA/BLF)" },
        description: "Los baluchis luchan por la independencia de la provincia más grande y pobre de Pakistán, rica en gas, oro y cobre. Desapariciones forzadas documentadas por la ONU. Ataques del BLA contra infraestructura china (CPEC). Irán reprime a su propia minoría baluchi con ejecuciones masivas.",
        crossLinks: ["pak-afg", "iran-war"],
        status: "INSURGENCIA SEPARATISTA — DESAPARICIONES FORZADAS"
    }
];

const WW3_CONNECTIONS = [
    {
        from: "iran-war", to: "israel-gaza", label: "Eje de Resistencia",
        desc: "Irán financia y arma a Hamás y Hezbolá como parte de su 'Eje de la Resistencia' contra Israel. Cualquier escalada en Gaza o Líbano arrastra directamente a Irán, y viceversa: un ataque a Irán desata represalias desde sus proxies en toda la región."
    },

    {
        from: "iran-war", to: "yemen-redsea", label: "Apoyo hutí",
        desc: "Los hutíes de Yemen son financiados y armados por Irán. Sus ataques al tráfico marítimo en el Mar Rojo son una extensión directa del conflicto iraní: bloquean rutas comerciales para presionar a Occidente en solidaridad con Gaza e Irán."
    },

    {
        from: "iran-war", to: "russia-ukraine", label: "Drones iraníes",
        desc: "Irán suministra drones Shahed a Rusia para usar contra Ucrania. A cambio, Rusia blinda a Irán en el Consejo de Seguridad de la ONU. Esta alianza militar conecta directamente el frente europeo con el de Medio Oriente."
    },

    {
        from: "iran-war", to: "kurdistan", label: "Frente norte",
        desc: "Los kurdos del norte de Irak y Siria están atrapados entre la guerra contra Irán y las operaciones turcas. Irán bombardea posiciones kurdas en Irak alegando que albergan disidentes, mientras Turquía ataca simultáneamente a las YPG/SDF aliadas de EE.UU."
    },

    {
        from: "russia-ukraine", to: "korea", label: "Munición norcoreana",
        desc: "Corea del Norte exporta millones de proyectiles de artillería y misiles a Rusia para sostener su guerra en Ucrania. A cambio, Rusia transfiere tecnología satelital y espacial a Pyongyang, fortaleciendo su programa de misiles balísticos intercontinentales."
    },

    {
        from: "russia-ukraine", to: "sahel", label: "Mercenarios rusos",
        desc: "Los mercenarios rusos del Africa Corps (ex-Wagner) operan en Mali, Burkina Faso y Níger, expulsando a Francia. Rusia gana influencia en África mientras financia su guerra en Ucrania con minerales africanos (oro, uranio)."
    },

    {
        from: "russia-ukraine", to: "transnistria", label: "Tropas rusas",
        desc: "Rusia mantiene 1.500 soldados en Transnistria desde 1992. Esta región separatista de Moldavia queda rodeada por el frente ucraniano. Una escalada rusa podría abrir un segundo frente y arrastrar a Moldavia al conflicto."
    },

    {
        from: "russia-ukraine", to: "greenland", label: "Competencia ártica",
        desc: "El derretimiento del Ártico abre nuevas rutas marítimas y acceso a recursos. Rusia militariza el Ártico; EE.UU. responde presionando a Dinamarca por Groenlandia (bases, recursos, posición geoestratégica). Ambos compiten por el control del polo norte."
    },

    {
        from: "arctic-routes", to: "greenland", label: "Posición estratégica",
        desc: "Groenlandia es la puerta de entrada occidental al Ártico. Quien controle Groenlandia domina el acceso al Paso del Noroeste y puede monitorear ambas rutas árticas. Por eso Trump presiona por su anexión y Rusia refuerza su presencia naval."
    },

    {
        from: "arctic-routes", to: "russia-ukraine", label: "Flota del Norte",
        desc: "Rusia opera su Flota del Norte (la más poderosa, con submarinos nucleares) desde Múrmansk, directamente sobre las rutas árticas. La guerra en Ucrania aceleró la competencia OTAN-Rusia en el Ártico, con Finlandia y Suecia uniéndose a la OTAN y cerrando el flanco escandinavo."
    },

    {
        from: "taiwan", to: "korea", label: "Alianzas del Pacífico",
        desc: "Un ataque chino a Taiwán activaría las alianzas de defensa de EE.UU. con Japón y Corea del Sur. Corea del Norte podría aprovechar el caos para abrir un segundo frente en la península coreana, multiplicando la crisis."
    },

    {
        from: "taiwan", to: "india-china", label: "Contención de China",
        desc: "India y la alianza QUAD (EE.UU., Japón, Australia, India) buscan contener a China en múltiples frentes. La tensión en Ladakh y la disputa por Taiwán son dos caras de la misma estrategia de cerco a Beijing."
    },

    {
        from: "taiwan", to: "philippines-scs", label: "Disputa marítima",
        desc: "China reclama casi todo el Mar de China Meridional (línea de 9 puntos). Filipinas y Taiwán son los dos flancos de esta disputa marítima. Un bloqueo naval chino a Taiwán cortaría las mismas rutas comerciales que China ya hostiga frente a Filipinas."
    },

    {
        from: "sudan", to: "horn-africa", label: "Desestabilización",
        desc: "La guerra civil en Sudán genera millones de refugiados que desestabilizan a Etiopía, Chad y Sudán del Sur. Las armas y mercenarios fluyen entre el Cuerno de África y Sudán, retroalimentando la violencia en toda la región."
    },

    {
        from: "kashmir", to: "pak-afg", label: "Frontera hostil",
        desc: "Pakistán e India mantienen la frontera más militarizada del mundo en Cachemira. Pakistán desvía recursos entre el frente afgano (TTP) y el frente indio. Los talibanes afganos ofrecen refugio a grupos que luego atacan en Cachemira."
    },

    {
        from: "xinjiang", to: "tibet", label: "Represión sistémica",
        desc: "China aplica el mismo modelo de control en Xinjiang y el Tíbet: vigilancia masiva, restricción cultural, asimilación forzada y campos de detención. Ambos son laboratorios del aparato represivo del Partido Comunista contra minorías étnicas."
    },

    {
        from: "sahel", to: "libya", label: "Yihadismo transfronterizo",
        desc: "El colapso de Libia en 2011 inundó el Sahel de armas y combatientes. Los grupos yihadistas (JNIM, ISGS) operan libremente entre el sur de Libia y el norte de Mali/Níger, sin fronteras efectivas que los contengan."
    },

    {
        from: "sahel", to: "chad-car", label: "Caída de Françafrique",
        desc: "El Sahel (Mali, Níger, Burkina Faso) expulsó a Francia, y el efecto dominó alcanzó a Chad (la última base fuerte francesa) y la RCA. Rusia reemplaza a Francia con mercenarios. Es el colapso del sistema neocolonial francés en África."
    },

    {
        from: "sahel", to: "boko-haram", label: "Expansión yihadista",
        desc: "Los grupos yihadistas del Sahel (JNIM, ISGS) y Boko Haram/ISWAP en Nigeria comparten combatientes, armas y territorio en la cuenca del Lago Chad. El avance de uno fortalece al otro; la inestabilidad es transfronteriza."
    },

    {
        from: "new-caledonia", to: "french-guiana", label: "Colonias francesas",
        desc: "Ambos son territorios franceses de ultramar donde la población indígena lucha contra el control de París. Nueva Caledonia tuvo revueltas violentas (2024); Guayana Francesa masivas protestas (2017). Comparten el mismo patrón de explotación de recursos locales en beneficio de la metrópoli."
    },

    {
        from: "malvinas", to: "russia-ukraine", label: "Principio de Crimea",
        desc: "Rusia anexó Crimea invocando la 'autodeterminación' de sus habitantes. Argentina rechaza ese principio: si la autodeterminación de colonos implantados legitimara la ocupación, el reclamo argentino sobre Malvinas se debilitaría. Occidente condena Crimea pero defiende el referéndum de los kelpers, exponiendo una doble vara en el derecho internacional."
    },

    {
        from: "malvinas", to: "gibraltar", label: "Colonias británicas",
        desc: "Ambos son territorios que el Reino Unido se niega a devolver invocando la autodeterminación de sus habitantes. España reclama Gibraltar como Argentina reclama Malvinas. El patrón es idéntico: implantación de población, base militar, y negativa a negociar soberanía."
    },

    {
        from: "malvinas", to: "diego-garcia", label: "Colonias británicas",
        desc: "Diego Garcia muestra el extremo del colonialismo británico: expulsaron a toda la población nativa para instalar una base militar anglo-estadounidense. En Malvinas, UK también implantó población propia tras expulsar a los argentinos en 1833. Mismo patrón de ocupación militar."
    },

    {
        from: "malvinas", to: "cyprus", label: "Bases británicas",
        desc: "Reino Unido mantiene bases militares soberanas en Chipre (Akrotiri, Dekelia) como en Malvinas (Mount Pleasant). Ambas son posiciones geoestratégicas que Londres conserva por su valor militar, no por la población local."
    },

    {
        from: "malvinas", to: "british-caribbean", label: "Territorios RU",
        desc: "Los territorios británicos del Caribe (Anguila, BVI, Montserrat, etc.) comparten con Malvinas el estatus de colonias bajo administración británica que figuran en la lista de descolonización de la ONU. Son vestigios del mismo imperio."
    },

    {
        from: "malvinas", to: "new-caledonia", label: "Descolonización ONU",
        desc: "Tanto Malvinas como Nueva Caledonia están en la lista de territorios pendientes de descolonización de la ONU. Ambos casos plantean el mismo dilema: ¿prima la integridad territorial del Estado reclamante o la voluntad de la población residente (muchas veces implantada)?"
    },

    {
        from: "malvinas", to: "french-guiana", label: "Colonias en Sudamérica",
        desc: "Malvinas y Guayana Francesa son las dos situaciones coloniales activas en Sudamérica: territorio europeo en suelo americano. Francia opera su base espacial de Kourou; Reino Unido su base militar de Mount Pleasant. Ambas explotan recursos sudamericanos bajo bandera europea."
    },

    {
        from: "malvinas", to: "puerto-rico", label: "Colonialismo americano",
        desc: "Puerto Rico y Malvinas representan dos formas de colonialismo en las Américas: EE.UU. mantiene la isla como territorio sin representación plena; UK ocupa militarmente las islas argentinas. Ambos han sido condenados repetidamente por el Comité de Descolonización de la ONU."
    },

    {
        from: "malvinas", to: "sahara-occidental-colonial", label: "Descolonización ONU",
        desc: "Sahara Occidental y Malvinas son los dos casos más emblemáticos de descolonización pendiente en la ONU. En ambos, una potencia ocupa territorio ajeno: Marruecos con un muro militar de 2.700 km, Reino Unido con una base aérea y naval. La ONU exige negociación en ambos casos."
    },

    {
        from: "isis-network", to: "pak-afg", label: "ISKP",
        desc: "ISIS-Khorasan (ISKP) opera en Afganistán y Pakistán como la rama más letal del Estado Islámico fuera de Medio Oriente. Ejecuta atentados masivos contra los talibanes y civiles, convirtiendo la frontera afgano-paquistaní en un tercer frente yihadista."
    },

    {
        from: "isis-network", to: "mozambique", label: "ISM",
        desc: "ISIS-Mozambique (ISM) controla zonas de Cabo Delgado, una provincia rica en gas natural. La franquicia africana del ISIS atrae combatientes del Sahel y el Cuerno de África, creando un corredor yihadista del Mediterráneo al Índico."
    },

    {
        from: "isis-network", to: "boko-haram", label: "ISWAP",
        desc: "ISWAP es la facción de Boko Haram que juró lealtad al ISIS. Recibe financiamiento y directrices estratégicas del Estado Islámico central, integrando la insurgencia nigeriana en la red terrorista global. Ambos comparten tácticas, propaganda y combatientes."
    },

    {
        from: "alqaeda", to: "alshabaab", label: "Franquicia AQ",
        desc: "Al-Shabaab es la franquicia más poderosa de Al-Qaeda. Opera como proto-estado en Somalia, recauda impuestos, controla territorio y exporta combatientes a los focos de Kenia, Uganda y Etiopía. Su caída debilitaría toda la red de Al-Qaeda en África."
    },

    {
        from: "mexico-narco", to: "ecuador-narco", label: "Cárteles",
        desc: "Los cárteles mexicanos (Sinaloa, CJNG) expandieron sus operaciones a Ecuador, usando bandas locales como franquicias. Ecuador pasó de país de tránsito a campo de batalla narco por su posición como puerto de salida de cocaína hacia Europa."
    },

    {
        from: "mexico-narco", to: "centroamerica-maras", label: "Narcotráfico",
        desc: "Las rutas del narcotráfico mexicano atraviesan Guatemala, Honduras y El Salvador, alimentando la violencia de las maras. La narcoviolencia centroamericana es consecuencia directa de la narcoguerra mexicana y causa de las caravanas migratorias hacia EE.UU."
    },

    {
        from: "ecuador-narco", to: "colombia-guerrillas", label: "Ruta de cocaína",
        desc: "La cocaína producida en Colombia (récord histórico) sale principalmente por Ecuador hacia el Pacífico y Europa. Las disidencias FARC y el ELN controlan las rutas fronterizas. La violencia narco en Ecuador es inseparable de la producción colombiana."
    },

    {
        from: "colombia-guerrillas", to: "epp-paraguay", label: "Guerrillas LatAm",
        desc: "El EPP paraguayo mantiene vínculos ideológicos y operativos con las disidencias de las FARC. Comparten zonas de narcotráfico (Triple Frontera Brasil-Paraguay-Argentina) e intercambian experiencia en guerra de guerrillas y secuestro."
    },

    {
        from: "british-caribbean", to: "british-atlantic-remote", label: "Territorios RU",
        desc: "Ambos grupos de islas son remanentes del Imperio Británico administrados desde Londres. Comparten el mismo estatus jurídico de 'Territorios Británicos de Ultramar' y el mismo patrón: bases militares, economía dependiente y representación limitada."
    },

    {
        from: "scotland", to: "catalonia", label: "Independentismo europeo",
        desc: "Escocia y Cataluña son los dos movimientos independentistas más importantes de la UE/Europa. El referéndum escocés de 2014 inspiró al catalán de 2017. Ambos enfrentan el mismo dilema: derecho a decidir vs. integridad territorial del Estado."
    },

    {
        from: "kashmir-sep", to: "pak-afg", label: "Insurgencias",
        desc: "La insurgencia baluchi y la guerra contra el TTP compiten por los mismos recursos militares de Pakistán. El BLA ataca infraestructura china (CPEC) en Baluchistán mientras el ejército paquistaní se concentra en la frontera afgana, creando un doble frente interno."
    },

    {
        from: "alberta-separatism", to: "greenland", label: "Presión de Trump",
        desc: "Trump usa tanto Alberta como Groenlandia como herramientas de presión sobre aliados (Canadá y Dinamarca). En Alberta, apoya separatistas para debilitar a Ottawa; con Groenlandia, amenaza con anexión. Ambos casos muestran cómo EE.UU. instrumentaliza la soberanía ajena para sus intereses geoestratégicos."
    },

    {
        from: "puerto-rico", to: "us-territories", label: "Colonias EE.UU.",
        desc: "Puerto Rico, Guam, Samoa Americana y las Islas Vírgenes de EE.UU. comparten el estatus de territorios no incorporados sin representación plena. Sus habitantes son ciudadanos (o nacionales) estadounidenses sin voto presidencial ni representación con voto en el Congreso. Todos figuran en la lista de descolonización de la ONU."
    }
];
