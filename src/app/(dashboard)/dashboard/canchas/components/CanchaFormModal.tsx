'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, Button, Input, Label, Textarea, Badge } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import {
  FileText,
  Settings,
  DollarSign,
  Shield,
  CircleDot,
  Leaf,
  Building2,
  Users,
  Car,
  Bath,
  Droplets,
  Lightbulb,
  Home,
  Trophy,
  Shirt,
  Wifi,
  Coffee,
  Sun,
  Moon,
  Check,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react'
import type {
  Cancha,
  CanchaFormData,
  TipoDeporte,
  TipoSuperficie,
  ServicioCancha,
  PoliticaExceso,
} from '../types'

// Schema
const canchaSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  direccion: z.string().min(5, 'Ingrese una dirección válida'),
  ciudad: z.string().min(2, 'Ingrese la ciudad'),
  distrito: z.string().min(2, 'Ingrese el distrito'),
  descripcion: z.string().max(500).optional(),
  tipoDeporte: z.enum(['f5', 'f7', 'fulbito'] as const),
  superficie: z.enum(['grass_sintetico', 'grass_natural', 'losa', 'concreto'] as const),
  capacidad: z.number().min(4).max(22),
  servicios: z.array(
    z.enum([
      'estacionamiento',
      'banos',
      'duchas',
      'iluminacion',
      'quincho',
      'tribuna',
      'camerinos',
      'wifi',
      'cantina',
    ] as const)
  ),
  precioHoraBase: z.number().min(1),
  precioHoraNoche: z.number().min(1),
  horaInicioDiurno: z.string(),
  horaInicioNoche: z.string(),
  horaCierre: z.string(),
  diasDescanso: z.array(z.number()),
  toleranciaMinutos: z.number().min(0).max(30),
  politicaExceso: z.enum([
    'perder_reserva',
    'penalidad',
    'tiempo_restante',
    'configurable',
  ] as const),
  penalidadMonto: z.number().optional(),
  adelantoMinimo: z.number().min(0),
  cancelacionHoras: z.number().min(0).max(72),
  reembolsoPorcentaje: z.number().min(0).max(100),
})

interface CanchaFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cancha?: Cancha | null
  onSubmit: (data: CanchaFormData) => Promise<void>
}

// Configuraciones visuales
const STEPS = [
  { id: 0, title: 'Datos', icon: FileText, description: 'Información básica' },
  { id: 1, title: 'Config', icon: Settings, description: 'Tipo y servicios' },
  { id: 2, title: 'Precios', icon: DollarSign, description: 'Horarios y costos' },
  { id: 3, title: 'Políticas', icon: Shield, description: 'Reglas y condiciones' },
]

const TIPO_DEPORTE_CONFIG: Record<
  TipoDeporte,
  { label: string; jugadores: number; icon: React.ElementType; color: string }
> = {
  f5: { label: 'Fútbol 5', jugadores: 10, icon: CircleDot, color: 'from-green-500 to-green-600' },
  f7: { label: 'Fútbol 7', jugadores: 14, icon: CircleDot, color: 'from-blue-500 to-blue-600' },
  fulbito: {
    label: 'Fulbito',
    jugadores: 8,
    icon: CircleDot,
    color: 'from-orange-500 to-orange-600',
  },
}

const SUPERFICIE_CONFIG: Record<
  TipoSuperficie,
  { label: string; icon: React.ElementType; color: string }
> = {
  grass_sintetico: { label: 'Grass Sintético', icon: Leaf, color: 'from-green-400 to-green-500' },
  grass_natural: { label: 'Grass Natural', icon: Leaf, color: 'from-emerald-400 to-emerald-500' },
  losa: { label: 'Losa', icon: Building2, color: 'from-slate-400 to-slate-500' },
  concreto: { label: 'Concreto', icon: Building2, color: 'from-gray-400 to-gray-500' },
}

const SERVICIOS_CONFIG: Record<
  ServicioCancha,
  { label: string; icon: React.ElementType; gradient: string }
