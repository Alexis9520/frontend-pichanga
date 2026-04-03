'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Percent, Calendar, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import type { CommissionConfig } from '../../types'

interface CommissionConfigCardProps {
  config: CommissionConfig
  saving: boolean
  onUpdateCommission: (value: number) => void
  onUpdateFreeDays: (days: number) => void
  onSave: () => void
}

export function CommissionConfigCard({
  config,
  saving,
  onUpdateCommission,
  onUpdateFreeDays,
  onSave,
}: CommissionConfigCardProps) {
  const [localCommission, setLocalCommission] = React.useState(config.globalCommission)
  const [localFreeDays, setLocalFreeDays] = React.useState(config.commissionFreeDays)
  const [showAddSpecial, setShowAddSpecial] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    onUpdateCommission(localCommission)
    onUpdateFreeDays(localFreeDays)
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4" />
          Configuración de Comisiones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Commission */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Percent className="text-muted-foreground h-4 w-4" />
                <label className="text-sm font-medium">Comisión Global</label>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Porcentaje que la plataforma retiene de cada reserva
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localCommission}
                onChange={(e) => setLocalCommission(parseFloat(e.target.value) || 0)}
                min={0}
                max={50}
                step={0.5}
                className="border-input bg-background focus:ring-ring w-20 rounded-lg border px-3 py-2 text-center text-sm focus:ring-2 focus:outline-none"
              />
              <span className="text-sm font-medium">%</span>
            </div>
          </div>
        </div>

        {/* Commission Free Days */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <label className="text-sm font-medium">Días sin Comisión</label>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Período de gracia para nuevos owners (0 = sin promoción)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localFreeDays}
                onChange={(e) => setLocalFreeDays(parseInt(e.target.value) || 0)}
                min={0}
                max={365}
                className="border-input bg-background focus:ring-ring w-20 rounded-lg border px-3 py-2 text-center text-sm focus:ring-2 focus:outline-none"
              />
              <span className="text-sm font-medium">días</span>
            </div>
          </div>
        </div>

        {/* Minimum Commission */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-muted-foreground h-4 w-4" />
                <label className="text-sm font-medium">Comisión Mínima</label>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Monto mínimo de comisión por reserva
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">S/</span>
              <input
                type="number"
                value={config.minimumCommission}
                readOnly
                className="border-input bg-muted w-20 rounded-lg border px-3 py-2 text-center text-sm"
              />
            </div>
          </div>
        </div>

        {/* Special Commissions */}
        {config.specialCommissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Comisiones Especiales</label>
            </div>
            {config.specialCommissions.map((special, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-orange-50 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{special.commission}% comisión</p>
                  <p className="text-muted-foreground text-xs">{special.reason}</p>
                </div>
                <button className="rounded p-1 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Special Commission Button */}
        <button
          onClick={() => setShowAddSpecial(!showAddSpecial)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar comisión especial
        </button>

        {/* Save Button */}
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-xs">
            Los cambios afectarán todas las nuevas reservas
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Guardado
              </>
            ) : saving ? (
              'Guardando...'
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
