'use client'

import * as React from 'react'
import type {
  AdminUser,
  OwnerApplication,
  AdminAlert,
  PlatformConfig,
  AuditLog,
  AdminReservation,
  ReservationDetails,
  ReservationDispute,
  ReservationFilters,
  ReservationStats,
  DisputeMessage,
  FinanceKPIs,
  FinancePeriod,
  DailyRevenue,
  RevenueBreakdown,
  RevenueByOwner,
  RevenueByVenue,
  RevenueByCity,
  CommissionConfig,
  FinanceFilters,
  ContentReport,
  ReviewForModeration,
  PhotoForModeration,
  ModerationStats,
  ModerationFilters,
  ReportStatus,
  ReportType,
  ReportCategory,
  FeatureFlag,
  IntegrationConfig,
  MaintenanceConfig,
  GeneralConfig,
  PlatformSettings,
  AuditLogDetails,
  AuditLogFilters,
  AuditLogStats,
  AuditAction,
  AuditTargetType,
} from '../types'

// Mock data for development
const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    fullName: 'Carlos Mendoza',
    email: 'carlos@email.com',
    phone: '+51 999 888 777',
    role: 'user',
    status: 'active',
    registeredAt: '2026-03-15',
    registeredVia: 'google_oauth',
    lastActivity: '2026-04-01',
    totalReservations: 23,
    totalReviews: 5,
    favoriteCourts: 3,
  },
  {
    id: '2',
    fullName: 'Pedro Ramos',
    email: 'pedro@email.com',
    phone: '+51 999 123 456',
    role: 'owner',
    status: 'active',
    registeredAt: '2026-02-20',
    registeredVia: 'email',
    lastActivity: '2026-04-02',
    totalVenues: 3,
    totalRevenue: 45000,
  },
  {
    id: '3',
    fullName: 'Admin User',
    email: 'admin@pichanga.pe',
    phone: '+51 999 000 111',
    role: 'admin',
    status: 'active',
    registeredAt: '2026-01-01',
    registeredVia: 'email',
    lastActivity: '2026-04-02',
    adminActions: 156,
  },
  {
    id: '4',
    fullName: 'Juan Lopez',
    email: 'juan@email.com',
    phone: '+51 999 222 333',
    role: 'user',
    status: 'suspended',
    registeredAt: '2026-03-01',
    registeredVia: 'email',
    lastActivity: '2026-03-20',
    totalReservations: 2,
    totalReviews: 0,
    favoriteCourts: 1,
  },
  {
    id: '5',
    fullName: 'María Garcia',
    email: 'maria@email.com',
    phone: '+51 999 444 555',
    role: 'owner',
    status: 'active',
    registeredAt: '2026-02-15',
    registeredVia: 'google_oauth',
    lastActivity: '2026-04-01',
    totalVenues: 2,
    totalRevenue: 28000,
  },
]

const MOCK_OWNER_APPLICATIONS: OwnerApplication[] = [
  {
    id: '1',
    userId: '10',
    user: {
      fullName: 'Roberto García',
      email: 'roberto@email.com',
      phone: '+51 999 111 222',
    },
    businessName: 'Cancha 5',
    ruc: '20123456789',
    businessPhone: '01-4567890',
    businessAddress: 'Av. Principal 123, Lima',
    city: 'Lima',
    status: 'pending',
    submittedAt: '2026-04-01',
  },
  {
    id: '2',
    userId: '11',
    user: {
      fullName: 'María Lopez',
      email: 'maria.lopez@email.com',
      phone: '+51 999 333 444',
    },
    businessName: 'Fútbol Pro',
    ruc: '20987654321',
    businessPhone: '054-123456',
    businessAddress: 'Jr. Deportes 456, Arequipa',
    city: 'Arequipa',
    status: 'pending',
    submittedAt: '2026-03-28',
  },
  {
    id: '3',
    userId: '12',
    user: {
      fullName: 'Luis Torres',
      email: 'luis@email.com',
      phone: '+51 999 555 666',
    },
    businessName: 'Los Campeones',
    ruc: '20567890123',
    businessPhone: '084-987654',
    businessAddress: 'Calle Sport 789, Cusco',
    city: 'Cusco',
    status: 'pending',
    submittedAt: '2026-03-25',
  },
]

const MOCK_ALERTS: AdminAlert[] = [
  {
    id: '1',
    type: 'owner_application',
    title: 'Solicitudes de owner pendientes',
    description: 'Hay 3 solicitudes de owner esperando aprobación',
    count: 3,
    priority: 'high',
    createdAt: '2026-04-02',
    actionUrl: '/admin/owners?tab=pending',
  },
  {
    id: '2',
    type: 'venue_review',
    title: 'Canchas en revisión',
    description: 'Hay 2 canchas pendientes de aprobación',
    count: 2,
    priority: 'high',
    createdAt: '2026-04-02',
    actionUrl: '/admin/canchas?tab=review',
  },
  {
    id: '3',
    type: 'content_report',
    title: 'Reportes de contenido',
    description: 'Hay 5 reportes de contenido sin resolver',
    count: 5,
    priority: 'medium',
    createdAt: '2026-04-01',
    actionUrl: '/admin/moderacion?tab=reports',
  },
  {
    id: '4',
    type: 'reservation_dispute',
    title: 'Disputas de reservas',
    description: 'Hay 1 disputa de reserva abierta',
    count: 1,
    priority: 'high',
    createdAt: '2026-04-02',
    actionUrl: '/admin/reservas?dispute=true',
  },
]

const MOCK_PLATFORM_CONFIG: PlatformConfig = {
  cities: ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Ica'],
  sportsTypes: ['Fútbol 5', 'Fútbol 7', 'Fulbito', 'Fútbol 11'],
  surfaces: ['Grass sintético', 'Grass natural', 'Losa', 'Concreto'],
  services: [
    'Estacionamiento',
    'Baños',
    'Duchas',
    'Iluminación',
    'Quincho',
    'Tribuna',
    'Vestuarios',
  ],
  productCategories: ['Bebidas', 'Snacks', 'Artículos deportivos', 'Alquiler', 'Servicios'],
  paymentMethods: [
    { name: 'Culqi', enabled: true },
    { name: 'Efectivo', enabled: true },
    { name: 'Yape', enabled: false },
    { name: 'Plin', enabled: false },
  ],
  globalCommission: 10,
  commissionFreeDays: 0,
  defaultTolerance: 15,
  defaultCancellationHours: 3,
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    adminId: '3',
    adminName: 'Admin User',
    action: 'approve',
    targetType: 'owner',
    targetId: '5',
    targetName: 'María Garcia',
    details: 'Owner aprobado para operar',
    createdAt: '2026-04-02T10:30:00',
  },
  {
    id: '2',
    adminId: '3',
    adminName: 'Admin User',
    action: 'approve',
    targetType: 'venue',
    targetId: 'v1',
    targetName: 'Los Campeones',
    details: 'Cancha aprobada y publicada',
    createdAt: '2026-04-01T15:45:00',
  },
  {
    id: '3',
    adminId: '3',
    adminName: 'Admin User',
    action: 'reject',
    targetType: 'owner',
    targetId: 'u10',
    targetName: 'Juan Perez',
    details: 'RUC inválido',
    reason: 'El RUC proporcionado no existe en SUNAT',
    createdAt: '2026-03-31T11:20:00',
  },
  {
    id: '4',
    adminId: '3',
    adminName: 'Admin User',
    action: 'suspend',
    targetType: 'user',
    targetId: '4',
    targetName: 'Juan Lopez',
    details: 'Usuario suspendido',
    reason: 'Múltiples reportes de comportamiento inadecuado',
    createdAt: '2026-03-30T14:15:00',
  },
  {
    id: '5',
    adminId: '3',
    adminName: 'Admin User',
    action: 'edit',
    targetType: 'venue',
    targetId: 'v2',
    targetName: 'Fútbol Pro',
    details: 'Horarios modificados (override admin)',
    createdAt: '2026-03-28T09:00:00',
  },
  {
    id: '6',
    adminId: '3',
    adminName: 'Admin User',
    action: 'delete',
    targetType: 'review',
    targetId: 'r892',
    targetName: 'Reseña #892',
    details: 'Reseña eliminada por contenido offensive',
    reason: 'Contenido inapropiado reportado por 3 usuarios',
    createdAt: '2026-03-25T16:30:00',
  },
]

