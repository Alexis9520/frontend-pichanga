'use client'

import * as React from 'react'
import { CreditCard } from 'lucide-react'
import { Dialog, DialogContent, Button, Input, Label, Select, Textarea } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { PaymentType, ManualPaymentMethod } from '../types'

interface RegistrarPagoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  saldoPendiente: number
  onConfirm: (data: {
    tipoPago: PaymentType
    monto: number
    metodoPago: ManualPaymentMethod
    observaciones?: string
  }) => Promise<void>
}

export function RegistrarPagoModal({
  open,
  onOpenChange,
  saldoPendiente,
  onConfirm,
}: RegistrarPagoModalProps) {
  const [tipoPago, setTipoPago] = React.useState<PaymentType>('saldo')
  const [monto, setMonto] = React.useState('')
  const [metodoPago, setMetodoPago] = React.useState<ManualPaymentMethod>('efectivo')
  const [observaciones, setObservaciones] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      setTipoPago('saldo')
      setMonto('')
      setMetodoPago('efectivo')
      setObservaciones('')
    }
  }, [open])

  // Auto-llenar monto según tipo
  React.useEffect(() => {
    if (tipoPago === 'completo') {
      setMonto(saldoPendiente.toString())
    }
  }, [tipoPago, saldoPendiente])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!monto || parseFloat(monto) <= 0) return

    setIsSubmitting(true)
    try {
      await onConfirm({
        tipoPago,
        monto: parseFloat(monto),
        metodoPago,
        observaciones: observaciones || undefined,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Registrar Pago">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Saldo pendiente */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Saldo pendiente</p>
            <p className="text-primary text-2xl font-bold">{formatCurrency(saldoPendiente)}</p>
          </div>

          {/* Tipo de pago */}
          <div className="space-y-2">
            <Label>Tipo de pago</Label>
            <div className="flex gap-2">
              {(['adelanto', 'saldo', 'completo'] as PaymentType[]).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoPago(tipo)}
                  className={`flex-1 rounded-xl border p-3 text-sm font-medium transition-all ${
                    tipoPago === tipo
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {tipo === 'adelanto' ? 'Adelanto' : tipo === 'saldo' ? 'Saldo' : 'Completo'}
                </button>
              ))}
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="monto">Monto a pagar</Label>
            <Input
              id="monto"
              type="number"
              min={0}
              max={saldoPendiente}
              step="0.01"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              leftIcon={<span className="text-muted-foreground">S/</span>}
            />
            {parseFloat(monto) > saldoPendiente && (
              <p className="text-destructive text-xs">
                El monto no puede ser mayor al saldo pendiente
              </p>
            )}
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label htmlFor="metodoPago">Método de pago</Label>
            <Select
              options={[
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'tarjeta_local', label: 'Tarjeta' },
                { value: 'yape', label: 'Yape' },
                { value: 'plin', label: 'Plin' },
              ]}
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value as ManualPaymentMethod)}
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
            <Textarea
              id="observaciones"
              placeholder="Notas adicionales..."
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!monto || parseFloat(monto) <= 0 || parseFloat(monto) > saldoPendiente}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Confirmar pago
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
