import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index"; 

const router = Router();

router.use((req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: "Content-Type debe ser 'application/json'" });
    }
    next();
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        
        const r = await db.request().query(`
            SELECT VendedorID, Nombre, PorcentajeComision, Estado
            FROM Vendedores
            ORDER BY VendedorID DESC
        `);
        
        res.status(200).json(r.recordset);
    } catch (error) {
        console.error("Error en GET /api/vendedores:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener vendedores." });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { Nombre, PorcentajeComision = 0, Estado = 1 } = req.body;
        
        if (!Nombre) {
            return res.status(400).json({ error: "El campo 'Nombre' es obligatorio." });
        }

        const db = await getDb();
        
        const r = await db
            .request()
            .input("Nombre", sql.NVarChar(100), Nombre)
            .input("PorcentajeComision", sql.Decimal(5, 2), Number(PorcentajeComision))
            .input("Estado", sql.Bit, Estado ? 1 : 0)
            .query(`
                INSERT INTO Vendedores (Nombre, PorcentajeComision, Estado)
                OUTPUT INSERTED.*
                VALUES (@Nombre, @PorcentajeComision, @Estado)
            `);
            
        res.status(201).json(r.recordset[0]);
    } catch (error) {
        console.error("Error en POST /api/vendedores:", error);
        res.status(500).json({ error: "Error interno del servidor al crear vendedor." });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Nombre, PorcentajeComision = 0, Estado = 1 } = req.body;

    if (!Nombre) {
      return res.status(400).json({ error: "El campo 'Nombre' es obligatorio." });
    }

    const db = await getDb();

    const r = await db
      .request()
      .input("VendedorID", sql.Int, Number(id))
      .input("Nombre", sql.NVarChar(100), Nombre)
      .input("PorcentajeComision", sql.Decimal(5, 2), Number(PorcentajeComision))
      .input("Estado", sql.Bit, Estado ? 1 : 0)
      .query(`
        UPDATE Vendedores
        SET Nombre = @Nombre,
            PorcentajeComision = @PorcentajeComision,
            Estado = @Estado
        OUTPUT INSERTED.*
        WHERE VendedorID = @VendedorID
      `);

    if (r.recordset.length === 0) {
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en PUT /api/vendedores/:id:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar vendedor." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    const r = await db
      .request()
      .input("VendedorID", sql.Int, Number(id))
      .query(`
        DELETE FROM Vendedores
        OUTPUT DELETED.*
        WHERE VendedorID = @VendedorID
      `);

    if (r.recordset.length === 0) {
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en DELETE /api/vendedores:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar vendedor." });
  }
});


export default router;
