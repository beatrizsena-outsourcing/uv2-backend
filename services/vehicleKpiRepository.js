import pool from '../db/pool.js';

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
    console.error('Erro ao salvar KPIs:', err.message);
  }
}