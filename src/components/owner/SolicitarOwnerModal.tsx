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
  Textarea,
  Badge,
  Select,
} from '@/components/ui'
import {
  Building2,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ===========================================
// SCHEMA DE VALIDACIÓN
// ===========================================
const solicitudOwnerSchema = z.object({
  // Información del negocio (obligatorio)
  nombreNegocio: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  ruc: z
    .string()
    .regex(/^\d{11}$/, 'El RUC debe tener 11 dígitos')
    .refine((val) => val.startsWith('10') || val.startsWith('15') || val.startsWith('20'), {
      message: 'RUC inválido (debe iniciar con 10, 15 o 20)',
    }),
  telefonoNegocio: z
    .string()
    .regex(/^9\d{8}$/, 'Ingrese un teléfono válido (9 dígitos iniciando con 9)'),
  direccionNegocio: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  ciudad: z.string().min(1, 'Seleccione una ciudad'),
  distrito: z.string().min(1, 'Seleccione un distrito'),

  // Documentos (opcional)
  tieneLocal: z.enum(['propio', 'alquilado', 'prestado']),
  numeroCanchas: z.number().min(1).max(50),
  experienciaMeses: z.number().min(0).max(600),

  // Términos
  aceptaTerminos: z.boolean().refine((val) => val === true, {
    message: 'Debe aceptar los términos y condiciones',
  }),
})

type SolicitudOwnerFormData = z.infer<typeof solicitudOwnerSchema>

// ===========================================
// PROPS
// ===========================================
interface SolicitarOwnerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SolicitudOwnerFormData) => Promise<void>
  ciudades?: { id: string; nombre: string; distritos: string[] }[]
  existingApplication?: {
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    rejectionReason?: string
  }
}

// ===========================================
// CIUDADES POR DEFECTO
// ===========================================
const CIUDADES_DEFAULT = [
  {
    id: 'lima',
    nombre: 'Lima',
    distritos: [
      'San Isidro',
      'Miraflores',
      'San Borja',
      'La Molina',
      'Surco',
      'San Juan de Lurigancho',
      'Los Olivos',
      'Independencia',
      'Comas',
      'Ate',
      'Jesús María',
      'Lince',
      'Magdalena',
      'Pueblo Libre',
      'San Miguel',
      'Callao',
    ],
  },
  {
    id: 'arequipa',
    nombre: 'Arequipa',
    distritos: ['Arequipa', 'Cayma', 'Cerro Colorado', 'Yanahuara', 'Paucarpata'],
  },
  {
    id: 'cusco',
    nombre: 'Cusco',
    distritos: ['Cusco', 'San Sebastián', 'Santiago', 'Wanchaq'],
  },
  {
    id: 'trujillo',
    nombre: 'Trujillo',
    distritos: ['Trujillo', 'La Esperanza', 'Víctor Larco', 'El Porvenir'],
  },
  {
    id: 'huancayo',
    nombre: 'Huancayo',
    distritos: ['Huancayo', 'El Tambo', 'Chilca', 'San Carlos'],
  },
]

