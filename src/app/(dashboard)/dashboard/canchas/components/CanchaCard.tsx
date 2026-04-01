'use client'

import * as React from 'react'
import {
  Users,
  Edit,
  Power,
  MoreVertical,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Cancha } from '../types'

interface CanchaCardProps {
  cancha: Cancha
  onEdit: (cancha: Cancha) => void
  onToggleEstado: (id: string) => void
  onViewDetails: (cancha: Cancha) => void
  onManageHorarios: (cancha: Cancha) => void
  onManageBloqueos: (cancha: Cancha) => void
}

const TIPO_DEPORTE: Record<string, string> = {
  f5: 'Fútbol 5',
  f7: 'Fútbol 7',
  fulbito: 'Fulbito',
}

const SUPERFICIE: Record<string, string> = {
  grass_sintetico: 'Grass Sint.',
  grass_natural: 'Grass Nat.',
  losa: 'Losa',
  concreto: 'Concreto',
}

// Servicios con gradientes
const SERVICIOS_CONFIG: Record<string, { label: string; gradient: string }> = {
  estacionamiento: { label: 'Parqueo', gradient: 'from-slate-600 to-slate-700' },
  banos: { label: 'Baños', gradient: 'from-blue-500 to-blue-600' },
  duchas: { label: 'Duchas', gradient: 'from-cyan-500 to-cyan-600' },
  iluminacion: { label: 'Iluminación', gradient: 'from-yellow-500 to-amber-500' },
  quincho: { label: 'Quincho', gradient: 'from-orange-500 to-orange-600' },
  tribuna: { label: 'Tribuna', gradient: 'from-violet-500 to-violet-600' },
  camerinos: { label: 'Camerinos', gradient: 'from-pink-500 to-rose-500' },
  wifi: { label: 'WiFi', gradient: 'from-indigo-500 to-indigo-600' },
  cantina: { label: 'Cantina', gradient: 'from-red-500 to-red-600' },
}

// Imágenes placeholder
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
]

export function CanchaCard({
  cancha,
  onEdit,
  onToggleEstado,
  onViewDetails,
  onManageHorarios,
  onManageBloqueos,
}: CanchaCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  const images = cancha.fotos.length > 0 ? cancha.fotos : PLACEHOLDER_IMAGES

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  const visibleServicios = cancha.servicios.slice(0, 3)
  const hiddenServiciosCount = cancha.servicios.length - 3

  return (
    <div
      className={cn(
        'group bg-card border-border relative flex overflow-hidden rounded-2xl border transition-all',
        'hover:border-primary/30 hover:shadow-lg',
        cancha.estado === 'inactiva' && 'opacity-70 grayscale-[20%]'
      )}
    >
      {/* Left: Image Carousel - Full height, extends to card edge */}
      <div className="relative w-[200px] shrink-0 sm:w-[220px]">
        <div className="h-full w-full overflow-hidden rounded-l-2xl rounded-r-none">
          <img
            src={images[currentImageIndex]}
            alt={cancha.nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3 z-20">
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm',
                cancha.estado === 'activa'
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              )}
            >
              <div
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  cancha.estado === 'activa' ? 'animate-pulse bg-white' : 'bg-white/70'
                )}
              />
              {cancha.estado === 'activa' ? 'Activa' : 'Inactiva'}
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-110 hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-110 hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
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
        </div>
      </div>

      {/* Right: Content - Uses all available space */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header - Name and type */}
        <div className="mb-3">
          <h3 className="text-xl font-bold">{cancha.nombre}</h3>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-medium">{TIPO_DEPORTE[cancha.tipoDeporte]}</span>
            <span className="text-border">•</span>
            <span>{SUPERFICIE[cancha.superficie]}</span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {cancha.capacidad}v{cancha.capacidad}
            </span>
          </div>
        </div>

        {/* Services - Chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {visibleServicios.map((servicio) => {
            const config = SERVICIOS_CONFIG[servicio]
            if (!config) return null
            return (
              <div
                key={servicio}
                className={cn(
                  'rounded-lg bg-gradient-to-r px-3 py-1.5 text-xs font-medium text-white',
                  config.gradient
                )}
              >
                {config.label}
              </div>
            )
          })}
          {hiddenServiciosCount > 0 && (
            <div className="bg-muted text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-medium">
              +{hiddenServiciosCount} más
            </div>
          )}
        </div>

        {/* Price & Stats - Full width row */}
        <div className="border-border/50 mb-4 grid grid-cols-4 gap-4 border-y py-4">
          {/* Precio Día */}
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Día
            </p>
            <p className="text-primary mt-0.5 text-lg font-bold">
              {formatCurrency(cancha.precioHoraBase)}
            </p>
          </div>

          {/* Precio Noche */}
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Noche
            </p>
            <p className="text-secondary mt-0.5 text-lg font-bold">
              {formatCurrency(cancha.precioHoraNoche)}
            </p>
          </div>

          {/* Ocupación */}
          {cancha.ocupacionPromedio !== undefined && cancha.estado === 'activa' && (
            <div>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Ocupación
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    cancha.ocupacionPromedio >= 70
                      ? 'bg-green-500'
                      : cancha.ocupacionPromedio >= 40
                        ? 'bg-yellow-500'
                        : 'bg-muted-foreground'
                  )}
                />
                <span className="text-lg font-bold">{cancha.ocupacionPromedio}%</span>
              </div>
            </div>
          )}

          {/* Stats mes */}
          {cancha.estado === 'activa' && (
            <div>
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Este mes
              </p>
              <p className="mt-0.5 text-lg font-bold">{cancha.totalReservas || 0}</p>
              <p className="text-muted-foreground text-[10px]">reservas</p>
            </div>
          )}
        </div>

        {/* Ingresos */}
        {cancha.estado === 'activa' && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Ingresos del mes:</span>
              <span className="text-lg font-bold text-green-500">
                {formatCurrency(cancha.ingresosMes || 0)}
              </span>
            </div>
          </div>
        )}

        {/* Actions - Bottom */}
        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(cancha)}
          >
            Ver detalles
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(cancha)} title="Editar">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onToggleEstado(cancha.id)}
            title={cancha.estado === 'activa' ? 'Desactivar' : 'Activar'}
          >
            <Power
              className={cn(
                'h-4 w-4',
                cancha.estado === 'activa' ? 'text-green-500' : 'text-muted-foreground'
              )}
            />
          </Button>

          {/* More options */}
          <div className="relative">
            <Button variant="ghost" size="icon-sm" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="border-border bg-popover absolute right-0 bottom-full z-50 mb-1 min-w-[160px] rounded-lg border p-1 shadow-lg">
                  <button
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onManageHorarios(cancha)
                    }}
                  >
                    <Clock className="h-4 w-4" />
                    Configurar horarios
                  </button>
                  <button
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onManageBloqueos(cancha)
                    }}
                  >
                    <Ban className="h-4 w-4" />
                    Gestionar bloqueos
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
