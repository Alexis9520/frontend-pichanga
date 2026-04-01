'use client'

import * as React from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ShoppingCart,
  Ticket,
  AlertCircle,
  Percent,
  Clock,
  Trophy,
} from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { IngresosStats, IngresoPorDia, TendenciaMensual } from '../types'
import { GraficoBarras } from './GraficoBarras'
import { GraficoTendencia } from './GraficoTendencia'

interface ResumenTabProps {
  stats: IngresosStats
  ingresosPorDia: IngresoPorDia[]
  tendenciaMensual: TendenciaMensual[]
}

export function ResumenTab({ stats, ingresosPorDia, tendenciaMensual }: ResumenTabProps) {
  return (
    <div className="space-y-6">
      {/* Cards de resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total ingresos */}
        <Card className="bg-primary/5 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Ingresos totales</p>
              <p className="text-primary text-2xl font-bold">
                {formatCurrency(stats.ingresosTotales)}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {stats.comparativaPorcentaje >= 0 ? (
                  <>
                    <TrendingUp className="text-success h-3 w-3" />
                    <span className="text-success text-xs font-medium">
                      +{stats.comparativaPorcentaje}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-destructive h-3 w-3" />
                    <span className="text-destructive text-xs font-medium">
                      {stats.comparativaPorcentaje}%
                    </span>
                  </>
                )}
                <span className="text-muted-foreground text-xs">vs anterior</span>
              </div>
            </div>
            <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <DollarSign className="text-primary h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Ingresos reservas */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Por reservas</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.ingresosReservas)}</p>
              <p className="text-muted-foreground mt-2 text-xs">{stats.totalReservas} reservas</p>
            </div>
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Calendar className="text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Ingresos extras */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Ventas extras</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.ingresosExtras)}</p>
              <p className="text-muted-foreground mt-2 text-xs">{stats.totalVentasExtras} ventas</p>
            </div>
            <div className="bg-secondary/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <ShoppingCart className="text-secondary h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Ticket promedio */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs">Ticket promedio</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.ticketPromedioReserva)}</p>
              <p className="text-muted-foreground mt-2 text-xs">por reserva</p>
            </div>
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Ticket className="text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stats secundarios */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Reservas completadas */}
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="bg-success/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <Calendar className="text-success h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Completadas</p>
              <p className="font-bold">{stats.reservasCompletadas}</p>
            </div>
          </div>
        </Card>

        {/* Reservas parciales */}
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="bg-warning/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <AlertCircle className="text-warning h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Con adelanto</p>
              <p className="font-bold">{stats.reservasPartial}</p>
            </div>
          </div>
        </Card>

        {/* Saldo pendiente */}
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <DollarSign className="text-info h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Saldo pendiente</p>
              <p className="font-bold">{formatCurrency(stats.saldoPendienteTotal)}</p>
            </div>
          </div>
        </Card>

        {/* Ratio */}
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
              <Percent className="text-muted-foreground h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ratio Res/Extras</p>
              <p className="font-bold">{stats.ratioReservasExtras.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        {/* Promociones */}
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
              <Ticket className="text-muted-foreground h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Descuentos</p>
              <p className="font-bold">-{formatCurrency(stats.ingresosPromociones)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ingresos por día */}
        <Card className="p-4">
          <GraficoBarras datos={ingresosPorDia} titulo="Ingresos por día" />
        </Card>

        {/* Tendencia mensual */}
        <Card className="p-4">
          <GraficoTendencia datos={tendenciaMensual} titulo="Tendencia mensual" />
        </Card>
      </div>

      {/* Highlights */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Top cancha */}
        <Card className="from-primary/5 bg-gradient-to-br to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
              <Trophy className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cancha más rentable</p>
              <p className="text-lg font-bold">{stats.canchaTopNombre}</p>
              <p className="text-primary font-medium">{formatCurrency(stats.canchaTopIngresos)}</p>
            </div>
          </div>
        </Card>

        {/* Horario peak */}
        <Card className="from-secondary/5 bg-gradient-to-br to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/20 flex h-12 w-12 items-center justify-center rounded-full">
              <Clock className="text-secondary h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Horario más solicitado</p>
              <p className="text-lg font-bold">{stats.horarioPeak}</p>
              <p className="text-secondary font-medium">
                {formatCurrency(stats.horarioPeakIngresos)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
