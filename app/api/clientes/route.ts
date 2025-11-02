// /app/api/clientes/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function GET() {
  const db = await getDb()
  const result = await db.request().query(`
    SELECT ClienteID, NombreComercial, RNC_Cedula, CuentaContable, Estado
    FROM Clientes
    ORDER BY ClienteID DESC
  `)
  return NextResponse.json(result.recordset)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { NombreComercial, RNC_Cedula, CuentaContable, Estado = 1 } = body
  const db = await getDb()

  const q = `
    INSERT INTO Clientes (NombreComercial, RNC_Cedula, CuentaContable, Estado)
    OUTPUT INSERTED.*
    VALUES (@NombreComercial, @RNC_Cedula, @CuentaContable, @Estado)
  `
  const r = await db
    .request()
    .input("NombreComercial", sql.NVarChar(100), NombreComercial)
    .input("RNC_Cedula", sql.NVarChar(20), RNC_Cedula)
    .input("CuentaContable", sql.NVarChar(20), CuentaContable || null)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(q)

  return NextResponse.json(r.recordset[0], { status: 201 })
}
