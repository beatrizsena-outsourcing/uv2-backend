import pg from 'pg';
import dns from 'dns';
import { env } from '../config/env.js';

dns.setDefaultResultOrder('ipv4first');

const { Pool } = pg;

const pool = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('🟢 Conectado ao Supabase Postgres');
});

export default pool;