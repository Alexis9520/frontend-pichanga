'use client'

import * as React from 'react'
import { Users, Plus, MoreVertical, Mail, Shield, Clock, Power, Trash2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
  Select,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { UsuarioSistema, RolUsuario } from '../types'
import { ROL_CONFIG } from '../types'

interface UsuariosTabProps {
  usuarios: UsuarioSistema[]
  onInvitar: (email: string, rol: RolUsuario) => Promise<void>
  onActualizarRol: (id: string, rol: RolUsuario) => Promise<void>
  onToggleActivo: (id: string) => Promise<void>
  onEliminar: (id: string) => Promise<void>
  loading: boolean
}

export function UsuariosTab({
  usuarios,
  onInvitar,
  onActualizarRol,
  onToggleActivo,
  onEliminar,
  loading,
}: UsuariosTabProps) {
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [inviteRol, setInviteRol] = React.useState<RolUsuario>('staff')
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleInvite = async () => {
    if (!inviteEmail) return
    setIsSubmitting(true)
    try {
      await onInvitar(inviteEmail, inviteRol)
      setShowInviteModal(false)
      setInviteEmail('')
      setInviteRol('staff')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Usuarios del sistema</h3>
          <p className="text-muted-foreground text-sm">
            Gestiona el equipo de trabajo de tu negocio
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invitar usuario
        </Button>
      </div>

      {/* Lista de usuarios */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-border divide-y">
            {usuarios.map((usuario) => {
              const rolConfig = ROL_CONFIG[usuario.rol]
              return (
                <div key={usuario.id} className="flex items-center gap-4 p-4">
                  {/* Avatar */}
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="font-medium">
                      {usuario.nombre
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usuario.nombre}</span>
                      {!usuario.activo && (
                        <Badge variant="outline" size="sm" className="text-muted-foreground">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{usuario.email}</p>
                  </div>

                  {/* Rol */}
                  <Badge className={rolConfig.color}>{rolConfig.label}</Badge>

                  {/* Último acceso */}
                  <div className="hidden text-right text-sm md:block">
                    <p className="text-muted-foreground">Último acceso</p>
                    <p className="text-xs">{formatDate(usuario.ultimoAcceso)}</p>
                  </div>

                  {/* Acciones */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setMenuOpen(menuOpen === usuario.id ? null : usuario.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {menuOpen === usuario.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                        <div className="border-border bg-popover absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border p-1 shadow-lg">
                          <div className="border-border border-b px-3 py-2">
                            <p className="text-xs font-medium">Cambiar rol</p>
                            <div className="mt-1 flex gap-1">
                              {(['staff', 'admin'] as RolUsuario[]).map((rol) => (
                                <button
                                  key={rol}
                                  onClick={() => {
                                    onActualizarRol(usuario.id, rol)
                                    setMenuOpen(null)
                                  }}
                                  className={cn(
                                    'rounded px-2 py-1 text-xs transition-colors',
                                    usuario.rol === rol
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-muted'
                                  )}
                                >
                                  {ROL_CONFIG[rol].label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              onToggleActivo(usuario.id)
                              setMenuOpen(null)
                            }}
                            className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                          >
                            <Power className="h-4 w-4" />
                            {usuario.activo ? 'Desactivar' : 'Activar'}
                          </button>

                          <button
                            onClick={() => {
                              onEliminar(usuario.id)
                              setMenuOpen(null)
                            }}
                            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5" />
            Permisos por rol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(ROL_CONFIG).map(([key, config]) => (
              <div key={key} className="rounded-lg border p-3">
                <Badge className={cn('mb-2', config.color)}>{config.label}</Badge>
                <p className="text-muted-foreground text-sm">{config.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal invitar */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent size="sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Invitar usuario</h2>
            <p className="text-muted-foreground text-sm">
              Envía una invitación para unirse a tu equipo
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="usuario@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteRol">Rol</Label>
              <Select
                id="inviteRol"
                options={Object.entries(ROL_CONFIG)
                  .filter(([key]) => key !== 'owner')
                  .map(([key, config]) => ({ value: key, label: config.label }))}
                value={inviteRol}
                onChange={(e) => setInviteRol(e.target.value as RolUsuario)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInvite} isLoading={isSubmitting} disabled={!inviteEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar invitación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
