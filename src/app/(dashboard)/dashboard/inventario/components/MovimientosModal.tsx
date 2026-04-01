'use client'

import * as React from 'react'
import { History, ArrowUp, ArrowDown, ShoppingCart, RefreshCw, Package } from 'lucide-react'
import { Dialog, DialogContent, Badge, Card } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Producto, MovimientoInventario, TipoMovimiento } from '../types'

const TIPO_CONFIG: Record<
  TipoMovimiento,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  entrada: {
    label: 'Entrada',
    icon: <ArrowUp className="h-4 w-4" />,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  salida: {
    label: 'Salida',
    icon: <ArrowDown className="h-4 w-4" />,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  venta: {
    label: 'Venta',
    icon: <ShoppingCart className="h-4 w-4" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  ajuste: {
    label: 'Ajuste',
    icon: <RefreshCw className="h-4 w-4" />,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
}

interface MovimientosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  movimientos: MovimientoInventario[]
}

export function MovimientosModal({
  open,
  onOpenChange,
  producto,
  movimientos,
}: MovimientosModalProps) {
  // Filtrar movimientos del producto
  const movimientosProducto = React.useMemo(() => {
    if (!producto) return []
    return movimientos.filter((m) => m.productoId === producto.id).slice(0, 50) // Limitar a 50
  }, [producto, movimientos])

  // Agrupar por fecha
  const movimientosPorFecha = React.useMemo(() => {
    const grupos: Record<string, MovimientoInventario[]> = {}
    movimientosProducto.forEach((m) => {
      const fecha = m.createdAt.split('T')[0]
      if (!grupos[fecha]) grupos[fecha] = []
      grupos[fecha].push(m)
    })
    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]))
  }, [movimientosProducto])

  if (!producto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[95vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <History className="text-primary h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Historial de Movimientos</h2>
              <p className="text-muted-foreground text-sm">
                {producto.nombre} - {movimientosProducto.length} movimientos
              </p>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-muted-foreground text-xs">Stock actual</p>
            <p className="text-xl font-bold">{producto.stockActual ?? '-'}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-muted-foreground text-xs">Stock mínimo</p>
            <p className="text-xl font-bold">{producto.stockMinimo ?? '-'}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-muted-foreground text-xs">Total vendidos</p>
            <p className="text-xl font-bold">{producto.totalVendidos}</p>
          </Card>
        </div>

        {/* Lista de movimientos */}
        {movimientosProducto.length === 0 ? (
          <div className="border-border rounded-xl border-2 border-dashed p-8 text-center">
            <Package className="text-muted-foreground mx-auto h-10 w-10" />
            <h3 className="mt-3 font-semibold">No hay movimientos</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Este producto no tiene historial de movimientos
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {movimientosPorFecha.map(([fecha, movimientosFecha]) => (
              <div key={fecha}>
                <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                  {formatDate(fecha)}
                </h3>
                <div className="space-y-2">
                  {movimientosFecha.map((movimiento) => {
                    const config = TIPO_CONFIG[movimiento.tipo]
                    const diff = movimiento.stockNuevo - movimiento.stockAnterior
                    const diffDisplay = diff > 0 ? `+${diff}` : `${diff}`

                    return (
                      <Card
                        key={movimiento.id}
                        className={cn('flex items-center gap-3 p-3', config.bg)}
                      >
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg')}>
                          {config.icon}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn('font-medium', config.color)}>{config.label}</span>
                            <span className="text-muted-foreground text-sm">
                              de {movimiento.stockAnterior} → {movimiento.stockNuevo}
                            </span>
                          </div>
                          {movimiento.observaciones && (
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {movimiento.observaciones}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <Badge variant="outline" size="sm">
                            {diffDisplay}
                          </Badge>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {new Date(movimiento.createdAt).toLocaleTimeString('es-PE', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-border mt-6 flex justify-end border-t pt-4">
          <Badge variant="outline">Última actualización: {formatDate(producto.updatedAt)}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  )
}
