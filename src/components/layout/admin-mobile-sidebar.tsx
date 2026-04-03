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
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggleCompact } from '@/components/theme-toggle'
import type { User } from '@/types'

interface AdminMobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
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
  },
  {
    name: 'Usuarios',
    href: '/admin/usuarios',
    icon: Users,
  },
  {
    name: 'Owners',
    href: '/admin/owners',
    icon: UserCog,
    badgeKey: 'owners',
  },
  {
    name: 'Canchas',
    href: '/admin/canchas',
    icon: MapPin,
    badgeKey: 'venues',
  },
  {
    name: 'Reservas',
    href: '/admin/reservas',
    icon: Calendar,
  },
  {
    name: 'Finanzas',
    href: '/admin/finanzas',
    icon: DollarSign,
  },
  {
    name: 'Moderación',
    href: '/admin/moderacion',
    icon: ShieldCheck,
    badgeKey: 'reports',
  },
  {
    name: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
  },
  {
    name: 'Auditoría',
    href: '/admin/auditoria',
    icon: FileText,
  },
]

export function AdminMobileSidebar({
  isOpen,
  onClose,
  user,
  onLogout,
  pendingCounts = {},
}: AdminMobileSidebarProps) {
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

  // Close on route change
  React.useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'bg-sidebar fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
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
          <button
            onClick={onClose}
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-thin h-[calc(100vh-16rem)] space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const badgeCount = getBadgeCount(item.badgeKey)

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    active
                      ? 'text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'
                  )}
                />
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
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-sidebar-border absolute right-0 bottom-0 left-0 border-t p-3">
          {/* User Section */}
          {user && (
            <div className="bg-sidebar-accent/50 mb-2 flex items-center gap-3 rounded-xl p-3">
              <Avatar src={user.avatarUrl} name={user.fullName} size="sm" className="shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user.fullName}</p>
                <p className="text-sidebar-foreground/50 truncate text-xs">Super Admin</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggleCompact />
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
