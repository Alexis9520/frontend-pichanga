'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type {
  Cancha,
  CanchaFormData,
  CanchasFilters,
  CanchasStats,
  HorarioDia,
  PrecioSlot,
  BloqueoHorario,
  PlantillaHorario,
  UseCanchasReturn,
} from '../types'
import {
  mockCanchas,
  mockHorarios,
  mockPreciosSlots,
  mockBloqueos,
  mockPlantillas,
} from '../mock-data'

const defaultFilters: CanchasFilters = {
  search: '',
  estado: 'all',
  tipoDeporte: 'all',
  superficie: 'all',
}

export function useCanchas(): UseCanchasReturn {
  // Estado
  const [canchas, setCanchas] = useState<Cancha[]>(mockCanchas)
  const [filters, setFiltersState] = useState<CanchasFilters>(defaultFilters)
  const [horarios, setHorarios] = useState<HorarioDia[]>(mockHorarios)
  const [preciosSlots, setPreciosSlots] = useState<PrecioSlot[]>(mockPreciosSlots)
  const [bloqueos, setBloqueos] = useState<BloqueoHorario[]>(mockBloqueos)
  const [plantillas, setPlantillas] = useState<PlantillaHorario[]>(mockPlantillas)
  const [loading, setLoading] = useState(false)

  // Filtrar canchas
  const filteredCanchas = useMemo(() => {
    return canchas.filter((cancha) => {
      // Búsqueda por nombre o dirección
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchNombre = cancha.nombre.toLowerCase().includes(searchLower)
        const matchDireccion = cancha.direccion.toLowerCase().includes(searchLower)
        if (!matchNombre && !matchDireccion) return false
      }

      // Filtro por estado
      if (filters.estado !== 'all' && cancha.estado !== filters.estado) return false

      // Filtro por tipo de deporte
      if (filters.tipoDeporte !== 'all' && cancha.tipoDeporte !== filters.tipoDeporte) return false

      // Filtro por superficie
      if (filters.superficie !== 'all' && cancha.superficie !== filters.superficie) return false

      return true
    })
  }, [canchas, filters])

  // Calcular estadísticas
  const stats = useMemo((): CanchasStats => {
    const activas = canchas.filter((c) => c.estado === 'activa').length
    const inactivas = canchas.filter((c) => c.estado === 'inactiva').length
    const reservasHoy = canchas.reduce((acc, c) => acc + (c.totalReservas || 0), 0)
    const ingresosMes = canchas.reduce((acc, c) => acc + (c.ingresosMes || 0), 0)
    const ocupacionPromedio = Math.round(
      canchas.reduce((acc, c) => acc + (c.ocupacionPromedio || 0), 0) / canchas.length
    )

    return {
      total: canchas.length,
      activas,
      inactivas,
      reservasHoy,
      ingresosMes,
      ocupacionPromedio,
    }
  }, [canchas])

  // CRUD - Crear cancha
  const crearCancha = useCallback(async (data: CanchaFormData): Promise<Cancha> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const nuevaCancha: Cancha = {
      id: `cancha-${Date.now()}`,
      ...data,
      fotos: [],
      estado: 'activa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCanchas((prev) => [...prev, nuevaCancha])
    setLoading(false)
    toast.success('Cancha creada exitosamente')

    return nuevaCancha
  }, [])

  // CRUD - Actualizar cancha
  const actualizarCancha = useCallback(
    async (id: string, data: Partial<CanchaFormData>): Promise<Cancha> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      let canchaActualizada: Cancha | undefined

      setCanchas((prev) =>
        prev.map((cancha) => {
          if (cancha.id === id) {
            canchaActualizada = {
              ...cancha,
              ...data,
              updatedAt: new Date().toISOString(),
            }
            return canchaActualizada
          }
          return cancha
        })
      )

      setLoading(false)
      toast.success('Cancha actualizada')

      return canchaActualizada!
    },
    []
  )

  // CRUD - Eliminar cancha
  const eliminarCancha = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setCanchas((prev) => prev.filter((c) => c.id !== id))
    setLoading(false)
    toast.success('Cancha eliminada')
  }, [])

  // Toggle estado (activar/desactivar)
  const toggleEstado = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    setCanchas((prev) =>
      prev.map((cancha) => {
        if (cancha.id === id) {
          const nuevoEstado = cancha.estado === 'activa' ? 'inactiva' : 'activa'
          return { ...cancha, estado: nuevoEstado, updatedAt: new Date().toISOString() }
        }
        return cancha
      })
    )

    setLoading(false)
    toast.success('Estado actualizado')
  }, [])

  // Horarios - Actualizar
  const actualizarHorario = useCallback(
    async (canchaId: string, nuevosHorarios: HorarioDia[]): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHorarios((prev) => {
        const otrosHorarios = prev.filter((h) => h.canchaId !== canchaId)
        return [...otrosHorarios, ...nuevosHorarios]
      })

      setLoading(false)
      toast.success('Horarios actualizados')
    },
    []
  )

  // Precios por slot - Actualizar
  const actualizarPreciosSlots = useCallback(
    async (canchaId: string, nuevosPrecios: PrecioSlot[]): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setPreciosSlots((prev) => {
        const otrosPrecios = prev.filter((p) => p.canchaId !== canchaId)
        return [...otrosPrecios, ...nuevosPrecios]
      })

      setLoading(false)
      toast.success('Precios actualizados')
    },
    []
  )

  // Bloqueos - Crear
  const crearBloqueo = useCallback(
    async (bloqueo: Omit<BloqueoHorario, 'id' | 'createdAt'>): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const nuevoBloqueo: BloqueoHorario = {
        ...bloqueo,
        id: `bloqueo-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      setBloqueos((prev) => [...prev, nuevoBloqueo])
      setLoading(false)
      toast.success('Bloqueo creado')
    },
    []
  )

  // Bloqueos - Eliminar
  const eliminarBloqueo = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    setBloqueos((prev) => prev.filter((b) => b.id !== id))
    setLoading(false)
    toast.success('Bloqueo eliminado')
  }, [])

  // Plantillas - Crear
  const crearPlantilla = useCallback(
    async (plantilla: Omit<PlantillaHorario, 'id'>): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const nuevaPlantilla: PlantillaHorario = {
        ...plantilla,
        id: `plantilla-${Date.now()}`,
      }

      setPlantillas((prev) => [...prev, nuevaPlantilla])
      setLoading(false)
      toast.success('Plantilla creada')
    },
    []
  )

  // Helpers
  const getCanchaById = useCallback(
    (id: string) => {
      return canchas.find((c) => c.id === id)
    },
    [canchas]
  )

  const setFilters = useCallback((newFilters: Partial<CanchasFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  return {
    canchas: filteredCanchas,
    filters,
    loading,
    stats,
    crearCancha,
    actualizarCancha,
    eliminarCancha,
    toggleEstado,
    horarios,
    actualizarHorario,
    preciosSlots,
    actualizarPreciosSlots,
    bloqueos,
    crearBloqueo,
    eliminarBloqueo,
    plantillas,
    crearPlantilla,
    getCanchaById,
    setFilters,
  }
}
