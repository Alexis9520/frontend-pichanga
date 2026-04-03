'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Clock,
  Monitor,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  File,
} from 'lucide-react'
import { useAuditLogs } from '../hooks/useAdmin'
import type { AuditLogDetails, AuditAction, AuditTargetType } from '../types'

// Action badge colors
const ACTION_COLORS: Record<AuditAction, { bg: string; text: string }> = {
  approve: { bg: 'bg-green-100', text: 'text-green-700' },
  reject: { bg: 'bg-red-100', text: 'text-red-700' },
  suspend: { bg: 'bg-orange-100', text: 'text-orange-700' },
  activate: { bg: 'bg-blue-100', text: 'text-blue-700' },
  edit: { bg: 'bg-purple-100', text: 'text-purple-700' },
  delete: { bg: 'bg-red-100', text: 'text-red-700' },
  config_change: { bg: 'bg-gray-100', text: 'text-gray-700' },
  refund: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancel: { bg: 'bg-red-100', text: 'text-red-700' },
  resolve_dispute: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  login: { bg: 'bg-green-100', text: 'text-green-700' },
  logout: { bg: 'bg-gray-100', text: 'text-gray-700' },
}

// Action labels
const ACTION_LABELS: Record<AuditAction, string> = {
  approve: 'Aprobar',
  reject: 'Rechazar',
  suspend: 'Suspender',
  activate: 'Activar',
  edit: 'Editar',
  delete: 'Eliminar',
  config_change: 'Config',
  refund: 'Reembolso',
  cancel: 'Cancelar',
  resolve_dispute: 'Resolver',
  login: 'Login',
  logout: 'Logout',
}

// Target type labels
const TARGET_LABELS: Record<AuditTargetType, string> = {
  user: 'Usuario',
  owner: 'Owner',
  venue: 'Cancha',
  reservation: 'Reserva',
  review: 'Reseña',
  photo: 'Foto',
  config: 'Config',
  dispute: 'Disputa',
}

// Action badge
function ActionBadge({ action }: { action: AuditAction }) {
  const colors = ACTION_COLORS[action]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {ACTION_LABELS[action]}
    </span>
  )
}

// Format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return {
    date: date.toLocaleDateString('es-PE', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  }
}

// Stat card
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-2">
            <Icon className="text-primary h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Log detail modal
