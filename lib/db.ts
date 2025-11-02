// /lib/db.ts
import sql, { config as SqlConfig, ConnectionPool } from "mssql"

let pool: ConnectionPool | null = null

const config: SqlConfig = {
  server: process.env.MSSQL_SERVER || "localhost",
  database: process.env.MSSQL_DATABASE || "BillerOne",
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: (process.env.MSSQL_ENCRYPT || "false").toLowerCase() === "true",
    trustServerCertificate:
      (process.env.MSSQL_TRUST_SERVER_CERTIFICATE || "true").toLowerCase() === "true",
  },
  port: process.env.MSSQL_PORT ? parseInt(process.env.MSSQL_PORT, 10) : 1433,
}

export async function getDb() {
  if (pool) return pool
  pool = await new sql.ConnectionPool(config).connect()
  return pool
}

export { sql }
