import express from 'express';

import {
  dailyKpis,
  vehicleKpis,
  kpiRanking
} from '../controllers/vehicleKpiQueryController.js';

const router = express.Router();

router.get('/kpis/daily', dailyKpis);

router.get('/kpis/vehicle/:vehicle_id', vehicleKpis);

router.get('/kpis/ranking', kpiRanking);

export default router;