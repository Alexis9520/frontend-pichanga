'use client'

import * as React from 'react'
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Button, Input, Select, Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ReservaFilters as ReservaFiltersType, CanchaConfig } from '../types'

interface ReservaFiltersProps {
  filters: ReservaFiltersType
  onFiltersChange: (filters: ReservaFiltersType) => void
  canchas: CanchaConfig[]
}

export function ReservaFilters({ filters, onFiltersChange, canchas }: ReservaFiltersProps) {
  const [showMoreFilters, setShowMoreFilters] = React.useState(false)

  const handleFilterChange = (key: keyof ReservaFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      fechaDesde: '',
      fechaHasta: '',
      canchaId: 'all',
      estado: 'all',
      estadoPago: 'all',
      source: 'all',
      metodoPago: 'all',
    })
    setShowMoreFilters(false)
  }

  const hasActiveFilters =
    filters.search ||
    filters.fechaDesde ||
    filters.fechaHasta ||
    filters.canchaId !== 'all' ||
    filters.estado !== 'all' ||
    filters.estadoPago !== 'all' ||
    filters.source !== 'all' ||
    filters.metodoPago !== 'all'

  // Contador de filtros activos en "Más filtros"
  const moreFiltersCount =
    (filters.fechaDesde ? 1 : 0) +
    (filters.fechaHasta ? 1 : 0) +
    (filters.estadoPago !== 'all' ? 1 : 0) +
    (filters.source !== 'all' ? 1 : 0) +
    (filters.metodoPago !== 'all' ? 1 : 0)

  return (
    <Card>
      <CardContent className="p-4">
        {/* Fila principal: búsqueda + 3 filtros */}
        <div className="flex items-center justify-between gap-4">
          {/* Búsqueda - izquierda */}
          <div className="flex-shrink-0" style={{ minWidth: '220px' }}>
            <Input
              placeholder="Buscar por nombre o teléfono..."
              leftIcon={<Search className="h-4 w-4" />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Filtros principales - derecha */}
          <div className="flex items-center gap-2">
            {/* Cancha */}
            <Select
              options={[
                { value: 'all', label: 'Todas las canchas' },
                ...canchas.map((c) => ({ value: c.id, label: c.nombre })),
              ]}
              value={filters.canchaId}
              onChange={(e) => handleFilterChange('canchaId', e.target.value)}
              placeholder="Cancha"
            />

            {/* Estado */}
            <Select
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending_payment', label: 'Pendiente pago' },
                { value: 'confirmed', label: 'Confirmada' },
                { value: 'in_progress', label: 'En curso' },
                { value: 'completed', label: 'Completada' },
                { value: 'cancelled', label: 'Cancelada' },
              ]}
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              placeholder="Estado"
            />

            {/* Fecha */}
            <Select
              options={[
                { value: 'all', label: 'Todas las fechas' },
                { value: 'today', label: 'Hoy' },
                { value: 'tomorrow', label: 'Mañana' },
                { value: 'this_week', label: 'Esta semana' },
                { value: 'this_month', label: 'Este mes' },
              ]}
              value={filters.fechaDesde || 'all'}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'all') {
                  handleFilterChange('fechaDesde', '')
                  handleFilterChange('fechaHasta', '')
                } else {
                  handleFilterChange('fechaDesde', value)
                }
              }}
              placeholder="Fecha"
            />

            {/* Botón más filtros */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={cn(showMoreFilters && 'border-primary bg-primary/5')}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {moreFiltersCount > 0 && (
                <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                  {moreFiltersCount}
                </span>
              )}
              {showMoreFilters ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>

            {/* Limpiar */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filtros adicionales (expandidos) */}
        {showMoreFilters && (
          <div className="mt-4 flex items-center gap-3 border-t pt-4">
            {/* Desde */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Desde</span>
              <Input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                className="w-[140px]"
              />
            </div>

            {/* Hasta */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Hasta</span>
              <Input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                className="w-[140px]"
              />
            </div>

            {/* Estado de pago */}
            <Select
              options={[
                { value: 'all', label: 'Todos los pagos' },
                { value: 'pending', label: 'Sin pago' },
                { value: 'partial', label: 'Parcial' },
                { value: 'completed', label: 'Pagado' },
                { value: 'refunded', label: 'Reembolsado' },
              ]}
              value={filters.estadoPago}
              onChange={(e) => handleFilterChange('estadoPago', e.target.value)}
              placeholder="Estado pago"
            />

            {/* Origen */}
            <Select
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'app', label: 'App' },
                { value: 'manual', label: 'Manual' },
              ]}
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              placeholder="Origen"
            />

            {/* Método de pago */}
            <Select
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'culqi', label: 'Culqi' },
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'tarjeta_local', label: 'Tarjeta' },
                { value: 'yape', label: 'Yape' },
                { value: 'plin', label: 'Plin' },
              ]}
              value={filters.metodoPago}
              onChange={(e) => handleFilterChange('metodoPago', e.target.value)}
              placeholder="Método"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
