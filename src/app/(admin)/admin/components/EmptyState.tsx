'use client'

import * as React from 'react'
import {
  Inbox,
  Search,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Settings,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-muted/50 mb-4 rounded-full p-4">
        <Icon className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="text-center text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-4 py-2 text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Pre-built empty states for common scenarios
export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="Sin resultados"
      description={`No encontramos resultados para "${query}". Intenta con otros términos.`}
    />
  )
}

export function NoUsers() {
  return (
    <EmptyState
      icon={Users}
      title="No hay usuarios"
      description="Aún no hay usuarios registrados en la plataforma."
    />
  )
}

export function NoReservations() {
  return (
    <EmptyState
      icon={Calendar}
      title="No hay reservas"
      description="No hay reservas que coincidan con los filtros seleccionados."
    />
  )
}

export function NoRevenue() {
  return (
    <EmptyState
      icon={DollarSign}
      title="Sin ingresos"
      description="No hay datos de ingresos para el período seleccionado."
    />
  )
}

export function NoReports() {
  return (
    <EmptyState
      icon={Shield}
      title="Sin reportes"
      description="No hay reportes pendientes de revisión."
    />
  )
}

export function NoLogs() {
  return (
    <EmptyState
      icon={FileText}
      title="Sin logs"
      description="No hay registros de actividad para mostrar."
    />
  )
}

export function NoConfig() {
  return (
    <EmptyState
      icon={Settings}
      title="Sin configuración"
      description="No hay elementos configurados en esta sección."
    />
  )
}

export function NoData() {
  return <EmptyState icon={FolderOpen} title="Sin datos" description="No hay datos disponibles." />
}

export function ErrorState({
  title = 'Error al cargar',
  description = 'Ocurrió un error al cargar los datos. Por favor intenta de nuevo.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={description}
      action={onRetry ? { label: 'Reintentar', onClick: onRetry } : undefined}
    />
  )
}
