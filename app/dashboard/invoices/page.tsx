"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Eye, Trash2, FileText, Printer } from "lucide-react"
import { useRouter } from "next/navigation"

interface Invoice {
  id: string
  number: string
  date: string
  client: string
  ruc: string
  subtotal: number
  iva: number
  total: number
  status: "Pagada" | "Pendiente" | "Anulada"
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    number: "001-001-0000001",
    date: "2024-01-15",
    client: "Empresa ABC S.A.",
    ruc: "20123456789",
    subtotal: 4035000,
    iva: 403500,
    total: 4438500,
    status: "Pagada",
  },
  {
    id: "INV-002",
    number: "001-001-0000002",
    date: "2024-01-16",
    client: "Comercial XYZ",
    ruc: "20987654321",
    subtotal: 3500000,
    iva: 350000,
    total: 3850000,
    status: "Pendiente",
  },
  {
    id: "INV-003",
    number: "001-001-0000003",
    date: "2024-01-17",
    client: "Distribuidora 123 S.R.L.",
    ruc: "20456789123",
    subtotal: 535000,
    iva: 53500,
    total: 588500,
    status: "Pagada",
  },
]

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.ruc.includes(searchTerm),
  )

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar esta factura?")) {
      setInvoices(invoices.filter((inv) => inv.id !== id))
    }
  }

  const handlePrint = (invoice: Invoice) => {
    alert(`Imprimiendo factura ${invoice.number}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pagada":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "Anulada":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Facturas</h1>
          <p className="text-muted-foreground mt-1">Gestione las facturas emitidas</p>
        </div>
        <Button
          className="w-full sm:w-auto hover:scale-105 transition-transform"
          size="lg"
          onClick={() => router.push("/dashboard/billing")}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Facturas</p>
              <p className="text-2xl font-bold text-foreground mt-1">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pagadas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {invoices.filter((i) => i.status === "Pagada").length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {invoices.filter((i) => i.status === "Pendiente").length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Facturado</p>
              <p className="text-2xl font-bold text-primary mt-1">
                ${invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Search and Table */}
      <Card className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">Lista de Facturas</h3>
          <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, cliente o RUC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>RUC</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron facturas
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.number}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{invoice.client}</TableCell>
                    <TableCell className="font-mono text-sm">{invoice.ruc}</TableCell>
                    <TableCell className="text-right font-semibold">${invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(invoice)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePrint(invoice)}>
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Factura</DialogTitle>
            <DialogDescription>Información completa de la factura seleccionada</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número de Factura</p>
                  <p className="font-mono font-semibold">{selectedInvoice.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-semibold">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{selectedInvoice.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RUC</p>
                  <p className="font-mono font-semibold">{selectedInvoice.ruc}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (10%)</span>
                    <span className="font-medium">${selectedInvoice.iva.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">${selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}
                >
                  {selectedInvoice.status}
                </span>
                <Button onClick={() => handlePrint(selectedInvoice)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
