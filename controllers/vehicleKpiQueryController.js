import {
  getDailyKpis,
  getVehicleKpis,
  getKpiRanking
} from '../services/vehicleKpiQueryService.js';

export async function dailyKpis(req, res) {
  try {
    const data = await getDailyKpis();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function vehicleKpis(req, res) {
  try {
    const data = await getVehicleKpis(req.params.vehicle_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function kpiRanking(req, res) {
  try {
    const data = await getKpiRanking();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}