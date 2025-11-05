// /app/api/facturas/[id]/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  const db = await getDb()

  const header = await db.request().input("FacturaID", sql.Int, id).query(`
    SELECT f.FacturaID, f.ClienteID, c.NombreComercial AS Cliente,
           f.VendedorID, v.Nombre AS Vendedor,
           f.Fecha, f.Comentario
    FROM Facturas f
      INNER JOIN Clientes c ON c.ClienteID = f.ClienteID
      INNER JOIN Vendedores v ON v.VendedorID = f.VendedorID
    WHERE f.FacturaID=@FacturaID
  `)

  const detalle = await db.request().input("FacturaID", sql.Int, id).query(`
    SELECT d.DetalleID, d.ArticuloID, a.Descripcion, d.Cantidad, d.PrecioUnitario,
           (d.Cantidad*d.PrecioUnitario) AS Importe
    FROM DetalleFactura d
      INNER JOIN Articulos a ON a.ArticuloID = d.ArticuloID
    WHERE d.FacturaID=@FacturaID
  `)

  if (!header.recordset[0]) return NextResponse.json({}, { status: 404 })

  return NextResponse.json({
    ...header.recordset[0],
    Detalle: detalle.recordset,
  })
}
