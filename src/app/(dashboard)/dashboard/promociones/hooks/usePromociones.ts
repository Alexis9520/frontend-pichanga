'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type {
  Promocion,
  PromocionFormData,
  PromocionesFilters,
  PromocionesStats,
  UsoPromocion,
  SugerenciaBajaDemanda,
  UsePromocionesReturn,
} from '../types'
import { mockPromociones, mockUsos, mockSugerencias, mockPromocionesStats } from '../mock-data'

const defaultFilters: PromocionesFilters = {
  search: '',
  estado: 'all',
  tipo: 'all',
  cancha: 'all',
}

export function usePromociones(): UsePromocionesReturn {
  // Estado
  const [promociones, setPromociones] = useState<Promocion[]>(mockPromociones)
  const [filters, setFiltersState] = useState<PromocionesFilters>(defaultFilters)
  const [usos, setUsos] = useState<UsoPromocion[]>(mockUsos)
  const [sugerencias, setSugerencias] = useState<SugerenciaBajaDemanda[]>(mockSugerencias)
  const [loading, setLoading] = useState(false)

  // Filtrar promociones
  const filteredPromociones = useMemo(() => {
    return promociones.filter((promo) => {
      // Búsqueda por nombre
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!promo.nombre.toLowerCase().includes(searchLower)) return false
      }

      // Filtro por estado
      if (filters.estado !== 'all' && promo.estado !== filters.estado) return false

      // Filtro por tipo
      if (filters.tipo !== 'all' && promo.tipo !== filters.tipo) return false

      // Filtro por cancha
      if (filters.cancha !== 'all' && !promo.canchasAplicables.includes(filters.cancha))
        return false

      return true
    })
  }, [promociones, filters])

  // Calcular estadísticas
  const stats = useMemo((): PromocionesStats => {
    const activas = promociones.filter((p) => p.activa && p.estado === 'activa').length
    const inactivas = promociones.filter((p) => !p.activa || p.estado === 'inactiva').length

    return {
      total: promociones.length,
      activas,
      inactivas,
      usosSemana: promociones.reduce((acc, p) => acc + p.usosSemana, 0),
      usosMes: promociones.reduce((acc, p) => acc + p.usosTotales, 0),
      ahorroClientes: promociones.reduce((acc, p) => acc + p.ahorroGenerado, 0),
      ingresosGenerados: promociones.reduce((acc, p) => acc + p.ingresosGenerados, 0),
    }
  }, [promociones])

  // CRUD - Crear
  const crearPromocion = useCallback(async (data: PromocionFormData): Promise<Promocion> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const nuevaPromocion: Promocion = {
      id: `promo-${Date.now()}`,
      ...data,
      estado: 'activa',
      activa: true,
      usosTotales: 0,
      usosSemana: 0,
      cuposUsadosHoy: 0,
      ahorroGenerado: 0,
      ingresosGenerados: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setPromociones((prev) => [...prev, nuevaPromocion])
    setLoading(false)
    toast.success('Promoción creada exitosamente')

    return nuevaPromocion
  }, [])

  // CRUD - Actualizar
  const actualizarPromocion = useCallback(
    async (id: string, data: Partial<PromocionFormData>): Promise<Promocion> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      let actualizada: Promocion | undefined

      setPromociones((prev) =>
        prev.map((promo) => {
          if (promo.id === id) {
            actualizada = { ...promo, ...data, updatedAt: new Date().toISOString() }
            return actualizada
          }
          return promo
        })
      )

      setLoading(false)
      toast.success('Promoción actualizada')

      return actualizada!
    },
    []
  )

  // CRUD - Eliminar
  const eliminarPromocion = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setPromociones((prev) => prev.filter((p) => p.id !== id))
    setLoading(false)
    toast.success('Promoción eliminada')
  }, [])

  // Toggle activa
  const toggleActiva = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    setPromociones((prev) =>
      prev.map((promo) => {
        if (promo.id === id) {
          return { ...promo, activa: !promo.activa, updatedAt: new Date().toISOString() }
        }
        return promo
      })
    )

    setLoading(false)
    toast.success('Estado actualizado')
  }, [])

  // Duplicar
  const duplicarPromocion = useCallback(
    async (id: string): Promise<Promocion> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const original = promociones.find((p) => p.id === id)
      if (!original) throw new Error('Promoción no encontrada')

      const duplicada: Promocion = {
        ...original,
        id: `promo-${Date.now()}`,
        nombre: `${original.nombre} (copia)`,
        usosTotales: 0,
        usosSemana: 0,
        cuposUsadosHoy: 0,
        ahorroGenerado: 0,
        ingresosGenerados: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setPromociones((prev) => [...prev, duplicada])
      setLoading(false)
      toast.success('Promoción duplicada')

      return duplicada
    },
    [promociones]
  )

  // Usos
  const getUsosByPromocion = useCallback(
    (promocionId: string): UsoPromocion[] => {
      return usos.filter((u) => u.promocionId === promocionId)
    },
    [usos]
  )

  // Sugerencias
  const descartarSugerencia = useCallback((id: string) => {
    setSugerencias((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const crearPromocionDesdeSugerencia = useCallback(
    async (sugerencia: SugerenciaBajaDemanda): Promise<Promocion> => {
      const data: PromocionFormData = {
        nombre: sugerencia.promocionSugerida.nombre,
        tipo: sugerencia.promocionSugerida.tipo,
        valor: sugerencia.promocionSugerida.valor,
        canchasAplicables: [sugerencia.canchaId],
        diasAplicables: [sugerencia.diaSemana],
        horarios: [{ inicio: sugerencia.horaInicio, fin: sugerencia.horaFin }],
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cuposMaximos: 10,
        cuposPorUsuario: 3,
        anticipacionMinima: 0,
        combinable: false,
      }

      const nueva = await crearPromocion(data)
      descartarSugerencia(sugerencia.id)

      return nueva
    },
    [crearPromocion, descartarSugerencia]
  )

  // Helpers
  const getPromocionById = useCallback(
    (id: string) => promociones.find((p) => p.id === id),
    [promociones]
  )

  const setFilters = useCallback((newFilters: Partial<PromocionesFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const calcularDescuento = useCallback((promocion: Promocion, precioBase: number): number => {
    switch (promocion.tipo) {
      case 'descuento_porcentual':
        return precioBase * (promocion.valor / 100)
      case 'precio_fijo':
        return precioBase - promocion.valor
      case 'combo_horas':
        if (promocion.horasBase && promocion.horasCobradas) {
          const precioPorHora = precioBase / promocion.horasBase
          return precioBase - precioPorHora * promocion.horasCobradas
        }
        return 0
      default:
        return 0
    }
  }, [])

  return {
    promociones: filteredPromociones,
    filters,
    loading,
    stats,
    crearPromocion,
    actualizarPromocion,
    eliminarPromocion,
    toggleActiva,
    duplicarPromocion,
    usos,
    getUsosByPromocion,
    sugerencias,
    descartarSugerencia,
    crearPromocionDesdeSugerencia,
    getPromocionById,
    setFilters,
    calcularDescuento,
  }
}
