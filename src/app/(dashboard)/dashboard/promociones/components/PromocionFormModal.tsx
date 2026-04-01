'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type {
  Promocion,
  PromocionFormData,
  TipoPromocion,
  RangoHorario,
  ProductoIncluido,
} from '../types'
import { mockCanchasPromo, mockProductosPromo } from '../mock-data'

const TIPO_OPTIONS = [
  {
    value: 'descuento_porcentual',
    label: '% Descuento',
    icon: '%',
    desc: 'Aplica un porcentaje de descuento',
  },
  { value: 'precio_fijo', label: 'Precio Fijo', icon: 'S/', desc: 'Establece un precio especial' },
  { value: 'combo_horas', label: 'Combo Horas', icon: '⏱️', desc: 'Más horas por menos dinero' },
  { value: 'combo_productos', label: 'Combo Productos', icon: '📦', desc: 'Reserva + productos' },
  { value: 'recurrencia', label: 'Recurrencia', icon: '🔄', desc: 'Premia clientes frecuentes' },
]

const DIAS_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
]

const HORAS_OPTIONS = Array.from({ length: 18 }, (_, i) => ({
  value: `${(i + 6).toString().padStart(2, '0')}:00`,
  label: `${i + 6}:00`,
}))

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  descripcion: z.string().max(500).optional(),
  tipo: z.enum([
    'descuento_porcentual',
    'precio_fijo',
    'combo_horas',
    'combo_productos',
    'recurrencia',
  ]),
  valor: z.number().min(0),
  horasBase: z.number().optional(),
  horasCobradas: z.number().optional(),
  productosIncluidos: z.array(z.any()).optional(),
  numeroReserva: z.number().optional(),
  canchasAplicables: z.array(z.string()).min(1, 'Selecciona al menos una cancha'),
  diasAplicables: z.array(z.number()).min(1, 'Selecciona al menos un día'),
  horarios: z.array(z.any()).min(1, 'Agrega al menos un rango horario'),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  cuposMaximos: z.number().min(1),
  cuposPorUsuario: z.number().min(1),
  anticipacionMinima: z.number().min(0),
  combinable: z.boolean(),
})

interface PromocionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promocion?: Promocion | null
  onSubmit: (data: PromocionFormData) => Promise<void>
}