const MOCK_AUDIT_LOGS_DETAILS: AuditLogDetails[] = [
  {
    id: '1',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'approve',
    actionLabel: 'Aprobación',
    targetType: 'owner',
    targetId: '5',
    targetName: 'María Garcia',
    description: 'Solicitud de owner aprobada para operar en la plataforma',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-04-02T10:30:00',
  },
  {
    id: '2',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'approve',
    actionLabel: 'Aprobación',
    targetType: 'venue',
    targetId: 'v1',
    targetName: 'Los Campeones',
    description: 'Cancha aprobada y publicada en la plataforma',
    previousValue: 'Pendiente de revisión',
    newValue: 'Activa',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-04-01T15:45:00',
  },
  {
    id: '3',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'reject',
    actionLabel: 'Rechazo',
    targetType: 'owner',
    targetId: 'u10',
    targetName: 'Juan Perez',
    description: 'Solicitud de owner rechazada por RUC inválido',
    reason: 'El RUC proporcionado no existe en SUNAT',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-03-31T11:20:00',
  },
  {
    id: '4',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'suspend',
    actionLabel: 'Suspensión',
    targetType: 'user',
    targetId: '4',
    targetName: 'Juan Lopez',
    description: 'Cuenta de usuario suspendida',
    reason: 'Múltiples reportes de comportamiento inadecuado',
    previousValue: 'Activo',
    newValue: 'Suspendido',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-03-30T14:15:00',
  },
  {
    id: '5',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'edit',
    actionLabel: 'Edición',
    targetType: 'venue',
    targetId: 'v2',
    targetName: 'Fútbol Pro',
    description: 'Horarios de la cancha modificados (override admin)',
    previousValue: 'Lun-Vie: 8:00-22:00',
    newValue: 'Lun-Dom: 7:00-23:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-03-28T09:00:00',
  },
  {
    id: '6',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'delete',
    actionLabel: 'Eliminación',
    targetType: 'review',
    targetId: 'r892',
    targetName: 'Reseña #892',
    description: 'Reseña eliminada por contenido ofensivo',
    reason: 'Contenido inapropiado reportado por 3 usuarios',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-03-25T16:30:00',
  },
  {
    id: '7',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'refund',
    actionLabel: 'Reembolso',
    targetType: 'reservation',
    targetId: '1237',
    targetName: 'Reserva #1237',
    description: 'Reembolso procesado por cancelación de reserva',
    previousValue: 'Pagado: S/160',
    newValue: 'Reembolsado: S/128 (80%)',
    reason: 'Cancelación dentro del período permitido',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    device: 'Mobile',
    browser: 'Safari 17',
    location: 'Arequipa, Perú',
    createdAt: '2026-03-24T11:00:00',
  },
  {
    id: '8',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'config_change',
    actionLabel: 'Cambio de Config',
    targetType: 'config',
    targetId: 'commission',
    targetName: 'Comisión Global',
    description: 'Comisión global actualizada',
    previousValue: '8%',
    newValue: '10%',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Lima, Perú',
    createdAt: '2026-03-22T09:30:00',
  },
  {
    id: '9',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'resolve_dispute',
    actionLabel: 'Resolución Disputa',
    targetType: 'dispute',
    targetId: 'd1',
    targetName: 'Disputa #d1',
    description: 'Disputa resuelta a favor del cliente',
    reason: 'El owner no cumplió con el horario acordado',
    previousValue: 'Abierta',
    newValue: 'Resuelta - Favor cliente',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    device: 'Desktop',
    browser: 'Firefox 123',
    location: 'Lima, Perú',
    createdAt: '2026-03-20T14:45:00',
  },
  {
    id: '10',
    adminId: '3',
    adminName: 'Admin User',
    adminEmail: 'admin@pichanga.pe',
    adminRole: 'admin',
    action: 'activate',
    actionLabel: 'Activación',
    targetType: 'user',
    targetId: 'u15',
    targetName: 'Pedro Gomez',
    description: 'Cuenta de usuario reactivada',
    previousValue: 'Suspendido',
    newValue: 'Activo',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Cusco, Perú',
    createdAt: '2026-03-18T16:20:00',
  },
]

export function useAdminUsers() {
  const [users, setUsers] = React.useState<AdminUser[]>(MOCK_USERS)
  const [loading, setLoading] = React.useState(false)

  const getUserById = React.useCallback(
    (id: string) => {
      return users.find((u) => u.id === id)
    },
    [users]
  )

  const updateUserRole = React.useCallback(
    (userId: string, newRole: 'user' | 'owner' | 'admin') => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    },
    []
  )

  const updateUserStatus = React.useCallback(
    (userId: string, newStatus: 'active' | 'suspended') => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))
    },
    []
  )

  return {
    users,
    loading,
    getUserById,
    updateUserRole,
    updateUserStatus,
  }
}

export function useOwnerApplications() {
  const [applications, setApplications] =
    React.useState<OwnerApplication[]>(MOCK_OWNER_APPLICATIONS)
  const [loading, setLoading] = React.useState(false)

  const pendingApplications = React.useMemo(
    () => applications.filter((a) => a.status === 'pending'),
    [applications]
  )

  const getApplicationById = React.useCallback(
    (id: string) => {
      return applications.find((a) => a.id === id)
    },
    [applications]
  )

  const approveApplication = React.useCallback((applicationId: string, adminId: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'approved' as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: adminId,
            }
          : a
      )
    )
  }, [])

  const rejectApplication = React.useCallback(
    (applicationId: string, adminId: string, reason: string) => {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId
            ? {
                ...a,
                status: 'rejected' as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: adminId,
                rejectionReason: reason,
              }
            : a
        )
      )
    },
    []
  )

  return {
    applications,
    pendingApplications,
    loading,
    getApplicationById,
    approveApplication,
    rejectApplication,
  }
}

export function useAdminAlerts() {
  const [alerts] = React.useState<AdminAlert[]>(MOCK_ALERTS)

  const pendingCounts = React.useMemo(
    () => ({
      owners: alerts.find((a) => a.type === 'owner_application')?.count || 0,
      venues: alerts.find((a) => a.type === 'venue_review')?.count || 0,
      reports: alerts.find((a) => a.type === 'content_report')?.count || 0,
      disputes: alerts.find((a) => a.type === 'reservation_dispute')?.count || 0,
    }),
    [alerts]
  )

  return {
    alerts,
    pendingCounts,
  }
}

export function usePlatformConfig() {
  const [config, setConfig] = React.useState<PlatformConfig>(MOCK_PLATFORM_CONFIG)
  const [loading, setLoading] = React.useState(false)

  const updateConfig = React.useCallback((updates: Partial<PlatformConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const addCity = React.useCallback((city: string) => {
    setConfig((prev) => ({ ...prev, cities: [...prev.cities, city] }))
  }, [])

  const removeCity = React.useCallback((city: string) => {
    setConfig((prev) => ({ ...prev, cities: prev.cities.filter((c) => c !== city) }))
  }, [])

  const togglePaymentMethod = React.useCallback((methodName: string) => {
    setConfig((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) =>
        pm.name === methodName ? { ...pm, enabled: !pm.enabled } : pm
      ),
    }))
  }, [])

  return {
    config,
    loading,
    updateConfig,
    addCity,
    removeCity,
    togglePaymentMethod,
  }
}

