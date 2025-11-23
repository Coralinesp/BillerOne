"use client";

import React from "react";
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
import { useUsersLogic } from "./Logic";

export default function UserPage() {
  const logic = useUsersLogic();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Usuarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestione los usuarios del sistema
          </p>
        </div>

        <div className="flex gap-2">
          {/* Buscar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 w-64"
              placeholder="Buscar..."
              value={logic.search}
              onChange={(e) => logic.setSearch(e.target.value)}
            />
          </div>

          {/* Botón Nuevo */}
          <Dialog open={logic.open} onOpenChange={logic.setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={logic.prepareNew}
                className="bg-emerald-700 hover:bg-emerald-900"
              >
                <Plus className="w-4 h-4 mr-2" /> Nuevo
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {logic.editingId ? "Editar Usuario" : "Nuevo Usuario"}
                </DialogTitle>
                <DialogDescription>Complete los campos</DialogDescription>
              </DialogHeader>

              {/* FORM */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={logic.form.Nombre}
                    onChange={(e) =>
                      logic.setForm({ ...logic.form, Nombre: e.target.value })
                    }
                    className={
                      logic.attemptedSave && logic.formError.Nombre
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>

                <div>
                  <Label>Usuario (Email)</Label>
                  <Input
                    value={logic.form.Usuario}
                    onChange={(e) =>
                      logic.setForm({ ...logic.form, Usuario: e.target.value })
                    }
                    className={
                      logic.attemptedSave && logic.formError.Usuario
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>

                <div>
                  <Label>
                    Contraseña{" "}
                    {logic.editingId && "(déjalo vacío si no deseas cambiarla)"}
                  </Label>
                  <Input
                    type="password"
                    placeholder={
                      logic.editingId
                        ? "Nueva contraseña (opcional)"
                        : "Ingrese una contraseña"
                    }
                    value={logic.form.Password}
                    onChange={(e) =>
                      logic.setForm({ ...logic.form, Password: e.target.value })
                    }
                    className={
                      logic.attemptedSave &&
                      !logic.editingId &&
                      logic.formError.Password
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => logic.setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={logic.save}
                    disabled={logic.saving}
                    className="bg-emerald-700 hover:bg-emerald-900"
                  >
                    {logic.saving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabla */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Nombre
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Usuario
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                Contraseña
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {logic.filtered.map((u) => (
              <tr
                key={u.Id}
                className="border-b border-border hover:bg-muted/40"
              >
                <td className="py-3 px-4">{u.Id}</td>
                <td className="py-3 px-4">{u.Nombre}</td>
                <td className="py-3 px-4">{u.Usuario}</td>
                <td className="py-3 px-4 text-center">********</td>

                {/* ACCIONES */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    {/* EDITAR */}
                    <button onClick={() => logic.editUser(u)}>
                      <Edit className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </button>

                    {/* ELIMINAR */}
                    <button onClick={() => logic.confirmDelete(u)}>
                      <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mensaje */}
      {logic.message && (
        <div className="bg-green-100 text-green-800 p-2 rounded-md text-center">
          {logic.message}
        </div>
      )}

      {/* Modal eliminar */}
      <Dialog open={logic.deleteOpen} onOpenChange={logic.setDeleteOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              {logic.selectedUser
                ? `¿Seguro que deseas eliminar a "${logic.selectedUser.Nombre}"?`
                : "¿Seguro que deseas eliminar este usuario?"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => logic.setDeleteOpen(false)}
            >
              Cancelar
            </Button>

            <Button variant="destructive" onClick={logic.remove}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
