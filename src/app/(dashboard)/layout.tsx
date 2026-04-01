'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, MobileSidebar, MobileHeader } from '@/components/layout'
import { useAuthStore, useSidebarStore } from '@/stores'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { collapsed, toggle } = useSidebarStore()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Handle logout
  const handleLogout = React.useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  // Redirect if not authenticated (for demo, we'll skip this)
  // React.useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          collapsed={collapsed}
          onToggle={toggle}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={() => setMobileMenuOpen(true)}
        user={user}
      />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          'pt-16 lg:pt-0', // Mobile header height
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}