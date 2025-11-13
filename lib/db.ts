import { Pool } from "pg"

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "portfolio_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "your_password",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log("[DB] Query executed", { text, duration, rows: res.rowCount })
  return res
}

export default pool