export function useAuditLogs() {
  const [logs] = React.useState<AuditLog[]>(MOCK_AUDIT_LOGS)
  const [logsDetails] = React.useState<AuditLogDetails[]>(MOCK_AUDIT_LOGS_DETAILS)
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState<AuditLogFilters>({})

  // Filtered logs
  const filteredLogs = React.useMemo(() => {
    let result = logsDetails

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (log) =>
          log.adminName.toLowerCase().includes(search) ||
          log.targetName.toLowerCase().includes(search) ||
          log.description.toLowerCase().includes(search)
      )
    }

    if (filters.adminId) {
      result = result.filter((log) => log.adminId === filters.adminId)
    }

    if (filters.action && filters.action !== 'all') {
      result = result.filter((log) => log.action === filters.action)
    }

    if (filters.targetType && filters.targetType !== 'all') {
      result = result.filter((log) => log.targetType === filters.targetType)
    }

    if (filters.dateFrom) {
      result = result.filter((log) => log.createdAt >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      result = result.filter((log) => log.createdAt <= filters.dateTo!)
    }

    if (filters.ipSearch) {
      result = result.filter((log) => log.ipAddress.includes(filters.ipSearch!))
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [logsDetails, filters])

  // Stats
  const stats = React.useMemo<AuditLogStats>(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const actionCounts: Record<AuditAction, number> = {
      approve: 0,
      reject: 0,
      suspend: 0,
      activate: 0,
      edit: 0,
      delete: 0,
      config_change: 0,
      refund: 0,
      cancel: 0,
      resolve_dispute: 0,
      login: 0,
      logout: 0,
    }

    const adminCounts: Record<string, { name: string; count: number }> = {}
    const targetTypeCounts: Record<AuditTargetType, number> = {
      user: 0,
      owner: 0,
      venue: 0,
      reservation: 0,
      review: 0,
      photo: 0,
      config: 0,
      dispute: 0,
    }

    logsDetails.forEach((log) => {
      actionCounts[log.action]++
      targetTypeCounts[log.targetType]++

      if (!adminCounts[log.adminId]) {
        adminCounts[log.adminId] = { name: log.adminName, count: 0 }
      }
      adminCounts[log.adminId].count++
    })

    return {
      total: logsDetails.length,
      today: logsDetails.filter((l) => l.createdAt >= today).length,
      thisWeek: logsDetails.filter((l) => l.createdAt >= weekAgo).length,
      thisMonth: logsDetails.filter((l) => l.createdAt >= monthAgo).length,
      byAction: Object.entries(actionCounts)
        .filter(([, count]) => count > 0)
        .map(([action, count]) => ({ action: action as AuditAction, count })),
      byAdmin: Object.entries(adminCounts).map(([adminId, data]) => ({
        adminId,
        adminName: data.name,
        count: data.count,
      })),
      byTargetType: Object.entries(targetTypeCounts)
        .filter(([, count]) => count > 0)
        .map(([targetType, count]) => ({ targetType: targetType as AuditTargetType, count })),
    }
  }, [logsDetails])

  // Get log by ID
  const getLogById = React.useCallback(
    (id: string) => logsDetails.find((l) => l.id === id),
    [logsDetails]
  )

  // Export
  const exportLogs = React.useCallback((format: 'csv' | 'xlsx' | 'pdf') => {
    setLoading(true)
    setTimeout(() => {
      console.log(`Exporting logs in ${format} format`)
      setLoading(false)
    }, 500)
  }, [])

  return {
    logs: filteredLogs,
    allLogs: logsDetails,
    stats,
    loading,
    filters,
    setFilters,
    getLogById,
    exportLogs,
  }
}

// ============================================
// RESERVATIONS
// ============================================

const MOCK_RESERVATIONS: AdminReservation[] = [
  {
    id: '1234',
    venueId: 'v1',
    venueName: 'Los Campeones',
    ownerId: '2',
    ownerName: 'Pedro Ramos',
    clientName: 'Carlos Mendoza',
    clientEmail: 'carlos@email.com',
    clientPhone: '+51 999 888 777',
    date: '2026-04-02',
    startTime: '15:00',
    endTime: '17:00',
    totalPrice: 200,
    status: 'confirmed',
    paymentStatus: 'completed',
    source: 'app',
    hasDispute: false,
  },
  {
    id: '1235',
    venueId: 'v2',
    venueName: 'Fútbol Pro',
    ownerId: '5',
    ownerName: 'Ana Martinez',
    clientName: 'Luis Torres',
    clientEmail: 'luis@email.com',
    clientPhone: '+51 999 555 666',
    date: '2026-04-02',
    startTime: '16:00',
    endTime: '18:00',
    totalPrice: 180,
    status: 'confirmed',
    paymentStatus: 'pending',
    source: 'manual',
    hasDispute: false,
  },
  {
    id: '1236',
    venueId: 'v3',
    venueName: 'Cancha 5',
    ownerId: '10',
    ownerName: 'Roberto García',
    clientName: 'María Lopez',
    clientEmail: 'maria.lopez@email.com',
    clientPhone: '+51 999 333 444',
    date: '2026-04-03',
    startTime: '17:00',
    endTime: '19:00',
    totalPrice: 150,
    status: 'pending',
    paymentStatus: 'partial',
    source: 'app',
    hasDispute: false,
  },
  {
    id: '1237',
    venueId: 'v1',
    venueName: 'Los Campeones',
    ownerId: '2',
    ownerName: 'Pedro Ramos',
    clientName: 'Juan Perez',
    clientEmail: 'juan.perez@email.com',
    clientPhone: '+51 999 111 222',
    date: '2026-04-03',
    startTime: '10:00',
    endTime: '12:00',
    totalPrice: 160,
    status: 'cancelled',
    paymentStatus: 'refunded',
    source: 'app',
    hasDispute: false,
  },
  {
    id: '1238',
    venueId: 'v4',
    venueName: 'Deportes Total',
    ownerId: '15',
    ownerName: 'Diego Flores',
    clientName: 'Roberto Sánchez',
    clientEmail: 'roberto.sanchez@email.com',
    clientPhone: '+51 999 444 555',
    date: '2026-04-04',
    startTime: '18:00',
    endTime: '20:00',
    totalPrice: 220,
    status: 'confirmed',
    paymentStatus: 'completed',
    source: 'app',
    hasDispute: true, // Has dispute
  },
  {
    id: '1239',
    venueId: 'v2',
    venueName: 'Fútbol Pro',
    ownerId: '5',
    ownerName: 'Ana Martinez',
    clientName: 'Carlos Mendoza',
    clientEmail: 'carlos@email.com',
    clientPhone: '+51 999 888 777',
    date: '2026-04-05',
    startTime: '14:00',
    endTime: '16:00',
    totalPrice: 180,
    status: 'in_progress',
    paymentStatus: 'completed',
    source: 'app',
    hasDispute: false,
  },
  {
    id: '1240',
    venueId: 'v1',
    venueName: 'Los Campeones',
    ownerId: '2',
    ownerName: 'Pedro Ramos',
    clientName: 'Pedro Gomez',
    clientEmail: 'pedro.gomez@email.com',
    clientPhone: '+51 999 777 888',
    date: '2026-04-01',
    startTime: '19:00',
    endTime: '21:00',
    totalPrice: 250,
    status: 'completed',
    paymentStatus: 'completed',
    source: 'manual',
    hasDispute: false,
  },
]

const MOCK_RESERVATION_DETAILS: ReservationDetails[] = [
  {
    id: '1234',
    venueId: 'v1',
    venueName: 'Los Campeones',
    venueAddress: 'Calle Sport 789, Cusco',
    venueCity: 'Cusco',
    venueType: 'Fútbol 5',
    ownerId: '2',
    ownerName: 'Pedro Ramos',
    ownerEmail: 'pedro@email.com',
    ownerPhone: '+51 999 123 456',
    clientId: '1',
    clientName: 'Carlos Mendoza',
    clientEmail: 'carlos@email.com',
    clientPhone: '+51 999 888 777',
    date: '2026-04-02',
    startTime: '15:00',
    endTime: '17:00',
    durationHours: 2,
    basePrice: 176,
    extrasTotal: 24,
    extras: [
      {
        id: 'e1',
        name: 'Gaseosa Inca Kola',
        category: 'Bebidas',
        quantity: 6,
        unitPrice: 4,
        total: 24,
      },
    ],
    totalPrice: 200,
    commissionAmount: 20,
    ownerRevenue: 180,
    status: 'confirmed',
    paymentStatus: 'completed',
    paymentMethod: 'culqi',
    paymentReference: 'cus_abc123xyz',
    paidAt: '2026-04-01T20:30:00',
    source: 'app',
    createdAt: '2026-04-01T18:00:00',
    confirmedAt: '2026-04-01T20:30:00',
    hasDispute: false,
    clientNotes: 'Por favor confirmar disponibilidad de estacionamiento.',
  },
  {
    id: '1238',
    venueId: 'v4',
    venueName: 'Deportes Total',
    venueAddress: 'Av. Los Deportes 456, Lima',
    venueCity: 'Lima',
    venueType: 'Fútbol 7',
    ownerId: '15',
    ownerName: 'Diego Flores',
    ownerEmail: 'diego@email.com',
    ownerPhone: '+51 999 888 999',
    clientId: '20',
    clientName: 'Roberto Sánchez',
    clientEmail: 'roberto.sanchez@email.com',
    clientPhone: '+51 999 444 555',
    date: '2026-04-04',
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2,
    basePrice: 200,
    extrasTotal: 20,
    extras: [
      { id: 'e2', name: 'Agua mineral', category: 'Bebidas', quantity: 4, unitPrice: 5, total: 20 },
    ],
    totalPrice: 220,
    commissionAmount: 22,
    ownerRevenue: 198,
    status: 'confirmed',
    paymentStatus: 'completed',
    paymentMethod: 'culqi',
    paymentReference: 'cus_def456uvw',
    paidAt: '2026-04-03T14:00:00',
    source: 'app',
    createdAt: '2026-04-03T12:00:00',
    confirmedAt: '2026-04-03T14:00:00',
    hasDispute: true,
    dispute: {
      id: 'd1',
      reservationId: '1238',
      status: 'open',
      openedBy: 'client',
      openedAt: '2026-04-04T20:30:00',
      reason: 'La cancha no estaba disponible a la hora acordada',
      description:
        'Llegué a las 18:00 pero el owner me dijo que la cancha estaba ocupada hasta las 19:00. Tuve que esperar 1 hora para empezar.',
      clientEvidence: ['chat_screenshot_1.png', 'booking_confirmation.pdf'],
      lastUpdateAt: '2026-04-04T20:30:00',
      messages: [
        {
          id: 'm1',
          senderId: '20',
          senderName: 'Roberto Sánchez',
          senderRole: 'client',
          message:
            'Abro este dispute porque la cancha no estaba disponible cuando llegué. Perdí 1 hora esperando.',
          createdAt: '2026-04-04T20:30:00',
        },
      ],
    },
  },
]

