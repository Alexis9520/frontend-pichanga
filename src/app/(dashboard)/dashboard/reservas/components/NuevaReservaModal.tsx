'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, Button, Input, Label, Textarea, Badge } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  User,
  Calendar,
  Package,
  CreditCard,
  Check,
  MapPin,
  Clock,
  Phone,
  Mail,
  Tag,
  ShoppingCart,
  Receipt,
  Sparkles,
  Minus,
  Plus,
} from 'lucide-react'
import type { NuevaReservaFormData, ProductoInventario, PromocionDisponible } from '../types'
import { calcularPrecioReserva, aplicarPromocion } from '../mock-data'

// Schema de validación
const nuevaReservaSchema = z.object({
  clienteNombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  clienteTelefono: z.string().regex(/^9\d{8}$/, 'Ingrese un teléfono válido (9 dígitos)'),
  clienteEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  canchaId: z.string().min(1, 'Seleccione una cancha'),
  fecha: z.string().min(1, 'Seleccione una fecha'),
  horaInicio: z.string().min(1, 'Seleccione una hora de inicio'),
  duracion: z.enum(['1', '2', '3']),
  promocionId: z.string().optional(),
  productos: z.array(z.object({ id: z.string(), cantidad: z.number() })),
  adelanto: z.number().min(0),
  metodoAdelanto: z.enum(['efectivo', 'tarjeta_local', 'yape', 'plin']).optional(),
  observaciones: z.string().optional(),
})

interface NuevaReservaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: NuevaReservaFormData) => Promise<void>
  canchas: {
    id: string
    nombre: string
    precioHoraBase: number
    precioHoraNoche: number
    horaInicioNoche: string
    adelantoMinimo: number
  }[]
  productos: ProductoInventario[]
  promociones: PromocionDisponible[]
}

// Configuración de steps
const STEPS = [
  { id: 0, title: 'Cliente', icon: User, description: 'Datos personales' },
  { id: 1, title: 'Cancha', icon: Calendar, description: 'Fecha y hora' },
  { id: 2, title: 'Extras', icon: Package, description: 'Productos y promos' },
  { id: 3, title: 'Pago', icon: CreditCard, description: 'Confirmación' },
]

// Configuración de duración
const DURACION_CONFIG = [
  { value: '1', label: '1 hora', icon: Clock, color: 'from-green-500 to-green-600' },
  { value: '2', label: '2 horas', icon: Clock, color: 'from-blue-500 to-blue-600' },
  { value: '3', label: '3 horas', icon: Clock, color: 'from-purple-500 to-purple-600' },
]

// Configuración de métodos de pago
const METODO_PAGO_CONFIG = {
  efectivo: { label: 'Efectivo', icon: Receipt, color: 'from-green-500 to-green-600' },
  tarjeta_local: { label: 'Tarjeta', icon: CreditCard, color: 'from-blue-500 to-blue-600' },
  yape: { label: 'Yape', icon: Phone, color: 'from-purple-500 to-purple-600' },
  plin: { label: 'Plin', icon: Phone, color: 'from-pink-500 to-pink-600' },
}

