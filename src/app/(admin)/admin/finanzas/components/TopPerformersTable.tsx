'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Download,
  Trophy,
  MapPin,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
} from 'lucide-react'
import type { RevenueByOwner, RevenueByVenue } from '../../types'

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface TopPerformersTableProps {
  type: 'owners' | 'venues'
  data: RevenueByOwner[] | RevenueByVenue[]
  onExport: () => void
}

// Rank badge component
function RankBadge({ rank }: { rank: number }) {
  const colors = {
    1: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    2: 'bg-gray-100 text-gray-600 border-gray-300',
    3: 'bg-orange-100 text-orange-700 border-orange-300',
  }

  const style = colors[rank as keyof typeof colors] || 'bg-muted text-muted-foreground'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-bold ${style}`}
    >
      #{rank}
    </span>
  )
}

// Owner table row
function OwnerRow({ owner }: { owner: RevenueByOwner }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <RankBadge rank={owner.rank} />
          <div>
            <p className="font-medium">{owner.ownerName}</p>
            <p className="text-muted-foreground text-xs">{owner.venueCount} cancha(s)</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-green-600">{formatCurrency(owner.revenue)}</p>
        <p className="text-muted-foreground text-xs">{owner.reservationCount} reservas</p>
      </td>
      <td className="text-muted-foreground px-4 py-3 text-sm">
        {formatCurrency(owner.commission)}
      </td>
      <td className="px-4 py-3">
        <p className="font-medium">{formatCurrency(owner.ownerRevenue)}</p>
        <p className="text-muted-foreground text-xs">después de comisión</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${owner.percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium">{owner.percentage}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <button className="text-muted-foreground hover:text-primary rounded p-1 text-sm transition-colors">
          <ExternalLink className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

// Venue table row
function VenueRow({ venue }: { venue: RevenueByVenue }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <RankBadge rank={venue.rank} />
          <div>
            <p className="font-medium">{venue.venueName}</p>
            <p className="text-muted-foreground text-xs">
              {venue.ownerName} • {venue.city}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-green-600">{formatCurrency(venue.revenue)}</p>
        <p className="text-muted-foreground text-xs">{venue.reservationCount} reservas</p>
      </td>
      <td className="text-muted-foreground px-4 py-3 text-sm">
        {formatCurrency(venue.commission)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{venue.averageRating}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${venue.occupancyRate}%` }}
            />
          </div>
          <span className="text-sm font-medium">{venue.occupancyRate}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${venue.percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium">{venue.percentage}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <button className="text-muted-foreground hover:text-primary rounded p-1 text-sm transition-colors">
          <ExternalLink className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

export function TopPerformersTable({ type, data, onExport }: TopPerformersTableProps) {
  const [sortBy, setSortBy] = React.useState<'revenue' | 'reservations' | 'percentage'>('revenue')

  // Sort data
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortBy === 'revenue') return b.revenue - a.revenue
      if (sortBy === 'reservations') return b.reservationCount - a.reservationCount
      return b.percentage - a.percentage
    })
  }, [data, sortBy])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          {type === 'owners' ? (
            <>
              <Users className="h-4 w-4" />
              Top Owners
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Top Canchas
            </>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-1.5 text-xs focus:ring-2 focus:outline-none"
          >
            <option value="revenue">Por ingresos</option>
            <option value="reservations">Por reservas</option>
            <option value="percentage">Por participación</option>
          </select>
          <button
            onClick={onExport}
            className="border-input bg-background hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <Download className="h-3 w-3" />
            Exportar
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {type === 'owners' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Owner
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Ingresos
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Comisión
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Revenue Owner
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    % Share
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedData.map((owner) => (
                  <OwnerRow
                    key={(owner as RevenueByOwner).ownerId}
                    owner={owner as RevenueByOwner}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Cancha
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Ingresos
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Comisión
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Rating
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Ocupación
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    % Share
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedData.map((venue) => (
                  <VenueRow
                    key={(venue as RevenueByVenue).venueId}
                    venue={venue as RevenueByVenue}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
