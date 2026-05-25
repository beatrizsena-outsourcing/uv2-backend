import { refreshKpis } from '../jobs/kpiJob.js';

export function startJobs() {
  console.log('Iniciando jobs...');

  // roda imediatamente
  refreshKpis();

  // depois agenda (ex: 5 min)
  setInterval(() => {
    refreshKpis();
  }, 5 * 60 * 1000);
}