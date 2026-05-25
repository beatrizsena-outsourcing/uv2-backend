import fs from 'fs';

const FILE_PATH = './src/storage/kpis.json';

// lê KPIs do disco
export function readKpis() {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro lendo KPIs:', err.message);
    return null;
  }
}

// salva KPIs no disco
export function writeKpis(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro salvando KPIs:', err.message);
  }
}