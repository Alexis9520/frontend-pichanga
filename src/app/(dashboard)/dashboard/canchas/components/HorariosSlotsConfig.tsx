'use client'

import * as React from 'react'
import {
  Clock,
  DollarSign,
  Star,
  Copy,
  Grid3X3,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Button, Badge, Input } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'

// ===========================================
// TIPOS
// ===========================================
export interface TimeSlot {
  id: string
  startTime: string // "06:00", "06:30", "07:00", etc.
  endTime: string
  price: number
  isPremium: boolean
  isActive: boolean
}

export interface DaySlotConfig {
  dayOfWeek: number // 0-6
  slots: TimeSlot[]
  isOpen: boolean
}

interface HorariosSlotsConfigProps {
  canchaId: string
  precioBase: number
  precioNoche: number
  horaInicioNoche: string
  onSave: (config: DaySlotConfig[]) => void
  onCancel: () => void
  initialConfig?: DaySlotConfig[]
}

// ===========================================
// CONSTANTES
// ===========================================
const DIAS_SEMANA = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
]

// Generar slots de 30 min de 6:00 a 24:00
const generateSlots = (
  precioBase: number,
  precioNoche: number,
  horaInicioNoche: string
): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const nightHour = parseInt(horaInicioNoche.split(':')[0])

  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const startTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      const endHour = m === 30 ? h + 1 : h
      const endMin = m === 30 ? 0 : 30
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`

      const isNight = h >= nightHour
      const isPremium = m === 0 // Horas en punto son premium

      slots.push({
        id: `slot-${startTime}`,
        startTime,
        endTime,
        price: isNight ? precioNoche : precioBase,
        isPremium,
        isActive: true,
      })
    }
  }

  return slots
}

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================
export function HorariosSlotsConfig({
  canchaId,
  precioBase,
  precioNoche,
  horaInicioNoche,
  onSave,
  onCancel,
  initialConfig,
}: HorariosSlotsConfigProps) {
  // Estado local de configuración
  const [config, setConfig] = React.useState<DaySlotConfig[]>(() => {
    if (initialConfig && initialConfig.length > 0) {
      return initialConfig
    }

    return DIAS_SEMANA.map((dia) => ({
      dayOfWeek: dia.value,
      isOpen: true,
      slots: generateSlots(precioBase, precioNoche, horaInicioNoche),
    }))
  })

  // Día seleccionado
  const [selectedDay, setSelectedDay] = React.useState(1) // Lunes por defecto

  // Rango de horas visible (para scroll horizontal)
  const [startHour, setStartHour] = React.useState(8)
  const visibleHours = 10

  // Slot seleccionado para editar precio
  const [editingSlot, setEditingSlot] = React.useState<string | null>(null)
  const [editPrice, setEditPrice] = React.useState('')

  // Obtener configuración del día seleccionado
  const selectedDayConfig = config.find((c) => c.dayOfWeek === selectedDay)

  // Toggle día abierto/cerrado
  const toggleDayOpen = (dayOfWeek: number) => {
    setConfig((prev) =>
      prev.map((c) => (c.dayOfWeek === dayOfWeek ? { ...c, isOpen: !c.isOpen } : c))
    )
  }

  // Toggle slot activo/inactivo
  const toggleSlot = (dayOfWeek: number, slotId: string) => {
    setConfig((prev) =>
      prev.map((c) => {
        if (c.dayOfWeek !== dayOfWeek) return c
        return {
          ...c,
          slots: c.slots.map((s) => (s.id === slotId ? { ...s, isActive: !s.isActive } : s)),
        }
      })
    )
  }

  // Toggle slot premium
  const togglePremium = (dayOfWeek: number, slotId: string) => {
    setConfig((prev) =>
      prev.map((c) => {
        if (c.dayOfWeek !== dayOfWeek) return c
        return {
          ...c,
          slots: c.slots.map((s) => (s.id === slotId ? { ...s, isPremium: !s.isPremium } : s)),
        }
      })
    )
  }

  // Actualizar precio de slot
  const updateSlotPrice = (dayOfWeek: number, slotId: string, price: number) => {
    setConfig((prev) =>
      prev.map((c) => {
        if (c.dayOfWeek !== dayOfWeek) return c
        return {
          ...c,
          slots: c.slots.map((s) => (s.id === slotId ? { ...s, price } : s)),
        }
      })
    )
  }

  // Aplicar precio a rango de horas
  const applyPriceToRange = (
    dayOfWeek: number,
    startHourRange: number,
    endHourRange: number,
    price: number
  ) => {
    setConfig((prev) =>
      prev.map((c) => {
        if (c.dayOfWeek !== dayOfWeek) return c
        return {
          ...c,
          slots: c.slots.map((s) => {
            const slotHour = parseInt(s.startTime.split(':')[0])
            if (slotHour >= startHourRange && slotHour < endHourRange) {
              return { ...s, price }
            }
            return s
          }),
        }
      })
    )
  }

  // Aplicar mismo precio a todos los slots del día
  const applySamePriceAllDay = (dayOfWeek: number, price: number) => {
    setConfig((prev) =>
      prev.map((c) => {
        if (c.dayOfWeek !== dayOfWeek) return c
        return {
          ...c,
          slots: c.slots.map((s) => ({ ...s, price })),
        }
      })
    )
  }

  // Copiar configuración de un día a todos
  const copyToAllDays = (fromDay: number) => {
    const sourceConfig = config.find((c) => c.dayOfWeek === fromDay)
    if (!sourceConfig) return

    setConfig((prev) =>
      prev.map((c) => ({
        ...c,
        slots: sourceConfig.slots.map((s) => ({ ...s })),
      }))
    )
  }

  // Calcular estadísticas
  const stats = React.useMemo(() => {
    const dayConfig = config.find((c) => c.dayOfWeek === selectedDay)
    if (!dayConfig || !dayConfig.isOpen) {
      return { activeSlots: 0, avgPrice: 0, premiumSlots: 0, estimatedRevenue: 0 }
    }

    const activeSlots = dayConfig.slots.filter((s) => s.isActive)
    const total = activeSlots.reduce((acc, s) => acc + s.price, 0)
    const premium = activeSlots.filter((s) => s.isPremium).length

    return {
      activeSlots: activeSlots.length,
      avgPrice: activeSlots.length > 0 ? Math.round(total / activeSlots.length) : 0,
      premiumSlots: premium,
      estimatedRevenue: total,
    }
  }, [config, selectedDay])

  // Obtener slots visibles
  const visibleSlots = React.useMemo(() => {
    if (!selectedDayConfig) return []
    return selectedDayConfig.slots.filter((s) => {
      const hour = parseInt(s.startTime.split(':')[0])
      return hour >= startHour && hour < startHour + visibleHours
    })
  }, [selectedDayConfig, startHour, visibleHours])

  // Agrupar slots por hora para mostrar
  const slotsByHour = React.useMemo(() => {
    const grouped: Record<number, TimeSlot[]> = {}
    visibleSlots.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(':')[0])
      if (!grouped[hour]) grouped[hour] = []
      grouped[hour].push(slot)
    })
    return grouped
  }, [visibleSlots])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Grid3X3 className="text-primary h-5 w-5" />
            Configurar Horarios y Precios por Slot
          </h3>
          <p className="text-muted-foreground text-sm">
            Configura slots de 30 min con precios diferenciados
          </p>
        </div>
      </div>

      {/* Selector de día */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {DIAS_SEMANA.map((dia) => {
          const dayConfig = config.find((c) => c.dayOfWeek === dia.value)
          const isSelected = selectedDay === dia.value
          const isOpen = dayConfig?.isOpen ?? true

          return (
            <button
              key={dia.value}
              onClick={() => setSelectedDay(dia.value)}
              className={cn(
                'flex min-w-[70px] flex-col items-center rounded-xl border-2 px-3 py-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                !isOpen && 'opacity-50'
              )}
            >
              <span className="text-xs font-medium">{dia.short}</span>
              {isSelected && (
                <Badge variant="success" size="sm" className="mt-1">
                  Editando
                </Badge>
              )}
            </button>
          )
        })}
      </div>

      {/* Controles del día */}
      <div className="border-border bg-muted/30 flex items-center justify-between rounded-xl border p-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {DIAS_SEMANA.find((d) => d.value === selectedDay)?.label}
          </span>
          <button
            onClick={() => toggleDayOpen(selectedDay)}
            className={cn(
              'relative h-6 w-11 rounded-full transition-colors',
              selectedDayConfig?.isOpen ? 'bg-primary' : 'bg-muted'
            )}
          >
            <div
              className={cn(
                'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                selectedDayConfig?.isOpen ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className="text-muted-foreground text-xs">
            {selectedDayConfig?.isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToAllDays(selectedDay)}
            title="Copiar configuración a todos los días"
          >
            <Copy className="mr-1 h-4 w-4" />
            Copiar a todos
          </Button>
        </div>
      </div>

      {/* Grid de slots */}
      {selectedDayConfig?.isOpen && (
        <div className="space-y-3">
          {/* Controles de navegación */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStartHour(Math.max(6, startHour - 2))}
              disabled={startHour <= 6}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground text-sm">
              {startHour.toString().padStart(2, '0')}:00 -{' '}
              {(startHour + visibleHours).toString().padStart(2, '0')}:00
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStartHour(Math.min(14, startHour + 2))}
              disabled={startHour >= 14}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Grid de slots */}
          <div className="border-border overflow-x-auto rounded-xl border">
            <div className="min-w-[600px]">
              {/* Header con horas */}
              <div className="border-border bg-muted/50 grid grid-cols-11 gap-0.5 border-b px-2 py-2">
                <div className="text-muted-foreground text-xs font-medium">Hora</div>
                {Array.from({ length: 10 }, (_, i) => startHour + i).map((h) => (
                  <div key={h} className="text-muted-foreground text-center text-xs font-medium">
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Filas de slots */}
              <div className="space-y-0.5 p-2">
                {/* Primera fila: minutos :00 */}
                <div className="grid grid-cols-11 gap-0.5">
                  <div className="text-muted-foreground flex items-center text-xs font-medium">
                    :00
                  </div>
                  {Array.from({ length: 10 }, (_, i) => startHour + i).map((hour) => {
                    const slot = slotsByHour[hour]?.[0]
                    if (!slot) return <div key={hour} className="h-12" />

                    return (
                      <button
                        key={slot.id}
                        onClick={() => toggleSlot(selectedDay, slot.id)}
                        onDoubleClick={() => {
                          setEditingSlot(slot.id)
                          setEditPrice(slot.price.toString())
                        }}
                        className={cn(
                          'group relative flex h-12 flex-col items-center justify-center rounded-lg border-2 transition-all',
                          slot.isActive
                            ? slot.isPremium
                              ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20'
                              : 'border-primary bg-primary/5 hover:bg-primary/10'
                            : 'border-border bg-muted/30 hover:bg-muted/50 border-dashed'
                        )}
                      >
                        {slot.isPremium && (
                          <Star className="absolute top-1 right-1 h-3 w-3 text-yellow-500" />
                        )}
                        <span className="text-xs font-bold">{formatCurrency(slot.price)}</span>
                        {editingSlot === slot.id && (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            onBlur={() => {
                              updateSlotPrice(
                                selectedDay,
                                slot.id,
                                parseInt(editPrice) || slot.price
                              )
                              setEditingSlot(null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateSlotPrice(
                                  selectedDay,
                                  slot.id,
                                  parseInt(editPrice) || slot.price
                                )
                                setEditingSlot(null)
                              }
                            }}
                            className="absolute inset-0 rounded-lg bg-white p-1 text-center text-xs font-bold"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Segunda fila: minutos :30 */}
                <div className="grid grid-cols-11 gap-0.5">
                  <div className="text-muted-foreground flex items-center text-xs font-medium">
                    :30
                  </div>
                  {Array.from({ length: 10 }, (_, i) => startHour + i).map((hour) => {
                    const slot = slotsByHour[hour]?.[1]
                    if (!slot) return <div key={hour} className="h-12" />

                    return (
                      <button
                        key={slot.id}
                        onClick={() => toggleSlot(selectedDay, slot.id)}
                        onDoubleClick={() => {
                          setEditingSlot(slot.id)
                          setEditPrice(slot.price.toString())
                        }}
                        className={cn(
                          'group relative flex h-12 flex-col items-center justify-center rounded-lg border-2 transition-all',
                          slot.isActive
                            ? slot.isPremium
                              ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20'
                              : 'border-primary bg-primary/5 hover:bg-primary/10'
                            : 'border-border bg-muted/30 hover:bg-muted/50 border-dashed'
                        )}
                      >
                        {slot.isPremium && (
                          <Star className="absolute top-1 right-1 h-3 w-3 text-yellow-500" />
                        )}
                        <span className="text-xs font-bold">{formatCurrency(slot.price)}</span>
                        {editingSlot === slot.id && (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            onBlur={() => {
                              updateSlotPrice(
                                selectedDay,
                                slot.id,
                                parseInt(editPrice) || slot.price
                              )
                              setEditingSlot(null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateSlotPrice(
                                  selectedDay,
                                  slot.id,
                                  parseInt(editPrice) || slot.price
                                )
                                setEditingSlot(null)
                              }
                            }}
                            className="absolute inset-0 rounded-lg bg-white p-1 text-center text-xs font-bold"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="border-primary bg-primary/5 h-4 w-4 rounded border-2" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded border-2 border-yellow-400 bg-yellow-50" />
              <Star className="h-3 w-3 text-yellow-500" />
              <span>Premium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="border-border bg-muted/30 h-4 w-4 rounded border-2 border-dashed" />
              <span>No disponible</span>
            </div>
            <span className="ml-auto">Click: activar/desactivar | Doble click: editar precio</span>
          </div>
        </div>
      )}

      {/* Acciones rápidas de precio */}
      {selectedDayConfig?.isOpen && (
        <div className="border-border rounded-xl border p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Ajuste rápido de precios
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">
                Precio para horario seleccionado
              </label>
              <div className="flex gap-2">
                <Input type="number" placeholder="S/ 0.00" className="flex-1" id="bulkPrice" />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('bulkPrice') as HTMLInputElement
                    const price = parseInt(input?.value || '0')
                    if (price > 0) {
                      applyPriceToRange(selectedDay, startHour, startHour + visibleHours, price)
                    }
                  }}
                >
                  Aplicar
                </Button>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Aplica a horarios visibles ({startHour}:00 - {startHour + visibleHours}:00)
              </p>
            </div>

            <div>
              <label className="text-muted-foreground mb-1 block text-xs">
                Mismo precio todo el día
              </label>
              <div className="flex gap-2">
                <Input type="number" placeholder="S/ 0.00" className="flex-1" id="allDayPrice" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('allDayPrice') as HTMLInputElement
                    const price = parseInt(input?.value || '0')
                    if (price > 0) {
                      applySamePriceAllDay(selectedDay, price)
                    }
                  }}
                >
                  Aplicar
                </Button>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Aplica el mismo precio a todos los slots
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      {selectedDayConfig?.isOpen && (
        <div className="grid grid-cols-4 gap-3">
          <div className="border-border bg-card rounded-lg border p-3 text-center">
            <div className="text-xl font-bold">{stats.activeSlots}</div>
            <div className="text-muted-foreground text-xs">Slots activos</div>
          </div>
          <div className="border-border bg-card rounded-lg border p-3 text-center">
            <div className="text-xl font-bold">{formatCurrency(stats.avgPrice)}</div>
            <div className="text-muted-foreground text-xs">Precio promedio</div>
          </div>
          <div className="border-border bg-card rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-xl font-bold">{stats.premiumSlots}</span>
            </div>
            <div className="text-muted-foreground text-xs">Premium</div>
          </div>
          <div className="border-border bg-card rounded-lg border p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="text-primary h-4 w-4" />
              <span className="text-xl font-bold">{formatCurrency(stats.estimatedRevenue)}</span>
            </div>
            <div className="text-muted-foreground text-xs">Ingreso potencial</div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(config)}>Guardar configuración</Button>
      </div>
    </div>
  )
}
