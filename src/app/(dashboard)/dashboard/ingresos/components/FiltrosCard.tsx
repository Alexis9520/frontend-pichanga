'use client'

import * as React from 'react'
import { Filter, X } from 'lucide-react'
import { Card, Button, Input, Select, Badge } from '@/components/ui'
import type { IngresosFilters, PeriodoAnalisis, MetodoPago } from '../types'

interface FiltrosCardProps {
  filters: IngresosFilters
  onFiltersChange: (filters: Partial<IngresosFilters>) => void
  onClearFilters: () => void
}

const PERIODOS: { value: PeriodoAnalisis; label: string }[] = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mes' },
  { value: 'trimestre', label: 'Este trimestre' },
  { value: 'anio', label: 'Este año' },
  { value: 'custom', label: 'Personalizado' },
]

const METODOS_PAGO: { value: MetodoPago | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los métodos' },
  { value: 'culqi', label: '💳 Culqi (Online)' },
  { value: 'efectivo', label: '💵 Efectivo' },
  { value: 'tarjeta_local', label: '💳 Tarjeta (Local)' },
  { value: 'yape', label: '📱 Yape' },
  { value: 'plin', label: '📱 Plin' },
]

export function FiltrosCard({ filters, onFiltersChange, onClearFilters }: FiltrosCardProps) {
  const [showFilters, setShowFilters] = React.useState(false)

  const hasActiveFilters = filters.metodoPago !== 'all' || filters.periodo === 'custom'

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3">
        {/* Fila principal */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Período */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Período:</span>
            <Select
              options={PERIODOS}
              value={filters.periodo}
              onChange={(e) => onFiltersChange({ periodo: e.target.value as PeriodoAnalisis })}
              selectSize="sm"
              className="w-40"
            />
          </div>

          {/* Filtros personalizados */}
          {filters.periodo === 'custom' && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.fechaDesde || ''}
                onChange={(e) => onFiltersChange({ fechaDesde: e.target.value })}
                className="w-36"
                placeholder="Desde"
              />
              <span className="text-muted-foreground">a</span>
              <Input
                type="date"
                value={filters.fechaHasta || ''}
                onChange={(e) => onFiltersChange({ fechaHasta: e.target.value })}
                className="w-36"
                placeholder="Hasta"
              />
            </div>
          )}

          {/* Método de pago */}
          <Select
            options={METODOS_PAGO}
            value={filters.metodoPago}
            onChange={(e) =>
              onFiltersChange({ metodoPago: e.target.value as typeof filters.metodoPago })
            }
            selectSize="sm"
            className="w-44"
          />

          {/* Toggle filtros avanzados */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            Más filtros
          </Button>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Filtros avanzados */}
        {showFilters && (
          <div className="border-border flex flex-wrap gap-2 border-t pt-3">
            <Badge variant="outline" className="text-xs">
              Filtros adicionales disponibles próximamente
            </Badge>
          </div>
        )}
      </div>
    </Card>
  )
}
