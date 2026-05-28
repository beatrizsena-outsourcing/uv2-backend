import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import vehRoutes from './routes/vehicleRoutes.js';
import kpiRoutes from './routes/vehicleKpisRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import { startKpiScheduler } from './jobs/kpiJob.js';

dotenv.config();

const app = express();

// =========================
// CORS
// =========================
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Bloqueado pelo CORS: ' + origin));
  },
  credentials: true
}));

app.use(express.json());

// =========================
// LEGACY
// =========================
app.use('/vehicles', vehRoutes);
app.use('/api/kpis', kpiRoutes);

// =========================
// PRODUCT API (DASHBOARD)
// =========================
app.use('/api/dashboard', dashboardRoutes);

// =========================
// HEALTH
// =========================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'vehicle-utilization-backend',
    time: new Date().toISOString()
  });
});

// =========================
// SCHEDULER
// =========================
startKpiScheduler();

// =========================
// START
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

