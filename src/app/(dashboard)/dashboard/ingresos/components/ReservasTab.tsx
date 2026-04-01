'use client'

import * as React from 'react'
import {
  Calendar,
  DollarSign,
  Clock,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  Smartphone,
} from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { ReservaIngreso, IngresoPorHorario, IngresoPorMetodoPago, TopHorario } from '../types'
import { METODOS_PAGO_CONFIG, ESTADO_PAGO_CONFIG, RANGO_HORARIO_CONFIG } from '../types'
import { GraficoDistribucion } from './GraficoDistribucion'

interface ReservasTabProps {
  reservas: ReservaIngreso[]
  ingresosPorHorario: IngresoPorHorario[]
  ingresosPorMetodoPago: IngresoPorMetodoPago[]
  topHorarios: TopHorario[]
}

export function ReservasTab({
  reservas,
  ingresosPorHorario,
  ingresosPorMetodoPago,
  topHorarios,
}: ReservasTabProps) {
  const [viewMode, setViewMode] = React.useState<'lista' | 'horarios' | 'metodos'>('lista')

  // Agrupar por estado
  const porEstado = React.useMemo(() => {
    return {
      completed: reservas.filter((r) => r.estadoPago === 'completed'),
      partial: reservas.filter((r) => r.estadoPago === 'partial'),
      pending: reservas.filter((r) => r.estadoPago === 'pending'),
    }
  }, [reservas])

  // Agrupar por origen
  const porOrigen = React.useMemo(() => {
    return {
      manual: reservas.filter((r) => r.origen === 'manual'),
      app: reservas.filter((r) => r.origen === 'app'),
    }
  }, [reservas])

  // Totales
  const totalIngresos = reservas.reduce((acc, r) => acc + r.precioTotal, 0)
  const totalAdelantos = reservas.reduce((acc, r) => acc + r.adelantoPagado, 0)
  const totalPendiente = reservas.reduce((acc, r) => acc + r.saldoPendiente, 0)

  return (
    <div className="space-y-6">
      {/* Resumen rápido */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-xs">Total reservas</p>
          <p className="text-2xl font-bold">{reservas.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-xs">Ingresos totales</p>
          <p className="text-primary text-2xl font-bold">{formatCurrency(totalIngresos)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-xs">Adelantos cobrados</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAdelantos)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-xs">Saldo pendiente</p>
          <p className="text-warning text-2xl font-bold">{formatCurrency(totalPendiente)}</p>
        </Card>
      </div>

      {/* Tabs internos */}
      <div className="border-border flex gap-1 border-b">
        {[
          { id: 'lista', label: 'Lista de reservas' },
          { id: 'horarios', label: 'Por horario' },
          { id: 'metodos', label: 'Métodos de pago' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as typeof viewMode)}
            className={cn(
              'px-4 pt-2 pb-3 text-sm font-medium transition-all',
              viewMode === tab.id
                ? 'text-primary border-primary -mb-[1px] border-b-2'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido según tab */}
      {viewMode === 'lista' && (
        <div className="space-y-3">
          {reservas.length === 0 ? (
            <div className="border-border rounded-xl border-2 border-dashed p-8 text-center">
              <Calendar className="text-muted-foreground mx-auto h-10 w-10" />
              <p className="mt-3 font-semibold">No hay reservas</p>
              <p className="text-muted-foreground mt-1 text-sm">en el período seleccionado</p>
            </div>
          ) : (
            reservas.map((reserva) => {
              const metodoConfig = METODOS_PAGO_CONFIG[reserva.metodoPago]
              const estadoConfig = ESTADO_PAGO_CONFIG[reserva.estadoPago]

              return (
                <Card key={reserva.id} className="p-4 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{reserva.canchaNombre}</span>
                        <Badge variant="outline" size="sm">
                          {reserva.origen === 'manual' ? '📋 Manual' : '📱 App'}
                        </Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(reserva.fecha)}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reserva.horaInicio} - {reserva.horaFin}
                        </span>
                        <span className="text-muted-foreground">{reserva.duracionHoras}h</span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm">{reserva.clienteNombre}</span>
                        {reserva.clienteTelefono && (
                          <span className="text-muted-foreground text-xs">
                            ({reserva.clienteTelefono})
                          </span>
                        )}
                      </div>

                      {/* Promoción aplicada */}
                      {reserva.promocionNombre && (
                        <Badge variant="success" size="sm" className="mt-2">
                          🎉 {reserva.promocionNombre} (-
                          {formatCurrency(reserva.descuentoPromo || 0)})
                        </Badge>
                      )}
                    </div>

                    {/* Precios y estado */}
                    <div className="text-right">
                      <p className="text-primary text-xl font-bold">
                        {formatCurrency(reserva.precioTotal)}
                      </p>

                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span className={cn('text-xs', estadoConfig.color)}>
                          {estadoConfig.label}
                        </span>
                      </div>

                      {/* Desglose de pago */}
                      {reserva.estadoPago === 'partial' && (
                        <div className="mt-2 text-xs">
                          <p className="text-muted-foreground">
                            Adelanto: {formatCurrency(reserva.adelantoPagado)}
                          </p>
                          <p className="text-warning font-medium">
                            Pendiente: {formatCurrency(reserva.saldoPendiente)}
                          </p>
                        </div>
                      )}

                      {/* Método de pago */}
                      <Badge className={cn('mt-2', metodoConfig.color)} size="sm">
                        {metodoConfig.icon} {metodoConfig.label}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {viewMode === 'horarios' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top horarios */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold">Horarios más solicitados</h3>
            <div className="space-y-3">
              {topHorarios.map((horario, index) => (
                <div
                  key={`${horario.horaInicio}-${horario.horaFin}`}
                  className="flex items-center gap-3"
                >
                  <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {horario.horaInicio} - {horario.horaFin}
                    </p>
                    <p className="text-muted-foreground text-xs">{horario.reservas} reservas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{formatCurrency(horario.ingresos)}</p>
                    <p className="text-muted-foreground text-xs">
                      {horario.porcentajePeak.toFixed(0)}% peak
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Por rango horario */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold">Por rango horario</h3>
            <div className="space-y-3">
              {Object.entries(RANGO_HORARIO_CONFIG).map(([key, config]) => {
                const ingresosRango = ingresosPorHorario
                  .filter((h) => h.rango === key)
                  .reduce((acc, h) => acc + h.ingresos, 0)
                const reservasRango = ingresosPorHorario
                  .filter((h) => h.rango === key)
                  .reduce((acc, h) => acc + h.totalReservas, 0)

                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-muted-foreground text-xs">
                        {config.horaInicio} - {config.horaFin}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(ingresosRango)}</p>
                      <p className="text-muted-foreground text-xs">{reservasRango} reservas</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {viewMode === 'metodos' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Distribución */}
          <Card className="p-4">
            <GraficoDistribucion
              datos={ingresosPorMetodoPago.map((m) => ({
                label: METODOS_PAGO_CONFIG[m.metodo].label,
                value: m.total,
                cantidad: m.cantidad,
                color: METODOS_PAGO_CONFIG[m.metodo].color.split(' ')[0],
              }))}
              titulo="Distribución por método de pago"
              tipo="donut"
              showCantidad
            />
          </Card>

          {/* Detalle */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold">Detalle por método</h3>
            <div className="space-y-3">
              {ingresosPorMetodoPago.map((item) => {
                const config = METODOS_PAGO_CONFIG[item.metodo]
                return (
                  <div key={item.metodo} className="flex items-center gap-3">
                    <Badge className={config.color}>
                      {config.icon} {config.label}
                    </Badge>
                    <div className="flex-1">
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${item.porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(item.total)}</p>
                      <p className="text-muted-foreground text-xs">{item.cantidad} transacciones</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
