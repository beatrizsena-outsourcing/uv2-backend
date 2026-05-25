import { buildVehicleKpis } from './vehicleKpiService.js';
import { formatDashboardKpis } from './dashboardFormatter.js';

export async function getDashboardKpis() {
  try {
    console.log('🔄 Gerando dashboard...');

    // 1. pega KPIs por veículo
    const kpis = await buildVehicleKpis();

    if (!kpis || kpis.length === 0) {
      return {
        success: false,
        message: 'Nenhum KPI encontrado'
      };
    }

    // 2. transforma em formato de produto
    const dashboard = formatDashboardKpis(kpis);

    return dashboard;

  } catch (err) {
    console.error('Erro dashboard:', err.message);

    return {
      success: false,
      message: err.message
    };
  }
}