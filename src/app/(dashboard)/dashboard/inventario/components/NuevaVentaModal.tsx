'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, Button, Input, Label, Select } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Producto, MetodoPago } from '../types'

const schema = z.object({
  productos: z
    .array(
      z.object({
        productoId: z.string(),
        cantidad: z.number().min(1),
      })
    )
    .min(1, 'Agrega al menos un producto'),
  clienteNombre: z.string().optional(),
  clienteTelefono: z.string().optional(),
  metodoPago: z.enum(['efectivo', 'tarjeta', 'yape', 'plin']),
})

interface NuevaVentaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productos: Producto[]
  onSubmit: (data: {
    productos: { productoId: string; cantidad: number }[]
    clienteNombre?: string
    clienteTelefono?: string
    metodoPago: MetodoPago
  }) => Promise<void>
}

const METODOS_PAGO = [
  { value: 'efectivo', label: '💵 Efectivo' },
  { value: 'tarjeta', label: '💳 Tarjeta' },
  { value: 'yape', label: '📱 Yape' },
  { value: 'plin', label: '📱 Plin' },
]

export function NuevaVentaModal({ open, onOpenChange, productos, onSubmit }: NuevaVentaModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [seleccionados, setSeleccionados] = React.useState<Map<string, number>>(new Map())

  // Productos activos
  const productosActivos = productos.filter((p) => p.activo)

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      setSeleccionados(new Map())
    }
  }, [open])

  // Calcular total
  const total = Array.from(seleccionados.entries()).reduce((acc, [id, cantidad]) => {
    const producto = productos.find((p) => p.id === id)
    return acc + (producto?.precio || 0) * cantidad
  }, 0)

  const toggleProducto = (productoId: string) => {
    const newMap = new Map(seleccionados)
    if (newMap.has(productoId)) {
      newMap.delete(productoId)
    } else {
      newMap.set(productoId, 1)
    }
    setSeleccionados(newMap)
  }

  const updateCantidad = (productoId: string, cantidad: number) => {
    if (cantidad < 1) return
    const newMap = new Map(seleccionados)
    newMap.set(productoId, cantidad)
    setSeleccionados(newMap)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (seleccionados.size === 0) return

    const formData = new FormData(e.target as HTMLFormElement)
    const metodoPago = formData.get('metodoPago') as MetodoPago
    const clienteNombre = formData.get('clienteNombre') as string
    const clienteTelefono = formData.get('clienteTelefono') as string

    setIsSubmitting(true)
    try {
      await onSubmit({
        productos: Array.from(seleccionados.entries()).map(([productoId, cantidad]) => ({
          productoId,
          cantidad,
        })),
        clienteNombre: clienteNombre || undefined,
        clienteTelefono: clienteTelefono || undefined,
        metodoPago,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Agrupar por categoría
  const porCategoria = React.useMemo(() => {
    const grupos: Record<string, Producto[]> = {}
    productosActivos.forEach((p) => {
      if (!grupos[p.categoria]) grupos[p.categoria] = []
      grupos[p.categoria].push(p)
    })
    return grupos
  }, [productosActivos])

  const categoriaLabels: Record<string, string> = {
    bebida: '🍺 Bebidas',
    snack: '🍿 Snacks',
    deportivo: '⚽ Deportivo',
    alquiler: '📋 Alquiler',
    servicio: '🛠️ Servicios',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[95vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Nueva Venta</h2>
          <p className="text-muted-foreground text-sm">
            Selecciona los productos y registra el pago
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Productos por categoría */}
          <div className="space-y-4">
            {Object.entries(porCategoria).map(([categoria, prods]) => (
              <div key={categoria}>
                <h3 className="text-muted-foreground mb-2 font-medium">
                  {categoriaLabels[categoria] || categoria}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {prods.map((producto) => {
                    const isSelected = seleccionados.has(producto.id)
                    const cantidad = seleccionados.get(producto.id) || 0
                    const isLowStock =
                      producto.controlStock &&
                      producto.stockActual !== undefined &&
                      producto.stockMinimo !== undefined &&
                      producto.stockActual < producto.stockMinimo

                    return (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => toggleProducto(producto.id)}
                        className={cn(
                          'rounded-lg border p-3 text-left transition-all',
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50',
                          isLowStock && 'border-warning/50'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="line-clamp-1 text-sm font-medium">{producto.nombre}</p>
                            <p className="text-primary font-bold">
                              {formatCurrency(producto.precio)}
                            </p>
                            {producto.controlStock && producto.stockActual !== undefined && (
                              <p
                                className={cn(
                                  'text-xs',
                                  isLowStock ? 'text-warning' : 'text-muted-foreground'
                                )}
                              >
                                Stock: {producto.stockActual}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Selector de cantidad */}
                        {isSelected && (
                          <div
                            className="mt-2 flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => updateCantidad(producto.id, cantidad - 1)}
                              className="bg-muted hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold">{cantidad}</span>
                            <button
                              type="button"
                              onClick={() => updateCantidad(producto.id, cantidad + 1)}
                              className="bg-muted hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Productos seleccionados */}
          {seleccionados.size > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="mb-2 font-medium">Resumen</h3>
              <div className="space-y-1">
                {Array.from(seleccionados.entries()).map(([id, cantidad]) => {
                  const producto = productos.find((p) => p.id === id)
                  if (!producto) return null
                  return (
                    <div key={id} className="flex items-center justify-between text-sm">
                      <span>
                        {cantidad}x {producto.nombre}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(cantidad * producto.precio)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="border-border mt-2 flex items-center justify-between border-t pt-2">
                <span className="font-bold">Total</span>
                <span className="text-primary text-xl font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Datos del cliente */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clienteNombre">Nombre del cliente (opcional)</Label>
              <Input id="clienteNombre" name="clienteNombre" placeholder="Juan Pérez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clienteTelefono">Teléfono (opcional)</Label>
              <Input id="clienteTelefono" name="clienteTelefono" placeholder="999888777" />
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label required>Método de pago</Label>
            <Select name="metodoPago" options={METODOS_PAGO} defaultValue="efectivo" />
          </div>

          {/* Footer */}
          <div className="border-border flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={seleccionados.size === 0}>
              Registrar venta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
