'use client'

import * as React from 'react'
import {
  X,
  AlertTriangle,
  DollarSign,
  Ban,
  CheckCircle,
  MessageSquare,
  FileText,
} from 'lucide-react'
import type { AdminReservation, ReservationDetails } from '../types'
import { useAdminReservations } from '../hooks/useAdmin'

interface ReservationActionsModalProps {
  reservation: AdminReservation
  details?: ReservationDetails | null
  onClose: () => void
}

export function ReservationActionsModal({
  reservation,
  details,
  onClose,
}: ReservationActionsModalProps) {
  const { updateReservationStatus, processRefund, addAdminNote } = useAdminReservations()

  const [activeAction, setActiveAction] = React.useState<
    'cancel' | 'refund' | 'complete' | 'note' | null
  >(null)
  const [loading, setLoading] = React.useState(false)
  const [reason, setReason] = React.useState('')
  const [refundAmount, setRefundAmount] = React.useState('')
  const [note, setNote] = React.useState('')
  const [showConfirmation, setShowConfirmation] = React.useState(false)

  // Calculate refund amount based on standard policy (80% default)
  const suggestedRefund = React.useMemo(() => {
    if (!details) return reservation.totalPrice * 0.8 // Default 80%
    // Standard refund percentage (could be fetched from venue policies in real implementation)
    return details.totalPrice * 0.8
  }, [details, reservation])

  const handleCancel = () => {
    if (!reason.trim()) return
    setLoading(true)

    setTimeout(() => {
      updateReservationStatus(reservation.id, 'cancelled', reason)
      setLoading(false)
      setShowConfirmation(true)
    }, 500)
  }

  const handleRefund = () => {
    const amount = parseFloat(refundAmount) || suggestedRefund
    if (amount <= 0) return
    setLoading(true)

    setTimeout(() => {
      processRefund(reservation.id, amount, reason || 'Reembolso procesado por admin', 'admin-3')
      setLoading(false)
      setShowConfirmation(true)
    }, 500)
  }

  const handleComplete = () => {
    setLoading(true)

    setTimeout(() => {
      updateReservationStatus(reservation.id, 'completed')
      setLoading(false)
      setShowConfirmation(true)
    }, 500)
  }

  const handleAddNote = () => {
    if (!note.trim()) return
    setLoading(true)

    setTimeout(() => {
      addAdminNote(reservation.id, note)
      setLoading(false)
      setActiveAction(null)
      setNote('')
    }, 300)
  }

  // Reset when changing action
  React.useEffect(() => {
    setReason('')
    setRefundAmount('')
    setNote('')
    setShowConfirmation(false)
  }, [activeAction])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Acciones Admin - #{reservation.id}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Confirmation message */}
          {showConfirmation && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="font-medium text-green-700">Acción completada exitosamente</p>
            </div>
          )}

          {/* Action buttons */}
          {!activeAction && !showConfirmation && (
            <div className="grid grid-cols-2 gap-3">
              {/* Cancel */}
              <button
                onClick={() => setActiveAction('cancel')}
                disabled={reservation.status === 'cancelled' || reservation.status === 'completed'}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Ban className="h-6 w-6 text-red-500" />
                <span className="text-sm font-medium">Cancelar</span>
                <span className="text-muted-foreground text-xs">Cancelar la reserva</span>
              </button>

              {/* Refund */}
              <button
                onClick={() => setActiveAction('refund')}
                disabled={
                  reservation.paymentStatus === 'refunded' ||
                  reservation.paymentStatus === 'pending'
                }
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DollarSign className="h-6 w-6 text-orange-500" />
                <span className="text-sm font-medium">Reembolso</span>
                <span className="text-muted-foreground text-xs">Forzar reembolso</span>
              </button>

              {/* Complete */}
              <button
                onClick={() => setActiveAction('complete')}
                disabled={reservation.status === 'completed' || reservation.status === 'cancelled'}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-green-200 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-sm font-medium">Completar</span>
                <span className="text-muted-foreground text-xs">Marcar como completada</span>
              </button>

              {/* Add Note */}
              <button
                onClick={() => setActiveAction('note')}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                <MessageSquare className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">Nota Admin</span>
                <span className="text-muted-foreground text-xs">Agregar nota interna</span>
              </button>
            </div>
          )}

          {/* Cancel form */}
          {activeAction === 'cancel' && !showConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Cancelar Reserva</span>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-700">
                  Esta acción cancelará la reserva #{reservation.id}. Si el pago está completo, se
                  deberá procesar un reembolso separadamente.
                </p>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Razón de cancelación *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Describe la razón de la cancelación..."
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveAction(null)}
                  className="hover:bg-muted flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!reason.trim() || loading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Confirmar Cancelación'}
                </button>
              </div>
            </div>
          )}

          {/* Refund form */}
          {activeAction === 'refund' && !showConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Procesar Reembolso</span>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                <p className="text-sm text-orange-700">
                  Total pagado: <span className="font-bold">S/{reservation.totalPrice}</span>
                  <br />
                  Reembolso sugerido:{' '}
                  <span className="font-bold">S/{suggestedRefund.toFixed(0)}</span>
                </p>
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Monto a reembolsar
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={suggestedRefund.toFixed(0)}
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Razón del reembolso
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="Describe la razón del reembolso..."
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveAction(null)}
                  className="hover:bg-muted flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRefund}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Procesar Reembolso'}
                </button>
              </div>
            </div>
          )}

          {/* Complete form */}
          {activeAction === 'complete' && !showConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Marcar como Completada</span>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm text-green-700">
                  Esta acción marcará la reserva #{reservation.id} como completada. Esto indica que
                  el servicio fue prestado exitosamente.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveAction(null)}
                  className="hover:bg-muted flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {/* Add note form */}
          {activeAction === 'note' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Agregar Nota Admin</span>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  Esta nota será visible solo para administradores. Úsala para documentar
                  decisiones, contexto o seguimiento.
                </p>
              </div>

              {details?.adminNotes && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <p className="text-xs font-medium text-orange-600">Nota existente:</p>
                  <p className="text-sm text-orange-700">{details.adminNotes}</p>
                </div>
              )}

              <div>
                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                  Nueva nota *
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Escribe la nota..."
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveAction(null)}
                  className="hover:bg-muted flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!note.trim() || loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Nota'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {showConfirmation && (
          <div className="border-t p-4">
            <button
              onClick={onClose}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
