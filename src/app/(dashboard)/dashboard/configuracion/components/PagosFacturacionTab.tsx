'use client'

import * as React from 'react'
import { CreditCard, CheckCircle, XCircle, Plus, Trash2, Save, DollarSign } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Switch,
  Badge,
} from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { PagosConfig, AdelantoPorCancha, AdelantoPorHorario } from '../types'
import { DIAS_SEMANA } from '../types'
import { mockCanchas } from '../mock-data'

interface PagosFacturacionTabProps {
  pagosConfig: PagosConfig
  onUpdate: (data: Partial<PagosConfig>) => Promise<void>
  onConnectCulqi: (publicKey: string, secretKey: string) => Promise<void>
  onDisconnectCulqi: () => Promise<void>
  loading: boolean
}

export function PagosFacturacionTab({
  pagosConfig,
  onUpdate,
  onConnectCulqi,
  onDisconnectCulqi,
  loading,
}: PagosFacturacionTabProps) {
  const [formData, setFormData] = React.useState(pagosConfig)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showCulqiForm, setShowCulqiForm] = React.useState(false)
  const [culqiKeys, setCulqiKeys] = React.useState({ publicKey: '', secretKey: '' })

  React.useEffect(() => {
    setFormData(pagosConfig)
  }, [pagosConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onUpdate(formData)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConnectCulqi = async () => {
    if (!culqiKeys.publicKey || !culqiKeys.secretKey) {
      return
    }
    await onConnectCulqi(culqiKeys.publicKey, culqiKeys.secretKey)
    setShowCulqiForm(false)
    setCulqiKeys({ publicKey: '', secretKey: '' })
  }

  const toggleMetodoPago = (metodo: keyof typeof formData.metodosAceptados) => {
    setFormData((prev) => ({
      ...prev,
      metodosAceptados: {
        ...prev.metodosAceptados,
        [metodo]: !prev.metodosAceptados[metodo],
      },
    }))
  }

  const addAdelantoCancha = () => {
    const nuevaCancha = mockCanchas.find(
      (c) => !formData.adelantoPorCancha.find((a) => a.canchaId === c.id)
    )
    if (nuevaCancha) {
      setFormData((prev) => ({
        ...prev,
        adelantoPorCancha: [
          ...prev.adelantoPorCancha,
          {
            canchaId: nuevaCancha.id,
            canchaNombre: nuevaCancha.nombre,
            monto: prev.adelantoMinimoGlobal,
          },
        ],
      }))
    }
  }

  const updateAdelantoCancha = (canchaId: string, monto: number) => {
    setFormData((prev) => ({
      ...prev,
      adelantoPorCancha: prev.adelantoPorCancha.map((a) =>
        a.canchaId === canchaId ? { ...a, monto } : a
      ),
    }))
  }

  const removeAdelantoCancha = (canchaId: string) => {
    setFormData((prev) => ({
      ...prev,
      adelantoPorCancha: prev.adelantoPorCancha.filter((a) => a.canchaId !== canchaId),
    }))
  }

  const addAdelantoHorario = () => {
    setFormData((prev) => ({
      ...prev,
      adelantoPorHorario: [
        ...prev.adelantoPorHorario,
        {
          dia: 'sabado',
          horaInicio: '18:00',
          horaFin: '23:00',
          monto: prev.adelantoMinimoGlobal + 20,
        },
      ],
    }))
  }

  const updateAdelantoHorario = (
    index: number,
    field: keyof AdelantoPorHorario,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      adelantoPorHorario: prev.adelantoPorHorario.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }))
  }

  const removeAdelantoHorario = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      adelantoPorHorario: prev.adelantoPorHorario.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Culqi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Integración con Culqi
          </CardTitle>
          <CardDescription>Conecta tu cuenta de Culqi para recibir pagos en línea</CardDescription>
        </CardHeader>
        <CardContent>
          {formData.culqiConfigured ? (
            <div className="border-success/30 bg-success/5 flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-success h-6 w-6" />
                <div>
                  <p className="font-medium">Culqi conectado</p>
                  <p className="text-muted-foreground text-sm">
                    Public Key: {formData.culqiPublicKey?.slice(0, 20)}...
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onDisconnectCulqi}>
                Desconectar
              </Button>
            </div>
          ) : showCulqiForm ? (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key</Label>
                <Input
                  id="publicKey"
                  value={culqiKeys.publicKey}
                  onChange={(e) => setCulqiKeys((prev) => ({ ...prev, publicKey: e.target.value }))}
                  placeholder="pk_test_xxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={culqiKeys.secretKey}
                  onChange={(e) => setCulqiKeys((prev) => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="sk_test_xxxxx"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConnectCulqi} disabled={loading}>
                  Conectar
                </Button>
                <Button variant="outline" onClick={() => setShowCulqiForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-warning/30 bg-warning/5 flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <XCircle className="text-warning h-6 w-6" />
                <div>
                  <p className="font-medium">Sin conectar</p>
                  <p className="text-muted-foreground text-sm">
                    Conecta Culqi para recibir pagos en línea
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowCulqiForm(true)}>Conectar Culqi</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facturación */}
      <Card>
        <CardHeader>
          <CardTitle>Datos para facturación</CardTitle>
          <CardDescription>Información que aparecerá en tus comprobantes de pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="razonSocial">Razón social</Label>
              <Input
                id="razonSocial"
                value={formData.razonSocial}
                onChange={(e) => setFormData((prev) => ({ ...prev, razonSocial: e.target.value }))}
                placeholder="Mi Negocio S.A.C."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rucFacturacion">RUC</Label>
              <Input
                id="rucFacturacion"
                value={formData.rucFacturacion}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rucFacturacion: e.target.value }))
                }
                placeholder="20123456789"
                maxLength={11}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccionFiscal">Dirección fiscal</Label>
            <Input
              id="direccionFiscal"
              value={formData.direccionFiscal}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, direccionFiscal: e.target.value }))
              }
              placeholder="Av. Principal 123, Ciudad"
            />
          </div>
        </CardContent>
      </Card>

      {/* Métodos de pago */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de pago aceptados</CardTitle>
          <CardDescription>Selecciona qué métodos de pago aceptas en tu negocio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: 'culqi', label: 'Culqi (Online)', icon: '💳', requiresCulqi: true },
              { key: 'efectivo', label: 'Efectivo', icon: '💵', requiresCulqi: false },
              { key: 'tarjetaLocal', label: 'Tarjeta (Local)', icon: '💳', requiresCulqi: false },
              { key: 'yape', label: 'Yape', icon: '📱', requiresCulqi: false },
              { key: 'plin', label: 'Plin', icon: '📱', requiresCulqi: false },
            ].map((metodo) => {
              const isDisabled = metodo.requiresCulqi && !formData.culqiConfigured
              const isChecked =
                formData.metodosAceptados[metodo.key as keyof typeof formData.metodosAceptados]
              return (
                <div
                  key={metodo.key}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3',
                    isDisabled && 'opacity-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{metodo.icon}</span>
                    <span className="text-sm font-medium">{metodo.label}</span>
                  </div>
                  <Switch
                    checked={isChecked}
                    onChange={() =>
                      !isDisabled &&
                      toggleMetodoPago(metodo.key as keyof typeof formData.metodosAceptados)
                    }
                    disabled={isDisabled}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Adelantos mínimos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Adelantos mínimos
          </CardTitle>
          <CardDescription>
            Configura el monto mínimo de adelanto para confirmar reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Global */}
          <div className="space-y-2">
            <Label htmlFor="adelantoMinimoGlobal">Adelanto mínimo global (S/)</Label>
            <Input
              id="adelantoMinimoGlobal"
              type="number"
              min={0}
              value={formData.adelantoMinimoGlobal}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  adelantoMinimoGlobal: parseInt(e.target.value) || 0,
                }))
              }
              className="max-w-xs"
            />
            <p className="text-muted-foreground text-xs">
              Monto aplicado por defecto a todas las reservas
            </p>
          </div>

          {/* Por cancha */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Adelanto por cancha</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAdelantoCancha}>
                <Plus className="mr-1 h-4 w-4" />
                Agregar
              </Button>
            </div>

            {formData.adelantoPorCancha.length > 0 ? (
              <div className="space-y-2">
                {formData.adelantoPorCancha.map((adelanto) => (
                  <div key={adelanto.canchaId} className="flex items-center gap-2">
                    <Badge variant="outline" className="min-w-[140px] justify-center">
                      {adelanto.canchaNombre}
                    </Badge>
                    <Input
                      type="number"
                      min={0}
                      value={adelanto.monto}
                      onChange={(e) =>
                        updateAdelantoCancha(adelanto.canchaId, parseInt(e.target.value) || 0)
                      }
                      className="w-24"
                    />
                    <span className="text-muted-foreground text-sm">soles</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeAdelantoCancha(adelanto.canchaId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Sin configuraciones específicas por cancha
              </p>
            )}
          </div>

          {/* Por horario */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Adelanto por horario especial</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAdelantoHorario}>
                <Plus className="mr-1 h-4 w-4" />
                Agregar
              </Button>
            </div>

            {formData.adelantoPorHorario.length > 0 ? (
              <div className="space-y-2">
                {formData.adelantoPorHorario.map((adelanto, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={adelanto.dia}
                      onChange={(e) => updateAdelantoHorario(index, 'dia', e.target.value)}
                      className="border-border bg-background h-9 rounded-md border px-2 text-sm"
                    >
                      {DIAS_SEMANA.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="time"
                      value={adelanto.horaInicio}
                      onChange={(e) => updateAdelantoHorario(index, 'horaInicio', e.target.value)}
                      className="w-28"
                    />
                    <span className="text-muted-foreground">a</span>
                    <Input
                      type="time"
                      value={adelanto.horaFin}
                      onChange={(e) => updateAdelantoHorario(index, 'horaFin', e.target.value)}
                      className="w-28"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={adelanto.monto}
                      onChange={(e) =>
                        updateAdelantoHorario(index, 'monto', parseInt(e.target.value) || 0)
                      }
                      className="w-24"
                    />
                    <span className="text-muted-foreground text-sm">soles</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeAdelantoHorario(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Sin horarios especiales configurados</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving || loading}>
          <Save className="mr-2 h-4 w-4" />
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
