import express from 'express';

import {
  fetchVehicleUtilization,
  fetchVehicleHeatmap,
  fetchVehicleFilters
} from '../controllers/vehicleController.js';

const router = express.Router();

// =========================
// UTILIZAÇÃO
// =========================
router.get('/utilization', fetchVehicleUtilization);

// =========================
// HEATMAP
// =========================
router.get('/heatmap', fetchVehicleHeatmap);

// =========================
// FILTROS DROPDOWN
// =========================
router.get('/filters', fetchVehicleFilters);

export default router;