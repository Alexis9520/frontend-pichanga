'use client'

import * as React from 'react'
import { Download, LayoutDashboard, Calendar, ShoppingCart, MapPin } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useIngresos } from './hooks/useIngresos'
import { PERIODO_CONFIG } from './types'
import {
  FiltrosCard,
  ExportarModal,
  ResumenTab,
  ReservasTab,
  VentasExtrasTab,
  CanchasTab,
} from './components'

// Tabs principales
const TABS = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'reservas', label: 'Reservas', icon: Calendar },
  { id: 'ventas', label: 'Ventas Extras', icon: ShoppingCart },
  { id: 'canchas', label: 'Por Cancha', icon: MapPin },
]

export default function IngresosPage() {
  const {
    reservas,
    ventasExtras,
    filters,
    loading,
    stats,
    ingresosPorDia,
    ingresosPorCancha,
    ingresosPorHorario,
    ingresosPorMetodoPago,
    ingresosPorCategoria,
    tendenciaMensual,
    topProductos,
    topHorarios,
    topCanchas,
    setFilters,
    exportarReporte,
  } = useIngresos()

  // Estado de tabs y modal
  const [activeTab, setActiveTab] = React.useState<'resumen' | 'reservas' | 'ventas' | 'canchas'>(
    'resumen'
  )
  const [showExportModal, setShowExportModal] = React.useState(false)

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      periodo: 'mes',
      fechaDesde: undefined,
      fechaHasta: undefined,
      canchaId: undefined,
      tipoIngreso: 'all',
      metodoPago: 'all',
    })
  }

  // Período label
  const periodoLabel = PERIODO_CONFIG[filters.periodo]?.label || 'Período'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Ingresos</h1>
          <p className="text-muted-foreground">Reportes y estadísticas de tu negocio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowExportModal(true)}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosCard
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Stats resumen rápido */}
      <div className="bg-primary/5 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <LayoutDashboard className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{periodoLabel}</p>
              <p className="text-primary text-2xl font-bold">
                {stats.ingresosTotales.toLocaleString('es-PE', {
                  style: 'currency',
                  currency: 'PEN',
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-center">
            <div>
              <p className="text-lg font-bold">{stats.totalReservas}</p>
              <p className="text-muted-foreground text-xs">Reservas</p>
            </div>
            <div>
              <p className="text-lg font-bold">{stats.totalVentasExtras}</p>
              <p className="text-muted-foreground text-xs">Ventas</p>
            </div>
            <div>
              <p className="text-lg font-bold">{stats.reservasPartial}</p>
              <p className="text-muted-foreground text-xs">Con adelanto</p>
            </div>
            <div>
              <p className="text-lg font-bold">
                {stats.saldoPendienteTotal.toLocaleString('es-PE', {
                  style: 'currency',
                  currency: 'PEN',
                })}
              </p>
              <p className="text-muted-foreground text-xs">Pendiente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border flex gap-1 overflow-x-auto border-b">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 pt-2 pb-3 font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'text-primary border-primary -mb-[1px] border-b-2'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'reservas' && (
                <Badge variant="outline" size="sm">
                  {reservas.length}
                </Badge>
              )}
              {tab.id === 'ventas' && (
                <Badge variant="outline" size="sm">
                  {ventasExtras.length}
                </Badge>
              )}
              {tab.id === 'canchas' && (
                <Badge variant="outline" size="sm">
                  {ingresosPorCancha.length}
                </Badge>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'resumen' && (
        <ResumenTab
          stats={stats}
          ingresosPorDia={ingresosPorDia}
          tendenciaMensual={tendenciaMensual}
        />
      )}

      {activeTab === 'reservas' && (
        <ReservasTab
          reservas={reservas}
          ingresosPorHorario={ingresosPorHorario}
          ingresosPorMetodoPago={ingresosPorMetodoPago}
          topHorarios={topHorarios}
        />
      )}

      {activeTab === 'ventas' && (
        <VentasExtrasTab
          ventasExtras={ventasExtras}
          ingresosPorCategoria={ingresosPorCategoria}
          topProductos={topProductos}
          ingresosPorMetodoPago={ingresosPorMetodoPago}
        />
      )}

      {activeTab === 'canchas' && (
        <CanchasTab
          ingresosPorCancha={ingresosPorCancha}
          topCanchas={topCanchas}
          reservas={reservas}
        />
      )}

      {/* Modal de exportación */}
      <ExportarModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        onExport={exportarReporte}
        periodo={periodoLabel}
      />
    </div>
  )
}
