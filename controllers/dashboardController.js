import { getDashboardKpis } from '../services/dashboardService.js';

export async function fetchDashboardKpis(req, res) {
  try {
    const result = await getDashboardKpis();

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}