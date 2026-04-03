'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar, AdminMobileSidebar, AdminMobileHeader } from '@/components/layout'
import { useAuthStore, useSidebarStore } from '@/stores'
import { cn } from '@/lib/utils'

// Mock pending counts for demo
const MOCK_PENDING_COUNTS = {
  owners: 3,
  venues: 2,
  reports: 5,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { collapsed, toggle } = useSidebarStore()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isChecking, setIsChecking] = React.useState(true)

  // Check if user is admin
  React.useEffect(() => {
    // Small delay to allow hydration
    const timer = setTimeout(() => {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/login')
      } else {
        setIsChecking(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  // Handle logout
  const handleLogout = React.useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground mt-4 text-sm">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          user={user}
          collapsed={collapsed}
          onToggle={toggle}
          onLogout={handleLogout}
          pendingCounts={MOCK_PENDING_COUNTS}
        />
      </div>

      {/* Mobile Sidebar */}
      <AdminMobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        pendingCounts={MOCK_PENDING_COUNTS}
      />

      {/* Mobile Header */}
      <AdminMobileHeader
        onMenuClick={() => setMobileMenuOpen(true)}
        user={user}
        pendingCounts={MOCK_PENDING_COUNTS}
      />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          'pt-16 lg:pt-0', // Mobile header height
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
