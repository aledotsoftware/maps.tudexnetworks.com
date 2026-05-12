import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = new pg.Pool({ connectionString: process.env.DB_URL });

// Endpoint para recibir GeoJSON de la comunidad
app.post('/api/v1/layers/upload', async (req, res) => {
  const { name, geojson, metadata } = req.body;
  
  try {
    const client = await pool.connect();
    // Parsear FeatureCollection e insertar en PostGIS
    for (const feature of geojson.features) {
      const query = `
        INSERT INTO community_layers.features (name, metadata, geom)
        VALUES ($1, $2, ST_GeomFromGeoJSON($3))
      `;
      await client.query(query, [name, metadata, JSON.stringify(feature.geometry)]);
    }
    client.release();
    res.status(201).json({ status: 'success', message: 'Layer indexed in PostGIS' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process geometry' });
  }
});

app.listen(4000, () => console.log('🚀 GeoCore API running on port 4000'));
