import express from 'express';
import { buildVehicleKpis } from '../services/vehicleKpiService.js';
import { dashboardAggregator } from '../domain/dashboard/dashboardAggregator.v1.js';
import { dashboardFormatterV1 } from '../domain/dashboard/dashboardFormatter.v1.js';

const router = express.Router();

router.get('/kpis', async (req, res) => {
  try {
    // 1. RAW DATA
    const raw = await buildVehicleKpis();

    // 2. AGGREGATION (produto)
    const aggregator = dashboardAggregator(raw);

    // 3. RANKING (derivado simples)
    const ranking = raw
      .map(v => ({
        vehicleId: v.vehicle_id,
        km: v.kmRodado,
        avgSpeed: v.mediaVelocidade,
        activeDays: v.diasAtivos,
        hourPeak: v.horaPico,
        dayPeak: null,
        score:
          v.kmRodado * 0.6 +
          v.mediaVelocidade * 0.3 +
          v.diasAtivos * 0.1
      }))
      .sort((a, b) => b.score - a.score);

    // 4. CONTRACT V1
    const response = dashboardFormatterV1({
      aggregator,
      ranking
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;