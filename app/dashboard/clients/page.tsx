"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

type Cliente = {
  ClienteID: number
  NombreComercial: string
  RNC_Cedula: string
  CuentaContable?: string | null
  Estado: boolean | number
}

export default function ClientsPage() {
  const [data, setData] = useState<Cliente[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Cliente>>({ Estado: 1 })
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    const r = await fetch("/api/clientes")
    setData(await r.json())
  }

  useEffect(() => { load() }, [])

  const filtered = data.filter(c =>
    c.NombreComercial.toLowerCase().includes(search.toLowerCase()) ||
    c.RNC_Cedula.includes(search)
  )

  const save = async () => {
    if (editingId) {
      await fetch(`/api/clientes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setOpen(false)
    setForm({ Estado: 1 })
    setEditingId(null)
    load()
  }

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar cliente?")) return
    await fetch(`/api/clientes/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gestione clientes</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-64" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setForm({ Estado: 1 }); setEditingId(null) }}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                <DialogDescription>Complete los campos requeridos</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Nombre comercial</Label>
                  <Input value={form.NombreComercial || ""} onChange={e=>setForm(f=>({ ...f, NombreComercial:e.target.value }))}/>
                </div>
                <div>
                  <Label>RNC / Cédula</Label>
                  <Input value={form.RNC_Cedula || ""} onChange={e=>setForm(f=>({ ...f, RNC_Cedula:e.target.value }))}/>
                </div>
                <div>
                  <Label>Cuenta contable</Label>
                  <Input value={form.CuentaContable || ""} onChange={e=>setForm(f=>({ ...f, CuentaContable:e.target.value }))}/>
                </div>
                <div>
                  <Label>Estado</Label>
                  <select
                    className="border rounded-md px-3 py-2 w-full"
                    value={(form.Estado as number) ?? 1}
                    onChange={e=>setForm(f=>({ ...f, Estado: Number(e.target.value) }))}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>setOpen(false)}>Cancelar</Button>
                  <Button onClick={save}>Guardar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">RNC/Cédula</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cuenta</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.ClienteID} className="border-b border-border hover:bg-muted/40">
                <td className="py-3 px-4">{c.ClienteID}</td>
                <td className="py-3 px-4">{c.NombreComercial}</td>
                <td className="py-3 px-4">{c.RNC_Cedula}</td>
                <td className="py-3 px-4">{c.CuentaContable || "-"}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${c.Estado ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                    {c.Estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="outline" size="icon" className="mr-2"
                    onClick={()=>{ setEditingId(c.ClienteID); setForm(c); setOpen(true)}}
                  >
                    <Edit className="w-4 h-4"/>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={()=>remove(c.ClienteID)}>
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
