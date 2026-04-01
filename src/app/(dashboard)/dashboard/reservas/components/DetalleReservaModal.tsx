'use client'

import * as React from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Package,
  Tag,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
} from 'lucide-react'
import { Dialog, DialogContent, Button, Badge, Card } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Reserva } from '../types'

interface DetalleReservaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva: Reserva | null
  onRegistrarPago?: () => void
  onCancelar?: () => void
  onMarcarLlegada?: () => void
  onMarcarCompletada?: () => void
}

const statusConfig = {
  pending_payment: {
    label: 'Pendiente de pago',
    color: 'pending',
    icon: AlertCircle,
  },
  confirmed: {
    label: 'Confirmada',
    color: 'success',
    icon: CheckCircle,
  },
  in_progress: {
    label: 'En curso',
    color: 'info',
    icon: Timer,
  },
  completed: {
    label: 'Completada',
    color: 'success',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'destructive',
    icon: XCircle,
  },
  cancelled_with_refund: {
    label: 'Cancelada con reembolso',
    color: 'warning',
    icon: XCircle,
  },
}

const paymentStatusConfig = {
  pending: { label: 'Sin pago', color: 'outline' as const },
  partial: { label: 'Pago parcial', color: 'warning' as const },
  completed: { label: 'Pagado', color: 'success' as const },
  refunded: { label: 'Reembolsado', color: 'destructive' as const },
  partial_refund: { label: 'Reembolso parcial', color: 'warning' as const },
}

export function DetalleReservaModal({
  open,
  onOpenChange,
  reserva,
  onRegistrarPago,
  onCancelar,
  onMarcarLlegada,
  onMarcarCompletada,
}: DetalleReservaModalProps) {
  if (!reserva) return null

  const statusInfo = statusConfig[reserva.status]
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        {/* Header con estado */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Detalle de Reserva</h2>
            <p className="text-muted-foreground text-sm">ID: {reserva.id}</p>
          </div>
          <Badge
            variant={
              statusInfo.color as
                | 'success'
                | 'warning'
                | 'destructive'
                | 'info'
                | 'pending'
                | 'outline'
            }
            dot
            className="text-sm"
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Cliente */}
          <Card className="p-4">
            <div className="text-primary mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-semibold">Datos del Cliente</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{reserva.clienteNombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span>{reserva.clienteTelefono}</span>
              </div>
              {reserva.clienteEmail && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{reserva.clienteEmail}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Cancha y horario */}
          <Card className="p-4">
            <div className="text-primary mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <h3 className="font-semibold">Cancha y Horario</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Cancha</p>
                <p className="font-medium">{reserva.venueNombre}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>{formatDate(reserva.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span>
                  {reserva.startTime} - {reserva.endTime} ({reserva.duracionHoras}h)
                </span>
              </div>
              {reserva.horaLlegada && (
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={cn(
                      'h-4 w-4',
                      reserva.dentroDeTolerancia ? 'text-primary' : 'text-destructive'
                    )}
                  />
                  <span className="text-sm">
                    Llegó a las {reserva.horaLlegada}
                    {!reserva.dentroDeTolerancia && ' (fuera de tolerancia)'}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Pago */}
          <Card className="p-4">
            <div className="text-primary mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-semibold">Información de Pago</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio base:</span>
                <span>{formatCurrency(reserva.precioBase)}</span>
              </div>
              {reserva.promocion && (
                <div className="text-primary flex justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {reserva.promocion.nombre}:
                  </span>
                  <span>-{formatCurrency(reserva.promocion.descuentoAplicado)}</span>
                </div>
              )}
              {reserva.productos.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Productos extras:</span>
                  <span>
                    {formatCurrency(reserva.productos.reduce((a, p) => a + p.subtotal, 0))}
                  </span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span className="text-primary">{formatCurrency(reserva.totalPrice)}</span>
              </div>

              {/* Estado de pago */}
              <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Estado de pago:</span>
                  <Badge variant={paymentStatusConfig[reserva.estadoPago].color}>
                    {paymentStatusConfig[reserva.estadoPago].label}
                  </Badge>
                </div>
              </div>

              {/* Desglose de pagos */}
              {reserva.adelantoPagado > 0 && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adelanto pagado:</span>
                    <span className="text-primary font-medium">
                      {formatCurrency(reserva.adelantoPagado)}
                    </span>
                  </div>
                  {reserva.saldoPendiente > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo pendiente:</span>
                      <span className="font-medium text-amber-600">
                        {formatCurrency(reserva.saldoPendiente)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Productos extras */}
          {reserva.productos.length > 0 && (
            <Card className="p-4">
              <div className="text-primary mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                <h3 className="font-semibold">Productos Extras</h3>
              </div>
              <div className="space-y-2">
                {reserva.productos.map((producto) => (
                  <div key={producto.id} className="flex justify-between text-sm">
                    <span>
                      {producto.cantidad}x {producto.nombre}
                    </span>
                    <span>{formatCurrency(producto.subtotal)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Historial de pagos */}
          {reserva.pagos.length > 0 && (
            <Card className="p-4">
              <div className="text-primary mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <h3 className="font-semibold">Historial de Pagos</h3>
              </div>
              <div className="space-y-3">
                {reserva.pagos.map((pago) => (
                  <div
                    key={pago.id}
                    className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium capitalize">{pago.tipoPago}</p>
                      <p className="text-muted-foreground text-xs">
                        {pago.metodoPago.toUpperCase()} •{' '}
                        {new Date(pago.fecha).toLocaleString('es-PE')}
                      </p>
                    </div>
                    <span className="text-primary font-semibold">{formatCurrency(pago.monto)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Observaciones */}
          {reserva.observaciones && (
            <Card className="p-4">
              <div className="text-primary mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <h3 className="font-semibold">Observaciones</h3>
              </div>
              <p className="text-muted-foreground text-sm">{reserva.observaciones}</p>
            </Card>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-6 flex flex-wrap gap-2">
          {reserva.status === 'pending_payment' && onRegistrarPago && (
            <Button onClick={onRegistrarPago}>
              <CreditCard className="mr-2 h-4 w-4" />
              Registrar pago
            </Button>
          )}

          {reserva.status === 'confirmed' && (
            <>
              {reserva.estadoPago === 'partial' && onRegistrarPago && (
                <Button onClick={onRegistrarPago} variant="outline">
                  Registrar saldo
                </Button>
              )}
              {onMarcarLlegada && (
                <Button onClick={onMarcarLlegada}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar llegada
                </Button>
              )}
              {onCancelar && (
                <Button variant="destructive" onClick={onCancelar}>
                  Cancelar reserva
                </Button>
              )}
            </>
          )}

          {reserva.status === 'in_progress' && onMarcarCompletada && (
            <Button onClick={onMarcarCompletada}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar completada
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
