import express from 'express';

import {
  fetchVehicleUtilization,
  fetchVehicleHeatmap,
  fetchVehicleFilters,
  fetchFretadaoHeatmap,
  fetchFretadaoFilters
} from '../controllers/vehicleController.js';

const router = express.Router();

// =========================
// VESTAS
// =========================
router.get('/utilization', fetchVehicleUtilization);
router.get('/heatmap', fetchVehicleHeatmap);
router.get('/filters', fetchVehicleFilters);

// =========================
// FRETADÃO
// =========================
router.get('/fretadao/heatmap', fetchFretadaoHeatmap);
router.get('/fretadao/filters', fetchFretadaoFilters);

export default router;
