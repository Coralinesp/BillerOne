"use client";

import { useEffect, useState } from "react";

export interface Usuario {
  Id: number;
  Nombre: string;
  Usuario: string;
}

export function useUsersLogic() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");

  // Modal crear/editar
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Formulario
  const [form, setForm] = useState({
    Nombre: "",
    Usuario: "",
    Password: "",
  });

  const [formError, setFormError] = useState({
    Nombre: "",
    Usuario: "",
    Password: "",
  });

  const [attemptedSave, setAttemptedSave] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Modal eliminar
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Cargar usuarios
  async function loadUsers() {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Preparar nuevo usuario
  function prepareNew() {
    setEditingId(null);
    setForm({ Nombre: "", Usuario: "", Password: "" });
    setFormError({ Nombre: "", Usuario: "", Password: "" });
    setAttemptedSave(false);
  }

  // Validar
  function validate() {
    const errors = { Nombre: "", Usuario: "", Password: "" };
    let valid = true;

    if (!form.Nombre.trim()) {
      errors.Nombre = "El nombre es obligatorio";
      valid = false;
    }
    if (!form.Usuario.trim()) {
      errors.Usuario = "El usuario es obligatorio";
      valid = false;
    }
    if (!editingId && !form.Password.trim()) {
      errors.Password = "La contraseña es obligatoria";
      valid = false;
    }

    setFormError(errors);
    return valid;
  }

  // Guardar usuario
  async function save() {
    setAttemptedSave(true);
    if (!validate()) return;

    setSaving(true);

    try {
      const endpoint = editingId
        ? `http://localhost:5000/api/usuarios/${editingId}`
        : "http://localhost:5000/api/usuarios";

      const method = editingId ? "PUT" : "POST";

      const body: any = {
        Nombre: form.Nombre,
        Usuario: form.Usuario,
      };

      if (!editingId) {
        // creando usuario → contraseña obligatoria
        body.Password = form.Password;
      } else if (form.Password.trim() !== "") {
        // editando usuario → contraseña opcional
        body.Password = form.Password;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error guardando usuario");

      await loadUsers();
      setMessage("Guardado correctamente");
      setTimeout(() => setMessage(""), 2000);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }

    setSaving(false);
  }

  // Editar usuario
  function editUser(u: Usuario) {
    setEditingId(u.Id);
    setForm({
      Nombre: u.Nombre,
      Usuario: u.Usuario,
      Password: "", // contraseña opcional
    });
    setOpen(true);
  }

  // Eliminar usuario
  function confirmDelete(u: Usuario) {
    setSelectedUser(u);
    setDeleteOpen(true);
  }

  async function remove() {
    if (!selectedUser) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/usuarios/${selectedUser.Id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Error eliminando");

      await loadUsers();
      setMessage("Usuario eliminado");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
    }

    setDeleteOpen(false);
  }

  // Filtrado
  const filtered = users.filter((u) =>
    (u.Nombre + " " + u.Usuario).toLowerCase().includes(search.toLowerCase())
  );

  return {
    users,
    filtered,
    search,
    setSearch,
    open,
    setOpen,
    form,
    setForm,
    editingId,
    save,
    prepareNew,
    saving,
    message,
    attemptedSave,
    formError,

    editUser,

    deleteOpen,
    setDeleteOpen,
    selectedUser,
    confirmDelete,
    remove,
  };
}
