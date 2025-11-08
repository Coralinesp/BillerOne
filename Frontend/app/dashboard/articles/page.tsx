"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useArticlesLogic, Articulo } from "./Logic";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
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
    save,
    remove,
    openForm,
  } = useArticlesLogic();

  const filtered = data.filter(
    (a) =>
      a.Descripcion.toLowerCase().includes(search.toLowerCase()) ||
      String(a.ArticuloID).includes(search)
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header y Buscador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Artículos
          </h1>
          <p className="text-muted-foreground mt-1">Gestione artículos</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 w-64"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Modal Form */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  openForm();
                  setOpen(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-900"
              >
                <Plus className="w-4 h-4 mr-2" /> Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Artículo" : "Nuevo Artículo"}
                </DialogTitle>
                <DialogDescription>Complete los campos</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Descripción</Label>
                  <Input
                    value={form.Descripcion || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Descripcion: e.target.value }))
                    }
                    className={`w-full ${
                      attemptedSave && formError.Descripcion
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {attemptedSave && formError.Descripcion && (
                    <p className="text-red-600 text-sm mt-1">
                      {formError.Descripcion}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Precio unitario</Label>
                  <Input
                    type="number"
                    value={form.PrecioUnitario ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        PrecioUnitario: Number(e.target.value),
                      }))
                    }
                    className={`w-full ${
                      attemptedSave && formError.PrecioUnitario
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {attemptedSave && formError.PrecioUnitario && (
                    <p className="text-red-600 text-sm mt-1">
                      {formError.PrecioUnitario}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Estado</Label>
                  <select
                    className="border rounded-md px-3 py-2 w-full"
                    value={(form.Estado as number) ?? 1}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Estado: Number(e.target.value) }))
                    }
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={save} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabla de artículos */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Descripción
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Precio
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                Estado
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.ArticuloID}
                className="border-b border-border hover:bg-muted/40"
              >
                <td className="py-3 px-4">{a.ArticuloID}</td>
                <td className="py-3 px-4">{a.Descripcion}</td>
                <td className="py-3 px-4 text-right">
                  ${a.PrecioUnitario.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      a.Estado
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {a.Estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    className="mr-2"
                    onClick={() => {
                      openForm(a);
                      setOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setDeleteId(a.ArticuloID);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {message && (
        <div className="bg-green-100 text-green-800 p-2 rounded-md mb-2 text-center">
          {message}
        </div>
      )}

      {/* Modal Confirm Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás segura de eliminar este artículo?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              No
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                remove();
                setDeleteOpen(false);
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
