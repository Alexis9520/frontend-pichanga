'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Image as ImageIcon,
  User,
  Phone,
  Mail,
  Settings,
  Calendar,
  Tag,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Star,
  Users,
} from 'lucide-react'
import type { VenueDetails } from '../../types'

export default function VenueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string

  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'schedule' | 'pricing' | 'policies' | 'stats'
  >('overview')
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = React.useState(false)

  // Mock data - in production, fetch from API
  const venue: VenueDetails = React.useMemo(
    () => ({
      id: venueId,
      name: 'Los Campeones',
      ownerId: 'owner-1',
      ownerName: 'Pedro Ramos',
      ownerEmail: 'pedro@email.com',
      ownerPhone: '+51 999 888 777',
      address: 'Av. Principal 123',
      city: 'Lima',
      district: 'San Isidro',
      coordinates: { lat: -12.099306, lng: -77.033947 },
      sportType: 'f5',
      surface: 'grass_synthetic',
      capacity: 10,
      services: ['Estacionamiento', 'Baños', 'Duchas', 'Iluminación', 'Quincho'],
      photos: [
        '/placeholder-venue-1.jpg',
        '/placeholder-venue-2.jpg',
        '/placeholder-venue-3.jpg',
        '/placeholder-venue-4.jpg',
      ],
      description:
        'Cancha de fútbol 5 con grass sintético de alta calidad. Incluye iluminación LED y vestidores con duchas.',
      basePrice: 80,
      nightPrice: 120,
      nightStartHour: '18:00',
      dayStartHour: '06:00',
      closingHour: '23:00',
      schedules: [
        { dayOfWeek: 0, openTime: '08:00', closeTime: '22:00', isOpen: true },
        { dayOfWeek: 1, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 2, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 3, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 4, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 5, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 6, openTime: '06:00', closeTime: '23:00', isOpen: true },
      ],
      timeSlots: [],
      policies: {
        toleranceMinutes: 15,
        excessPolicy: 'lose_reservation',
        minimumAdvance: 30,
        cancellationHours: 3,
        refundPercentage: 100,
      },
      activePromotions: 2,
      inventoryItems: 15,
      status: 'active',
      createdAt: '2026-01-15T10:30:00Z',
      stats: {
        totalReservations: 156,
        totalRevenue: 15600,
        averageRating: 4.5,
        totalReviews: 48,
        occupancyRate: 78,
      },
    }),
    [venueId]
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Activa</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactiva</Badge>
      case 'under_review':
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            En Revisión
          </Badge>
        )
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{venue.name}</h1>
              {getStatusBadge(venue.status)}
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              {venue.address}, {venue.district}, {venue.city}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="border-input bg-background hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar (Override)
          </button>
          {venue.status === 'active' ? (
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Ban className="h-4 w-4" />
              Desactivar
            </button>
          ) : (
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <CheckCircle className="h-4 w-4" />
              Activar
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards (Only for active venues) */}
      {venue.stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs font-medium">Reservas Totales</p>
              <p className="mt-1 text-2xl font-bold">{venue.stats.totalReservations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs font-medium">Ingresos Totales</p>
              <p className="mt-1 text-2xl font-bold">
                S/{venue.stats.totalRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs font-medium">Rating Promedio</p>
              <p className="mt-1 flex items-center gap-1 text-2xl font-bold">
                {venue.stats.averageRating}
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs font-medium">Reseñas</p>
              <p className="mt-1 text-2xl font-bold">{venue.stats.totalReviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs font-medium">Ocupación</p>
              <p className="mt-1 text-2xl font-bold">{venue.stats.occupancyRate}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'General' },
            { id: 'schedule', label: 'Horarios' },
            { id: 'pricing', label: 'Precios' },
            { id: 'policies', label: 'Políticas' },
            ...(venue.stats ? [{ id: 'stats', label: 'Estadísticas' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary border-b-2'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Owner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{venue.ownerName}</p>
                <div className="text-muted-foreground mt-2 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${venue.ownerEmail}`} className="hover:text-foreground">
                      {venue.ownerEmail}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${venue.ownerPhone}`} className="hover:text-foreground">
                      {venue.ownerPhone}
                    </a>
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/owners?id=${venue.ownerId}`}
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium"
              >
                Ver detalle del owner
                <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </CardContent>
          </Card>

          {/* Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Tipo de Deporte</p>
                  <p className="font-medium">{getSportTypeLabel(venue.sportType)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Superficie</p>
                  <p className="font-medium">{getSurfaceLabel(venue.surface)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Capacidad</p>
                  <p className="font-medium">{venue.capacity} jugadores</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Promociones Activas</p>
                  <p className="font-medium">{venue.activePromotions}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground mb-2 text-xs">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {venue.services.map((service: string) => (
                    <span
                      key={service}
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-4 w-4" />
                Fotos ({venue.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {venue.photos.map((photo: string, index: number) => (
                  <div
                    key={index}
                    className="bg-muted aspect-video rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                ))}
              </div>
              {venue.description && (
                <div className="bg-muted/30 mt-4 rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">Descripción</p>
                  <p className="mt-1 text-sm">{venue.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'schedule' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Horarios de Operación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {venue.schedules.map((schedule) => (
                <div
                  key={schedule.dayOfWeek}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3',
                    schedule.isOpen ? 'bg-background' : 'bg-muted/30'
                  )}
                >
                  <span className="w-24 font-medium">{getDayName(schedule.dayOfWeek)}</span>
                  {schedule.isOpen ? (
                    <span className="text-muted-foreground text-sm">
                      {schedule.openTime} - {schedule.closeTime}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Cerrado</span>
                  )}
                  {schedule.isOpen && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'pricing' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Precios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Precio Diurno</p>
                  <p className="mt-1 text-2xl font-bold">S/{venue.basePrice}/hora</p>
                  <p className="text-muted-foreground text-xs">Desde {venue.dayStartHour}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Precio Nocturno</p>
                  <p className="mt-1 text-2xl font-bold">S/{venue.nightPrice}/hora</p>
                  <p className="text-muted-foreground text-xs">Desde {venue.nightStartHour}</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Horario de Operación</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {venue.dayStartHour} - {venue.closingHour}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4" />
                Promociones e Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Promociones Activas</p>
                  <p className="mt-1 text-2xl font-bold">{venue.activePromotions}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Productos en Inventario</p>
                  <p className="mt-1 text-2xl font-bold">{venue.inventoryItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'policies' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Políticas de la Cancha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Tolerancia de Llegada</p>
                <p className="mt-1 text-xl font-bold">{venue.policies.toleranceMinutes} min</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Tiempo de gracia después de hora de inicio
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Política de Exceso</p>
                <p className="mt-1 text-xl font-bold">
                  {getExcessPolicyLabel(venue.policies.excessPolicy)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Adelanto Mínimo</p>
                <p className="mt-1 text-xl font-bold">S/{venue.policies.minimumAdvance}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Cancelación Gratuita</p>
                <p className="mt-1 text-xl font-bold">{venue.policies.cancellationHours}h antes</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">Reembolso</p>
                <p className="mt-1 text-xl font-bold">{venue.policies.refundPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'stats' && venue.stats && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasa de Ocupación</span>
                  <span className="font-medium">{venue.stats.occupancyRate}%</span>
                </div>
                <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${venue.stats.occupancyRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Reservas Totales</p>
                  <p className="mt-1 text-2xl font-bold">{venue.stats.totalReservations}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Ingresos Totales</p>
                  <p className="mt-1 text-2xl font-bold">
                    S/{venue.stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4" />
                Reseñas y Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold">{venue.stats.averageRating}</p>
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-5 w-5',
                          star <= venue.stats!.averageRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {venue.stats.totalReviews} reseñas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata */}
      <div className="text-muted-foreground text-xs">
        ID: {venue.id} • Creada: {new Date(venue.createdAt).toLocaleDateString('es-PE')}
      </div>
    </div>
  )
}

// Helper functions
function getDayName(dayOfWeek: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[dayOfWeek] || 'Día'
}

function getSportTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    f5: 'Fútbol 5',
    f7: 'Fútbol 7',
    fulbito: 'Fulbito',
    f11: 'Fútbol 11',
  }
  return labels[type] || type
}

function getSurfaceLabel(surface: string): string {
  const labels: Record<string, string> = {
    grass_synthetic: 'Grass Sintético',
    grass_natural: 'Grass Natural',
    losa: 'Losa',
    concreto: 'Concreto',
  }
  return labels[surface] || surface
}

function getExcessPolicyLabel(policy: string): string {
  const labels: Record<string, string> = {
    lose_reservation: 'Pierde la reserva',
    penalty: 'Con penalidad',
    remaining_time: 'Tiempo restante',
    configurable: 'Configurable',
  }
  return labels[policy] || policy
}
