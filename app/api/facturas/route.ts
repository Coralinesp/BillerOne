// /app/api/facturas/route.ts
import { NextResponse } from "next/server"
import { getDb, sql } from "@/lib/db"

export async function GET() {
  const db = await getDb()
  const r = await db.request().query(`
    SELECT f.FacturaID, f.ClienteID, c.NombreComercial AS Cliente,
           f.VendedorID, v.Nombre AS Vendedor,
           f.Fecha, f.Comentario,
           SUM(d.Cantidad * d.PrecioUnitario) AS Total
    FROM Facturas f
      INNER JOIN Clientes c ON c.ClienteID = f.ClienteID
      INNER JOIN Vendedores v ON v.VendedorID = f.VendedorID
      LEFT JOIN DetalleFactura d ON d.FacturaID = f.FacturaID
    GROUP BY f.FacturaID, f.ClienteID, c.NombreComercial, f.VendedorID, v.Nombre, f.Fecha, f.Comentario
    ORDER BY f.FacturaID DESC
  `)
  return NextResponse.json(r.recordset)
}

export async function POST(req: Request) {
  const { ClienteID, VendedorID, Comentario, Detalle } = await req.json()
  // Detalle: Array<{ ArticuloID:number, Cantidad:number, PrecioUnitario:number }>
  const db = await getDb()
  const tx = new sql.Transaction(db)
  await tx.begin()

  try {
    const fr = await new sql.Request(tx)
      .input("ClienteID", sql.Int, ClienteID)
      .input("VendedorID", sql.Int, VendedorID)
      .input("Comentario", sql.NVarChar(255), Comentario || null)
      .query(`
        INSERT INTO Facturas (ClienteID, VendedorID, Comentario)
        OUTPUT INSERTED.FacturaID
        VALUES (@ClienteID, @VendedorID, @Comentario)
      `)

    const facturaId = fr.recordset[0].FacturaID as number

    for (const item of Detalle as Array<{ArticuloID:number; Cantidad:number; PrecioUnitario:number}>) {
      await new sql.Request(tx)
        .input("FacturaID", sql.Int, facturaId)
        .input("ArticuloID", sql.Int, item.ArticuloID)
        .input("Cantidad", sql.Int, item.Cantidad)
        .input("PrecioUnitario", sql.Decimal(10,2), item.PrecioUnitario)
        .query(`
          INSERT INTO DetalleFactura (FacturaID, ArticuloID, Cantidad, PrecioUnitario)
          VALUES (@FacturaID, @ArticuloID, @Cantidad, @PrecioUnitario)
        `)
    }

    await tx.commit()
    return NextResponse.json({ FacturaID: facturaId }, { status: 201 })
  } catch (e) {
    await tx.rollback()
    return NextResponse.json({ error: "No se pudo crear la factura", detail: String(e) }, { status: 500 })
  }
}
