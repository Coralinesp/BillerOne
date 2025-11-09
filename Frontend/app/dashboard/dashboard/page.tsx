"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingBag,
  FileText,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    clientes: 0,
    vendedores: 0,
    articulos: 0,
    facturas: 0,
  });
  const [ventasData, setVentasData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientes, vendedores, articulos, facturas] = await Promise.all([
        fetch("http://localhost:5000/api/clientes").then((r) => r.json()),
        fetch("http://localhost:5000/api/vendedores").then((r) => r.json()),
        fetch("http://localhost:5000/api/articulos").then((r) => r.json()),
        fetch("http://localhost:5000/api/facturas").then((r) => r.json()),
      ]);

      setStats({
        clientes: clientes.length,
        vendedores: vendedores.length,
        articulos: articulos.length,
        facturas: facturas.length,
      });

      // Gráfico: total por vendedor
      const ventasPorVendedor = facturas.reduce(
        (
          acc: { vendedor: string; total: number }[],
          f: { Vendedor: string; Total: number }
        ) => {
          const existente = acc.find(
            (x: { vendedor: string; total: number }) =>
              x.vendedor === f.Vendedor
          );
          if (existente) {
            existente.total += f.Total;
          } else {
            acc.push({ vendedor: f.Vendedor, total: f.Total });
          }
          return acc;
        },
        [] as { vendedor: string; total: number }[]
      );

      setVentasData(ventasPorVendedor);
    } catch (e) {
      console.error("Error cargando dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-900">Panel General</h1>
        <Button
          onClick={loadData}
          className="bg-emerald-700 hover:bg-emerald-900 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </Button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-emerald-900">Clientes</CardTitle>
            <Users className="w-6 h-6 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-800">
              {loading ? "..." : stats.clientes}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-emerald-900">Vendedores</CardTitle>
            <FileText className="w-6 h-6 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-800">
              {loading ? "..." : stats.vendedores}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-emerald-900">Artículos</CardTitle>
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-800">
              {loading ? "..." : stats.articulos}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-emerald-900">Facturas</CardTitle>
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-800">
              {loading ? "..." : stats.facturas}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <Card className="border-emerald-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-emerald-900">
            Ventas por Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendedor" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#047857" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
