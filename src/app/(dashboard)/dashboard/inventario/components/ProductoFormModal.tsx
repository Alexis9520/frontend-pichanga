'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, Button, Input, Label, Switch, Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Producto, ProductoFormData, CategoriaProducto } from '../types'

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  descripcion: z.string().max(500).optional(),
  categoria: z.enum(['bebida', 'snack', 'deportivo', 'alquiler', 'servicio']),
  precio: z.number().min(0.1, 'Precio requerido'),
  costo: z.number().min(0).optional(),
  controlStock: z.boolean(),
  stockActual: z.number().min(0).optional(),
  stockMinimo: z.number().min(0).optional(),
})

const CATEGORIAS: { value: CategoriaProducto; label: string; icon: string; desc: string }[] = [
  { value: 'bebida', label: 'Bebidas', icon: '🍺', desc: 'Agua, gaseosas, cerveza, jugos' },
  { value: 'snack', label: 'Snacks', icon: '🍿', desc: 'Papas, chocolates, maní' },
  { value: 'deportivo', label: 'Deportivo', icon: '⚽', desc: 'Balones, camisetas' },
  { value: 'alquiler', label: 'Alquiler', icon: '📋', desc: 'Balón, árbitro, camerinos' },
  { value: 'servicio', label: 'Servicios', icon: '🛠️', desc: 'Estacionamiento, quincho' },
]

interface ProductoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto?: Producto | null
  onSubmit: (data: ProductoFormData) => Promise<void>
}

export function ProductoFormModal({
  open,
  onOpenChange,
  producto,
  onSubmit,
}: ProductoFormModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [controlStock, setControlStock] = React.useState(producto?.controlStock ?? true)

  const isEditing = !!producto

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: producto
      ? {
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          categoria: producto.categoria,
          precio: producto.precio,
          costo: producto.costo || 0,
          controlStock: producto.controlStock,
          stockActual: producto.stockActual || 0,
          stockMinimo: producto.stockMinimo || 0,
        }
      : {
          nombre: '',
          descripcion: '',
          categoria: 'bebida',
          precio: 0,
          costo: 0,
          controlStock: true,
          stockActual: 0,
          stockMinimo: 0,
        },
  })

  React.useEffect(() => {
    if (!open) {
      reset()
      setControlStock(true)
    }
  }, [open, reset])

  React.useEffect(() => {
    setControlStock(watch('controlStock'))
  }, [watch('controlStock')])

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      await handleSubmit(async (data) => {
        await onSubmit(data)
        onOpenChange(false)
      })()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calcular margen
  const precio = watch('precio') || 0
  const costo = watch('costo') || 0
  const margen = precio > 0 ? ((precio - costo) / precio) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[95vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <p className="text-muted-foreground text-sm">
            {isEditing ? 'Modifica los datos del producto' : 'Agrega un nuevo producto al catálogo'}
          </p>
        </div>

        <form className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" required>
              Nombre del producto
            </Label>
            <Input
              id="nombre"
              placeholder="Ej: Gaseosa 500ml"
              error={errors.nombre?.message}
              {...register('nombre')}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el producto..."
              rows={2}
              {...register('descripcion')}
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label required>Categoría</Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setValue('categoria', cat.value)
                    // Por defecto, alquiler y servicio no tienen stock
                    if (cat.value === 'alquiler' || cat.value === 'servicio') {
                      setValue('controlStock', false)
                      setControlStock(false)
                    }
                  }}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-all',
                    watch('categoria') === cat.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Precios */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="precio" required>
                Precio de venta
              </Label>
              <Input
                id="precio"
                type="number"
                min={0}
                step={0.5}
                leftIcon={<span className="text-muted-foreground">S/</span>}
                {...register('precio', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo">Costo (opcional)</Label>
              <Input
                id="costo"
                type="number"
                min={0}
                step={0.5}
                leftIcon={<span className="text-muted-foreground">S/</span>}
                {...register('costo', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Margen calculado */}
          {precio > 0 && costo > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <span className="text-muted-foreground text-sm">Margen de ganancia: </span>
              <span
                className={cn(
                  'font-bold',
                  margen >= 30 ? 'text-success' : margen >= 15 ? 'text-warning' : 'text-destructive'
                )}
              >
                {margen.toFixed(1)}%
              </span>
            </div>
          )}

          {/* Control de stock */}
          <div className="border-border space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="controlStock">Controlar inventario</Label>
                <p className="text-muted-foreground text-xs">Activa para llevar control de stock</p>
              </div>
              <Switch
                checked={watch('controlStock')}
                onChange={(e) => {
                  setValue('controlStock', e.target.checked)
                  setControlStock(e.target.checked)
                }}
              />
            </div>

            {controlStock && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stockActual">Stock actual</Label>
                  <Input
                    id="stockActual"
                    type="number"
                    min={0}
                    placeholder="0"
                    {...register('stockActual', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockMinimo">Stock mínimo (alerta)</Label>
                  <Input
                    id="stockMinimo"
                    type="number"
                    min={0}
                    placeholder="10"
                    {...register('stockMinimo', { valueAsNumber: true })}
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-border mt-6 flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleFinalSubmit} isLoading={isSubmitting}>
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
