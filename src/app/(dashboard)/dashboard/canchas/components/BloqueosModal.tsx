'use client'

import * as React from 'react'
import { Ban, Plus, Trash2, Calendar, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
  Card,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BloqueoHorario, Cancha } from '../types'

interface BloqueosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cancha: Cancha | null
  bloqueos: BloqueoHorario[]
  onCreate: (bloqueo: Omit<BloqueoHorario, 'id' | 'createdAt'>) => void
  onDelete: (id: string) => void
}

const HORAS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6
  return { value: `${h.toString().padStart(2, '0')}:00`, label: `${h}:00` }
})

const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
]

export function BloqueosModal({
  open,
  onOpenChange,
  cancha,
  bloqueos,
  onCreate,
  onDelete,
}: BloqueosModalProps) {
  const [showForm, setShowForm] = React.useState(false)
  const [formData, setFormData] = React.useState({
    fecha: '',
    horaInicio: '08:00',
    horaFin: '10:00',
    motivo: '',
    esRecurrente: false,
    diasRecurrencia: [] as number[],
  })

  // Filtrar bloqueos de esta cancha
  const bloqueosCancha = bloqueos.filter((b) => b.canchaId === cancha?.id)

  // Bloqueos próximos (ordenados por fecha)
  const bloqueosProximos = [...bloqueosCancha]
    .filter((b) => new Date(b.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  // Bloqueos pasados
  const bloqueosPasados = [...bloqueosCancha]
    .filter((b) => new Date(b.fecha) < new Date())
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(b.fecha).getTime())

  const handleSubmit = () => {
    if (!cancha || !formData.fecha || !formData.motivo) return

    onCreate({
      canchaId: cancha.id,
      canchaNombre: cancha.nombre,
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      motivo: formData.motivo,
      esRecurrente: formData.esRecurrente,
      diasRecurrencia: formData.esRecurrente ? formData.diasRecurrencia : undefined,
    })

    // Reset form
    setFormData({
      fecha: '',
      horaInicio: '08:00',
      horaFin: '10:00',
      motivo: '',
      esRecurrente: false,
      diasRecurrencia: [],
    })
    setShowForm(false)
  }

  const toggleDiaRecurrencia = (dia: number) => {
    setFormData((prev) => ({
      ...prev,
      diasRecurrencia: prev.diasRecurrencia.includes(dia)
        ? prev.diasRecurrencia.filter((d) => d !== dia)
        : [...prev.diasRecurrencia, dia],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Ban className="text-primary h-5 w-5" />
              Bloqueos de Horario
            </h2>
            <p className="text-muted-foreground text-sm">{cancha?.nombre}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo bloqueo
          </Button>
        </div>

        {/* Formulario para nuevo bloqueo */}
        {showForm && (
          <Card className="bg-muted/30 p-4">
            <h3 className="mb-4 font-semibold">Crear nuevo bloqueo</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Horario</Label>
                <div className="flex gap-2">
                  <Select
                    options={HORAS}
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                  />
                  <span className="self-center">a</span>
                  <Select
                    options={HORAS}
                    value={formData.horaFin}
                    onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Input
                  id="motivo"
                  placeholder="Ej: Mantenimiento, Evento privado..."
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.esRecurrente}
                    onChange={(e) => setFormData({ ...formData, esRecurrente: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Repetir semanalmente</span>
                </label>

                {formData.esRecurrente && (
                  <div className="mt-2 flex gap-1">
                    {DIAS_SEMANA.map((dia) => (
                      <button
                        key={dia.value}
                        type="button"
                        onClick={() => toggleDiaRecurrencia(dia.value)}
                        className={cn(
                          'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                          formData.diasRecurrencia.includes(dia.value)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {dia.label.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.fecha || !formData.motivo}>
                Crear bloqueo
              </Button>
            </div>
          </Card>
        )}

        {/* Lista de bloqueos próximos */}
        <div>
          <h3 className="mb-3 font-semibold">Próximos bloqueos</h3>
          {bloqueosProximos.length > 0 ? (
            <div className="space-y-2">
              {bloqueosProximos.map((bloqueo) => (
                <div
                  key={bloqueo.id}
                  className="border-border flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Ban className="text-destructive h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{bloqueo.fecha}</p>
                        <Badge variant="outline" size="sm">
                          {bloqueo.horaInicio} - {bloqueo.horaFin}
                        </Badge>
                        {bloqueo.esRecurrente && (
                          <Badge variant="info" size="sm">
                            Recurrente
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{bloqueo.motivo}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(bloqueo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-border rounded-lg border border-dashed p-8 text-center">
              <Calendar className="text-muted-foreground mx-auto h-8 w-8" />
              <p className="text-muted-foreground mt-2">No hay bloqueos programados</p>
            </div>
          )}
        </div>

        {/* Bloqueos pasados (colapsado) */}
        {bloqueosPasados.length > 0 && (
          <details className="group">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
              Ver bloqueos pasados ({bloqueosPasados.length})
            </summary>
            <div className="mt-2 space-y-2 opacity-60">
              {bloqueosPasados.slice(0, 5).map((bloqueo) => (
                <div
                  key={bloqueo.id}
                  className="border-border flex items-center justify-between rounded-lg border p-2 text-sm"
                >
                  <span>
                    {bloqueo.fecha} ({bloqueo.horaInicio} - {bloqueo.horaFin})
                  </span>
                  <span className="text-muted-foreground">{bloqueo.motivo}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Footer */}
        <div className="border-border flex justify-end border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
