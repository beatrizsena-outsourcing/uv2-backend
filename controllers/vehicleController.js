import { getVehicleUtilization } from '../services/metabaseService.js';

// =====================================================
// UTILIZAÇÃO (RAW DATA)
// =====================================================
export const fetchVehicleUtilization = async (req, res) => {
  try {
    const data = await getVehicleUtilization();

    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =====================================================
// HEATMAP (FILTROS + GEO DATA RAW)
// =====================================================
export const fetchVehicleHeatmap = async (req, res) => {
  try {
    const data = await getVehicleUtilization();

    let filtered = data;

    const {
      vehicle_id,
      startHour,
      endHour,
      startDate,
      endDate,
      limit
    } = req.query;

    // =========================
    // FILTRO POR VEÍCULO
    // =========================
    if (vehicle_id) {
      filtered = filtered.filter(i => i.vehicle_id === vehicle_id);
    }

    // =========================
    // FILTRO POR HORA
    // =========================
    if (startHour && endHour) {
      filtered = filtered.filter(i => {
        if (!i.hora) return false;

        const hora = Number(String(i.hora).slice(0, 2));

        return hora >= Number(startHour) && hora <= Number(endHour);
      });
    }

    // =========================
    // FILTRO POR DATA
    // =========================
    if (startDate && endDate) {
      filtered = filtered.filter(i => {
        if (!i.data) return false;
        return i.data >= startDate && i.data <= endDate;
      });
    }

    // =========================
    // LIMITE
    // =========================
    const result = filtered.slice(0, Number(limit || 50000));

    return res.json({
      success: true,
      total: result.length,
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =====================================================
// FILTROS (DROPDOWNS)
// =====================================================
export const fetchVehicleFilters = async (req, res) => {
  try {
    const data = await getVehicleUtilization();

    const { vehicle_id } = req.query;

    // =========================
    // LISTA DE VEÍCULOS
    // =========================
    const vehicles = [...new Set(
      data.map(i => i.vehicle_id).filter(Boolean)
    )].map(v => ({
      label: v,
      value: v
    }));

    // =========================
    // APLICA FILTRO OPCIONAL
    // =========================
    let filtered = data;

    if (vehicle_id) {
      filtered = data.filter(i => i.vehicle_id === vehicle_id);
    }

    return res.json({
      success: true,
      data: {
        vehicles,
        total: filtered.length
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};