function LogDetailModal({ log, onClose }: { log: AuditLogDetails; onClose: () => void }) {
  const { date, time } = formatDate(log.createdAt)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <h2 className="text-lg font-bold">Detalle del Log</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded p-1 text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Action & Target */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs font-medium">Acción</p>
              <div className="mt-1">
                <ActionBadge action={log.action} />
              </div>
              <p className="mt-2 text-sm">{log.actionLabel}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs font-medium">Tipo de Target</p>
              <p className="mt-1 text-sm font-medium">{TARGET_LABELS[log.targetType]}</p>
            </div>
          </div>

          {/* Target Info */}
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs font-medium">Target</p>
            <p className="mt-1 font-medium">{log.targetName}</p>
            <p className="text-muted-foreground text-xs">ID: {log.targetId}</p>
          </div>

          {/* Description */}
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs font-medium">Descripción</p>
            <p className="mt-1 text-sm">{log.description}</p>
          </div>

          {/* Reason (if exists) */}
          {log.reason && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-xs font-medium text-orange-700">Razón</p>
              <p className="mt-1 text-sm text-orange-800">{log.reason}</p>
            </div>
          )}

          {/* Changes */}
          {(log.previousValue || log.newValue) && (
            <div className="grid grid-cols-2 gap-4">
              {log.previousValue && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-medium text-red-700">Valor anterior</p>
                  <p className="mt-1 text-sm">{log.previousValue}</p>
                </div>
              )}
              {log.newValue && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-xs font-medium text-green-700">Valor nuevo</p>
                  <p className="mt-1 text-sm">{log.newValue}</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Info */}
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs font-medium">Administrador</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{log.adminName}</span>
                <span className="text-muted-foreground text-xs">({log.adminRole})</span>
              </div>
              <p className="text-muted-foreground text-xs">{log.adminEmail}</p>
            </div>
          </div>

          {/* Device & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs font-medium">Dispositivo</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Monitor className="h-4 w-4" />
                  {log.device}
                </div>
                <p className="text-muted-foreground text-xs">{log.browser}</p>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs font-medium">Ubicación</p>
              <div className="mt-2 space-y-1">
                {log.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {log.location}
                  </div>
                )}
                <p className="text-muted-foreground font-mono text-xs">{log.ipAddress}</p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs font-medium">Fecha y Hora</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {date}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {time}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t p-4">
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminAuditoriaPage() {
  const { logs, stats, loading, filters, setFilters, exportLogs } = useAuditLogs()
  const [selectedLog, setSelectedLog] = React.useState<AuditLogDetails | null>(null)
  const [showExportMenu, setShowExportMenu] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const pageSize = 15

  // Pagination
  const totalPages = Math.ceil(logs.length / pageSize)
  const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditoría</h1>
          <p className="text-muted-foreground text-sm">Logs de acciones administrativas</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="border-input bg-background hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          {showExportMenu && (
            <div className="bg-card absolute top-full right-0 z-10 mt-2 w-48 rounded-lg border shadow-lg">
              <button
                onClick={() => {
                  exportLogs('xlsx')
                  setShowExportMenu(false)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel (.xlsx)
              </button>
              <button
                onClick={() => {
                  exportLogs('csv')
                  setShowExportMenu(false)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm"
              >
                <File className="h-4 w-4" />
                CSV
              </button>
              <button
                onClick={() => {
                  exportLogs('pdf')
                  setShowExportMenu(false)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm"
              >
                <FileText className="h-4 w-4" />
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Logs" value={stats.total} icon={FileText} />
        <StatCard title="Hoy" value={stats.today} icon={Clock} />
        <StatCard title="Esta Semana" value={stats.thisWeek} icon={Calendar} />
        <StatCard title="Este Mes" value={stats.thisMonth} icon={FileText} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por admin, target..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="border-input bg-background focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <select
            value={filters.action || 'all'}
            onChange={(e) =>
              setFilters({ ...filters, action: e.target.value as AuditAction | 'all' })
            }
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">Todas las acciones</option>
            <option value="approve">Aprobaciones</option>
            <option value="reject">Rechazos</option>
            <option value="suspend">Suspensiones</option>
            <option value="activate">Activaciones</option>
            <option value="edit">Ediciones</option>
            <option value="delete">Eliminaciones</option>
            <option value="refund">Reembolsos</option>
            <option value="config_change">Cambios de config</option>
          </select>
          <select
            value={filters.targetType || 'all'}
            onChange={(e) =>
              setFilters({ ...filters, targetType: e.target.value as AuditTargetType | 'all' })
            }
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">Todos los tipos</option>
            <option value="user">Usuarios</option>
            <option value="owner">Owners</option>
            <option value="venue">Canchas</option>
            <option value="reservation">Reservas</option>
            <option value="review">Reseñas</option>
            <option value="config">Configuración</option>
            <option value="dispute">Disputas</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {paginatedLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                No hay logs que coincidan con los filtros
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Fecha
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Admin
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Acción
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Tipo
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Target
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      IP
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedLogs.map((log) => {
                    const { date, time } = formatDate(log.createdAt)
                    return (
                      <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium">{date}</p>
                            <p className="text-muted-foreground text-xs">{time}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{log.adminName}</p>
                          <p className="text-muted-foreground text-xs">{log.adminRole}</p>
                        </td>
                        <td className="px-4 py-3">
                          <ActionBadge action={log.action} />
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">
                          {TARGET_LABELS[log.targetType]}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{log.targetName}</p>
                          <p className="text-muted-foreground text-xs">{log.targetId}</p>
                        </td>
                        <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                          {log.ipAddress}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-muted-foreground hover:text-primary rounded p-1 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, logs.length)} de{' '}
            {logs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-muted-foreground hover:bg-muted rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-muted-foreground px-2">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      page === totalPages
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-muted-foreground hover:bg-muted rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  )
}
