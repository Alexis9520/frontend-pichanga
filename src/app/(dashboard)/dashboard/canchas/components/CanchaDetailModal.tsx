'use client'

import * as React from 'react'
import {
  MapPin,
  Users,
  Clock,
  Shield,
  Ban,
  Edit,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sun,
  Moon,
  CircleDot,
  Leaf,
  Building2,
  Car,
  Bath,
  Droplets,
  Lightbulb,
  Home,
  Trophy,
  Shirt,
  Wifi,
  Coffee,
  Star,
} from 'lucide-react'
import { Dialog, DialogContent, Button, Badge } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Cancha, BloqueoHorario } from '../types'

interface CanchaDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cancha: Cancha | null
  bloqueos: BloqueoHorario[]
  onEdit: () => void
  onManageHorarios: () => void
  onManageBloqueos: () => void
}

const TIPO_DEPORTE: Record<string, { label: string; icon: React.ElementType }> = {
  f5: { label: 'Fútbol 5', icon: CircleDot },
  f7: { label: 'Fútbol 7', icon: CircleDot },
  fulbito: { label: 'Fulbito', icon: CircleDot },
}

const SUPERFICIE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  grass_sintetico: { label: 'Grass Sintético', icon: Leaf },
  grass_natural: { label: 'Grass Natural', icon: Leaf },
  losa: { label: 'Losa', icon: Building2 },
  concreto: { label: 'Concreto', icon: Building2 },
}

const SERVICIOS_CONFIG: Record<
  string,
  { label: string; gradient: string; icon: React.ElementType }
> = {
  estacionamiento: { label: 'Parqueo', gradient: 'from-slate-600 to-slate-700', icon: Car },
  banos: { label: 'Baños', gradient: 'from-blue-500 to-blue-600', icon: Bath },
  duchas: { label: 'Duchas', gradient: 'from-cyan-500 to-cyan-600', icon: Droplets },
  iluminacion: { label: 'Iluminación', gradient: 'from-yellow-500 to-amber-500', icon: Lightbulb },
  quincho: { label: 'Quincho', gradient: 'from-orange-500 to-orange-600', icon: Home },
  tribuna: { label: 'Tribuna', gradient: 'from-violet-500 to-violet-600', icon: Trophy },
  camerinos: { label: 'Camerinos', gradient: 'from-pink-500 to-rose-500', icon: Shirt },
  wifi: { label: 'WiFi', gradient: 'from-indigo-500 to-indigo-600', icon: Wifi },
  cantina: { label: 'Cantina', gradient: 'from-red-500 to-red-600', icon: Coffee },
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&h=400&fit=crop',
]

