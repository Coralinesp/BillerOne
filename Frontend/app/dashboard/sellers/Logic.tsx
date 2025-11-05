"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type Vendedor = {
  VendedorID: number;
  Nombre: string;
  PorcentajeComision: number;
  Estado: number | boolean;
};

export function useSellersLogic() {
  const [data, setData] = useState<Vendedor[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState<Vendedor | null>(
    null
  );
  const [form, setForm] = useState<Partial<Vendedor>>({
    Estado: 1,
    PorcentajeComision: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 5000);
  };

  const load = async () => {
    try {
      const r = await fetch(`${API_URL}/vendedores`, { cache: "no-store" });
      if (!r.ok) throw new Error(`Error ${r.status}: ${r.statusText}`);
      const vendedores = await r.json();
      setData(vendedores);
    } catch (err) {
      console.error("Error cargando vendedores:", err);
      showMessage("Error cargando vendedores");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.Nombre || form.Nombre.trim() === "")
      errors.Nombre = "El nombre es requerido";
    if (
      form.PorcentajeComision === undefined ||
      form.PorcentajeComision < 0 ||
      form.PorcentajeComision > 100
    )
      errors.PorcentajeComision = "Ingrese un porcentaje válido (0-100)";
    if (form.Estado === undefined || form.Estado === null)
      errors.Estado = "El estado es requerido";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const save = async () => {
    setAttemptedSave(true);
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        Nombre: form.Nombre,
        PorcentajeComision: Number(form.PorcentajeComision),
        Estado: Number(form.Estado),
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/vendedores/${editingId}`
        : `${API_URL}/vendedores`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      showMessage(editingId ? "Vendedor actualizado" : "Vendedor agregado");
      setOpen(false);
      setForm({ Estado: 1, PorcentajeComision: 0 });
      setEditingId(null);
      setFormError({});
      setAttemptedSave(false);
      await load();
    } catch (err) {
      console.error("Error guardando vendedor:", err);
      showMessage("Error al guardar el vendedor");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedVendedor) return;
    try {
      const res = await fetch(
        `${API_URL}/vendedores/${selectedVendedor.VendedorID}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      showMessage("Vendedor eliminado");
      setDeleteOpen(false);
      setSelectedVendedor(null);
      await load();
    } catch (err) {
      console.error("Error eliminando vendedor:", err);
      showMessage("Error eliminando vendedor");
    }
  };

  const filtered = data.filter(
    (v) =>
      v.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      String(v.VendedorID).includes(search)
  );

  return {
    data,
    search,
    setSearch,
    open,
    setOpen,
    deleteOpen,
    setDeleteOpen,
    selectedVendedor,
    setSelectedVendedor,
    form,
    setForm,
    editingId,
    setEditingId,
    formError,
    attemptedSave,
    saving,
    message,
    filtered,
    showMessage,
    save,
    remove,
  };
}
