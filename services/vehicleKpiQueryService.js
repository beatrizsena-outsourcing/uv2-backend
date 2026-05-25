import pool from '../db/pool.js';

// =====================================================
// SALVAR KPIs
// =====================================================
export async function saveVehicleKpis(kpisArray) {
  try {
    console.log('Salvando KPIs no Postgres...');

    for (const kpi of kpisArray) {
      await pool.query(
        `
        INSERT INTO vehicle_kpis_daily (
          vehicle_id,
          data,
          media_velocidade,
          km_rodado,
          dias_ativo,
          hora_pico,
          dia_pico
        )
        VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6)
        ON CONFLICT (vehicle_id, data)
        DO UPDATE SET
          media_velocidade = EXCLUDED.media_velocidade,
          km_rodado = EXCLUDED.km_rodado,
          dias_ativo = EXCLUDED.dias_ativo,
          hora_pico = EXCLUDED.hora_pico,
          dia_pico = EXCLUDED.dia_pico
        `,
        [
          kpi.vehicle_id,
          kpi.mediaVelocidade,
          kpi.kmRodado,
          kpi.diasAtivos,
          kpi.horaPico,
          kpi.diaPico
        ]
      );
    }

    console.log('KPIs salvos no Postgres com sucesso');
  } catch (err) {
    console.error('Erro saveVehicleKpis:', err.message);
  }
}

// =====================================================
// KPI DO DIA
// =====================================================
export async function getDailyKpis() {
  const result = await pool.query(`
    SELECT *
    FROM vehicle_kpis_daily
    WHERE data = CURRENT_DATE
    ORDER BY km_rodado DESC
  `);

  return result.rows;
}

// =====================================================
// KPI POR VEÍCULO
// =====================================================
export async function getVehicleKpis(vehicleId) {
  const result = await pool.query(`
    SELECT *
    FROM vehicle_kpis_daily
    WHERE vehicle_id = $1
    ORDER BY data DESC
  `, [vehicleId]);

  return result.rows;
}

// =====================================================
// RANKING
// =====================================================
export async function getKpiRanking() {
  const result = await pool.query(`
    SELECT
      vehicle_id,
      AVG(media_velocidade) AS media_velocidade,
      SUM(km_rodado) AS km_total,
      COUNT(*) AS dias_registrados
    FROM vehicle_kpis_daily
    GROUP BY vehicle_id
    ORDER BY km_total DESC
  `);

  return result.rows;
}