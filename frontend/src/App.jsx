import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';

import {
  MapContainer,
  TileLayer,
  useMap
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

function HeatLayer({ points }) {

  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {

    if (!points.length) return;

    const heatPoints = points.map(p => [
      p.latitude,
      p.longitude,
      0.5
    ]);

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    layerRef.current = L.heatLayer(heatPoints, {
      radius: 18,
      blur: 22,
      maxZoom: 17,
      minOpacity: 0.4
    });

    layerRef.current.addTo(map);

  }, [points, map]);

  return null;
}

export default function App() {

  const [points, setPoints] = useState([]);

  const [areas, setAreas] = useState([]);
  const [plates, setPlates] = useState([]);

  const [area, setArea] = useState('');
  const [plate, setPlate] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [startHour, setStartHour] = useState(6);
  const [endHour, setEndHour] = useState(18);

  const [kpis, setKpis] = useState({
    mediaVelocidade: 0,
    kmRodado: 0,
    diasAtivos: 0,
    horaPico: '-',
    diaPico: '-'
  });

  // =========================
  // debounce simples (melhora performance troca área)
  // =========================
  const debounceRef = useRef(null);

  const loadFilters = async (selectedArea = '') => {

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {

      try {

        const url = selectedArea
          ? `http://localhost:3000/vehicles/filters?area=${selectedArea}`
          : `http://localhost:3000/vehicles/filters`;

        const res = await axios.get(url);

        setAreas(res.data.data.areas || []);
        setPlates(res.data.data.plates || []);

      } catch (err) {
        console.error(err.message);
      }

    }, 200); // 🔥 acelera UI
  };

  const fetchHeatmap = async () => {

    const url =
      `http://localhost:3000/vehicles/heatmap` +
      `?area=${area}` +
      `&plate=${plate}` +
      `&startDate=${startDate}` +
      `&endDate=${endDate}` +
      `&startHour=${startHour}` +
      `&endHour=${endHour}`;

    const res = await axios.get(url);
    setPoints(res.data.data || []);
  };

  const fetchKpis = async () => {

    const url =
      `http://localhost:3000/vehicles/kpis` +
      `?area=${area}` +
      `&plate=${plate}` +
      `&startDate=${startDate}` +
      `&endDate=${endDate}` +
      `&startHour=${startHour}` +
      `&endHour=${endHour}`;

    const res = await axios.get(url);

    const data = res.data?.data;

    setKpis({
      mediaVelocidade: data?.mediaVelocidade ?? 0,
      kmRodado: data?.kmRodado ?? 0,
      diasAtivos: data?.diasAtivos ?? 0,
      horaPico: data?.horaPico ?? '-',
      diaPico: data?.diaPico ?? '-'
    });
  };

  const handleAreaChange = (value) => {
    setArea(value);
    setPlate('');
    loadFilters(value); // 🔥 agora não bloqueia UI
  };

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    fetchHeatmap();
    fetchKpis();
  }, [area, plate, startDate, endDate, startHour, endHour]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>

      {/* ================= FILTROS ================= */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 9999,
          background: '#fff',
          padding: 10,
          borderRadius: 10,
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap'
        }}
      >

        <select value={area} onChange={(e) => handleAreaChange(e.target.value)}>
          <option value="">Todas as áreas</option>
          {areas.map((a, i) => (
            <option key={i} value={a.value}>{a.label}</option>
          ))}
        </select>

        <select value={plate} onChange={(e) => setPlate(e.target.value)}>
          <option value="">Todas as placas</option>
          {plates.map((p, i) => (
            <option key={i} value={p.value}>{p.label}</option>
          ))}
        </select>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <input type="number" value={startHour} onChange={(e) => setStartHour(e.target.value)} />
        <input type="number" value={endHour} onChange={(e) => setEndHour(e.target.value)} />

      </div>

      {/* ================= KPIs (AGORA ABAIXO DOS FILTROS, VISÍVEIS) ================= */}
      <div
        style={{
          position: 'absolute',
          top: 70, // 🔥 abaixo dos filtros
          left: 10,
          zIndex: 9998,
          background: '#fff',
          padding: 12,
          borderRadius: 10,
          display: 'flex',
          gap: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
        }}
      >

        <div><strong>Vel Média</strong><br />{kpis.mediaVelocidade}</div>
        <div><strong>Km</strong><br />{kpis.kmRodado}</div>
        <div><strong>Dias</strong><br />{kpis.diasAtivos}</div>
        <div><strong>Hora Pico</strong><br />{kpis.horaPico}</div>
        <div><strong>Dia Pico</strong><br />{kpis.diaPico}</div>

      </div>

      {/* ================= MAPA ================= */}
      <MapContainer
        center={[-5.8, -35.2]}
        zoom={7}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <HeatLayer points={points} />
      </MapContainer>

    </div>
  );
}