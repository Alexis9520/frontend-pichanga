'use client'

import * as React from 'react'
import { DollarSign, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { ResumenMes } from '../types'

interface IngresosMesCardProps {
  resumen: ResumenMes
}

export function IngresosMesCard({ resumen }: IngresosMesCardProps) {
  const isPositive = resumen.comparativaMesAnterior >= 0

  return (
    <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <DollarSign className="text-primary h-5 w-5" />
              <span className="text-muted-foreground text-sm font-medium">Ingresos del Mes</span>
            </div>

            <p className="mt-2 text-3xl font-bold">{formatCurrency(resumen.totalIngresos)}</p>

            <div className="mt-1 flex items-center gap-2">
              <Badge variant={isPositive ? 'success' : 'destructive'}>
                {isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {isPositive ? '+' : ''}
                {resumen.comparativaMesAnterior}% vs mes anterior
              </Badge>
            </div>
          </div>

          <Link href="/dashboard/ingresos">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Desglose */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Reservas</p>
            <p className="mt-0.5 font-bold">{formatCurrency(resumen.ingresosReservas)}</p>
            <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${resumen.porcentajeReservas}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">{resumen.porcentajeReservas}%</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Ventas Extras</p>
            <p className="mt-0.5 font-bold">{formatCurrency(resumen.ingresosExtras)}</p>
            <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-secondary h-full rounded-full"
                style={{ width: `${resumen.porcentajeExtras}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">{resumen.porcentajeExtras}%</p>
          </div>
        </div>

        {/* Mini tendencia */}
        {resumen.tendencia.length > 0 && (
          <div className="mt-4">
            <p className="text-muted-foreground text-xs">Tendencia últimos 6 meses</p>
            <div className="mt-2 flex h-8 items-end justify-between gap-1">
              {resumen.tendencia.map((item, index) => {
                const max = Math.max(...resumen.tendencia.map((t) => t.total))
                const height = (item.total / max) * 100
                const isLast = index === resumen.tendencia.length - 1
                return (
                  <div key={item.mes} className="flex flex-1 flex-col items-center gap-0.5">
                    <div
                      className={cn(
                        'w-full rounded-t transition-all',
                        isLast ? 'bg-primary' : 'bg-muted'
                      )}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-1 flex justify-between">
              {resumen.tendencia.map((item) => (
                <span key={item.mes} className="text-muted-foreground text-[9px]">
                  {item.mes}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
