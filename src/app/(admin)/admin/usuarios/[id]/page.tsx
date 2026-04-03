'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Star,
  Heart,
  MapPin,
  DollarSign,
  Settings,
  Key,
  Ban,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdminUsers } from '../../hooks/useAdmin'
import { ChangeRoleModal } from '../../components/change-role-modal'
import { SuspendUserModal } from '../../components/suspend-user-modal'
import type { UserRole, UserStatus } from '../../types'

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  user: { label: 'Usuario', color: 'bg-gray-100 text-gray-700' },
  owner: { label: 'Owner', color: 'bg-blue-100 text-blue-700' },
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
}

const STATUS_LABELS: Record<UserStatus, { label: string; color: string }> = {
  active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspendido', color: 'bg-red-100 text-red-700' },
  pending_approval: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const { getUserById, updateUserRole, updateUserStatus } = useAdminUsers()
  const user = getUserById(userId)

  const [showRoleModal, setShowRoleModal] = React.useState(false)
  const [showSuspendModal, setShowSuspendModal] = React.useState(false)
  const [suspendAction, setSuspendAction] = React.useState<'suspend' | 'activate'>('suspend')

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Usuario no encontrado</p>
        <Link
          href="/admin/usuarios"
          className="text-primary mt-4 text-sm font-medium hover:underline"
        >
          Volver a usuarios
        </Link>
      </div>
    )
  }

  const roleInfo = ROLE_LABELS[user.role]
  const statusInfo = STATUS_LABELS[user.status]

  const handleChangeRole = (newRole: UserRole) => {
    updateUserRole(userId, newRole)
  }

  const handleSuspend = (reason?: string) => {
    if (suspendAction === 'suspend') {
      updateUserStatus(userId, 'suspended')
    } else {
      updateUserStatus(userId, 'active')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.fullName}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleInfo.color}`}
              >
                {roleInfo.label}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {user.status === 'active' ? (
            <button
              onClick={() => {
                setSuspendAction('suspend')
                setShowSuspendModal(true)
              }}
              className="border-destructive/50 text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Ban className="h-4 w-4" />
              Suspender
            </button>
          ) : (
            <button
              onClick={() => {
                setSuspendAction('activate')
                setShowSuspendModal(true)
              }}
              className="border-primary/50 text-primary hover:bg-primary/10 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Activar
            </button>
          )}
          <button
            onClick={() => setShowRoleModal(true)}
            className="border-input bg-background hover:bg-accent flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            <Shield className="h-4 w-4" />
            Cambiar Rol
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          {/* Personal Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <User className="h-4 w-4" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Email
                  </p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Teléfono
                  </p>
                  <p className="text-sm">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Registrado
                  </p>
                  <p className="text-sm">
                    {new Date(user.registeredAt).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Key className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Método
                  </p>
                  <p className="text-sm">
                    {user.registeredVia === 'google_oauth' ? 'Google OAuth' : 'Email/Contraseña'}
                  </p>
                </div>
              </div>
              {user.lastActivity && (
                <div className="flex items-center gap-3">
                  <Activity className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Última Actividad
                    </p>
                    <p className="text-sm">
                      {new Date(user.lastActivity).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Activity */}
        <div className="space-y-6">
          {/* Stats based on role */}
          {user.role === 'user' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Activity className="h-4 w-4" />
                  Actividad como Jugador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Calendar className="text-primary mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-bold">{user.totalReservations || 0}</p>
                    <p className="text-muted-foreground text-xs">Reservas</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Star className="text-primary mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-bold">{user.totalReviews || 0}</p>
                    <p className="text-muted-foreground text-xs">Reseñas</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <Heart className="text-primary mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-bold">{user.favoriteCourts || 0}</p>
                    <p className="text-muted-foreground text-xs">Favoritos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'owner' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <MapPin className="h-4 w-4" />
                  Actividad como Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <MapPin className="text-primary mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-bold">{user.totalVenues || 0}</p>
                    <p className="text-muted-foreground text-xs">Canchas</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <DollarSign className="text-primary mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-bold">
                      S/{(user.totalRevenue || 0).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-xs">Ingresos Totales</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/admin/canchas?owner=${user.id}`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Ver canchas de este owner →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Shield className="h-4 w-4" />
                  Actividad como Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Settings className="text-primary mx-auto h-5 w-5" />
                  <p className="mt-2 text-2xl font-bold">{user.adminActions || 0}</p>
                  <p className="text-muted-foreground text-xs">Acciones Realizadas</p>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/admin/auditoria?admin=${user.id}`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Ver logs de este admin →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => setShowRoleModal(true)}
                className="hover:bg-muted flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Cambiar Rol</p>
                    <p className="text-muted-foreground text-xs">Modificar permisos del usuario</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </button>

              <button
                onClick={() => {
                  setSuspendAction(user.status === 'active' ? 'suspend' : 'activate')
                  setShowSuspendModal(true)
                }}
                className="hover:bg-muted flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Ban className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">
                      {user.status === 'active' ? 'Suspender Usuario' : 'Activar Usuario'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {user.status === 'active'
                        ? 'Bloquear acceso a la plataforma'
                        : 'Restaurar acceso'}
                    </p>
                  </div>
                </div>
              </button>

              <button className="hover:bg-muted flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors">
                <Key className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Reset Password</p>
                  <p className="text-muted-foreground text-xs">Forzar cambio de contraseña</p>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {user.status === 'suspended' && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive text-base font-semibold">
                  Zona de Peligro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Este usuario está suspendido. Puedes activarlo para restaurar su acceso.
                </p>
                <button
                  onClick={() => {
                    setSuspendAction('activate')
                    setShowSuspendModal(true)
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  Activar Usuario
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <ChangeRoleModal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        userName={user.fullName}
        currentRole={user.role}
        onConfirm={handleChangeRole}
      />

      <SuspendUserModal
        open={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        userName={user.fullName}
        action={suspendAction}
        onConfirm={handleSuspend}
      />
    </div>
  )
}
