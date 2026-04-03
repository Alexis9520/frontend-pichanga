'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  MessageSquare,
  Image,
  User,
  Clock,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react'
import { useModeration } from '../hooks/useAdmin'
import type {
  ContentReport,
  ReviewForModeration,
  PhotoForModeration,
  ReportType,
  ReportCategory,
} from '../types'
import { ReportResolutionModal } from './components/ReportResolutionModal'

// Category labels
const CATEGORY_LABELS: Record<ReportCategory, string> = {
  offensive_content: 'Contenido Ofensivo',
  inappropriate: 'Inapropiado',
  spam: 'Spam',
  fake_review: 'Reseña Falsa',
  harassment: 'Acoso',
  violence: 'Violencia',
  discrimination: 'Discriminación',
  other: 'Otro',
}

// Type labels
const TYPE_LABELS: Record<ReportType, string> = {
  review: 'Reseña',
  photo: 'Foto',
  user_profile: 'Perfil',
  venue_content: 'Contenido Venue',
}

// Priority badge
function PriorityBadge({ priority }: { priority: ContentReport['priority'] }) {
  const config = {
    urgent: { bg: 'bg-red-500', text: 'text-white', label: 'Urgente' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Alta' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Media' },
    low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Baja' },
  }

  const { bg, text, label } = config[priority]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      {priority === 'urgent' && <AlertTriangle className="mr-1 h-3 w-3" />}
      {label}
    </span>
  )
}

// Type badge
function TypeBadge({ type }: { type: ReportType }) {
  const config = {
    review: { bg: 'bg-blue-100', text: 'text-blue-700', icon: MessageSquare },
    photo: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Image },
    user_profile: { bg: 'bg-green-100', text: 'text-green-700', icon: User },
    venue_content: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Eye },
  }

  const { bg, text, icon: Icon } = config[type]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      <Icon className="h-3 w-3" />
      {TYPE_LABELS[type]}
    </span>
  )
}

// Stats card
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string
  value: number | string
  icon: React.ElementType
  trend?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {trend && <p className="text-muted-foreground text-xs">{trend}</p>}
          </div>
          <div className="bg-primary/10 rounded-lg p-2">
            <Icon className="text-primary h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Report card
function ReportCard({ report, onResolve }: { report: ContentReport; onResolve: () => void }) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <Card className={report.priority === 'urgent' ? 'border-red-300 bg-red-50/30' : ''}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={report.type} />
              <PriorityBadge priority={report.priority} />
              <span className="text-muted-foreground text-xs">
                {CATEGORY_LABELS[report.category]}
              </span>
              {report.reportCount > 1 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {report.reportCount} reportes
                </span>
              )}
            </div>

            {/* Content preview */}
            <div className="bg-muted/30 rounded-lg border p-3">
              <p className="text-sm italic">&ldquo;{report.contentPreview}&rdquo;</p>
            </div>

            {/* Meta info */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Creador: {report.contentOwnerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Reportado por: {report.reporterName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeAgo(report.reportedAt)}</span>
              </div>
            </div>

            {/* Reason */}
            <p className="text-muted-foreground text-xs">
              <span className="font-medium">Razón: </span>
              {report.reason}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 lg:flex-col">
            <button
              onClick={onResolve}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
            >
              <Eye className="h-4 w-4" />
              Resolver
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Review row
function ReviewRow({
  review,
  onEdit,
  onDelete,
}: {
  review: ReviewForModeration
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <tr
      className={`hover:bg-muted/50 transition-colors ${review.reportCount > 0 ? 'bg-red-50/50' : ''}`}
    >
      <td className="px-4 py-3">
        <div className="max-w-xs space-y-1">
          <p className="truncate text-sm">{review.text}</p>
          {review.reportCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              <AlertTriangle className="h-3 w-3" />
              {review.reportCount} reporte(s)
            </span>
          )}
          {review.hasProfanity && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              Lenguaje detectado
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium">{review.venueName}</p>
        <p className="text-muted-foreground text-xs">{review.ownerName}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{review.rating}</span>
        </div>
      </td>
      <td className="text-muted-foreground px-4 py-3 text-sm">
        {new Date(review.createdAt).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })}
      </td>
      <td className="text-muted-foreground px-4 py-3 text-sm">{review.helpfulCount}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  )
}

