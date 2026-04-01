'use client'

import * as React from 'react'
import {
  Eye,
  Phone,
  CreditCard,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Tag,
  Package,
  Smartphone,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  XCircle as XCircleIcon,
  Timer,
  DollarSign,
} from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Reserva, ReservationStatus, PaymentStatus } from '../types'

// ===========================================
// CONFIGURACIÓN DE ESTADOS
// ===========================================
const statusConfig: Record<
  ReservationStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }
> = {
  pending_payment: {
    label: 'Pendiente de pago',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    icon: Timer,
  },
  confirmed: {
    label: 'Confirmada',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    icon: CheckCircle2,
  },
  in_progress: {
    label: 'En curso',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    icon: Clock,
  },
  completed: {
    label: 'Completada',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    icon: XCircleIcon,
  },
  cancelled_with_refund: {
    label: 'C/Reembolso',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/50',
    icon: AlertCircle,
  },
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: 'outline' | 'warning' | 'success' | 'destructive' }
> = {
  pending: { label: 'Sin pago', variant: 'outline' },
  partial: { label: 'Parcial', variant: 'warning' },
  completed: { label: 'Pagado', variant: 'success' },
  refunded: { label: 'Reembolsado', variant: 'destructive' },
  partial_refund: { label: 'Reemb. Parcial', variant: 'warning' },
}

const paymentMethodConfig: Record<string, { label: string; icon: React.ElementType }> = {
  culqi: { label: 'Culqi', icon: CreditCard },
  efectivo: { label: 'Efectivo', icon: DollarSign },
  tarjeta_local: { label: 'Tarjeta', icon: CreditCard },
  yape: { label: 'Yape', icon: Smartphone },
  plin: { label: 'Plin', icon: Smartphone },
}

// ===========================================
// HELPER PARA AVATAR
// ===========================================
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ===========================================
// HELPER PARA FECHA RELATIVA
// ===========================================
function getRelativeDate(dateStr: string): {
  label: string
  isToday: boolean
  isTomorrow: boolean
} {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isToday = date.toDateString() === today.toDateString()
  const isTomorrow = date.toDateString() === tomorrow.toDateString()

  let label = formatDate(dateStr)
  if (isToday) label = 'Hoy'
  if (isTomorrow) label = 'Manana'

  return { label, isToday, isTomorrow }
}

// ===========================================
// PROPS
// ===========================================
interface ReservaCardProps {
  reserva: Reserva
  onVerDetalle: (reserva: Reserva) => void
  onRegistrarPago: (reserva: Reserva) => void
  onCancelar: (reserva: Reserva) => void
}

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================
export function ReservaCard({
  reserva,
  onVerDetalle,
  onRegistrarPago,
  onCancelar,
}: ReservaCardProps) {
  const status = statusConfig[reserva.status]
  const paymentStatus = paymentStatusConfig[reserva.estadoPago]
  const StatusIcon = status.icon
  const relativeDate = getRelativeDate(reserva.date)

  // Determinar si mostrar acciones
  const canRegisterPayment =
    reserva.status === 'pending_payment' ||
    (reserva.status === 'confirmed' && reserva.estadoPago === 'partial')
  const canCancel = reserva.status === 'pending_payment' || reserva.status === 'confirmed'

  // Último pago
  const ultimoPago = reserva.pagos[reserva.pagos.length - 1]
  const pagoMethod = ultimoPago ? paymentMethodConfig[ultimoPago.metodoPago] : null

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${status.borderColor} border-l-4`}
    >
      <CardContent className="p-0">
        {/* Header con estado */}
        <div className={`flex items-center justify-between px-4 py-3 ${status.bgColor}`}>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                reserva.status === 'cancelled' || reserva.status === 'cancelled_with_refund'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary/20 text-primary'
              }`}
            >
              {getInitials(reserva.clienteNombre)}
            </div>

            {/* Cliente */}
            <div>
              <p className="leading-tight font-semibold">{reserva.clienteNombre}</p>
              <p className="text-muted-foreground text-sm">{reserva.clienteTelefono}</p>
            </div>
          </div>

          {/* Estado badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${status.color} border-current`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-3 p-4">
          {/* Fila: Cancha + Precio */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">{reserva.venueNombre}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(reserva.totalPrice)}</p>
              {reserva.estadoPago === 'partial' && (
                <p className="text-xs text-amber-600">
                  Saldo: {formatCurrency(reserva.saldoPendiente)}
                </p>
              )}
            </div>
          </div>

          {/* Fila: Fecha y hora */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  relativeDate.isToday
                    ? 'bg-primary text-primary-foreground'
                    : relativeDate.isTomorrow
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {relativeDate.label}
                  {relativeDate.isToday && <span className="text-primary ml-1 text-xs">(Hoy)</span>}
                </p>
                <p className="text-muted-foreground text-xs">
                  {reserva.startTime} - {reserva.endTime} ({reserva.duracionHoras}h)
                </p>
              </div>
            </div>

            {/* Pago badge */}
            <Badge variant={paymentStatus.variant} size="sm">
              {paymentStatus.label}
            </Badge>
          </div>

          {/* Promoción y productos */}
          {(reserva.promocion || reserva.productos.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {reserva.promocion && (
                <div className="bg-secondary/10 text-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                  <Tag className="h-3 w-3" />
                  {reserva.promocion.nombre}
                  <span className="text-secondary/70">
                    (-{formatCurrency(reserva.promocion.descuentoAplicado)})
                  </span>
                </div>
              )}
              {reserva.productos.length > 0 && (
                <div className="bg-muted/50 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                  <Package className="h-3 w-3" />
                  {reserva.productos.length} extra{reserva.productos.length > 1 ? 's' : ''}
                  <span className="text-muted-foreground">
                    ({formatCurrency(reserva.productos.reduce((sum, p) => sum + p.subtotal, 0))})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Último pago */}
          {ultimoPago && pagoMethod && (
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <DollarSign className="h-3 w-3" />
              <span>
                {pagoMethod.label}: {formatCurrency(ultimoPago.monto)} adelanto
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="bg-border h-px" />

          {/* Footer: Acciones + Origen */}
          <div className="flex items-center justify-between">
            {/* Acciones */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                title="Ver detalles"
                onClick={() => onVerDetalle(reserva)}
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                title="Llamar"
                onClick={() => window.open(`tel:+51${reserva.clienteTelefono}`)}
              >
                <Phone className="h-4 w-4" />
              </Button>

              {canRegisterPayment && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Registrar pago"
                  onClick={() => onRegistrarPago(reserva)}
                  className="text-primary hover:text-primary"
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Cancelar"
                  onClick={() => onCancelar(reserva)}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Origen */}
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <Badge variant={reserva.source === 'app' ? 'info' : 'outline'} size="sm">
                {reserva.source === 'app' ? (
                  <>
                    <Smartphone className="mr-1 h-3 w-3" />
                    App
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-1 h-3 w-3" />
                    Manual
                  </>
                )}
              </Badge>
              {reserva.registradoPor && (
                <span className="hidden sm:inline">por {reserva.registradoPor}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
