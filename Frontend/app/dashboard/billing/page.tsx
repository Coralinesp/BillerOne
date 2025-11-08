"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useFacturacion } from "./Logic";

export default function FacturacionPage() {
  const f = useFacturacion();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Punto de Venta
        </h1>
        <p className="text-muted-foreground mt-1">Genere facturas de venta</p>
      </div>

      {/* SECCIÓN PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* IZQUIERDA: Artículos */}
        <div>
          <Card className="p-4 lg:p-6 space-y-4">
            <Label>Artículos disponibles</Label>

            <div className="mt-2">
              <Input
                placeholder="Buscar por ID o descripción..."
                value={f.busqueda}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  f.setBusqueda(e.target.value)
                }
                className="mb-3"
              />
            </div>

            <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {f.articulos.length > 0 ? (
                f.articulos
                  .filter(
                    (a) =>
                      a.Descripcion.toLowerCase().includes(
                        f.busqueda.toLowerCase()
                      ) || String(a.ArticuloID).includes(f.busqueda)
                  )
                  .map((a) => (
                    <div
                      key={a.ArticuloID}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 transition"
                    >
                      <div>
                        <p className="font-medium">{a.Descripcion}</p>
                        <p className="text-sm text-muted-foreground">
                          ${a.PrecioUnitario.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => f.addArticulo(a)}
                        className="bg-emerald-700 hover:bg-emerald-900"
                      >
                        Agregar
                      </Button>
                    </div>
                  ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay artículos disponibles
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* DERECHA: Facturación */}
        <div>
          <Card className="p-4 lg:p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Cliente</Label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={f.clienteId}
                  onChange={(e) =>
                    f.setClienteId(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Seleccione…</option>
                  {f.clientes.map((c) => (
                    <option key={c.ClienteID} value={c.ClienteID}>
                      {c.NombreComercial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Vendedor</Label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={f.vendedorId}
                  onChange={(e) =>
                    f.setVendedorId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                >
                  <option value="">Seleccione…</option>
                  {f.vendedores.map((v) => (
                    <option key={v.VendedorID} value={v.VendedorID}>
                      {v.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Comentario</Label>
                <Input
                  value={f.comentario}
                  onChange={(e) => f.setComentario(e.target.value)}
                />
              </div>
            </div>

            {/* TABLA DE ITEMS */}
            <div className="overflow-x-auto mt-4">
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
                  {f.items.map((i) => (
                    <tr key={i.key} className="border-b border-border">
                      <td className="py-2 px-2">{i.Descripcion}</td>
                      <td className="py-2 px-2 text-right">
                        ${i.PrecioUnitario.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Input
                          type="number"
                          className="w-20 text-right"
                          value={i.Cantidad}
                          onChange={(e) =>
                            f.cambiarCantidad(
                              i.key,
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-medium">
                        ${i.Importe.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => f.remove(i.key)}
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTALES */}
            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${f.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ITBIS</span>
                <span className="font-medium">${f.itbis.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">
                  ${f.total.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={f.crearFactura}
                  className="bg-emerald-700 hover:bg-emerald-900"
                >
                  Generar factura
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* TABLA DE FACTURAS */}
      <Card className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Facturas Generadas</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={f.loadFacturas}>
              Actualizar
            </Button>
            <Button variant="outline" size="sm" onClick={f.exportarExcel}>
              Exportar a Excel
            </Button>
          </div>
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
              {f.facturas.map((x) => (
                <tr
                  key={x.FacturaID}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="py-2 px-2">{x.FacturaID}</td>
                  <td className="py-2 px-2">{x.Cliente}</td>
                  <td className="py-2 px-2">{x.Vendedor}</td>
                  <td className="py-2 px-2">
                    {new Date(x.Fecha).toLocaleString()}
                  </td>
                  <td className="py-2 px-2">{x.Comentario || "-"}</td>
                  <td className="py-2 px-2 text-right font-medium">
                    ${x.Total?.toLocaleString() || "0"}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => f.verDetalle(x.FacturaID)}
                    >
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))}

              {f.facturas.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hay facturas generadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DIALOGS */}
      <Dialog open={f.open} onOpenChange={f.setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Factura creada</DialogTitle>
          </DialogHeader>
          <p>La factura se generó correctamente.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={f.openDetalle} onOpenChange={f.setOpenDetalle}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalle de Factura #{f.facturaSeleccionada?.FacturaID}
            </DialogTitle>
          </DialogHeader>

          {f.facturaSeleccionada && (
            // 👇 AGREGA ESTE DIV CON EL ID
            <div
              id="detalle-factura"
              className="space-y-4 bg-white p-4 rounded-lg"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{f.facturaSeleccionada.Cliente}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vendedor</Label>
                  <p className="font-medium">
                    {f.facturaSeleccionada.Vendedor}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha</Label>
                  <p className="font-medium">
                    {new Date(f.facturaSeleccionada.Fecha).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Comentario</Label>
                  <p className="font-medium">
                    {f.facturaSeleccionada.Comentario || "Sin comentarios"}
                  </p>
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
                    {f.facturaSeleccionada.Detalle.map((d) => (
                      <tr key={d.DetalleID} className="border-b">
                        <td className="py-2 px-2">{d.Descripcion}</td>
                        <td className="py-2 px-2 text-right">
                          ${d.PrecioUnitario.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-right">{d.Cantidad}</td>
                        <td className="py-2 px-2 text-right font-medium">
                          ${d.Importe.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={f.imprimirPDF}
              className="bg-blue-600 hover:bg-blue-800"
            >
              Imprimir PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
