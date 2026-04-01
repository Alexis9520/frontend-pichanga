'use client'

import * as React from 'react'
import {
  Edit,
  Trash2,
  Copy,
  Eye,
  Clock,
  Calendar,
  MapPin,
  MoreVertical,
  Percent,
  DollarSign,
  Timer,
  Package,
  Repeat,
} from 'lucide-react'
import { Button, Badge, Switch } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Promocion } from '../types'

interface PromocionCardProps {
  promocion: Promocion
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onViewDetails: () => void
  onToggleActiva: () => void
}

// Configuración de tipos
const TIPO_CONFIG = {
  descuento_porcentual: {
    label: '% OFF',
    icon: Percent,
    gradient: 'from-green-500 to-green-600',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-600',
  },
  precio_fijo: {
    label: 'Precio Fijo',
    icon: DollarSign,
    gradient: 'from-orange-500 to-orange-600',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-600',
  },
  combo_horas: {
    label: 'Combo Horas',
    icon: Timer,
    gradient: 'from-blue-500 to-blue-600',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-600',
  },
  combo_productos: {
    label: 'Combo Productos',
    icon: Package,
    gradient: 'from-purple-500 to-purple-600',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-600',
  },
  recurrencia: {
    label: 'Recurrencia',
    icon: Repeat,
    gradient: 'from-pink-500 to-pink-600',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-600',
  },
}

// Días de la semana
const DIAS_SHORT = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

// Estados
const ESTADO_CONFIG = {
  activa: { label: 'Activa', variant: 'success' as const },
  inactiva: { label: 'Inactiva', variant: 'outline' as const },
  agotada: { label: 'Agotada', variant: 'warning' as const },
  vencida: { label: 'Vencida', variant: 'destructive' as const },
}

export function PromocionCard({
  promocion,
  onEdit,
  onDelete,
  onDuplicate,
  onViewDetails,
  onToggleActiva,
}: PromocionCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)

  const tipoConfig = TIPO_CONFIG[promocion.tipo]
  const estadoConfig = ESTADO_CONFIG[promocion.estado]
  const TipoIcon = tipoConfig.icon

  // Calcular porcentaje de cupos
  const cuposPorcentaje = (promocion.cuposUsadosHoy / promocion.cuposMaximos) * 100

  // Formatear valor según tipo
  const formatValor = () => {
    switch (promocion.tipo) {
      case 'descuento_porcentual':
        return `${promocion.valor}% OFF`
      case 'precio_fijo':
        return formatCurrency(promocion.valor)
      case 'combo_horas':
        return `${promocion.horasBase}h por ${promocion.horasCobradas}h`
      case 'combo_productos':
        return formatCurrency(promocion.valor)
      case 'recurrencia':
        return `${promocion.numeroReserva}ra reserva -${promocion.valor}%`
      default:
        return promocion.valor.toString()
    }
  }

  // Formatear horarios
  const formatHorarios = () => {
    if (promocion.horarios.length === 1) {
      const h = promocion.horarios[0]
      return `${h.inicio} - ${h.fin}`
    }
    return `${promocion.horarios.length} rangos`
  }

  const isDisabled = !promocion.activa || promocion.estado === 'vencida'

  return (
    <div
      className={cn(
        'group border-border bg-card hover:border-primary/30 rounded-2xl border-2 transition-all hover:shadow-lg',
        isDisabled && 'opacity-60 grayscale-[30%]'
      )}
    >
      {/* Header con gradiente */}
      <div className={cn('relative rounded-t-xl px-4 py-3', tipoConfig.bgClass)}>
        <div className="flex items-center justify-between">
          {/* Tipo badge */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                tipoConfig.gradient
              )}
            >
              <TipoIcon className="h-4 w-4 text-white" />
            </div>
            <span className={cn('text-sm font-medium', tipoConfig.textClass)}>
              {tipoConfig.label}
            </span>
          </div>

          {/* Estado badge */}
          <Badge variant={estadoConfig.variant} size="sm" dot>
            {estadoConfig.label}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Nombre y valor */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{promocion.nombre}</h3>
            <p className={cn('text-lg font-bold', tipoConfig.textClass)}>{formatValor()}</p>
          </div>
          <Switch checked={promocion.activa} onChange={onToggleActiva} />
        </div>

        {/* Días de la semana */}
        <div className="mb-3 flex gap-1">
          {DIAS_SHORT.map((dia, i) => {
            const isActive = promocion.diasAplicables.includes(i)
            return (
              <span
                key={i}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {dia}
              </span>
            )
          })}
        </div>

        {/* Info */}
        <div className="text-muted-foreground mb-3 space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{formatHorarios()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>
              {promocion.fechaInicio} - {promocion.fechaFin}
            </span>
          </div>
        </div>

        {/* Cupos */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cupos hoy</span>
            <span className="font-medium">
              {promocion.cuposUsadosHoy}/{promocion.cuposMaximos}
            </span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                cuposPorcentaje >= 100
                  ? 'bg-red-500'
                  : cuposPorcentaje >= 80
                    ? 'bg-amber-500'
                    : 'bg-primary'
              )}
              style={{ width: `${Math.min(cuposPorcentaje, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-sm font-bold">{promocion.usosSemana}</p>
            <p className="text-muted-foreground text-[10px]">Esta sem.</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-sm font-bold">{promocion.usosTotales}</p>
            <p className="text-muted-foreground text-[10px]">Total</p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-2">
            <p className="text-sm font-bold text-green-600">
              {formatCurrency(promocion.ahorroGenerado)}
            </p>
            <p className="text-muted-foreground text-[10px]">Ahorro</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="border-border flex items-center gap-2 border-t pt-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
            <Eye className="mr-1 h-3 w-3" />
            Ver
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon-sm" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="border-border bg-popover absolute right-0 bottom-full z-50 mb-1 min-w-[140px] rounded-lg border p-1 shadow-lg">
                  <button
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onEdit()
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onDuplicate()
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Duplicar
                  </button>
                  <button
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onDelete()
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
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
