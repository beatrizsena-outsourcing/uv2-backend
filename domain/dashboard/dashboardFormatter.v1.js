/**
 * DASHBOARD FORMATTER V1
 * Contrato oficial do produto
 */

export function dashboardFormatterV1({ aggregator, ranking }) {
  if (!aggregator) return null;

  return {
    success: true,
    version: "v1",
    generatedAt: new Date().toISOString(),

    summary: {
      totalVehicles: aggregator.meta.totalVehicles,
      totalKm: Math.round(aggregator.kpis.kmTotal),
      avgSpeed: Number(aggregator.kpis.velocidadeMedia.toFixed(2)),
      avgActiveDays: Number(aggregator.kpis.diasAtivosMedio.toFixed(2))
    },

    kpis: aggregator.kpis,

    filters: aggregator.filters,

    heatmap: aggregator.heatmap,

    ranking: ranking
  };
}