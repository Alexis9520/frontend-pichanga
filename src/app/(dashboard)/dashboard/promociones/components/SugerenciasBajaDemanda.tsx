'use client'

import * as React from 'react'
import { AlertTriangle, Zap, X, TrendingDown } from 'lucide-react'
import { Button, Badge, Card } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { SugerenciaBajaDemanda } from '../types'

interface SugerenciasBajaDemandaProps {
  sugerencias: SugerenciaBajaDemanda[]
  onCrearPromocion: (sugerencia: SugerenciaBajaDemanda) => void
  onDescartar: (id: string) => void
}

const TIPO_CONFIG: Record<string, { label: string; color: string }> = {
  descuento_porcentual: { label: '% OFF', color: 'text-primary' },
  precio_fijo: { label: 'Precio fijo', color: 'text-secondary' },
}

export function SugerenciasBajaDemandaPanel({
  sugerencias,
  onCrearPromocion,
  onDescartar,
}: SugerenciasBajaDemandaProps) {
  if (sugerencias.length === 0) return null

  return (
    <Card className="border-warning/30 bg-warning/5">
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-warning/20 flex h-8 w-8 items-center justify-center rounded-lg">
            <TrendingDown className="text-warning h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">Horarios con baja demanda</h3>
            <p className="text-muted-foreground text-xs">
              {sugerencias.length} sugerencia{sugerencias.length !== 1 ? 's' : ''} para mejorar
              ocupación
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {sugerencias.map((sugerencia) => (
            <SugerenciaItem
              key={sugerencia.id}
              sugerencia={sugerencia}
              onCrear={() => onCrearPromocion(sugerencia)}
              onDescartar={() => onDescartar(sugerencia.id)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

interface SugerenciaItemProps {
  sugerencia: SugerenciaBajaDemanda
  onCrear: () => void
  onDescartar: () => void
}

function SugerenciaItem({ sugerencia, onCrear, onDescartar }: SugerenciaItemProps) {
  const tipoConfig = TIPO_CONFIG[sugerencia.promocionSugerida.tipo]

  return (
    <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            {sugerencia.diaNombre}
          </Badge>
          <span className="text-muted-foreground text-sm">
            {sugerencia.horaInicio} - {sugerencia.horaFin}
          </span>
          <Badge variant="warning" size="sm">
            {sugerencia.ocupacionActual}% ocupación
          </Badge>
        </div>
        <p className="mt-1 text-sm font-medium">{sugerencia.canchaNombre}</p>
        <div className="mt-1 flex items-center gap-1">
          <Zap className={cn('h-3 w-3', tipoConfig.color)} />
          <span className="text-xs">
            {sugerencia.promocionSugerida.tipo === 'descuento_porcentual'
              ? `${sugerencia.promocionSugerida.valor}% de descuento`
              : formatCurrency(sugerencia.promocionSugerida.valor)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" onClick={onCrear}>
          Crear
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDescartar}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
