'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          'text-muted-foreground hover:bg-muted hover:text-foreground',
          className
        )}
      >
        <Sun className="h-4 w-4" />
        {showLabel && <span>Tema</span>}
      </button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
        'text-muted-foreground hover:bg-muted hover:text-foreground',
        className
      )}
      title={`Tema actual: ${theme === 'dark' ? 'Oscuro' : theme === 'light' ? 'Claro' : 'Sistema'}`}
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
      {showLabel && (
        <span>{theme === 'dark' ? 'Oscuro' : theme === 'light' ? 'Claro' : 'Sistema'}</span>
      )}
    </button>
  )
}

// Compact version for sidebar
export function ThemeToggleCompact({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={cn(
          'flex items-center justify-center rounded-xl p-2.5 text-sm font-medium transition-colors',
          'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          className
        )}
      >
        <Moon className="h-5 w-5" />
      </button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center justify-center rounded-xl p-2.5 text-sm font-medium transition-colors',
        'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        className
      )}
      title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
