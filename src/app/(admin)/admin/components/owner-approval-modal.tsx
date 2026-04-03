'use client'

import * as React from 'react'
import { Check, X, AlertCircle, Building2, Phone, MapPin, Calendar, FileText } from 'lucide-react'
import { Dialog } from './dialog'
import type { OwnerApplication } from '../types'

interface OwnerApprovalModalProps {
  open: boolean
  onClose: () => void
  application: OwnerApplication | null
  onApprove: (applicationId: string) => void
  onReject: (applicationId: string, reason: string) => void
}

export function OwnerApprovalModal({
  open,
  onClose,
  application,
  onApprove,
  onReject,
}: OwnerApprovalModalProps) {
  const [showRejectForm, setShowRejectForm] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setShowRejectForm(false)
      setRejectReason('')
    }
  }, [open])

  const handleApprove = async () => {
    if (!application) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onApprove(application.id)
    setIsLoading(false)
    onClose()
  }

  const handleReject = async () => {
    if (!application || !rejectReason.trim()) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onReject(application.id, rejectReason)
    setIsLoading(false)
    onClose()
  }

  if (!application) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Solicitud de Owner"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          {!showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isLoading}
                className="border-destructive/50 text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Rechazar
              </button>
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isLoading ? 'Aprobando...' : 'Aprobar'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                disabled={isLoading}
                className="border-input bg-background hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading || !rejectReason.trim()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                {isLoading ? 'Rechazando...' : 'Confirmar Rechazo'}
              </button>
            </>
          )}
        </div>
      }
    >
      {showRejectForm ? (
        <div className="space-y-4">
          <div className="bg-destructive/10 flex items-start gap-3 rounded-lg p-4">
            <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Rechazar solicitud</p>
              <p className="text-muted-foreground text-sm">
                Documenta la razón del rechazo. El usuario podrá volver a aplicar.
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Razón del rechazo <span className="text-destructive">*</span>
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="">Selecciona una razón...</option>
              <option value="RUC inválido">RUC inválido o no encontrado en SUNAT</option>
              <option value="Información incompleta">Información incompleta o incorrecta</option>
              <option value="Documentación pendiente">Documentación pendiente</option>
              <option value="No cumple requisitos">No cumple con los requisitos</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {rejectReason && (
            <div>
              <label className="text-sm font-medium">Detalle adicional (opcional)</label>
              <textarea
                placeholder="Agrega más detalles sobre el rechazo..."
                rows={3}
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Info */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-medium">
              <div className="bg-primary/10 rounded-lg p-1.5">
                <FileText className="text-primary h-4 w-4" />
              </div>
              Solicitante
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Nombre
                  </p>
                  <p className="mt-0.5 font-medium">{application.user.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Email
                  </p>
                  <p className="mt-0.5">{application.user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Teléfono
                  </p>
                  <p className="mt-0.5">{application.user.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Fecha Solicitud
                  </p>
                  <p className="mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(application.submittedAt).toLocaleDateString('es-PE')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-medium">
              <div className="bg-primary/10 rounded-lg p-1.5">
                <Building2 className="text-primary h-4 w-4" />
              </div>
              Negocio
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Nombre Comercial
                  </p>
                  <p className="mt-0.5 font-medium">{application.businessName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    RUC
                  </p>
                  <p className="mt-0.5 font-mono">{application.ruc}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Teléfono Negocio
                  </p>
                  <p className="mt-0.5 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {application.businessPhone}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Ciudad
                  </p>
                  <p className="mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {application.city}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Dirección
                  </p>
                  <p className="mt-0.5">{application.businessAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Info */}
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Al aprobar:</strong> El usuario obtendrá el rol de Owner y podrá crear y
              gestionar canchas en la plataforma.
            </p>
          </div>
        </div>
      )}
    </Dialog>
  )
}