export function CanchaDetailModal({
  open,
  onOpenChange,
  cancha,
  bloqueos,
  onEdit,
}: CanchaDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  if (!cancha) return null

  const images = cancha.fotos.length > 0 ? cancha.fotos : PLACEHOLDER_IMAGES
  const bloqueosCancha = bloqueos.filter((b) => b.canchaId === cancha.id)

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  const tipoDeporteConfig = TIPO_DEPORTE[cancha.tipoDeporte]
  const superficieConfig = SUPERFICIE_CONFIG[cancha.superficie]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[95vh] overflow-y-auto p-0">
        {/* Hero: Image Gallery */}
        <div className="relative h-56 w-full sm:h-64">
          <img
            src={images[currentImageIndex]}
            alt={cancha.nombre}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-3 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-3 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    index === currentImageIndex
                      ? 'h-2 w-6 bg-white'
                      : 'h-2 w-2 bg-white/50 hover:bg-white/70'
                  )}
                />
              ))}
            </div>
          )}

          <div className="absolute right-0 bottom-0 left-0 z-10 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{cancha.nombre}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  {cancha.direccion}, {cancha.distrito}
                </p>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium backdrop-blur-sm',
                  cancha.estado === 'activa'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                )}
              >
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    cancha.estado === 'activa' ? 'animate-pulse bg-white' : 'bg-white/70'
                  )}
                />
                {cancha.estado === 'activa' ? 'Activa' : 'Inactiva'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <div className="text-primary text-xl font-bold">{cancha.totalReservas || 0}</div>
              <div className="text-muted-foreground mt-0.5 text-[11px] font-medium">Reservas</div>
            </div>
            <div className="rounded-xl bg-green-500/10 p-3 text-center">
              <div className="truncate text-xl font-bold text-green-500">
                {formatCurrency(cancha.ingresosMes || 0)}
              </div>
              <div className="text-muted-foreground mt-0.5 text-[11px] font-medium">Ingresos</div>
            </div>
            <div className="bg-secondary/10 rounded-xl p-3 text-center">
              <div className="text-secondary text-xl font-bold">
                {cancha.ocupacionPromedio || 0}%
              </div>
              <div className="text-muted-foreground mt-0.5 text-[11px] font-medium">Ocupación</div>
            </div>
            <div className="rounded-xl bg-yellow-500/10 p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-xl font-bold text-yellow-500">4.8</span>
              </div>
              <div className="text-muted-foreground mt-0.5 text-[11px] font-medium">Rating</div>
            </div>
          </div>

          {/* Config Cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="border-border bg-card rounded-xl border p-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                {tipoDeporteConfig && <tipoDeporteConfig.icon className="text-primary h-6 w-6" />}
              </div>
              <div className="mt-2 font-semibold">{tipoDeporteConfig?.label}</div>
              <div className="text-muted-foreground text-xs">Tipo de deporte</div>
            </div>
            <div className="border-border bg-card rounded-xl border p-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                {superficieConfig && <superficieConfig.icon className="h-6 w-6 text-green-500" />}
              </div>
              <div className="mt-2 font-semibold">{superficieConfig?.label}</div>
              <div className="text-muted-foreground text-xs">Superficie</div>
            </div>
            <div className="border-border bg-card rounded-xl border p-4 text-center">
              <div className="bg-secondary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                <Users className="text-secondary h-6 w-6" />
              </div>
              <div className="mt-2 font-semibold">
                {cancha.capacidad}v{cancha.capacidad}
              </div>
              <div className="text-muted-foreground text-xs">Jugadores</div>
            </div>
          </div>

          {/* Servicios */}
          <div className="mt-5">
            <h3 className="mb-3 font-semibold">Servicios Disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {cancha.servicios.length > 0 ? (
                cancha.servicios.map((servicio) => {
                  const config = SERVICIOS_CONFIG[servicio]
                  if (!config) return null
                  const IconComponent = config.icon
                  return (
                    <div
                      key={servicio}
                      className={cn(
                        'flex items-center gap-2 rounded-lg bg-gradient-to-r px-3 py-2 text-sm font-medium text-white',
                        config.gradient
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{config.label}</span>
                    </div>
                  )
                })
              ) : (
                <p className="text-muted-foreground text-sm">Sin servicios registrados</p>
              )}
            </div>
          </div>

          {/* Horario Timeline */}
          <div className="mt-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Clock className="text-primary h-4 w-4" />
              Horario de Operación
            </h3>
            <div className="border-border bg-card rounded-xl border p-4">
              <div className="bg-muted relative mb-4 h-8 rounded-full">
                <div
                  className="absolute top-0 h-full rounded-l-full bg-gradient-to-r from-yellow-400 to-orange-400"
                  style={{ left: '0%', width: '52%' }}
                />
                <div
                  className="absolute top-0 h-full rounded-r-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  style={{ left: '52%', width: '48%' }}
                />
                <div className="absolute top-10 left-0 text-xs font-medium">
                  {cancha.horaInicioDiurno}
                </div>
                <div className="absolute top-10 left-[52%] -translate-x-1/2 text-xs font-medium">
                  {cancha.horaInicioNoche}
                </div>
                <div className="absolute top-10 right-0 text-xs font-medium">
                  {cancha.horaCierre}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                  <div>
                    <span className="text-sm font-medium">Diurno</span>
                    <span className="text-muted-foreground ml-1 text-xs">
                      {formatCurrency(cancha.precioHoraBase)}/hora
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                  <div>
                    <span className="text-sm font-medium">Nocturno</span>
                    <span className="text-muted-foreground ml-1 text-xs">
                      {formatCurrency(cancha.precioHoraNoche)}/hora
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Precios Cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/30">
                  <Sun className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    Precio Diurno
                  </p>
                  <p className="text-primary text-xl font-bold">
                    {formatCurrency(cancha.precioHoraBase)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/30">
                  <Moon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    Precio Nocturno
                  </p>
                  <p className="text-secondary text-xl font-bold">
                    {formatCurrency(cancha.precioHoraNoche)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Políticas */}
          <div className="mt-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Shield className="text-primary h-4 w-4" />
              Políticas
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="border-border bg-card rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Tolerancia</p>
                <p className="font-semibold">{cancha.toleranciaMinutos} min</p>
              </div>
              <div className="border-border bg-card rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Adelanto mínimo</p>
                <p className="font-semibold">{formatCurrency(cancha.adelantoMinimo)}</p>
              </div>
              <div className="border-border bg-card rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Cancelación gratis</p>
                <p className="font-semibold">{cancha.cancelacionHoras}h antes</p>
              </div>
            </div>
          </div>

          {/* Bloqueos */}
          {bloqueosCancha.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Ban className="text-destructive h-4 w-4" />
                Bloqueos Programados
              </h3>
              <div className="space-y-2">
                {bloqueosCancha.slice(0, 3).map((bloqueo) => (
                  <div
                    key={bloqueo.id}
                    className="border-border bg-card flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{bloqueo.fecha}</p>
                      <p className="text-muted-foreground text-sm">
                        {bloqueo.horaInicio} - {bloqueo.horaFin}
                      </p>
                    </div>
                    <Badge variant="outline">{bloqueo.motivo}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          {cancha.descripcion && (
            <div className="mt-5">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <FileText className="text-primary h-4 w-4" />
                Descripción
              </h3>
              <p className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm">
                {cancha.descripcion}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="border-border mt-5 flex items-center justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar cancha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
