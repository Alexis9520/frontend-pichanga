'use client'

import * as React from 'react'
import { Dialog, DialogContent, Button, Badge } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import { MapPin, Clock, Check, AlertTriangle, QrCode, User, CreditCard } from 'lucide-react'
import type { ReservaConLlegada, ToleranciaConfig } from '../../types'
import { calcularEstadoLlegada } from '../mock-data'

interface MarcarLlegadaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva: ReservaConLlegada | null
  onConfirm: (
    reservaId: string,
    metodoValidacion: 'qr' | 'manual',
    aplicoPenalidad: boolean
  ) => Promise<void>
}

export function MarcarLlegadaModal({
  open,
  onOpenChange,
  reserva,
  onConfirm,
}: MarcarLlegadaModalProps) {
  const [metodoValidacion, setMetodoValidacion] = React.useState<'qr' | 'manual'>('manual')
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      setMetodoValidacion('manual')
    }
  }, [open])

  if (!reserva) return null

  // Hora actual simulada
  const ahora = new Date()
  const horaLlegada = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`

  // Calcular estado de llegada
  const { minutosRetraso, dentroDeTolerancia, tiempoRestante } = calcularEstadoLlegada(
    reserva.startTime,
    horaLlegada,
    reserva.toleranciaConfig.minutos
  )

  // Determinar qué mostrar según la política
  const getPoliticaInfo = () => {
    const config = reserva.toleranciaConfig
    if (dentroDeTolerancia) {
      return {
        mensaje: 'El cliente puede usar la hora completa.',
        color: 'text-green-600',
        showPenalidad: false,
      }
    }

    switch (config.politicaExceso) {
      case 'perder_reserva':
        return {
          mensaje: 'Según la política, pierde la reserva.',
          color: 'text-red-600',
          showPenalidad: false,
        }
      case 'penalidad':
        return {
          mensaje: `Se aplicará una penalidad de ${formatCurrency(config.penalidadMonto || 0)}.`,
          color: 'text-orange-600',
          showPenalidad: true,
        }
      case 'tiempo_restante':
        return {
          mensaje: `Solo puede usar ${tiempoRestante} minutos de la reserva.`,
          color: 'text-orange-600',
          showPenalidad: false,
        }
      default:
        return {
          mensaje: 'El owner define la política.',
          color: 'text-muted-foreground',
          showPenalidad: false,
        }
    }
  }

  const politicaInfo = getPoliticaInfo()

  const handleConfirm = async (aplicarPenalidad: boolean) => {
    setIsLoading(true)
    try {
      await onConfirm(reserva.id, metodoValidacion, aplicarPenalidad)
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
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <MapPin className="text-primary h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Marcar Llegada</h2>
            <p className="text-muted-foreground text-sm">Registrar llegada del cliente</p>
          </div>
        </div>

        {/* Info del cliente */}
        <div className="space-y-4">
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
                <span className="text-muted-foreground">Hora actual:</span>
                <p className="font-medium">{horaLlegada}</p>
              </div>
            </div>
          </div>

          {/* Estado de llegada */}
          <div
            className={cn(
              'rounded-xl p-4',
              dentroDeTolerancia
                ? 'bg-green-50 dark:bg-green-950/20'
                : 'bg-orange-50 dark:bg-orange-950/20'
            )}
          >
            <div className="flex items-center gap-3">
              {dentroDeTolerancia ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {dentroDeTolerancia ? 'DENTRO DE TOLERANCIA' : 'EXCEDE TOLERANCIA'}
                  </p>
                  {minutosRetraso > 0 && (
                    <Badge variant={dentroDeTolerancia ? 'success' : 'warning'} size="sm">
                      {minutosRetraso} min tarde
                    </Badge>
                  )}
                </div>
                <p className={cn('text-sm', politicaInfo.color)}>{politicaInfo.mensaje}</p>
              </div>
            </div>

            <div className="text-muted-foreground mt-3 text-sm">
              Tiempo de llegada: <span className="font-medium">{minutosRetraso} min</span> después
              <br />
              Tolerancia configurada:{' '}
              <span className="font-medium">{reserva.toleranciaConfig.minutos} min</span>
            </div>
          </div>

          {/* Método de validación */}
          <div>
            <p className="mb-2 text-sm font-medium">Método de validación:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodoValidacion('qr')}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all',
                  metodoValidacion === 'qr'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <QrCode className="h-5 w-5" />
                <span className="text-sm font-medium">Escaneó QR</span>
              </button>
              <button
                type="button"
                onClick={() => setMetodoValidacion('manual')}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all',
                  metodoValidacion === 'manual'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Confirmación manual</span>
              </button>
            </div>
          </div>

          {/* Info de pago */}
          {reserva.estadoPago === 'partial' && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  Pago parcial
                </span>
              </div>
              <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
                Adelanto: {formatCurrency(reserva.adelantoPagado)} | Saldo pendiente:{' '}
                {formatCurrency(reserva.saldoPendiente)}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border flex gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>

          {dentroDeTolerancia ? (
            <Button onClick={() => handleConfirm(false)} isLoading={isLoading} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Confirmar Llegada
            </Button>
          ) : (
            <div className="flex flex-1 gap-2">
              {politicaInfo.showPenalidad && (
                <Button
                  variant="outline"
                  onClick={() => handleConfirm(true)}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Aplicar Penalidad
                </Button>
              )}
              <Button onClick={() => handleConfirm(false)} isLoading={isLoading} className="flex-1">
                Aceptar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
