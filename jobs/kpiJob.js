import { buildVehicleKpis } from '../services/vehicleKpiService.js';
import { saveVehicleKpis } from '../services/vehicleKpiQueryService.js';

export async function refreshKpis() {
  try {
    console.log('Iniciando KPI JOB...');

    const kpis = await buildVehicleKpis();

    if (!kpis.length) {
      console.log('Nenhum KPI gerado');
      return;
    }

    console.log(`KPIs gerados: ${kpis.length} veículos`);

    await saveVehicleKpis(kpis);

    console.log('KPIs por veículo atualizados com sucesso');

  } catch (err) {
    console.error('Erro KPI JOB:', err.message);
  }
}