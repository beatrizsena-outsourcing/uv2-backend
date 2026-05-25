/**
 * CONTRATO OFICIAL DO DASHBOARD
 * Tudo que o frontend pode confiar
 */

export const dashboardContract = {
  version: "1.0.0",

  summary: {
    totalVehicles: "number",
    totalKm: "number",
    avgSpeed: "number",
    avgActiveDays: "number"
  },

  ranking: [
    {
      vehicleId: "string",
      km: "number",
      avgSpeed: "number",
      activeDays: "number",
      hourPeak: "string",
      dayPeak: "string|null",
      score: "number"
    }
  ]
};