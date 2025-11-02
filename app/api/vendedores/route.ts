// /app/api/vendedores/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function GET() {
  const db = await getDb()
  const r = await db.request().query(`
    SELECT VendedorID, Nombre, PorcentajeComision, Estado
    FROM Vendedores
    ORDER BY VendedorID DESC
  `)
  return NextResponse.json(r.recordset)
}

export async function POST(req: Request) {
  const { Nombre, PorcentajeComision = 0, Estado = 1 } = await req.json()
  const db = await getDb()
  const r = await db
    .request()
    .input("Nombre", sql.NVarChar(100), Nombre)
    .input("PorcentajeComision", sql.Decimal(5, 2), PorcentajeComision)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(`
      INSERT INTO Vendedores (Nombre, PorcentajeComision, Estado)
      OUTPUT INSERTED.*
      VALUES (@Nombre, @PorcentajeComision, @Estado)
    `)
  return NextResponse.json(r.recordset[0], { status: 201 })
}
