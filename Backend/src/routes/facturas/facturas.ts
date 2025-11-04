import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index";

const router = Router();

// Middleware para validar Content-Type JSON en POST
router.use((req, res, next) => {
  if (req.method === "POST" && req.headers["content-type"] !== "application/json") {
    return res.status(400).json({ error: "Content-Type debe ser 'application/json'" });
  }
  next();
});

// =================================================================================
// GET /api/facturas  →  Obtener todas las facturas con totales
// =================================================================================
router.get("/", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
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
    `);

    res.status(200).json(r.recordset);
  } catch (error) {
    console.error("Error en GET /api/facturas:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener facturas." });
  }
});

// =================================================================================
// GET /api/facturas/:id  →  Obtener una factura específica con detalle
// =================================================================================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const facturaId = Number(id);
    if (isNaN(facturaId)) return res.status(400).json({ error: "ID de factura inválido." });

    const db = await getDb();

    // Cabecera de factura
    const header = await db.request()
      .input("FacturaID", sql.Int, facturaId)
      .query(`
        SELECT f.FacturaID, f.ClienteID, c.NombreComercial AS Cliente,
               f.VendedorID, v.Nombre AS Vendedor,
               f.Fecha, f.Comentario
        FROM Facturas f
          INNER JOIN Clientes c ON c.ClienteID = f.ClienteID
          INNER JOIN Vendedores v ON v.VendedorID = f.VendedorID
        WHERE f.FacturaID = @FacturaID
      `);

    if (!header.recordset[0]) {
      return res.status(404).json({ error: "Factura no encontrada." });
    }

    // Detalle de factura
    const detalle = await db.request()
      .input("FacturaID", sql.Int, facturaId)
      .query(`
        SELECT d.DetalleID, d.ArticuloID, a.Descripcion, d.Cantidad, d.PrecioUnitario,
               (d.Cantidad * d.PrecioUnitario) AS Importe
        FROM DetalleFactura d
          INNER JOIN Articulos a ON a.ArticuloID = d.ArticuloID
        WHERE d.FacturaID = @FacturaID
      `);

    res.status(200).json({
      ...header.recordset[0],
      Detalle: detalle.recordset,
    });
  } catch (error) {
    console.error("Error en GET /api/facturas/:id:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener factura." });
  }
});

// =================================================================================
// POST /api/facturas  →  Crear una nueva factura con su detalle (transacción)
// =================================================================================
router.post("/", async (req: Request, res: Response) => {
  const { ClienteID, VendedorID, Comentario, Detalle } = req.body;

  if (!ClienteID || !VendedorID || !Array.isArray(Detalle) || Detalle.length === 0) {
    return res.status(400).json({ error: "ClienteID, VendedorID y Detalle son obligatorios." });
  }

  const db = await getDb();
  const tx = new sql.Transaction(db);

  try {
    await tx.begin();

    // Insertar la factura principal
    const fr = await new sql.Request(tx)
      .input("ClienteID", sql.Int, ClienteID)
      .input("VendedorID", sql.Int, VendedorID)
      .input("Comentario", sql.NVarChar(255), Comentario || null)
      .query(`
        INSERT INTO Facturas (ClienteID, VendedorID, Comentario)
        OUTPUT INSERTED.FacturaID
        VALUES (@ClienteID, @VendedorID, @Comentario)
      `);

    const facturaId = fr.recordset[0].FacturaID as number;

    // Insertar los detalles
    for (const item of Detalle as Array<{ ArticuloID: number; Cantidad: number; PrecioUnitario: number }>) {
      await new sql.Request(tx)
        .input("FacturaID", sql.Int, facturaId)
        .input("ArticuloID", sql.Int, item.ArticuloID)
        .input("Cantidad", sql.Int, item.Cantidad)
        .input("PrecioUnitario", sql.Decimal(10, 2), item.PrecioUnitario)
        .query(`
          INSERT INTO DetalleFactura (FacturaID, ArticuloID, Cantidad, PrecioUnitario)
          VALUES (@FacturaID, @ArticuloID, @Cantidad, @PrecioUnitario)
        `);
    }

    await tx.commit();
    res.status(201).json({ FacturaID: facturaId });
  } catch (error) {
    await tx.rollback();
    console.error("Error en POST /api/facturas:", error);
    res.status(500).json({ error: "No se pudo crear la factura.", detail: String(error) });
  }
});

export default router;
