'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Check, X, Eye, ChevronRight, Building2, Users, DollarSign } from 'lucide-react'
import { useOwnerApplications } from '../hooks/useAdmin'
import { OwnerApprovalModal } from '../components'

export default function AdminOwnersPage() {
  const { applications, pendingApplications, approveApplication, rejectApplication } =
    useOwnerApplications()
  const [activeTab, setActiveTab] = React.useState<'pending' | 'active'>('pending')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedApplication, setSelectedApplication] = React.useState<string | null>(null)

  const filteredApplications = React.useMemo(() => {
    if (activeTab === 'pending') {
      return pendingApplications.filter(
        (app) =>
          app.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return applications.filter((app) => app.status === 'approved')
  }, [applications, pendingApplications, activeTab, searchQuery])

  // Mock active owners for demo
  const activeOwners = [
    {
      id: '1',
      name: 'Pedro Ramos',
      business: 'Los Campeones',
      city: 'Lima',
      venues: 3,
      revenue: 'S/45,000',
      status: 'active',
    },
    {
      id: '2',
      name: 'Ana Martinez',
      business: 'Fútbol Pro',
      city: 'Arequipa',
      venues: 2,
      revenue: 'S/28,000',
      status: 'active',
    },
    {
      id: '3',
      name: 'Carlos Ruiz',
      business: 'Cancha 7',
      city: 'Trujillo',
      venues: 1,
      revenue: 'S/15,000',
      status: 'active',
    },
  ]

  const selectedApp = selectedApplication
    ? pendingApplications.find((a) => a.id === selectedApplication)
    : null

  const handleApprove = (applicationId: string) => {
    approveApplication(applicationId, 'admin-1')
  }

  const handleReject = (applicationId: string, reason: string) => {
    rejectApplication(applicationId, 'admin-1', reason)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Owners</h1>
        <p className="text-muted-foreground text-sm">Aprobación y gestión de dueños de canchas</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Pendientes
              </p>
              <p className="text-xl font-bold">{pendingApplications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Activos
              </p>
              <p className="text-xl font-bold">{activeOwners.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Total Canchas
              </p>
              <p className="text-xl font-bold">
                {activeOwners.reduce((acc, o) => acc + o.venues, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Pendientes
            {pendingApplications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingApplications.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            Activos
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-input bg-background focus:ring-ring w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        <div className="grid gap-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-sm">No hay solicitudes pendientes</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((owner) => (
              <Card key={owner.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Main Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                          <Building2 className="text-primary h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{owner.businessName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {owner.city}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Solicitante:{' '}
                            <span className="text-foreground font-medium">
                              {owner.user.fullName}
                            </span>
                          </p>
                          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-xs">
                            <span>{owner.user.email}</span>
                            <span>•</span>
                            <span>RUC: {owner.ruc}</span>
                            <span>•</span>
                            <span>{new Date(owner.submittedAt).toLocaleDateString('es-PE')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-muted/30 border-t p-4 lg:border-t-0 lg:border-l">
                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <button
                          onClick={() => setSelectedApplication(owner.id)}
                          className="border-input bg-background hover:bg-accent flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalle
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(owner.id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                          >
                            <Check className="h-4 w-4" />
                            <span className="hidden sm:inline lg:hidden xl:inline">Aprobar</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApplication(owner.id)
                              // Could auto-show reject form
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                          >
                            <X className="h-4 w-4" />
                            <span className="hidden sm:inline lg:hidden xl:inline">Rechazar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Owner
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Negocio
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Ciudad
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Canchas
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Ingresos
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                      Estado
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activeOwners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                            <span className="text-primary text-sm font-medium">
                              {owner.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{owner.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{owner.business}</td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">{owner.city}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{owner.venues}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{owner.revenue}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Activo
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors">
                          <ChevronRight className="h-4 w-4" />
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
      <OwnerApprovalModal
        open={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        application={selectedApp || null}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