// ===========================================
// COMPONENTE
// ===========================================
export function SolicitarOwnerModal({
  open,
  onOpenChange,
  onSubmit,
  ciudades = CIUDADES_DEFAULT,
  existingApplication,
}: SolicitarOwnerModalProps) {
  const [step, setStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedCiudad, setSelectedCiudad] = React.useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SolicitudOwnerFormData>({
    resolver: zodResolver(solicitudOwnerSchema),
    defaultValues: {
      nombreNegocio: '',
      ruc: '',
      telefonoNegocio: '',
      direccionNegocio: '',
      ciudad: '',
      distrito: '',
      tieneLocal: 'propio',
      numeroCanchas: 1,
      experienciaMeses: 0,
      aceptaTerminos: false,
    },
  })

  const watchValues = watch()

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      reset()
      setStep(0)
      setSelectedCiudad('')
    }
  }, [open, reset])

  // Actualizar distritos cuando cambia la ciudad
  React.useEffect(() => {
    const ciudad = ciudades.find((c) => c.id === selectedCiudad)
    if (ciudad) {
      setValue('ciudad', ciudad.nombre)
      setValue('distrito', '')
    }
  }, [selectedCiudad, ciudades, setValue])

  // Ciudad seleccionada para obtener distritos
  const ciudadSeleccionada = ciudades.find((c) => c.id === selectedCiudad)

  // Validar paso actual
  const canGoNext = () => {
    switch (step) {
      case 0:
        return (
          watchValues.nombreNegocio &&
          watchValues.ruc &&
          watchValues.telefonoNegocio &&
          !errors.nombreNegocio &&
          !errors.ruc &&
          !errors.telefonoNegocio
        )
      case 1:
        return (
          watchValues.direccionNegocio &&
          watchValues.ciudad &&
          watchValues.distrito &&
          !errors.direccionNegocio
        )
      case 2:
        return true
      case 3:
        return watchValues.aceptaTerminos
      default:
        return true
    }
  }

  // Submit final
  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      await handleSubmit(onSubmit)()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si ya tiene solicitud
  if (existingApplication) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size="default" className="max-h-[90vh] overflow-y-auto">
          <div className="py-6 text-center">
            {existingApplication.status === 'pending' ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Solicitud en revisión</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Ya tienes una solicitud pendiente de aprobación enviada el{' '}
                  {new Date(existingApplication.createdAt).toLocaleDateString('es-PE')}.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Te notificaremos por correo cuando sea revisada.
                </p>
              </>
            ) : existingApplication.status === 'rejected' ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Solicitud rechazada</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Tu solicitud fue rechazada por la siguiente razón:
                </p>
                <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {existingApplication.rejectionReason || 'No se especificó razón'}
                </p>
                <Button className="mt-4" onClick={() => onOpenChange(false)}>
                  Cerrar
                </Button>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">¡Ya eres Owner!</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Tu cuenta ya tiene permisos de dueño de cancha.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const steps = [
    { title: 'Negocio', icon: Building2 },
    { title: 'Ubicación', icon: MapPin },
    { title: 'Detalles', icon: FileText },
    { title: 'Confirmar', icon: CheckCircle2 },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="border-border border-b px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold">Solicitar ser Owner</h2>
          <p className="text-muted-foreground text-sm">
            Completa la información para gestionar tus propias canchas
          </p>
        </div>

        {/* Stepper */}
        <div className="border-border bg-muted/30 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = step === i
              const isCompleted = step > i

              return (
                <React.Fragment key={i}>
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
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
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
                  {i < steps.length - 1 && (
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
            {/* STEP 0: Información del negocio */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                      <Building2 className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Información del negocio</p>
                      <p className="text-muted-foreground text-xs">
                        Datos de tu complejo deportivo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombreNegocio" required>
                      Nombre del negocio / complejo
                    </Label>
                    <Input
                      id="nombreNegocio"
                      placeholder="Ej: Los Campeones Sport Center"
                      error={errors.nombreNegocio?.message}
                      {...register('nombreNegocio')}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="ruc" required>
                        RUC
                      </Label>
                      <Input
                        id="ruc"
                        placeholder="20123456789"
                        maxLength={11}
                        error={errors.ruc?.message}
                        {...register('ruc')}
                      />
                      <p className="text-muted-foreground mt-1 text-xs">
                        11 dígitos (persona natural o jurídica)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="telefonoNegocio" required>
                        Teléfono del negocio
                      </Label>
                      <div className="relative">
                        <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          id="telefonoNegocio"
                          placeholder="999888777"
                          maxLength={9}
                          className="pl-10"
                          error={errors.telefonoNegocio?.message}
                          {...register('telefonoNegocio')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Ubicación */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                      <MapPin className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Ubicación del local</p>
                      <p className="text-muted-foreground text-xs">
                        Dirección exacta de tu complejo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direccionNegocio" required>
                      Dirección del local
                    </Label>
                    <Textarea
                      id="direccionNegocio"
                      placeholder="Av. Los Deportes 123, Urb. Las Canchas"
                      rows={2}
                      error={errors.direccionNegocio?.message}
                      {...register('direccionNegocio')}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label required>Ciudad</Label>
                      <select
                        value={selectedCiudad}
                        onChange={(e) => setSelectedCiudad(e.target.value)}
                        className="border-border bg-background mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                      >
                        <option value="">Seleccionar ciudad</option>
                        {ciudades.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label required>Distrito</Label>
                      <select
                        value={watchValues.distrito}
                        onChange={(e) => setValue('distrito', e.target.value)}
                        className="border-border bg-background mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                        disabled={!ciudadSeleccionada}
                      >
                        <option value="">Seleccionar distrito</option>
                        {ciudadSeleccionada?.distritos.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Detalles adicionales */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                      <FileText className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Detalles adicionales</p>
                      <p className="text-muted-foreground text-xs">
                        Información opcional para agilizar tu aprobación
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Tipo de local</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { value: 'propio', label: 'Propio' },
                        { value: 'alquilado', label: 'Alquilado' },
                        { value: 'prestado', label: 'Prestado' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setValue(
                              'tieneLocal',
                              option.value as 'propio' | 'alquilado' | 'prestado'
                            )
                          }
                          className={cn(
                            'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                            watchValues.tieneLocal === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="numeroCanchas">Número de canchas</Label>
                      <Input
                        id="numeroCanchas"
                        type="number"
                        min={1}
                        max={50}
                        {...register('numeroCanchas', { valueAsNumber: true })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="experienciaMeses">Experiencia (meses)</Label>
                      <Input
                        id="experienciaMeses"
                        type="number"
                        min={0}
                        max={600}
                        {...register('experienciaMeses', { valueAsNumber: true })}
                      />
                      <p className="text-muted-foreground mt-1 text-xs">
                        Tiempo gestionando canchas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmación */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="mb-3 font-medium">Resumen de tu solicitud</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Negocio:</span>
                      <span className="font-medium">{watchValues.nombreNegocio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RUC:</span>
                      <span>{watchValues.ruc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono:</span>
                      <span>{watchValues.telefonoNegocio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span>
                        {watchValues.distrito}, {watchValues.ciudad}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Canchas:</span>
                      <span>{watchValues.numeroCanchas}</span>
                    </div>
                  </div>
                </div>

                {/* Términos */}
                <div className="border-border rounded-xl border p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={watchValues.aceptaTerminos}
                      onChange={(e) => setValue('aceptaTerminos', e.target.checked)}
                      className="border-border mt-0.5 h-5 w-5 rounded"
                    />
                    <div className="space-y-1">
                      <p className="font-medium">Acepto los términos y condiciones</p>
                      <p className="text-muted-foreground text-xs">
                        Al aceptar, confirmo que la información proporcionada es verídica y autorizo
                        a Pichanga a verificar los datos del negocio. Entiendo que mi solicitud será
                        revisada en un plazo de 24-48 horas.
                      </p>
                    </div>
                  </label>
                  {errors.aceptaTerminos && (
                    <p className="text-destructive mt-2 text-sm">{errors.aceptaTerminos.message}</p>
                  )}
                </div>

                <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Importante:</strong> Una vez aprobada tu solicitud, podrás crear y
                    gestionar tus canchas desde el panel de Owner. Te notificaremos por correo
                    electrónico el resultado de tu solicitud.
                  </p>
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
            {step > 0 ? (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </>
            ) : (
              'Cancelar'
            )}
          </Button>

          {step < 3 ? (
            <Button type="button" onClick={() => setStep(step + 1)} disabled={!canGoNext()}>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinalSubmit}
              disabled={isSubmitting || !watchValues.aceptaTerminos}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enviar solicitud
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
