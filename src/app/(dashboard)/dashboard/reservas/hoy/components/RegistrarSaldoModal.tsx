'use client'

import * as React from 'react'
import { Dialog, DialogContent, Button, Badge, Input, Label } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import { DollarSign, CreditCard, Smartphone, Receipt, Check } from 'lucide-react'
import type { ReservaConLlegada, ManualPaymentMethod } from '../../types'

interface RegistrarSaldoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva: ReservaConLlegada | null
  onConfirm: (reservaId: string, monto: number, metodoPago: ManualPaymentMethod) => Promise<void>
}

const METODOS_PAGO: {
  value: ManualPaymentMethod
  label: string
  icon: React.ElementType
  color: string
}[] = [
  { value: 'efectivo', label: 'Efectivo', icon: Receipt, color: 'from-green-500 to-green-600' },
  {
    value: 'tarjeta_local',
    label: 'Tarjeta',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
  },
  { value: 'yape', label: 'Yape', icon: Smartphone, color: 'from-purple-500 to-purple-600' },
  { value: 'plin', label: 'Plin', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
]

export function RegistrarSaldoModal({
  open,
  onOpenChange,
  reserva,
  onConfirm,
}: RegistrarSaldoModalProps) {
  const [metodoPago, setMetodoPago] = React.useState<ManualPaymentMethod>('efectivo')
  const [monto, setMonto] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset al abrir
  React.useEffect(() => {
    if (open && reserva) {
      setMonto(reserva.saldoPendiente)
      setMetodoPago('efectivo')
    }
  }, [open, reserva])

  if (!reserva) return null

  const handleConfirm = async () => {
    if (monto <= 0) return

    setIsLoading(true)
    try {
      await onConfirm(reserva.id, monto, metodoPago)
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Registrar Pago de Saldo</h2>
            <p className="text-muted-foreground text-sm">Completar pago pendiente</p>
          </div>
        </div>

        {/* Content */}
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
              <div className="col-span-2">
                <span className="text-muted-foreground">Reserva:</span>
                <p className="font-medium">
                  {reserva.startTime} - {reserva.endTime} | {reserva.venueNombre}
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de pagos */}
          <div className="border-border rounded-xl border p-4">
            <h4 className="mb-3 font-medium">Resumen de pagos</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de reserva:</span>
                <span className="font-medium">{formatCurrency(reserva.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Adelanto pagado:</span>
                <span>{formatCurrency(reserva.adelantoPagado)}</span>
              </div>
              <div className="border-border my-2 border-t" />
              <div className="flex justify-between text-lg font-bold">
                <span>Saldo pendiente:</span>
                <span className="text-orange-600">{formatCurrency(reserva.saldoPendiente)}</span>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <Label className="mb-3 block">Método de pago del saldo</Label>
            <div className="grid grid-cols-2 gap-3">
              {METODOS_PAGO.map((metodo) => {
                const Icon = metodo.icon
                const isSelected = metodoPago === metodo.value

                return (
                  <button
                    key={metodo.value}
                    type="button"
                    onClick={() => setMetodoPago(metodo.value)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('rounded-lg bg-gradient-to-br p-1.5', metodo.color)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{metodo.label}</span>
                    {isSelected && (
                      <div className="ml-auto">
                        <Check className="text-primary h-4 w-4" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Monto recibido */}
          <div>
            <Label htmlFor="monto" className="mb-2 block">
              Monto recibido
            </Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-lg font-medium">
                S/
              </span>
              <Input
                id="monto"
                type="number"
                min={0}
                max={reserva.saldoPendiente}
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="pl-10 text-lg"
              />
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Saldo pendiente: {formatCurrency(reserva.saldoPendiente)}
            </p>
          </div>

          {/* Cambio (solo efectivo) */}
          {metodoPago === 'efectivo' && monto > reserva.saldoPendiente && (
            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/20">
              <p className="text-sm">
                <span className="text-muted-foreground">Cambio a entregar:</span>{' '}
                <span className="font-bold text-blue-600">
                  {formatCurrency(monto - reserva.saldoPendiente)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border flex gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={monto <= 0}
            className="flex-1"
          >
            <Check className="mr-2 h-4 w-4" />
            Confirmar Pago
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
