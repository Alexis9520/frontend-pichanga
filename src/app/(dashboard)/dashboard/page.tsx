'use client'

import * as React from 'react'
import Link from 'next/link'
import { Calendar, Plus, Phone, Eye, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui'
import { useDashboard } from './hooks/useDashboard'
import { mockCanchasEstado } from './mock-data'
import {
  HeroIngresos,
  CanchasStatusMap,
  AreaChartWidget,
  ActionCards,
  ProximasReservas,
  AlertasCard,
  AccionesRapidas,
} from './components'
import type { ActionItem } from './components/ActionCards'
import type { ProximaReserva } from './types'
import type { CanchaEstado } from './mock-data'

export default function DashboardPage() {
  const {
    metricasDia,
    resumenSemanal,
    proximasReservas,
    alertas,
    productosStockBajo,
    promocionesActivas,
    fechaActual,
    saludo,
  } = useDashboard()

  // Canchas estado
  const canchasEstado = mockCanchasEstado as CanchaEstado[]

  // Construir acciones pendientes
  const accionesPendientes: ActionItem[] = React.useMemo(() => {
    const acciones: ActionItem[] = []

    // Pagos pendientes
    if (metricasDia.montoPendienteCobrar > 0) {
      acciones.push({
        id: 'pago_pendiente',
        tipo: 'pago_pendiente',
        titulo: 'Pagos pendientes',
        descripcion: `${metricasDia.adelantosPendientes} reservas con saldo pendiente`,
        monto: metricasDia.montoPendienteCobrar,
        urgente: true,
        link: '/dashboard/reservas',
      })
    }

    // Stock bajo
    if (productosStockBajo.length > 0) {
      acciones.push({
        id: 'stock_bajo',
        tipo: 'stock_bajo',
        titulo: 'Stock bajo',
        descripcion: productosStockBajo.map((p) => p.nombre).join(', '),
        cantidad: productosStockBajo.length,
        urgente: productosStockBajo.some((p) => p.stockActual < 5),
        link: '/dashboard/inventario',
      })
    }

    // Promociones activas
    if (promocionesActivas.length > 0) {
      acciones.push({
        id: 'promocion',
        tipo: 'promocion',
        titulo: 'Promociones activas',
        descripcion: promocionesActivas[0]?.nombre || 'Ver todas las promociones',
        cantidad: promocionesActivas.length,
        link: '/dashboard/promociones',
      })
    }

    return acciones
  }, [metricasDia, productosStockBajo, promocionesActivas])

  // Handlers
  const handleActionClick = (accion: ActionItem) => {
    if (accion.link) {
      window.location.href = accion.link
    }
  }

  const handleCanchaClick = (canchaId: string) => {
    // TODO: Abrir modal de detalle de cancha
    console.log('Cancha clicked:', canchaId)
  }

  const handleLlamar = (reserva: ProximaReserva) => {
    if (reserva.clienteTelefono) {
      window.open(`tel:+51${reserva.clienteTelefono}`)
    }
  }

  const handleVerDetalle = (reserva: ProximaReserva) => {
    // TODO: Abrir modal de detalle
    console.log('Ver detalle:', reserva.id)
  }

  const handleRegistrarPago = (reserva: ProximaReserva) => {
    // TODO: Abrir modal de pago
    console.log('Registrar pago:', reserva.id)
  }

  // Datos para el gráfico de área
  const datosGrafico = resumenSemanal.porDia.map((d) => ({
    dia: d.dia,
    fecha: d.fecha,
    reservas: d.reservas,
    ingresos: d.ingresos,
    esHoy: d.fecha === new Date().toISOString().split('T')[0],
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{saludo}!</h1>
          <p className="text-muted-foreground">{fechaActual}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/calendario">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Ver calendario
            </Button>
          </Link>
          <Link href="/dashboard/reservas">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva reserva
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero de ingresos */}
      <HeroIngresos
        ingresosHoy={metricasDia.ingresosHoy}
        ingresosAyer={metricasDia.ingresosAyer}
        ingresosCanchas={metricasDia.ingresosHoy - metricasDia.ventasExtrasHoy}
        ingresosExtras={metricasDia.ventasExtrasHoy}
        reservasHoy={metricasDia.reservasHoy}
        ocupacionActual={metricasDia.ocupacionActual}
        slotsOcupados={Math.round((metricasDia.ocupacionActual / 100) * 23)}
        slotsTotales={23}
      />

      {/* Acciones pendientes */}
      {accionesPendientes.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Acciones Pendientes</h2>
          <ActionCards acciones={accionesPendientes} onActionClick={handleActionClick} />
        </div>
      )}

      {/* Estado de canchas */}
      <CanchasStatusMap canchas={canchasEstado} onCanchaClick={handleCanchaClick} />

      {/* Contenido en dos columnas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Próximas reservas */}
        <ProximasReservas
          reservas={proximasReservas}
          onVerTodas={() => {
            window.location.href = '/dashboard/reservas'
          }}
          onLlamar={handleLlamar}
          onVerDetalle={handleVerDetalle}
          onRegistrarPago={handleRegistrarPago}
        />

        {/* Gráfico de evolución semanal */}
        <AreaChartWidget
          datos={datosGrafico}
          comparativa={resumenSemanal.comparativaSemanaAnterior}
          totalReservas={resumenSemanal.reservasSemana}
          totalIngresos={resumenSemanal.ingresosSemana}
        />
      </div>

      {/* Fila inferior */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alertas */}
        <AlertasCard
          alertas={alertas}
          maxItems={4}
          onAlertaClick={(alerta) => {
            if (alerta.link) {
              window.location.href = alerta.link
            }
          }}
        />

        {/* Acciones rápidas */}
        <AccionesRapidas />
      </div>
    </div>
  )
}
