'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowUp, ArrowDown, RefreshCw, Package, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, Button, Input, Label, Textarea, Badge, Card } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Producto, AjusteStockFormData } from '../types'

const schema = z.object({
  tipo: z.enum(['entrada', 'salida', 'ajuste']),
  cantidad: z.number().min(1, 'Cantidad mínima: 1'),
  observaciones: z.string().optional(),
})

type TipoAjuste = 'entrada' | 'salida' | 'ajuste'

const TIPO_CONFIG: Record<
  TipoAjuste,
  { label: string; icon: React.ReactNode; desc: string; color: string; bg: string }
> = {
  entrada: {
    label: 'Entrada',
    icon: <ArrowUp className="h-5 w-5" />,
    desc: 'Agregar stock (compra, devolución)',
    color: 'text-success',
    bg: 'bg-success/10 border-success/30',
  },
  salida: {
    label: 'Salida',
    icon: <ArrowDown className="h-5 w-5" />,
    desc: 'Reducir stock (merma, pérdida)',
    color: 'text-destructive',
    bg: 'bg-destructive/10 border-destructive/30',
  },
  ajuste: {
    label: 'Ajuste',
    icon: <RefreshCw className="h-5 w-5" />,
    desc: 'Corregir inventario (error de conteo)',
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/30',
  },
}

interface AjusteStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  onSubmit: (data: AjusteStockFormData) => Promise<void>
}

export function AjusteStockModal({
  open,
  onOpenChange,
  producto,
  onSubmit,
}: AjusteStockModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = React.useState<TipoAjuste>('entrada')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AjusteStockFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      tipo: 'entrada',
      cantidad: 1,
      observaciones: '',
    },
  })

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      reset()
      setTipoSeleccionado('entrada')
    }
  }, [open, reset])

  React.useEffect(() => {
    setValue('tipo', tipoSeleccionado)
  }, [tipoSeleccionado, setValue])

  const handleFinalSubmit = async () => {
    if (!producto) return

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

  // Calcular stock resultante
  const cantidad = watch('cantidad') || 0
  const stockActual = producto?.stockActual || 0
  let stockResultante = stockActual

  if (tipoSeleccionado === 'entrada') {
    stockResultante = stockActual + cantidad
  } else if (tipoSeleccionado === 'salida') {
    stockResultante = Math.max(0, stockActual - cantidad)
  } else {
    // Ajuste: se interpreta como "corregir a X cantidad"
    stockResultante = cantidad
  }

  const isLowStock = stockResultante < (producto?.stockMinimo || 10)
  const exceedsStock = tipoSeleccionado === 'salida' && cantidad > stockActual

  if (!producto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="default" className="max-h-[95vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <Package className="text-primary h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ajustar Stock</h2>
              <p className="text-muted-foreground text-sm">{producto.nombre}</p>
            </div>
          </div>
        </div>

        {/* Stock actual */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Stock actual</p>
              <p className="text-2xl font-bold">{stockActual} unidades</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Stock mínimo</p>
              <p className="font-medium">{producto.stockMinimo || '-'} unidades</p>
            </div>
          </div>
        </Card>

        <form className="space-y-6">
          {/* Tipo de ajuste */}
          <div className="space-y-2">
            <Label required>Tipo de movimiento</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TIPO_CONFIG) as TipoAjuste[]).map((tipo) => {
                const config = TIPO_CONFIG[tipo]
                return (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoSeleccionado(tipo)}
                    className={cn(
                      'rounded-lg border p-3 text-center transition-all',
                      tipoSeleccionado === tipo
                        ? config.bg
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('mb-1', tipoSeleccionado === tipo ? config.color : '')}>
                      {config.icon}
                    </div>
                    <p className="text-sm font-medium">{config.label}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{config.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <Label htmlFor="cantidad" required>
              {tipoSeleccionado === 'ajuste' ? 'Nuevo stock total' : 'Cantidad'}
            </Label>
            <Input
              id="cantidad"
              type="number"
              min={tipoSeleccionado === 'ajuste' ? 0 : 1}
              max={tipoSeleccionado === 'salida' ? stockActual : undefined}
              placeholder="0"
              error={errors.cantidad?.message}
              {...register('cantidad', { valueAsNumber: true })}
            />
            {exceedsStock && (
              <p className="text-destructive flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                La cantidad excede el stock disponible
              </p>
            )}
          </div>

          {/* Preview del resultado */}
          <Card className={cn('p-4', isLowStock && 'border-warning/50')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Stock resultante</p>
                <p className={cn('text-2xl font-bold', isLowStock && 'text-warning')}>
                  {stockResultante} unidades
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tipoSeleccionado === 'entrada' && (
                  <Badge variant="success">
                    <ArrowUp className="mr-1 h-3 w-3" />+{cantidad}
                  </Badge>
                )}
                {tipoSeleccionado === 'salida' && (
                  <Badge variant="destructive">
                    <ArrowDown className="mr-1 h-3 w-3" />-{cantidad}
                  </Badge>
                )}
                {tipoSeleccionado === 'ajuste' && (
                  <Badge variant="warning">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Ajuste a {cantidad}
                  </Badge>
                )}
              </div>
            </div>
            {isLowStock && stockResultante > 0 && (
              <p className="text-warning mt-2 flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Stock estará por debajo del mínimo ({producto.stockMinimo})
              </p>
            )}
            {stockResultante === 0 && (
              <p className="text-destructive mt-2 flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Stock quedará en 0 - producto sin disponibilidad
              </p>
            )}
          </Card>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
            <Textarea
              id="observaciones"
              placeholder="Ej: Compra de stock inicial, devolución de cliente..."
              rows={2}
              {...register('observaciones')}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-border mt-6 flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleFinalSubmit}
            isLoading={isSubmitting}
            disabled={exceedsStock || cantidad <= 0}
          >
            Confirmar ajuste
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