const MOCK_RESERVATION_STATS: ReservationStats = {
  total: 156,
  pending: 12,
  confirmed: 45,
  inProgress: 3,
  completed: 89,
  cancelled: 7,
  withDisputes: 1,
  pendingPayment: 8,
  todayRevenue: 45000,
  todayCount: 15,
}

export function useAdminReservations() {
  const [reservations, setReservations] = React.useState<AdminReservation[]>(MOCK_RESERVATIONS)
  const [details, setDetails] = React.useState<ReservationDetails[]>(MOCK_RESERVATION_DETAILS)
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState<ReservationFilters>({})

  // Filtered reservations
  const filteredReservations = React.useMemo(() => {
    let result = reservations

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(searchLower) ||
          r.venueName.toLowerCase().includes(searchLower) ||
          r.clientName.toLowerCase().includes(searchLower) ||
          r.ownerName.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((r) => r.status === filters.status)
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      result = result.filter((r) => r.paymentStatus === filters.paymentStatus)
    }

    if (filters.source && filters.source !== 'all') {
      result = result.filter((r) => r.source === filters.source)
    }

    if (filters.dateFrom) {
      result = result.filter((r) => r.date >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      result = result.filter((r) => r.date <= filters.dateTo!)
    }

    if (filters.hasDispute !== undefined) {
      result = result.filter((r) => r.hasDispute === filters.hasDispute)
    }

    if (filters.venueId) {
      result = result.filter((r) => r.venueId === filters.venueId)
    }

    if (filters.ownerId) {
      result = result.filter((r) => r.ownerId === filters.ownerId)
    }

    return result
  }, [reservations, filters])

  // Stats
  const stats = React.useMemo(() => {
    const filtered = filteredReservations
    return {
      total: filtered.length,
      pending: filtered.filter((r) => r.status === 'pending').length,
      confirmed: filtered.filter((r) => r.status === 'confirmed').length,
      inProgress: filtered.filter((r) => r.status === 'in_progress').length,
      completed: filtered.filter((r) => r.status === 'completed').length,
      cancelled: filtered.filter((r) => r.status === 'cancelled').length,
      withDisputes: filtered.filter((r) => r.hasDispute).length,
      pendingPayment: filtered.filter((r) => r.paymentStatus === 'pending').length,
      todayRevenue: MOCK_RESERVATION_STATS.todayRevenue,
      todayCount: MOCK_RESERVATION_STATS.todayCount,
    }
  }, [filteredReservations])

  const getReservationById = React.useCallback(
    (id: string) => {
      return reservations.find((r) => r.id === id)
    },
    [reservations]
  )

  const getReservationDetails = React.useCallback(
    (id: string) => {
      return details.find((d) => d.id === id) || null
    },
    [details]
  )

  const updateReservationStatus = React.useCallback(
    (reservationId: string, newStatus: AdminReservation['status'], reason?: string) => {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: newStatus } : r))
      )
      setDetails((prev) =>
        prev.map((d) =>
          d.id === reservationId
            ? {
                ...d,
                status: newStatus,
                cancelledAt: newStatus === 'cancelled' ? new Date().toISOString() : d.cancelledAt,
                completedAt: newStatus === 'completed' ? new Date().toISOString() : d.completedAt,
                cancellationReason: reason || d.cancellationReason,
              }
            : d
        )
      )
    },
    []
  )

  const processRefund = React.useCallback(
    (reservationId: string, refundAmount: number, refundReason: string, adminId: string) => {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId
            ? { ...r, paymentStatus: 'refunded', status: 'cancelled', hasDispute: false }
            : r
        )
      )
      setDetails((prev) =>
        prev.map((d) =>
          d.id === reservationId
            ? {
                ...d,
                paymentStatus: 'refunded',
                status: 'cancelled',
                refundAmount,
                refundReason,
                refundRequestedAt: new Date().toISOString(),
                refundProcessedAt: new Date().toISOString(),
                cancelledBy: 'admin',
              }
            : d
        )
      )
    },
    []
  )

  const addAdminNote = React.useCallback((reservationId: string, note: string) => {
    setDetails((prev) => prev.map((d) => (d.id === reservationId ? { ...d, adminNotes: note } : d)))
  }, [])

  return {
    reservations: filteredReservations,
    allReservations: reservations,
    stats,
    loading,
    filters,
    setFilters,
    getReservationById,
    getReservationDetails,
    updateReservationStatus,
    processRefund,
    addAdminNote,
  }
}

export function useReservationDispute(reservationId: string) {
  const [dispute, setDispute] = React.useState<ReservationDispute | null>(null)
  const [loading, setLoading] = React.useState(false)

  // Load dispute from details
  React.useEffect(() => {
    const details = MOCK_RESERVATION_DETAILS.find((d) => d.id === reservationId)
    if (details?.dispute) {
      setDispute(details.dispute)
    }
  }, [reservationId])

  const addMessage = React.useCallback(
    (message: string, senderId: string, senderName: string, senderRole: 'admin') => {
      if (!dispute) return

      const newMessage: DisputeMessage = {
        id: `m${Date.now()}`,
        senderId,
        senderName,
        senderRole,
        message,
        createdAt: new Date().toISOString(),
      }

      setDispute((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
              lastUpdateAt: new Date().toISOString(),
              status: 'in_review',
            }
          : null
      )
    },
    [dispute]
  )

  const resolveDispute = React.useCallback(
    (
      resolution: 'favor_client' | 'favor_owner' | 'partial' | 'no_action',
      details: string,
      refundGranted?: number,
      compensationGranted?: number,
      adminId?: string
    ) => {
      if (!dispute) return

      setDispute((prev) =>
        prev
          ? {
              ...prev,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              resolvedBy: adminId,
              resolution,
              resolutionDetails: details,
              refundGranted,
              compensationGranted,
              lastUpdateAt: new Date().toISOString(),
            }
          : null
      )
    },
    [dispute]
  )

  const closeDispute = React.useCallback(() => {
    if (!dispute) return

    setDispute((prev) =>
      prev
        ? {
            ...prev,
            status: 'closed',
            lastUpdateAt: new Date().toISOString(),
          }
        : null
    )
  }, [dispute])

  return {
    dispute,
    loading,
    addMessage,
    resolveDispute,
    closeDispute,
  }
}

// ============================================
// FINANCE
// ============================================

// Generate daily revenue for a period
function generateDailyRevenue(days: number): DailyRevenue[] {
  const data: DailyRevenue[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Random but realistic values
    const reservationBase = 150 + Math.floor(Math.random() * 100)
    const extrasBase = 20 + Math.floor(Math.random() * 30)
    const count = 10 + Math.floor(Math.random() * 15)

    data.push({
      date: date.toISOString().split('T')[0],
      reservations: reservationBase * count,
      extras: extrasBase * count,
      total: (reservationBase + extrasBase) * count,
      commission: Math.floor(reservationBase * count * 0.1),
      reservationCount: count,
    })
  }

  return data
}

const MOCK_DAILY_REVENUE: Record<FinancePeriod, DailyRevenue[]> = {
  today: generateDailyRevenue(1),
  week: generateDailyRevenue(7),
  month: generateDailyRevenue(30),
  year: generateDailyRevenue(365),
}