export function NuevaReservaModal({
  open,
  onOpenChange,
  onSubmit,
  canchas,
  productos,
  promociones,
}: NuevaReservaModalProps) {
  const [step, setStep] = React.useState(0)
  const [productosSeleccionados, setProductosSeleccionados] = React.useState<
    { id: string; cantidad: number }[]
  >([])
  const [promocionSeleccionada, setPromocionSeleccionada] = React.useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NuevaReservaFormData>({
    resolver: zodResolver(nuevaReservaSchema),
    defaultValues: {
      clienteNombre: '',
      clienteTelefono: '',
      clienteEmail: '',
      canchaId: '',
      fecha: '',
      horaInicio: '',
      duracion: '1',
      promocionId: '',
      productos: [],
      adelanto: 0,
      metodoAdelanto: 'efectivo',
      observaciones: '',
    },
  })

  const watchValues = watch()
  const canchaSeleccionada = canchas.find((c) => c.id === watchValues.canchaId)

  // Calcular precios
  const precioCalculado = React.useMemo(() => {
    if (!canchaSeleccionada || !watchValues.fecha || !watchValues.horaInicio) {
      return { precioBase: 0, precioPorHora: [], precioConPromo: 0, descuento: 0 }
    }

    const { precioBase, precioPorHora } = calcularPrecioReserva(
      canchaSeleccionada,
      watchValues.fecha,
      watchValues.horaInicio,
      parseInt(watchValues.duracion)
    )

    const promo = promociones.find((p) => p.id === promocionSeleccionada)
    const { precioFinal, descuento } = aplicarPromocion(precioBase, promo)

    return { precioBase, precioPorHora, precioConPromo: precioFinal, descuento }
  }, [
    canchaSeleccionada,
    watchValues.fecha,
    watchValues.horaInicio,
    watchValues.duracion,
    promocionSeleccionada,
    promociones,
  ])

  // Calcular total de productos
  const totalProductos = React.useMemo(() => {
    return productosSeleccionados.reduce((acc, p) => {
      const producto = productos.find((prod) => prod.id === p.id)
      return acc + (producto ? producto.precio * p.cantidad : 0)
    }, 0)
  }, [productosSeleccionados, productos])

  const totalGeneral = precioCalculado.precioConPromo + totalProductos

  // Manejar productos
  const toggleProducto = (productoId: string) => {
    setProductosSeleccionados((prev) => {
      const existe = prev.find((p) => p.id === productoId)
      if (existe) {
        return prev.filter((p) => p.id !== productoId)
      }
      return [...prev, { id: productoId, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setProductosSeleccionados((prev) => prev.filter((p) => p.id !== productoId))
    } else {
      setProductosSeleccionados((prev) =>
        prev.map((p) => (p.id === productoId ? { ...p, cantidad } : p))
      )
    }
  }

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      reset()
      setStep(0)
      setProductosSeleccionados([])
      setPromocionSeleccionada(undefined)
    }
  }, [open, reset])

  // Submit final
  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      await handleSubmit(async (data) => {
        const formData: NuevaReservaFormData = {
          clienteNombre: data.clienteNombre,
          clienteTelefono: data.clienteTelefono,
          clienteEmail: data.clienteEmail,
          canchaId: data.canchaId,
          fecha: data.fecha,
          horaInicio: data.horaInicio,
          duracion: data.duracion,
          productos: productosSeleccionados,
          promocionId: promocionSeleccionada,
          adelanto: data.adelanto || 0,
          metodoAdelanto: data.metodoAdelanto,
          observaciones: data.observaciones,
        }
        await onSubmit(formData)
        onOpenChange(false)
      })()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Horarios disponibles (mock)
  const horariosDisponibles = [
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' },
  ]

  const canGoNext = () => {
    switch (step) {
      case 0:
        return watchValues.clienteNombre && watchValues.clienteTelefono
      case 1:
        return watchValues.canchaId && watchValues.fecha && watchValues.horaInicio
      case 2:
        return true
      case 3:
        return true
      default:
        return true
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="border-border border-b px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold">Nueva Reserva Manual</h2>
          <p className="text-muted-foreground text-sm">
            Completa la información para crear una reserva
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
                    onClick={() => i <= step && setStep(i)}
                    className={cn('flex flex-col items-center gap-1', i > step && 'cursor-default')}
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
            {/* STEP 0: Cliente */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Datos del cliente</p>
                      <p className="text-muted-foreground text-xs">
                        Información de contacto para la reserva
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clienteNombre" required>
                      Nombre completo
                    </Label>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="clienteNombre"
                        placeholder="Juan Pérez"
                        className="pl-10"
                        error={errors.clienteNombre?.message}
                        {...register('clienteNombre')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clienteTelefono" required>
                      Teléfono
                    </Label>
                    <div className="relative">
                      <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="clienteTelefono"
                        placeholder="999888777"
                        className="pl-10"
                        error={errors.clienteTelefono?.message}
                        {...register('clienteTelefono')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="clienteEmail">Email (opcional)</Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="clienteEmail"
                        type="email"
                        placeholder="cliente@email.com"
                        className="pl-10"
                        error={errors.clienteEmail?.message}
                        {...register('clienteEmail')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Cancha y horario */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Selección de cancha */}
                <div>
                  <Label className="mb-3 block">Selecciona la cancha</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {canchas.map((cancha) => {
                      const isSelected = watchValues.canchaId === cancha.id
                      return (
                        <button
                          key={cancha.id}
                          type="button"
                          onClick={() => setValue('canchaId', cancha.id)}
                          className={cn(
                            'rounded-xl border-2 p-4 text-left transition-all duration-200',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                                <MapPin className="text-primary h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold">{cancha.nombre}</p>
                                <p className="text-muted-foreground text-xs">
                                  Desde {formatCurrency(cancha.precioHoraBase)}/hora
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="bg-primary rounded-full p-0.5">
                                <Check className="text-primary-foreground h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Fecha y hora */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha" required>
                      Fecha
                    </Label>
                    <div className="relative">
                      <Calendar className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="fecha"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10"
                        error={errors.fecha?.message}
                        {...register('fecha')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaInicio" required>
                      Hora de inicio
                    </Label>
                    <div className="relative">
                      <Clock className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                      <select
                        value={watchValues.horaInicio}
                        onChange={(e) => setValue('horaInicio', e.target.value)}
                        className="border-border bg-background w-full cursor-pointer appearance-none rounded-lg border py-2.5 pr-10 pl-10 text-sm"
                      >
                        <option value="">Seleccionar hora</option>
                        {horariosDisponibles.map((h) => (
                          <option key={h.value} value={h.value}>
                            {h.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Duración */}
                <div>
                  <Label className="mb-3 block">Duración</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {DURACION_CONFIG.map((dur) => {
                      const Icon = dur.icon
                      const isSelected = watchValues.duracion === dur.value
                      return (
                        <button
                          key={dur.value}
                          type="button"
                          onClick={() => setValue('duracion', dur.value as '1' | '2' | '3')}
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
                              dur.color
                            )}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-sm font-medium">{dur.label}</p>
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

                {/* Preview de precio */}
                {canchaSeleccionada && watchValues.fecha && watchValues.horaInicio && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <Receipt className="h-4 w-4" />
                      Vista previa del precio
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background rounded-lg p-3 text-center">
                        <p className="text-muted-foreground text-xs">Precio base</p>
                        <p className="text-lg font-bold">
                          {formatCurrency(precioCalculado.precioBase)}
                        </p>
                      </div>
                      <div className="bg-background rounded-lg p-3 text-center">
                        <p className="text-muted-foreground text-xs">Horario</p>
                        <p className="text-muted-foreground text-sm">
                          {watchValues.horaInicio} -{' '}
                          {String(
                            parseInt(watchValues.horaInicio?.split(':')[0] || '0') +
                              parseInt(watchValues.duracion)
                          ).padStart(2, '0')}
                          :00
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Extras */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Promociones */}
                {promociones.length > 0 && (
                  <div>
                    <Label className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Promociones disponibles
                    </Label>
                    <div className="grid gap-2">
                      {promociones.map((promo) => {
                        const isSelected = promocionSeleccionada === promo.id
                        return (
                          <button
                            key={promo.id}
                            type="button"
                            onClick={() => {
                              setPromocionSeleccionada(isSelected ? undefined : promo.id)
                              setValue('promocionId', isSelected ? '' : promo.id)
                            }}
                            className={cn(
                              'rounded-xl border-2 p-3 text-left transition-all',
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                                  <Tag className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{promo.nombre}</p>
                                  <p className="text-muted-foreground text-xs">
                                    {promo.descripcion}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="success" size="sm">
                                {promo.tipo === 'descuento_porcentual'
                                  ? `-${promo.valor}%`
                                  : promo.tipo === 'precio_fijo'
                                    ? `S/${promo.valor}`
                                    : 'Combo'}
                              </Badge>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Productos */}
                <div>
                  <Label className="mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Productos extras
                  </Label>
                  <div className="grid max-h-60 gap-2 overflow-y-auto">
                    {productos
                      .filter((p) => p.activo)
                      .map((producto) => {
                        const seleccionado = productosSeleccionados.find(
                          (p) => p.id === producto.id
                        )
                        return (
                          <div
                            key={producto.id}
                            className={cn(
                              'flex items-center justify-between rounded-xl border-2 p-3 transition-all',
                              seleccionado ? 'border-primary bg-primary/5' : 'border-border'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleProducto(producto.id)}
                                className={cn(
                                  'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors',
                                  seleccionado
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border'
                                )}
                              >
                                {seleccionado && <Check className="h-4 w-4" />}
                              </button>
                              <div>
                                <p className="font-medium">{producto.nombre}</p>
                                <p className="text-muted-foreground text-sm">
                                  {formatCurrency(producto.precio)}
                                </p>
                              </div>
                            </div>
                            {seleccionado && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    cambiarCantidad(producto.id, seleccionado.cantidad - 1)
                                  }
                                  className="bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-lg"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {seleccionado.cantidad}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    cambiarCantidad(producto.id, seleccionado.cantidad + 1)
                                  }
                                  className="bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-lg"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Resumen */}
                {(promocionSeleccionada || productosSeleccionados.length > 0) && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="mb-2 text-sm font-medium">Resumen de extras</p>
                    {promocionSeleccionada && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Descuento:</span>
                        <span className="text-primary font-medium">
                          -{formatCurrency(precioCalculado.descuento)}
                        </span>
                      </div>
                    )}
                    {productosSeleccionados.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Productos:</span>
                        <span className="font-medium">{formatCurrency(totalProductos)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Pago */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Resumen de reserva */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <Receipt className="h-4 w-4" />
                    Resumen de la reserva
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{watchValues.clienteNombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono:</span>
                      <span>{watchValues.clienteTelefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cancha:</span>
                      <span>{canchaSeleccionada?.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{watchValues.fecha ? formatDate(watchValues.fecha) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horario:</span>
                      <span>
                        {watchValues.horaInicio} -{' '}
                        {String(
                          parseInt(watchValues.horaInicio?.split(':')[0] || '0') +
                            parseInt(watchValues.duracion)
                        ).padStart(2, '0')}
                        :00
                      </span>
                    </div>
                    <div className="border-border my-2 border-t" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio base:</span>
                      <span>{formatCurrency(precioCalculado.precioBase)}</span>
                    </div>
                    {precioCalculado.descuento > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento:</span>
                        <span>-{formatCurrency(precioCalculado.descuento)}</span>
                      </div>
                    )}
                    {totalProductos > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Productos:</span>
                        <span>{formatCurrency(totalProductos)}</span>
                      </div>
                    )}
                    <div className="border-border my-2 border-t" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>TOTAL:</span>
                      <span className="text-primary">{formatCurrency(totalGeneral)}</span>
                    </div>
                  </div>
                </div>

                {/* Adelanto */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="adelanto">Adelanto (opcional)</Label>
                    <div className="relative">
                      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-medium">
                        S/
                      </span>
                      <Input
                        id="adelanto"
                        type="number"
                        min={0}
                        max={totalGeneral}
                        placeholder="0.00"
                        className="pl-9"
                        {...register('adelanto', { valueAsNumber: true })}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Mínimo sugerido: {formatCurrency(canchaSeleccionada?.adelantoMinimo || 0)}
                    </p>
                  </div>

                  {(watchValues.adelanto || 0) > 0 && (
                    <div className="space-y-2">
                      <Label>Método de pago</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          Object.keys(METODO_PAGO_CONFIG) as Array<keyof typeof METODO_PAGO_CONFIG>
                        ).map((metodo) => {
                          const config = METODO_PAGO_CONFIG[metodo]
                          const Icon = config.icon
                          const isSelected = watchValues.metodoAdelanto === metodo
                          return (
                            <button
                              key={metodo}
                              type="button"
                              onClick={() => setValue('metodoAdelanto', metodo)}
                              className={cn(
                                'flex items-center justify-center gap-2 rounded-lg border-2 p-2 transition-all',
                                isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{config.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Observaciones */}
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Notas adicionales..."
                    rows={2}
                    {...register('observaciones')}
                  />
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
              Crear Reserva
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
