'use client'

import * as React from 'react'
import {
  X,
  AlertTriangle,
  User,
  Clock,
  CheckCircle,
  Edit3,
  Trash2,
  MessageSquare,
  Image,
  ExternalLink,
} from 'lucide-react'
import type { ContentReport } from '../../types'

interface ReportResolutionModalProps {
  report: ContentReport
  onClose: () => void
  onResolve: (
    reportId: string,
    resolution: 'keep' | 'edit' | 'delete' | 'warn_user',
    notes: string,
    editedContent?: string
  ) => void
  onDismiss: (reportId: string, reason: string) => void
}

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  offensive_content: 'Contenido Ofensivo',
  inappropriate: 'Inapropiado',
  spam: 'Spam',
  fake_review: 'Reseña Falsa',
  harassment: 'Acoso',
  violence: 'Violencia',
  discrimination: 'Discriminación',
  other: 'Otro',
}

// Type icons
const TYPE_ICONS = {
  review: MessageSquare,
  photo: Image,
  user_profile: User,
  venue_content: ExternalLink,
}

export function ReportResolutionModal({
  report,
  onClose,
  onResolve,
  onDismiss,
}: ReportResolutionModalProps) {
  const [selectedAction, setSelectedAction] = React.useState<
    'keep' | 'edit' | 'delete' | 'warn_user' | 'dismiss' | null
  >(null)
  const [notes, setNotes] = React.useState('')
  const [editedContent, setEditedContent] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const TypeIcon = TYPE_ICONS[report.type]

  const handleAction = () => {
    if (!selectedAction) return
    setLoading(true)

    setTimeout(() => {
      if (selectedAction === 'dismiss') {
        onDismiss(report.id, notes || 'Reporte descartado')
      } else {
        onResolve(report.id, selectedAction, notes, editedContent || undefined)
      }
      setLoading(false)
      onClose()
    }, 500)
  }

  const actions = [
    {
      id: 'keep' as const,
      label: 'Mantener',
      description: 'El contenido está bien, no requiere cambios',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
    },
    {
      id: 'edit' as const,
      label: 'Editar',
      description: 'Modificar el contenido ofensivo',
      icon: Edit3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'delete' as const,
      label: 'Eliminar',
      description: 'Quitar el contenido de la plataforma',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
    },
    {
      id: 'warn_user' as const,
      label: 'Advertir',
      description: 'Enviar advertencia al usuario',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <TypeIcon className="text-primary h-5 w-5" />
            <h2 className="text-lg font-bold">Resolver Reporte</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Report info */}
          <div className="bg-muted/30 rounded-lg border p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {report.type === 'review'
                  ? 'Reseña'
                  : report.type === 'photo'
                    ? 'Foto'
                    : report.type === 'user_profile'
                      ? 'Perfil'
                      : 'Contenido'}
              </span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                {CATEGORY_LABELS[report.category]}
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Prioridad:{' '}
                {report.priority === 'urgent'
                  ? 'Urgente'
                  : report.priority === 'high'
                    ? 'Alta'
                    : report.priority === 'medium'
                      ? 'Media'
                      : 'Baja'}
              </span>
            </div>

            {/* Original content */}
            <div className="mb-3">
              <p className="text-muted-foreground text-xs font-medium">Contenido reportado:</p>
              <p className="bg-background mt-1 rounded-lg border p-3 text-sm italic">
                &ldquo;{report.contentPreview}&rdquo;
              </p>
            </div>

            {/* Reporter info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Creador del contenido:</p>
                <p className="font-medium">{report.contentOwnerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Reportado por:</p>
                <p className="font-medium">{report.reporterName}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-3">
              <p className="text-muted-foreground text-xs font-medium">Razón del reporte:</p>
              <p className="mt-1 text-sm">{report.reason}</p>
              {report.description && (
                <p className="text-muted-foreground mt-1 text-xs">{report.description}</p>
              )}
            </div>

            {/* Report count */}
            {report.reportCount > 1 && (
              <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700">
                ⚠️ Este contenido ha sido reportado {report.reportCount} veces
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            <p className="mb-3 text-sm font-medium">Seleccionar acción:</p>
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setSelectedAction(action.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    selectedAction === action.id
                      ? `${action.bgColor} border-current`
                      : 'hover:bg-muted'
                  }`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-muted-foreground text-xs">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Dismiss option */}
            <button
              onClick={() => setSelectedAction('dismiss')}
              className={`mt-3 w-full rounded-lg border p-3 text-left transition-colors ${
                selectedAction === 'dismiss' ? 'border-gray-400 bg-gray-100' : 'hover:bg-muted'
              }`}
            >
              <p className="text-sm font-medium">Descartar reporte</p>
              <p className="text-muted-foreground text-xs">
                El reporte no es válido, descartar sin acción
              </p>
            </button>
          </div>

          {/* Edit content field */}
          {selectedAction === 'edit' && (
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Contenido editado:
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={4}
                placeholder="Escribe la versión editada del contenido..."
                className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                El contenido original será reemplazado por esta versión.
              </p>
            </div>
          )}

          {/* Notes */}
          {selectedAction && selectedAction !== 'dismiss' && (
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Notas de resolución (opcional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Documenta la razón de tu decisión..."
                className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          )}

          {/* Dismiss reason */}
          {selectedAction === 'dismiss' && (
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">
                Razón para descartar:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="¿Por qué se descarta este reporte?"
                className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t p-4">
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAction}
            disabled={!selectedAction || loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
