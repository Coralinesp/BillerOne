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

// GET /api/facturas
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("facturas")
      .select(
        `
        facturaid,
        clienteid,
        clientes (
          nombrecomercial
        ),
        vendedorid,
        vendedores (
          nombre
        ),
        fecha,
        comentario,
        detallefactura (
          cantidad,
          preciounitario
        )
      `
      )
      .order("facturaid", { ascending: false });

    if (error) {
      console.error("Error Supabase en GET /api/facturas:", error);
      return res.status(500).json({
        error: "Error interno del servidor al obtener facturas.",
      });
    }

    const mapped = (data || []).map((row: any) => {
      const total = (row.detallefactura || []).reduce(
        (acc: number, det: any) =>
          acc + Number(det.cantidad) * Number(det.preciounitario),
        0
      );

      return {
        FacturaID: row.facturaid,
        ClienteID: row.clienteid,
        Cliente: row.clientes?.nombrecomercial ?? null,
        VendedorID: row.vendedorid,
        Vendedor: row.vendedores?.nombre ?? null,
        Fecha: row.fecha,
        Comentario: row.comentario,
        Total: total,
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error en GET /api/facturas:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener facturas.",
    });
  }
});

// GET /api/facturas/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const facturaId = Number(id);
    if (isNaN(facturaId)) {
      return res.status(400).json({ error: "ID de factura inválido." });
    }

    // Header de la factura
    const { data: header, error: headerError } = await supabase
      .from("facturas")
      .select(
        `
        facturaid,
        clienteid,
        clientes (
          nombrecomercial
        ),
        vendedorid,
        vendedores (
          nombre
        ),
        fecha,
        comentario
      `
      )
      .eq("facturaid", facturaId)
      .single();

    if (headerError && (headerError as any).code === "PGRST116") {
      return res.status(404).json({ error: "Factura no encontrada." });
    }

    if (headerError) {
      console.error("Error Supabase (header) en GET /api/facturas/:id:", headerError);
      return res.status(500).json({
        error: "Error interno del servidor al obtener factura.",
      });
    }

    if (!header) {
      return res.status(404).json({ error: "Factura no encontrada." });
    }

    // Detalle de la factura
    const { data: detalle, error: detError } = await supabase
      .from("detallefactura")
      .select(
        `
        detalleid,
        articuloid,
        cantidad,
        preciounitario,
        articulos (
          descripcion
        )
      `
      )
      .eq("facturaid", facturaId);

    if (detError) {
      console.error(
        "Error Supabase (detalle) en GET /api/facturas/:id:",
        detError
      );
      return res.status(500).json({
        error: "Error interno del servidor al obtener detalle.",
      });
    }

    const mappedDetalle = (detalle || []).map((d: any) => ({
      DetalleID: d.detalleid,
      ArticuloID: d.articuloid,
      Descripcion: d.articulos?.descripcion ?? null,
      Cantidad: d.cantidad,
      PrecioUnitario: d.preciounitario,
      Importe: Number(d.cantidad) * Number(d.preciounitario),
    }));

    const response = {
      FacturaID: header.facturaid,
      ClienteID: header.clienteid,
      VendedorID: header.vendedorid,
      Fecha: header.fecha,
      Comentario: header.comentario,
      Detalle: mappedDetalle,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error en GET /api/facturas/:id:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener factura.",
    });
  }
});

// POST /api/facturas
router.post("/", async (req: Request, res: Response) => {
  const { ClienteID, VendedorID, Comentario, Detalle } = req.body;

  if (
    !ClienteID ||
    !VendedorID ||
    !Array.isArray(Detalle) ||
    Detalle.length === 0
  ) {
    return res.status(400).json({
      error: "ClienteID, VendedorID y Detalle son obligatorios.",
    });
  }

  try {
    // 1) Insertar la factura
    const { data: factura, error: facturaError } = await supabase
      .from("facturas")
      .insert({
        clienteid: Number(ClienteID),
        vendedorid: Number(VendedorID),
        comentario: Comentario || null,
      })
      .select("facturaid")
      .single();

    if (facturaError) {
      console.error("Error Supabase (factura) en POST /api/facturas:", facturaError);
      return res.status(500).json({
        error: "No se pudo crear la factura.",
      });
    }

    const facturaId = factura.facturaid as number;

    // 2) Insertar los detalles en batch
    const detallesRows = (Detalle as Array<{
      ArticuloID: number;
      Cantidad: number;
      PrecioUnitario: number;
    }>).map((item) => ({
      facturaid: facturaId,
      articuloid: Number(item.ArticuloID),
      cantidad: Number(item.Cantidad),
      preciounitario: Number(item.PrecioUnitario),
    }));

    const { error: detalleError } = await supabase
      .from("detallefactura")
      .insert(detallesRows);

    if (detalleError) {
      console.error(
        "Error Supabase (detalle) en POST /api/facturas:",
        detalleError
      );

      // intento de rollback simple: borrar la factura creada
      await supabase
        .from("facturas")
        .delete()
        .eq("facturaid", facturaId);

      return res.status(500).json({
        error: "No se pudo crear la factura (detalle).",
      });
    }

    res.status(201).json({ FacturaID: facturaId });
  } catch (error) {
    console.error("Error en POST /api/facturas:", error);
    res.status(500).json({
      error: "No se pudo crear la factura.",
      detail: String(error),
    });
  }
});

export default router;
