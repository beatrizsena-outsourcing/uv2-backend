import '../config/env.js';
import db from '../db/index.js';

async function check() {
  const result = await db.query('SELECT * FROM vehicle_kpis_daily');

  console.log('📊 REGISTROS NO BANCO:');
  console.table(result.rows);
}

check();