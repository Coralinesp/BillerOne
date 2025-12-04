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

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("detallefactura")
      .select(
        `
        detalleid,
        facturaid,
        articuloid,
        cantidad,
        preciounitario,
        articulos (
          descripcion
        )
      `
      )
      .order("detalleid", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Error Supabase en GET /api/detalle-factura:", error);
      return res.status(500).json({
        error:
          "Error interno del servidor al obtener detalles de facturas.",
      });
    }

    const mapped = (data || []).map((row: any) => ({
      DetalleID: row.detalleid,
      FacturaID: row.facturaid,
      ArticuloID: row.articuloid,
      ArticuloDescripcion: row.articulos?.descripcion ?? null,
      Cantidad: row.cantidad,
      PrecioUnitario: row.preciounitario,
      Importe: Number(row.cantidad) * Number(row.preciounitario),
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en GET /api/detalle-factura:", error);
    res.status(500).json({
      error:
        "Error interno del servidor al obtener detalles de facturas.",
    });
  }
});

router.get("/factura/:facturaId", async (req: Request, res: Response) => {
  try {
    const { facturaId } = req.params;
    const fId = Number(facturaId);
    if (isNaN(fId))
      return res.status(400).json({ error: "ID de factura inválido." });

    const { data, error } = await supabase
      .from("detallefactura")
      .select(
        `
        detalleid,
        facturaid,
        articuloid,
        cantidad,
        preciounitario,
        articulos (
          descripcion
        )
      `
      )
      .eq("facturaid", fId)
      .order("detalleid", { ascending: true });

    if (error) {
      console.error(
        "Error Supabase en GET /api/detalle-factura/factura/:facturaId:",
        error
      );
      return res.status(500).json({
        error:
          "Error interno del servidor al obtener detalles de factura.",
      });
    }

    const mapped = (data || []).map((row: any) => ({
      DetalleID: row.detalleid,
      FacturaID: row.facturaid,
      ArticuloID: row.articuloid,
      ArticuloDescripcion: row.articulos?.descripcion ?? null,
      Cantidad: row.cantidad,
      PrecioUnitario: row.preciounitario,
      Importe: Number(row.cantidad) * Number(row.preciounitario),
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error(
      "Error en GET /api/detalle-factura/factura/:facturaId:",
      error
    );
    res.status(500).json({
      error:
        "Error interno del servidor al obtener detalles de factura.",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalleId = Number(id);
    if (isNaN(detalleId))
      return res.status(400).json({ error: "ID de detalle inválido." });

    const { data, error } = await supabase
      .from("detallefactura")
      .select(
        `
        detalleid,
        facturaid,
        articuloid,
        cantidad,
        preciounitario,
        articulos (
          descripcion
        )
      `
      )
      .eq("detalleid", detalleId)
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en GET /api/detalle-factura/:id:", error);
      return res.status(500).json({
        error: "Error interno del servidor al obtener detalle.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    const mapped = {
      DetalleID: data.detalleid,
      FacturaID: data.facturaid,
      ArticuloID: data.articuloid,
      Cantidad: data.cantidad,
      PrecioUnitario: data.preciounitario,
      Importe: Number(data.cantidad) * Number(data.preciounitario),
    };

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en GET /api/detalle-factura/:id:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener detalle.",
    });
  }
});

// POST /api/detalle-factura
router.post("/", async (req: Request, res: Response) => {
  const { FacturaID, ArticuloID, Cantidad, PrecioUnitario } = req.body;

  if (!FacturaID || !ArticuloID || !Cantidad || !PrecioUnitario) {
    return res.status(400).json({
      error:
        "FacturaID, ArticuloID, Cantidad y PrecioUnitario son obligatorios.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("detallefactura")
      .insert({
        facturaid: Number(FacturaID),
        articuloid: Number(ArticuloID),
        cantidad: Number(Cantidad),
        preciounitario: Number(PrecioUnitario),
      })
      .select("detalleid")
      .single();

    if (error) {
      console.error("Error Supabase en POST /api/detalle-factura:", error);
      return res
        .status(500)
        .json({ error: "No se pudo crear el detalle." });
    }

    res.status(201).json({ DetalleID: data.detalleid });
  } catch (error) {
    console.error("Error en POST /api/detalle-factura:", error);
    res.status(500).json({
      error: "No se pudo crear el detalle.",
      detail: String(error),
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalleId = Number(id);
    if (isNaN(detalleId))
      return res.status(400).json({ error: "ID de detalle inválido." });

    const { Cantidad, PrecioUnitario } = req.body;

    if (Cantidad === undefined && PrecioUnitario === undefined) {
      return res.status(400).json({
        error:
          "Debe proporcionar al menos Cantidad o PrecioUnitario para actualizar.",
      });
    }

    const updateData: any = {};
    if (Cantidad !== undefined) {
      updateData.cantidad = Number(Cantidad);
    }
    if (PrecioUnitario !== undefined) {
      updateData.preciounitario = Number(PrecioUnitario);
    }

    const { data, error } = await supabase
      .from("detallefactura")
      .update(updateData)
      .eq("detalleid", detalleId)
      .select("detalleid")
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en PUT /api/detalle-factura/:id:", error);
      return res.status(500).json({
        error: "Error al actualizar detalle.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    res.status(200).json({ message: "Detalle actualizado correctamente." });
  } catch (error) {
    console.error("Error en PUT /api/detalle-factura/:id:", error);
    res.status(500).json({
      error: "Error al actualizar detalle.",
      detail: String(error),
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const detalleId = Number(id);
    if (isNaN(detalleId))
      return res.status(400).json({ error: "ID de detalle inválido." });

    const { data, error } = await supabase
      .from("detallefactura")
      .delete()
      .eq("detalleid", detalleId)
      .select("detalleid")
      .single();

    if (error && (error as any).code === "PGRST116") {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    if (error) {
      console.error("Error Supabase en DELETE /api/detalle-factura/:id:", error);
      return res.status(500).json({
        error: "Error al eliminar detalle.",
      });
    }

    if (!data) {
      return res.status(404).json({ error: "Detalle no encontrado." });
    }

    res.status(200).json({ message: "Detalle eliminado correctamente." });
  } catch (error) {
    console.error("Error en DELETE /api/detalle-factura/:id:", error);
    res.status(500).json({
      error: "Error al eliminar detalle.",
      detail: String(error),
    });
  }
});

export default router;
