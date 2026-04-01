'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  LayoutDashboard,
  Calendar,
  MapPin,
  TicketPercent,
  Package,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import type { User } from '@/types'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  onLogout?: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Canchas', href: '/dashboard/canchas', icon: MapPin },
  { name: 'Reservas', href: '/dashboard/reservas', icon: Calendar },
  { name: 'Calendario', href: '/dashboard/calendario', icon: Calendar },
  { name: 'Promociones', href: '/dashboard/promociones', icon: TicketPercent },
  { name: 'Inventario', href: '/dashboard/inventario', icon: Package },
  { name: 'Ingresos', href: '/dashboard/ingresos', icon: TrendingUp },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
]

export function MobileSidebar({ isOpen, onClose, user, onLogout }: MobileSidebarProps) {
  const pathname = usePathname()

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="bg-background/80 fixed inset-0 backdrop-blur-sm" onClick={onClose} />

      {/* Sidebar */}
      <div className="bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 w-full max-w-xs shadow-xl">
        {/* Header */}
        <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">P</span>
            </div>
            <span className="text-sidebar-foreground text-lg font-bold">Pichanga</span>
          </Link>
          <button
            onClick={onClose}
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground flex items-center justify-center rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="border-sidebar-border flex items-center gap-3 border-b p-4">
            <Avatar src={user.avatarUrl} name={user.fullName} size="lg" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-base font-medium">{user.fullName}</p>
              <p className="text-sidebar-foreground/50 truncate text-sm">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Theme Toggle & Logout */}
        <div className="border-sidebar-border space-y-2 border-t p-4">
          <ThemeToggle
            className="bg-sidebar-accent/50 hover:bg-sidebar-accent w-full justify-center"
            showLabel
          />
          {onLogout && (
            <button
              onClick={() => {
                onClose()
                onLogout()
              }}
              className="text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
