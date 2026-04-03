'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Settings,
  Calendar,
  CreditCard,
  ShoppingBag,
  Users,
  MapPin,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  FileText,
} from 'lucide-react'
import { useFinanceData, useCommissionConfig, useTopPerformers } from '../hooks/useAdmin'
import type { FinancePeriod, DailyRevenue, RevenueByOwner, RevenueByVenue } from '../types'
import { RevenueChart } from './components/RevenueChart'
import { CommissionConfigCard } from './components/CommissionConfigCard'
import { TopPerformersTable } from './components/TopPerformersTable'

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage with sign
function formatGrowth(value: number): { text: string; isPositive: boolean } {
  return {
    text: `${value >= 0 ? '+' : ''}${value}%`,
    isPositive: value >= 0,
  }
}

// KPI Card component
function KPICard({
  title,
  value,
  subtitle,
  growth,
  icon: Icon,
  prefix,
}: {
  title: string
  value: string | number
  subtitle?: string
  growth?: number
  icon?: React.ElementType
  prefix?: string
}) {
  const growthInfo = growth !== undefined ? formatGrowth(growth) : null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="mt-2 text-2xl font-bold">
              {prefix}
              {value}
            </p>
            {subtitle && <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>}
            {growthInfo && (
              <div
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${growthInfo.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {growthInfo.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {growthInfo.text} vs período anterior
              </div>
            )}
          </div>
          {Icon && (
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon className="text-primary h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Period selector tabs
function PeriodTabs({
  activePeriod,
  onPeriodChange,
}: {
  activePeriod: FinancePeriod
  onPeriodChange: (period: FinancePeriod) => void
}) {
  const periods: { id: FinancePeriod; label: string }[] = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'year', label: 'Año' },
  ]

  return (
    <div className="flex gap-2 border-b pb-2">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activePeriod === period.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

// City distribution bar
function CityDistributionBar({
  data,
}: {
  data: {
    city: string
    revenue: number
    commission: number
    reservationCount: number
    percentage: number
  }[]
}) {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-3">
      {data.map((city, i) => (
        <div key={city.city}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{city.city}</span>
            <span className="text-muted-foreground">
              {city.percentage}% • {formatCurrency(city.revenue)}
            </span>
          </div>
          <div className="bg-muted h-3 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${city.percentage}%`,
                backgroundColor: colors[i % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Payment method distribution
function PaymentMethodDistribution({
  data,
}: {
  data: { method: string; revenue: number; count: number; percentage: number }[]
}) {
  const methodLabels: Record<string, string> = {
    culqi: 'Culqi',
    cash: 'Efectivo',
    yape: 'Yape',
    plin: 'Plin',
    manual: 'Manual',
  }

  const methodColors: Record<string, string> = {
    culqi: 'bg-blue-500',
    cash: 'bg-green-500',
    yape: 'bg-purple-500',
    plin: 'bg-pink-500',
    manual: 'bg-gray-500',
  }

  return (
    <div className="space-y-3">
      {data.map((method) => (
        <div
          key={method.method}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${methodColors[method.method]}`} />
            <div>
              <p className="text-sm font-medium">{methodLabels[method.method]}</p>
              <p className="text-muted-foreground text-xs">{method.count} transacciones</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatCurrency(method.revenue)}</p>
            <p className="text-muted-foreground text-xs">{method.percentage}%</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminFinanzasPage() {
  const { period, kpis, dailyRevenue, breakdown, changePeriod, exportData, loading } =
    useFinanceData('month')
  const { config, saving, updateGlobalCommission, updateCommissionFreeDays, saveConfig } =
    useCommissionConfig()
  const { performers: topOwners } = useTopPerformers('owners', 5)
  const { performers: topVenues } = useTopPerformers('venues', 5)

  const [activeTab, setActiveTab] = React.useState<'overview' | 'owners' | 'venues' | 'settings'>(
    'overview'
  )
  const [showExportMenu, setShowExportMenu] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finanzas</h1>
          <p className="text-muted-foreground text-sm">Ingresos y comisiones de la plataforma</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="border-input bg-background hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          {showExportMenu && (
            <div className="bg-card absolute top-full right-0 z-10 mt-2 w-48 rounded-lg border shadow-lg">
              <button
                onClick={() => {
                  exportData('xlsx', 'kpis')
                  setShowExportMenu(false)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar KPIs (Excel)
              </button>
              <button
                onClick={() => {
                  exportData('csv', 'daily')
                  setShowExportMenu(false)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm"
              >
                <FileText className="h-4 w-4" />
                Exportar Diario (CSV)
              </button>
              <button
                onClick={() => {
                  exportData('xlsx', 'breakdown')
                  setShowExportMenu(false)
                }}
                className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm"
              >
                <PieChart className="h-4 w-4" />
                Exportar Desglose (Excel)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Period Tabs */}
      <PeriodTabs activePeriod={period} onPeriodChange={changePeriod} />

      {/* Section Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { id: 'overview', label: 'Vista General', icon: BarChart3 },
          { id: 'owners', label: 'Por Owner', icon: Users },
          { id: 'venues', label: 'Por Cancha', icon: MapPin },
          { id: 'settings', label: 'Configuración', icon: Settings },
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
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Ingresos Totales"
              value={formatCurrency(kpis.totalRevenue)}
              growth={kpis.revenueGrowth}
              icon={DollarSign}
            />
            <KPICard
              title="Comisiones"
              value={formatCurrency(kpis.totalCommission)}
              subtitle={`${config.globalCommission}% global`}
              icon={CreditCard}
            />
            <KPICard
              title="Reservas"
              value={kpis.totalReservations.toLocaleString()}
              growth={kpis.reservationGrowth}
              icon={Calendar}
            />
            <KPICard
              title="Ventas Extras"
              value={formatCurrency(kpis.extrasRevenue)}
              subtitle={`${formatCurrency(kpis.averageExtrasPerReservation)} promedio`}
              icon={ShoppingBag}
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-xs font-medium">Valor Promedio Reserva</p>
                <p className="mt-1 text-lg font-bold">
                  {formatCurrency(kpis.averageReservationValue)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-xs font-medium">Reservas Completadas</p>
                <p className="mt-1 text-lg font-bold">
                  {kpis.completedReservations.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs">
                  {Math.round((kpis.completedReservations / kpis.totalReservations) * 100)}% del
                  total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-xs font-medium">Reservas Canceladas</p>
                <p className="mt-1 text-lg font-bold text-red-600">{kpis.cancelledReservations}</p>
                <p className="text-muted-foreground text-xs">
                  {Math.round((kpis.cancelledReservations / kpis.totalReservations) * 100)}% del
                  total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <RevenueChart data={dailyRevenue} period={period} />

            {/* City Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Distribución por Ciudad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CityDistributionBar data={breakdown.byCity} />
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods & Category Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  Por Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodDistribution data={breakdown.byPaymentMethod} />
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <PieChart className="h-4 w-4" />
                  Por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {breakdown.byCategory.map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{cat.category}</p>
                        <p className="text-muted-foreground text-xs">{cat.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(cat.revenue)}</p>
                        <p className="text-muted-foreground text-xs">{cat.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Owners Tab */}
      {activeTab === 'owners' && (
        <TopPerformersTable
          type="owners"
          data={topOwners as RevenueByOwner[]}
          onExport={() => exportData('xlsx', 'breakdown')}
        />
      )}

      {/* Venues Tab */}
      {activeTab === 'venues' && (
        <TopPerformersTable
          type="venues"
          data={topVenues as RevenueByVenue[]}
          onExport={() => exportData('xlsx', 'breakdown')}
        />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <CommissionConfigCard
            config={config}
            saving={saving}
            onUpdateCommission={updateGlobalCommission}
            onUpdateFreeDays={updateCommissionFreeDays}
            onSave={saveConfig}
          />
        </div>
      )}
    </div>
  )
}
