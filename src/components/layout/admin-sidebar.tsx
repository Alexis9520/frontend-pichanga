'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCog,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { ThemeToggleCompact } from '@/components/theme-toggle'
import type { User } from '@/types'

interface AdminSidebarProps {
  user?: User | null
  collapsed?: boolean
  onToggle?: () => void
  onLogout?: () => void
  pendingCounts?: {
    owners?: number
    venues?: number
    reports?: number
  }
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Vista general de la plataforma',
  },
  {
    name: 'Usuarios',
    href: '/admin/usuarios',
    icon: Users,
    description: 'Gestión de usuarios',
  },
  {
    name: 'Owners',
    href: '/admin/owners',
    icon: UserCog,
    description: 'Aprobación y gestión de dueños',
    badgeKey: 'owners',
  },
  {
    name: 'Canchas',
    href: '/admin/canchas',
    icon: MapPin,
    description: 'Aprobación y gestión de canchas',
    badgeKey: 'venues',
  },
  {
    name: 'Reservas',
    href: '/admin/reservas',
    icon: Calendar,
    description: 'Todas las reservas del sistema',
  },
  {
    name: 'Finanzas',
    href: '/admin/finanzas',
    icon: DollarSign,
    description: 'Ingresos y comisiones',
  },
  {
    name: 'Moderación',
    href: '/admin/moderacion',
    icon: ShieldCheck,
    description: 'Moderación de contenido',
    badgeKey: 'reports',
  },
  {
    name: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
    description: 'Parámetros globales',
  },
  {
    name: 'Auditoría',
    href: '/admin/auditoria',
    icon: FileText,
    description: 'Logs de acciones',
  },
]

export function AdminSidebar({
  user,
  collapsed = false,
  onToggle,
  onLogout,
  pendingCounts = {},
}: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  const getBadgeCount = (badgeKey?: string) => {
    if (!badgeKey) return 0
    return pendingCounts[badgeKey as keyof typeof pendingCounts] || 0
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
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo-pichanga.png"
              alt="Pichanga Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sidebar-foreground text-lg leading-tight font-bold">
                Pichanga
              </span>
              <span className="text-sidebar-foreground/50 text-[10px] font-medium tracking-wider uppercase">
                Admin
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="mx-auto">
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
          const badgeCount = getBadgeCount(item.badgeKey)

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
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    active
                      ? 'text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'
                  )}
                />
                {badgeCount > 0 && collapsed && (
                  <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.name}</span>
                  {badgeCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto h-5 px-1.5 text-[10px] font-bold"
                    >
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-sidebar-border border-t p-3">
        {/* Collapse Toggle & Theme Toggle */}
        <div className={cn('flex gap-1', collapsed ? 'flex-col' : 'flex-row')}>
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
                <p className="text-sidebar-foreground/50 truncate text-xs">Super Admin</p>
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

// Admin Mobile Header Component
interface AdminMobileHeaderProps {
  onMenuClick: () => void
  user?: User | null
  pendingCounts?: {
    owners?: number
    venues?: number
    reports?: number
  }
}

export function AdminMobileHeader({
  onMenuClick,
  user,
  pendingCounts = {},
}: AdminMobileHeaderProps) {
  const totalPending =
    (pendingCounts.owners || 0) + (pendingCounts.venues || 0) + (pendingCounts.reports || 0)

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
        <div className="flex flex-col">
          <span className="text-sm leading-tight font-bold">Pichanga</span>
          <span className="text-muted-foreground text-[9px] font-medium tracking-wider uppercase">
            Admin
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggleCompact />
        {totalPending > 0 && (
          <button className="relative p-2">
            <Bell className="text-muted-foreground h-5 w-5" />
            <span className="bg-destructive text-destructive-foreground absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
              {totalPending > 9 ? '9+' : totalPending}
            </span>
          </button>
        )}
        <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
      </div>
    </header>
  )
}
