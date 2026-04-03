'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Search,
  Check,
  X,
  Eye,
  ChevronRight,
  MapPinned,
  Clock,
  DollarSign,
} from 'lucide-react'
import { VenueApprovalModal } from './components'
import type { VenueDetails } from '../types'

// Force dynamic rendering for useSearchParams
export const dynamic = 'force-dynamic'

function AdminVenuesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  const [activeTab, setActiveTab] = React.useState<'review' | 'active' | 'inactive'>(
    tabFromUrl === 'active' ? 'active' : tabFromUrl === 'inactive' ? 'inactive' : 'review'
  )
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Update tab when URL changes
  React.useEffect(() => {
    if (tabFromUrl === 'active') setActiveTab('active')
    else if (tabFromUrl === 'inactive') setActiveTab('inactive')
    else setActiveTab('review')
  }, [tabFromUrl])

  // Mock data - in production, fetch from API
  const reviewVenues: VenueDetails[] = [
    {
      id: 'venue-1',
      name: 'Cancha 5',
      ownerId: 'owner-1',
      ownerName: 'Roberto García',
      ownerEmail: 'roberto@email.com',
      ownerPhone: '+51 999 123 456',
      address: 'Av. Principal 123',
      city: 'Lima',
      district: 'San Isidro',
      coordinates: { lat: -12.099306, lng: -77.033947 },
      sportType: 'f5',
      surface: 'grass_synthetic',
      capacity: 10,
      services: ['Estacionamiento', 'Baños', 'Iluminación'],
      photos: ['/photo1.jpg', '/photo2.jpg', '/photo3.jpg'],
      description: 'Cancha de fútbol 5 con grass sintético.',
      basePrice: 80,
      nightPrice: 120,
      nightStartHour: '18:00',
      dayStartHour: '06:00',
      closingHour: '23:00',
      schedules: [
        { dayOfWeek: 1, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 2, openTime: '06:00', closeTime: '23:00', isOpen: true },
        { dayOfWeek: 3, openTime: '06:00', closeTime: '23:00', isOpen: true },
      ],
      timeSlots: [],
      policies: {
        toleranceMinutes: 15,
        excessPolicy: 'lose_reservation',
        minimumAdvance: 30,
        cancellationHours: 3,
        refundPercentage: 100,
      },
      activePromotions: 0,
      inventoryItems: 5,
      status: 'under_review',
      createdAt: '2026-04-01T10:00:00Z',
    },
    {
      id: 'venue-2',
      name: 'Fútbol Total',
      ownerId: 'owner-2',
      ownerName: 'María Lopez',
      ownerEmail: 'maria@email.com',
      ownerPhone: '+51 999 654 321',
      address: 'Jr. Deportes 456',
      city: 'Arequipa',
      district: 'Cercado',
      coordinates: { lat: -16.39889, lng: -71.535 },
      sportType: 'f7',
      surface: 'grass_natural',
      capacity: 14,
      services: ['Estacionamiento', 'Baños', 'Duchas', 'Quincho'],
      photos: ['/photo1.jpg', '/photo2.jpg'],
      description: 'Cancha de fútbol 7 con grass natural.',
      basePrice: 100,
      nightPrice: 150,
      nightStartHour: '18:00',
      dayStartHour: '07:00',
      closingHour: '22:00',
      schedules: [
        { dayOfWeek: 1, openTime: '07:00', closeTime: '22:00', isOpen: true },
        { dayOfWeek: 2, openTime: '07:00', closeTime: '22:00', isOpen: true },
      ],
      timeSlots: [],
      policies: {
        toleranceMinutes: 10,
        excessPolicy: 'penalty',
        minimumAdvance: 50,
        cancellationHours: 6,
        refundPercentage: 80,
      },
      activePromotions: 0,
      inventoryItems: 8,
      status: 'under_review',
      createdAt: '2026-03-28T14:30:00Z',
    },
  ]

  const activeVenues = [
    {
      id: '1',
      name: 'Los Campeones',
      owner: 'Pedro Ramos',
      ownerEmail: 'pedro@email.com',
      city: 'Lima',
      district: 'San Isidro',
      occupancy: 78,
      totalReservations: 156,
      revenue: 'S/15,600',
    },
    {
      id: '2',
      name: 'Fútbol Pro',
      owner: 'Ana Martinez',
      ownerEmail: 'ana@email.com',
      city: 'Arequipa',
      district: 'Cercado',
      occupancy: 65,
      totalReservations: 98,
      revenue: 'S/9,800',
    },
    {
      id: '3',
      name: 'Cancha 7',
      owner: 'Carlos Ruiz',
      ownerEmail: 'carlos@email.com',
      city: 'Trujillo',
      district: 'Centro',
      occupancy: 82,
      totalReservations: 201,
      revenue: 'S/20,100',
    },
  ]

  const inactiveVenues = [
    {
      id: '4',
      name: 'Deportes Total',
      owner: 'Luis Torres',
      ownerEmail: 'luis@email.com',
      city: 'Cusco',
      district: 'Centro',
      reason: 'Suspendida por malas reseñas',
    },
    {
      id: '5',
      name: 'La Cancha',
      owner: 'Elena Vega',
      ownerEmail: 'elena@email.com',
      city: 'Chiclayo',
      district: 'Centro',
      reason: 'Mantenimiento prolongado',
    },
  ]

  const handleApprove = async (venueId: string) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Approved venue:', venueId)
    setIsSubmitting(false)
    setSelectedVenueId(null)
    // Refresh data in production
  }

  const handleReject = async (venueId: string, reason: string) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Rejected venue:', venueId, 'Reason:', reason)
    setIsSubmitting(false)
    setSelectedVenueId(null)
    // Refresh data in production
  }

  const selectedVenue = selectedVenueId
    ? reviewVenues.find((v) => v.id === selectedVenueId) || null
    : null

  const pendingCount = reviewVenues.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Canchas</h1>
        <p className="text-muted-foreground text-sm">Aprobación y gestión de canchas</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setActiveTab('review')
              router.push('/admin/canchas?tab=review')
            }}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'review'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            En Revisión
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingCount}
              </Badge>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('active')
              router.push('/admin/canchas?tab=active')
            }}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => {
              setActiveTab('inactive')
              router.push('/admin/canchas?tab=inactive')
            }}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'inactive'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Inactivas
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar cancha..."
            className="border-input bg-background focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none">
            <option>Todas las ciudades</option>
            <option>Lima</option>
            <option>Arequipa</option>
            <option>Cusco</option>
            <option>Trujillo</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'review' && (
        <div className="grid gap-4">
          {reviewVenues.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Check className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <p className="text-muted-foreground mt-4 text-sm">
                  No hay canchas pendientes de revisión
                </p>
              </CardContent>
            </Card>
          ) : (
            reviewVenues.map((venue) => (
              <Card key={venue.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{venue.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getSportTypeLabel(venue.sportType)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Owner: {venue.ownerName} • {venue.ownerEmail}
                      </p>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPinned className="h-3 w-3" />
                          {venue.address}
                        </span>
                        <span>
                          {venue.city}, {venue.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          S/{venue.basePrice}/hora
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {venue.dayStartHour} - {venue.closingHour}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Enviada: {new Date(venue.createdAt).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => setSelectedVenueId(venue.id)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Revisar
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cancha
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Owner
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Ciudad
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Reservas
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Ocupación
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Ingresos
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activeVenues.map((venue) => (
                    <tr key={venue.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/canchas/${venue.id}`}
                          className="hover:text-primary font-medium"
                        >
                          {venue.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{venue.owner}</p>
                        <p className="text-muted-foreground text-xs">{venue.ownerEmail}</p>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{venue.city}</td>
                      <td className="px-4 py-3 text-sm">{venue.totalReservations}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${venue.occupancy}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{venue.occupancy}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{venue.revenue}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/canchas/${venue.id}`}
                          className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'inactive' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cancha
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Owner
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Ciudad
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Motivo
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inactiveVenues.map((venue) => (
                    <tr key={venue.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{venue.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{venue.owner}</p>
                        <p className="text-muted-foreground text-xs">{venue.ownerEmail}</p>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{venue.city}</td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{venue.reason}</td>
                      <td className="px-4 py-3">
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1 text-xs font-medium">
                          Reactivar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Modal */}
      <VenueApprovalModal
        open={!!selectedVenueId}
        onClose={() => setSelectedVenueId(null)}
        venue={selectedVenue}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}

// Helper functions
function getSportTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    f5: 'Fútbol 5',
    f7: 'Fútbol 7',
    fulbito: 'Fulbito',
    f11: 'Fútbol 11',
  }
  return labels[type] || type
}

// Default export with Suspense for useSearchParams
export default function AdminVenuesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <AdminVenuesContent />
    </React.Suspense>
  )
}
