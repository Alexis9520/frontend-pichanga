'use client'

import * as React from 'react'
import { Button, Badge, Select } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  QrCode,
  MapPin,
  RefreshCw,
  Filter,
} from 'lucide-react'
import type { ReservaConLlegada, ReservasDiaResumen, ManualPaymentMethod } from '../types'
import { reservasHoyMock, resumenHoyMock } from './mock-data'
import { MarcarLlegadaModal, NoShowModal, RegistrarSaldoModal, ReservaDiaCard } from './components'

// ===========================================
// KPI CARD COMPONENT
// ===========================================
function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="border-border bg-background rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// MODAL DE QR (SIMPLIFICADO)
// ===========================================
function QRScannerModal({
  open,
  onOpenChange,
  onScanSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScanSuccess: (reservaId: string) => void
}) {
  const [manualCode, setManualCode] = React.useState('')

  const handleManualSubmit = () => {
    if (manualCode) {
      // En producción, buscar la reserva por código
      onScanSuccess(manualCode)
      setManualCode('')
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-background w-full max-w-md rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
            <QrCode className="text-primary h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Escanear QR de Reserva</h2>
            <p className="text-muted-foreground text-sm">Valida la reserva del cliente</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="border-border bg-muted/30 flex aspect-square w-full items-center justify-center rounded-xl border-2 border-dashed">
            <div className="text-center">
              <QrCode className="text-muted-foreground/50 mx-auto h-16 w-16" />
              <p className="text-muted-foreground mt-2 text-sm">
                Apunta la cámara al QR del cliente
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">O ingresa código manualmente:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="RES-XXXX-XXXX"
              className="border-border bg-background flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <Button onClick={handleManualSubmit} disabled={!manualCode}>
              Validar
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </div>
    </div>
  )
}

// ===========================================
// PAGE COMPONENT
// ===========================================
export default function ReservasHoyPage() {
  // State
  const [reservas, setReservas] = React.useState<ReservaConLlegada[]>(reservasHoyMock)
  const [resumen] = React.useState<ReservasDiaResumen>(resumenHoyMock)
  const [isLoading, setIsLoading] = React.useState(false)

  // Filtros
  const [filtroCancha, setFiltroCancha] = React.useState('todas')
  const [filtroEstado, setFiltroEstado] = React.useState<
    'todas' | 'pendientes' | 'en_curso' | 'completadas' | 'no_show'
  >('todas')
  const [mostrarSoloSaldoPendiente, setMostrarSoloSaldoPendiente] = React.useState(false)

  // Modales
  const [selectedReserva, setSelectedReserva] = React.useState<ReservaConLlegada | null>(null)
  const [showLlegadaModal, setShowLlegadaModal] = React.useState(false)
  const [showNoShowModal, setShowNoShowModal] = React.useState(false)
  const [showSaldoModal, setShowSaldoModal] = React.useState(false)
  const [showQRModal, setShowQRModal] = React.useState(false)

  // Canchas únicas para filtro
  const canchasUnicas = React.useMemo(() => {
    const canchas = new Map<string, string>()
    reservas.forEach((r) => canchas.set(r.venueId, r.venueNombre))
    return Array.from(canchas.entries()).map(([id, nombre]) => ({ id, nombre }))
  }, [reservas])

  // Reservas filtradas
  const reservasFiltradas = React.useMemo(() => {
    let filtered = [...reservas]

    // Filtro por cancha
    if (filtroCancha !== 'todas') {
      filtered = filtered.filter((r) => r.venueId === filtroCancha)
    }

    // Filtro por estado
    if (filtroEstado !== 'todas') {
      if (filtroEstado === 'pendientes') {
        filtered = filtered.filter((r) => r.status === 'confirmed' && !r.llegada)
      } else if (filtroEstado === 'en_curso') {
        filtered = filtered.filter((r) => r.status === 'in_progress')
      } else if (filtroEstado === 'completadas') {
        filtered = filtered.filter((r) => r.status === 'completed')
      } else if (filtroEstado === 'no_show') {
        filtered = filtered.filter((r) => r.llegada?.status === 'no_show')
      }
    }

    // Filtro por saldo pendiente
    if (mostrarSoloSaldoPendiente) {
      filtered = filtered.filter((r) => r.saldoPendiente > 0)
    }

    // Ordenar por hora de inicio
    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [reservas, filtroCancha, filtroEstado, mostrarSoloSaldoPendiente])

  // Handlers
  const handleMarcarLlegada = (reserva: ReservaConLlegada) => {
    setSelectedReserva(reserva)
    setShowLlegadaModal(true)
  }

  const handleNoShow = (reserva: ReservaConLlegada) => {
    setSelectedReserva(reserva)
    setShowNoShowModal(true)
  }

  const handleRegistrarSaldo = (reserva: ReservaConLlegada) => {
    setSelectedReserva(reserva)
    setShowSaldoModal(true)
  }

  const handleCompletar = async (reserva: ReservaConLlegada) => {
    setIsLoading(true)
    // Simular actualización
    await new Promise((resolve) => setTimeout(resolve, 500))
    setReservas((prev) =>
      prev.map((r) => (r.id === reserva.id ? { ...r, status: 'completed' as const } : r))
    )
    setIsLoading(false)
  }

  const handleCancelar = async (reserva: ReservaConLlegada) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setReservas((prev) =>
      prev.map((r) => (r.id === reserva.id ? { ...r, status: 'cancelled' as const } : r))
    )
    setIsLoading(false)
  }

  const handleConfirmLlegada = async (
    reservaId: string,
    metodoValidacion: 'qr' | 'manual',
    aplicoPenalidad: boolean
  ) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const ahora = new Date()
    const horaLlegada = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`

    // Calcular retraso
    const [startH, startM] = reservas
      .find((r) => r.id === reservaId)
      ?.startTime.split(':')
      .map(Number) || [0, 0]
    const [llegadaH, llegadaM] = horaLlegada.split(':').map(Number)
    const inicioMinutos = startH * 60 + startM
    const llegadaMinutos = llegadaH * 60 + llegadaM
    const minutosRetraso = Math.max(0, llegadaMinutos - inicioMinutos)
    const tolerancia = reservas.find((r) => r.id === reservaId)?.toleranciaConfig.minutos || 15

    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaId
          ? {
              ...r,
              status: 'in_progress' as const,
              llegada: {
                horaLlegada,
                minutosRetraso,
                dentroDeTolerancia: minutosRetraso <= tolerancia,
                status: minutosRetraso <= tolerancia ? ('a_tiempo' as const) : ('tarde' as const),
                metodoValidacion,
                aplicoPenalidad,
              },
            }
          : r
      )
    )
    setIsLoading(false)
  }

  const handleConfirmNoShow = async (
    reservaId: string,
    razon: string,
    reembolsarAdelanto: boolean
  ) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaId
          ? {
              ...r,
              status: 'cancelled' as const,
              llegada: {
                horaLlegada: undefined,
                minutosRetraso: 0,
                dentroDeTolerancia: false,
                status: 'no_show' as const,
                metodoValidacion: 'manual' as const,
                aplicoPenalidad: false,
              },
            }
          : r
      )
    )
    setIsLoading(false)
  }

  const handleConfirmSaldo = async (
    reservaId: string,
    monto: number,
    metodoPago: ManualPaymentMethod
  ) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaId
          ? {
              ...r,
              saldoPendiente: 0,
              adelantoPagado: r.totalPrice,
              estadoPago: 'completed' as const,
              pagos: [
                ...r.pagos,
                {
                  id: `pago-${Date.now()}`,
                  tipoPago: 'saldo' as const,
                  monto,
                  metodoPago,
                  fecha: new Date().toISOString(),
                },
              ],
            }
          : r
      )
    )
    setIsLoading(false)
  }

  const handleQRScan = (reservaId: string) => {
    // En producción, buscar la reserva por código QR
    const reserva = reservas.find((r) => r.id === reservaId || r.id.includes(reservaId))
    if (reserva) {
      setSelectedReserva(reserva)
      setShowQRModal(false)
      setShowLlegadaModal(true)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setReservas(reservasHoyMock)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reservas del Día</h1>
          <p className="text-muted-foreground">
            {formatDate(new Date().toISOString())} - Gestiona las llegadas y pagos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowQRModal(true)}>
            <QrCode className="mr-2 h-4 w-4" />
            Escanear QR
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Total Hoy" value={resumen.total} icon={Calendar} color="bg-blue-500" />
        <KPICard
          title="Pendientes"
          value={resumen.pendientesLlegada}
          subtitle="Esperando llegada"
          icon={Clock}
          color="bg-yellow-500"
        />
        <KPICard title="En Curso" value={resumen.enCurso} icon={Users} color="bg-blue-500" />
        <KPICard
          title="Completadas"
          value={resumen.completadas}
          icon={DollarSign}
          color="bg-green-500"
        />
        <KPICard
          title="Saldo Pendiente"
          value={formatCurrency(resumen.saldoPendienteTotal)}
          subtitle="Por cobrar"
          icon={AlertTriangle}
          color="bg-orange-500"
        />
      </div>

      {/* Filtros */}
      <div className="border-border bg-background flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        <div className="flex flex-1 flex-wrap gap-3">
          {/* Filtro por cancha */}
          <select
            value={filtroCancha}
            onChange={(e) => setFiltroCancha(e.target.value)}
            className="border-border bg-background rounded-lg border px-3 py-2 text-sm"
          >
            <option value="todas">Todas las canchas</option>
            {canchasUnicas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          {/* Filtro por estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
            className="border-border bg-background rounded-lg border px-3 py-2 text-sm"
          >
            <option value="todas">Todos los estados</option>
            <option value="pendientes">Pendientes de llegada</option>
            <option value="en_curso">En curso</option>
            <option value="completadas">Completadas</option>
            <option value="no_show">No se presentaron</option>
          </select>

          {/* Filtro saldo pendiente */}
          <label className="border-border hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={mostrarSoloSaldoPendiente}
              onChange={(e) => setMostrarSoloSaldoPendiente(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Con saldo pendiente</span>
          </label>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="space-y-4">
        {reservasFiltradas.length === 0 ? (
          <div className="border-border bg-muted/30 rounded-xl border border-dashed p-12 text-center">
            <Calendar className="text-muted-foreground/50 mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">No hay reservas</h3>
            <p className="text-muted-foreground">
              No se encontraron reservas con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {reservasFiltradas.map((reserva) => (
              <ReservaDiaCard
                key={reserva.id}
                reserva={reserva}
                onMarcarLlegada={handleMarcarLlegada}
                onNoShow={handleNoShow}
                onRegistrarSaldo={handleRegistrarSaldo}
                onCompletar={handleCompletar}
                onCancelar={handleCancelar}
                onEscanearQR={() => setShowQRModal(true)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <MarcarLlegadaModal
        open={showLlegadaModal}
        onOpenChange={setShowLlegadaModal}
        reserva={selectedReserva}
        onConfirm={handleConfirmLlegada}
      />

      <NoShowModal
        open={showNoShowModal}
        onOpenChange={setShowNoShowModal}
        reserva={selectedReserva}
        onConfirm={handleConfirmNoShow}
      />

      <RegistrarSaldoModal
        open={showSaldoModal}
        onOpenChange={setShowSaldoModal}
        reserva={selectedReserva}
        onConfirm={handleConfirmSaldo}
      />

      <QRScannerModal
        open={showQRModal}
        onOpenChange={setShowQRModal}
        onScanSuccess={handleQRScan}
      />
    </div>
  )
}
