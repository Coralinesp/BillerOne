// /app/api/articulos/[id]/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  const { Descripcion, PrecioUnitario, Estado } = await req.json()
  const db = await getDb()
  const r = await db
    .request()
    .input("ArticuloID", sql.Int, id)
    .input("Descripcion", sql.NVarChar(150), Descripcion)
    .input("PrecioUnitario", sql.Decimal(10, 2), PrecioUnitario)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(`
      UPDATE Articulos
      SET Descripcion=@Descripcion, PrecioUnitario=@PrecioUnitario, Estado=@Estado
      OUTPUT INSERTED.*
      WHERE ArticuloID=@ArticuloID
    `)
  return NextResponse.json(r.recordset[0] ?? {}, { status: r.recordset[0] ? 200 : 404 })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  const db = await getDb()
  await db.request().input("ArticuloID", sql.Int, id).query(`
    DELETE FROM Articulos WHERE ArticuloID=@ArticuloID
  `)
  return NextResponse.json({ ok: true })
}
