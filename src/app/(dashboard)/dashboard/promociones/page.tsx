'use client'

import * as React from 'react'
import { Plus, Search, TicketPercent } from 'lucide-react'
import { Button, Input, Select, Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import { usePromociones } from './hooks/usePromociones'
import {
  PromocionCard,
  PromocionFormModal,
  SugerenciasImpactoPanel,
  HeroImpactoPromociones,
} from './components'
import type { Promocion, PromocionFormData, SugerenciaBajaDemanda } from './types'
import { mockCanchasPromo } from './mock-data'

export default function PromocionesPage() {
  // Hook principal
  const {
    promociones,
    filters,
    stats,
    crearPromocion,
    actualizarPromocion,
    eliminarPromocion,
    toggleActiva,
    duplicarPromocion,
    sugerencias,
    descartarSugerencia,
    crearPromocionDesdeSugerencia,
    setFilters,
  } = usePromociones()

  // Estados de modales
  const [formModalOpen, setFormModalOpen] = React.useState(false)
  const [selectedPromocion, setSelectedPromocion] = React.useState<Promocion | null>(null)

  // Handlers
  const handleCreatePromocion = async (data: PromocionFormData) => {
    await crearPromocion(data)
  }

  const handleEditPromocion = async (data: PromocionFormData) => {
    if (selectedPromocion) {
      await actualizarPromocion(selectedPromocion.id, data)
    }
  }

  const handleEdit = (promocion: Promocion) => {
    setSelectedPromocion(promocion)
    setFormModalOpen(true)
  }

  const handleDuplicate = async (promocion: Promocion) => {
    await duplicarPromocion(promocion.id)
  }

  const handleDelete = async (promocion: Promocion) => {
    if (confirm('¿Estás seguro de eliminar esta promoción?')) {
      await eliminarPromocion(promocion.id)
    }
  }

  const handleViewDetails = (promocion: Promocion) => {
    // TODO: Abrir modal de detalle
    console.log('Ver detalle:', promocion)
  }

  const handleToggleActiva = async (promocion: Promocion) => {
    await toggleActiva(promocion.id)
  }

  const handleCrearDesdeSugerencia = async (sugerencia: SugerenciaBajaDemanda) => {
    await crearPromocionDesdeSugerencia(sugerencia)
  }

  // Calcular porcentaje de ingresos por promociones (mock)
  const porcentajeIngresosPromociones = Math.round(
    (stats.ingresosGenerados / (stats.ingresosGenerados * 2.5)) * 100
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Promociones</h1>
          <p className="text-muted-foreground">Crea y gestiona ofertas para tus canchas</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPromocion(null)
            setFormModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva promoción
        </Button>
      </div>

      {/* Hero de impacto */}
      <HeroImpactoPromociones
        activas={stats.activas}
        total={stats.total}
        usosSemana={stats.usosSemana}
        usosMes={stats.usosMes}
        comparativaUsos={15} // Mock: +15% vs semana anterior
        ahorroClientes={stats.ahorroClientes}
        ingresosGenerados={stats.ingresosGenerados}
        porcentajeIngresosPromociones={porcentajeIngresosPromociones}
      />

      {/* Sugerencias inteligentes */}
      {sugerencias.length > 0 && (
        <SugerenciasImpactoPanel
          sugerencias={sugerencias}
          onCrearPromocion={handleCrearDesdeSugerencia}
          onDescartar={descartarSugerencia}
        />
      )}

      {/* Filtros simplificados */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Búsqueda */}
            <div className="min-w-[200px] flex-1">
              <Input
                placeholder="Buscar promoción..."
                leftIcon={<Search className="h-4 w-4" />}
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>

            {/* Estado */}
            <Select
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'activa', label: 'Activas' },
                { value: 'inactiva', label: 'Inactivas' },
                { value: 'agotada', label: 'Agotadas' },
                { value: 'vencida', label: 'Vencidas' },
              ]}
              value={filters.estado}
              onChange={(e) => setFilters({ estado: e.target.value as typeof filters.estado })}
              placeholder="Estado"
            />

            {/* Tipo */}
            <Select
              options={[
                { value: 'all', label: 'Todos los tipos' },
                { value: 'descuento_porcentual', label: '% Descuento' },
                { value: 'precio_fijo', label: 'Precio Fijo' },
                { value: 'combo_horas', label: 'Combo Horas' },
                { value: 'combo_productos', label: 'Combo Productos' },
                { value: 'recurrencia', label: 'Recurrencia' },
              ]}
              value={filters.tipo}
              onChange={(e) => setFilters({ tipo: e.target.value as typeof filters.tipo })}
              placeholder="Tipo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de promociones */}
      {promociones.length === 0 ? (
        <div className="border-border rounded-xl border-2 border-dashed p-12 text-center">
          <TicketPercent className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">No hay promociones</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {filters.search || filters.estado !== 'all' || filters.tipo !== 'all'
              ? 'No se encontraron promociones con los filtros seleccionados'
              : 'Crea tu primera promoción para aumentar tus reservas'}
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setSelectedPromocion(null)
              setFormModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva promoción
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promociones.map((promocion) => (
            <PromocionCard
              key={promocion.id}
              promocion={promocion}
              onEdit={() => handleEdit(promocion)}
              onDelete={() => handleDelete(promocion)}
              onDuplicate={() => handleDuplicate(promocion)}
              onViewDetails={() => handleViewDetails(promocion)}
              onToggleActiva={() => handleToggleActiva(promocion)}
            />
          ))}

          {/* Card de nueva promoción */}
          <button
            onClick={() => {
              setSelectedPromocion(null)
              setFormModalOpen(true)
            }}
            className="border-border hover:border-primary/50 hover:bg-primary/5 group flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all"
          >
            <div className="bg-muted group-hover:bg-primary/10 flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
              <Plus className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-colors" />
            </div>
            <p className="mt-3 font-medium">Crear nueva promoción</p>
            <p className="text-muted-foreground mt-1 text-sm">Aumenta tus reservas con ofertas</p>
          </button>
        </div>
      )}

      {/* Modal de formulario */}
      <PromocionFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        promocion={selectedPromocion}
        onSubmit={selectedPromocion ? handleEditPromocion : handleCreatePromocion}
      />
    </div>
  )
}
