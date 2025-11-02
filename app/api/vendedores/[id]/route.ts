// /app/api/vendedores/[id]/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  const { Nombre, PorcentajeComision, Estado } = await req.json()
  const db = await getDb()
  const r = await db
    .request()
    .input("VendedorID", sql.Int, id)
    .input("Nombre", sql.NVarChar(100), Nombre)
    .input("PorcentajeComision", sql.Decimal(5, 2), PorcentajeComision)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(`
      UPDATE Vendedores
      SET Nombre=@Nombre,
          PorcentajeComision=@PorcentajeComision,
          Estado=@Estado
      OUTPUT INSERTED.*
      WHERE VendedorID=@VendedorID
    `)
  return NextResponse.json(r.recordset[0] ?? {}, { status: r.recordset[0] ? 200 : 404 })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  const db = await getDb()
  await db.request().input("VendedorID", sql.Int, id).query(`
    DELETE FROM Vendedores WHERE VendedorID=@VendedorID
  `)
  return NextResponse.json({ ok: true })
}
