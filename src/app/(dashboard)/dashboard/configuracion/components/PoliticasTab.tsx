'use client'

import * as React from 'react'
import { Clock, AlertTriangle, XCircle, RefreshCw, Save, Info } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  Textarea,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type { PoliticasConfig, PoliticaExceso } from '../types'
import {
  POLITICA_EXCESO_CONFIG,
  TOLERANCIA_OPTIONS,
  CANCELACION_OPTIONS,
  REEMBOLSO_OPTIONS,
} from '../types'

interface PoliticasTabProps {
  politicasConfig: PoliticasConfig
  onUpdate: (data: Partial<PoliticasConfig>) => Promise<void>
  loading: boolean
}

export function PoliticasTab({ politicasConfig, onUpdate, loading }: PoliticasTabProps) {
  const [formData, setFormData] = React.useState(politicasConfig)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    setFormData(politicasConfig)
  }, [politicasConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onUpdate(formData)
    } finally {
      setIsSaving(false)
    }
  }

  const toleranciaOption = TOLERANCIA_OPTIONS.find((o) => o.value === formData.toleranciaMinutos)
  const cancelacionOption = CANCELACION_OPTIONS.find((o) => o.value === formData.cancelacionHoras)
  const reembolsoOption = REEMBOLSO_OPTIONS.find((o) => o.value === formData.reembolsoPorcentaje)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preview de políticas */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Info className="text-primary h-5 w-5" />
            <span className="font-medium">Vista previa de tus políticas</span>
          </div>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>
              ⏱️ Tolerancia de llegada: <strong>{toleranciaOption?.label || 'Sin definir'}</strong>
            </p>
            <p>
              ❌ Cancelación gratuita: <strong>{cancelacionOption?.label || 'Sin definir'}</strong>
            </p>
            <p>
              💰 Reembolso por cancelación:{' '}
              <strong>{reembolsoOption?.label || 'Sin definir'}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tolerancia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tolerancia de llegada
          </CardTitle>
          <CardDescription>
            Tiempo de gracia que tienen los clientes después de la hora de inicio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="toleranciaMinutos">Minutos de tolerancia</Label>
              <Select
                id="toleranciaMinutos"
                options={TOLERANCIA_OPTIONS.map((o) => ({
                  value: String(o.value),
                  label: o.label,
                }))}
                value={String(formData.toleranciaMinutos)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    toleranciaMinutos: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Visualización */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">
                  {formData.toleranciaMinutos === 0
                    ? 'Sin tolerancia'
                    : `${formData.toleranciaMinutos} minutos de gracia`}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formData.toleranciaMinutos === 0
                    ? 'El cliente debe llegar a la hora exacta'
                    : `El cliente tiene ${formData.toleranciaMinutos} minutos después de la hora de inicio`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Política de exceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Política de exceso
          </CardTitle>
          <CardDescription>
            Qué sucede cuando el cliente excede el tiempo de tolerancia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecciona la política</Label>
            <div className="grid gap-2">
              {(
                Object.entries(POLITICA_EXCESO_CONFIG) as [
                  PoliticaExceso,
                  typeof POLITICA_EXCESO_CONFIG.perder_reserva,
                ][]
              ).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, politicaExceso: key }))}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-all',
                    formData.politicaExceso === key
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <p className="font-medium">{config.label}</p>
                  <p className="text-muted-foreground text-sm">{config.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Campos adicionales para penalidad */}
          {formData.politicaExceso === 'penalidad' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="penalidadMonto">Monto de penalidad (S/)</Label>
                <Input
                  id="penalidadMonto"
                  type="number"
                  min={0}
                  value={formData.penalidadMonto || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      penalidadMonto: parseInt(e.target.value) || undefined,
                    }))
                  }
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penalidadPorcentaje">O porcentaje (%)</Label>
                <Input
                  id="penalidadPorcentaje"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.penalidadPorcentaje || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      penalidadPorcentaje: parseInt(e.target.value) || undefined,
                    }))
                  }
                  placeholder="10"
                />
              </div>
            </div>
          )}

          {/* Campo para política personalizada */}
          {formData.politicaExceso === 'configurable' && (
            <div className="space-y-2">
              <Label htmlFor="textoPoliticaPersonalizada">Describe tu política</Label>
              <Textarea
                id="textoPoliticaPersonalizada"
                value={formData.textoPoliticaPersonalizada || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textoPoliticaPersonalizada: e.target.value,
                  }))
                }
                placeholder="Ej: Si llega más de 15 minutos tarde, se descuenta 10 minutos del tiempo de juego..."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancelación y reembolso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Cancelación y reembolso
          </CardTitle>
          <CardDescription>Condiciones para cancelaciones y reembolsos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cancelacionHoras">Cancelación gratuita</Label>
              <Select
                id="cancelacionHoras"
                options={CANCELACION_OPTIONS.map((o) => ({
                  value: String(o.value),
                  label: o.label,
                }))}
                value={String(formData.cancelacionHoras)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cancelacionHoras: parseInt(e.target.value),
                  }))
                }
              />
              <p className="text-muted-foreground text-xs">
                Horas de anticipación necesarias para cancelar sin costo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reembolsoPorcentaje">Porcentaje de reembolso</Label>
              <Select
                id="reembolsoPorcentaje"
                options={REEMBOLSO_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
                value={String(formData.reembolsoPorcentaje)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reembolsoPorcentaje: parseInt(e.target.value),
                  }))
                }
              />
              <p className="text-muted-foreground text-xs">
                Porcentaje devuelto si cancela fuera del plazo gratuito
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Resumen de políticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <span className="text-lg">⏱️</span>
              <div>
                <p className="font-medium">Tolerancia</p>
                <p className="text-muted-foreground">
                  {formData.toleranciaMinutos === 0
                    ? 'Sin tiempo de gracia. El cliente debe llegar puntual.'
                    : `${formData.toleranciaMinutos} minutos después de la hora de inicio.`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-medium">Si llega tarde</p>
                <p className="text-muted-foreground">
                  {POLITICA_EXCESO_CONFIG[formData.politicaExceso].description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <span className="text-lg">❌</span>
              <div>
                <p className="font-medium">Cancelación</p>
                <p className="text-muted-foreground">
                  Gratis hasta {formData.cancelacionHoras} horas antes. Después,{' '}
                  {formData.reembolsoPorcentaje}% de reembolso.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving || loading}>
          <Save className="mr-2 h-4 w-4" />
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
