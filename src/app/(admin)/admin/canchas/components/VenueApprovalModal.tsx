'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  User,
  Settings,
  Tag,
  ChevronRight,
} from 'lucide-react'
import type { VenueDetails, VenueReviewData, VenueSchedule, VenueTimeSlot } from '../../types'

interface VenueApprovalModalProps {
  open: boolean
  onClose: () => void
  venue: VenueDetails | null
  onApprove: (venueId: string) => Promise<void>
  onReject: (venueId: string, reason: string) => Promise<void>
}

export function VenueApprovalModal({
  open,
  onClose,
  venue,
  onApprove,
  onReject,
}: VenueApprovalModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showRejectForm, setShowRejectForm] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'schedule' | 'pricing' | 'policies'
  >('overview')

  // Calculate review data
  const reviewData: VenueReviewData | null = venue
    ? {
        hasBasicInfo: !!(venue.name && venue.address && venue.city),
        hasPhotos: venue.photos.length >= 3,
        hasCoordinates: !!(venue.coordinates.lat && venue.coordinates.lng),
        hasSchedules: venue.schedules.filter((s: VenueSchedule) => s.isOpen).length > 0,
        hasPricing: !!(venue.basePrice > 0),
        hasPolicies: !!(venue.policies.toleranceMinutes >= 0),
        photoCount: venue.photos.length,
        scheduleDays: venue.schedules.filter((s) => s.isOpen).length,
        timeSlotCount: venue.timeSlots.length,
        issues: getIssues(venue),
      }
    : null

  const canApprove = reviewData
    ? reviewData.hasBasicInfo &&
      reviewData.hasPhotos &&
      reviewData.hasCoordinates &&
      reviewData.hasSchedules &&
      reviewData.hasPricing
    : false

  React.useEffect(() => {
    if (!open) {
      setShowRejectForm(false)
      setRejectReason('')
      setActiveTab('overview')
    }
  }, [open])

  const handleApprove = async () => {
    if (!venue) return
    setIsSubmitting(true)
    try {
      await onApprove(venue.id)
      onClose()
    } catch (error) {
      console.error('Error approving venue:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!venue || !rejectReason.trim()) return
    setIsSubmitting(true)
    try {
      await onReject(venue.id, rejectReason)
      onClose()
    } catch (error) {
      console.error('Error rejecting venue:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open || !venue) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="bg-background relative z-10 w-full max-w-4xl rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{venue.name}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Revisión de cancha • {venue.city}, {venue.district}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 -mb-4 flex gap-1 border-b">
            {[
              { id: 'overview', label: 'General' },
              { id: 'schedule', label: 'Horarios' },
              { id: 'pricing', label: 'Precios' },
              { id: 'policies', label: 'Políticas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
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
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Venue Info */}
              <div className="space-y-6">
                {/* Owner Info */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <User className="h-4 w-4" />
                    Owner
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium">{venue.ownerName}</p>
                    <div className="text-muted-foreground mt-2 space-y-1 text-sm">
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {venue.ownerEmail}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {venue.ownerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{venue.address}</p>
                    <p className="text-muted-foreground text-sm">
                      {venue.city}, {venue.district}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-mono text-xs">
                        {venue.coordinates.lat.toFixed(6)}, {venue.coordinates.lng.toFixed(6)}
                      </span>
                      {reviewData?.hasCoordinates ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <Settings className="h-4 w-4" />
                    Características
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Tipo de Deporte</p>
                      <p className="font-medium">{getSportTypeLabel(venue.sportType)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Superficie</p>
                      <p className="font-medium">{getSurfaceLabel(venue.surface)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Capacidad</p>
                      <p className="font-medium">{venue.capacity} jugadores</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Servicios</p>
                      <p className="font-medium">{venue.services.length} disponibles</p>
                    </div>
                  </div>
                  {venue.services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {venue.services.map((service: string) => (
                        <span
                          key={service}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Photos & Checklist */}
              <div className="space-y-6">
                {/* Photos */}
                <div>
                  <h3 className="mb-3 flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Fotos
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        reviewData?.hasPhotos ? 'text-green-500' : 'text-amber-500'
                      )}
                    >
                      {reviewData?.photoCount}/3 mín.
                    </span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {venue.photos.map((photo: string, index: number) => (
                      <div
                        key={index}
                        className="bg-muted aspect-video rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${photo})` }}
                      />
                    ))}
                    {venue.photos.length < 3 &&
                      Array.from({ length: 3 - venue.photos.length }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="bg-muted/30 flex aspect-video items-center justify-center rounded-lg"
                        >
                          <ImageIcon className="text-muted-foreground/50 h-6 w-6" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Review Checklist */}
                <div>
                  <h3 className="mb-3 font-semibold">Estado de Revisión</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Información básica', valid: reviewData?.hasBasicInfo },
                      { label: 'Fotos (mínimo 3)', valid: reviewData?.hasPhotos },
                      { label: 'Coordenadas GPS', valid: reviewData?.hasCoordinates },
                      { label: 'Horarios configurados', valid: reviewData?.hasSchedules },
                      { label: 'Precios definidos', valid: reviewData?.hasPricing },
                      { label: 'Políticas establecidas', valid: reviewData?.hasPolicies },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-muted/30 flex items-center justify-between rounded-lg px-3 py-2"
                      >
                        <span className="text-sm">{item.label}</span>
                        {item.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Issues */}
                  {reviewData?.issues && reviewData.issues.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        Problemas encontrados
                      </h4>
                      <ul className="space-y-1">
                        {reviewData.issues.map((issue: string, i: number) => (
                          <li key={i} className="text-muted-foreground text-sm">
                            • {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 font-semibold">Horarios de Operación</h3>
                <div className="grid gap-3">
                  {venue.schedules.map((schedule: VenueSchedule) => (
                    <div
                      key={schedule.dayOfWeek}
                      className={cn(
                        'flex items-center justify-between rounded-lg border p-3',
                        schedule.isOpen ? 'bg-background' : 'bg-muted/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-24 font-medium">{getDayName(schedule.dayOfWeek)}</span>
                        {schedule.isOpen ? (
                          <span className="text-muted-foreground text-sm">
                            {schedule.openTime} - {schedule.closeTime}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Cerrado</span>
                        )}
                      </div>
                      {schedule.isOpen && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  ))}
                </div>
              </div>

              {venue.timeSlots.length > 0 && (
                <div>
                  <h3 className="mb-4 font-semibold">
                    Slots de Tiempo Configurados ({venue.timeSlots.length})
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      El owner ha configurado {venue.timeSlots.length} slots de tiempo con precios
                      diferenciados.
                    </p>
                    <div className="mt-3 grid max-h-48 grid-cols-4 gap-2 overflow-y-auto">
                      {venue.timeSlots.slice(0, 20).map((slot: VenueTimeSlot, index: number) => (
                        <div key={index} className="bg-background rounded p-2 text-center text-xs">
                          <p className="font-medium">{slot.startTime}</p>
                          <p className="text-muted-foreground">S/{slot.price}</p>
                        </div>
                      ))}
                      {venue.timeSlots.length > 20 && (
                        <div className="bg-background text-muted-foreground rounded p-2 text-center text-xs">
                          +{venue.timeSlots.length - 20} más
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground text-sm">Precio Base (Diurno)</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold">S/{venue.basePrice}/hora</p>
                  <p className="text-muted-foreground text-xs">Desde {venue.dayStartHour}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span className="text-muted-foreground text-sm">Precio Nocturno</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold">S/{venue.nightPrice}/hora</p>
                  <p className="text-muted-foreground text-xs">Desde {venue.nightStartHour}</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-medium">Horario de Operación</h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Apertura: {venue.dayStartHour}
                  </span>
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                  <span>Cierre: {venue.closingHour}</span>
                </div>
              </div>

              {venue.activePromotions > 0 && (
                <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="text-primary h-4 w-4" />
                    <span className="font-medium">Promociones Activas</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Esta cancha tiene {venue.activePromotions} promocion(es) activa(s)
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Tolerancia de Llegada</p>
                  <p className="mt-1 font-medium">{venue.policies.toleranceMinutes} minutos</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Política de Exceso</p>
                  <p className="mt-1 font-medium">
                    {getExcessPolicyLabel(venue.policies.excessPolicy)}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Adelanto Mínimo</p>
                  <p className="mt-1 font-medium">S/{venue.policies.minimumAdvance}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Cancelación Gratuita</p>
                  <p className="mt-1 font-medium">{venue.policies.cancellationHours}h antes</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Reembolso</p>
                  <p className="mt-1 font-medium">{venue.policies.refundPercentage}%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Inventario</p>
                  <p className="mt-1 font-medium">{venue.inventoryItems} productos</p>
                </div>
              </div>

              {venue.description && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Descripción</p>
                  <p className="mt-2 text-sm">{venue.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          {!showRejectForm ? (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Creada: {new Date(venue.createdAt).toLocaleDateString('es-PE')}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isSubmitting}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Rechazar
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting || !canApprove}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Aprobar Cancha'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Razón del Rechazo</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explica por qué se rechaza esta cancha..."
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason.trim()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Rechazo'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getIssues(venue: VenueDetails): string[] {
  const issues: string[] = []

  if (venue.photos.length < 3) {
    issues.push(`Se requieren al menos 3 fotos (actualmente tiene ${venue.photos.length})`)
  }

  if (!venue.coordinates.lat || !venue.coordinates.lng) {
    issues.push('Coordenadas GPS no válidas')
  }

  if (venue.schedules.filter((s: VenueSchedule) => s.isOpen).length === 0) {
    issues.push('No hay horarios de operación configurados')
  }

  if (venue.basePrice <= 0) {
    issues.push('Precio base no configurado')
  }

  if (!venue.policies.toleranceMinutes && venue.policies.toleranceMinutes !== 0) {
    issues.push('Política de tolerancia no configurada')
  }

  return issues
}

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
    remaining_time: 'Solo tiempo restante',
    configurable: 'Configurable por owner',
  }
  return labels[policy] || policy
}
