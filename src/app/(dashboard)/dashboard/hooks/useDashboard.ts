'use client'

import { useState, useCallback, useMemo } from 'react'
import type {
  MetricasDia,
  ResumenSemanal,
  ResumenMes,
  ProximaReserva,
  Alerta,
  ProductoStockBajo,
  PromocionActiva,
  UseDashboardReturn,
} from '../types'
import {
  mockMetricasDia,
  mockResumenSemanal,
  mockResumenMes,
  mockProximasReservas,
  mockAlertas,
  mockProductosStockBajo,
  mockPromocionesActivas,
} from '../mock-data'

// Helper para obtener saludo según hora
const getSaludo = () => {
  const hora = new Date().getHours()
  if (hora < 12) return '¡Buenos días'
  if (hora < 18) return '¡Buenas tardes'
  return '¡Buenas noches'
}

// Helper para formatear fecha
const getFechaFormateada = () => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  const hoy = new Date()
  return `${dias[hoy.getDay()]} ${hoy.getDate()} de ${meses[hoy.getMonth()]}, ${hoy.getFullYear()}`
}

export function useDashboard(): UseDashboardReturn {
  const [loading, setLoading] = useState(false)

  // Métricas (en producción vendrían de API)
  const metricasDia = useMemo(() => mockMetricasDia, [])
  const resumenSemanal = useMemo(() => mockResumenSemanal, [])
  const resumenMes = useMemo(() => mockResumenMes, [])

  // Datos
  const proximasReservas = useMemo(() => mockProximasReservas, [])
  const productosStockBajo = useMemo(() => mockProductosStockBajo, [])
  const promocionesActivas = useMemo(() => mockPromocionesActivas, [])

  // Alertas combinadas
  const alertas = useMemo(() => {
    // Filtrar alertas de stock solo si hay productos con stock bajo
    const alertasFiltradas = mockAlertas.filter((alerta) => {
      if (alerta.tipo === 'stock') {
        return productosStockBajo.length > 0
      }
      return true
    })
    return alertasFiltradas
  }, [productosStockBajo])

  // Fecha y saludo
  const fechaActual = useMemo(() => getFechaFormateada(), [])
  const saludo = useMemo(() => getSaludo(), [])

  // Refrescar datos
  const refrescar = useCallback(async () => {
    setLoading(true)
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
  }, [])

  return {
    metricasDia,
    resumenSemanal,
    resumenMes,
    proximasReservas,
    alertas,
    productosStockBajo,
    promocionesActivas,
    loading,
    fechaActual,
    saludo,
    refrescar,
  }
}
