'use client'

import * as React from 'react'
import { Plus, Search, MapPin, X } from 'lucide-react'
import { Button, Input, Select, Card, CardContent } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import { useCanchas } from './hooks/useCanchas'
import {
  CanchaCard,
  CanchaFormModal,
  CanchaDetailModal,
  HorariosConfig,
  BloqueosModal,
} from './components'
import type { Cancha, CanchaFormData, HorarioDia } from './types'

export default function CanchasPage() {
  // Hook principal
  const {
    canchas,
    filters,
    loading,
    stats,
    crearCancha,
    actualizarCancha,
    toggleEstado,
    horarios,
    actualizarHorario,
    bloqueos,
    crearBloqueo,
    eliminarBloqueo,
    setFilters,
  } = useCanchas()

  // Estados de modales
  const [formModalOpen, setFormModalOpen] = React.useState(false)
  const [detailModalOpen, setDetailModalOpen] = React.useState(false)
  const [horariosModalOpen, setHorariosModalOpen] = React.useState(false)
  const [bloqueosModalOpen, setBloqueosModalOpen] = React.useState(false)
  const [selectedCancha, setSelectedCancha] = React.useState<Cancha | null>(null)

  // Handlers
  const handleCreateCancha = async (data: CanchaFormData) => {
    await crearCancha(data)
  }

  const handleEditCancha = async (data: CanchaFormData) => {
    if (selectedCancha) {
      await actualizarCancha(selectedCancha.id, data)
    }
  }

  const handleViewDetails = (cancha: Cancha) => {
    setSelectedCancha(cancha)
    setDetailModalOpen(true)
  }

  const handleEdit = (cancha: Cancha) => {
    setSelectedCancha(cancha)
    setFormModalOpen(true)
  }

  const handleManageHorarios = (cancha: Cancha) => {
    setSelectedCancha(cancha)
    setHorariosModalOpen(true)
  }

  const handleManageBloqueos = (cancha: Cancha) => {
    setSelectedCancha(cancha)
    setBloqueosModalOpen(true)
  }

  const handleSaveHorarios = async (nuevosHorarios: HorarioDia[]) => {
    if (selectedCancha) {
      await actualizarHorario(selectedCancha.id, nuevosHorarios)
      setHorariosModalOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Mis Canchas</h1>
          <p className="text-muted-foreground">Gestiona las canchas de tu complejo</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCancha(null)
            setFormModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva cancha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total canchas"
          value={stats.total.toString()}
          subtitle={`${stats.activas} activas`}
          variant="primary"
        />
        <StatsCard
          title="Reservas hoy"
          value={stats.reservasHoy.toString()}
          subtitle="En todas las canchas"
          variant="success"
        />
        <StatsCard
          title="Ingresos del mes"
          value={formatCurrency(stats.ingresosMes)}
          subtitle="Total estimado"
          variant="warning"
        />
        <StatsCard
          title="Ocupación promedio"
          value={`${stats.ocupacionPromedio}%`}
          subtitle="Del mes actual"
          variant="info"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o dirección..."
                leftIcon={<Search className="h-4 w-4" />}
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'activa', label: 'Activas' },
                  { value: 'inactiva', label: 'Inactivas' },
                ]}
                value={filters.estado}
                onChange={(e) => setFilters({ estado: e.target.value as typeof filters.estado })}
                placeholder="Estado"
              />
              <Select
                options={[
                  { value: 'all', label: 'Todos los tipos' },
                  { value: 'f5', label: 'Fútbol 5' },
                  { value: 'f7', label: 'Fútbol 7' },
                  { value: 'fulbito', label: 'Fulbito' },
                ]}
                value={filters.tipoDeporte}
                onChange={(e) =>
                  setFilters({ tipoDeporte: e.target.value as typeof filters.tipoDeporte })
                }
                placeholder="Tipo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de canchas */}
      {canchas.length === 0 ? (
        <div className="border-border rounded-xl border-2 border-dashed p-12 text-center">
          <MapPin className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">No hay canchas</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {filters.search || filters.estado !== 'all' || filters.tipoDeporte !== 'all'
              ? 'No se encontraron canchas con los filtros seleccionados'
              : 'Crea tu primera cancha para comenzar'}
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setSelectedCancha(null)
              setFormModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva cancha
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2">
          {canchas.map((cancha) => (
            <CanchaCard
              key={cancha.id}
              cancha={cancha}
              onEdit={handleEdit}
              onToggleEstado={toggleEstado}
              onViewDetails={handleViewDetails}
              onManageHorarios={handleManageHorarios}
              onManageBloqueos={handleManageBloqueos}
            />
          ))}

          {/* Card para agregar nueva cancha */}
          <button
            onClick={() => {
              setSelectedCancha(null)
              setFormModalOpen(true)
            }}
            className="group border-border hover:border-primary hover:bg-primary/5 flex min-h-[220px] items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 transition-all sm:min-h-[240px]"
          >
            <div className="bg-muted group-hover:bg-primary/10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors">
              <Plus className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-colors" />
            </div>
            <div className="text-left">
              <p className="font-medium">Agregar nueva cancha</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Configura una nueva cancha en tu complejo
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Modales */}
      <CanchaFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        cancha={selectedCancha}
        onSubmit={selectedCancha ? handleEditCancha : handleCreateCancha}
      />

      <CanchaDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        cancha={selectedCancha}
        bloqueos={bloqueos}
        onEdit={() => {
          setDetailModalOpen(false)
          setFormModalOpen(true)
        }}
        onManageHorarios={() => {
          setDetailModalOpen(false)
          setHorariosModalOpen(true)
        }}
        onManageBloqueos={() => {
          setDetailModalOpen(false)
          setBloqueosModalOpen(true)
        }}
      />

      {/* Modal de horarios */}
      {selectedCancha && horariosModalOpen && (
        <>
          {/* Backdrop con blur - z-index alto para cubrir sidebar */}
          <div
            className="bg-background/60 fixed inset-0 z-[60] backdrop-blur-md transition-all duration-300"
            onClick={() => setHorariosModalOpen(false)}
          />
          {/* Modal content */}
          <Card className="fixed inset-4 z-[70] m-auto max-h-[90vh] max-w-2xl overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setHorariosModalOpen(false)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 z-[80] rounded-lg p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <CardContent className="p-6">
              <HorariosConfig
                canchaId={selectedCancha.id}
                horarios={horarios.filter((h) => h.canchaId === selectedCancha.id)}
                onSave={handleSaveHorarios}
                onCancel={() => setHorariosModalOpen(false)}
              />
            </CardContent>
          </Card>
        </>
      )}

      <BloqueosModal
        open={bloqueosModalOpen}
        onOpenChange={setBloqueosModalOpen}
        cancha={selectedCancha}
        bloqueos={bloqueos}
        onCreate={crearBloqueo}
        onDelete={eliminarBloqueo}
      />
    </div>
  )
}

// ===========================================
// COMPONENTE: Card de estadísticas
// ===========================================
interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  variant: 'primary' | 'success' | 'warning' | 'info'
}

function StatsCard({ title, value, subtitle, variant }: StatsCardProps) {
  const variantStyles = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  }

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {title}
        </p>
        <p className={cn('mt-1 text-2xl font-bold', variantStyles[variant])}>{value}</p>
        <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
