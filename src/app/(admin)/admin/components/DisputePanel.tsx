'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertTriangle,
  User,
  Clock,
  MessageSquare,
  FileText,
  Image,
  Send,
  CheckCircle,
  DollarSign,
  X,
  ChevronDown,
} from 'lucide-react'
import type { ReservationDispute, DisputeMessage } from '../types'

interface DisputePanelProps {
  dispute: ReservationDispute | null
  onAddMessage: (message: string, senderId: string, senderName: string, senderRole: 'admin') => void
  onResolve: (
    resolution: 'favor_client' | 'favor_owner' | 'partial' | 'no_action',
    details: string,
    refundGranted?: number,
    compensationGranted?: number,
    adminId?: string
  ) => void
  onClose: () => void
}

// Status badge for dispute
function DisputeStatusBadge({ status }: { status: ReservationDispute['status'] }) {
  const config = {
    open: { bg: 'bg-red-100', text: 'text-red-700', label: 'Abierta' },
    in_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En revisión' },
    resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resuelta' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cerrada' },
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

// Message card
function MessageCard({ message }: { message: DisputeMessage }) {
  const roleColors = {
    client: 'bg-blue-50 border-blue-200',
    owner: 'bg-green-50 border-green-200',
    admin: 'bg-orange-50 border-orange-200',
  }

  const roleLabels = {
    client: 'Cliente',
    owner: 'Owner',
    admin: 'Admin',
  }

  return (
    <div className={`rounded-lg border p-3 ${roleColors[message.senderRole]}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{message.senderName}</span>
          <span className="text-muted-foreground text-xs">({roleLabels[message.senderRole]})</span>
        </div>
        <span className="text-muted-foreground text-xs">
          {new Date(message.createdAt).toLocaleDateString('es-PE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <p className="text-sm">{message.message}</p>
      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-2 flex gap-2">
          {message.attachments.map((att, i) => (
            <div key={i} className="text-muted-foreground flex items-center gap-1 text-xs">
              <Image className="h-3 w-3" />
              {att}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DisputePanel({ dispute, onAddMessage, onResolve, onClose }: DisputePanelProps) {
  const [showResolveForm, setShowResolveForm] = React.useState(false)
  const [resolution, setResolution] = React.useState<
    'favor_client' | 'favor_owner' | 'partial' | 'no_action'
  >('no_action')
  const [resolutionDetails, setResolutionDetails] = React.useState('')
  const [refundAmount, setRefundAmount] = React.useState('')
  const [compensationAmount, setCompensationAmount] = React.useState('')
  const [newMessage, setNewMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setLoading(true)

    setTimeout(() => {
      onAddMessage(newMessage, 'admin-3', 'Admin User', 'admin')
      setLoading(false)
      setNewMessage('')
    }, 300)
  }

  const handleResolve = () => {
    if (!resolutionDetails.trim()) return
    setLoading(true)

    setTimeout(() => {
      const refund = refundAmount ? parseFloat(refundAmount) : undefined
      const compensation = compensationAmount ? parseFloat(compensationAmount) : undefined
      onResolve(resolution, resolutionDetails, refund, compensation, 'admin-3')
      setLoading(false)
      setShowResolveForm(false)
    }, 500)
  }

  const handleClose = () => {
    setLoading(true)
    setTimeout(() => {
      onClose()
      setLoading(false)
    }, 300)
  }

  if (!dispute) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center">
            <AlertTriangle className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              No hay información de disputa disponible
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dispute Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Disputa #{dispute.id}
            </CardTitle>
            <DisputeStatusBadge status={dispute.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Who opened */}
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              Abierta por: <span className="font-medium capitalize">{dispute.openedBy}</span>
            </span>
            <Clock className="text-muted-foreground ml-2 h-4 w-4" />
            <span className="text-muted-foreground text-xs">{formatDate(dispute.openedAt)}</span>
          </div>

          {/* Reason */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-muted-foreground text-xs font-medium">Razón:</p>
            <p className="text-sm font-medium text-red-700">{dispute.reason}</p>
          </div>

          {/* Description */}
          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-muted-foreground text-xs font-medium">Descripción:</p>
            <p className="text-sm">{dispute.description}</p>
          </div>

          {/* Evidence */}
          {(dispute.clientEvidence?.length || dispute.ownerEvidence?.length) && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dispute.clientEvidence && dispute.clientEvidence.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-medium">
                    Evidencia del cliente:
                  </p>
                  <div className="space-y-1">
                    {dispute.clientEvidence.map((ev, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs">
                        <FileText className="h-3 w-3" />
                        {ev}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dispute.ownerEvidence && dispute.ownerEvidence.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-medium">
                    Evidencia del owner:
                  </p>
                  <div className="space-y-1">
                    {dispute.ownerEvidence.map((ev, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs">
                        <FileText className="h-3 w-3" />
                        {ev}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resolution info (if resolved) */}
          {dispute.status === 'resolved' && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-muted-foreground text-xs font-medium">Resolución:</p>
              <p className="text-sm font-medium text-green-700 capitalize">
                {dispute.resolution?.replace('_', ' ')}
              </p>
              {dispute.resolutionDetails && (
                <p className="mt-1 text-xs text-green-600">{dispute.resolutionDetails}</p>
              )}
              {dispute.refundGranted && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <DollarSign className="h-3 w-3" />
                  Reembolso otorgado: S/{dispute.refundGranted}
                </div>
              )}
              {dispute.compensationGranted && (
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <DollarSign className="h-3 w-3" />
                  Compensación otorgada: S/{dispute.compensationGranted}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Conversación ({dispute.messages.length} mensajes)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Messages list */}
          {dispute.messages.length > 0 ? (
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {dispute.messages.map((msg) => (
                <MessageCard key={msg.id} message={msg} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-4 text-center text-sm">
              No hay mensajes aún
            </div>
          )}

          {/* Add message (only if not closed) */}
          {dispute.status !== 'closed' && dispute.status !== 'resolved' && (
            <div className="space-y-2 border-t pt-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={2}
                placeholder="Escribe un mensaje para la conversación..."
                className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {dispute.status !== 'closed' && dispute.status !== 'resolved' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acciones de Resolución</CardTitle>
          </CardHeader>
          <CardContent>
            {!showResolveForm ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResolveForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  Resolver disputa
                </button>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cerrar sin resolución
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Resolution type */}
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Tipo de resolución
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'favor_client', label: 'Favor cliente', color: 'blue' },
                      { value: 'favor_owner', label: 'Favor owner', color: 'green' },
                      { value: 'partial', label: 'Compromiso parcial', color: 'yellow' },
                      { value: 'no_action', label: 'Sin acción', color: 'gray' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setResolution(opt.value as typeof resolution)}
                        className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                          resolution === opt.value
                            ? `bg-${opt.color}-100 border-${opt.color}-300 text-${opt.color}-700`
                            : 'hover:bg-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution details */}
                <div>
                  <label className="text-muted-foreground mb-1 block text-sm font-medium">
                    Detalles de la resolución *
                  </label>
                  <textarea
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                    rows={3}
                    placeholder="Describe la decisión y razones..."
                    className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Refund (optional) */}
                {(resolution === 'favor_client' || resolution === 'partial') && (
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Reembolso a otorgar (opcional)
                    </label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="S/0.00"
                      className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                )}

                {/* Compensation (optional) */}
                {(resolution === 'favor_owner' || resolution === 'partial') && (
                  <div>
                    <label className="text-muted-foreground mb-1 block text-sm font-medium">
                      Compensación a owner (opcional)
                    </label>
                    <input
                      type="number"
                      value={compensationAmount}
                      onChange={(e) => setCompensationAmount(e.target.value)}
                      placeholder="S/0.00"
                      className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResolveForm(false)}
                    className="hover:bg-muted flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleResolve}
                    disabled={!resolutionDetails.trim() || loading}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Confirmar resolución'}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
