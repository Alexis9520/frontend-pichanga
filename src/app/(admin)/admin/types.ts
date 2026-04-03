// Admin Types

export type UserRole = 'user' | 'owner' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'pending_approval'

export interface AdminUser {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  registeredAt: string
  registeredVia: 'email' | 'google_oauth'
  lastActivity?: string

  // For players
  totalReservations?: number
  totalReviews?: number
  favoriteCourts?: number

  // For owners
  totalVenues?: number
  totalRevenue?: number

  // For admins
  adminActions?: number
}

export interface OwnerApplication {
  id: string
  userId: string
  user: {
    fullName: string
    email: string
    phone: string
  }
  businessName: string
  ruc: string
  businessPhone: string
  businessAddress: string
  city: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface AdminVenue {
  id: string
  name: string
  ownerId: string
  ownerName: string
  city: string
  type: string
  surface: string
  status: 'active' | 'inactive' | 'under_review' | 'rejected'
  occupancy: number
  totalReservations: number
  totalRevenue: number
  createdAt: string
  reviewedAt?: string
  rejectionReason?: string
}

// Detailed venue for approval/detail view
export interface VenueDetails {
  id: string
  name: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string

  // Basic info
  address: string
  city: string
  district: string
  coordinates: {
    lat: number
    lng: number
  }

  // Venue characteristics
  sportType: 'f5' | 'f7' | 'fulbito' | 'f11'
  surface: 'grass_synthetic' | 'grass_natural' | 'losa' | 'concreto'
  capacity: number
  services: string[]

  // Media
  photos: string[]
  description?: string

  // Pricing
  basePrice: number
  nightPrice: number
  nightStartHour: string
  dayStartHour: string
  closingHour: string

  // Schedules
  schedules: VenueSchedule[]
  timeSlots: VenueTimeSlot[]

  // Policies
  policies: {
    toleranceMinutes: number
    excessPolicy: 'lose_reservation' | 'penalty' | 'remaining_time' | 'configurable'
    minimumAdvance: number
    cancellationHours: number
    refundPercentage: number
  }

  // Promotions
  activePromotions: number

  // Inventory
  inventoryItems: number

  // Status
  status: 'active' | 'inactive' | 'under_review' | 'rejected'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string

  // Stats (for active venues)
  stats?: {
    totalReservations: number
    totalRevenue: number
    averageRating: number
    totalReviews: number
    occupancyRate: number
  }
}

export interface VenueSchedule {
  dayOfWeek: number // 0-6
  openTime: string
  closeTime: string
  isOpen: boolean
}

export interface VenueTimeSlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
  isPremium: boolean
  isActive: boolean
}

export interface VenueReviewData {
  // Checklist for approval
  hasBasicInfo: boolean
  hasPhotos: boolean
  hasCoordinates: boolean
  hasSchedules: boolean
  hasPricing: boolean
  hasPolicies: boolean

  // Validation status
  photoCount: number
  scheduleDays: number
  timeSlotCount: number

  // Issues found
  issues: string[]
}

export interface AdminReservation {
  id: string
  venueId: string
  venueName: string
  ownerId: string
  ownerName: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'partial' | 'completed' | 'refunded'
  source: 'app' | 'manual'
  hasDispute: boolean
}

// Detailed reservation for detail view
export interface ReservationDetails {
  id: string
  venueId: string
  venueName: string
  venueAddress: string
  venueCity: string
  venueType: string

  ownerId: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string

  // Client info
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string

  // Reservation details
  date: string
  startTime: string
  endTime: string
  durationHours: number

  // Pricing
  basePrice: number
  extrasTotal: number
  extras?: ReservationExtra[]
  totalPrice: number
  commissionAmount: number
  ownerRevenue: number

  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'partial' | 'completed' | 'refunded'
  paymentMethod: 'culqi' | 'cash' | 'yape' | 'plin' | 'manual'
  paymentReference?: string
  paidAt?: string

  // Origin
  source: 'app' | 'manual'
  bookedBy?: string // Name of owner/staff if manual

  // Timeline
  createdAt: string
  confirmedAt?: string
  cancelledAt?: string
  completedAt?: string
  refundRequestedAt?: string
  refundProcessedAt?: string

