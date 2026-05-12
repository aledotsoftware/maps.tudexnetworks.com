import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');

// Coordenadas del Bounding Box para Bahía Blanca, Argentina
// BBOX: Min_Longitude, Min_Latitude, Max_Longitude, Max_Latitude
const BBOX = '-62.4500,-38.8500,-62.1000,-38.6000';

const run = async () => {
  console.log('🌎 [Map Builder] Iniciando la generación 100% local del mapa (Soberanía de Datos)...');
  
  await fs.mkdir(DATA_DIR, { recursive: true });

  console.log('\n📥 [Paso 1] Descargando y procesando OSM Data con Planetiler...');
  console.log('   (Esto descargará la metadata de Argentina y compilará un archivo Vector Tile .mbtiles específico para Bahía Blanca)');
  
  // Usamos Docker para correr onthegomap/planetiler, el compilador open-source de teselados más rápido del mundo.
  // Automáticamente descarga la data más reciente de Geofabrik.
  const planetilerCmd = `docker run --rm -v "${DATA_DIR}:/data" onthegomap/planetiler:latest --area=argentina --bounds=${BBOX} --output=/data/bahia-blanca.mbtiles`;
  
  try {
    // Ejecutamos la compilación. (Puede tardar entre 1 y 5 minutos dependiendo del hardware y conexión).
    execSync(planetilerCmd, { stdio: 'inherit' });
    
    console.log('\n✅ [Paso 2] Archivo de Teselados (bahia-blanca.mbtiles) generado exitosamente en la carpeta /data.');
    
    console.log('\n🚀 [Paso 3] Para servir el mapa localmente, ejecuta:');
    console.log('   docker-compose up -d');
    
    console.log('\n🎨 [Paso 4] No olvides actualizar y regenerar tu estilo ejecutando:');
    console.log('   node scripts/map-styler.js');
    
  } catch (error) {
    console.error('\n❌ [Error] Falló la generación del mapa. Asegúrate de tener Docker Engine encendido y ejecutándose en tu PC.');
  }
};

run();
