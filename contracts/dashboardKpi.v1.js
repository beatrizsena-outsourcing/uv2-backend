export const DASHBOARD_KPIS_V1_CONTRACT = {
  version: "v1",

  responseShape: {
    success: "boolean",
    version: "v1",
    generatedAt: "ISO_STRING",

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
  }
};