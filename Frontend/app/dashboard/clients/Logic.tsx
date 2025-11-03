import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type Cliente = {
  ClienteID: number;
  NombreComercial: string;
  RNC_Cedula: string;
  CuentaContable?: string | null;
  Estado: boolean | number;
};

export function useClientsLogic() {
  const [data, setData] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [form, setForm] = useState<Partial<Cliente>>({ Estado: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 5000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/clientes`);
      if (!r.ok) throw new Error("Error al cargar clientes");
      const json = await r.json();
      setData(json);
    } catch (err) {
      console.error(err);
      showMessage("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Nombre comercial obligatorio
    if (!form.NombreComercial)
      errors.NombreComercial = "El nombre es requerido";

    // Cédula/RNC obligatorio y válido
    if (!form.RNC_Cedula) {
      errors.RNC_Cedula = "El RNC/Cédula es requerido";
    } else {
      const value = form.RNC_Cedula.replace(/[^0-9]/g, ""); // quitar guiones
      if (!/^\d{11}$/.test(value)) {
        errors.RNC_Cedula = "Cédula inválida (debe tener 11 dígitos)";
      } else {
        // Validación básica mod 11
        const digits = value.split("").map(Number);
        let sum = 0;
        const multipliers = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]; // multiplicadores alternados
        for (let i = 0; i < 10; i++) {
          let prod = digits[i] * multipliers[i];
          sum += Math.floor(prod / 10) + (prod % 10);
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        if (checkDigit !== digits[10]) {
          errors.RNC_Cedula = "Cédula inválida (dígito verificador incorrecto)";
        } else {
          // Verificar duplicado
          const exists = data.some(
            (c) => c.RNC_Cedula === form.RNC_Cedula && c.ClienteID !== editingId
          );
          if (exists)
            errors.RNC_Cedula = "Ya existe un cliente con esta cédula";
        }
      }
    }

    // Cuenta contable obligatoria
    if (!form.CuentaContable)
      errors.CuentaContable = "La cuenta contable es requerida";

    // Estado obligatorio
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
      if (editingId) {
        const r = await fetch(`${API_URL}/clientes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!r.ok) throw new Error("Error al actualizar cliente");
        showMessage("Cliente actualizado");
      } else {
        const r = await fetch(`${API_URL}/clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!r.ok) throw new Error("Error al crear cliente");
        showMessage("Cliente agregado");
      }
      setForm({ Estado: 1 });
      setEditingId(null);
      setFormError({});
      setAttemptedSave(false);
      setOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      showMessage("Error al guardar el cliente");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedCliente) return;

    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/clientes/${selectedCliente.ClienteID}`,
        {
          method: "DELETE",
        }
      );
      if (!r.ok) throw new Error("Error al eliminar cliente");
      showMessage("Cliente eliminado");
      setDeleteOpen(false);
      setSelectedCliente(null);
      await load();
    } catch (err) {
      console.error(err);
      showMessage("Error al eliminar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(
    (c) =>
      c.NombreComercial.toLowerCase().includes(search.toLowerCase()) ||
      c.RNC_Cedula.includes(search)
  );

  return {
    data,
    search,
    setSearch,
    open,
    setOpen,
    deleteOpen,
    setDeleteOpen,
    selectedCliente,
    setSelectedCliente,
    form,
    setForm,
    editingId,
    setEditingId,
    formError,
    attemptedSave,
    loading,
    saving,
    message,
    filtered,
    showMessage,
    save,
    remove,
  };
}
