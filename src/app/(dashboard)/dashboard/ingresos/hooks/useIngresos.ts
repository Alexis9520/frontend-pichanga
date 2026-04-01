'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type {
  ReservaIngreso,
  VentaExtraReporte,
  IngresosStats,
  IngresosFilters,
  IngresoPorDia,
  IngresoPorCancha,
  IngresoPorHorario,
  IngresoPorMetodoPago,
  IngresoPorCategoria,
  TopProducto,
  TopHorario,
  TendenciaMensual,
  PeriodoAnalisis,
  MetodoPago,
  UseIngresosReturn,
  RangoHorario,
} from '../types'
import { mockReservasIngreso, mockVentasExtras, mockTendenciaMensual } from '../mock-data'

const defaultFilters: IngresosFilters = {
  periodo: 'mes',
  fechaDesde: undefined,
  fechaHasta: undefined,
  canchaId: undefined,
  tipoIngreso: 'all',
  metodoPago: 'all',
}

// Helper para obtener rango de fechas según período
const getFechaRange = (periodo: PeriodoAnalisis): { desde: string; hasta: string } => {
  const hoy = new Date()
  const hasta = hoy.toISOString().split('T')[0]

  let desde: string
  switch (periodo) {
    case 'hoy':
      desde = hasta
      break
    case 'semana':
      desde = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'mes':
      desde = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'trimestre':
      desde = new Date(hoy.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'anio':
      desde = new Date(hoy.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    default:
      desde = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  return { desde, hasta }
}

// Helper para determinar rango horario
const getRangoHorario = (hora: string): RangoHorario => {
  const h = parseInt(hora.split(':')[0])
  if (h >= 6 && h < 8) return 'madrugada'
  if (h >= 8 && h < 12) return 'mañana'
  if (h >= 12 && h < 18) return 'tarde'
  return 'noche'
}

// Helper para obtener nombre del día
const getDiaNombre = (fecha: string): string => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[new Date(fecha).getDay()]
}

export function useIngresos(): UseIngresosReturn {
  const [filters, setFiltersState] = useState<IngresosFilters>(defaultFilters)
  const [loading, setLoading] = useState(false)

  // Determinar rango de fechas
  const fechaRange = useMemo(() => {
    if (filters.periodo === 'custom' && filters.fechaDesde && filters.fechaHasta) {
      return { desde: filters.fechaDesde, hasta: filters.fechaHasta }
    }
    return getFechaRange(filters.periodo)
  }, [filters.periodo, filters.fechaDesde, filters.fechaHasta])

  // Filtrar reservas por período
  const reservasFiltradas = useMemo(() => {
    return mockReservasIngreso.filter((r) => {
      if (r.fecha < fechaRange.desde || r.fecha > fechaRange.hasta) return false
      if (filters.canchaId && r.canchaId !== filters.canchaId) return false
      if (filters.metodoPago !== 'all' && r.metodoPago !== filters.metodoPago) return false
      return true
    })
  }, [fechaRange, filters.canchaId, filters.metodoPago])

  // Filtrar ventas extras por período
  const ventasExtrasFiltradas = useMemo(() => {
    return mockVentasExtras.filter((v) => {
      if (v.fecha < fechaRange.desde || v.fecha > fechaRange.hasta) return false
      if (filters.metodoPago !== 'all' && v.metodoPago !== filters.metodoPago) return false
      return true
    })
  }, [fechaRange, filters.metodoPago])

  // ==========================================
  // INGRESOS POR CANCHA (calculado primero)
  // ==========================================
  const ingresosPorCancha = useMemo((): IngresoPorCancha[] => {
    const grupos: Record<string, IngresoPorCancha> = {}

    reservasFiltradas.forEach((r) => {
      if (!grupos[r.canchaId]) {
        grupos[r.canchaId] = {
          canchaId: r.canchaId,
          canchaNombre: r.canchaNombre,
          totalReservas: 0,
          ingresosReservas: 0,
          ingresosExtras: 0,
          totalIngresos: 0,
          ocupacionPorcentaje: 0,
          ticketPromedio: 0,
          comparativaAnterior: 10,
        }
      }
      if (r.estadoPago !== 'refunded') {
        grupos[r.canchaId].totalReservas += 1
        grupos[r.canchaId].ingresosReservas += r.precioTotal
        grupos[r.canchaId].ingresosExtras += r.extrasTotal || 0
      }
    })

    return Object.values(grupos)
      .map((g) => ({
        ...g,
        totalIngresos: g.ingresosReservas + g.ingresosExtras,
        ticketPromedio:
          g.totalReservas > 0 ? (g.ingresosReservas + g.ingresosExtras) / g.totalReservas : 0,
        ocupacionPorcentaje: Math.min(85 + Math.random() * 15, 100),
      }))
      .sort((a, b) => b.totalIngresos - a.totalIngresos)
  }, [reservasFiltradas])

  // ==========================================
  // INGRESOS POR HORARIO (calculado primero)
  // ==========================================
  const ingresosPorHorario = useMemo((): IngresoPorHorario[] => {
    const grupos: Record<string, IngresoPorHorario> = {}

    reservasFiltradas.forEach((r) => {
      const key = `${r.horaInicio}-${r.horaFin}`
      if (!grupos[key]) {
        grupos[key] = {
          horaInicio: r.horaInicio,
          horaFin: r.horaFin,
          rango: getRangoHorario(r.horaInicio),
          totalReservas: 0,
          ingresos: 0,
          porcentajeOcupacion: 0,
        }
      }
      if (r.estadoPago !== 'refunded') {
        grupos[key].totalReservas += 1
        grupos[key].ingresos += r.precioTotal
      }
    })

    const maxReservas = Math.max(...Object.values(grupos).map((g) => g.totalReservas), 1)
    return Object.values(grupos)
      .map((g) => ({
        ...g,
        porcentajeOcupacion: (g.totalReservas / maxReservas) * 100,
      }))
      .sort((a, b) => b.ingresos - a.ingresos)
  }, [reservasFiltradas])

  // ==========================================
  // TOP HORARIOS
  // ==========================================
  const topHorarios = useMemo((): TopHorario[] => {
    return ingresosPorHorario.slice(0, 5).map((h) => ({
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
      reservas: h.totalReservas,
      ingresos: h.ingresos,
      porcentajePeak: h.porcentajeOcupacion,
    }))
  }, [ingresosPorHorario])

  // ==========================================
  // ESTADÍSTICAS RESUMEN (ahora puede usar los valores anteriores)
  // ==========================================
  const stats = useMemo((): IngresosStats => {
    const ingresosReservas = reservasFiltradas
      .filter((r) => r.estadoPago !== 'refunded')
      .reduce((acc, r) => acc + r.precioTotal, 0)

    const ingresosExtras = ventasExtrasFiltradas.reduce((acc, v) => acc + v.subtotal, 0)
    const ingresosTotales = ingresosReservas + ingresosExtras

    const ingresosPromociones = reservasFiltradas
      .filter((r) => r.descuentoPromo)
      .reduce((acc, r) => acc + (r.descuentoPromo || 0), 0)

    const totalReservas = reservasFiltradas.length
    const reservasCompletadas = reservasFiltradas.filter((r) => r.estadoPago === 'completed').length
    const reservasPartial = reservasFiltradas.filter((r) => r.estadoPago === 'partial').length
    const reservasCanceladas = reservasFiltradas.filter((r) => r.estadoPago === 'refunded').length
    const totalVentasExtras = ventasExtrasFiltradas.length

    const saldoPendienteTotal = reservasFiltradas
      .filter((r) => r.estadoPago === 'partial' || r.estadoPago === 'pending')
      .reduce((acc, r) => acc + r.saldoPendiente, 0)

    const ticketPromedioReserva = totalReservas > 0 ? ingresosReservas / totalReservas : 0
    const ticketPromedioExtra = totalVentasExtras > 0 ? ingresosExtras / totalVentasExtras : 0
    const ratioReservasExtras = ingresosTotales > 0 ? (ingresosReservas / ingresosTotales) * 100 : 0

    const canchaTop = ingresosPorCancha[0]
    const horarioPeakData = topHorarios[0]

    return {
      ingresosTotales,
      ingresosReservas,
      ingresosExtras,
      ingresosPromociones,
      comparativaPorcentaje: 12,
      comparativaReservas: 8,
      comparativaExtras: 15,
      totalReservas,
      reservasCompletadas,
      reservasCanceladas,
      reservasPartial,
      totalVentasExtras,
      ticketPromedioReserva,
      ticketPromedioExtra,
      saldoPendienteTotal,
      ratioReservasExtras,
      canchaTopNombre: canchaTop?.canchaNombre || '-',
      canchaTopIngresos: canchaTop?.totalIngresos || 0,
      horarioPeak: horarioPeakData
        ? `${horarioPeakData.horaInicio} - ${horarioPeakData.horaFin}`
        : '-',
      horarioPeakIngresos: horarioPeakData?.ingresos || 0,
    }
  }, [reservasFiltradas, ventasExtrasFiltradas, ingresosPorCancha, topHorarios])

  // ==========================================
  // INGRESOS POR DÍA
  // ==========================================
  const ingresosPorDia = useMemo((): IngresoPorDia[] => {
    const grupos: Record<string, IngresoPorDia> = {}

    reservasFiltradas.forEach((r) => {
      if (!grupos[r.fecha]) {
        grupos[r.fecha] = {
          fecha: r.fecha,
          diaNombre: getDiaNombre(r.fecha),
          ingresosReservas: 0,
          ingresosExtras: 0,
          totalIngresos: 0,
          totalReservas: 0,
          totalVentas: 0,
        }
      }
      if (r.estadoPago !== 'refunded') {
        grupos[r.fecha].ingresosReservas += r.precioTotal
        grupos[r.fecha].totalReservas += 1
      }
    })

    ventasExtrasFiltradas.forEach((v) => {
      if (!grupos[v.fecha]) {
        grupos[v.fecha] = {
          fecha: v.fecha,
          diaNombre: getDiaNombre(v.fecha),
          ingresosReservas: 0,
          ingresosExtras: 0,
          totalIngresos: 0,
          totalReservas: 0,
          totalVentas: 0,
        }
      }
      grupos[v.fecha].ingresosExtras += v.subtotal
      grupos[v.fecha].totalVentas += 1
    })

    return Object.values(grupos)
      .map((g) => ({ ...g, totalIngresos: g.ingresosReservas + g.ingresosExtras }))
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
  }, [reservasFiltradas, ventasExtrasFiltradas])

  // ==========================================
  // INGRESOS POR MÉTODO DE PAGO
  // ==========================================
  const ingresosPorMetodoPago = useMemo((): IngresoPorMetodoPago[] => {
    const grupos: Record<MetodoPago, { total: number; cantidad: number }> = {
      culqi: { total: 0, cantidad: 0 },
      efectivo: { total: 0, cantidad: 0 },
      tarjeta_local: { total: 0, cantidad: 0 },
      yape: { total: 0, cantidad: 0 },
      plin: { total: 0, cantidad: 0 },
    }

    reservasFiltradas.forEach((r) => {
      if (r.estadoPago !== 'refunded') {
        grupos[r.metodoPago].total += r.precioTotal
        grupos[r.metodoPago].cantidad += 1
      }
    })

    ventasExtrasFiltradas.forEach((v) => {
      grupos[v.metodoPago].total += v.subtotal
      grupos[v.metodoPago].cantidad += 1
    })

    const totalGlobal = Object.values(grupos).reduce((acc, g) => acc + g.total, 0)

    return Object.entries(grupos)
      .map(([metodo, data]) => ({
        metodo: metodo as MetodoPago,
        total: data.total,
        cantidad: data.cantidad,
        porcentaje: totalGlobal > 0 ? (data.total / totalGlobal) * 100 : 0,
      }))
      .filter((g) => g.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [reservasFiltradas, ventasExtrasFiltradas])

  // ==========================================
  // INGRESOS POR CATEGORIA EXTRA
  // ==========================================
  const ingresosPorCategoria = useMemo((): IngresoPorCategoria[] => {
    const grupos: Record<string, IngresoPorCategoria> = {}

    ventasExtrasFiltradas.forEach((v) => {
      if (!grupos[v.categoria]) {
        grupos[v.categoria] = {
          categoria: v.categoria,
          totalVentas: 0,
          ingresos: 0,
          cantidadProductos: 0,
          margenPromedio: 0,
        }
      }
      grupos[v.categoria].totalVentas += 1
      grupos[v.categoria].ingresos += v.subtotal
      grupos[v.categoria].cantidadProductos += v.cantidad
    })

    Object.values(grupos).forEach((g) => {
      const ventasCategoria = ventasExtrasFiltradas.filter((v) => v.categoria === g.categoria)
      const margenTotal = ventasCategoria.reduce((acc, v) => {
        if (v.costoUnitario && v.precioUnitario) {
          return acc + ((v.precioUnitario - v.costoUnitario) / v.precioUnitario) * 100
        }
        return acc
      }, 0)
      g.margenPromedio = ventasCategoria.length > 0 ? margenTotal / ventasCategoria.length : 0
    })

    return Object.values(grupos).sort((a, b) => b.ingresos - a.ingresos)
  }, [ventasExtrasFiltradas])

  // ==========================================
  // TOP PRODUCTOS
  // ==========================================
  const topProductos = useMemo((): TopProducto[] => {
    const grupos: Record<string, TopProducto> = {}

    ventasExtrasFiltradas.forEach((v) => {
      if (!grupos[v.productoId]) {
        grupos[v.productoId] = {
          productoId: v.productoId,
          productoNombre: v.productoNombre,
          categoria: v.categoria,
          cantidadVendida: 0,
          ingresos: 0,
          margen: 0,
        }
      }
      grupos[v.productoId].cantidadVendida += v.cantidad
      grupos[v.productoId].ingresos += v.subtotal
    })

    Object.values(grupos).forEach((g) => {
      const ventasProducto = ventasExtrasFiltradas.filter((v) => v.productoId === g.productoId)
      const margenTotal = ventasProducto.reduce((acc, v) => {
        if (v.costoUnitario && v.precioUnitario) {
          return acc + ((v.precioUnitario - v.costoUnitario) / v.precioUnitario) * 100
        }
        return acc
      }, 0)
      g.margen = ventasProducto.length > 0 ? margenTotal / ventasProducto.length : 0
    })

    return Object.values(grupos)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 10)
  }, [ventasExtrasFiltradas])

  // ==========================================
  // TOP CANCHAS
  // ==========================================
  const topCanchas = useMemo((): IngresoPorCancha[] => {
    return ingresosPorCancha.slice(0, 5)
  }, [ingresosPorCancha])

  // ==========================================
  // TENDENCIA MENSUAL
  // ==========================================
  const tendenciaMensual = useMemo((): TendenciaMensual[] => {
    return mockTendenciaMensual
  }, [])

  // ==========================================
  // HELPERS
  // ==========================================
  const setFilters = useCallback((newFilters: Partial<IngresosFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const getReservasByCancha = useCallback(
    (canchaId: string): ReservaIngreso[] =>
      reservasFiltradas.filter((r) => r.canchaId === canchaId),
    [reservasFiltradas]
  )

  const getVentasByCategoria = useCallback(
    (categoria: string): VentaExtraReporte[] =>
      ventasExtrasFiltradas.filter((v) => v.categoria === categoria),
    [ventasExtrasFiltradas]
  )

  const exportarReporte = useCallback(async (formato: 'pdf' | 'excel'): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(`Reporte exportado en formato ${formato.toUpperCase()}`)
    setLoading(false)
  }, [])

  return {
    reservas: reservasFiltradas,
    ventasExtras: ventasExtrasFiltradas,
    filters,
    loading,
    stats,
    ingresosPorDia,
    ingresosPorCancha,
    ingresosPorHorario,
    ingresosPorMetodoPago,
    ingresosPorCategoria,
    tendenciaMensual,
    topProductos,
    topHorarios,
    topCanchas,
    setFilters,
    getReservasByCancha,
    getVentasByCategoria,
    exportarReporte,
  }
}
