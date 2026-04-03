'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  FileText,
  ShoppingCart,
  Settings,
  Send,
} from 'lucide-react'
import { useAdminReservations, useReservationDispute } from '../../hooks/useAdmin'
import type { ReservationDetails, ReservationDispute } from '../../types'
import { ReservationActionsModal, DisputePanel } from '../../components'

// Format date helper
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-PE', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Format time helper
function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

// Status badge
function StatusBadge({ status }: { status: ReservationDetails['status'] }) {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmada' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En curso' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completada' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelada' },
  }

  const { bg, text, label } = config[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  )
}

// Payment badge
function PaymentBadge({ status }: { status: ReservationDetails['paymentStatus'] }) {
  const config = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pendiente' },
    partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Parcial' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completo' },
    refunded: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reembolsado' },
  }

  const { bg, text, label } = config[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  )
}

export default function ReservationDetailPage() {
  const params = useParams()
  const reservationId = params.id as string
  const { getReservationDetails, getReservationById } = useAdminReservations()
  const { dispute, addMessage, resolveDispute, closeDispute } = useReservationDispute(reservationId)

  const reservation = getReservationById(reservationId)
  const details = getReservationDetails(reservationId)

  const [showActionsModal, setShowActionsModal] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'dispute' | 'timeline'>('overview')

  // If no details, show basic info
  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="text-muted-foreground mb-4 h-12 w-12" />
        <p className="text-muted-foreground">Reserva no encontrada</p>
        <Link href="/admin/reservas" className="text-primary mt-4 text-sm hover:underline">
          Volver a reservas
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/reservas"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a reservas
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reserva #{reservationId}</h1>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={reservation.status} />
            <PaymentBadge status={reservation.paymentStatus} />
            {reservation.hasDispute && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                <AlertTriangle className="h-3 w-3" />
                Disputa abierta
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowActionsModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Settings className="h-4 w-4" />
          Acciones Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Vista General
        </button>
        {reservation.hasDispute && (
          <button
            onClick={() => setActiveTab('dispute')}
            className={`inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'dispute'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Disputa
          </button>
        )}
        <button
          onClick={() => setActiveTab('timeline')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Venue & Schedule */}
          <div className="space-y-6">
            {/* Venue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Cancha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{reservation.venueName}</p>
                  {details && (
                    <>
                      <p className="text-muted-foreground text-sm">{details.venueAddress}</p>
                      <p className="text-muted-foreground text-sm">{details.venueCity}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Tipo: {details.venueType}
                      </p>
                    </>
                  )}
                </div>
                <div className="border-t pt-3">
                  <p className="text-muted-foreground text-xs font-medium">Owner</p>
                  <p className="text-sm font-medium">{reservation.ownerName}</p>
                  {details && (
                    <>
                      <p className="text-muted-foreground text-xs">{details.ownerEmail}</p>
                      <p className="text-muted-foreground text-xs">{details.ownerPhone}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Horario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">{formatDate(reservation.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                  </span>
                </div>
                {details && (
                  <div className="text-muted-foreground text-xs">
                    Duración: {details.durationHours} horas
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Extras */}
            {details?.extras && details.extras.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart className="h-4 w-4" />
                    Extras Consumidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {details.extras.map((extra) => (
                      <div key={extra.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{extra.name}</span>
                          <span className="text-muted-foreground ml-1 text-xs">
                            ({extra.quantity} x S/{extra.unitPrice})
                          </span>
                        </div>
                        <span className="font-medium">S/{extra.total}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t pt-2 font-medium">
                      <span>Total Extras</span>
                      <span>S/{details.extrasTotal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle column - Client & Payment */}
          <div className="space-y-6">
            {/* Client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">{reservation.clientName}</span>
                </div>
                {reservation.clientEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{reservation.clientEmail}</span>
                  </div>
                )}
                {reservation.clientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{reservation.clientPhone}</span>
                  </div>
                )}
                {details && (
                  <div className="border-t pt-3">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>Origen:</span>
                      <span className="text-foreground font-medium">
                        {details.source === 'app' ? 'App móvil' : 'Reserva manual'}
                      </span>
                    </div>
                    {details.bookedBy && (
                      <div className="mt-1 text-xs">
                        Reservado por: <span className="font-medium">{details.bookedBy}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4" />
                  Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Estado</span>
                  <PaymentBadge status={reservation.paymentStatus} />
                </div>
                {details && (
                  <>
                    <div className="flex items-center gap-2">
                      <CreditCard className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm capitalize">{details.paymentMethod}</span>
                    </div>
                    {details.paymentReference && (
                      <div className="text-muted-foreground text-xs">
                        Ref: {details.paymentReference}
                      </div>
                    )}
                    {details.paidAt && (
                      <div className="text-muted-foreground text-xs">
                        Pagado: {formatDate(details.paidAt)}
                      </div>
                    )}
                  </>
                )}

                {/* Pricing breakdown */}
                {details && (
                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Precio base</span>
                      <span>S/{details.basePrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Extras</span>
                      <span>S/{details.extrasTotal}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 font-medium">
                      <span>Total</span>
                      <span className="text-lg">S/{details.totalPrice}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>Comisión ({details.commissionAmount}%)</span>
                      <span>S/{details.commissionAmount}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>Revenue owner</span>
                      <span>S/{details.ownerRevenue}</span>
                    </div>
                  </div>
                )}

                {/* Refund info */}
                {details?.refundAmount && (
                  <div className="-mx-2 space-y-2 rounded-lg border-t bg-red-50 p-2 pt-3">
                    <div className="flex items-center justify-between text-sm text-red-700">
                      <span>Reembolso procesado</span>
                      <span className="font-medium">S/{details.refundAmount}</span>
                    </div>
                    {details.refundReason && (
                      <div className="text-xs text-red-600">Razón: {details.refundReason}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Notes & Actions */}
          <div className="space-y-6">
            {/* Notes */}
            {details && (details.clientNotes || details.ownerNotes || details.adminNotes) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Notas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {details.clientNotes && (
                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="text-muted-foreground text-xs font-medium">Cliente</p>
                      <p className="text-sm">{details.clientNotes}</p>
                    </div>
                  )}
                  {details.ownerNotes && (
                    <div className="rounded-lg bg-green-50 p-3">
                      <p className="text-muted-foreground text-xs font-medium">Owner</p>
                      <p className="text-sm">{details.ownerNotes}</p>
                    </div>
                  )}
                  {details.adminNotes && (
                    <div className="rounded-lg bg-orange-50 p-3">
                      <p className="text-muted-foreground text-xs font-medium">Admin</p>
                      <p className="text-sm">{details.adminNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/admin/canchas/${reservation.venueId}`}
                  className="text-muted-foreground hover:text-foreground flex items-center justify-between rounded-lg border p-3 text-sm transition-colors"
                >
                  <span>Ver cancha</span>
                  <MapPin className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/owners`}
                  className="text-muted-foreground hover:text-foreground flex items-center justify-between rounded-lg border p-3 text-sm transition-colors"
                >
                  <span>Ver owner</span>
                  <User className="h-4 w-4" />
                </Link>
                {details?.clientId && (
                  <Link
                    href={`/admin/usuarios/${details.clientId}`}
                    className="text-muted-foreground hover:text-foreground flex items-center justify-between rounded-lg border p-3 text-sm transition-colors"
                  >
                    <span>Ver cliente</span>
                    <User className="h-4 w-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Dispute Tab */}
      {activeTab === 'dispute' && reservation.hasDispute && (
        <DisputePanel
          dispute={dispute}
          onAddMessage={addMessage}
          onResolve={resolveDispute}
          onClose={closeDispute}
        />
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && details && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de la Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Created */}
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Reserva creada</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(details.createdAt)} - via{' '}
                    {details.source === 'app' ? 'App' : 'Manual'}
                  </p>
                </div>
              </div>

              {/* Confirmed */}
              {details.confirmedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reserva confirmada</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(details.confirmedAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment */}
              {details.paidAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pago procesado</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(details.paidAt)} - {details.paymentMethod}
                    </p>
                  </div>
                </div>
              )}

              {/* Dispute opened */}
              {details.dispute?.openedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Disputa abierta</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(details.dispute.openedAt)} - por {details.dispute.openedBy}
                    </p>
                  </div>
                </div>
              )}

              {/* Completed */}
              {details.completedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reserva completada</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(details.completedAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Cancelled */}
              {details.cancelledAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reserva cancelada</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(details.cancelledAt)}
                      {details.cancelledBy && ` - por ${details.cancelledBy}`}
                    </p>
                    {details.cancellationReason && (
                      <p className="mt-1 text-xs text-red-600">{details.cancellationReason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Refund */}
              {details.refundProcessedAt && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reembolso procesado</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(details.refundProcessedAt)} - S/{details.refundAmount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions Modal */}
      {showActionsModal && (
        <ReservationActionsModal
          reservation={reservation}
          details={details}
          onClose={() => setShowActionsModal(false)}
        />
      )}
    </div>
  )
}
