'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Search,
  Filter,
  Eye,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Smartphone,
  User,
  ChevronDown,
} from 'lucide-react'
import { useAdminReservations } from '../hooks/useAdmin'
import type { AdminReservation, ReservationFilters } from '../types'

// Status badge component
function StatusBadge({ status }: { status: AdminReservation['status'] }) {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    confirmed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
    completed: { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  }

  const { bg, text, icon: Icon } = config[status]
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    in_progress: 'En curso',
    completed: 'Completada',
    cancelled: 'Cancelada',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      <Icon className="h-3 w-3" />
      {labels[status]}
    </span>
  )
}

// Payment badge component
function PaymentBadge({ status }: { status: AdminReservation['paymentStatus'] }) {
  const config = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pendiente' },
    partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Parcial' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completo' },
    refunded: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reembolsado' },
  }

  const { bg, text, label } = config[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  )
}

// Source badge component
function SourceBadge({ source }: { source: 'app' | 'manual' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        source === 'app' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {source === 'app' ? <Smartphone className="h-3 w-3" /> : <User className="h-3 w-3" />}
      {source === 'app' ? 'App' : 'Manual'}
    </span>
  )
}

export default function AdminReservasPage() {
  const { reservations, stats, filters, setFilters } = useAdminReservations()
  const [activeTab, setActiveTab] = React.useState<'all' | 'disputes' | 'today'>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  // Filter by tab
  const displayedReservations = React.useMemo(() => {
    if (activeTab === 'disputes') {
      return reservations.filter((r) => r.hasDispute)
    }
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return reservations.filter((r) => r.date === today)
    }
    return reservations
  }, [reservations, activeTab])

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value })
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof ReservationFilters, value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters }
      delete newFilters[key]
      setFilters(newFilters)
    } else {
      setFilters({ ...filters, [key]: value })
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })
  }

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground text-sm">
          Visibilidad de todas las reservas del sistema
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        <div className="bg-card rounded-lg border p-3">
          <div className="text-muted-foreground text-xs">Total</div>
          <div className="text-xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <div className="text-muted-foreground text-xs">Confirmadas</div>
          <div className="text-xl font-bold text-green-600">{stats.confirmed}</div>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <div className="text-muted-foreground text-xs">Pendientes</div>
          <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <div className="text-muted-foreground text-xs">En curso</div>
          <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" />
            Disputas
          </div>
          <div className="text-xl font-bold text-red-600">{stats.withDisputes}</div>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <DollarSign className="h-3 w-3" />
            Hoy
          </div>
          <div className="text-xl font-bold">S/{stats.todayRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Todas ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'today'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Hoy ({stats.todayCount})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'disputes'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Disputas ({stats.withDisputes})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID, cancha, cliente..."
            value={filters.search || ''}
            onChange={handleSearch}
            className="border-input bg-background focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {/* Quick Filters */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="in_progress">En curso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>

          <select
            value={filters.paymentStatus || 'all'}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">Todos los pagos</option>
            <option value="pending">Pendiente</option>
            <option value="partial">Parcial</option>
            <option value="completed">Completo</option>
            <option value="refunded">Reembolsado</option>
          </select>

          <select
            value={filters.source || 'all'}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="all">App / Manual</option>
            <option value="app">App</option>
            <option value="manual">Manual</option>
          </select>

          {/* More filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border-input bg-background hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition-colors"
          >
            <Filter className="h-4 w-4" />
            Más filtros
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Cancha
                </label>
                <select
                  value={filters.venueId || ''}
                  onChange={(e) => handleFilterChange('venueId', e.target.value)}
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="">Todas las canchas</option>
                  <option value="v1">Los Campeones</option>
                  <option value="v2">Fútbol Pro</option>
                  <option value="v3">Cancha 5</option>
                  <option value="v4">Deportes Total</option>
                </select>
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Owner
                </label>
                <select
                  value={filters.ownerId || ''}
                  onChange={(e) => handleFilterChange('ownerId', e.target.value)}
                  className="border-input bg-background focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="">Todos los owners</option>
                  <option value="2">Pedro Ramos</option>
                  <option value="5">Ana Martinez</option>
                  <option value="10">Roberto García</option>
                  <option value="15">Diego Flores</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({})}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservations Table */}
      <Card>
        <CardContent className="p-0">
          {displayedReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                No hay reservas que coincidan con los filtros
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      ID
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cancha
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Owner
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Cliente
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Fecha/Hora
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Estado
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Pago
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Total
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Origen
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayedReservations.map((res) => (
                    <tr
                      key={res.id}
                      className={`hover:bg-muted/50 transition-colors ${
                        res.hasDispute ? 'bg-red-50/50' : ''
                      }`}
                    >
                      <td className="text-muted-foreground px-4 py-3 font-mono text-sm">
                        #{res.id}
                        {res.hasDispute && (
                          <AlertTriangle className="ml-1 inline h-3 w-3 text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{res.venueName}</td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{res.ownerName}</td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{res.clientName}</td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">
                        <div>
                          {formatDate(res.date)}
                          <div className="text-xs">
                            {formatTime(res.startTime)} - {formatTime(res.endTime)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={res.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PaymentBadge status={res.paymentStatus} />
                      </td>
                      <td className="px-4 py-3 font-medium">S/{res.totalPrice}</td>
                      <td className="px-4 py-3">
                        <SourceBadge source={res.source} />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/reservas/${res.id}`}
                          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 rounded p-1 text-sm transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      {displayedReservations.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Mostrando {displayedReservations.length} de {stats.total} reservas
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="text-muted-foreground rounded-lg border px-3 py-1 text-sm opacity-50"
            >
              ← Anterior
            </button>
            <button
              disabled
              className="text-muted-foreground rounded-lg border px-3 py-1 text-sm opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
