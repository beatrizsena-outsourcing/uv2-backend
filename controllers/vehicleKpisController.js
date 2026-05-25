import { readKpis } from '../services/kpiStorage.js';

export function fetchVehicleKpis(req, res) {
  try {
    const data = readKpis();

    if (!data) {
      return res.json({
        success: false,
        data: {
          mediaVelocidade: 0,
          kmRodado: 0,
          diasAtivos: 0,
          horaPico: '-',
          diaPico: '-'
        }
      });
    }

    return res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error('Erro KPI API:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar KPIs'
    });
  }
}