import '../config/env.js';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import db from '../db/index.js';

async function test() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('🟢 CONEXÃO OK:', result.rows[0]);
  } catch (err) {
    console.error('🔴 ERRO COMPLETO:', err);
  }
}

test();