const MOCK_FINANCE_KPIS: Record<FinancePeriod, FinanceKPIs> = {
  today: {
    totalRevenue: 45000,
    reservationsRevenue: 38000,
    extrasRevenue: 7000,
    totalCommission: 3800,
    platformRevenue: 3800,
    totalReservations: 156,
    completedReservations: 89,
    cancelledReservations: 7,
    revenueGrowth: 12,
    reservationGrowth: 8,
    averageReservationValue: 244,
    averageExtrasPerReservation: 45,
    period: 'today',
    periodStart: new Date().toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
  },
  week: {
    totalRevenue: 280000,
    reservationsRevenue: 238000,
    extrasRevenue: 42000,
    totalCommission: 23800,
    platformRevenue: 23800,
    totalReservations: 1020,
    completedReservations: 850,
    cancelledReservations: 45,
    revenueGrowth: 15,
    reservationGrowth: 10,
    averageReservationValue: 275,
    averageExtrasPerReservation: 41,
    period: 'week',
    periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
  },
  month: {
    totalRevenue: 1200000,
    reservationsRevenue: 1020000,
    extrasRevenue: 180000,
    totalCommission: 102000,
    platformRevenue: 102000,
    totalReservations: 4567,
    completedReservations: 3800,
    cancelledReservations: 180,
    revenueGrowth: 12,
    reservationGrowth: 8,
    averageReservationValue: 263,
    averageExtrasPerReservation: 39,
    period: 'month',
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
  },
  year: {
    totalRevenue: 12340000,
    reservationsRevenue: 10500000,
    extrasRevenue: 1840000,
    totalCommission: 1050000,
    platformRevenue: 1050000,
    totalReservations: 45000,
    completedReservations: 38000,
    cancelledReservations: 1800,
    revenueGrowth: 28,
    reservationGrowth: 22,
    averageReservationValue: 274,
    averageExtrasPerReservation: 41,
    period: 'year',
    periodStart: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
  },
}

const MOCK_REVENUE_BREAKDOWN: RevenueBreakdown = {
  byCity: [
    { city: 'Lima', revenue: 800000, commission: 80000, reservationCount: 3000, percentage: 65 },
    { city: 'Arequipa', revenue: 180000, commission: 18000, reservationCount: 700, percentage: 15 },
    { city: 'Cusco', revenue: 120000, commission: 12000, reservationCount: 450, percentage: 10 },
    { city: 'Trujillo', revenue: 85000, commission: 8500, reservationCount: 320, percentage: 7 },
    { city: 'Otras', revenue: 35000, commission: 3500, reservationCount: 130, percentage: 3 },
  ],
  byOwner: [
    {
      ownerId: '2',
      ownerName: 'Pedro Ramos',
      venueCount: 3,
      revenue: 250000,
      commission: 25000,
      ownerRevenue: 225000,
      reservationCount: 950,
      percentage: 20,
      rank: 1,
    },
    {
      ownerId: '5',
      ownerName: 'Ana Martinez',
      venueCount: 2,
      revenue: 180000,
      commission: 18000,
      ownerRevenue: 162000,
      reservationCount: 700,
      percentage: 15,
      rank: 2,
    },
    {
      ownerId: '10',
      ownerName: 'Roberto García',
      venueCount: 1,
      revenue: 130000,
      commission: 13000,
      ownerRevenue: 117000,
      reservationCount: 500,
      percentage: 11,
      rank: 3,
    },
    {
      ownerId: '15',
      ownerName: 'Diego Flores',
      venueCount: 2,
      revenue: 95000,
      commission: 9500,
      ownerRevenue: 85500,
      reservationCount: 380,
      percentage: 8,
      rank: 4,
    },
    {
      ownerId: '20',
      ownerName: 'Carlos Mendoza',
      venueCount: 1,
      revenue: 75000,
      commission: 7500,
      ownerRevenue: 67500,
      reservationCount: 280,
      percentage: 6,
      rank: 5,
    },
  ],
  byVenue: [
    {
      venueId: 'v1',
      venueName: 'Los Campeones',
      ownerId: '2',
      ownerName: 'Pedro Ramos',
      city: 'Cusco',
      revenue: 150000,
      commission: 15000,
      reservationCount: 550,
      averageRating: 4.8,
      occupancyRate: 78,
      percentage: 12,
      rank: 1,
    },
    {
      venueId: 'v2',
      venueName: 'Fútbol Pro',
      ownerId: '5',
      ownerName: 'Ana Martinez',
      city: 'Arequipa',
      revenue: 120000,
      commission: 12000,
      reservationCount: 450,
      averageRating: 4.6,
      occupancyRate: 65,
      percentage: 10,
      rank: 2,
    },
    {
      venueId: 'v3',
      venueName: 'Cancha 5',
      ownerId: '10',
      ownerName: 'Roberto García',
      city: 'Lima',
      revenue: 130000,
      commission: 13000,
      reservationCount: 500,
      averageRating: 4.5,
      occupancyRate: 72,
      percentage: 11,
      rank: 3,
    },
    {
      venueId: 'v4',
      venueName: 'Deportes Total',
      ownerId: '15',
      ownerName: 'Diego Flores',
      city: 'Lima',
      revenue: 70000,
      commission: 7000,
      reservationCount: 280,
      averageRating: 4.4,
      occupancyRate: 58,
      percentage: 6,
      rank: 4,
    },
  ],
  byPaymentMethod: [
    { method: 'culqi', revenue: 650000, count: 2600, percentage: 54 },
    { method: 'cash', revenue: 300000, count: 1200, percentage: 25 },
    { method: 'yape', revenue: 100000, count: 400, percentage: 8 },
    { method: 'plin', revenue: 80000, count: 320, percentage: 7 },
    { method: 'manual', revenue: 90000, count: 360, percentage: 6 },
  ],
  byCategory: [
    { category: 'Reservas', revenue: 1020000, count: 3800, percentage: 84 },
    { category: 'Bebidas', revenue: 85000, count: 2100, percentage: 7 },
    { category: 'Snacks', revenue: 45000, count: 1800, percentage: 4 },
    { category: 'Artículos deportivos', revenue: 30000, count: 450, percentage: 2.5 },
    { category: 'Alquiler', revenue: 25000, count: 150, percentage: 2 },
    { category: 'Servicios', revenue: 15000, count: 80, percentage: 1.5 },
  ],
}

const MOCK_COMMISSION_CONFIG: CommissionConfig = {
  globalCommission: 10,
  commissionFreeDays: 0,
  minimumCommission: 5,
  specialCommissions: [],
}

export function useFinanceData(initialPeriod: FinancePeriod = 'month') {
  const [period, setPeriod] = React.useState<FinancePeriod>(initialPeriod)
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState<FinanceFilters>({ period: initialPeriod })

  // Get KPIs for current period
  const kpis = React.useMemo(() => MOCK_FINANCE_KPIS[period], [period])

  // Get daily revenue for charts
  const dailyRevenue = React.useMemo(() => MOCK_DAILY_REVENUE[period], [period])

  // Get revenue breakdown
  const breakdown = React.useMemo(() => {
    let data = MOCK_REVENUE_BREAKDOWN

    // Apply filters if needed
    if (filters.ownerId) {
      data = {
        ...data,
        byOwner: data.byOwner.filter((o) => o.ownerId === filters.ownerId),
        byVenue: data.byVenue.filter((v) => v.ownerId === filters.ownerId),
      }
    }

    if (filters.venueId) {
      data = {
        ...data,
        byVenue: data.byVenue.filter((v) => v.venueId === filters.venueId),
      }
    }

    if (filters.city) {
      data = {
        ...data,
        byCity: data.byCity.filter((c) => c.city === filters.city),
        byVenue: data.byVenue.filter((v) => v.city === filters.city),
      }
    }

    return data
  }, [filters])

  // Change period
  const changePeriod = React.useCallback((newPeriod: FinancePeriod) => {
    setPeriod(newPeriod)
    setFilters((prev) => ({ ...prev, period: newPeriod }))
  }, [])

  // Export data
  const exportData = React.useCallback(
    (format: 'csv' | 'xlsx', type: 'kpis' | 'breakdown' | 'daily') => {
      setLoading(true)

      setTimeout(() => {
        console.log(`Exporting ${type} data in ${format} format for period ${period}`)
        setLoading(false)
        // In real implementation, would trigger actual export
      }, 500)
    },
    [period]
  )

  return {
    period,
    kpis,
    dailyRevenue,
    breakdown,
    loading,
    filters,
    setFilters,
    changePeriod,
    exportData,
  }
}

