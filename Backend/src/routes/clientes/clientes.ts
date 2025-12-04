import { Router, Request, Response } from "express";
import { supabase } from "../../db";

const router = Router();

router.use((req, res, next) => {
  if (
    req.method === "POST" &&
    req.headers["content-type"] !== "application/json"
  ) {
    return res
      .status(400)
      .json({ error: "Content-Type debe ser 'application/json'" });
  }
  next();
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("clienteid, nombrecomercial, rnc_cedula, cuentacontable, estado")
      .order("clienteid", { ascending: false });

    if (error) {
      console.error("Error Supabase en GET /api/clientes:", error);
      return res.status(500).json({
        error: "Error interno del servidor al obtener clientes.",
      });
    }

    const mapped = (data || []).map((row) => ({
      ClienteID: row.clienteid,
      NombreComercial: row.nombrecomercial,
      RNC_Cedula: row.rnc_cedula,
      CuentaContable: row.cuentacontable,
      Estado: row.estado,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en GET /api/clientes:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener clientes.",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { NombreComercial, RNC_Cedula, CuentaContable, Estado = 1 } = req.body;

    if (!NombreComercial) {
      return res
        .status(400)
        .json({ error: "El campo 'NombreComercial' es obligatorio." });
    }

    const estadoBool = Estado === 1 || Estado === true || Estado === "1";

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nombrecomercial: NombreComercial,
        rnc_cedula: RNC_Cedula,
        cuentacontable: CuentaContable || null,
        estado: estadoBool,
      })
      .select("clienteid, nombrecomercial, rnc_cedula, cuentacontable, estado")
      .single();

    if (error) {
      console.error("Error Supabase en POST /api/clientes:", error);

      if ((error as any).code === "23505") {
        return res.status(400).json({
          error: "Ya existe un cliente con ese RNC/Cédula.",
        });
      }

      return res.status(500).json({
        error: "Error interno del servidor al crear cliente.",
      });
    }

    const mapped = {
      ClienteID: data.clienteid,
      NombreComercial: data.nombrecomercial,
      RNC_Cedula: data.rnc_cedula,
      CuentaContable: data.cuentacontable,
      Estado: data.estado,
    };

    res.status(201).json(mapped);
  } catch (error) {
    console.error("Error en POST /api/clientes:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al crear cliente." });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { NombreComercial, RNC_Cedula, CuentaContable, Estado = 1 } = req.body;

    if (!NombreComercial) {
      return res
        .status(400)
        .json({ error: "El campo 'NombreComercial' es obligatorio." });
    }

    const clienteId = Number(id);
    if (Number.isNaN(clienteId)) {
      return res.status(400).json({ error: "ID de cliente inválido." });
    }

    const estadoBool = Estado === 1 || Estado === true || Estado === "1";

    const { data, error } = await supabase
      .from("clientes")
      .update({
        nombrecomercial: NombreComercial,
        rnc_cedula: RNC_Cedula,
        cuentacontable: CuentaContable || null,
        estado: estadoBool,
      })
      .eq("clienteid", clienteId)
      .select("clienteid, nombrecomercial, rnc_cedula, cuentacontable, estado")
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en PUT /api/clientes/:id:", error);
      return res.status(500).json({
        error: "Error interno del servidor al actualizar cliente.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    const mapped = {
      ClienteID: data.clienteid,
      NombreComercial: data.nombrecomercial,
      RNC_Cedula: data.rnc_cedula,
      CuentaContable: data.cuentacontable,
      Estado: data.estado,
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en PUT /api/clientes/:id:", error);
    res.status(500).json({
      error: "Error interno del servidor al actualizar cliente.",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const clienteId = Number(id);
    if (Number.isNaN(clienteId)) {
      return res.status(400).json({ error: "ID de cliente inválido." });
    }

    const { data, error } = await supabase
      .from("clientes")
      .delete()
      .eq("clienteid", clienteId)
      .select("clienteid, nombrecomercial, rnc_cedula, cuentacontable, estado")
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en DELETE /api/clientes/:id:", error);
      return res.status(500).json({
        error: "Error interno del servidor al eliminar cliente.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    const mapped = {
      ClienteID: data.clienteid,
      NombreComercial: data.nombrecomercial,
      RNC_Cedula: data.rnc_cedula,
      CuentaContable: data.cuentacontable,
      Estado: data.estado,
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en DELETE /api/clientes/:id:", error);
    res.status(500).json({
      error: "Error interno del servidor al eliminar cliente.",
    });
  }
});

export default router;
