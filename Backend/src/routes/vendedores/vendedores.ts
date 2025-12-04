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

// GET /api/vendedores
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("vendedores")
      .select("vendedorid, nombre, porcentajecomision, estado")
      .order("vendedorid", { ascending: false });

    if (error) {
      console.error("Error Supabase en GET /api/vendedores:", error);
      return res.status(500).json({
        error: "Error interno del servidor al obtener vendedores.",
      });
    }

    const mapped = (data || []).map((row: any) => ({
      VendedorID: row.vendedorid,
      Nombre: row.nombre,
      PorcentajeComision: row.porcentajecomision,
      Estado: row.estado,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en GET /api/vendedores:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener vendedores.",
    });
  }
});

// POST /api/vendedores
router.post("/", async (req: Request, res: Response) => {
  try {
    const { Nombre, PorcentajeComision = 0, Estado = 1 } = req.body;

    if (!Nombre) {
      return res
        .status(400)
        .json({ error: "El campo 'Nombre' es obligatorio." });
    }

    const porcentaje = Number(PorcentajeComision) || 0;
    const estadoBool = Estado === 1 || Estado === true || Estado === "1";

    const { data, error } = await supabase
      .from("vendedores")
      .insert({
        nombre: Nombre,
        porcentajecomision: porcentaje,
        estado: estadoBool,
      })
      .select("vendedorid, nombre, porcentajecomision, estado")
      .single();

    if (error) {
      console.error("Error Supabase en POST /api/vendedores:", error);
      return res.status(500).json({
        error: "Error interno del servidor al crear vendedor.",
      });
    }

    const mapped = {
      VendedorID: data.vendedorid,
      Nombre: data.nombre,
      PorcentajeComision: data.porcentajecomision,
      Estado: data.estado,
    };

    res.status(201).json(mapped);
  } catch (error) {
    console.error("Error en POST /api/vendedores:", error);
    res.status(500).json({
      error: "Error interno del servidor al crear vendedor.",
    });
  }
});

// PUT /api/vendedores/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Nombre, PorcentajeComision = 0, Estado = 1 } = req.body;

    if (!Nombre) {
      return res
        .status(400)
        .json({ error: "El campo 'Nombre' es obligatorio." });
    }

    const vendedorId = Number(id);
    if (Number.isNaN(vendedorId)) {
      return res.status(400).json({ error: "ID de vendedor inválido." });
    }

    const porcentaje = Number(PorcentajeComision) || 0;
    const estadoBool = Estado === 1 || Estado === true || Estado === "1";

    const { data, error } = await supabase
      .from("vendedores")
      .update({
        nombre: Nombre,
        porcentajecomision: porcentaje,
        estado: estadoBool,
      })
      .eq("vendedorid", vendedorId)
      .select("vendedorid, nombre, porcentajecomision, estado")
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en PUT /api/vendedores/:id:", error);
      return res.status(500).json({
        error: "Error interno del servidor al actualizar vendedor.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    const mapped = {
      VendedorID: data.vendedorid,
      Nombre: data.nombre,
      PorcentajeComision: data.porcentajecomision,
      Estado: data.estado,
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en PUT /api/vendedores/:id:", error);
    res.status(500).json({
      error: "Error interno del servidor al actualizar vendedor.",
    });
  }
});

// DELETE /api/vendedores/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendedorId = Number(id);
    if (Number.isNaN(vendedorId)) {
      return res.status(400).json({ error: "ID de vendedor inválido." });
    }

    const { data, error } = await supabase
      .from("vendedores")
      .delete()
      .eq("vendedorid", vendedorId)
      .select("vendedorid, nombre, porcentajecomision, estado")
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en DELETE /api/vendedores:", error);
      return res.status(500).json({
        error: "Error interno del servidor al eliminar vendedor.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    const mapped = {
      VendedorID: data.vendedorid,
      Nombre: data.nombre,
      PorcentajeComision: data.porcentajecomision,
      Estado: data.estado,
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en DELETE /api/vendedores:", error);
    res.status(500).json({
      error: "Error interno del servidor al eliminar vendedor.",
      detail: String(error),
    });
  }
});

export default router;
