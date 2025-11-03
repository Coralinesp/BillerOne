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

// ✅ Permitir actualizar artículos desde la misma ruta
export async function PUT(req: Request) {
  const { ArticuloID, Descripcion, PrecioUnitario, Estado } = await req.json()

  if (!ArticuloID) {
    return NextResponse.json({ error: "Falta el ArticuloID" }, { status: 400 })
  }

  const db = await getDb()
  const r = await db
    .request()
    .input("ArticuloID", sql.Int, ArticuloID)
    .input("Descripcion", sql.NVarChar(150), Descripcion)
    .input("PrecioUnitario", sql.Decimal(10, 2), PrecioUnitario)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(`
      UPDATE Articulos
      SET Descripcion = @Descripcion,
          PrecioUnitario = @PrecioUnitario,
          Estado = @Estado
      OUTPUT INSERTED.*
      WHERE ArticuloID = @ArticuloID
    `)

  if (r.recordset.length === 0) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
  }

  return NextResponse.json(r.recordset[0])
}

// 🔹 Eliminar un artículo
export async function DELETE(req: Request) {
  const { ArticuloID } = await req.json()

  if (!ArticuloID) {
    return NextResponse.json({ error: "Falta el ArticuloID" }, { status: 400 })
  }

  const db = await getDb()
  const result = await db
    .request()
    .input("ArticuloID", sql.Int, ArticuloID)
    .query(`
      DELETE FROM Articulos
      WHERE ArticuloID = @ArticuloID
    `)

  if (result.rowsAffected[0] === 0) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}