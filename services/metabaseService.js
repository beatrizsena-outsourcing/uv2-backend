import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const metabase = axios.create({
  baseURL: process.env.METABASE_URL,
  timeout: 120000
});

async function authenticateMetabase() {
  try {
    const response = await metabase.post('/api/session', {
      username: process.env.METABASE_EMAIL,
      password: process.env.METABASE_PASSWORD
    });
    return response.data.id;
  } catch (err) {
    console.error('Erro ao autenticar no Metabase:', err.message);
    throw err;
  }
}

// =====================================================
// VESTAS — card 5383
// =====================================================
export async function getVehicleUtilization(year, month) {
  try {
    const yearStr = year ? String(year) : String(new Date().getFullYear());
    const monthStr = month ? String(month).padStart(2, '0') : String(new Date().getMonth() + 1).padStart(2, '0');

    console.log(`[Vestas] Buscando dados — ${yearStr}/${monthStr}...`);

    const token = await authenticateMetabase();

    const response = await metabase.post(
      '/api/card/5383/query/json',
      {
        parameters: [
          { type: 'category', target: ['variable', ['template-tag', 'year']], value: yearStr },
          { type: 'category', target: ['variable', ['template-tag', 'month']], value: monthStr }
        ]
      },
      { headers: { 'X-Metabase-Session': token } }
    );

    const data = response.data || [];
    console.log(`[Vestas] Total registros ${yearStr}/${monthStr}:`, data.length);
    return data;
  } catch (err) {
    console.error('[Vestas] Erro ao buscar dados do Metabase:', err.message);
    throw err;
  }
}

// =====================================================
// FRETADÃO — card 5760
// =====================================================
export async function getFretadaoUtilization(year, month) {
  try {
    const yearStr = year ? String(year) : String(new Date().getFullYear());
    const monthStr = month ? String(month).padStart(2, '0') : String(new Date().getMonth() + 1).padStart(2, '0');

    console.log(`[Fretadão] Buscando dados — ${yearStr}/${monthStr}...`);

    const token = await authenticateMetabase();

    const response = await metabase.post(
      '/api/card/5760/query/json',
      {
        parameters: [
          { type: 'category', target: ['variable', ['template-tag', 'year']], value: yearStr },
          { type: 'category', target: ['variable', ['template-tag', 'month']], value: monthStr }
        ]
      },
      { headers: { 'X-Metabase-Session': token } }
    );

    const data = response.data || [];
    console.log(`[Fretadão] Total registros ${yearStr}/${monthStr}:`, data.length);
    return data;
  } catch (err) {
    console.error('[Fretadão] Erro ao buscar dados do Metabase:', err.message);
    throw err;
  }
}
