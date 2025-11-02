// /app/api/clientes/[id]/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  const body = await req.json()
  const { NombreComercial, RNC_Cedula, CuentaContable, Estado } = body
  const db = await getDb()

  const q = `
    UPDATE Clientes
    SET NombreComercial=@NombreComercial,
        RNC_Cedula=@RNC_Cedula,
        CuentaContable=@CuentaContable,
        Estado=@Estado
    OUTPUT INSERTED.*
    WHERE ClienteID=@ClienteID
  `
  const r = await db
    .request()
    .input("ClienteID", sql.Int, id)
    .input("NombreComercial", sql.NVarChar(100), NombreComercial)
    .input("RNC_Cedula", sql.NVarChar(20), RNC_Cedula)
    .input("CuentaContable", sql.NVarChar(20), CuentaContable || null)
    .input("Estado", sql.Bit, Estado ? 1 : 0)
    .query(q)

  return NextResponse.json(r.recordset[0] ?? {}, { status: r.recordset[0] ? 200 : 404 })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  const db = await getDb()
  await db.request().input("ClienteID", sql.Int, id).query(`
    DELETE FROM Clientes WHERE ClienteID=@ClienteID
  `)
  return NextResponse.json({ ok: true })
}
