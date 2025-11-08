"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Package,
  DollarSign,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard/dashboard", icon: DollarSign },
  { name: "Clientes", href: "/dashboard/clients", icon: Users },
  { name: "Facturación", href: "/dashboard/billing", icon: FileText },
  { name: "Artículos", href: "/dashboard/articles", icon: Package },
  { name: "Vendedores", href: "/dashboard/sellers", icon: DollarSign },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-900 text-white shadow-lg transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center py-6 border-b border-emerald-600/40">
            <img
              src="/Logobw.png"
              alt="Logo de la empresa"
              className="h-14 w-auto transition-transform hover:scale-105"
            />
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-emerald-100 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-emerald-200"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Usuario */}
          <div className="p-4 border-t border-emerald-600/40 bg-emerald-800/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center font-semibold">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Administrador</span>
                <span className="text-xs text-emerald-200">
                  admin@empresa.com
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-white/90 hover:bg-white/10 hover:text-white transition-all"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="lg:pl-64 transition-all">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-end px-4 py-4 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Nueva Factura
            </Button>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
