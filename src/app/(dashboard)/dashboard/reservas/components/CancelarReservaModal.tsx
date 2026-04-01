'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, Button, Textarea, Label } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface CancelarReservaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva: {
    id: string
    clienteNombre: string
    fecha: string
    totalPrice: number
    adelantoPagado: number
  } | null
  onConfirm: (motivo: string, conReembolso: boolean) => Promise<void>
}

export function CancelarReservaModal({
  open,
  onOpenChange,
  reserva,
  onConfirm,
}: CancelarReservaModalProps) {
  const [motivo, setMotivo] = React.useState('')
  const [conReembolso, setConReembolso] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      setMotivo('')
      setConReembolso(false)
    }
  }, [open])

  // Sugerir reembolso si ya pagaron
  React.useEffect(() => {
    if (reserva && reserva.adelantoPagado > 0) {
      setConReembolso(true)
    }
  }, [reserva])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!motivo.trim()) return

    setIsSubmitting(true)
    try {
      await onConfirm(motivo, conReembolso)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!reserva) return null

  const tienePago = reserva.adelantoPagado > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Cancelar Reserva">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Advertencia */}
          <div className="bg-destructive/10 border-destructive/20 rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
              <div>
                <p className="text-destructive font-medium">¿Estás seguro?</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {/* Info de la reserva */}
          <div className="bg-muted/50 space-y-2 rounded-xl p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{reserva.clienteNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span>{reserva.fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{formatCurrency(reserva.totalPrice)}</span>
            </div>
            {tienePago && (
              <div className="flex justify-between text-amber-600">
                <span>Adelanto pagado:</span>
                <span className="font-medium">{formatCurrency(reserva.adelantoPagado)}</span>
              </div>
            )}
          </div>

          {/* Opción de reembolso */}
          {tienePago && (
            <div className="space-y-2">
              <Label>¿Deseas reembolsar el pago?</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConReembolso(true)}
                  className={`flex-1 rounded-xl border p-3 text-sm font-medium transition-all ${
                    conReembolso
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  Sí, con reembolso
                </button>
                <button
                  type="button"
                  onClick={() => setConReembolso(false)}
                  className={`flex-1 rounded-xl border p-3 text-sm font-medium transition-all ${
                    !conReembolso
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  No, sin reembolso
                </button>
              </div>
              {conReembolso && (
                <p className="text-muted-foreground text-xs">
                  Se procesará el reembolso de {formatCurrency(reserva.adelantoPagado)}
                </p>
              )}
            </div>
          )}

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo" required>
              Motivo de cancelación
            </Label>
            <Textarea
              id="motivo"
              placeholder="Indica el motivo de la cancelación..."
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Mantener reserva
            </Button>
            <Button
              type="submit"
              variant="destructive"
              isLoading={isSubmitting}
              disabled={!motivo.trim()}
            >
              Cancelar reserva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
