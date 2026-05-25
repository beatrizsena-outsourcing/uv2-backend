import express from 'express';
import {
  getDailyKpis,
  getVehicleKpis,
  getKpiRanking
} from '../services/vehicleKpiQueryService.js';

const router = express.Router();

router.get('/daily', async (req, res) => {
  const data = await getDailyKpis();
  res.json(data);
});

router.get('/vehicle/:vehicleId', async (req, res) => {
  const data = await getVehicleKpis(req.params.vehicleId);
  res.json(data);
});

router.get('/ranking', async (req, res) => {
  const data = await getKpiRanking();
  res.json(data);
});

export default router;