// Photo card
function PhotoCard({
  photo,
  onApprove,
  onDelete,
}: {
  photo: PhotoForModeration
  onApprove: () => void
  onDelete: () => void
}) {
  return (
    <Card className={photo.status === 'reported' ? 'border-red-300' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail placeholder */}
          <div className="bg-muted h-20 w-20 flex-shrink-0 rounded-lg">
            <div className="flex h-full items-center justify-center">
              <Image className="text-muted-foreground h-8 w-8" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{photo.sourceName}</span>
              {photo.reportCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  <AlertTriangle className="h-3 w-3" />
                  {photo.reportCount} reporte(s)
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Subido por {photo.uploaderName} •{' '}
              {photo.uploaderType === 'owner' ? 'Owner' : 'Usuario'}
            </p>
            <p className="text-muted-foreground text-xs">
              Tipo: {photo.type === 'venue_photo' ? 'Foto de cancha' : 'Foto de reseña'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="border-input bg-background hover:bg-accent inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              Aprobar
            </button>
            <button
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors"
            >
              <XCircle className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminModeracionPage() {
  const {
    filteredReports,
    reviews,
    photos,
    stats,
    filters,
    setFilters,
    resolveReport,
    dismissReport,
    deleteReview,
    editReview,
    deletePhoto,
    approvePhoto,
    getReportById,
  } = useModeration()

  const [activeTab, setActiveTab] = React.useState<'reports' | 'reviews' | 'photos'>('reports')
  const [selectedReport, setSelectedReport] = React.useState<ContentReport | null>(null)
  const [showFilters, setShowFilters] = React.useState(false)

  // Handle resolve
  const handleResolve = (report: ContentReport) => {
    setSelectedReport(report)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Moderación</h1>
        <p className="text-muted-foreground text-sm">Gestión de contenido reportado y reseñas</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Reportes Pendientes" value={stats.pendingReports} icon={AlertTriangle} />
        <StatCard title="Reseñas Reportadas" value={stats.pendingReviews} icon={MessageSquare} />
        <StatCard title="Fotos Pendientes" value={stats.pendingPhotos} icon={Image} />
        <StatCard
          title="Resueltos Hoy"
          value={stats.resolvedToday}
          icon={CheckCircle}
          trend={`${stats.resolvedThisWeek} esta semana`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { id: 'reports', label: 'Reportes', count: stats.pendingReports, icon: AlertTriangle },
          { id: 'reviews', label: 'Reseñas', count: reviews.length, icon: MessageSquare },
          {
            id: 'photos',
            label: 'Fotos',
            count: photos.filter((p) => p.status === 'reported').length,
            icon: Image,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-background'}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar contenido..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border-input bg-background focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        {activeTab === 'reports' && (
          <div className="flex gap-2">
            <select
              value={filters.type || 'all'}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value as ReportType | 'all' })
              }
              className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="review">Reseñas</option>
              <option value="photo">Fotos</option>
              <option value="user_profile">Perfiles</option>
              <option value="venue_content">Venue</option>
            </select>

            <select
              value={filters.priority || 'all'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priority: e.target.value as ContentReport['priority'] | 'all',
                })
              }
              className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">No hay reportes pendientes</p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} onResolve={() => handleResolve(report)} />
            ))
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Reseña
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cancha / Owner
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Rating
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Fecha
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Útil
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reviews.map((review) => (
                    <ReviewRow
                      key={review.id}
                      review={review}
                      onEdit={() => {
                        const newText = prompt('Editar reseña:', review.text)
                        if (newText) editReview(review.id, newText)
                      }}
                      onDelete={() => {
                        if (confirm('¿Eliminar esta reseña?')) {
                          deleteReview(review.id, 'Deleted by admin')
                        }
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-4">
          {photos.filter((p) => p.status === 'reported').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Image className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">No hay fotos reportadas</p>
              </CardContent>
            </Card>
          ) : (
            photos
              .filter((p) => p.status === 'reported')
              .map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onApprove={() => approvePhoto(photo.id)}
                  onDelete={() => {
                    if (confirm('¿Eliminar esta foto?')) {
                      deletePhoto(photo.id, 'Inappropriate content')
                    }
                  }}
                />
              ))
          )}
        </div>
      )}

      {/* Resolution Modal */}
      {selectedReport && (
        <ReportResolutionModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onResolve={resolveReport}
          onDismiss={dismissReport}
        />
      )}
    </div>
  )
}
