"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Search, ShoppingCart, Printer, Receipt } from "lucide-react"

interface InvoiceItem {
  id: string
  code: string
  name: string
  quantity: number
  price: number
  total: number
}

interface Client {
  id: string
  name: string
  ruc: string
}

const mockClients: Client[] = [
  { id: "CLI-001", name: "Empresa ABC S.A.", ruc: "20123456789" },
  { id: "CLI-002", name: "Comercial XYZ", ruc: "20987654321" },
  { id: "CLI-003", name: "Distribuidora 123 S.R.L.", ruc: "20456789123" },
]

const mockArticles = [
  { code: "PROD001", name: "Laptop HP 15-dy2021la", price: 3500000 },
  { code: "PROD002", name: "Mouse Logitech M185", price: 85000 },
  { code: "PROD003", name: "Teclado Mecánico RGB", price: 450000 },
]

export default function BillingPage() {
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [searchCode, setSearchCode] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("001-001-0000001")
  const [paymentMethod, setPaymentMethod] = useState("Efectivo")

  const addItem = () => {
    const article = mockArticles.find((a) => a.code === searchCode)
    if (article) {
      const existingItem = items.find((i) => i.code === article.code)
      if (existingItem) {
        setItems(
          items.map((i) =>
            i.code === article.code ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i,
          ),
        )
      } else {
        const newItem: InvoiceItem = {
          id: `ITEM-${items.length + 1}`,
          code: article.code,
          name: article.name,
          quantity: 1,
          price: article.price,
          total: article.price,
        }
        setItems([...items, newItem])
      }
      setSearchCode("")
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(items.map((i) => (i.id === id ? { ...i, quantity, total: quantity * i.price } : i)))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const iva = subtotal * 0.1
  const total = subtotal + iva

  const handleInvoice = () => {
    if (!selectedClient || items.length === 0) {
      alert("Seleccione un cliente y agregue al menos un artículo")
      return
    }
    alert("Factura generada exitosamente")
    // Reset form
    setItems([])
    setSelectedClient("")
    setSearchCode("")
  }

  const handlePrint = () => {
    if (!selectedClient || items.length === 0) {
      alert("Seleccione un cliente y agregue al menos un artículo")
      return
    }
    alert("Imprimiendo factura...")
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Punto de Venta</h1>
        <p className="text-muted-foreground mt-1">Genere facturas de venta</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column - Available Articles Grid */}
        <div className="space-y-4">
          <Card className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Artículos Disponibles</h3>
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar artículo..." className="pl-9 h-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
              {mockArticles.map((article) => (
                <Card
                  key={article.code}
                  className="p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200"
                  onClick={() => {
                    setSearchCode(article.code)
                    setTimeout(addItem, 100)
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-mono text-muted-foreground mb-1">{article.code}</p>
                      <h4 className="font-semibold text-sm text-foreground leading-tight">{article.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">${article.price.toLocaleString()}</span>
                    <Button size="sm" className="h-8 hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Invoice Form */}
        <div className="space-y-4">
          {/* Client Selection */}
          <Card className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Datos del Cliente</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  value={mockClients.find((c) => c.id === selectedClient)?.ruc || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </Card>

          {/* Invoice Details */}
          <Card className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Detalles de Factura</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice">Nro. Factura</Label>
                <Input id="invoice" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment">Forma de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Items in Cart */}
          <Card className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Artículos en Factura</h3>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay artículos agregados</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">${item.total.toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Totals */}
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="text-lg font-semibold text-foreground mb-4">Totales</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">IVA (10%)</span>
                <span className="text-foreground font-medium">${iva.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="w-full hover:scale-105 transition-transform" size="lg" onClick={handlePrint}>
              <Printer className="w-5 h-5 mr-2" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              className="w-full hover:scale-105 transition-transform bg-transparent"
              size="lg"
              onClick={handleInvoice}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Facturar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
