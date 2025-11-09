"use client";

import { Card } from "@/components/ui/card";
import {
  DollarSign,
  FileText,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const salesData = [
  { month: "Ene", ventas: 45000, compras: 32000 },
  { month: "Feb", ventas: 52000, compras: 38000 },
  { month: "Mar", ventas: 48000, compras: 35000 },
  { month: "Abr", ventas: 61000, compras: 42000 },
  { month: "May", ventas: 55000, compras: 39000 },
  { month: "Jun", ventas: 67000, compras: 45000 },
];

const recentInvoices = [
  {
    id: "FAC-001",
    client: "Empresa ABC",
    amount: 15000,
    date: "2025-01-28",
    status: "Pagada",
  },
  {
    id: "FAC-002",
    client: "Comercial XYZ",
    amount: 8500,
    date: "2025-01-27",
    status: "Pendiente",
  },
  {
    id: "FAC-003",
    client: "Distribuidora 123",
    amount: 22000,
    date: "2025-01-26",
    status: "Pagada",
  },
  {
    id: "FAC-004",
    client: "Servicios Pro",
    amount: 12500,
    date: "2025-01-25",
    status: "Vencida",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Panel de Control
        </h1>
        <p className="text-muted-foreground mt-1">
          Resumen general de su negocio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ventas del Mes
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">$67,000</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Facturas Emitidas
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">142</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-chart-2" />
                <span className="text-sm text-chart-2 font-medium">+8.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-chart-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes Activos
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">89</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-chart-3" />
                <span className="text-sm text-chart-3 font-medium">+5.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-chart-3" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Productos
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">456</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">
                  -2.3%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-chart-4/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-chart-4" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Ventas vs Compras
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Bar
                dataKey="ventas"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="compras"
                fill="hsl(var(--chart-2))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Tendencia de Ventas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Facturas Recientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Factura
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Monto
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Fecha
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-foreground">
                    {invoice.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {invoice.client}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {invoice.date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "Pagada"
                          ? "bg-primary/10 text-primary"
                          : invoice.status === "Pendiente"
                          ? "bg-chart-4/10 text-chart-4"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
