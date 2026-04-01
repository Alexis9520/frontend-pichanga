'use client'

import * as React from 'react'
import { TrendingUp, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ResumenSemanal } from '../types'

interface ResumenSemanalProps {
  resumen: ResumenSemanal
}

export function ResumenSemanal({ resumen }: ResumenSemanalProps) {
  const maxReservas = Math.max(...resumen.porDia.map((d) => d.reservas), 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Esta Semana
          </span>
          <Badge variant={resumen.comparativaSemanaAnterior >= 0 ? 'success' : 'destructive'}>
            {resumen.comparativaSemanaAnterior >= 0 ? '+' : ''}
            {resumen.comparativaSemanaAnterior}% vs anterior
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini gráfico de barras */}
        <div className="flex h-16 items-end justify-between gap-1">
          {resumen.porDia.map((dia) => {
            const height = (dia.reservas / maxReservas) * 100
            return (
              <div key={dia.fecha} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className={cn(
                      'w-full max-w-[24px] rounded-t transition-all',
                      dia.reservas > 0 ? 'bg-primary' : 'bg-muted'
                    )}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                </div>
                <span className="text-muted-foreground text-[10px]">{dia.dia}</span>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{resumen.reservasSemana}</p>
            <p className="text-muted-foreground text-xs">Reservas</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">S/{resumen.ingresosSemana.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs">Ingresos</p>
          </div>
        </div>

        {/* Top horarios */}
        {resumen.topHorarios.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">Top horarios:</p>
            <div className="space-y-1">
              {resumen.topHorarios.slice(0, 3).map((horario, index) => (
                <div key={horario.hora} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold',
                        index === 0
                          ? 'bg-warning/20 text-warning'
                          : index === 1
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {horario.hora}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{horario.reservas} res.</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
