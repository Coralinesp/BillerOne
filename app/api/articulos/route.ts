// /app/api/articulos/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function GET() {
  const db = await getDb()
  const r = await db.request().query(`
    SELECT ArticuloID, Descripcion, PrecioUnitario, Estado
    FROM Articulos
    ORDER BY ArticuloID DESC
  `)
  return NextResponse.json(r.recordset)
}

export async function POST(req: Request) {
  const { Descripcion, PrecioUnitario, Estado = 1 } = await req.json()
  const db = await getDb()
  const r = await db
    .request()
    .input("Descripcion", sql.NVarChar(150), Descripcion)
    .input("PrecioUnitario", sql.Decimal(10, 2), PrecioUnitario)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(`
      INSERT INTO Articulos (Descripcion, PrecioUnitario, Estado)
      OUTPUT INSERTED.*
      VALUES (@Descripcion, @PrecioUnitario, @Estado)
    `)
  return NextResponse.json(r.recordset[0], { status: 201 })
}
