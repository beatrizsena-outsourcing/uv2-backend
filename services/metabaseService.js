import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const metabase = axios.create({
  baseURL: process.env.METABASE_URL,
  timeout: 120000
});

/**
 * =========================
 * AUTENTICAÇÃO METABASE
 * =========================
 */
async function authenticateMetabase() {
  try {
    const response = await metabase.post('/api/session', {
      username: process.env.METABASE_EMAIL,
      password: process.env.METABASE_PASSWORD
    });

    return response.data.id;

  } catch (err) {
    console.error('❌ Erro autenticação Metabase:', err.message);
    throw err;
  }
}

/**
 * =========================
 * BUSCA DADOS VEÍCULO
 * =========================
 */
export async function getVehicleUtilization() {
  try {
    console.log('🔄 Buscando dados do Metabase...');

    const token = await authenticateMetabase();

    const response = await metabase.post(
      '/api/card/5383/query/json',
      {},
      {
        headers: {
          'X-Metabase-Session': token
        }
      }
    );

    const data = response.data || [];

    // =========================
    // DEBUG CRÍTICO (IMPORTANTE)
    // =========================
    console.log('📊 TOTAL REGISTROS:', data.length);

    if (data.length > 0) {
      console.log('📊 EXEMPLO ITEM METABASE:', data[0]);
    } else {
      console.warn('⚠️ Metabase retornou vazio');
    }

    return data;

  } catch (err) {
    console.error('❌ Erro getVehicleUtilization:', err.message);
    return [];
  }
}