import { getVehicleUtilization, getFretadaoUtilization } from '../services/metabaseService.js';

// =====================================================
// HELPER — aplica filtros comuns
// =====================================================
function applyFilters(data, { vehicle_id, startHour, endHour, startDate, endDate, limit }) {
  let filtered = data;

  if (vehicle_id) {
    filtered = filtered.filter(i => i.veiculo === vehicle_id);
  }
  if (startHour && endHour) {
    filtered = filtered.filter(i => {
      if (!i.hora) return false;
      const hora = Number(String(i.hora).slice(0, 2));
      return hora >= Number(startHour) && hora <= Number(endHour);
    });
  }
  if (startDate && endDate) {
    filtered = filtered.filter(i => {
      if (!i.data) return false;
      return i.data >= startDate && i.data <= endDate;
    });
  }

  return filtered.slice(0, Number(limit || 50000));
}

// =====================================================
// HELPER — amostra máx N pontos por veículo
// =====================================================
function sampleByVehicle(data, maxPerVehicle = 200) {
  const groups = new Map();
  for (const row of data) {
    const key = row.veiculo || 'unknown';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const result = [];
  for (const [, rows] of groups) {
    if (rows.length <= maxPerVehicle) {
      result.push(...rows);
    } else {
      // Amostragem uniforme
      const step = rows.length / maxPerVehicle;
      for (let i = 0; i < maxPerVehicle; i++) {
        result.push(rows[Math.floor(i * step)]);
      }
    }
  }
  return result;
}

// =====================================================
// VESTAS — UTILIZAÇÃO
// =====================================================
export const fetchVehicleUtilization = async (req, res) => {
  try {
    const { year, month } = req.query;
    const data = await getVehicleUtilization(year, month);
    return res.status(200).json({ success: true, total: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// VESTAS — HEATMAP
// =====================================================
export const fetchVehicleHeatmap = async (req, res) => {
  try {
    const data = await getVehicleUtilization(req.query.year, req.query.month);
    const result = applyFilters(data, req.query);
    return res.json({ success: true, total: result.length, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// VESTAS — FILTROS
// =====================================================
export const fetchVehicleFilters = async (req, res) => {
  try {
    const { year, month, vehicle_id } = req.query;
    const data = await getVehicleUtilization(year, month);
    const vehicles = [...new Set(data.map(i => i.veiculo).filter(Boolean))].map(v => ({ label: v, value: v }));
    let filtered = vehicle_id ? data.filter(i => i.veiculo === vehicle_id) : data;
    return res.json({ success: true, data: { vehicles, total: filtered.length } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// FRETADÃO — HEATMAP (com amostragem por veículo)
// =====================================================
export const fetchFretadaoHeatmap = async (req, res) => {
  try {
    const data = await getFretadaoUtilization(req.query.year, req.query.month);

    // Aplica filtros de veículo/data/hora antes de amostrar
    let filtered = applyFilters(data, { ...req.query, limit: 9999999 });

    // Amostra 200 pontos por veículo para não travar o browser
    const sampled = sampleByVehicle(filtered, 200);

    console.log(`[Fretadão] Total: ${data.length} → filtrado: ${filtered.length} → amostrado: ${sampled.length}`);

    return res.json({ success: true, total: sampled.length, data: sampled });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// FRETADÃO — FILTROS
// =====================================================
export const fetchFretadaoFilters = async (req, res) => {
  try {
    const { year, month, vehicle_id } = req.query;
    const data = await getFretadaoUtilization(year, month);
    const vehicles = [...new Set(data.map(i => i.veiculo).filter(Boolean))].map(v => ({ label: v, value: v }));
    let filtered = vehicle_id ? data.filter(i => i.veiculo === vehicle_id) : data;
    return res.json({ success: true, data: { vehicles, total: filtered.length } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
