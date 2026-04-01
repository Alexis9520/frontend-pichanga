'use client'

import * as React from 'react'
import {
  Bell,
  Mail,
  Smartphone,
  Calendar,
  Package,
  Tag,
  ShoppingCart,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Switch } from '@/components/ui'
import type { NotificacionesConfig } from '../types'

interface NotificacionesTabProps {
  notificacionesConfig: NotificacionesConfig
  onUpdate: (data: Partial<NotificacionesConfig>) => Promise<void>
  loading: boolean
}

const PUSH_NOTIFICATIONS = [
  {
    key: 'nuevaReserva',
    label: 'Nuevas reservas',
    description: 'Cuando alguien hace una reserva',
    icon: Calendar,
  },
  {
    key: 'cancelacion',
    label: 'Cancelaciones',
    description: 'Cuando se cancela una reserva',
    icon: Calendar,
  },
  {
    key: 'recordatorioSaldo',
    label: 'Recordatorio de saldo',
    description: 'Aviso para cobrar saldo pendiente',
    icon: DollarSign,
  },
  {
    key: 'stockBajo',
    label: 'Stock bajo',
    description: 'Cuando un producto está por agotarse',
    icon: Package,
  },
  {
    key: 'promocionPorVencer',
    label: 'Promociones por vencer',
    description: 'Cuando una promoción está próxima a caducar',
    icon: Tag,
  },
  {
    key: 'nuevaVenta',
    label: 'Nueva venta',
    description: 'Cuando se registra una venta de extras',
    icon: ShoppingCart,
  },
  {
    key: 'pagoSaldo',
    label: 'Pago de saldo',
    description: 'Cuando se completa un pago en cancha',
    icon: DollarSign,
  },
]

const EMAIL_NOTIFICATIONS = [
  {
    key: 'resumenDiario',
    label: 'Resumen diario',
    description: 'Reporte de ventas y reservas del día',
    icon: Mail,
  },
  {
    key: 'resumenSemanal',
    label: 'Resumen semanal',
    description: 'Reporte semanal con estadísticas',
    icon: Mail,
  },
  {
    key: 'alertas',
    label: 'Alertas importantes',
    description: 'Notificaciones críticas del sistema',
    icon: Bell,
  },
]

export function NotificacionesTab({
  notificacionesConfig,
  onUpdate,
  loading,
}: NotificacionesTabProps) {
  const [config, setConfig] = React.useState(notificacionesConfig)

  React.useEffect(() => {
    setConfig(notificacionesConfig)
  }, [notificacionesConfig])

  const togglePush = async (key: keyof typeof config.push) => {
    const newConfig = {
      ...config,
      push: { ...config.push, [key]: !config.push[key] },
    }
    setConfig(newConfig)
    await onUpdate({ push: newConfig.push })
  }

  const toggleEmail = async (key: keyof typeof config.email) => {
    const newConfig = {
      ...config,
      email: { ...config.email, [key]: !config.email[key] },
    }
    setConfig(newConfig)
    await onUpdate({ email: newConfig.email })
  }

  return (
    <div className="space-y-6">
      {/* Push notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Notificaciones push
          </CardTitle>
          <CardDescription>Alertas que recibirás en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PUSH_NOTIFICATIONS.map((notif) => {
              const Icon = notif.icon
              const isChecked = config.push[notif.key as keyof typeof config.push]
              return (
                <div
                  key={notif.key}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{notif.label}</p>
                      <p className="text-muted-foreground text-sm">{notif.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isChecked}
                    onChange={() => togglePush(notif.key as keyof typeof config.push)}
                    disabled={loading}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificaciones por email
          </CardTitle>
          <CardDescription>Reportes y resúmenes enviados a tu correo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {EMAIL_NOTIFICATIONS.map((notif) => {
              const Icon = notif.icon
              const isChecked = config.email[notif.key as keyof typeof config.email]
              return (
                <div
                  key={notif.key}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{notif.label}</p>
                      <p className="text-muted-foreground text-sm">{notif.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isChecked}
                    onChange={() => toggleEmail(notif.key as keyof typeof config.email)}
                    disabled={loading}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-info/30 bg-info/5">
        <CardContent className="p-4">
          <p className="text-sm">
            💡 Las notificaciones push requieren que tengas el dashboard abierto. Los emails se
            envían automáticamente según la configuración seleccionada.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
