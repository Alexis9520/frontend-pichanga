'use client'

import * as React from 'react'
import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores'

export function AdminAccessBanner() {
  const { user } = useAuthStore()

  // Only show for admin users
  if (user?.role !== 'admin') {
    return null
  }

  return (
    <Link
      href="/admin"
      className="bg-primary/10 border-primary/20 hover:bg-primary/20 mb-6 flex items-center justify-between rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 rounded-lg p-2">
          <ShieldCheck className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium">Acceso Admin</p>
          <p className="text-muted-foreground text-xs">Ir al Panel de Super-Administrador</p>
        </div>
      </div>
      <ArrowRight className="text-primary h-5 w-5" />
    </Link>
  )
}

// Compact version for sidebar or small spaces
export function AdminAccessCompact() {
  const { user } = useAuthStore()

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <Link
      href="/admin"
      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
    >
      <ShieldCheck className="h-4 w-4" />
      <span>Admin Panel</span>
    </Link>
  )
}