> = {
  estacionamiento: { label: 'Parqueo', icon: Car, gradient: 'from-slate-600 to-slate-700' },
  banos: { label: 'Baños', icon: Bath, gradient: 'from-blue-500 to-blue-600' },
  duchas: { label: 'Duchas', icon: Droplets, gradient: 'from-cyan-500 to-cyan-600' },
  iluminacion: { label: 'Iluminación', icon: Lightbulb, gradient: 'from-yellow-500 to-amber-500' },
  quincho: { label: 'Quincho', icon: Home, gradient: 'from-orange-500 to-orange-600' },
  tribuna: { label: 'Tribuna', icon: Trophy, gradient: 'from-violet-500 to-violet-600' },
  camerinos: { label: 'Camerinos', icon: Shirt, gradient: 'from-pink-500 to-rose-500' },
  wifi: { label: 'WiFi', icon: Wifi, gradient: 'from-indigo-500 to-indigo-600' },
  cantina: { label: 'Cantina', icon: Coffee, gradient: 'from-red-500 to-red-600' },
}

const POLITICA_CONFIG: Record<PoliticaExceso, { label: string; description: string }> = {
  perder_reserva: { label: 'Pierde la reserva', description: 'El cliente pierde su horario' },
  penalidad: { label: 'Cobra penalidad', description: 'Se cobra una multa adicional' },
  tiempo_restante: { label: 'Tiempo restante', description: 'Solo usa el tiempo que queda' },
  configurable: { label: 'Personalizado', description: 'Definir caso por caso' },
}

const DIAS_SEMANA = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
]

const HORAS = Array.from({ length: 19 }, (_, i) => {
  const h = i + 6
  return { value: `${h.toString().padStart(2, '0')}:00`, label: `${h}:00` }
})

