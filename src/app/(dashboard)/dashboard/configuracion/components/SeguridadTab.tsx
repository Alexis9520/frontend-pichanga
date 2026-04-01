'use client'

import * as React from 'react'
import { Lock, Key, Monitor, MapPin, LogOut, Eye, EyeOff, Save, Shield } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type { SesionActiva } from '../types'

interface SeguridadTabProps {
  sesiones: SesionActiva[]
  onCambiarPassword: (actual: string, nueva: string) => Promise<void>
  onCerrarSesion: (id: string) => Promise<void>
  onCerrarTodasSesiones: () => Promise<void>
  loading: boolean
}

export function SeguridadTab({
  sesiones,
  onCambiarPassword,
  onCerrarSesion,
  onCerrarTodasSesiones,
  loading,
}: SeguridadTabProps) {
  const [showPasswordForm, setShowPasswordForm] = React.useState(false)
  const [passwords, setPasswords] = React.useState({ actual: '', nueva: '', confirmar: '' })
  const [showActual, setShowActual] = React.useState(false)
  const [showNueva, setShowNueva] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleChangePassword = async () => {
    setError('')

    if (!passwords.actual || !passwords.nueva || !passwords.confirmar) {
      setError('Completa todos los campos')
      return
    }

    if (passwords.nueva !== passwords.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (passwords.nueva.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsSubmitting(true)
    try {
      await onCambiarPassword(passwords.actual, passwords.nueva)
      setPasswords({ actual: '', nueva: '', confirmar: '' })
      setShowPasswordForm(false)
    } catch {
      setError('La contraseña actual es incorrecta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const otrasSesiones = sesiones.filter((s) => !s.esActual)
  const sesionActual = sesiones.find((s) => s.esActual)

  return (
    <div className="space-y-6">
      {/* Cambiar contraseña */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Contraseña
          </CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          {showPasswordForm ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actual">Contraseña actual</Label>
                <div className="relative">
                  <Input
                    id="actual"
                    type={showActual ? 'text' : 'password'}
                    value={passwords.actual}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, actual: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowActual(!showActual)}
                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showActual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nueva">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="nueva"
                    type={showNueva ? 'text' : 'password'}
                    value={passwords.nueva}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, nueva: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNueva(!showNueva)}
                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showNueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmar"
                  type="password"
                  value={passwords.confirmar}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, confirmar: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <div className="flex gap-2">
                <Button onClick={handleChangePassword} isLoading={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">••••••••••••</p>
              <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                Cambiar contraseña
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sesiones activas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Sesiones activas
              </CardTitle>
              <CardDescription>Dispositivos donde has iniciado sesión</CardDescription>
            </div>
            {otrasSesiones.length > 0 && (
              <Button variant="outline" size="sm" onClick={onCerrarTodasSesiones}>
                Cerrar las demás
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sesiones.map((sesion) => (
              <div
                key={sesion.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4',
                  sesion.esActual && 'border-primary/30 bg-primary/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sesion.dispositivo}</span>
                      {sesion.esActual && (
                        <span className="bg-primary/20 text-primary rounded px-2 py-0.5 text-xs font-medium">
                          Sesión actual
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {sesion.navegador} • {sesion.ubicacion}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      <MapPin className="mr-1 inline h-3 w-3" />
                      {formatDate(sesion.fechaInicio)}
                    </p>
                  </div>
                </div>

                {!sesion.esActual && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCerrarSesion(sesion.id)}
                    disabled={loading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seguridad info */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-success h-5 w-5" />
            <div>
              <p className="font-medium">Tu cuenta está protegida</p>
              <p className="text-muted-foreground text-sm">
                Utilizamos encriptación de extremo a extremo para proteger tu información. Nunca
                compartas tu contraseña con nadie.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
