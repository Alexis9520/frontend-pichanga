'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  TicketPercent,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'
import { ThemeToggleCompact } from '@/components/theme-toggle'
import type { User } from '@/types'

interface SidebarProps {
  user?: User | null
  collapsed?: boolean
  onToggle?: () => void
  onLogout?: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Vista general de tu negocio',
  },
  {
    name: 'Canchas',
    href: '/dashboard/canchas',
    icon: MapPin,
    description: 'Gestiona tus canchas',
  },
  {
    name: 'Reservas',
    href: '/dashboard/reservas',
    icon: Calendar,
    description: 'Historial y nuevas reservas',
  },
  {
    name: 'Calendario',
    href: '/dashboard/calendario',
    icon: Calendar,
    description: 'Vista de calendario',
  },
  {
    name: 'Promociones',
    href: '/dashboard/promociones',
    icon: TicketPercent,
    description: 'Ofertas y descuentos',
  },
  {
    name: 'Inventario',
    href: '/dashboard/inventario',
    icon: Package,
    description: 'Productos y ventas extras',
  },
  {
    name: 'Ingresos',
    href: '/dashboard/ingresos',
    icon: TrendingUp,
    description: 'Reportes y estadísticas',
  },
]

const bottomNavigation = [
  {
    name: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
  },
]

export function Sidebar({ user, collapsed = false, onToggle, onLogout }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo-pichanga.png"
              alt="Pichanga Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="text-sidebar-foreground text-lg font-bold">Pichanga</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Image
              src="/logo-pichanga.png"
              alt="Pichanga Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
            />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  active
                    ? 'text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-sidebar-border border-t p-3">
        {bottomNavigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}

        {/* Collapse Toggle & Theme Toggle */}
        <div className={cn('mt-2 flex gap-1', collapsed ? 'flex-col' : 'flex-row')}>
          <button
            onClick={onToggle}
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-1 items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Colapsar</span>
              </>
            )}
          </button>
          <ThemeToggleCompact />
        </div>

        {/* User Section */}
        {user && (
          <div
            className={cn(
              'bg-sidebar-accent/50 mt-4 flex items-center gap-3 rounded-xl p-3',
              collapsed && 'justify-center p-2'
            )}
          >
            <Avatar src={user.avatarUrl} name={user.fullName} size="sm" className="shrink-0" />
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user.fullName}</p>
                <p className="text-sidebar-foreground/50 truncate text-xs">{user.email}</p>
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className={cn(
              'text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        )}
      </div>
    </aside>
  )
}

// Mobile Header Component
interface MobileHeaderProps {
  onMenuClick: () => void
  user?: User | null
}

export function MobileHeader({ onMenuClick, user }: MobileHeaderProps) {
  return (
    <header className="border-border bg-background fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b px-4 lg:hidden">
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center rounded-lg p-2 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <Image
          src="/logo-pichanga.png"
          alt="Pichanga Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-lg object-contain"
        />
        <span className="text-lg font-bold">Pichanga</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggleCompact />
        <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
      </div>
    </header>
  )
}
