import { Router, Request, Response } from "express";
import { supabase } from "../../db";

const router = Router();

router.use((req, res, next) => {
  if (req.method === "POST" && req.headers["content-type"] !== "application/json") {
    return res
      .status(400)
      .json({ error: "Content-Type debe ser 'application/json'" });
  }
  next();
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("articulos")
      .select("articuloid, descripcion, preciounitario, estado")
      .order("articuloid", { ascending: false });

    if (error) {
      console.error("Error Supabase en GET /api/articulos:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al obtener artículos." });
    }

    const mapped = (data || []).map((row) => ({
      ArticuloID: row.articuloid,
      Descripcion: row.descripcion,
      PrecioUnitario: row.preciounitario,
      Estado: row.estado,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en GET /api/articulos:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener artículos." });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { Descripcion, PrecioUnitario = 0, Estado = 1 } = req.body;

    if (!Descripcion) {
      return res
        .status(400)
        .json({ error: "El campo 'Descripcion' es obligatorio." });
    }

    const precio = Number(PrecioUnitario) || 0;
    const estadoBool = Estado === 1 || Estado === true || Estado === "1";

    const { data, error } = await supabase
      .from("articulos")
      .insert({
        descripcion: Descripcion,
        preciounitario: precio,
        estado: estadoBool,
      })
      .select("articuloid, descripcion, preciounitario, estado")
      .single();

    if (error) {
      console.error("Error Supabase en POST /api/articulos:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al crear artículo." });
    }

    const mapped = {
      ArticuloID: data.articuloid,
      Descripcion: data.descripcion,
      PrecioUnitario: data.preciounitario,
      Estado: data.estado,
    };

    res.status(201).json(mapped);
  } catch (error) {
    console.error("Error en POST /api/articulos:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al crear artículo." });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Descripcion, PrecioUnitario = 0, Estado = 1 } = req.body;

    if (!Descripcion) {
      return res
        .status(400)
        .json({ error: "El campo 'Descripcion' es obligatorio." });
    }

    const articuloId = Number(id);
    if (Number.isNaN(articuloId)) {
      return res.status(400).json({ error: "ID de artículo inválido." });
    }

    const precio = Number(PrecioUnitario) || 0;
    const estadoBool = Estado === 1 || Estado === true || Estado === "1";

    const { data, error } = await supabase
      .from("articulos")
      .update({
        descripcion: Descripcion,
        preciounitario: precio,
        estado: estadoBool,
      })
      .eq("articuloid", articuloId)
      .select("articuloid, descripcion, preciounitario, estado")
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ error: "Artículo no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en PUT /api/articulos/:id:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al actualizar artículo." });
    }

    if (!data) {
      return res.status(404).json({ error: "Artículo no encontrado." });
    }

    const mapped = {
      ArticuloID: data.articuloid,
      Descripcion: data.descripcion,
      PrecioUnitario: data.preciounitario,
      Estado: data.estado,
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en PUT /api/articulos/:id:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al actualizar artículo." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const articuloId = Number(id);
    if (Number.isNaN(articuloId)) {
      return res.status(400).json({ error: "ID de artículo inválido." });
    }

    const { data, error } = await supabase
      .from("articulos")
      .delete()
      .eq("articuloid", articuloId)
      .select("articuloid, descripcion, preciounitario, estado")
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ error: "Artículo no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en DELETE /api/articulos/:id:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor al eliminar artículo." });
    }

    if (!data) {
      return res.status(404).json({ error: "Artículo no encontrado." });
    }

    const mapped = {
      ArticuloID: data.articuloid,
      Descripcion: data.descripcion,
      PrecioUnitario: data.preciounitario,
      Estado: data.estado,
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en DELETE /api/articulos/:id:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al eliminar artículo." });
  }
});

export default router;
