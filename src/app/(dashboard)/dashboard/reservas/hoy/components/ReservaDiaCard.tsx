'use client'

import * as React from 'react'
import { Button, Badge } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import {
  MapPin,
  Clock,
  User,
  Phone,
  CreditCard,
  CheckCircle2,
  XCircle,
  DollarSign,
  Play,
  QrCode,
  AlertTriangle,
} from 'lucide-react'
import type { ReservaConLlegada } from '../../types'
import { calcularTiempoReserva } from '../mock-data'

interface ReservaDiaCardProps {
  reserva: ReservaConLlegada
  onMarcarLlegada: (reserva: ReservaConLlegada) => void
  onNoShow: (reserva: ReservaConLlegada) => void
  onRegistrarSaldo: (reserva: ReservaConLlegada) => void
  onCompletar: (reserva: ReservaConLlegada) => void
  onCancelar: (reserva: ReservaConLlegada) => void
  onEscanearQR: () => void
}

export function ReservaDiaCard({
  reserva,
  onMarcarLlegada,
  onNoShow,
  onRegistrarSaldo,
  onCompletar,
  onCancelar,
  onEscanearQR,
}: ReservaDiaCardProps) {
  const tiempoInfo = calcularTiempoReserva(reserva.startTime, reserva.endTime)
  const tieneSaldoPendiente = reserva.saldoPendiente > 0

  // Determinar color de borde según estado
  const getBorderColor = () => {
    if (reserva.status === 'completed') return 'border-green-300 dark:border-green-800'
    if (reserva.status === 'cancelled') return 'border-red-300 dark:border-red-800'
    if (reserva.status === 'in_progress') return 'border-blue-300 dark:border-blue-800'
    if (tiempoInfo.status === 'pasado') return 'border-red-300 dark:border-red-800'
    if (tiempoInfo.status === 'actual') return 'border-blue-300 dark:border-blue-800'
    if (tiempoInfo.status === 'proximo') return 'border-yellow-300 dark:border-yellow-800'
    return 'border-border'
  }

  // Badge de estado de reserva
  const getStatusBadge = () => {
    if (reserva.llegada?.status === 'no_show') {
      return (
        <Badge variant="destructive" size="sm">
          No Show
        </Badge>
      )
    }
    if (reserva.status === 'completed') {
      return (
        <Badge variant="success" size="sm">
          Completada
        </Badge>
      )
    }
    if (reserva.status === 'in_progress') {
      return (
        <Badge variant="info" size="sm">
          En Curso
        </Badge>
      )
    }
    if (reserva.status === 'cancelled') {
      return (
        <Badge variant="destructive" size="sm">
          Cancelada
        </Badge>
      )
    }
    if (tiempoInfo.status === 'pasado') {
      return (
        <Badge variant="warning" size="sm">
          Pasada
        </Badge>
      )
    }
    if (tiempoInfo.status === 'actual') {
      return (
        <Badge variant="info" size="sm">
          Ahora
        </Badge>
      )
    }
    if (tiempoInfo.status === 'proximo') {
      return (
        <Badge variant="warning" size="sm">
          Próxima
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" size="sm">
        Confirmada
      </Badge>
    )
  }

  // Badge de estado de pago
  const getPaymentBadge = () => {
    switch (reserva.estadoPago) {
      case 'completed':
        return (
          <Badge variant="success" size="sm">
            Pagado
          </Badge>
        )
      case 'partial':
        return (
          <Badge variant="warning" size="sm">
            Adelanto
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" size="sm">
            Pendiente
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="destructive" size="sm">
            Reembolsado
          </Badge>
        )
      default:
        return null
    }
  }

  // Determinar acciones disponibles
  const showMarcarLlegada =
    reserva.status === 'confirmed' && !reserva.llegada && tiempoInfo.status !== 'pasado'
  const showNoShow =
    reserva.status === 'confirmed' && !reserva.llegada && tiempoInfo.status !== 'futuro'
  const showRegistrarSaldo =
    tieneSaldoPendiente && reserva.status !== 'cancelled' && reserva.status !== 'completed'
  const showCompletar =
    reserva.status === 'in_progress' ||
    (reserva.status === 'confirmed' && tiempoInfo.status === 'pasado')

  return (
    <div
      className={cn(
        'bg-background rounded-xl border-2 p-4 transition-all hover:shadow-md',
        getBorderColor()
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              tiempoInfo.status === 'actual'
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : tiempoInfo.status === 'pasado'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-primary/10'
            )}
          >
            <Clock
              className={cn(
                'h-6 w-6',
                tiempoInfo.status === 'actual'
                  ? 'text-blue-600'
                  : tiempoInfo.status === 'pasado'
                    ? 'text-red-600'
                    : 'text-primary'
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{reserva.startTime}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-lg font-bold">{reserva.endTime}</span>
            </div>
            <p className="text-muted-foreground text-sm">{tiempoInfo.texto}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusBadge()}
          {getPaymentBadge()}
        </div>
      </div>

      {/* Cliente */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{reserva.clienteNombre}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4" />
          <span>{reserva.clienteTelefono}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{reserva.venueNombre}</span>
        </div>
      </div>

      {/* Pago */}
      <div className="bg-muted/50 mt-3 flex items-center justify-between rounded-lg p-3">
        <div className="flex items-center gap-2">
          <CreditCard className="text-muted-foreground h-4 w-4" />
          <div className="text-sm">
            <span className="text-muted-foreground">Total:</span>{' '}
            <span className="font-bold">{formatCurrency(reserva.totalPrice)}</span>
          </div>
        </div>
        {tieneSaldoPendiente && (
          <div className="flex items-center gap-1 text-sm text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Saldo: {formatCurrency(reserva.saldoPendiente)}</span>
          </div>
        )}
      </div>

      {/* Llegada registrada */}
      {reserva.llegada && (
        <div
          className={cn(
            'mt-3 flex items-center gap-2 rounded-lg p-2',
            reserva.llegada.dentroDeTolerancia
              ? 'bg-green-50 dark:bg-green-950/20'
              : 'bg-orange-50 dark:bg-orange-950/20'
          )}
        >
          {reserva.llegada.dentroDeTolerancia ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          )}
          <span className="text-sm">
            Llegó a las <strong>{reserva.llegada.horaLlegada}</strong>
            {reserva.llegada.minutosRetraso > 0 && (
              <span className="text-muted-foreground">
                {' '}
                ({reserva.llegada.minutosRetraso} min tarde)
              </span>
            )}
          </span>
        </div>
      )}

      {/* Productos extras */}
      {reserva.productos.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="text-muted-foreground">Extras:</span>
          <span className="ml-1">
            {reserva.productos.map((p) => `${p.nombre} x${p.cantidad}`).join(', ')}
          </span>
        </div>
      )}

      {/* Acciones */}
      <div className="mt-4 flex flex-wrap gap-2">
        {showMarcarLlegada && (
          <>
            <Button size="sm" onClick={() => onMarcarLlegada(reserva)}>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Marcar Llegada
            </Button>
            <Button size="sm" variant="outline" onClick={onEscanearQR}>
              <QrCode className="mr-1 h-4 w-4" />
              QR
            </Button>
          </>
        )}

        {showNoShow && (
          <Button size="sm" variant="destructive" onClick={() => onNoShow(reserva)}>
            <XCircle className="mr-1 h-4 w-4" />
            No Se Presentó
          </Button>
        )}

        {showRegistrarSaldo && (
          <Button size="sm" variant="outline" onClick={() => onRegistrarSaldo(reserva)}>
            <DollarSign className="mr-1 h-4 w-4" />
            Registrar Saldo
          </Button>
        )}

        {showCompletar && reserva.status !== 'completed' && (
          <Button size="sm" variant="success" onClick={() => onCompletar(reserva)}>
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Completar
          </Button>
        )}
      </div>
    </div>
  )
}
