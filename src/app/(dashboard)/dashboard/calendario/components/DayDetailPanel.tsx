'use client'

import * as React from 'react'
import {
  X,
  Plus,
  Phone,
  Eye,
  CreditCard,
  MapPin,
  User,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  Timer,
  XCircle,
} from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { CalendarDay, CalendarEvent, CanchaCalendario } from '../types'

// ===========================================
// CONFIGURACIÓN DE ESTADOS
// ===========================================
const STATUS_CONFIG = {
  pending_payment: {
    label: 'Pendiente',
    icon: Timer,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    barColor: 'bg-amber-500',
  },
  confirmed: {
    label: 'Confirmada',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    barColor: 'bg-green-500',
  },
  in_progress: {
    label: 'En curso',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    barColor: 'bg-blue-500',
  },
  completed: {
    label: 'Completada',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    barColor: 'bg-green-500/50',
  },
  cancelled: {
    label: 'Cancelada',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    barColor: 'bg-red-500/50',
  },
  cancelled_with_refund: {
    label: 'C/Reembolso',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/50',
    barColor: 'bg-orange-500',
  },
}

// Horas del día (6:00 - 23:00)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6)

// ===========================================
// PROPS
// ===========================================
interface DayDetailPanelProps {
  day: CalendarDay | null
  canchas: CanchaCalendario[]
  onClose: () => void
  onEventClick: (event: CalendarEvent) => void
  onNewReservation: (date: string, hora?: string, canchaId?: string) => void
  onRegisterPayment: (event: CalendarEvent) => void
}

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================
export function DayDetailPanel({
  day,
  canchas,
  onClose,
  onEventClick,
  onNewReservation,
  onRegisterPayment,
}: DayDetailPanelProps) {
  // Agrupar eventos por hora de inicio
  const eventsByHour = React.useMemo(() => {
    if (!day) return {}
    const grouped: Record<number, CalendarEvent[]> = {}
    HOURS.forEach((hour) => {
      grouped[hour] = day.events.filter((event) => {
        const [eventHour] = event.startTime.split(':').map(Number)
        return eventHour === hour
      })
    })
    return grouped
  }, [day])

  // Obtener horas con eventos
  const hoursWithEvents = HOURS.filter((hour) => (eventsByHour[hour]?.length || 0) > 0)
  const hasEvents = hoursWithEvents.length > 0

  if (!day) return null

  return (
    <div className="bg-background border-border flex h-full flex-col border-l">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="font-semibold">{formatDate(day.date)}</h3>
          {day.isToday && (
            <Badge variant="success" size="sm" className="mt-1">
              Hoy
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Resumen del día */}
        <DaySummary day={day} />

        {/* Acciones pendientes */}
        {day.stats.reservasPendientes > 0 && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">
                {day.stats.reservasPendientes} reserva{day.stats.reservasPendientes > 1 ? 's' : ''}{' '}
                sin pago
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Haz clic en &quot;Registrar pago&quot; para confirmar
            </p>
          </div>
        )}

        {/* Timeline de horarios */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Horarios del día</h4>
            <Button variant="outline" size="sm" onClick={() => onNewReservation(day.date)}>
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </Button>
          </div>

          {!hasEvents ? (
            <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No hay reservas para este día</p>
              <Button
                variant="link"
                size="sm"
                className="mt-2"
                onClick={() => onNewReservation(day.date)}
              >
                Crear primera reserva
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {HOURS.map((hour) => {
                const events = eventsByHour[hour] || []
                const hasEventsThisHour = events.length > 0

                if (!hasEventsThisHour) {
                  // Hora libre - click para crear
                  return (
                    <HourSlot
                      key={hour}
                      hour={hour}
                      onClick={() =>
                        onNewReservation(day.date, `${hour.toString().padStart(2, '0')}:00`)
                      }
                    />
                  )
                }

                // Hora con eventos
                return (
                  <div key={hour} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs font-medium">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                      <div className="bg-border h-px flex-1" />
                    </div>
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        canchas={canchas}
                        onClick={() => onEventClick(event)}
                        onRegisterPayment={() => onRegisterPayment(event)}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// COMPONENTE: Resumen del día
// ===========================================
function DaySummary({ day }: { day: CalendarDay }) {
  return (
    <div className="mb-4 grid grid-cols-4 gap-2">
      <div className="bg-muted/50 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold">{day.stats.totalReservas}</p>
        <p className="text-muted-foreground text-xs">Reservas</p>
      </div>
      <div className="rounded-lg bg-green-500/10 p-3 text-center">
        <p className="text-2xl font-bold text-green-600">{day.stats.reservasConfirmadas}</p>
        <p className="text-muted-foreground text-xs">Confirmadas</p>
      </div>
      <div className="rounded-lg bg-amber-500/10 p-3 text-center">
        <p className="text-2xl font-bold text-amber-600">{day.stats.reservasPendientes}</p>
        <p className="text-muted-foreground text-xs">Pendientes</p>
      </div>
      <div className="bg-primary/10 rounded-lg p-3 text-center">
        <p className="text-primary text-lg font-bold">{formatCurrency(day.stats.ingresos)}</p>
        <p className="text-muted-foreground text-xs">Estimado</p>
      </div>
    </div>
  )
}

// ===========================================
// COMPONENTE: Slot de hora libre
// ===========================================
interface HourSlotProps {
  hour: number
  onClick?: () => void
}

function HourSlot({ hour, onClick }: HourSlotProps) {
  return (
    <button
      onClick={onClick}
      className="group hover:bg-muted/30 flex w-full items-center gap-3 py-2 text-left transition-colors"
    >
      <span className="text-muted-foreground w-12 text-xs font-medium">
        {hour.toString().padStart(2, '0')}:00
      </span>
      <div className="flex-1 rounded-lg border border-dashed border-green-500/30 p-2 transition-colors group-hover:border-green-500/50 group-hover:bg-green-500/5">
        <div className="flex items-center justify-center gap-2 text-green-600">
          <Plus className="h-4 w-4" />
          <span className="text-xs font-medium">Disponible</span>
        </div>
      </div>
    </button>
  )
}

// ===========================================
// COMPONENTE: Card de evento/reserva
// ===========================================
interface EventCardProps {
  event: CalendarEvent
  canchas: CanchaCalendario[]
  onClick: () => void
  onRegisterPayment: () => void
}

function EventCard({ event, canchas, onClick, onRegisterPayment }: EventCardProps) {
  const cancha = canchas.find((c) => c.id === event.canchaId)
  const status = event.status ? STATUS_CONFIG[event.status] : null
  const StatusIcon = status?.icon || Clock

  // Determinar si es bloqueo o reserva
  const isBlocking = event.type === 'blocking'
  const isPendingPayment = event.status === 'pending_payment'
  const needsPayment = isPendingPayment && event.saldoPendiente && event.saldoPendiente > 0

  if (isBlocking) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Bloqueado</p>
            <p className="text-muted-foreground text-xs">{event.motivoBloqueo || 'Sin motivo'}</p>
          </div>
          {event.esRecurrente && (
            <Badge variant="outline" size="sm">
              Recurrente
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('rounded-lg border-2 p-3 transition-all', status?.borderColor, status?.bgColor)}
    >
      {/* Barra superior con cancha */}
      <div
        className="mb-2 h-1 w-full rounded-full"
        style={{ backgroundColor: cancha?.color || '#22c55e' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <span className="text-sm font-medium">{event.canchaNombre}</span>
        </div>
        {status && (
          <Badge
            variant={isPendingPayment ? 'warning' : 'success'}
            size="sm"
            className="flex items-center gap-1"
          >
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        )}
      </div>

      {/* Info del cliente */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-sm">{event.clienteNombre}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-muted-foreground text-sm">{event.clienteTelefono}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-sm">
            {event.startTime} - {event.endTime}
            <span className="text-muted-foreground ml-1 text-xs">({event.duracionHoras}h)</span>
          </span>
        </div>
      </div>

      {/* Info financiera */}
      {event.totalPrice && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-semibold">{formatCurrency(event.totalPrice)}</span>
          {event.adelantoPagado && event.adelantoPagado > 0 && (
            <>
              <span className="text-muted-foreground text-xs">|</span>
              <span className="text-xs">
                Adelanto:{' '}
                <span className="font-medium">{formatCurrency(event.adelantoPagado)}</span>
              </span>
            </>
          )}
          {event.saldoPendiente && event.saldoPendiente > 0 && (
            <>
              <span className="text-muted-foreground text-xs">|</span>
              <span className="text-xs text-amber-600">
                Saldo: {formatCurrency(event.saldoPendiente)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Promoción */}
      {event.promocionNombre && (
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600">
          <Tag className="h-3 w-3" />
          {event.promocionNombre}
        </div>
      )}

      {/* Acciones */}
      <div className="border-border/50 mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
        {needsPayment ? (
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRegisterPayment()
            }}
          >
            <CreditCard className="mr-1 h-3 w-3" />
            Registrar pago
          </Button>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          Ver detalle
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            window.open(`tel:+51${event.clienteTelefono}`)
          }}
        >
          <Phone className="mr-1 h-3 w-3" />
          Llamar
        </Button>
      </div>
    </div>
  )
}
