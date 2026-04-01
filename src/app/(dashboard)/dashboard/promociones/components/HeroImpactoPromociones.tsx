'use client'

import * as React from 'react'
import {
  TicketPercent,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'

interface HeroImpactoPromocionesProps {
  activas: number
  total: number
  usosSemana: number
  usosMes: number
  comparativaUsos: number // porcentaje vs semana anterior
  ahorroClientes: number
  ingresosGenerados: number
  porcentajeIngresosPromociones: number // % del total de ingresos que vienen de promociones
}

export function HeroImpactoPromociones({
  activas,
  total,
  usosSemana,
  usosMes,
  comparativaUsos,
  ahorroClientes,
  ingresosGenerados,
  porcentajeIngresosPromociones,
}: HeroImpactoPromocionesProps) {
  const comparativaPositiva = comparativaUsos >= 0

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          {/* Stats principales */}
          <div className="from-secondary/10 via-secondary/5 bg-gradient-to-br to-transparent p-6">
            <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Impacto de Promociones
            </p>

            {/* Stats grid */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {/* Activas */}
              <div className="text-center">
                <div className="bg-secondary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                  <TicketPercent className="text-secondary h-6 w-6" />
                </div>
                <p className="mt-2 text-2xl font-bold">{activas}</p>
                <p className="text-muted-foreground text-xs">Activas</p>
                <p className="text-muted-foreground/70 text-[10px]">de {total} total</p>
              </div>

              {/* Usos */}
              <div className="text-center">
                <div className="bg-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <p className="mt-2 text-2xl font-bold">{usosSemana}</p>
                <p className="text-muted-foreground text-xs">Usos semana</p>
                <p className="text-muted-foreground/70 text-[10px]">{usosMes} este mes</p>
              </div>

              {/* Ahorro */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <p className="mt-2 text-xl font-bold text-green-600">
                  {formatCurrency(ahorroClientes)}
                </p>
                <p className="text-muted-foreground text-xs">Ahorro clientes</p>
              </div>
            </div>

            {/* Comparativa */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium',
                  comparativaPositiva
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-red-500/10 text-red-600'
                )}
              >
                {comparativaPositiva ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(comparativaUsos)}%
              </div>
              <span className="text-muted-foreground text-sm">vs semana anterior</span>
            </div>
          </div>

          {/* Gráfico de ingresos */}
          <div className="flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Ingresos por promociones</p>
                <span className="text-secondary text-lg font-bold">
                  {porcentajeIngresosPromociones}%
                </span>
              </div>
              <p className="text-muted-foreground text-xs">del total de ingresos este mes</p>
            </div>

            {/* Barra visual */}
            <div className="mt-4">
              <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                <div
                  className="from-secondary to-primary h-full rounded-full bg-gradient-to-r transition-all duration-700"
                  style={{ width: `${porcentajeIngresosPromociones}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-muted-foreground">0%</span>
                <span className="font-medium">{formatCurrency(ingresosGenerados)}</span>
                <span className="text-muted-foreground">100%</span>
              </div>
            </div>

            {/* Desglose visual */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium">Ingresos</span>
                </div>
                <p className="text-primary mt-1 text-lg font-bold">
                  {formatCurrency(ingresosGenerados)}
                </p>
                <p className="text-muted-foreground text-xs">Generados por promociones</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Descuentos</span>
                </div>
                <p className="mt-1 text-lg font-bold text-green-600">
                  {formatCurrency(ahorroClientes)}
                </p>
                <p className="text-muted-foreground text-xs">Aplicados a clientes</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
