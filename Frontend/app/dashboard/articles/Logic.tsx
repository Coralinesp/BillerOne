import { useState, useEffect } from "react";

export type Articulo = {
  ArticuloID: number;
  Descripcion: string;
  PrecioUnitario: number;
  Estado: boolean | number;
};

// 🔹 URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useArticlesLogic() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [data, setData] = useState<Articulo[]>([]);
  const [form, setForm] = useState<Partial<Articulo>>({ Estado: 1 });
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [attemptedSave, setAttemptedSave] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 5000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/articulos`);
      const json = await r.json();
      setData(json);
    } catch (error) {
      showMessage("Error al cargar los artículos");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.Descripcion) errors.Descripcion = "La descripción es requerida";
    if (form.PrecioUnitario == null || form.PrecioUnitario <= 0)
      errors.PrecioUnitario = "El precio debe ser mayor a 0";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const save = async () => {
    setAttemptedSave(true);
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingId) {
        await fetch(`${API_URL}/articulos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, ArticuloID: editingId }),
        });
        showMessage("Artículo actualizado");
      } else {
        await fetch(`${API_URL}/articulos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showMessage("Artículo creado");
      }
      setForm({ Estado: 1 });
      setEditingId(null);
      setFormError({});
      setAttemptedSave(false);
      await load();
    } catch (error) {
      showMessage("Error al guardar el artículo");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (deleteId === null) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}/articulos/${deleteId}`, {
        method: "DELETE",
      });
      showMessage("Artículo eliminado");
      await load();
    } catch (error) {
      showMessage("Error al eliminar el artículo");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const openForm = (item?: Articulo) => {
    setForm(item ? item : { Estado: 1 });
    setEditingId(item?.ArticuloID ?? null);
    setFormError({});
    setAttemptedSave(false);
  };

  return {
    loading,
    saving,
    message,
    data,
    form,
    setForm,
    formError,
    attemptedSave,
    editingId,
    deleteId,
    setDeleteId,
    showMessage,
    load,
    save,
    remove,
    openForm,
  };
}
