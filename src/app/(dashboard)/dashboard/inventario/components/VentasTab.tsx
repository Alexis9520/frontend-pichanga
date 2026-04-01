'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  DollarSign,
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp,
} from 'lucide-react'
import { Button, Input, Select, Badge, Card } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Venta, VentasFilters, MetodoPago } from '../types'

const METODOS_PAGO: { value: MetodoPago | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Todos', icon: '💳' },
  { value: 'efectivo', label: 'Efectivo', icon: '💵' },
  { value: 'tarjeta', label: 'Tarjeta', icon: '💳' },
  { value: 'yape', label: 'Yape', icon: '📱' },
  { value: 'plin', label: 'Plin', icon: '📱' },
]

const METODO_CONFIG: Record<MetodoPago, { label: string; icon: string; color: string }> = {
  efectivo: { label: 'Efectivo', icon: '💵', color: 'bg-green-500/20 text-green-500' },
  tarjeta: { label: 'Tarjeta', icon: '💳', color: 'bg-blue-500/20 text-blue-500' },
  yape: { label: 'Yape', icon: '📱', color: 'bg-purple-500/20 text-purple-500' },
  plin: { label: 'Plin', icon: '📱', color: 'bg-pink-500/20 text-pink-500' },
}

interface VentasTabProps {
  ventas: Venta[]
  filters: VentasFilters
  onFiltersChange: (filters: Partial<VentasFilters>) => void
  onNewVenta: () => void
}

export function VentasTab({ ventas, filters, onFiltersChange, onNewVenta }: VentasTabProps) {
  // Calcular totales del día
  const hoy = new Date().toISOString().split('T')[0]
  const ventasHoy = ventas.filter((v) => v.fecha === hoy)
  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0)

  // Agrupar por método de pago
  const porMetodo = METODOS_PAGO.slice(1).reduce(
    (acc, metodo) => {
      const total = ventasHoy
        .filter((v) => v.metodoPago === metodo.value)
        .reduce((sum, v) => sum + v.total, 0)
      return { ...acc, [metodo.value]: total }
    },
    {} as Record<MetodoPago, number>
  )

  return (
    <div className="space-y-4">
      {/* Stats del día */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-primary/5 p-4 sm:col-span-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <DollarSign className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ventas de hoy</p>
              <p className="text-primary text-2xl font-bold">{formatCurrency(totalHoy)}</p>
              <p className="text-muted-foreground text-xs">
                {ventasHoy.length} venta{ventasHoy.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>

        {METODOS_PAGO.slice(1).map((metodo) => (
          <Card key={metodo.value} className="p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{metodo.icon}</span>
              <div>
                <p className="text-muted-foreground text-xs">{metodo.label}</p>
                <p className="font-bold">
                  {formatCurrency(porMetodo[metodo.value as MetodoPago] || 0)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => onFiltersChange({ fechaDesde: e.target.value })}
              className="w-auto"
            />
            <span className="text-muted-foreground self-center">a</span>
            <Input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => onFiltersChange({ fechaHasta: e.target.value })}
              className="w-auto"
            />
          </div>

          <div className="flex gap-2">
            <Select
              options={METODOS_PAGO}
              value={filters.metodoPago}
              onChange={(e) =>
                onFiltersChange({ metodoPago: e.target.value as typeof filters.metodoPago })
              }
              placeholder="Método de pago"
            />
            <Button onClick={onNewVenta}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva venta
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de ventas */}
      {ventas.length === 0 ? (
        <div className="border-border rounded-xl border-2 border-dashed p-12 text-center">
          <TrendingUp className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">No hay ventas</h3>
          <p className="text-muted-foreground mt-1 text-sm">Registra tu primera venta del día</p>
          <Button className="mt-4" onClick={onNewVenta}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva venta
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {ventas.map((venta) => {
            const metodo = METODO_CONFIG[venta.metodoPago]
            return (
              <Card key={venta.id} className="p-4 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  {/* Info de la venta */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{metodo.icon}</span>
                      <span className="text-primary text-lg font-bold">
                        {formatCurrency(venta.total)}
                      </span>
                      <Badge className={cn('ml-2', metodo.color)} size="sm">
                        {metodo.label}
                      </Badge>
                    </div>

                    {/* Productos */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {venta.productos.map((p, i) => (
                        <Badge key={i} variant="outline" size="sm">
                          {p.cantidad}x {p.productoNombre}
                        </Badge>
                      ))}
                    </div>

                    {/* Cliente */}
                    {venta.clienteNombre && (
                      <p className="text-muted-foreground mt-2 text-sm">
                        Cliente: {venta.clienteNombre}
                        {venta.clienteTelefono && ` - ${venta.clienteTelefono}`}
                      </p>
                    )}

                    {/* Reserva asociada */}
                    {venta.reservaInfo && (
                      <p className="text-info mt-1 text-xs">📋 {venta.reservaInfo}</p>
                    )}
                  </div>

                  {/* Fecha y hora */}
                  <div className="text-muted-foreground text-right text-sm">
                    <p>{venta.fecha}</p>
                    <p>
                      {new Date(venta.createdAt).toLocaleTimeString('es-PE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
