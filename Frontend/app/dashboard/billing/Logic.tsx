"use client";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE_URL = "http://localhost:5000";

export type Cliente = {
  ClienteID: number;
  NombreComercial: string;
  RNC_Cedula?: string;
};
export type Articulo = {
  ArticuloID: number;
  Descripcion: string;
  PrecioUnitario: number;
  Estado: number;
};
export type Vendedor = { VendedorID: number; Nombre: string };
export type Item = {
  key: string;
  ArticuloID: number;
  Descripcion: string;
  Cantidad: number;
  PrecioUnitario: number;
  Importe: number;
};
export type Factura = {
  FacturaID: number;
  ClienteID: number;
  Cliente: string;
  VendedorID: number;
  Vendedor: string;
  Fecha: string;
  Comentario: string | null;
  Total: number;
};
export type FacturaDetalle = {
  FacturaID: number;
  ClienteID: number;
  Cliente: string;
  VendedorID: number;
  Vendedor: string;
  Fecha: string;
  Comentario: string | null;
  Detalle: Array<{
    DetalleID: number;
    ArticuloID: number;
    Descripcion: string;
    Cantidad: number;
    PrecioUnitario: number;
    Importe: number;
  }>;
};

export function useFacturacion() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [clienteId, setClienteId] = useState<number | "">("");
  const [vendedorId, setVendedorId] = useState<number | "">("");
  const [items, setItems] = useState<Item[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [comentario, setComentario] = useState("");
  const [open, setOpen] = useState(false);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] =
    useState<FacturaDetalle | null>(null);
  const [openDetalle, setOpenDetalle] = useState(false);

  const load = async () => {
    const [c, a, v] = await Promise.all([
      fetch(`${API_BASE_URL}/api/clientes`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/articulos`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/vendedores`).then((r) => r.json()),
    ]);
    setClientes(c);
    setArticulos(a.filter((x: Articulo) => x.Estado));
    setVendedores(v);
  };

  const loadFacturas = async () => {
    const f = await fetch(`${API_BASE_URL}/api/facturas`).then((r) => r.json());
    setFacturas(f);
  };

  useEffect(() => {
    load();
    loadFacturas();
  }, []);

  const results = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return [];
    return articulos
      .filter(
        (a) =>
          a.Descripcion.toLowerCase().includes(q) ||
          String(a.ArticuloID).includes(q)
      )
      .slice(0, 10);
  }, [busqueda, articulos]);

  const addArticulo = (a: Articulo) => {
    const found = items.find((i) => i.ArticuloID === a.ArticuloID);
    if (found) {
      const updated = items.map((i) =>
        i.ArticuloID === a.ArticuloID
          ? {
              ...i,
              Cantidad: i.Cantidad + 1,
              Importe: (i.Cantidad + 1) * i.PrecioUnitario,
            }
          : i
      );
      setItems(updated);
    } else {
      setItems((prev) => [
        ...prev,
        {
          key: `k${prev.length + 1}`,
          ArticuloID: a.ArticuloID,
          Descripcion: a.Descripcion,
          Cantidad: 1,
          PrecioUnitario: a.PrecioUnitario,
          Importe: a.PrecioUnitario,
        },
      ]);
    }
    setBusqueda("");
  };

  const cambiarCantidad = (k: string, c: number) => {
    if (c <= 0) return setItems((prev) => prev.filter((i) => i.key !== k));
    setItems((prev) =>
      prev.map((i) =>
        i.key === k ? { ...i, Cantidad: c, Importe: c * i.PrecioUnitario } : i
      )
    );
  };

  const remove = (k: string) =>
    setItems((prev) => prev.filter((i) => i.key !== k));

  const subtotal = items.reduce((s, i) => s + i.Importe, 0);
  const itbis = +(subtotal * 0.18).toFixed(2);
  const total = subtotal + itbis;

  const crearFactura = async () => {
    if (!clienteId || !vendedorId || items.length === 0) {
      alert("Seleccione cliente, vendedor y al menos un artículo");
      return;
    }
    const payload = {
      ClienteID: Number(clienteId),
      VendedorID: Number(vendedorId),
      Comentario: comentario || null,
      Detalle: items.map((i) => ({
        ArticuloID: i.ArticuloID,
        Cantidad: i.Cantidad,
        PrecioUnitario: i.PrecioUnitario,
      })),
    };
    const r = await fetch(`${API_BASE_URL}/api/facturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      alert("Error al crear factura: " + (e.detail || r.status));
      return;
    }
    setOpen(true);
    setClienteId("");
    setVendedorId("");
    setComentario("");
    setItems([]);
    loadFacturas();
  };

  const verDetalle = async (facturaId: number) => {
    const detalle = await fetch(
      `${API_BASE_URL}/api/facturas/${facturaId}`
    ).then((r) => r.json());
    setFacturaSeleccionada(detalle);
    setOpenDetalle(true);
  };

  const exportarExcel = () => {
    if (facturas.length === 0) {
      alert("No hay facturas para exportar");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      facturas.map((f) => ({
        ID: f.FacturaID,
        Cliente: f.Cliente,
        Vendedor: f.Vendedor,
        Fecha: new Date(f.Fecha).toLocaleString(),
        Comentario: f.Comentario || "",
        Total: f.Total,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "facturas.xlsx"
    );
  };

  const imprimirPDF = async () => {
    if (!facturaSeleccionada) return;
    const elemento = document.getElementById("detalle-factura");
    if (!elemento) return;

    // 🔹 Fuerza un fondo visible y compatible
    const originalBg = elemento.style.backgroundColor;
    elemento.style.backgroundColor = "#ffffff";

    try {
      const canvas = await html2canvas(elemento, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          // 🔹 Elimina sombras y colores lab() que rompen html2canvas
          doc.querySelectorAll("*").forEach((el) => {
            const style = (el as HTMLElement).style;
            if (
              style.color.includes("lab") ||
              style.backgroundColor.includes("lab")
            ) {
              style.color = "#000";
              style.backgroundColor = "#fff";
            }
            style.boxShadow = "none";
            style.filter = "none";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Factura_${facturaSeleccionada.FacturaID}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Ocurrió un error al generar el PDF");
    } finally {
      // 🔹 Restaura el fondo original
      elemento.style.backgroundColor = originalBg;
    }
  };

  return {
    clientes,
    vendedores,
    articulos,
    clienteId,
    vendedorId,
    comentario,
    busqueda,
    items,
    facturas,
    facturaSeleccionada,
    open,
    openDetalle,
    subtotal,
    itbis,
    total,
    setClienteId,
    setVendedorId,
    setComentario,
    setBusqueda,
    setOpen,
    setOpenDetalle,
    addArticulo,
    cambiarCantidad,
    remove,
    crearFactura,
    verDetalle,
    loadFacturas,
    exportarExcel,
    imprimirPDF,
  };
}