export function CanchaFormModal({ open, onOpenChange, cancha, onSubmit }: CanchaFormModalProps) {
  const [step, setStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [serviciosSeleccionados, setServiciosSeleccionados] = React.useState<ServicioCancha[]>(
    cancha?.servicios || []
  )

  const isEditing = !!cancha

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CanchaFormData>({
    resolver: zodResolver(canchaSchema) as any,
    defaultValues: cancha
      ? {
          nombre: cancha.nombre,
          direccion: cancha.direccion,
          ciudad: cancha.ciudad,
          distrito: cancha.distrito,
          descripcion: cancha.descripcion || '',
          tipoDeporte: cancha.tipoDeporte,
          superficie: cancha.superficie,
          capacidad: cancha.capacidad,
          servicios: cancha.servicios,
          precioHoraBase: cancha.precioHoraBase,
          precioHoraNoche: cancha.precioHoraNoche,
          horaInicioDiurno: cancha.horaInicioDiurno,
          horaInicioNoche: cancha.horaInicioNoche,
          horaCierre: cancha.horaCierre,
          diasDescanso: cancha.diasDescanso,
          toleranciaMinutos: cancha.toleranciaMinutos,
          politicaExceso: cancha.politicaExceso,
          penalidadMonto: cancha.penalidadMonto,
          adelantoMinimo: cancha.adelantoMinimo,
          cancelacionHoras: cancha.cancelacionHoras,
          reembolsoPorcentaje: cancha.reembolsoPorcentaje,
        }
      : {
          nombre: '',
          direccion: '',
          ciudad: 'Huancayo',
          distrito: '',
          descripcion: '',
          tipoDeporte: 'f5',
          superficie: 'grass_sintetico',
          capacidad: 10,
          servicios: [],
          precioHoraBase: 80,
          precioHoraNoche: 120,
          horaInicioDiurno: '06:00',
          horaInicioNoche: '18:00',
          horaCierre: '23:00',
          diasDescanso: [],
          toleranciaMinutos: 15,
          politicaExceso: 'tiempo_restante',
          adelantoMinimo: 30,
          cancelacionHoras: 3,
          reembolsoPorcentaje: 80,
        },
  })

  React.useEffect(() => {
    if (!open) {
      setStep(0)
      reset()
      setServiciosSeleccionados([])
    }
  }, [open, reset])

  React.useEffect(() => {
    setValue('servicios', serviciosSeleccionados)
  }, [serviciosSeleccionados, setValue])

  const toggleServicio = (servicio: ServicioCancha) => {
    setServiciosSeleccionados((prev) =>
      prev.includes(servicio) ? prev.filter((s) => s !== servicio) : [...prev, servicio]
    )
  }

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

  const canGoNext = () => {
    switch (step) {
      case 0:
        return watch('nombre') && watch('direccion') && watch('ciudad') && watch('distrito')
      case 1:
        return true
      case 2:
        return watch('precioHoraBase') > 0 && watch('precioHoraNoche') > 0
      case 3:
        return true
      default:
        return true
    }
  }

  const tipoDeporte = watch('tipoDeporte') as TipoDeporte
  const superficie = watch('superficie') as TipoSuperficie

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="border-border border-b px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold">{isEditing ? 'Editar Cancha' : 'Nueva Cancha'}</h2>
          <p className="text-muted-foreground text-sm">
            {isEditing
              ? 'Modifica los datos de la cancha'
              : 'Completa la información para crear una nueva cancha'}
          </p>
        </div>

        {/* Stepper visual */}
        <div className="border-border bg-muted/30 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = step === i
              const isCompleted = step > i

              return (
                <React.Fragment key={s.id}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300',
                        isActive &&
                          'bg-primary text-primary-foreground shadow-primary/30 scale-110 shadow-lg',
                        isCompleted && 'bg-primary text-primary-foreground',
                        !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'mx-2 h-0.5 flex-1 transition-colors duration-300',
                        isCompleted ? 'bg-primary' : 'bg-border'
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form className="space-y-6">
            {/* STEP 0: Datos básicos */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nombre" required>
                    Nombre de la cancha
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Cancha 1 - Los Campeones"
                    error={errors.nombre?.message}
                    {...register('nombre')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" required>
                    Dirección
                  </Label>
                  <div className="relative">
                    <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="direccion"
                      placeholder="Av. Los Deportes 123"
                      className="pl-10"
                      error={errors.direccion?.message}
                      {...register('direccion')}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad" required>
                      Ciudad
                    </Label>
                    <Input id="ciudad" {...register('ciudad')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distrito" required>
                      Distrito
                    </Label>
                    <Input
                      id="distrito"
                      placeholder="El Tambo"
                      error={errors.distrito?.message}
                      {...register('distrito')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción (opcional)</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe tu cancha, sus características especiales..."
                    rows={3}
                    {...register('descripcion')}
                  />
                </div>
              </div>
            )}

            {/* STEP 1: Configuración */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Tipo de cancha */}
                <div>
                  <Label className="mb-3 block">¿Qué tipo de cancha tienes?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(TIPO_DEPORTE_CONFIG) as TipoDeporte[]).map((tipo) => {
                      const config = TIPO_DEPORTE_CONFIG[tipo]
                      const Icon = config.icon
                      const isSelected = watch('tipoDeporte') === tipo

                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => {
                            setValue('tipoDeporte', tipo)
                            setValue('capacidad', config.jugadores)
                          }}
                          className={cn(
                            'rounded-xl border-2 p-4 text-center transition-all duration-200',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          )}
                        >
                          <div
                            className={cn(
                              'mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
                              config.color
                            )}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <p className="font-semibold">{config.label}</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {config.jugadores} jugadores
                          </p>
                          {isSelected && (
                            <div className="mt-2 flex justify-center">
                              <div className="bg-primary rounded-full p-0.5">
                                <Check className="text-primary-foreground h-3 w-3" />
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Superficie */}
                <div>
                  <Label className="mb-3 block">¿Qué superficie tiene?</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(Object.keys(SUPERFICIE_CONFIG) as TipoSuperficie[]).map((sup) => {
                      const config = SUPERFICIE_CONFIG[sup]
                      const Icon = config.icon
                      const isSelected = watch('superficie') === sup

                      return (
                        <button
                          key={sup}
                          type="button"
                          onClick={() => setValue('superficie', sup)}
                          className={cn(
                            'rounded-xl border-2 p-3 text-center transition-all duration-200',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          )}
                        >
                          <div
                            className={cn(
                              'mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br',
                              config.color
                            )}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-sm font-medium">{config.label}</p>
                          {isSelected && (
                            <div className="mt-1 flex justify-center">
                              <Check className="text-primary h-4 w-4" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Jugadores */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Jugadores por equipo</Label>
                    <div className="relative">
                      <Users className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="capacidad"
                        type="number"
                        min={4}
                        max={22}
                        className="pl-10"
                        {...register('capacidad', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Días de descanso</Label>
                    <div className="flex flex-wrap gap-1">
                      {DIAS_SEMANA.map((dia) => {
                        const isSelected = watch('diasDescanso')?.includes(dia.value)
                        return (
                          <button
                            key={dia.value}
                            type="button"
                            onClick={() => {
                              const current = watch('diasDescanso') || []
                              const newValue = isSelected
                                ? current.filter((d) => d !== dia.value)
                                : [...current, dia.value]
                              setValue('diasDescanso', newValue)
                            }}
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition-colors',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            )}
                          >
                            {dia.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Servicios */}
                <div>
                  <Label className="mb-3 block">Servicios disponibles</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(SERVICIOS_CONFIG) as ServicioCancha[]).map((servicio) => {
                      const config = SERVICIOS_CONFIG[servicio]
                      const Icon = config.icon
                      const isSelected = serviciosSeleccionados.includes(servicio)

                      return (
                        <button
                          key={servicio}
                          type="button"
                          onClick={() => toggleServicio(servicio)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border-2 p-2.5 transition-all duration-200',
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                              config.gradient
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{config.label}</span>
                          {isSelected && <Check className="text-primary ml-auto h-4 w-4" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Precios */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Precios cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Diurno */}
                  <div className="rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                        <Sun className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Horario Diurno</p>
                        <p className="text-muted-foreground text-xs">
                          {watch('horaInicioDiurno')} - {watch('horaInicioNoche')}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Precio por hora</Label>
                        <div className="relative">
                          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-medium">
                            S/
                          </span>
                          <Input
                            type="number"
                            min={1}
                            className="pl-9 text-lg font-semibold"
                            {...register('precioHoraBase', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Hora inicio</Label>
                        <select
                          value={watch('horaInicioDiurno')}
                          onChange={(e) => setValue('horaInicioDiurno', e.target.value)}
                          className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
                        >
                          {HORAS.map((h) => (
                            <option key={h.value} value={h.value}>
                              {h.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Nocturno */}
                  <div className="rounded-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                        <Moon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-semibold">Horario Nocturno</p>
                        <p className="text-muted-foreground text-xs">
                          {watch('horaInicioNoche')} - {watch('horaCierre')}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Precio por hora</Label>
                        <div className="relative">
                          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-medium">
                            S/
                          </span>
                          <Input
                            type="number"
                            min={1}
                            className="pl-9 text-lg font-semibold"
                            {...register('precioHoraNoche', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Inicio noche</Label>
                          <select
                            value={watch('horaInicioNoche')}
                            onChange={(e) => setValue('horaInicioNoche', e.target.value)}
                            className="border-border bg-background w-full rounded-lg border px-2 py-2 text-sm"
                          >
                            {HORAS.map((h) => (
                              <option key={h.value} value={h.value}>
                                {h.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Cierre</Label>
                          <select
                            value={watch('horaCierre')}
                            onChange={(e) => setValue('horaCierre', e.target.value)}
                            className="border-border bg-background w-full rounded-lg border px-2 py-2 text-sm"
                          >
                            {HORAS.slice(1).map((h) => (
                              <option key={h.value} value={h.value}>
                                {h.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Vista previa de precios
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="bg-background flex-1 rounded-lg p-3 text-center">
                      <p className="text-muted-foreground text-xs">
                        Diurno ({watch('horaInicioDiurno')} - {watch('horaInicioNoche')})
                      </p>
                      <p className="text-primary text-xl font-bold">
                        {formatCurrency(watch('precioHoraBase') || 0)}
                      </p>
                      <p className="text-muted-foreground text-xs">por hora</p>
                    </div>
                    <div className="bg-background flex-1 rounded-lg p-3 text-center">
                      <p className="text-muted-foreground text-xs">
                        Nocturno ({watch('horaInicioNoche')} - {watch('horaCierre')})
                      </p>
                      <p className="text-secondary text-xl font-bold">
                        {formatCurrency(watch('precioHoraNoche') || 0)}
                      </p>
                      <p className="text-muted-foreground text-xs">por hora</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Políticas */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Tolerancia */}
                <div className="border-border bg-card rounded-xl border p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <Clock className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Tolerancia de llegada</p>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Tiempo de gracia después de la hora de inicio
                      </p>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min={0}
                          max={30}
                          className="w-20"
                          {...register('toleranciaMinutos', { valueAsNumber: true })}
                        />
                        <span className="text-muted-foreground text-sm">minutos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Política exceso */}
                <div className="border-border bg-card rounded-xl border p-4">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="bg-secondary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <AlertCircle className="text-secondary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Si excede la tolerancia</p>
                      <p className="text-muted-foreground text-sm">
                        ¿Qué pasa si el cliente llega tarde?
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(POLITICA_CONFIG) as PoliticaExceso[]).map((pol) => {
                      const config = POLITICA_CONFIG[pol]
                      const isSelected = watch('politicaExceso') === pol

                      return (
                        <button
                          key={pol}
                          type="button"
                          onClick={() => setValue('politicaExceso', pol)}
                          className={cn(
                            'rounded-lg border-2 p-3 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <p className="text-sm font-medium">{config.label}</p>
                          <p className="text-muted-foreground text-xs">{config.description}</p>
                          {isSelected && <Check className="text-primary mt-1 h-4 w-4" />}
                        </button>
                      )
                    })}
                  </div>

                  {watch('politicaExceso') === 'penalidad' && (
                    <div className="mt-4 space-y-2">
                      <Label>Monto de penalidad</Label>
                      <div className="relative">
                        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-medium">
                          S/
                        </span>
                        <Input
                          type="number"
                          min={0}
                          className="pl-9"
                          {...register('penalidadMonto', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Adelanto y cancelación */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border-border bg-card rounded-xl border p-4">
                    <p className="mb-1 font-semibold">Adelanto mínimo</p>
                    <p className="text-muted-foreground mb-3 text-xs">
                      Monto requerido para confirmar
                    </p>
                    <div className="relative">
                      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-medium">
                        S/
                      </span>
                      <Input
                        type="number"
                        min={0}
                        className="pl-9"
                        {...register('adelantoMinimo', { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="border-border bg-card rounded-xl border p-4">
                    <p className="mb-1 font-semibold">Cancelación gratis</p>
                    <p className="text-muted-foreground mb-3 text-xs">
                      Horas de anticipación requeridas
                    </p>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={72}
                        className="pr-10"
                        {...register('cancelacionHoras', { valueAsNumber: true })}
                      />
                      <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                        horas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reembolso */}
                <div className="border-border bg-card rounded-xl border p-4">
                  <p className="mb-1 font-semibold">Porcentaje de reembolso</p>
                  <p className="text-muted-foreground mb-3 text-xs">
                    Si cancela después del tiempo permitido
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={watch('reembolsoPorcentaje')}
                      onChange={(e) => setValue('reembolsoPorcentaje', parseInt(e.target.value))}
                      className="bg-muted h-2 flex-1 cursor-pointer appearance-none rounded-full"
                    />
                    <div className="bg-muted min-w-[60px] rounded-lg px-3 py-1.5 text-center">
                      <span className="font-bold">{watch('reembolsoPorcentaje')}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-border flex justify-between border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step > 0 ? setStep(step - 1) : onOpenChange(false))}
          >
            {step > 0 ? 'Anterior' : 'Cancelar'}
          </Button>

          {step < 3 ? (
            <Button type="button" onClick={() => setStep(step + 1)} disabled={!canGoNext()}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} isLoading={isSubmitting}>
              {isEditing ? 'Guardar cambios' : 'Crear cancha'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
