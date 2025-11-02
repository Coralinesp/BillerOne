"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">Ajustes del sistema</p>
      </div>

      {/* Company Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Datos de la Empresa</h3>
            <p className="text-sm text-muted-foreground">Información general de su empresa</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Razón Social</Label>
              <Input id="companyName" defaultValue="Mi Empresa S.A." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input id="ruc" defaultValue="20123456789" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" defaultValue="Av. Principal 123, Asunción" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" defaultValue="+595 21 123 4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="contacto@miempresa.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={3} defaultValue="Empresa dedicada a la venta de productos tecnológicos" />
          </div>
        </div>
      </Card>

      {/* Invoice Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Configuración de Facturación</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Prefijo de Factura</Label>
              <Input id="invoicePrefix" defaultValue="001-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextNumber">Próximo Número</Label>
              <Input id="nextNumber" type="number" defaultValue="0000001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ivaRate">Tasa de IVA (%)</Label>
              <Input id="ivaRate" type="number" defaultValue="10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select defaultValue="PYG">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PYG">Guaraníes (₲)</SelectItem>
                <SelectItem value="USD">Dólares ($)</SelectItem>
                <SelectItem value="EUR">Euros (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* System Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Configuración del Sistema</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select defaultValue="es">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Zona Horaria</Label>
            <Select defaultValue="america/asuncion">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="america/asuncion">América/Asunción</SelectItem>
                <SelectItem value="america/sao_paulo">América/São Paulo</SelectItem>
                <SelectItem value="america/buenos_aires">América/Buenos Aires</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-5 h-5 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
