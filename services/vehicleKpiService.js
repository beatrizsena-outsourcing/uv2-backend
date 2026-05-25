import { getVehicleUtilization } from './metabaseService.js';

export async function buildVehicleKpis() {
  try {
    console.log('Calculando KPIs por veículo...');

    const data = await getVehicleUtilization();

    if (!data || !Array.isArray(data)) {
      console.log('Nenhum dado retornado do Metabase');
      return [];
    }

    const grouped = {};

    for (const item of data) {
      const id =
        item.vehicle_id ||
        item.veiculo ||
        item.vehicle ||
        item.plate;

      // =========================
      // VALIDAÇÃO FORTE (NOVA REGRA)
      // =========================
      if (
        !id ||
        id === 'UNKNOWN' ||
        id === 'ALL' ||
        id === 'null' ||
        id === 'undefined'
      ) {
        continue;
      }

      const vehicleId = String(id).trim();

      const key = `${vehicleId}_${item.data || 'no-date'}`;

      if (!grouped[vehicleId]) {
        grouped[vehicleId] = {
          km: 0,
          vel: 0,
          velCount: 0,
          dias: new Set(),
          horas: {},
          keys: new Set()
        };
      }

      const g = grouped[vehicleId];

      // anti duplicação
      if (g.keys.has(key)) continue;
      g.keys.add(key);

      // KM
      const km = Number(item.km_rodado_mes ?? item.km_rodado ?? 0);

      if (!isNaN(km) && km >= 0 && km < 10000) {
        g.km += km;
      }

      // velocidade
      const vel = Number(item.velocidade);
      if (!isNaN(vel) && vel > 0 && vel < 200) {
        g.vel += vel;
        g.velCount++;
      }

      // dias ativos
      if (item.data) {
        const date = new Date(item.data);
        if (!isNaN(date.getTime())) {
          g.dias.add(date.toISOString().slice(0, 10));
        }
      }

      // hora pico
      if (item.hora != null) {
        const h = String(item.hora).substring(0, 2);
        if (!isNaN(Number(h))) {
          g.horas[h] = (g.horas[h] || 0) + 1;
        }
      }
    }

    const result = Object.entries(grouped).map(([vehicle_id, v]) => {
      const horaPico =
        Object.entries(v.horas)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      const mediaVelocidade =
        v.velCount > 0 ? v.vel / v.velCount : 0;

      return {
        vehicle_id,
        kmRodado: Math.round(v.km),
        mediaVelocidade: Number(mediaVelocidade.toFixed(2)),
        diasAtivos: v.dias.size,
        horaPico,
        diaPico: null
      };
    });

    console.log(`KPIs gerados: ${result.length} veículos`);

    return result;

  } catch (err) {
    console.error('Erro buildVehicleKpis:', err.message);
    return [];
  }
}