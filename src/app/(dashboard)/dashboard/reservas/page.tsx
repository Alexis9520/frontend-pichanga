'use client'

import * as React from 'react'
import { Plus, Eye, Phone, CreditCard, XCircle, LayoutGrid, List } from 'lucide-react'
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useReservas } from './hooks/useReservas'
import { ReservaStatsCards } from './components/ReservaStats'
import { ReservaFilters } from './components/ReservaFilters'
import { ReservaCard } from './components/ReservaCard'
import { NuevaReservaModal } from './components/NuevaReservaModal'
import { DetalleReservaModal } from './components/DetalleReservaModal'
import { RegistrarPagoModal } from './components/RegistrarPagoModal'
import { CancelarReservaModal } from './components/CancelarReservaModal'
import type { Reserva } from './types'
import { cn } from '@/lib/utils'

// Configuración de estados
const statusConfig = {
  pending: { label: 'Pendiente', color: 'pending' as const },
  confirmed: { label: 'Confirmada', color: 'success' as const },
  in_progress: { label: 'En curso', color: 'info' as const },
  completed: { label: 'Completada', color: 'success' as const },
  cancelled: { label: 'Cancelada', color: 'destructive' as const },
}

const paymentStatusConfig = {
  pending: { label: 'Sin pago', color: 'outline' as const },
  partial: { label: 'Parcial', color: 'warning' as const },
  completed: { label: 'Pagado', color: 'success' as const },
  refunded: { label: 'Reembolsado', color: 'destructive' as const },
  partial_refund: { label: 'Reemb. Parcial', color: 'warning' as const },
}

// Tipo de vista
type ViewMode = 'cards' | 'list'

