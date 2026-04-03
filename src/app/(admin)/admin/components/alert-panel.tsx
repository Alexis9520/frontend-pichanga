'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  UserCog,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'

interface Alert {
  id: string
  type: 'owner' | 'venue' | 'report' | 'dispute'
  message: string
  count: number
  href: string
}

interface AlertPanelProps {
  alerts: Alert[]
  className?: string
}

const alertConfig = {
  owner: {
    icon: UserCog,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  venue: {
    icon: MapPin,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  report: {
    icon: ShieldCheck,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
  },
  dispute: {
    icon: AlertCircle,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
}

export function AlertPanel({ alerts, className }: AlertPanelProps) {
  const hasAlerts = alerts.length > 0

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Alertas Pendientes
        </CardTitle>
        {hasAlerts && (
          <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-medium">
            {alerts.reduce((acc, alert) => acc + alert.count, 0)} total
          </span>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {!hasAlerts ? (
          <div className="py-8 text-center">
            <div className="bg-muted/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-sm">No hay alertas pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type]
              const Icon = config.icon

              return (
                <Link
                  key={alert.id}
                  href={alert.href}
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-colors"
                >
                  <div className={cn('rounded-lg p-2', config.iconBg)}>
                    <Icon className={cn('h-4 w-4', config.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-muted-foreground text-xs">{alert.count} pendiente(s)</p>
                  </div>
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                </Link>
              )
            })}

            <div className="pt-2">
              <Link
                href="/admin/alertas"
                className="border-border bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-medium transition-all duration-200"
              >
                Ver todas las alertas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