export function useCommissionConfig() {
  const [config, setConfig] = React.useState<CommissionConfig>(MOCK_COMMISSION_CONFIG)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const updateGlobalCommission = React.useCallback((newCommission: number) => {
    setConfig((prev) => ({ ...prev, globalCommission: newCommission }))
  }, [])

  const updateCommissionFreeDays = React.useCallback((days: number) => {
    setConfig((prev) => ({ ...prev, commissionFreeDays: days }))
  }, [])

  const addSpecialCommission = React.useCallback(
    (special: CommissionConfig['specialCommissions'][0]) => {
      setConfig((prev) => ({
        ...prev,
        specialCommissions: [...prev.specialCommissions, special],
      }))
    },
    []
  )

  const removeSpecialCommission = React.useCallback((index: number) => {
    setConfig((prev) => ({
      ...prev,
      specialCommissions: prev.specialCommissions.filter((_, i) => i !== index),
    }))
  }, [])

  const saveConfig = React.useCallback(() => {
    setSaving(true)

    setTimeout(() => {
      console.log('Saving commission config:', config)
      setSaving(false)
      // In real implementation, would save to backend
    }, 500)
  }, [config])

  return {
    config,
    loading,
    saving,
    updateGlobalCommission,
    updateCommissionFreeDays,
    addSpecialCommission,
    removeSpecialCommission,
    saveConfig,
  }
}

export function useTopPerformers(type: 'owners' | 'venues' = 'owners', limit: number = 10) {
  const [loading, setLoading] = React.useState(false)

  const performers = React.useMemo(() => {
    if (type === 'owners') {
      return MOCK_REVENUE_BREAKDOWN.byOwner.slice(0, limit)
    }
    return MOCK_REVENUE_BREAKDOWN.byVenue.slice(0, limit)
  }, [type, limit])

  return {
    performers,
    loading,
  }
}

// ============================================
// MODERATION
// ============================================

const MOCK_REPORTS: ContentReport[] = [
  {
    id: 'r1',
    type: 'review',
    category: 'offensive_content',
    status: 'pending',
    contentId: 'rev456',
    contentType: 'review',
    contentPreview:
      '"Este lugar es terrible, el owner es un incompetente y debería cerrar este negocio de mierda"',
    contentUrl: '/admin/reservas?review=rev456',
    contentOwnerId: 'u20',
    contentOwnerName: 'Juan Perez',
    contentOwnerType: 'user',
    reporterId: 'u21',
    reporterName: 'María Lopez',
    reporterEmail: 'maria@email.com',
    reportedAt: '2026-04-02T10:30:00',
    reason: 'Lenguaje inapropiado y ofensivo hacia el owner',
    description:
      'El usuario está usando lenguaje vulgar y atacando personalmente al dueño del negocio.',
    priority: 'high',
    reportCount: 3,
  },
  {
    id: 'r2',
    type: 'photo',
    category: 'inappropriate',
    status: 'pending',
    contentId: 'photo789',
    contentType: 'photo',
    contentPreview: 'Foto de reseña - Cancha Los Campeones',
    contentUrl: '/admin/canchas/v1?photo=photo789',
    contentOwnerId: 'u22',
    contentOwnerName: 'Carlos Garcia',
    contentOwnerType: 'user',
    reporterId: 'u23',
    reporterName: 'Ana Torres',
    reporterEmail: 'ana@email.com',
    reportedAt: '2026-04-01T15:45:00',
    reason: 'Contenido inapropiado en la foto',
    description: 'La foto contiene contenido que no corresponde a una cancha deportiva.',
    priority: 'medium',
    reportCount: 1,
  },
  {
    id: 'r3',
    type: 'review',
    category: 'fake_review',
    status: 'pending',
    contentId: 'rev890',
    contentType: 'review',
    contentPreview: '"La mejor cancha del mundo, 100% recomendada, excelente servicio"',
    contentUrl: '/admin/reservas?review=rev890',
    contentOwnerId: 'u24',
    contentOwnerName: 'Pedro Sanchez',
    contentOwnerType: 'user',
    reporterId: 'u25',
    reporterName: 'Luis Ramos',
    reporterEmail: 'luis@email.com',
    reportedAt: '2026-04-01T09:20:00',
    reason: 'Posible reseña falsa - usuario con solo 1 reseña',
    description: 'El usuario parece ser un perfil f creado solo para dar reseñas positivas.',
    priority: 'low',
    reportCount: 2,
  },
  {
    id: 'r4',
    type: 'user_profile',
    category: 'harassment',
    status: 'pending',
    contentId: 'u30',
    contentType: 'user',
    contentPreview: 'Perfil de usuario - Roberto Diaz',
    contentUrl: '/admin/usuarios/u30',
    contentOwnerId: 'u30',
    contentOwnerName: 'Roberto Diaz',
    contentOwnerType: 'user',
    reporterId: 'u31',
    reporterName: 'Elena Flores',
    reporterEmail: 'elena@email.com',
    reportedAt: '2026-03-31T14:00:00',
    reason: 'Perfil con contenido ofensivo en biografía',
    description: 'El usuario tiene comentarios ofensivos en su biografía.',
    priority: 'high',
    reportCount: 1,
  },
  {
    id: 'r5',
    type: 'photo',
    category: 'violence',
    status: 'pending',
    contentId: 'photo900',
    contentType: 'photo',
    contentPreview: 'Foto de cancha - Fútbol Pro',
    contentUrl: '/admin/canchas/v2?photo=photo900',
    contentOwnerId: 'u5',
    contentOwnerName: 'Ana Martinez',
    contentOwnerType: 'owner',
    reporterId: 'u32',
    reporterName: 'Diego Ruiz',
    reporterEmail: 'diego@email.com',
    reportedAt: '2026-03-30T11:30:00',
    reason: 'Foto con violencia o contenido gráfico',
    description: 'La foto parece mostrar una lesión o contenido gráfico.',
    priority: 'urgent',
    reportCount: 4,
  },
]

const MOCK_REVIEWS_FOR_MODERATION: ReviewForModeration[] = [
  {
    id: 'rev1',
    venueId: 'v1',
    venueName: 'Los Campeones',
    ownerId: '2',
    ownerName: 'Pedro Ramos',
    reviewerId: 'u10',
    reviewerName: 'Carlos Mendoza',
    reviewerEmail: 'carlos@email.com',
    rating: 5,
    text: 'Excelente cancha, el grass está en perfectas condiciones. El owner muy amable y los servicios de primera.',
    photos: ['photo1.jpg', 'photo2.jpg'],
    createdAt: '2026-04-01T16:00:00',
    isPublished: true,
    hasProfanity: false,
    hasImages: true,
    reportCount: 0,
    helpfulCount: 12,
  },
  {
    id: 'rev2',
    venueId: 'v2',
    venueName: 'Fútbol Pro',
    ownerId: '5',
    ownerName: 'Ana Martinez',
    reviewerId: 'u11',
    reviewerName: 'Roberto Sanchez',
    reviewerEmail: 'roberto@email.com',
    rating: 2,
    text: 'Mala experiencia, la cancha estaba sucia y el precio muy alto para lo que ofrecen. No vuelvo.',
    photos: [],
    createdAt: '2026-03-30T14:30:00',
    isPublished: true,
    hasProfanity: false,
    hasImages: false,
    reportCount: 0,
    helpfulCount: 3,
  },
  {
    id: 'rev3',
    venueId: 'v3',
    venueName: 'Cancha 5',
    ownerId: '10',
    ownerName: 'Roberto García',
    reviewerId: 'u12',
    reviewerName: 'María Lopez',
    reviewerEmail: 'maria@email.com',
    rating: 4,
    text: 'Buena cancha, buen precio. El estacionamiento es pequeño pero suficiente.',
    photos: ['photo3.jpg'],
    createdAt: '2026-03-28T10:00:00',
    isPublished: true,
    hasProfanity: false,
    hasImages: true,
    reportCount: 0,
    helpfulCount: 5,
  },
  {
    id: 'rev456',
    venueId: 'v1',
    venueName: 'Los Campeones',
    ownerId: '2',
    ownerName: 'Pedro Ramos',
    reviewerId: 'u20',
    reviewerName: 'Juan Perez',
    reviewerEmail: 'juan@email.com',
    rating: 1,
    text: 'Este lugar es terrible, el owner es un incompetente y debería cerrar este negocio de mierda',
    photos: [],
    createdAt: '2026-04-02T09:00:00',
    updatedAt: '2026-04-02T09:15:00',
    isPublished: true,
    hasProfanity: true,
    hasImages: false,
    reportCount: 3,
    flaggedBy: 'system',
    flagReason: 'Profanity detected',
    helpfulCount: 0,
  },
]

