"use client"

import { Building2, Users, Package, UserCircle, FileText, Receipt, BarChart3, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clientes", href: "/dashboard/clients" },
  { icon: Package, label: "Artículos", href: "/dashboard/articles" },
  { icon: UserCircle, label: "Vendedores", href: "/dashboard/vendors" },
  { icon: FileText, label: "Facturas", href: "/dashboard/invoices" },
  { icon: Receipt, label: "Facturación", href: "/dashboard/billing" },
  { icon: FileText, label: "Asientos Contables", href: "/dashboard/accounting" },
  { icon: BarChart3, label: "Consultas", href: "/dashboard/reports" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar text-sidebar-foreground rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileOpen(false)} />
      )}

      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
          <div className="flex items-center justify-center w-10 h-10 bg-sidebar-primary rounded-lg shadow-md">
            <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight text-sidebar-foreground">Sistema de</h2>
            <p className="text-sm text-sidebar-foreground/70 leading-tight">Facturación</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg font-semibold scale-105"
                        : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-102",
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/90 hover:bg-destructive/20 hover:text-destructive-foreground transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  )
}
