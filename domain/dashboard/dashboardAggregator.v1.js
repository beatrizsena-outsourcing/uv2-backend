/**
 * DASHBOARD AGGREGATOR V1
 * Camada de produto (transforma raw → insights)
 */

export function dashboardAggregator(kpiRows) {
  if (!Array.isArray(kpiRows)) return null;

  // =========================
  // INIT
  // =========================
  let totalKm = 0;
  let totalSpeed = 0;
  let totalDays = 0;

  const hourMap = {};
  const dayMap = {};
  const heatmap = [];

  const vehiclesSet = new Set();

  // =========================
  // PROCESSAMENTO
  // =========================
  for (const item of kpiRows) {
    const vehicleId =
      item.vehicle_id ||
      item.veiculo ||
      item.vehicle ||
      item.plate;

    if (!vehicleId || vehicleId === 'UNKNOWN') continue;

    vehiclesSet.add(vehicleId);

    const km = Number(item.km_rodado ?? item.km_rodado_mes ?? 0);
    const speed = Number(item.velocidade ?? item.media_velocidade ?? 0);
    const date = item.data ? new Date(item.data) : null;
    const hour = item.hora ? String(item.hora).slice(0, 2) : null;

    // KM
    if (!isNaN(km)) totalKm += km;

    // SPEED
    if (!isNaN(speed) && speed > 0) totalSpeed += speed;

    // DAYS
    if (date && !isNaN(date.getTime())) {
      totalDays++;
      const dayKey = date.toISOString().slice(0, 10);
      dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
    }

    // HOUR
    if (hour && !isNaN(Number(hour))) {
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    }

    // =========================
    // HEATMAP CORE
    // =========================
    if (item.latitude && item.longitude) {
      heatmap.push({
        lat: Number(item.latitude),
        lng: Number(item.longitude),
        intensity: km > 0 ? Math.min(km / 100, 1) : 0.1,
        vehicleId,
        km
      });
    }
  }

  // =========================
  // HORA MAIS ATIVA
  // =========================
  const horaMaiorAtividade =
    Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // =========================
  // DIA MAIS ATIVO
  // =========================
  const diaMaiorAtividade =
    Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // =========================
  // RESULTADO FINAL
  // =========================
  return {
    kpis: {
      horaMaiorAtividade,
      diaMaiorAtividade,
      diasAtivosMedio: vehiclesSet.size ? totalDays / vehiclesSet.size : 0,
      velocidadeMedia: vehiclesSet.size ? totalSpeed / vehiclesSet.size : 0,
      kmTotal: totalKm
    },

    filters: {
      area: "all",
      placa: "all",
      periodo: null,
      horario: null
    },

    heatmap,

    meta: {
      totalVehicles: vehiclesSet.size
    }
  };
}