  // Cancellation/Refund
  cancelledBy?: 'client' | 'owner' | 'admin'
  cancellationReason?: string
  refundAmount?: number
  refundReason?: string
  refundPercentage?: number

  // Dispute
  hasDispute: boolean
  dispute?: ReservationDispute

  // Notes
  adminNotes?: string
  ownerNotes?: string
  clientNotes?: string
}

export interface ReservationExtra {
  id: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  total: number
}

export interface ReservationDispute {
  id: string
  reservationId: string
  status: 'open' | 'in_review' | 'resolved' | 'closed'

  openedBy: 'client' | 'owner'
  openedAt: string
  reason: string
  description: string

  // Evidence
  clientEvidence?: string[]
  ownerEvidence?: string[]

  // Resolution
  resolvedBy?: string // Admin ID
  resolvedAt?: string
  resolution?: 'favor_client' | 'favor_owner' | 'partial' | 'no_action'
  resolutionDetails?: string
  refundGranted?: number
  compensationGranted?: number

  // Timeline
  lastUpdateAt: string
  messages: DisputeMessage[]
}

export interface DisputeMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: 'client' | 'owner' | 'admin'
  message: string
  attachments?: string[]
  createdAt: string
}

// For filters and stats
export interface ReservationFilters {
  search?: string
  status?: AdminReservation['status'] | 'all'
  paymentStatus?: ReservationDetails['paymentStatus'] | 'all'
  source?: 'app' | 'manual' | 'all'
  dateFrom?: string
  dateTo?: string
  venueId?: string
  ownerId?: string
  hasDispute?: boolean
}

export interface ReservationStats {
  total: number
  pending: number
  confirmed: number
  inProgress: number
  completed: number
  cancelled: number
  withDisputes: number
  pendingPayment: number
  todayRevenue: number
  todayCount: number
}

export interface AdminAlert {
  id: string
  type: 'owner_application' | 'venue_review' | 'content_report' | 'reservation_dispute'
  title: string
  description: string
  count: number
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  actionUrl: string
}

export interface PlatformConfig {
  cities: string[]
  sportsTypes: string[]
  surfaces: string[]
  services: string[]
  productCategories: string[]
  paymentMethods: {
    name: string
    enabled: boolean
  }[]
  globalCommission: number
  commissionFreeDays: number
  defaultTolerance: number
  defaultCancellationHours: number
}

export interface AuditLog {
  id: string
  adminId: string
  adminName: string
  action: 'approve' | 'reject' | 'suspend' | 'activate' | 'edit' | 'delete' | 'config_change'
  targetType: 'user' | 'owner' | 'venue' | 'reservation' | 'review' | 'config'
  targetId: string
  targetName: string
  details: string
  reason?: string
  createdAt: string
}

// ============================================
// FINANCE TYPES
// ============================================

export type FinancePeriod = 'today' | 'week' | 'month' | 'year'

export interface FinanceKPIs {
  // Revenue
  totalRevenue: number
  reservationsRevenue: number
  extrasRevenue: number

  // Platform earnings
  totalCommission: number
  platformRevenue: number // Revenue minus commission to owners

  // Transaction counts
  totalReservations: number
  completedReservations: number
  cancelledReservations: number

  // Growth
  revenueGrowth: number // Percentage vs previous period
  reservationGrowth: number

  // Average
  averageReservationValue: number
  averageExtrasPerReservation: number

  // Period info
  period: FinancePeriod
  periodStart: string
  periodEnd: string
}

export interface DailyRevenue {
  date: string
  reservations: number
  extras: number
  total: number
  commission: number
  reservationCount: number
}

export interface RevenueByCity {
  city: string
  revenue: number
  commission: number
  reservationCount: number
  percentage: number
}

export interface RevenueByOwner {
  ownerId: string
  ownerName: string
  venueCount: number
  revenue: number
  commission: number
  ownerRevenue: number // After commission
  reservationCount: number
  percentage: number
  rank: number
}

