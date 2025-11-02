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
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Building2 } from "lucide-react"

interface Vendor {
  id: string
  name: string
  ruc: string
  email: string
  phone: string
  address: string
  city: string
  contact: string
  balance: number
}

const initialVendors: Vendor[] = [
  {
    id: "VEN-001",
    name: "Distribuidora Tech S.A.",
    ruc: "20111222333",
    email: "ventas@distritech.com",
    phone: "+595 21 111 2222",
    address: "Av. Tecnología 789",
    city: "Asunción",
    contact: "Juan Pérez",
    balance: 45000,
  },
  {
    id: "VEN-002",
    name: "Importadora Global",
    ruc: "20444555666",
    email: "compras@impglobal.com",
    phone: "+595 21 444 5555",
    address: "Ruta 1 Km 20",
    city: "Fernando de la Mora",
    contact: "María González",
    balance: 0,
  },
]

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState<Partial<Vendor>>({})

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ruc.includes(searchTerm) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingVendor) {
      setVendors(vendors.map((v) => (v.id === editingVendor.id ? { ...editingVendor, ...formData } : v)))
    } else {
      const newVendor: Vendor = {
        id: `VEN-${String(vendors.length + 1).padStart(3, "0")}`,
        name: formData.name || "",
        ruc: formData.ruc || "",
        email: formData.email || "",
        phone: formData.phone || "",
        address: formData.address || "",
        city: formData.city || "",
        contact: formData.contact || "",
        balance: 0,
      }
      setVendors([...vendors, newVendor])
    }
    setIsDialogOpen(false)
    setEditingVendor(null)
    setFormData({})
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData(vendor)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar este proveedor?")) {
      setVendors(vendors.filter((v) => v.id !== id))
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingVendor(null)
    setFormData({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground mt-1">Gestione sus proveedores</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({})}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVendor ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
              <DialogDescription>
                {editingVendor ? "Modifique los datos del proveedor" : "Complete los datos del nuevo proveedor"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre / Razón Social *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC *</Label>
                  <Input
                    id="ruc"
                    value={formData.ruc || ""}
                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Persona de Contacto</Label>
                <Input
                  id="contact"
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingVendor ? "Guardar Cambios" : "Crear Proveedor"}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, RUC o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground">{vendor.id}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(vendor)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(vendor.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-foreground truncate">{vendor.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-foreground truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-foreground">{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-foreground truncate">{vendor.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Saldo a Pagar</span>
                <span className={`text-lg font-bold ${vendor.balance > 0 ? "text-destructive" : "text-primary"}`}>
                  ${vendor.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No se encontraron proveedores</p>
        </Card>
      )}
    </div>
  )
}
