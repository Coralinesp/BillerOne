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

type Vendedor = {
  VendedorID: number
  Nombre: string
  PorcentajeComision: number
  Estado: number | boolean
}

export default function SellersPage() {
  const [data, setData] = useState<Vendedor[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Vendedor>>({ Estado: 1, PorcentajeComision: 0 })
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    const r = await fetch("/api/vendedores", { cache: "no-store" })
    setData(await r.json())
  }

  useEffect(() => { load() }, [])

  const filtered = data.filter(v =>
    v.Nombre.toLowerCase().includes(search.toLowerCase()) ||
    String(v.VendedorID).includes(search)
  )

  const save = async () => {
    if (editingId) {
      await fetch(`/api/vendedores/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch("/api/vendedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setOpen(false)
    setForm({ Estado: 1, PorcentajeComision: 0 })
    setEditingId(null)
    load()
  }

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar vendedor?")) return
    await fetch(`/api/vendedores/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Vendedores</h1>
          <p className="text-muted-foreground mt-1">Gestione vendedores (empleados)</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-64" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setForm({ Estado: 1, PorcentajeComision: 0 }); setEditingId(null) }}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Vendedor" : "Nuevo Vendedor"}</DialogTitle>
                <DialogDescription>Complete los campos</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={form.Nombre || ""} onChange={e=>setForm(f=>({ ...f, Nombre:e.target.value }))}/>
                </div>
                <div>
                  <Label>% Comisión</Label>
                  <Input type="number" value={form.PorcentajeComision ?? 0} onChange={e=>setForm(f=>({ ...f, PorcentajeComision:Number(e.target.value) }))}/>
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
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">% Comisión</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v=>(
              <tr key={v.VendedorID} className="border-b border-border hover:bg-muted/40">
                <td className="py-3 px-4">{v.VendedorID}</td>
                <td className="py-3 px-4">{v.Nombre}</td>
                <td className="py-3 px-4 text-right">{v.PorcentajeComision}%</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${v.Estado ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                    {v.Estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="outline" size="icon" className="mr-2"
                    onClick={()=>{ setEditingId(v.VendedorID); setForm(v); setOpen(true)}}
                  >
                    <Edit className="w-4 h-4"/>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={()=>remove(v.VendedorID)}>
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
