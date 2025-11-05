"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, Receipt, Package,
  UserCheck,
  Factory, BookOpen, BarChart3, Settings
} from "lucide-react"

const items = [
  { href: "/app/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/app/dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/app/dashboard/articles", label: "Artículos", icon: Package },
  { href: "/app/dashboard/sellers", label: "Sellers", icon: UserCheck },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-full w-full p-3 lg:p-4">
      <div className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
