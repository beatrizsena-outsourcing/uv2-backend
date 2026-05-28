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
// HELPER — agrupa pontos geográficos próximos
// Mantém densidade proporcional com menos pontos
// precision=2 → células de ~1km
// =====================================================
function clusterPoints(data, precision = 2) {
  const cells = new Map();

  for (const row of data) {
    const lat = parseFloat(row.latitude || 0).toFixed(precision);
    const lon = parseFloat(row.longitude || 0).toFixed(precision);
    const key = `${lat},${lon}`;

    if (!cells.has(key)) {
      cells.set(key, { ...row, _count: 1, _latSum: parseFloat(row.latitude || 0), _lonSum: parseFloat(row.longitude || 0) });
    } else {
      const cell = cells.get(key);
      cell._count++;
      cell._latSum += parseFloat(row.latitude || 0);
      cell._lonSum += parseFloat(row.longitude || 0);
    }
  }

  return Array.from(cells.values()).map(cell => ({
    ...cell,
    latitude: cell._latSum / cell._count,
    longitude: cell._lonSum / cell._count,
    _intensity: cell._count,
  }));
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
// FRETADÃO — HEATMAP (com clustering geográfico)
// =====================================================
export const fetchFretadaoHeatmap = async (req, res) => {
  try {
    const data = await getFretadaoUtilization(req.query.year, req.query.month);

    // Aplica filtros sem limite
    let filtered = applyFilters(data, { ...req.query, limit: 9999999 });

    // Agrupa pontos próximos — mantém densidade proporcional
    const clustered = clusterPoints(filtered, 2);

    console.log(`[Fretadão] Total: ${data.length} → filtrado: ${filtered.length} → clusterizado: ${clustered.length}`);

    return res.json({ success: true, total: clustered.length, data: clustered });
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