export function PromocionFormModal({
  open,
  onOpenChange,
  promocion,
  onSubmit,
}: PromocionFormModalProps) {
  const [step, setStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] =
    React.useState<TipoPromocion>('descuento_porcentual')
  const [diasSeleccionados, setDiasSeleccionados] = React.useState<number[]>(
    promocion?.diasAplicables || []
  )
  const [canchasSeleccionadas, setCanchasSeleccionadas] = React.useState<string[]>(
    promocion?.canchasAplicables || []
  )
  const [horarios, setHorarios] = React.useState<RangoHorario[]>(
    promocion?.horarios || [{ inicio: '06:00', fin: '12:00' }]
  )
  const [productosIncluidos, setProductosIncluidos] = React.useState<ProductoIncluido[]>(
    promocion?.productosIncluidos || []
  )

  const isEditing = !!promocion

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PromocionFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: promocion
      ? {
          nombre: promocion.nombre,
          descripcion: promocion.descripcion || '',
          tipo: promocion.tipo,
          valor: promocion.valor,
          horasBase: promocion.horasBase,
          horasCobradas: promocion.horasCobradas,
          numeroReserva: promocion.numeroReserva,
          canchasAplicables: promocion.canchasAplicables,
          diasAplicables: promocion.diasAplicables,
          horarios: promocion.horarios,
          fechaInicio: promocion.fechaInicio,
          fechaFin: promocion.fechaFin,
          cuposMaximos: promocion.cuposMaximos,
          cuposPorUsuario: promocion.cuposPorUsuario,
          anticipacionMinima: promocion.anticipacionMinima,
          combinable: promocion.combinable,
        }
      : {
          nombre: '',
          descripcion: '',
          tipo: 'descuento_porcentual',
          valor: 20,
          canchasAplicables: [],
          diasAplicables: [],
          horarios: [{ inicio: '06:00', fin: '12:00' }],
          fechaInicio: new Date().toISOString().split('T')[0],
          fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cuposMaximos: 10,
          cuposPorUsuario: 3,
          anticipacionMinima: 0,
          combinable: false,
        },
  })

  React.useEffect(() => {
    if (!open) {
      setStep(0)
      reset()
    }
  }, [open, reset])

  React.useEffect(() => {
    setTipoSeleccionado(watch('tipo'))
  }, [watch('tipo')])

  React.useEffect(() => {
    setValue('diasAplicables', diasSeleccionados)
  }, [diasSeleccionados, setValue])

  React.useEffect(() => {
    setValue('canchasAplicables', canchasSeleccionadas)
  }, [canchasSeleccionadas, setValue])

  React.useEffect(() => {
    setValue('horarios', horarios)
  }, [horarios, setValue])

  const toggleDia = (dia: number) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    )
  }

  const toggleCancha = (canchaId: string) => {
    setCanchasSeleccionadas((prev) =>
      prev.includes(canchaId) ? prev.filter((c) => c !== canchaId) : [...prev, canchaId]
    )
  }

  const addHorario = () => {
    setHorarios((prev) => [...prev, { inicio: '06:00', fin: '12:00' }])
  }

  const removeHorario = (index: number) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index))
  }

  const updateHorario = (index: number, field: 'inicio' | 'fin', value: string) => {
    setHorarios((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      await handleSubmit(async (data) => {
        await onSubmit({ ...data, productosIncluidos })
        onOpenChange(false)
      })()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isEditing
              ? 'Modifica los datos de la promoción'
              : 'Crea una nueva promoción para tus canchas'}
          </p>
        </div>

        {/* Steps */}
        <div className="mb-6 flex gap-2">
          {['Tipo y valor', 'Aplicabilidad', 'Restricciones'].map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
                step === i
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <form className="space-y-6">
          {/* Paso 0: Tipo y valor */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" required>
                  Nombre de la promoción
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Martes de Mañana"
                  error={errors.nombre?.message}
                  {...register('nombre')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe tu promoción..."
                  rows={2}
                  {...register('descripcion')}
                />
              </div>

              <div className="space-y-2">
                <Label required>Tipo de promoción</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TIPO_OPTIONS.map((tipo) => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => setValue('tipo', tipo.value as TipoPromocion)}
                      className={cn(
                        'rounded-lg border p-3 text-left transition-all',
                        watch('tipo') === tipo.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tipo.icon}</span>
                        <span className="font-medium">{tipo.label}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-xs">{tipo.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuración según tipo */}
              {tipoSeleccionado === 'descuento_porcentual' && (
                <div className="space-y-2">
                  <Label htmlFor="valor" required>
                    Porcentaje de descuento
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    min={1}
                    max={100}
                    rightIcon={<span className="text-muted-foreground">%</span>}
                    {...register('valor', { valueAsNumber: true })}
                  />
                </div>
              )}

              {tipoSeleccionado === 'precio_fijo' && (
                <div className="space-y-2">
                  <Label htmlFor="valor" required>
                    Precio especial fijo
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    min={1}
                    leftIcon={<span className="text-muted-foreground">S/</span>}
                    {...register('valor', { valueAsNumber: true })}
                  />
                </div>
              )}

              {tipoSeleccionado === 'combo_horas' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="horasBase">Horas reservadas</Label>
                    <Input
                      id="horasBase"
                      type="number"
                      min={1}
                      max={4}
                      {...register('horasBase', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horasCobradas">Horas cobradas</Label>
                    <Input
                      id="horasCobradas"
                      type="number"
                      min={0.5}
                      max={4}
                      step={0.5}
                      {...register('horasCobradas', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              {tipoSeleccionado === 'recurrencia' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="numeroReserva">En la reserva número</Label>
                    <Input
                      id="numeroReserva"
                      type="number"
                      min={2}
                      max={10}
                      {...register('numeroReserva', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Descuento %</Label>
                    <Input
                      id="valor"
                      type="number"
                      min={1}
                      max={100}
                      rightIcon={<span className="text-muted-foreground">%</span>}
                      {...register('valor', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 1: Aplicabilidad */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label required>Canchas donde aplica</Label>
                <div className="flex flex-wrap gap-2">
                  {mockCanchasPromo.map((cancha) => (
                    <button
                      key={cancha.id}
                      type="button"
                      onClick={() => toggleCancha(cancha.id)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm transition-all',
                        canchasSeleccionadas.includes(cancha.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {cancha.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label required>Días aplicables</Label>
                <div className="flex flex-wrap gap-2">
                  {DIAS_OPTIONS.map((dia) => (
                    <button
                      key={dia.value}
                      type="button"
                      onClick={() => toggleDia(dia.value)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm transition-all',
                        diasSeleccionados.includes(dia.value)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {dia.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label required>Rangos horarios</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addHorario}>
                    + Agregar rango
                  </Button>
                </div>
                <div className="space-y-2">
                  {horarios.map((horario, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={horario.inicio}
                        onChange={(e) => updateHorario(index, 'inicio', e.target.value)}
                        className="border-border bg-background rounded-md border px-3 py-2 text-sm"
                      >
                        {HORAS_OPTIONS.map((h) => (
                          <option key={h.value} value={h.value}>
                            {h.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-muted-foreground">a</span>
                      <select
                        value={horario.fin}
                        onChange={(e) => updateHorario(index, 'fin', e.target.value)}
                        className="border-border bg-background rounded-md border px-3 py-2 text-sm"
                      >
                        {HORAS_OPTIONS.map((h) => (
                          <option key={h.value} value={h.value}>
                            {h.label}
                          </option>
                        ))}
                      </select>
                      {horarios.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeHorario(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha inicio</Label>
                  <Input id="fechaInicio" type="date" {...register('fechaInicio')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha fin</Label>
                  <Input id="fechaFin" type="date" {...register('fechaFin')} />
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Restricciones */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cuposMaximos">Cupos máximos por día</Label>
                  <Input
                    id="cuposMaximos"
                    type="number"
                    min={1}
                    {...register('cuposMaximos', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuposPorUsuario">Límite por usuario</Label>
                  <Input
                    id="cuposPorUsuario"
                    type="number"
                    min={1}
                    {...register('cuposPorUsuario', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anticipacionMinima">Anticipación mínima (días)</Label>
                <Input
                  id="anticipacionMinima"
                  type="number"
                  min={0}
                  {...register('anticipacionMinima', { valueAsNumber: true })}
                />
                <p className="text-muted-foreground text-xs">
                  Días de anticipación requeridos para aplicar la promoción
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="combinable"
                  checked={watch('combinable')}
                  onChange={(e) => setValue('combinable', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="combinable" className="cursor-pointer">
                  Combinable con otras promociones
                </Label>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-border mt-6 flex justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step > 0 ? setStep(step - 1) : onOpenChange(false))}
          >
            {step > 0 ? 'Anterior' : 'Cancelar'}
          </Button>

          {step < 2 ? (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} isLoading={isSubmitting}>
              {isEditing ? 'Guardar cambios' : 'Crear promoción'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
