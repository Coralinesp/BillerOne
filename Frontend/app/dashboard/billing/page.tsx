"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const API_BASE_URL = "http://localhost:5000"

type Cliente = { ClienteID:number; NombreComercial:string; RNC_Cedula?:string }
type Articulo = { ArticuloID:number; Descripcion:string; PrecioUnitario:number; Estado:number }
type Vendedor = { VendedorID:number; Nombre:string }

type Item = {
  key: string
  ArticuloID: number
  Descripcion: string
  Cantidad: number
  PrecioUnitario: number
  Importe: number
}

type Factura = {
  FacturaID: number
  ClienteID: number
  Cliente: string
  VendedorID: number
  Vendedor: string
  Fecha: string
  Comentario: string | null
  Total: number
}

type FacturaDetalle = {
  FacturaID: number
  ClienteID: number
  Cliente: string
  VendedorID: number
  Vendedor: string
  Fecha: string
  Comentario: string | null
  Detalle: Array<{
    DetalleID: number
    ArticuloID: number
    Descripcion: string
    Cantidad: number
    PrecioUnitario: number
    Importe: number
  }>
}

export default function FacturacionPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vendedores, setVendedores] = useState<Vendedor[]>([])
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [clienteId, setClienteId] = useState<number | "">("")
  const [vendedorId, setVendedorId] = useState<number | "">("")
  const [items, setItems] = useState<Item[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [comentario, setComentario] = useState("")
  const [open, setOpen] = useState(false)
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaDetalle | null>(null)
  const [openDetalle, setOpenDetalle] = useState(false)

  const load = async () => {
    const [c, a, v] = await Promise.all([
      fetch(`${API_BASE_URL}/api/clientes`).then(r=>r.json()),
      fetch(`${API_BASE_URL}/api/articulos`).then(r=>r.json()),
      fetch(`${API_BASE_URL}/api/vendedores`).then(r=>r.json()),
    ])
    setClientes(c)
    setArticulos(a.filter((x:Articulo)=>x.Estado))
    setVendedores(v)
  }

  const loadFacturas = async () => {
    const f = await fetch(`${API_BASE_URL}/api/facturas`).then(r=>r.json())
    setFacturas(f)
  }

  useEffect(()=>{ 
    load()
    loadFacturas()
  }, [])

  const results = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return []
    return articulos.filter(a =>
      a.Descripcion.toLowerCase().includes(q) || String(a.ArticuloID).includes(q)
    ).slice(0,10)
  }, [busqueda, articulos])

  const addArticulo = (a: Articulo) => {
    const found = items.find(i => i.ArticuloID === a.ArticuloID)
    if (found) {
      const updated = items.map(i =>
        i.ArticuloID === a.ArticuloID
          ? { ...i, Cantidad: i.Cantidad + 1, Importe: (i.Cantidad + 1) * i.PrecioUnitario }
          : i
      )
      setItems(updated)
    } else {
      setItems(prev => [...prev, {
        key: `k${prev.length+1}`,
        ArticuloID: a.ArticuloID,
        Descripcion: a.Descripcion,
        Cantidad: 1,
        PrecioUnitario: a.PrecioUnitario,
        Importe: a.PrecioUnitario,
      }])
    }
    setBusqueda("")
  }

  const cambiarCantidad = (k: string, c: number) => {
    if (c <= 0) return setItems(prev => prev.filter(i=>i.key!==k))
    setItems(prev => prev.map(i => i.key===k ? ({ ...i, Cantidad: c, Importe: c*i.PrecioUnitario }) : i))
  }

  const remove = (k: string) => setItems(prev => prev.filter(i=>i.key!==k))

  const subtotal = items.reduce((s,i)=>s+i.Importe,0)
  const itbis = +(subtotal * 0.18).toFixed(2)
  const total = subtotal + itbis

  const crearFactura = async () => {
    if (!clienteId || !vendedorId || items.length===0) {
      alert("Seleccione cliente, vendedor y al menos un artículo")
      return
    }
    const payload = {
      ClienteID: Number(clienteId),
      VendedorID: Number(vendedorId),
      Comentario: comentario || null,
      Detalle: items.map(i=>({
        ArticuloID: i.ArticuloID,
        Cantidad: i.Cantidad,
        PrecioUnitario: i.PrecioUnitario
      })),
    }
    const r = await fetch(`${API_BASE_URL}/api/facturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!r.ok) {
      const e = await r.json().catch(()=>({}))
      alert("Error al crear factura: " + (e.detail || r.status))
      return
    }
    setOpen(true)
    // reset
    setClienteId("")
    setVendedorId("")
    setComentario("")
    setItems([])
    // recargar facturas
    loadFacturas()
  }

  const verDetalle = async (facturaId: number) => {
    const detalle = await fetch(`${API_BASE_URL}/api/facturas/${facturaId}`).then(r=>r.json())
    setFacturaSeleccionada(detalle)
    setOpenDetalle(true)
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Punto de Venta</h1>
        <p className="text-muted-foreground mt-1">Genere facturas de venta</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4 lg:p-6">
            <Label>Buscar artículo</Label>
            <Input placeholder="ID o descripción" value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
            {!!results.length && (
              <div className="mt-2 border rounded-lg divide-y">
                {results.map((a)=>(
                  <button key={a.ArticuloID}
                          onClick={()=>addArticulo(a)}
                          className="w-full text-left p-3 hover:bg-muted/50">
                    <div className="flex justify-between">
                      <span>{a.Descripcion}</span>
                      <span className="font-mono">${a.PrecioUnitario.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Cliente</Label>
                <select className="border rounded-md px-3 py-2 w-full"
                        value={clienteId}
                        onChange={e=>setClienteId(e.target.value ? Number(e.target.value) : "")}>
                  <option value="">Seleccione…</option>
                  {clientes.map(c=>(
                    <option key={c.ClienteID} value={c.ClienteID}>{c.NombreComercial}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Vendedor</Label>
                <select className="border rounded-md px-3 py-2 w-full"
                        value={vendedorId}
                        onChange={e=>setVendedorId(e.target.value ? Number(e.target.value) : "")}>
                  <option value="">Seleccione…</option>
                  {vendedores.map(v=>(
                    <option key={v.VendedorID} value={v.VendedorID}>{v.Nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Comentario</Label>
                <Input value={comentario} onChange={e=>setComentario(e.target.value)} />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 lg:p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Artículo</th>
                    <th className="text-right py-2 px-2">Precio</th>
                    <th className="text-right py-2 px-2">Cantidad</th>
                    <th className="text-right py-2 px-2">Importe</th>
                    <th className="text-right py-2 px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i=>(
                    <tr key={i.key} className="border-b border-border">
                      <td className="py-2 px-2">{i.Descripcion}</td>
                      <td className="py-2 px-2 text-right">${i.PrecioUnitario.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right">
                        <Input type="number" className="w-24 text-right"
                               value={i.Cantidad}
                               onChange={e=>cambiarCantidad(i.key, Number(e.target.value) || 0)} />
                      </td>
                      <td className="py-2 px-2 text-right font-medium">${i.Importe.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right">
                        <Button variant="destructive" size="sm" onClick={()=>remove(i.key)}>Quitar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ITBIS</span>
                <span className="font-medium">${itbis.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={crearFactura}>Generar factura</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Facturas Generadas</h2>
          <Button variant="outline" size="sm" onClick={loadFacturas}>Actualizar</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2">ID</th>
                <th className="text-left py-2 px-2">Cliente</th>
                <th className="text-left py-2 px-2">Vendedor</th>
                <th className="text-left py-2 px-2">Fecha</th>
                <th className="text-left py-2 px-2">Comentario</th>
                <th className="text-right py-2 px-2">Total</th>
                <th className="text-center py-2 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map(f=>(
                <tr key={f.FacturaID} className="border-b border-border hover:bg-muted/30">
                  <td className="py-2 px-2">{f.FacturaID}</td>
                  <td className="py-2 px-2">{f.Cliente}</td>
                  <td className="py-2 px-2">{f.Vendedor}</td>
                  <td className="py-2 px-2">{new Date(f.Fecha).toLocaleString()}</td>
                  <td className="py-2 px-2">{f.Comentario || "-"}</td>
                  <td className="py-2 px-2 text-right font-medium">${f.Total?.toLocaleString() || "0"}</td>
                  <td className="py-2 px-2 text-center">
                    <Button variant="outline" size="sm" onClick={()=>verDetalle(f.FacturaID)}>
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))}
              {facturas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay facturas generadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Factura creada</DialogTitle></DialogHeader>
          <p>La factura se generó correctamente.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetalle} onOpenChange={setOpenDetalle}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Factura #{facturaSeleccionada?.FacturaID}</DialogTitle>
          </DialogHeader>
          {facturaSeleccionada && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{facturaSeleccionada.Cliente}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vendedor</Label>
                  <p className="font-medium">{facturaSeleccionada.Vendedor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha</Label>
                  <p className="font-medium">{new Date(facturaSeleccionada.Fecha).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Comentario</Label>
                  <p className="font-medium">{facturaSeleccionada.Comentario || "Sin comentarios"}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Artículos</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Artículo</th>
                      <th className="text-right py-2 px-2">Precio</th>
                      <th className="text-right py-2 px-2">Cantidad</th>
                      <th className="text-right py-2 px-2">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturaSeleccionada.Detalle.map(d=>(
                      <tr key={d.DetalleID} className="border-b">
                        <td className="py-2 px-2">{d.Descripcion}</td>
                        <td className="py-2 px-2 text-right">${d.PrecioUnitario.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right">{d.Cantidad}</td>
                        <td className="py-2 px-2 text-right font-medium">${d.Importe.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4 space-y-2">
                {(() => {
                  const sub = facturaSeleccionada.Detalle.reduce((s,d)=>s+d.Importe,0)
                  const itb = +(sub * 0.18).toFixed(2)
                  const tot = sub + itb
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${sub.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ITBIS (18%)</span>
                        <span className="font-medium">${itb.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-bold text-primary">${tot.toLocaleString()}</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}