const MOCK_PHOTOS_FOR_MODERATION: PhotoForModeration[] = [
  {
    id: 'ph1',
    type: 'venue_photo',
    sourceId: 'v1',
    sourceName: 'Los Campeones',
    url: '/photos/venue1-main.jpg',
    thumbnailUrl: '/photos/venue1-thumb.jpg',
    uploaderId: '2',
    uploaderName: 'Pedro Ramos',
    uploaderType: 'owner',
    status: 'approved',
    uploadedAt: '2026-03-15T10:00:00',
    reportCount: 0,
  },
  {
    id: 'ph2',
    type: 'review_photo',
    sourceId: 'rev1',
    sourceName: 'Reseña de Carlos M.',
    url: '/photos/review1-1.jpg',
    thumbnailUrl: '/photos/review1-1-thumb.jpg',
    uploaderId: 'u10',
    uploaderName: 'Carlos Mendoza',
    uploaderType: 'user',
    status: 'approved',
    uploadedAt: '2026-04-01T16:00:00',
    reportCount: 0,
  },
  {
    id: 'photo789',
    type: 'review_photo',
    sourceId: 'rev456',
    sourceName: 'Reseña de Juan P.',
    url: '/photos/review456-1.jpg',
    thumbnailUrl: '/photos/review456-1-thumb.jpg',
    uploaderId: 'u20',
    uploaderName: 'Juan Perez',
    uploaderType: 'user',
    status: 'reported',
    uploadedAt: '2026-04-02T09:00:00',
    reportId: 'r2',
    reportCategory: 'inappropriate',
    reportCount: 1,
  },
  {
    id: 'photo900',
    type: 'venue_photo',
    sourceId: 'v2',
    sourceName: 'Fútbol Pro',
    url: '/photos/venue2-action.jpg',
    thumbnailUrl: '/photos/venue2-action-thumb.jpg',
    uploaderId: 'u5',
    uploaderName: 'Ana Martinez',
    uploaderType: 'owner',
    status: 'reported',
    uploadedAt: '2026-03-30T11:00:00',
    reportId: 'r5',
    reportCategory: 'violence',
    reportCount: 4,
  },
]

const MOCK_MODERATION_STATS: ModerationStats = {
  pendingReports: 5,
  pendingReviews: 1,
  pendingPhotos: 2,
  resolvedToday: 8,
  resolvedThisWeek: 34,
  averageResolutionTime: 2.5,
  reportsByCategory: [
    { category: 'offensive_content', count: 15 },
    { category: 'inappropriate', count: 8 },
    { category: 'fake_review', count: 6 },
    { category: 'spam', count: 4 },
    { category: 'harassment', count: 3 },
  ],
  reportsByType: [
    { type: 'review', count: 25 },
    { type: 'photo', count: 12 },
    { type: 'user_profile', count: 5 },
    { type: 'venue_content', count: 3 },
  ],
}

export function useModeration() {
  const [reports, setReports] = React.useState<ContentReport[]>(MOCK_REPORTS)
  const [reviews, setReviews] = React.useState<ReviewForModeration[]>(MOCK_REVIEWS_FOR_MODERATION)
  const [photos, setPhotos] = React.useState<PhotoForModeration[]>(MOCK_PHOTOS_FOR_MODERATION)
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState<ModerationFilters>({})

  // Stats
  const stats = React.useMemo(() => MOCK_MODERATION_STATS, [])

  // Filtered reports
  const filteredReports = React.useMemo(() => {
    let result = reports.filter((r) => r.status === 'pending')

    if (filters.type && filters.type !== 'all') {
      result = result.filter((r) => r.type === filters.type)
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter((r) => r.category === filters.category)
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter((r) => r.priority === filters.priority)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.contentPreview.toLowerCase().includes(search) ||
          r.reporterName.toLowerCase().includes(search) ||
          r.contentOwnerName.toLowerCase().includes(search)
      )
    }

    return result.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [reports, filters])

  // Get report by ID
  const getReportById = React.useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  )

  // Resolve report
  const resolveReport = React.useCallback(
    (
      reportId: string,
      resolution: 'keep' | 'edit' | 'delete' | 'warn_user',
      notes: string,
      editedContent?: string
    ) => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: 'resolved' as ReportStatus,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'admin-3',
                resolution,
                resolutionNotes: notes,
                editedContent,
              }
            : r
        )
      )

      // If deleting, also update the related content
      if (resolution === 'delete') {
        const report = reports.find((r) => r.id === reportId)
        if (report?.contentType === 'review') {
          setReviews((prev) => prev.filter((r) => r.id !== report.contentId))
        }
        if (report?.contentType === 'photo') {
          setPhotos((prev) => prev.filter((p) => p.id !== report.contentId))
        }
      }

      // If editing, update the content
      if (resolution === 'edit' && editedContent) {
        const report = reports.find((r) => r.id === reportId)
        if (report?.contentType === 'review') {
          setReviews((prev) =>
            prev.map((r) => (r.id === report.contentId ? { ...r, text: editedContent } : r))
          )
        }
      }
    },
    [reports]
  )

  // Dismiss report
  const dismissReport = React.useCallback((reportId: string, reason: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'dismissed' as ReportStatus,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin-3',
              resolutionNotes: reason,
            }
          : r
      )
    )
  }, [])

  // Delete review directly
  const deleteReview = React.useCallback((reviewId: string, reason: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    // In real implementation, would also create audit log
  }, [])

  // Edit review
  const editReview = React.useCallback((reviewId: string, newText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, text: newText, updatedAt: new Date().toISOString() } : r
      )
    )
  }, [])

  // Delete photo
  const deletePhoto = React.useCallback((photoId: string, reason: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }, [])

  // Approve photo
  const approvePhoto = React.useCallback((photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, status: 'approved' as const, reportCount: 0 } : p
      )
    )
  }, [])

  return {
    reports,
    filteredReports,
    reviews,
    photos,
    stats,
    loading,
    filters,
    setFilters,
    getReportById,
    resolveReport,
    dismissReport,
    deleteReview,
    editReview,
    deletePhoto,
    approvePhoto,
  }
}

// ============================================
// CONFIGURATION
// ============================================

const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'f1',
    name: 'App Móvil',
    description: 'Permite reservas desde la app móvil para usuarios',
    enabled: true,
    category: 'core',
    updatedAt: '2026-04-01T10:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f2',
    name: 'Pagos en Línea',
    description: 'Procesar pagos con Culqi y otros métodos',
    enabled: true,
    category: 'payment',
    updatedAt: '2026-03-15T08:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f3',
    name: 'Promociones',
    description: 'Sistema de promociones y descuentos activo',
    enabled: true,
    category: 'marketing',
    updatedAt: '2026-03-20T14:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f4',
    name: 'Ventas Extras',
    description: 'Productos y servicios adicionales en reservas',
    enabled: true,
    category: 'core',
    updatedAt: '2026-03-18T11:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f5',
    name: 'Reseñas',
    description: 'Sistema de calificaciones y opiniones',
    enabled: true,
    category: 'social',
    updatedAt: '2026-03-10T09:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f6',
    name: 'Conexiones',
    description: 'Red social entre usuarios para armar equipos',
    enabled: false,
    category: 'social',
    updatedAt: '2026-02-28T16:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f7',
    name: 'Analytics Avanzado',
    description: 'Métricas detalladas y reportes personalizados',
    enabled: true,
    category: 'analytics',
    updatedAt: '2026-03-25T12:00:00',
    updatedBy: 'Admin',
  },
  {
    id: 'f8',
    name: 'Notificaciones Push',
    description: 'Envío de notificaciones push a usuarios',
    enabled: true,
    category: 'core',
    updatedAt: '2026-03-22T10:00:00',
    updatedBy: 'Admin',
  },
]

const MOCK_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'i1',
    name: 'Culqi',
    type: 'payment',
    enabled: true,
    configured: true,
    apiKey: 'pk_live_xxxxxxxxxxxx',
    secretKey: 'sk_live_xxxxxxxxxxxx',
    webhookUrl: 'https://api.pichanga.pe/webhooks/culqi',
    status: 'connected',
    updatedAt: '2026-03-15T08:00:00',
  },
  {
    id: 'i2',
    name: 'SendGrid',
    type: 'email',
    enabled: true,
    configured: true,
    apiKey: 'SG.xxxxxxxxxxxx',
    status: 'connected',
    updatedAt: '2026-03-10T09:00:00',
  },
  {
    id: 'i3',
    name: 'Twilio',
    type: 'sms',
    enabled: false,
    configured: false,
    status: 'not_configured',
    updatedAt: '2026-02-20T11:00:00',
  },
  {
    id: 'i4',
    name: 'Google Analytics',
    type: 'analytics',
    enabled: true,
    configured: true,
    apiKey: 'UA-XXXXXXXXX',
    status: 'connected',
    updatedAt: '2026-03-01T14:00:00',
  },
  {
    id: 'i5',
    name: 'AWS S3',
    type: 'storage',
    enabled: true,
    configured: true,
    apiKey: 'AKIAxxxxxxxxxxxx',
    secretKey: 'xxxxxxxxxxxxxxxx',
    status: 'connected',
    updatedAt: '2026-02-15T10:00:00',
  },
]

