'use client'

import * as React from 'react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ConfigSection } from '../types'
import { SECTIONS_CONFIG } from '../types'

interface SidebarNavProps {
  activeSection: ConfigSection
  onSectionChange: (section: ConfigSection) => void
  onLogout?: () => void
}

export function SidebarNav({ activeSection, onSectionChange, onLogout }: SidebarNavProps) {
  const sections = Object.entries(SECTIONS_CONFIG) as [
    ConfigSection,
    typeof SECTIONS_CONFIG.perfil,
  ][]

  return (
    <nav className="space-y-1">
      {sections.map(([key, config]) => {
        const isActive = activeSection === key
        return (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <span className="text-lg">{config.icon}</span>
            <div className="flex-1">
              <span className="block">{config.label}</span>
              <span className="text-xs opacity-70">{config.description}</span>
            </div>
          </button>
        )
      })}

      <hr className="border-border my-2" />

      <button
        onClick={onLogout}
        className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all"
      >
        <LogOut className="h-4 w-4" />
        <span>Cerrar sesión</span>
      </button>
    </nav>
  )
}
