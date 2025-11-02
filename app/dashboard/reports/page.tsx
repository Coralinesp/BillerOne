"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, TrendingUp, Users, Package } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const salesByMonth = [
  { month: "Ene", ventas: 45000, compras: 32000, utilidad: 13000 },
  { month: "Feb", ventas: 52000, compras: 38000, utilidad: 14000 },
  { month: "Mar", ventas: 48000, compras: 35000, utilidad: 13000 },
  { month: "Abr", ventas: 61000, compras: 42000, utilidad: 19000 },
  { month: "May", ventas: 55000, compras: 39000, utilidad: 16000 },
  { month: "Jun", ventas: 67000, compras: 45000, utilidad: 22000 },
]

const salesByCategory = [
  { name: "Electrónica", value: 145000, percentage: 45 },
  { name: "Accesorios", value: 98000, percentage: 30 },
  { name: "Software", value: 52000, percentage: 16 },
  { name: "Servicios", value: 29000, percentage: 9 },
]

const topClients = [
  { name: "Empresa ABC S.A.", sales: 125000, invoices: 45 },
  { name: "Comercial XYZ", sales: 98000, invoices: 32 },
  { name: "Distribuidora 123", sales: 87000, invoices: 28 },
  { name: "Servicios Pro", sales: 65000, invoices: 21 },
  { name: "Tech Solutions", sales: 54000, invoices: 18 },
]

const topProducts = [
  { name: "Laptop HP 15-dy2021la", units: 45, revenue: 157500 },
  { name: "Mouse Logitech M185", units: 120, revenue: 10200 },
  { name: "Teclado Mecánico RGB", units: 38, revenue: 17100 },
  { name: 'Monitor LG 24"', units: 32, revenue: 96000 },
  { name: "Impresora HP LaserJet", units: 28, revenue: 84000 },
]

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("sales")
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-06-30")
  const [format, setFormat] = useState("pdf")

  const handleExport = () => {
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
        <p className="text-muted-foreground mt-1">Análisis y reportes del sistema</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Tipo de Reporte</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Ventas</SelectItem>
                <SelectItem value="purchases">Compras</SelectItem>
                <SelectItem value="inventory">Inventario</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="accounting">Contabilidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha Inicio</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Fecha Fin</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ventas Totales</p>
                  <p className="text-2xl font-bold text-foreground mt-2">$328,000</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Facturas</p>
                  <p className="text-2xl font-bold text-foreground mt-2">142</p>
                </div>
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-chart-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold text-foreground mt-2">89</p>
                </div>
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-3" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Productos</p>
                  <p className="text-2xl font-bold text-foreground mt-2">456</p>
                </div>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-chart-4" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ventas por Mes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="utilidad" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ventas por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Análisis de Ventas</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="compras" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="utilidad" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumen Mensual</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mes</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ventas</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Compras</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Utilidad</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Margen</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByMonth.map((row) => {
                    const margin = ((row.utilidad / row.ventas) * 100).toFixed(1)
                    return (
                      <tr key={row.month} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{row.month}</td>
                        <td className="py-3 px-4 text-sm text-right text-foreground">${row.ventas.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-foreground">
                          ${row.compras.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-primary">
                          ${row.utilidad.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-primary font-medium">{margin}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top 5 Clientes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ventas</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Facturas</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {topClients.map((client, index) => {
                    const average = client.sales / client.invoices
                    return (
                      <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{client.name}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-foreground">
                          ${client.sales.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-foreground">{client.invoices}</td>
                        <td className="py-3 px-4 text-sm text-right text-primary font-medium">
                          ${average.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top 5 Productos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Unidades</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ingresos</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio Prom.</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => {
                    const avgPrice = product.revenue / product.units
                    return (
                      <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{product.name}</td>
                        <td className="py-3 px-4 text-sm text-right text-foreground">{product.units}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-foreground">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-primary font-medium">
                          ${avgPrice.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
