'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KPICard, AlertPanel, DataTable } from './components'
import {
  Users,
  UserCog,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'

// Mock data for demo
const MOCK_KPI_DATA = [
  {
    title: 'Usuarios',
    value: '1,234',
    subtitle: '+12 hoy',
    trend: { value: 8, type: 'up' as const },
    icon: Users,
  },
  {
    title: 'Owners',
    value: '45',
    subtitle: '3 pendientes',
    trend: { value: 5, type: 'up' as const },
    icon: UserCog,
  },
  {
    title: 'Canchas',
    value: '89',
    subtitle: '2 en revisión',
    trend: { value: 2, type: 'up' as const },
    icon: MapPin,
  },
  {
    title: 'Reservas Hoy',
    value: '156',
    subtitle: 'vs 132 ayer',
    trend: { value: 18, type: 'up' as const },
    icon: Calendar,
  },
  {
    title: 'Ingresos Hoy',
    value: 'S/45,000',
    subtitle: 'en reservas',
    trend: { value: 12, type: 'up' as const },
    icon: DollarSign,
  },
]

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'owner' as const,
    message: 'Solicitudes de owner esperando aprobación',
    count: 3,
    href: '/admin/owners?tab=pending',
  },
  {
    id: '2',
    type: 'venue' as const,
    message: 'Canchas en revisión pendientes',
    count: 2,
    href: '/admin/canchas?tab=review',
  },
  {
    id: '3',
    type: 'report' as const,
    message: 'Reportes de contenido pendientes',
    count: 5,
    href: '/admin/moderacion?tab=reports',
  },
  {
    id: '4',
    type: 'dispute' as const,
    message: 'Disputes de reservas abiertos',
    count: 1,
    href: '/admin/reservas?dispute=true',
  },
]

const MOCK_TOP_OWNERS = [
  { id: '1', name: 'Los Campeones', city: 'Lima', venues: 3, revenue: 'S/12,000' },
  { id: '2', name: 'Fútbol Pro', city: 'Arequipa', venues: 2, revenue: 'S/8,500' },
  { id: '3', name: 'Cancha 7', city: 'Lima', venues: 1, revenue: 'S/6,200' },
  { id: '4', name: 'Deportes Total', city: 'Cusco', venues: 2, revenue: 'S/5,800' },
  { id: '5', name: 'La Cancha', city: 'Trujillo', venues: 1, revenue: 'S/4,500' },
]

const ownerColumns = [
  { header: 'Owner', accessor: (row: (typeof MOCK_TOP_OWNERS)[0]) => row.name },
  { header: 'Ciudad', accessor: (row: (typeof MOCK_TOP_OWNERS)[0]) => row.city },
  { header: 'Canchas', accessor: (row: (typeof MOCK_TOP_OWNERS)[0]) => row.venues },
  {
    header: 'Ingresos',
    accessor: (row: (typeof MOCK_TOP_OWNERS)[0]) => (
      <span className="font-medium">{row.revenue}</span>
    ),
  },
]

export default function AdminDashboardPage() {
  const [date] = React.useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm capitalize">{formatDate(date)}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {MOCK_KPI_DATA.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            trend={kpi.trend}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alert Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <AlertPanel alerts={MOCK_ALERTS} />
        </div>

        {/* Top Owners Table - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="text-primary h-4 w-4" />
                Top Owners (Esta semana)
              </CardTitle>
              <Link
                href="/admin/finanzas"
                className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium"
              >
                Ver más
                <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <DataTable
                columns={ownerColumns}
                data={MOCK_TOP_OWNERS}
                keyExtractor={(row) => row.id}
                emptyMessage="No hay datos de owners"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Comisión Global</p>
                <p className="mt-1 text-xl font-bold">10%</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Activo
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Ocupación Promedio</p>
                <p className="mt-1 text-xl font-bold">72%</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Rating Promedio</p>
                <p className="mt-1 text-xl font-bold">4.5 ⭐</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                856 reseñas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Pagos Parciales</p>
                <p className="mt-1 text-xl font-bold">34%</p>
              </div>
              <Badge variant="outline" className="text-xs">
                de reservas
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
