import { Router, Request, Response } from "express";
import { getDb, sql } from "../../db/index"; 

const router = Router();

router.use((req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: "Content-Type debe ser 'application/json'" });
    }
    next();
});

// RUTA GET: Obtener todos los vendedores
router.get("/", async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        
        const r = await db.request().query(`
            SELECT VendedorID, Nombre, PorcentajeComision, Estado
            FROM Vendedores
            ORDER BY VendedorID DESC
        `);
        
        // Express utiliza res.json() en lugar de NextResponse.json()
        res.status(200).json(r.recordset);
    } catch (error) {
        console.error("Error en GET /api/vendedores:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener vendedores." });
    }
});

// =================================================================================
// RUTA POST: Crear un nuevo vendedor
// =================================================================================
router.post("/", async (req: Request, res: Response) => {
    try {
        // En Express, el cuerpo ya está parseado y disponible en req.body gracias a app.use(express.json())
        const { Nombre, PorcentajeComision = 0, Estado = 1 } = req.body;
        
        if (!Nombre) {
            return res.status(400).json({ error: "El campo 'Nombre' es obligatorio." });
        }

        const db = await getDb();
        
        // Uso de input() para prevenir inyección SQL y especificar tipos, ¡excelente práctica!
        const r = await db
            .request()
            .input("Nombre", sql.NVarChar(100), Nombre)
            // Aseguramos que PorcentajeComision y Estado son números antes de pasarlos
            .input("PorcentajeComision", sql.Decimal(5, 2), Number(PorcentajeComision))
            .input("Estado", sql.Bit, Estado ? 1 : 0) // Convierte a 1 o 0 para BIT
            .query(`
                INSERT INTO Vendedores (Nombre, PorcentajeComision, Estado)
                OUTPUT INSERTED.*
                VALUES (@Nombre, @PorcentajeComision, @Estado)
            `);
            
        // Devuelve el vendedor recién creado con el estado 201 (Created)
        res.status(201).json(r.recordset[0]);
    } catch (error) {
        console.error("Error en POST /api/vendedores:", error);
        res.status(500).json({ error: "Error interno del servidor al crear vendedor." });
    }
});

// RUTA PUT: Actualizar un vendedor por ID
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

// RUTA DELETE: Eliminar un vendedor por ID
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
