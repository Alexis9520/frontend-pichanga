'use client'

import * as React from 'react'
import { Clock, Copy, Calendar, TrendingUp, Coffee } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { HorarioDia } from '../types'

interface HorariosConfigProps {
  canchaId: string
  horarios: HorarioDia[]
  onSave: (horarios: HorarioDia[]) => void
  onCancel: () => void
}

const DIAS_SEMANA = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
]

const HORAS = Array.from({ length: 19 }, (_, i) => {
  const h = i + 6
  return h === 24 ? 24 : h
})

// Convierte hora string a posición porcentual (06:00 = 0%, 24:00 = 100%)
const horaToPercent = (hora: string): number => {
  const h = parseInt(hora.split(':')[0])
  return ((h - 6) / 18) * 100
}

// Calcula horas totales entre apertura y cierre
const calcularHoras = (apertura: string, cierre: string): number => {
  const a = parseInt(apertura.split(':')[0])
  const c = parseInt(cierre.split(':')[0])
  return c - a
}

export function HorariosConfig({ canchaId, horarios, onSave, onCancel }: HorariosConfigProps) {
  const [localHorarios, setLocalHorarios] = React.useState<HorarioDia[]>(() => {
    return DIAS_SEMANA.map((dia) => {
      const existente = horarios.find((h) => h.canchaId === canchaId && h.diaSemana === dia.value)
      return (
        existente || {
          id: `${canchaId}-${dia.value}`,
          canchaId,
          diaSemana: dia.value,
          horaApertura: '08:00',
          horaCierre: '22:00',
          activo: true,
        }
      )
    })
  })

  const [selectedDia, setSelectedDia] = React.useState<number | null>(null)

  const updateHorario = (diaSemana: number, field: keyof HorarioDia, value: string | boolean) => {
    setLocalHorarios((prev) =>
      prev.map((h) => (h.diaSemana === diaSemana ? { ...h, [field]: value } : h))
    )
  }

  // Aplicar mismo horario a todos los días
  const aplicarTodos = () => {
    const source = localHorarios.find((h) => h.diaSemana === 1) // Lunes
    if (!source) return
    setLocalHorarios((prev) =>
      prev.map((h) => ({
        ...h,
        horaApertura: source.horaApertura,
        horaCierre: source.horaCierre,
        activo: true,
      }))
    )
  }

  // Aplicar horario laboral (Lun-Vie igual, Sáb-Dom diferente)
  const aplicarLaboral = () => {
    const lunes = localHorarios.find((h) => h.diaSemana === 1)
    if (!lunes) return
    setLocalHorarios((prev) =>
      prev.map((h) => {
        // Lun-Vie mismo horario
        if (h.diaSemana >= 1 && h.diaSemana <= 5) {
          return {
            ...h,
            horaApertura: lunes.horaApertura,
            horaCierre: lunes.horaCierre,
            activo: true,
          }
        }
        // Sáb más corto, Dom descanso o reducido
        if (h.diaSemana === 6) {
          return { ...h, horaApertura: '06:00', horaCierre: '22:00', activo: true }
        }
        if (h.diaSemana === 0) {
          return { ...h, horaApertura: '08:00', horaCierre: '20:00', activo: true }
        }
        return h
      })
    )
  }

  // Calcular estadísticas
  const totalHoras = localHorarios.reduce((acc, h) => {
    if (!h.activo) return acc
    return acc + calcularHoras(h.horaApertura, h.horaCierre)
  }, 0)

  const diasActivos = localHorarios.filter((h) => h.activo).length
  const promedioDiario = diasActivos > 0 ? (totalHoras / diasActivos).toFixed(1) : 0
  const diasDescanso = 7 - diasActivos

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="text-primary h-5 w-5" />
            Configurar Horarios
          </h3>
          <p className="text-muted-foreground text-sm">
            Haz clic en una barra para editar el horario
          </p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={aplicarTodos}>
          <Copy className="mr-2 h-4 w-4" />
          Mismo horario todos los días
        </Button>
        <Button variant="outline" size="sm" onClick={aplicarLaboral}>
          <Calendar className="mr-2 h-4 w-4" />
          Días laborales igual
        </Button>
      </div>

      {/* Timeline Grid */}
      <div className="border-border bg-card rounded-xl border p-4">
        {/* Header de horas */}
        <div className="mb-2 ml-16 flex">
          {HORAS.filter((_, i) => i % 2 === 0).map((h) => (
            <div key={h} className="text-muted-foreground flex-1 text-center text-xs font-medium">
              {h.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Filas por día */}
        <div className="space-y-1">
          {localHorarios.map((horario) => {
            const diaInfo = DIAS_SEMANA.find((d) => d.value === horario.diaSemana)!
            const isSelected = selectedDia === horario.diaSemana

            return (
              <div key={horario.diaSemana} className="flex items-center gap-3">
                {/* Nombre del día */}
                <div className="w-14 shrink-0 text-right">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      !horario.activo && 'text-muted-foreground'
                    )}
                  >
                    {diaInfo.short}
                  </span>
                </div>

                {/* Barra de tiempo */}
                <div
                  className={cn(
                    'relative h-8 flex-1 cursor-pointer rounded-lg transition-all',
                    horario.activo ? 'bg-muted hover:bg-muted/80' : 'bg-muted/30',
                    isSelected && 'ring-primary ring-2'
                  )}
                  onClick={() => setSelectedDia(isSelected ? null : horario.diaSemana)}
                >
                  {horario.activo ? (
                    <>
                      {/* Barra de horario activo */}
                      <div
                        className="from-primary to-primary/70 absolute top-0 h-full rounded-lg bg-gradient-to-r shadow-sm transition-all"
                        style={{
                          left: `${horaToPercent(horario.horaApertura)}%`,
                          width: `${horaToPercent(horario.horaCierre) - horaToPercent(horario.horaApertura)}%`,
                        }}
                      />
                      {/* Labels de horas */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 text-xs font-medium text-white"
                        style={{ left: `${horaToPercent(horario.horaApertura) + 1}%` }}
                      >
                        {horario.horaApertura}
                      </div>
                      <div
                        className="absolute top-1/2 -translate-y-1/2 text-xs font-medium text-white"
                        style={{ right: `${100 - horaToPercent(horario.horaCierre) + 1}%` }}
                      >
                        {horario.horaCierre}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Coffee className="h-3 w-3" />
                        Descanso
                      </span>
                    </div>
                  )}
                </div>

                {/* Horas totales */}
                <div className="w-16 shrink-0 text-right">
                  {horario.activo && (
                    <span className="text-muted-foreground text-xs font-medium">
                      {calcularHoras(horario.horaApertura, horario.horaCierre)}h
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Editor del día seleccionado */}
        {selectedDia !== null && (
          <div className="border-border bg-muted/50 mt-4 rounded-lg border p-4">
            {(() => {
              const horario = localHorarios.find((h) => h.diaSemana === selectedDia)!
              const diaInfo = DIAS_SEMANA.find((d) => d.value === selectedDia)!

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{diaInfo.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">Activo</span>
                      <button
                        onClick={() => updateHorario(selectedDia, 'activo', !horario.activo)}
                        className={cn(
                          'relative h-6 w-11 rounded-full transition-colors',
                          horario.activo ? 'bg-primary' : 'bg-muted'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                            horario.activo ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {horario.activo && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted-foreground mb-1 block text-xs font-medium">
                          Apertura
                        </label>
                        <select
                          value={horario.horaApertura}
                          onChange={(e) =>
                            updateHorario(selectedDia, 'horaApertura', e.target.value)
                          }
                          className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm font-medium"
                        >
                          {HORAS.slice(0, -1).map((h) => (
                            <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                              {h.toString().padStart(2, '0')}:00
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-muted-foreground mb-1 block text-xs font-medium">
                          Cierre
                        </label>
                        <select
                          value={horario.horaCierre}
                          onChange={(e) => updateHorario(selectedDia, 'horaCierre', e.target.value)}
                          className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm font-medium"
                        >
                          {HORAS.slice(1).map((h) => (
                            <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                              {h.toString().padStart(2, '0')}:00
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border-border bg-card rounded-lg border p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="text-primary h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold">{totalHoras}h</div>
          <div className="text-muted-foreground text-xs">Total/semana</div>
        </div>
        <div className="border-border bg-card rounded-lg border p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock className="text-secondary h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold">{promedioDiario}h</div>
          <div className="text-muted-foreground text-xs">Promedio/día</div>
        </div>
        <div className="border-border bg-card rounded-lg border p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Coffee className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold">{diasDescanso}</div>
          <div className="text-muted-foreground text-xs">Días descanso</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(localHorarios)}>Guardar horarios</Button>
      </div>
    </div>
  )
}
