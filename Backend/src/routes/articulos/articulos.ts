import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index";

const router = Router();

// Middleware para validar Content-Type en POST
router.use((req, res, next) => {
  if (req.method === "POST" && req.headers["content-type"] !== "application/json") {
    return res.status(400).json({ error: "Content-Type debe ser 'application/json'" });
  }
  next();
});

// ============================
// RUTA GET: Obtener todos los artículos
// ============================
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const r = await db.request().query(`
      SELECT ArticuloID, Descripcion, PrecioUnitario, Estado
      FROM Articulos
      ORDER BY ArticuloID DESC
    `);
    res.status(200).json(r.recordset);
  } catch (error) {
    console.error("Error en GET /api/articulos:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener artículos." });
  }
});

// ============================
// RUTA POST: Crear un nuevo artículo
// ============================
router.post("/", async (req: Request, res: Response) => {
  try {
    const { Descripcion, PrecioUnitario = 0, Estado = 1 } = req.body;

    if (!Descripcion) {
      return res.status(400).json({ error: "El campo 'Descripcion' es obligatorio." });
    }

    const db = await getDb();
    const r = await db
      .request()
      .input("Descripcion", sql.NVarChar(150), Descripcion)
      .input("PrecioUnitario", sql.Decimal(10, 2), Number(PrecioUnitario))
      .input("Estado", sql.Bit, Estado ? 1 : 0)
      .query(`
        INSERT INTO Articulos (Descripcion, PrecioUnitario, Estado)
        OUTPUT INSERTED.*
        VALUES (@Descripcion, @PrecioUnitario, @Estado)
      `);

    res.status(201).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en POST /api/articulos:", error);
    res.status(500).json({ error: "Error interno del servidor al crear artículo." });
  }
});

// ============================
// RUTA PUT: Actualizar un artículo por ID
// ============================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Descripcion, PrecioUnitario = 0, Estado = 1 } = req.body;

    if (!Descripcion) {
      return res.status(400).json({ error: "El campo 'Descripcion' es obligatorio." });
    }

    const db = await getDb();
    const r = await db
      .request()
      .input("ArticuloID", sql.Int, Number(id))
      .input("Descripcion", sql.NVarChar(150), Descripcion)
      .input("PrecioUnitario", sql.Decimal(10, 2), Number(PrecioUnitario))
      .input("Estado", sql.Bit, Estado ? 1 : 0)
      .query(`
        UPDATE Articulos
        SET Descripcion = @Descripcion,
            PrecioUnitario = @PrecioUnitario,
            Estado = @Estado
        OUTPUT INSERTED.*
        WHERE ArticuloID = @ArticuloID
      `);

    if (r.recordset.length === 0) {
      return res.status(404).json({ error: "Artículo no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en PUT /api/articulos/:id:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar artículo." });
  }
});

// ============================
// RUTA DELETE: Eliminar un artículo por ID
// ============================
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    const r = await db
      .request()
      .input("ArticuloID", sql.Int, Number(id))
      .query(`
        DELETE FROM Articulos
        OUTPUT DELETED.*
        WHERE ArticuloID = @ArticuloID
      `);

    if (r.recordset.length === 0) {
      return res.status(404).json({ error: "Artículo no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en DELETE /api/articulos/:id:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar artículo." });
  }
});

export default router;
