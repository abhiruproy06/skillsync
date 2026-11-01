import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let isConnected: boolean | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'skillsync_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });
  }
  return pool;
}

export async function testConnection(): Promise<boolean> {
  if (isConnected !== null) return isConnected;
  try {
    const p = getPool();
    const conn = await p.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    return true;
  } catch (err) {
    console.warn('MySQL connection unavailable or access denied. Using fallback mock layer for demo.', err);
    isConnected = false;
    return false;
  }
}

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const online = await testConnection();
  if (online) {
    try {
      const p = getPool();
      const [rows] = await p.execute(sql, params as any);
      return rows as T;
    } catch (err) {
      console.error('MySQL query error:', err);
      throw err;
    }
  }
  // If offline, throw to allow fallback handler
  throw new Error('DATABASE_OFFLINE');
}

export async function queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}
