import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index"; 

const router = Router();

router.use((req, res, next) => {
  if (req.method === "POST" && req.headers["content-type"] !== "application/json") {
    return res.status(400).json({ error: "Content-Type debe ser 'application/json'" });
  }
  next();
});

// ============================================================================
// RUTA GET: Obtener todos los clientes
// ============================================================================
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const r = await db.request().query(`
      SELECT ClienteID, NombreComercial, RNC_Cedula, CuentaContable, Estado
      FROM Clientes
      ORDER BY ClienteID DESC
    `);

    res.status(200).json(r.recordset);
  } catch (error) {
    console.error("Error en GET /api/clientes:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener clientes." });
  }
});


// ============================================================================
// RUTA POST: Crear un nuevo cliente
// ============================================================================
router.post("/", async (req: Request, res: Response) => {
  try {
    const { NombreComercial, RNC_Cedula, CuentaContable, Estado = 1 } = req.body;

    if (!NombreComercial) {
      return res.status(400).json({ error: "El campo 'NombreComercial' es obligatorio." });
    }

    const db = await getDb();

    const q = `
      INSERT INTO Clientes (NombreComercial, RNC_Cedula, CuentaContable, Estado)
      OUTPUT INSERTED.*
      VALUES (@NombreComercial, @RNC_Cedula, @CuentaContable, @Estado)
    `;

    const r = await db
      .request()
      .input("NombreComercial", sql.NVarChar(100), NombreComercial)
      .input("RNC_Cedula", sql.NVarChar(20), RNC_Cedula)
      .input("CuentaContable", sql.NVarChar(20), CuentaContable || null)
      .input("Estado", sql.Bit, Estado ? 1 : 0)
      .query(q);

    res.status(201).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en POST /api/clientes:", error);
    res.status(500).json({ error: "Error interno del servidor al crear cliente." });
  }
});


// ============================================================================
// RUTA PUT: Actualizar un cliente existente
// ============================================================================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { NombreComercial, RNC_Cedula, CuentaContable, Estado } = req.body;

    if (!NombreComercial) {
      return res.status(400).json({ error: "El campo 'NombreComercial' es obligatorio." });
    }

    const db = await getDb();

    const q = `
      UPDATE Clientes
      SET NombreComercial = @NombreComercial,
          RNC_Cedula = @RNC_Cedula,
          CuentaContable = @CuentaContable,
          Estado = @Estado
      OUTPUT INSERTED.*
      WHERE ClienteID = @ClienteID
    `;

    const r = await db
      .request()
      .input("ClienteID", sql.Int, Number(id))
      .input("NombreComercial", sql.NVarChar(100), NombreComercial)
      .input("RNC_Cedula", sql.NVarChar(20), RNC_Cedula)
      .input("CuentaContable", sql.NVarChar(20), CuentaContable || null)
      .input("Estado", sql.Bit, Estado ? 1 : 0)
      .query(q);

    if (r.recordset.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en PUT /api/clientes:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar cliente." });
  }
});


// ============================================================================
// RUTA DELETE: Eliminar un cliente
// ============================================================================
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    const q = `
      DELETE FROM Clientes
      OUTPUT DELETED.*
      WHERE ClienteID = @ClienteID
    `;

    const r = await db.request().input("ClienteID", sql.Int, Number(id)).query(q);

    if (r.recordset.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    res.status(200).json(r.recordset[0]);
  } catch (error) {
    console.error("Error en DELETE /api/clientes:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar cliente." });
  }
});

export default router;