export interface RevenueByVenue {
  venueId: string
  venueName: string
  ownerId: string
  ownerName: string
  city: string
  revenue: number
  commission: number
  reservationCount: number
  averageRating: number
  occupancyRate: number
  percentage: number
  rank: number
}

export interface RevenueByPaymentMethod {
  method: 'culqi' | 'cash' | 'yape' | 'plin' | 'manual'
  revenue: number
  count: number
  percentage: number
}

export interface RevenueBreakdown {
  byCity: RevenueByCity[]
  byOwner: RevenueByOwner[]
  byVenue: RevenueByVenue[]
  byPaymentMethod: RevenueByPaymentMethod[]
  byCategory: {
    category: string
    revenue: number
    count: number
    percentage: number
  }[]
}

export interface CommissionConfig {
  globalCommission: number // Percentage
  commissionFreeDays: number // Days without commission for new owners
  minimumCommission: number // Minimum commission in Soles
  specialCommissions: {
    ownerId?: string
    venueId?: string
    commission: number
    reason: string
    validUntil?: string
  }[]
}

export interface FinanceReport {
  id: string
  type: 'period' | 'owner' | 'venue' | 'city'
  period: FinancePeriod
  generatedAt: string
  generatedBy: string
  data: FinanceKPIs | RevenueByOwner[] | RevenueByVenue[] | RevenueByCity[]
  format: 'pdf' | 'csv' | 'xlsx'
}

export interface FinanceFilters {
  period: FinancePeriod
  dateFrom?: string
  dateTo?: string
  ownerId?: string
  venueId?: string
  city?: string
}

// ============================================
// MODERATION TYPES
// ============================================

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'dismissed'
export type ReportType = 'review' | 'photo' | 'user_profile' | 'venue_content'
export type ReportCategory =
  | 'offensive_content'
  | 'inappropriate'
  | 'spam'
  | 'fake_review'
  | 'harassment'
  | 'violence'
  | 'discrimination'
  | 'other'

export interface ContentReport {
  id: string
  type: ReportType
  category: ReportCategory
  status: ReportStatus

  // Reported content
  contentId: string
  contentType: 'review' | 'photo' | 'user' | 'venue'
  contentPreview: string // Text snippet or photo thumbnail URL
  contentUrl: string // Link to original content

  // Content owner
  contentOwnerId: string
  contentOwnerName: string
  contentOwnerType: 'user' | 'owner'

  // Reporter info
  reporterId: string
  reporterName: string
  reporterEmail: string
  reportedAt: string
  reason: string
  description?: string

  // Resolution
  reviewedBy?: string
  reviewedAt?: string
  resolution?: 'keep' | 'edit' | 'delete' | 'warn_user'
  resolutionNotes?: string
  editedContent?: string

  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reportCount: number // Number of times this content was reported
}

export interface ReviewForModeration {
  id: string
  venueId: string
  venueName: string
  ownerId: string
  ownerName: string

  // Reviewer
  reviewerId: string
  reviewerName: string
  reviewerEmail: string

  // Content
  rating: number // 1-5
  text: string
  photos: string[]
  createdAt: string
  updatedAt?: string

  // Status
  isPublished: boolean
  hasProfanity: boolean
  hasImages: boolean
  reportCount: number

  // Admin flags
  flaggedBy?: string
  flagReason?: string

  // Stats
  helpfulCount: number
}

export interface PhotoForModeration {
  id: string
  type: 'venue_photo' | 'review_photo' | 'user_photo'
  sourceId: string // venue id or review id
  sourceName: string
  url: string
  thumbnailUrl: string

  // Uploader
  uploaderId: string
  uploaderName: string
  uploaderType: 'owner' | 'user'

  // Status
  status: 'approved' | 'pending' | 'rejected' | 'reported'
  uploadedAt: string

  // Report info if applicable
  reportId?: string
  reportCategory?: ReportCategory
  reportCount: number
}

export interface ModerationStats {
  pendingReports: number
  pendingReviews: number
  pendingPhotos: number
  resolvedToday: number
  resolvedThisWeek: number
  averageResolutionTime: number // in hours

  // By category
  reportsByCategory: {
    category: ReportCategory
    count: number
  }[]

