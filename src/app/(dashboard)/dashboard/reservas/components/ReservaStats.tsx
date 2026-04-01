'use client'

import * as React from 'react'
import { Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { ReservaStats } from '../types'

interface ReservaStatsCardsProps {
  stats: ReservaStats
}

export function ReservaStatsCards({ stats }: ReservaStatsCardsProps) {
  const cards = [
    {
      title: 'Reservas de hoy',
      value: stats.hoy.total,
      subtitle: `${stats.hoy.pendientes} pendiente${stats.hoy.pendientes !== 1 ? 's' : ''} de pago`,
      icon: Calendar,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pagos pendientes',
      value: stats.pendientes.total,
      subtitle: `Saldo: ${formatCurrency(stats.pendientes.saldoPendiente)}`,
      icon: AlertCircle,
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Ingresos de hoy',
      value: formatCurrency(stats.hoy.ingresos),
      subtitle: 'Total cobrado',
      icon: DollarSign,
      iconColor: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Reservas de la semana',
      value: stats.semana.total,
      subtitle: `Ingresos: ${formatCurrency(stats.semana.ingresos)}`,
      icon: Clock,
      iconColor: 'text-info',
      bgColor: 'bg-info/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2.5 ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {card.title}
                </p>
                <p className="mt-0.5 truncate text-xl font-bold">{card.value}</p>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">{card.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