const MOCK_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: false,
  message: 'Estamos realizando mejoras en la plataforma. Volveremos pronto.',
  scheduledType: 'none',
  allowAdmins: true,
  allowOwners: false,
  whitelistedIPs: [],
  showBanner: false,
  bannerMessage: 'Mantenimiento programado para el día de hoy a las 10:00 PM',
  updatedAt: '2026-04-01T10:00:00',
  updatedBy: 'Admin',
}

const MOCK_GENERAL_CONFIG: GeneralConfig = {
  cities: ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Ica'],
  defaultCity: 'Lima',
  sportsTypes: ['Fútbol 5', 'Fútbol 7', 'Fulbito', 'Fútbol 11'],
  surfaces: ['Grass sintético', 'Grass natural', 'Losa', 'Concreto'],
  services: [
    'Estacionamiento',
    'Baños',
    'Duchas',
    'Iluminación',
    'Quincho',
    'Tribuna',
    'Vestuarios',
    'Cantina',
  ],
  productCategories: ['Bebidas', 'Snacks', 'Artículos deportivos', 'Alquiler', 'Servicios'],
  paymentMethods: [
    { name: 'Culqi', enabled: true, feePercentage: 2.5 },
    { name: 'Efectivo', enabled: true },
    { name: 'Yape', enabled: false },
    { name: 'Plin', enabled: false },
  ],
  currency: 'PEN',
  taxRate: 18,
  minAdvanceHours: 1,
  maxAdvanceDays: 30,
  defaultCancellationHours: 3,
  defaultRefundPercentage: 80,
  defaultToleranceMinutes: 15,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  updatedAt: '2026-04-01T10:00:00',
  updatedBy: 'Admin',
}

export function useFeatureFlags() {
  const [features, setFeatures] = React.useState<FeatureFlag[]>(MOCK_FEATURE_FLAGS)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const toggleFeature = React.useCallback((featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === featureId
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString(), updatedBy: 'Admin' }
          : f
      )
    )
  }, [])

  const enableAll = React.useCallback((category?: FeatureFlag['category']) => {
    setFeatures((prev) =>
      prev.map((f) =>
        category ? (f.category === category ? { ...f, enabled: true } : f) : { ...f, enabled: true }
      )
    )
  }, [])

  const disableAll = React.useCallback((category?: FeatureFlag['category']) => {
    setFeatures((prev) =>
      prev.map((f) =>
        category
          ? f.category === category
            ? { ...f, enabled: false }
            : f
          : { ...f, enabled: false }
      )
    )
  }, [])

  return {
    features,
    loading,
    saving,
    toggleFeature,
    enableAll,
    disableAll,
  }
}

export function useIntegrations() {
  const [integrations, setIntegrations] = React.useState<IntegrationConfig[]>(MOCK_INTEGRATIONS)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const updateIntegration = React.useCallback(
    (integrationId: string, updates: Partial<IntegrationConfig>) => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
        )
      )
    },
    []
  )

  const testConnection = React.useCallback(
    (integrationId: string) => {
      setLoading(true)
      setTimeout(() => {
        // Simulate connection test
        const integration = integrations.find((i) => i.id === integrationId)
        if (integration) {
          updateIntegration(integrationId, {
            status: integration.configured ? 'connected' : 'error',
            lastChecked: new Date().toISOString(),
          })
        }
        setLoading(false)
      }, 1000)
    },
    [integrations, updateIntegration]
  )

  const enableIntegration = React.useCallback(
    (integrationId: string) => {
      updateIntegration(integrationId, { enabled: true })
    },
    [updateIntegration]
  )

  const disableIntegration = React.useCallback(
    (integrationId: string) => {
      updateIntegration(integrationId, { enabled: false })
    },
    [updateIntegration]
  )

  return {
    integrations,
    loading,
    saving,
    updateIntegration,
    testConnection,
    enableIntegration,
    disableIntegration,
  }
}

export function useMaintenanceConfig() {
  const [config, setConfig] = React.useState<MaintenanceConfig>(MOCK_MAINTENANCE_CONFIG)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const enableMaintenance = React.useCallback((message?: string) => {
    setConfig((prev) => ({
      ...prev,
      enabled: true,
      message: message || prev.message,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    }))
  }, [])

  const disableMaintenance = React.useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      enabled: false,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    }))
  }, [])

  const scheduleMaintenance = React.useCallback(
    (startTime: string, endTime: string, message: string) => {
      setConfig((prev) => ({
        ...prev,
        scheduledType: 'scheduled',
        startTime,
        endTime,
        message,
        showBanner: true,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin',
      }))
    },
    []
  )

  const updateMessage = React.useCallback((message: string) => {
    setConfig((prev) => ({ ...prev, message }))
  }, [])

  const toggleBanner = React.useCallback(() => {
    setConfig((prev) => ({ ...prev, showBanner: !prev.showBanner }))
  }, [])

  const addWhitelistedIP = React.useCallback((ip: string) => {
    setConfig((prev) => ({
      ...prev,
      whitelistedIPs: [...prev.whitelistedIPs, ip],
    }))
  }, [])

  const removeWhitelistedIP = React.useCallback((ip: string) => {
    setConfig((prev) => ({
      ...prev,
      whitelistedIPs: prev.whitelistedIPs.filter((i) => i !== ip),
    }))
  }, [])

  const saveConfig = React.useCallback(() => {
    setSaving(true)
    setTimeout(() => {
      setConfig((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin',
      }))
      setSaving(false)
    }, 500)
  }, [])

  return {
    config,
    loading,
    saving,
    enableMaintenance,
    disableMaintenance,
    scheduleMaintenance,
    updateMessage,
    toggleBanner,
    addWhitelistedIP,
    removeWhitelistedIP,
    saveConfig,
  }
}

export function useGeneralConfig() {
  const [config, setConfig] = React.useState<GeneralConfig>(MOCK_GENERAL_CONFIG)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Cities
  const addCity = React.useCallback((city: string) => {
    setConfig((prev) => ({
      ...prev,
      cities: [...prev.cities, city],
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const removeCity = React.useCallback((city: string) => {
    setConfig((prev) => ({
      ...prev,
      cities: prev.cities.filter((c) => c !== city),
    }))
  }, [])

  // Sports types
  const addSportType = React.useCallback((sport: string) => {
    setConfig((prev) => ({
      ...prev,
      sportsTypes: [...prev.sportsTypes, sport],
    }))
  }, [])

  const removeSportType = React.useCallback((sport: string) => {
    setConfig((prev) => ({
      ...prev,
      sportsTypes: prev.sportsTypes.filter((s) => s !== sport),
    }))
  }, [])

  // Surfaces
  const addSurface = React.useCallback((surface: string) => {
    setConfig((prev) => ({
      ...prev,
      surfaces: [...prev.surfaces, surface],
    }))
  }, [])

  const removeSurface = React.useCallback((surface: string) => {
    setConfig((prev) => ({
      ...prev,
      surfaces: prev.surfaces.filter((s) => s !== surface),
    }))
  }, [])

  // Services
  const addService = React.useCallback((service: string) => {
    setConfig((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }))
  }, [])

  const removeService = React.useCallback((service: string) => {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== service),
    }))
  }, [])

  // Payment methods
  const togglePaymentMethod = React.useCallback((methodName: string) => {
    setConfig((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) =>
        pm.name === methodName ? { ...pm, enabled: !pm.enabled } : pm
      ),
    }))
  }, [])

  // Reservation settings
  const updateReservationSettings = React.useCallback(
    (
      settings: Partial<
        Pick<
          GeneralConfig,
          | 'minAdvanceHours'
          | 'maxAdvanceDays'
          | 'defaultCancellationHours'
          | 'defaultRefundPercentage'
          | 'defaultToleranceMinutes'
        >
      >
    ) => {
      setConfig((prev) => ({
        ...prev,
        ...settings,
      }))
    },
    []
  )

  // Notifications
  const toggleNotifications = React.useCallback((type: 'email' | 'sms' | 'push') => {
    const key = `${type}Notifications` as const
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

  // Save all
  const saveConfig = React.useCallback(() => {
    setSaving(true)
    setTimeout(() => {
      setConfig((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin',
      }))
      setSaving(false)
    }, 500)
  }, [])

  return {
    config,
    loading,
    saving,
    addCity,
    removeCity,
    addSportType,
    removeSportType,
    addSurface,
    removeSurface,
    addService,
    removeService,
    togglePaymentMethod,
    updateReservationSettings,
    toggleNotifications,
    saveConfig,
  }
}
