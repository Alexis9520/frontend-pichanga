'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Plug, Flag, Wrench, Save, RefreshCw } from 'lucide-react'
import {
  useGeneralConfig,
  useFeatureFlags,
  useIntegrations,
  useMaintenanceConfig,
} from '../hooks/useAdmin'

// Tab type
type ConfigTab = 'general' | 'integrations' | 'features' | 'maintenance'

// Tab button component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

// Tag component for removable items
function RemovableTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-destructive ml-1 transition-colors">
        ×
      </button>
    </span>
  )
}

// Toggle switch
function ToggleSwitch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean
  onChange: () => void
  label?: string
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
          enabled ? 'left-6' : 'left-1'
        }`}
      />
      <span className="sr-only">{label}</span>
    </button>
  )
}

// General Settings Tab
function GeneralSettingsTab() {
  const {
    config,
    saving,
    addCity,
    removeCity,
    addSportType,
    removeSportType,
    addSurface,
    removeSurface,
    addService,
    removeService,
    togglePaymentMethod,
    updateReservationSettings,
    toggleNotifications,
    saveConfig,
  } = useGeneralConfig()

  const [newCity, setNewCity] = React.useState('')
  const [newSport, setNewSport] = React.useState('')
  const [newSurface, setNewSurface] = React.useState('')
  const [newService, setNewService] = React.useState('')

  return (
    <div className="space-y-6">
      {/* Cities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Ciudades</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Nueva ciudad..."
              className="border-input bg-background focus:ring-ring w-40 rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newCity.trim()) {
                  addCity(newCity.trim())
                  setNewCity('')
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {config.cities.map((city) => (
              <RemovableTag key={city} label={city} onRemove={() => removeCity(city)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sports Types */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Tipos de Deporte</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSport}
              onChange={(e) => setNewSport(e.target.value)}
              placeholder="Nuevo tipo..."
              className="border-input bg-background focus:ring-ring w-40 rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newSport.trim()) {
                  addSportType(newSport.trim())
                  setNewSport('')
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {config.sportsTypes.map((sport) => (
              <RemovableTag key={sport} label={sport} onRemove={() => removeSportType(sport)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Surfaces */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Tipos de Superficie</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSurface}
              onChange={(e) => setNewSurface(e.target.value)}
              placeholder="Nueva superficie..."
              className="border-input bg-background focus:ring-ring w-40 rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newSurface.trim()) {
                  addSurface(newSurface.trim())
                  setNewSurface('')
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {config.surfaces.map((surface) => (
              <RemovableTag key={surface} label={surface} onRemove={() => removeSurface(surface)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Servicios Disponibles</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Nuevo servicio..."
              className="border-input bg-background focus:ring-ring w-40 rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newService.trim()) {
                  addService(newService.trim())
                  setNewService('')
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {config.services.map((service) => (
              <RemovableTag key={service} label={service} onRemove={() => removeService(service)} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {config.paymentMethods.map((method) => (
              <div
                key={method.name}
                className="border-input bg-background flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <span className="text-sm font-medium">{method.name}</span>
                  {method.feePercentage && (
                    <span className="text-muted-foreground ml-1 text-xs">
                      ({method.feePercentage}%)
                    </span>
                  )}
                </div>
                <ToggleSwitch
                  enabled={method.enabled}
                  onChange={() => togglePaymentMethod(method.name)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Anticipación mínima (horas)
              </label>
              <input
                type="number"
                value={config.minAdvanceHours}
                onChange={(e) =>
                  updateReservationSettings({ minAdvanceHours: parseInt(e.target.value) || 1 })
                }
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Anticipación máxima (días)
              </label>
              <input
                type="number"
                value={config.maxAdvanceDays}
                onChange={(e) =>
                  updateReservationSettings({ maxAdvanceDays: parseInt(e.target.value) || 30 })
                }
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Cancelación (horas antes)
              </label>
              <input
                type="number"
                value={config.defaultCancellationHours}
                onChange={(e) =>
                  updateReservationSettings({
                    defaultCancellationHours: parseInt(e.target.value) || 3,
                  })
                }
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Reembolso default (%)
              </label>
              <input
                type="number"
                value={config.defaultRefundPercentage}
                onChange={(e) =>
                  updateReservationSettings({
                    defaultRefundPercentage: parseInt(e.target.value) || 80,
                  })
                }
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Tolerancia (minutos)
              </label>
              <input
                type="number"
                value={config.defaultToleranceMinutes}
                onChange={(e) =>
                  updateReservationSettings({
                    defaultToleranceMinutes: parseInt(e.target.value) || 15,
                  })
                }
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { key: 'email' as const, label: 'Notificaciones por Email' },
              { key: 'sms' as const, label: 'Notificaciones por SMS' },
              { key: 'push' as const, label: 'Notificaciones Push' },
            ].map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm font-medium">{notif.label}</span>
                <ToggleSwitch
                  enabled={config[`${notif.key}Notifications`]}
                  onChange={() => toggleNotifications(notif.key)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveConfig}
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  )
}

// Integrations Tab
function IntegrationsTab() {
  const { integrations, loading, testConnection, enableIntegration, disableIntegration } =
    useIntegrations()

  const statusColors = {
    connected: 'bg-green-100 text-green-700',
    disconnected: 'bg-gray-100 text-gray-700',
    error: 'bg-red-100 text-red-700',
    not_configured: 'bg-yellow-100 text-yellow-700',
  }

  const statusLabels = {
    connected: 'Conectado',
    disconnected: 'Desconectado',
    error: 'Error',
    not_configured: 'No configurado',
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{integration.name}</CardTitle>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[integration.status]}`}
            >
              {statusLabels[integration.status]}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {integration.apiKey && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">API Key</label>
                <input
                  type="password"
                  value={integration.apiKey}
                  readOnly
                  className="border-input bg-background mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            )}
            {integration.secretKey && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">Secret Key</label>
                <input
                  type="password"
                  value={integration.secretKey}
                  readOnly
                  className="border-input bg-background mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            )}
            {integration.webhookUrl && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">Webhook URL</label>
                <input
                  type="text"
                  value={integration.webhookUrl}
                  readOnly
                  className="border-input bg-background mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => testConnection(integration.id)}
                  disabled={loading}
                  className="border-input bg-background hover:bg-accent inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Probar
                </button>
              </div>
              <ToggleSwitch
                enabled={integration.enabled}
                onChange={() =>
                  integration.enabled
                    ? disableIntegration(integration.id)
                    : enableIntegration(integration.id)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Feature Flags Tab
function FeatureFlagsTab() {
  const { features, toggleFeature, enableAll, disableAll } = useFeatureFlags()

  const categoryLabels = {
    core: 'Core',
    payment: 'Pagos',
    social: 'Social',
    marketing: 'Marketing',
    analytics: 'Analytics',
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => enableAll()}
          className="border-input bg-background hover:bg-accent rounded-lg border px-3 py-1.5 text-sm transition-colors"
        >
          Habilitar todas
        </button>
        <button
          onClick={() => disableAll()}
          className="border-input bg-background hover:bg-accent rounded-lg border px-3 py-1.5 text-sm transition-colors"
        >
          Deshabilitar todas
        </button>
      </div>

      {/* Features List */}
      <div className="grid gap-4">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{feature.name}</h3>
                  <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                    {categoryLabels[feature.category]}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Última actualización: {new Date(feature.updatedAt).toLocaleDateString('es-PE')}
                </p>
              </div>
              <ToggleSwitch enabled={feature.enabled} onChange={() => toggleFeature(feature.id)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Maintenance Tab
function MaintenanceTab() {
  const {
    config,
    saving,
    enableMaintenance,
    disableMaintenance,
    scheduleMaintenance,
    updateMessage,
    toggleBanner,
    addWhitelistedIP,
    removeWhitelistedIP,
    saveConfig,
  } = useMaintenanceConfig()

  const [newIP, setNewIP] = React.useState('')
  const [scheduledStart, setScheduledStart] = React.useState('')
  const [scheduledEnd, setScheduledEnd] = React.useState('')

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={config.enabled ? 'border-red-300 bg-red-50/30' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {config.enabled ? 'Modo Mantenimiento ACTIVO' : 'Sistema Operativo Normal'}
              </p>
              <p className="text-muted-foreground text-sm">
                {config.enabled
                  ? 'Los usuarios no pueden acceder a la plataforma'
                  : 'Todos los usuarios pueden acceder normalmente'}
              </p>
            </div>
            <div className="flex gap-2">
              {config.enabled ? (
                <button
                  onClick={disableMaintenance}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Desactivar Mantenimiento
                </button>
              ) : (
                <button
                  onClick={() => enableMaintenance()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Activar Mantenimiento
                </button>
              )}
            </div>
          </div>

          {/* Maintenance Message */}
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Mensaje de mantenimiento
            </label>
            <textarea
              value={config.message}
              onChange={(e) => updateMessage(e.target.value)}
              rows={2}
              className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Programar Mantenimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground text-sm font-medium">Inicio</label>
              <input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">Fin</label>
              <input
                type="datetime-local"
                value={scheduledEnd}
                onChange={(e) => setScheduledEnd(e.target.value)}
                className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (scheduledStart && scheduledEnd) {
                scheduleMaintenance(scheduledStart, scheduledEnd, config.message)
              }
            }}
            disabled={!scheduledStart || !scheduledEnd}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Programar Mantenimiento
          </button>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Control de Acceso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Permitir Admins</p>
                <p className="text-muted-foreground text-xs">
                  Los admins pueden acceder durante mantenimiento
                </p>
              </div>
              <ToggleSwitch enabled={config.allowAdmins} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Permitir Owners</p>
                <p className="text-muted-foreground text-xs">
                  Los owners pueden acceder durante mantenimiento
                </p>
              </div>
              <ToggleSwitch enabled={config.allowOwners} onChange={() => {}} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Whitelisted IPs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">IPs Permitidas</CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="192.168.1.1"
              className="border-input bg-background focus:ring-ring w-40 rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newIP.trim()) {
                  addWhitelistedIP(newIP.trim())
                  setNewIP('')
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {config.whitelistedIPs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {config.whitelistedIPs.map((ip) => (
                <RemovableTag key={ip} label={ip} onRemove={() => removeWhitelistedIP(ip)} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay IPs en la lista blanca</p>
          )}
        </CardContent>
      </Card>

      {/* Banner Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Banner de Aviso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Mostrar Banner</p>
              <p className="text-muted-foreground text-xs">Mostrar aviso en la plataforma</p>
            </div>
            <ToggleSwitch enabled={config.showBanner} onChange={toggleBanner} />
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">Mensaje del Banner</label>
            <textarea
              value={config.bannerMessage}
              onChange={(e) => {}}
              rows={2}
              className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminConfiguracionPage() {
  const [activeTab, setActiveTab] = React.useState<ConfigTab>('general')

  const tabs: { id: ConfigTab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'integrations', label: 'Integraciones', icon: Plug },
    { id: 'features', label: 'Features', icon: Flag },
    { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground text-sm">Parámetros globales de la plataforma</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {/* Content */}
      {activeTab === 'general' && <GeneralSettingsTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'features' && <FeatureFlagsTab />}
      {activeTab === 'maintenance' && <MaintenanceTab />}
    </div>
  )
}
