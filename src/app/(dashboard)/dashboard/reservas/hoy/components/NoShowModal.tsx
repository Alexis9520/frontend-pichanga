'use client'

import * as React from 'react'
import { Dialog, DialogContent, Button, Badge, Textarea } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import { XCircle, AlertTriangle, CreditCard, DollarSign } from 'lucide-react'
import type { ReservaConLlegada } from '../../types'

interface NoShowModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva: ReservaConLlegada | null
  onConfirm: (reservaId: string, razon: string, reembolsarAdelanto: boolean) => Promise<void>
}

export function NoShowModal({ open, onOpenChange, reserva, onConfirm }: NoShowModalProps) {
  const [razon, setRazon] = React.useState('')
  const [reembolsarAdelanto, setReembolsarAdelanto] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      setRazon('')
      setReembolsarAdelanto(false)
    }
  }, [open])

  if (!reserva) return null

  // Determinar si hay adelanto
  const tieneAdelanto = reserva.adelantoPagado > 0

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm(reserva.id, razon, reembolsarAdelanto)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="default" className="max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-border flex items-center gap-3 border-b pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Cliente No Se Presentó</h2>
            <p className="text-muted-foreground text-sm">Registrar como &ldquo;No Show&rdquo;</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          {/* Info del cliente */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p className="font-medium">{reserva.clienteNombre}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <p className="font-medium">{reserva.clienteTelefono}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hora reservada:</span>
                <p className="font-medium">
                  {reserva.startTime} - {reserva.endTime}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Cancha:</span>
                <p className="font-medium">{reserva.venueNombre}</p>
              </div>
            </div>
          </div>

          {/* Estado de pago */}
          <div
            className={cn(
              'rounded-xl p-4',
              tieneAdelanto ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-muted/50'
            )}
          >
            <div className="flex items-center gap-3">
              <CreditCard
                className={cn(
                  'h-5 w-5',
                  tieneAdelanto ? 'text-yellow-600' : 'text-muted-foreground'
                )}
              />
              <div>
                <p className="font-medium">Estado de pago</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Badge
                    variant={reserva.estadoPago === 'completed' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {reserva.estadoPago === 'completed'
                      ? 'Pagado'
                      : reserva.estadoPago === 'partial'
                        ? 'Adelanto'
                        : 'Pendiente'}
                  </Badge>
                  {tieneAdelanto && (
                    <span className="text-muted-foreground">
                      Adelanto: {formatCurrency(reserva.adelantoPagado)}
                    </span>
                  )}
                  {reserva.saldoPendiente > 0 && (
                    <span className="text-muted-foreground">
                      Saldo: {formatCurrency(reserva.saldoPendiente)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Consecuencia */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-700 dark:text-red-400">Consecuencia</span>
            </div>
            <div className="mt-3 space-y-2">
              {tieneAdelanto ? (
                <label className="border-border bg-background hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                  <input
                    type="radio"
                    name="consecuencia"
                    checked={!reembolsarAdelanto}
                    onChange={() => setReembolsarAdelanto(false)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium">Pierde el adelanto</p>
                    <p className="text-muted-foreground text-sm">
                      El cliente pierde {formatCurrency(reserva.adelantoPagado)} por no presentarse
                    </p>
                  </div>
                </label>
              ) : (
                <div className="border-border bg-background rounded-lg border p-3">
                  <p className="font-medium">Cancelar sin reembolso</p>
                  <p className="text-muted-foreground text-sm">
                    No había pago registrado, solo se cancela la reserva
                  </p>
                </div>
              )}

              {tieneAdelanto && (
                <label className="border-border bg-background hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                  <input
                    type="radio"
                    name="consecuencia"
                    checked={reembolsarAdelanto}
                    onChange={() => setReembolsarAdelanto(true)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium">Reembolsar adelanto (caso especial)</p>
                    <p className="text-muted-foreground text-sm">
                      Devolver {formatCurrency(reserva.adelantoPagado)} al cliente
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Razón opcional */}
          <div>
            <label className="mb-2 block text-sm font-medium">Razón (opcional)</label>
            <Textarea
              placeholder="No llamó, no llegó, no respondió mensajes..."
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-border flex gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Confirmar No Show
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
