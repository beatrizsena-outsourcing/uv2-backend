import { calculateVehicleScore } from "../domain/score/vehicleScore.v1.js";

export function dashboardFormatter(kpiRows) {
  if (!Array.isArray(kpiRows)) {
    return {
      success: false,
      version: "v1",
      generatedAt: new Date().toISOString(),
      summary: {
        totalVehicles: 0,
        totalKm: 0,
        avgSpeed: 0,
        avgActiveDays: 0
      },
      ranking: []
    };
  }

  let totalKm = 0;
  let totalSpeed = 0;
  let totalActiveDays = 0;

  const ranking = kpiRows.map(v => {
    const km = Number(v.km_rodado || v.km || 0);
    const speed = Number(v.media_velocidade || v.avgSpeed || 0);
    const days = Number(v.dias_ativo || v.activeDays || 0);

    totalKm += km;
    totalSpeed += speed;
    totalActiveDays += days;

    return {
      vehicleId: v.vehicle_id,
      km,
      avgSpeed: Number(speed.toFixed(2)),
      activeDays: days,
      hourPeak: v.hora_pico || "-",
      dayPeak: v.dia_pico || null,

      // SCORE OFICIAL (ÚNICA FONTE)
      score: calculateVehicleScore({
        km,
        avgSpeed: speed,
        activeDays: days
      })
    };
  });

  ranking.sort((a, b) => b.score - a.score);

  return {
    success: true,
    version: "v1",
    generatedAt: new Date().toISOString(),

    summary: {
      totalVehicles: kpiRows.length,
      totalKm: Math.round(totalKm),
      avgSpeed: Number((totalSpeed / kpiRows.length).toFixed(2)),
      avgActiveDays: Number((totalActiveDays / kpiRows.length).toFixed(2))
    },

    ranking
  };
}