export default function ReservasPage() {
  // Hook principal
  const {
    filteredReservas,
    stats,
    filters,
    setFilters,
    crearReserva,
    cancelarReserva,
    registrarPago,
    marcarLlegada,
    getReservaById,
    canchas,
    productos,
    promociones,
  } = useReservas()

  // Estados de modales
  const [nuevaReservaOpen, setNuevaReservaOpen] = React.useState(false)
  const [detalleOpen, setDetalleOpen] = React.useState(false)
  const [pagoOpen, setPagoOpen] = React.useState(false)
  const [cancelarOpen, setCancelarOpen] = React.useState(false)
  const [reservaSeleccionada, setReservaSeleccionada] = React.useState<Reserva | null>(null)

  // Estado de vista (cards por defecto)
  const [viewMode, setViewMode] = React.useState<ViewMode>('cards')

  // Handlers
  const handleVerDetalle = (reserva: Reserva) => {
    setReservaSeleccionada(reserva)
    setDetalleOpen(true)
  }

  const handleRegistrarPago = (reserva: Reserva) => {
    setReservaSeleccionada(reserva)
    setPagoOpen(true)
  }

  const handleCancelar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva)
    setCancelarOpen(true)
  }

  const handleConfirmarPago = async (data: {
    tipoPago: 'adelanto' | 'saldo' | 'completo'
    monto: number
    metodoPago: 'efectivo' | 'tarjeta_local' | 'yape' | 'plin'
    observaciones?: string
  }) => {
    if (!reservaSeleccionada) return
    await registrarPago(reservaSeleccionada.id, data)
    // Actualizar la reserva seleccionada
    const updated = getReservaById(reservaSeleccionada.id)
    if (updated) setReservaSeleccionada(updated)
  }

  const handleConfirmarCancelacion = async (motivo: string, conReembolso: boolean) => {
    if (!reservaSeleccionada) return
    await cancelarReserva(reservaSeleccionada.id, motivo, conReembolso)
    setDetalleOpen(false)
  }

  const handleMarcarLlegada = async () => {
    if (!reservaSeleccionada) return
    await marcarLlegada(reservaSeleccionada.id)
    const updated = getReservaById(reservaSeleccionada.id)
    if (updated) setReservaSeleccionada(updated)
  }

  const handleMarcarCompletada = async () => {
    if (!reservaSeleccionada) return
    // Simular marcar como completada
    await new Promise((r) => setTimeout(r, 300))
    const updated = getReservaById(reservaSeleccionada.id)
    if (updated) setReservaSeleccionada(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reservas</h1>
          <p className="text-muted-foreground">Historial y gestión de reservas</p>
        </div>
        <Button onClick={() => setNuevaReservaOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva reserva manual
        </Button>
      </div>

      {/* Stats */}
      <ReservaStatsCards stats={stats} />

      {/* Filters */}
      <ReservaFilters filters={filters} onFiltersChange={setFilters} canchas={canchas} />

      {/* Lista de reservas con toggle de vista */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">
              Lista de reservas
              <span className="text-muted-foreground ml-2 font-normal">
                ({filteredReservas.length} encontradas)
              </span>
            </CardTitle>

            {/* Toggle de vista */}
            <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('cards')}
                className={cn(
                  'gap-2 rounded-md',
                  viewMode === 'cards' && 'bg-background shadow-sm'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn('gap-2 rounded-md', viewMode === 'list' && 'bg-background shadow-sm')}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Vista de Cards */}
          {viewMode === 'cards' && (
            <div className="p-4 pt-0">
              {filteredReservas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No se encontraron reservas</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setNuevaReservaOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primera reserva
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredReservas.map((reserva) => (
                    <ReservaCard
                      key={reserva.id}
                      reserva={reserva}
                      onVerDetalle={handleVerDetalle}
                      onRegistrarPago={handleRegistrarPago}
                      onCancelar={handleCancelar}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vista de Lista (Tabla) */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-border bg-muted/50 border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cliente
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cancha
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Fecha y hora
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Monto
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Estado
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Origen
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-medium tracking-wider uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {filteredReservas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <p className="text-muted-foreground">No se encontraron reservas</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => setNuevaReservaOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Crear primera reserva
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    filteredReservas.map((reserva) => (
                      <tr key={reserva.id} className="hover:bg-muted/50 transition-colors">
                        {/* Cliente */}
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{reserva.clienteNombre}</p>
                            <p className="text-muted-foreground text-sm">
                              {reserva.clienteTelefono}
                            </p>
                          </div>
                        </td>

                        {/* Cancha */}
                        <td className="px-4 py-4">
                          <span className="font-medium">{reserva.venueNombre}</span>
                        </td>

                        {/* Fecha y hora */}
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{formatDate(reserva.date)}</p>
                            <p className="text-muted-foreground text-sm">
                              {reserva.startTime} - {reserva.endTime}
                            </p>
                          </div>
                        </td>

                        {/* Monto */}
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{formatCurrency(reserva.totalPrice)}</p>
                            {reserva.estadoPago === 'partial' && (
                              <p className="text-xs text-amber-600">
                                Saldo: {formatCurrency(reserva.saldoPendiente)}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant={statusConfig[reserva.status].color} size="sm" dot>
                              {statusConfig[reserva.status].label}
                            </Badge>
                            <Badge
                              variant={paymentStatusConfig[reserva.estadoPago].color}
                              size="sm"
                            >
                              {paymentStatusConfig[reserva.estadoPago].label}
                            </Badge>
                          </div>
                        </td>

                        {/* Origen */}
                        <td className="px-4 py-4">
                          <Badge
                            variant={reserva.source === 'app_mobile' ? 'info' : 'outline'}
                            size="sm"
                          >
                            {reserva.source === 'app_mobile'
                              ? 'App'
                              : reserva.source === 'web_owner'
                                ? 'Web'
                                : reserva.source === 'phone_call'
                                  ? 'Teléfono'
                                  : 'Local'}
                          </Badge>
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Ver detalles"
                              onClick={() => handleVerDetalle(reserva)}
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

                            {/* Acciones contextuales */}
                            {reserva.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Registrar pago"
                                onClick={() => handleRegistrarPago(reserva)}
                                className="text-primary hover:text-primary"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}

                            {reserva.status === 'confirmed' && reserva.estadoPago === 'partial' && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Registrar saldo"
                                onClick={() => handleRegistrarPago(reserva)}
                                className="text-primary hover:text-primary"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}

                            {(reserva.status === 'pending' || reserva.status === 'confirmed') && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Cancelar"
                                onClick={() => handleCancelar(reserva)}
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <NuevaReservaModal
        open={nuevaReservaOpen}
        onOpenChange={setNuevaReservaOpen}
        onSubmit={async (data) => {
          await crearReserva(data)
        }}
        canchas={canchas}
        productos={productos}
        promociones={promociones}
      />

      <DetalleReservaModal
        open={detalleOpen}
        onOpenChange={setDetalleOpen}
        reserva={reservaSeleccionada}
        onRegistrarPago={() => {
          setDetalleOpen(false)
          setPagoOpen(true)
        }}
        onCancelar={() => {
          setDetalleOpen(false)
          setCancelarOpen(true)
        }}
        onMarcarLlegada={handleMarcarLlegada}
        onMarcarCompletada={handleMarcarCompletada}
      />

      <RegistrarPagoModal
        open={pagoOpen}
        onOpenChange={setPagoOpen}
        saldoPendiente={reservaSeleccionada?.saldoPendiente || 0}
        onConfirm={handleConfirmarPago}
      />

      <CancelarReservaModal
        open={cancelarOpen}
        onOpenChange={setCancelarOpen}
        reserva={
          reservaSeleccionada
            ? {
                id: reservaSeleccionada.id,
                clienteNombre: reservaSeleccionada.clienteNombre,
                fecha: reservaSeleccionada.date,
                totalPrice: reservaSeleccionada.totalPrice,
                adelantoPagado: reservaSeleccionada.adelantoPagado,
              }
            : null
        }
        onConfirm={handleConfirmarCancelacion}
      />
    </div>
  )
}
