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
// GET /api/detalle-factura  →  Obtener todos los detalles de facturas
// =================================================================================
router.get("/", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const r = await db.request().query(`
      SELECT TOP (1000) 
        d.DetalleID,
        d.FacturaID,
        d.ArticuloID,
        a.Descripcion AS ArticuloDescripcion,
        d.Cantidad,
        d.PrecioUnitario,
        (d.Cantidad * d.PrecioUnitario) AS Importe
      FROM DetalleFactura d
        INNER JOIN Articulos a ON a.ArticuloID = d.ArticuloID
      ORDER BY d.DetalleID DESC
    `);

    res.status(200).json(r.recordset);
  } catch (error) {
    console.error("Error en GET /api/detalle-factura:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener detalles de facturas." });
  }
});

// =================================================================================
// GET /api/detalle-factura/:id  →  Obtener un detalle específico por DetalleID
// =================================================================================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalleId = Number(id);
    if (isNaN(detalleId)) return res.status(400).json({ error: "ID de detalle inválido." });

    const db = await getDb();
    const r = await db.request()
      .input("DetalleID", sql.Int, detalleId)
      .query(`
        SELECT 
          d.DetalleID,
          d.FacturaID,
          d.ArticuloID,
          a.Descripcion AS ArticuloDescripcion,
          d.Cantidad,
          d.PrecioUnitario,
          (d.Cantidad * d.PrecioUnitario) AS Importe
        FROM DetalleFactura d
          INNER JOIN Articulos a ON a.ArticuloID = d.ArticuloID
        WHERE d.DetalleID = @DetalleID
      `);

    if (!r.recordset[0]) {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en GET /api/detalle-factura/:id:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener detalle." });
  }
});

// =================================================================================
// GET /api/detalle-factura/factura/:facturaId  →  Obtener detalles por FacturaID
// =================================================================================
router.get("/factura/:facturaId", async (req: Request, res: Response) => {
  try {
    const { facturaId } = req.params;
    const fId = Number(facturaId);
    if (isNaN(fId)) return res.status(400).json({ error: "ID de factura inválido." });

    const db = await getDb();
    const r = await db.request()
      .input("FacturaID", sql.Int, fId)
      .query(`
        SELECT 
          d.DetalleID,
          d.FacturaID,
          d.ArticuloID,
          a.Descripcion AS ArticuloDescripcion,
          d.Cantidad,
          d.PrecioUnitario,
          (d.Cantidad * d.PrecioUnitario) AS Importe
        FROM DetalleFactura d
          INNER JOIN Articulos a ON a.ArticuloID = d.ArticuloID
        WHERE d.FacturaID = @FacturaID
        ORDER BY d.DetalleID
      `);

    res.status(200).json(r.recordset);
  } catch (error) {
    console.error("Error en GET /api/detalle-factura/factura/:facturaId:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener detalles de factura." });
  }
});

// =================================================================================
// POST /api/detalle-factura  →  Crear un nuevo detalle de factura
// =================================================================================
router.post("/", async (req: Request, res: Response) => {
  const { FacturaID, ArticuloID, Cantidad, PrecioUnitario } = req.body;

  if (!FacturaID || !ArticuloID || !Cantidad || !PrecioUnitario) {
    return res.status(400).json({ 
      error: "FacturaID, ArticuloID, Cantidad y PrecioUnitario son obligatorios." 
    });
  }

  try {
    const db = await getDb();
    const r = await db.request()
      .input("FacturaID", sql.Int, Number(FacturaID))
      .input("ArticuloID", sql.Int, Number(ArticuloID))
      .input("Cantidad", sql.Int, Number(Cantidad))
      .input("PrecioUnitario", sql.Decimal(10, 2), Number(PrecioUnitario))
      .query(`
        INSERT INTO DetalleFactura (FacturaID, ArticuloID, Cantidad, PrecioUnitario)
        OUTPUT INSERTED.DetalleID
        VALUES (@FacturaID, @ArticuloID, @Cantidad, @PrecioUnitario)
      `);

    res.status(201).json({ DetalleID: r.recordset[0].DetalleID });
  } catch (error) {
    console.error("Error en POST /api/detalle-factura:", error);
    res.status(500).json({ error: "No se pudo crear el detalle.", detail: String(error) });
  }
});

// =================================================================================
// PUT /api/detalle-factura/:id  →  Actualizar un detalle de factura
// =================================================================================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalleId = Number(id);
    if (isNaN(detalleId)) return res.status(400).json({ error: "ID de detalle inválido." });

    const { Cantidad, PrecioUnitario } = req.body;

    if (!Cantidad && !PrecioUnitario) {
      return res.status(400).json({ 
        error: "Debe proporcionar al menos Cantidad o PrecioUnitario para actualizar." 
      });
    }

    const db = await getDb();
    let query = "UPDATE DetalleFactura SET ";
    const updates: string[] = [];

    const request = db.request().input("DetalleID", sql.Int, detalleId);

    if (Cantidad !== undefined) {
      request.input("Cantidad", sql.Int, Number(Cantidad));
      updates.push("Cantidad = @Cantidad");
    }

    if (PrecioUnitario !== undefined) {
      request.input("PrecioUnitario", sql.Decimal(10, 2), Number(PrecioUnitario));
      updates.push("PrecioUnitario = @PrecioUnitario");
    }

    query += updates.join(", ") + " WHERE DetalleID = @DetalleID";

    const r = await request.query(query);

    if (r.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    res.status(200).json({ message: "Detalle actualizado correctamente." });
  } catch (error) {
    console.error("Error en PUT /api/detalle-factura/:id:", error);
    res.status(500).json({ error: "Error al actualizar detalle.", detail: String(error) });
  }
});

// =================================================================================
// DELETE /api/detalle-factura/:id  →  Eliminar un detalle de factura
// =================================================================================
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalleId = Number(id);
    if (isNaN(detalleId)) return res.status(400).json({ error: "ID de detalle inválido." });

    const db = await getDb();
    const r = await db.request()
      .input("DetalleID", sql.Int, detalleId)
      .query("DELETE FROM DetalleFactura WHERE DetalleID = @DetalleID");

    if (r.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    res.status(200).json({ message: "Detalle eliminado correctamente." });
  } catch (error) {
    console.error("Error en DELETE /api/detalle-factura/:id:", error);
    res.status(500).json({ error: "Error al eliminar detalle.", detail: String(error) });
  }
});

export default router;