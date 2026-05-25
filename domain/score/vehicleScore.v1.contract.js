export const VEHICLE_SCORE_V1_CONTRACT = {
  version: "v1",

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