"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Calendar } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface AccountingEntry {
  id: string
  date: string
  description: string
  reference: string
  type: "Venta" | "Compra" | "Pago" | "Cobro" | "Ajuste"
  debit: number
  credit: number
  balance: number
}

const initialEntries: AccountingEntry[] = [
  {
    id: "ASI-001",
    date: "2025-01-28",
    description: "Venta según factura FAC-001",
    reference: "FAC-001",
    type: "Venta",
    debit: 15000,
    credit: 0,
    balance: 15000,
  },
  {
    id: "ASI-002",
    date: "2025-01-27",
    description: "Compra de mercadería",
    reference: "COMP-045",
    type: "Compra",
    debit: 0,
    credit: 8500,
    balance: 6500,
  },
  {
    id: "ASI-003",
    date: "2025-01-26",
    description: "Cobro de factura FAC-002",
    reference: "FAC-002",
    type: "Cobro",
    debit: 22000,
    credit: 0,
    balance: 28500,
  },
  {
    id: "ASI-004",
    date: "2025-01-25",
    description: "Pago a proveedor",
    reference: "PROV-001",
    type: "Pago",
    debit: 0,
    credit: 12500,
    balance: 16000,
  },
  {
    id: "ASI-005",
    date: "2025-01-24",
    description: "Ajuste de inventario",
    reference: "AJ-001",
    type: "Ajuste",
    debit: 0,
    credit: 3500,
    balance: 12500,
  },
]

const entryTypes = ["Venta", "Compra", "Pago", "Cobro", "Ajuste"]

export default function AccountingPage() {
  const [entries, setEntries] = useState<AccountingEntry[]>(initialEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<AccountingEntry | null>(null)
  const [formData, setFormData] = useState<Partial<AccountingEntry>>({
    date: new Date().toISOString().split("T")[0],
    type: "Venta",
  })

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || entry.type === filterType
    return matchesSearch && matchesType
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry: AccountingEntry = {
      id: `ASI-${String(entries.length + 1).padStart(3, "0")}`,
      date: formData.date || "",
      description: formData.description || "",
      reference: formData.reference || "",
      type: (formData.type as AccountingEntry["type"]) || "Venta",
      debit: Number(formData.debit) || 0,
      credit: Number(formData.credit) || 0,
      balance: (Number(formData.debit) || 0) - (Number(formData.credit) || 0),
    }
    setEntries([newEntry, ...entries])
    setIsDialogOpen(false)
    setFormData({ date: new Date().toISOString().split("T")[0], type: "Venta" })
  }

  const handleViewDetails = (entry: AccountingEntry) => {
    setSelectedEntry(entry)
  }

  const totalDebit = filteredEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = filteredEntries.reduce((sum, entry) => sum + entry.credit, 0)
  const netBalance = totalDebit - totalCredit

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asientos Contables</h1>
          <p className="text-muted-foreground mt-1">Registro de movimientos contables</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ date: new Date().toISOString().split("T")[0], type: "Venta" })}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Asiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Asiento Contable</DialogTitle>
              <DialogDescription>Complete los datos del asiento contable</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type || ""}
                    onValueChange={(value) => setFormData({ ...formData, type: value as AccountingEntry["type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {entryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Referencia *</Label>
                <Input
                  id="reference"
                  placeholder="Ej: FAC-001, COMP-045"
                  value={formData.reference || ""}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del asiento contable"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debit">Debe *</Label>
                  <Input
                    id="debit"
                    type="number"
                    placeholder="0"
                    value={formData.debit || ""}
                    onChange={(e) => setFormData({ ...formData, debit: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit">Haber *</Label>
                  <Input
                    id="credit"
                    type="number"
                    placeholder="0"
                    value={formData.credit || ""}
                    onChange={(e) => setFormData({ ...formData, credit: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Crear Asiento
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Debe</p>
              <p className="text-2xl font-bold text-foreground mt-2">${totalDebit.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Haber</p>
              <p className="text-2xl font-bold text-foreground mt-2">${totalCredit.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-destructive rotate-45" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo Neto</p>
              <p className={`text-2xl font-bold mt-2 ${netBalance >= 0 ? "text-primary" : "text-destructive"}`}>
                ${netBalance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-chart-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por descripción, referencia o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {entryTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Entries Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Descripción</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Referencia</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Debe</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Haber</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Saldo</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{entry.id}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{entry.date}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{entry.description}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{entry.reference}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.type === "Venta" || entry.type === "Cobro"
                          ? "bg-primary/10 text-primary"
                          : entry.type === "Compra" || entry.type === "Pago"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-chart-4/10 text-chart-4"
                      }`}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-foreground">
                    {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-foreground">
                    {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold">
                    <span className={entry.balance >= 0 ? "text-primary" : "text-destructive"}>
                      ${Math.abs(entry.balance).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(entry)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredEntries.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No se encontraron asientos contables</p>
        </Card>
      )}

      {/* Entry Details Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalle del Asiento</DialogTitle>
              <DialogDescription>{selectedEntry.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Fecha</Label>
                  <p className="text-foreground font-medium">{selectedEntry.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="text-foreground font-medium">{selectedEntry.type}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Referencia</Label>
                <p className="text-foreground font-medium">{selectedEntry.reference}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <p className="text-foreground">{selectedEntry.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Debe</Label>
                  <p className="text-foreground font-bold text-lg">${selectedEntry.debit.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Haber</Label>
                  <p className="text-foreground font-bold text-lg">${selectedEntry.credit.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <Label className="text-muted-foreground">Saldo</Label>
                <p className={`font-bold text-2xl ${selectedEntry.balance >= 0 ? "text-primary" : "text-destructive"}`}>
                  ${Math.abs(selectedEntry.balance).toLocaleString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