  // By type
  reportsByType: {
    type: ReportType
    count: number
  }[]
}

export interface ModerationFilters {
  status?: ReportStatus | 'all'
  type?: ReportType | 'all'
  category?: ReportCategory | 'all'
  priority?: 'low' | 'medium' | 'high' | 'urgent' | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
}

// ============================================
// CONFIGURATION TYPES
// ============================================

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'core' | 'payment' | 'social' | 'marketing' | 'analytics'
  updatedAt: string
  updatedBy: string
}

export interface IntegrationConfig {
  id: string
  name: string
  type: 'payment' | 'email' | 'sms' | 'analytics' | 'storage'
  enabled: boolean
  configured: boolean

  // Credentials (masked)
  apiKey?: string
  secretKey?: string
  webhookUrl?: string

  // Status
  lastChecked?: string
  status: 'connected' | 'disconnected' | 'error' | 'not_configured'
  errorMessage?: string

  // Metadata
  updatedAt: string
}

export interface MaintenanceConfig {
  enabled: boolean
  message: string
  startTime?: string
  endTime?: string
  scheduledType: 'immediate' | 'scheduled' | 'none'

  // Access control during maintenance
  allowAdmins: boolean
  allowOwners: boolean

  // Whitelist
  whitelistedIPs: string[]

  // Banner
  showBanner: boolean
  bannerMessage: string

  // Metadata
  updatedAt: string
  updatedBy: string
}

export interface GeneralConfig {
  // Location
  cities: string[]
  defaultCity: string

  // Sports
  sportsTypes: string[]
  surfaces: string[]

  // Services & Amenities
  services: string[]

  // Products
  productCategories: string[]

  // Payment
  paymentMethods: {
    name: string
    enabled: boolean
    feePercentage?: number
  }[]
  currency: string
  taxRate: number

  // Reservations
  minAdvanceHours: number
  maxAdvanceDays: number
  defaultCancellationHours: number
  defaultRefundPercentage: number
  defaultToleranceMinutes: number

  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean

  // Metadata
  updatedAt: string
  updatedBy: string
}

export interface PlatformSettings {
  general: GeneralConfig
  features: FeatureFlag[]
  integrations: IntegrationConfig[]
  maintenance: MaintenanceConfig
}

// ============================================
// AUDIT LOG TYPES
// ============================================

export type AuditAction =
  | 'approve'
  | 'reject'
  | 'suspend'
  | 'activate'
  | 'edit'
  | 'delete'
  | 'config_change'
  | 'refund'
  | 'cancel'
  | 'resolve_dispute'
  | 'login'
  | 'logout'

export type AuditTargetType =
  | 'user'
  | 'owner'
  | 'venue'
  | 'reservation'
  | 'review'
  | 'photo'
  | 'config'
  | 'dispute'

export interface AuditLogDetails {
  id: string
  adminId: string
  adminName: string
  adminEmail: string
  adminRole: 'admin' | 'super_admin'

  // Action
  action: AuditAction
  actionLabel: string // Human readable
  targetType: AuditTargetType
  targetId: string
  targetName: string

  // Details
  description: string
  reason?: string
  previousValue?: string
  newValue?: string

  // IP and device
  ipAddress: string
  userAgent: string
  device: string
  browser: string
  location?: string

  // Timestamp
  createdAt: string

  // Related data
  relatedLogs?: string[] // IDs of related logs
  metadata?: Record<string, unknown>
}

export interface AuditLogFilters {
  search?: string
  adminId?: string
  action?: AuditAction | 'all'
  targetType?: AuditTargetType | 'all'
  dateFrom?: string
  dateTo?: string
  ipSearch?: string
}

export interface AuditLogStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number

  // By action
  byAction: {
    action: AuditAction
    count: number
  }[]

  // By admin
  byAdmin: {
    adminId: string
    adminName: string
    count: number
  }[]

  // By target type
  byTargetType: {
    targetType: AuditTargetType
    count: number
  }[]
}

export interface AuditLogExport {
  format: 'csv' | 'xlsx' | 'pdf'
  filters: AuditLogFilters
  fields: string[]
  includeHeaders: boolean
}
