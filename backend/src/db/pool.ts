import { Pool, PoolConfig } from 'pg';
import { env } from '../config/env';

const poolConfig: PoolConfig = {
  host:     env.DB_HOST,
  port:     env.DB_PORT,
  database: env.DB_NAME,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
  max:      10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
};

export const pool = new Pool(poolConfig);

/**
 * Verifica la conexión a PostgreSQL ejecutando SELECT NOW().
 * Lanza un error si la conexión falla.
 */
export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query<{ now: Date }>('SELECT NOW()');
    console.log(`✅ PostgreSQL connected — server time: ${result.rows[0].now}`);
  } finally {
    client.release();
  }
}
