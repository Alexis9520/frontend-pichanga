'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { Reserva, ReservaFilters, NuevaReservaFormData, ReservaPago } from '../types'
import {
  mockReservas,
  mockReservaStats,
  mockCanchas,
  mockProductos,
  mockPromociones,
  calcularPrecioReserva,
  aplicarPromocion,
} from '../mock-data'

interface UseReservasReturn {
  reservas: Reserva[]
  filteredReservas: Reserva[]
  stats: typeof mockReservaStats
  filters: ReservaFilters
  setFilters: (filters: ReservaFilters) => void
  loading: boolean
  // CRUD
  crearReserva: (data: NuevaReservaFormData) => Promise<Reserva>
  actualizarReserva: (id: string, data: Partial<Reserva>) => Promise<Reserva>
  cancelarReserva: (id: string, motivo: string, conReembolso: boolean) => Promise<void>
  // Pagos
  registrarPago: (reservaId: string, pago: Omit<ReservaPago, 'id' | 'fecha'>) => Promise<void>
  // Llegada
  marcarLlegada: (reservaId: string) => Promise<void>
  // Helpers
  getReservaById: (id: string) => Reserva | undefined
  canchas: typeof mockCanchas
  productos: typeof mockProductos
  promociones: typeof mockPromociones
}

const defaultFilters: ReservaFilters = {
  search: '',
  fechaDesde: '',
  fechaHasta: '',
  canchaId: 'all',
  estado: 'all',
  estadoPago: 'all',
  source: 'all',
  metodoPago: 'all',
}

export function useReservas(): UseReservasReturn {
  const [reservas, setReservas] = useState<Reserva[]>(mockReservas)
  const [filters, setFilters] = useState<ReservaFilters>(defaultFilters)
  const [loading, setLoading] = useState(false)

  // Filtrar reservas
  const filteredReservas = useMemo(() => {
    return reservas.filter((reserva) => {
      // Búsqueda por nombre o teléfono
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchNombre = reserva.clienteNombre.toLowerCase().includes(searchLower)
        const matchTelefono = reserva.clienteTelefono.includes(filters.search)
        if (!matchNombre && !matchTelefono) return false
      }

      // Filtro por fecha
      if (filters.fechaDesde && reserva.date < filters.fechaDesde) return false
      if (filters.fechaHasta && reserva.date > filters.fechaHasta) return false

      // Filtro por cancha
      if (filters.canchaId !== 'all' && reserva.venueId !== filters.canchaId) return false

      // Filtro por estado
      if (filters.estado !== 'all' && reserva.status !== filters.estado) return false

      // Filtro por estado de pago
      if (filters.estadoPago !== 'all' && reserva.estadoPago !== filters.estadoPago) return false

      // Filtro por origen
      if (filters.source !== 'all' && reserva.source !== filters.source) return false

      // Filtro por método de pago
      if (filters.metodoPago !== 'all') {
        const tieneMetodo = reserva.pagos.some((p) => p.metodoPago === filters.metodoPago)
        if (!tieneMetodo) return false
      }

      return true
    })
  }, [reservas, filters])

  // Crear reserva
  const crearReserva = useCallback(async (data: NuevaReservaFormData): Promise<Reserva> => {
    setLoading(true)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))

    const cancha = mockCanchas.find((c) => c.id === data.canchaId)
    if (!cancha) {
      setLoading(false)
      throw new Error('Cancha no encontrada')
    }

    const duracionNum = parseInt(data.duracion)
    const { precioBase } = calcularPrecioReserva(cancha, data.fecha, data.horaInicio, duracionNum)

    const promocion = data.promocionId
      ? mockPromociones.find((p) => p.id === data.promocionId)
      : undefined

    const { precioFinal, descuento } = aplicarPromocion(precioBase, promocion)

    // Calcular productos
    const productosReserva = data.productos
      .map((p) => {
        const producto = mockProductos.find((prod) => prod.id === p.id)
        if (!producto) return null
        return {
          id: `ep-${Date.now()}-${p.id}`,
          nombre: producto.nombre,
          cantidad: p.cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * p.cantidad,
        }
      })
      .filter(Boolean)

    const totalProductos = productosReserva.reduce((acc, p) => acc + (p?.subtotal || 0), 0)
    const totalPrice = precioFinal + totalProductos

    const horaFin = calcularHoraFin(data.horaInicio, duracionNum)

    const nuevaReserva: Reserva = {
      id: `r-${Date.now()}`,
      venueId: data.canchaId,
      venueNombre: cancha.nombre,
      date: data.fecha,
      startTime: data.horaInicio,
      endTime: horaFin,
      duracionHoras: duracionNum,
      precioBase,
      totalPrice,
      status: data.adelanto > 0 ? 'confirmed' : 'pending_payment',
      source: 'manual',
      clienteNombre: data.clienteNombre,
      clienteTelefono: data.clienteTelefono,
      clienteEmail: data.clienteEmail,
      adelantoPagado: data.adelanto || 0,
      saldoPendiente: totalPrice - (data.adelanto || 0),
      estadoPago:
        data.adelanto >= totalPrice ? 'completed' : data.adelanto > 0 ? 'partial' : 'pending',
      promocion: promocion
        ? {
            id: promocion.id,
            nombre: promocion.nombre,
            tipo: promocion.tipo,
            valor: promocion.valor,
            descuentoAplicado: descuento,
          }
        : undefined,
      productos: productosReserva as Reserva['productos'],
      pagos:
        data.adelanto > 0
          ? [
              {
                id: `pago-${Date.now()}`,
                tipoPago: data.adelanto >= totalPrice ? 'completo' : 'adelanto',
                monto: data.adelanto,
                metodoPago: data.metodoAdelanto || 'efectivo',
                fecha: new Date().toISOString(),
                registradoPor: 'Usuario actual',
              },
            ]
          : [],
      observaciones: data.observaciones,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registradoPor: 'Usuario actual',
    }

    setReservas((prev) => [nuevaReserva, ...prev])
    setLoading(false)
    toast.success('Reserva creada exitosamente')

    return nuevaReserva
  }, [])

  // Actualizar reserva
  const actualizarReserva = useCallback(
    async (id: string, data: Partial<Reserva>): Promise<Reserva> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      let reservaActualizada: Reserva | undefined

      setReservas((prev) =>
        prev.map((reserva) => {
          if (reserva.id === id) {
            reservaActualizada = { ...reserva, ...data, updatedAt: new Date().toISOString() }
            return reservaActualizada
          }
          return reserva
        })
      )

      setLoading(false)
      toast.success('Reserva actualizada')

      return reservaActualizada!
    },
    []
  )

  // Cancelar reserva
  const cancelarReserva = useCallback(
    async (id: string, motivo: string, conReembolso: boolean): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setReservas((prev) =>
        prev.map((reserva) => {
          if (reserva.id === id) {
            return {
              ...reserva,
              status: conReembolso ? 'cancelled_with_refund' : 'cancelled',
              estadoPago: conReembolso ? 'refunded' : reserva.estadoPago,
              observaciones: `${reserva.observaciones || ''}\nCancelación: ${motivo}`.trim(),
              updatedAt: new Date().toISOString(),
            }
          }
          return reserva
        })
      )

      setLoading(false)
      toast.success(conReembolso ? 'Reserva cancelada con reembolso' : 'Reserva cancelada')
    },
    []
  )

  // Registrar pago
  const registrarPago = useCallback(
    async (reservaId: string, pago: Omit<ReservaPago, 'id' | 'fecha'>): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setReservas((prev) =>
        prev.map((reserva) => {
          if (reserva.id === reservaId) {
            const nuevoPago: ReservaPago = {
              ...pago,
              id: `pago-${Date.now()}`,
              fecha: new Date().toISOString(),
            }

            const nuevosPagos = [...reserva.pagos, nuevoPago]
            const totalPagado = nuevosPagos.reduce((acc, p) => acc + p.monto, 0)
            const nuevoAdelanto =
              pago.tipoPago === 'adelanto'
                ? reserva.adelantoPagado + pago.monto
                : reserva.adelantoPagado
            const nuevoSaldo = reserva.totalPrice - totalPagado

            let nuevoEstadoPago = reserva.estadoPago
            if (totalPagado >= reserva.totalPrice) {
              nuevoEstadoPago = 'completed'
            } else if (totalPagado > 0) {
              nuevoEstadoPago = 'partial'
            }

            return {
              ...reserva,
              pagos: nuevosPagos,
              adelantoPagado: nuevoAdelanto,
              saldoPendiente: Math.max(nuevoSaldo, 0),
              estadoPago: nuevoEstadoPago,
              status:
                reserva.status === 'pending_payment' && totalPagado > 0
                  ? 'confirmed'
                  : reserva.status,
              updatedAt: new Date().toISOString(),
            }
          }
          return reserva
        })
      )

      setLoading(false)
      toast.success('Pago registrado exitosamente')
    },
    []
  )

  // Marcar llegada
  const marcarLlegada = useCallback(async (reservaId: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    setReservas((prev) =>
      prev.map((reserva) => {
        if (reserva.id === reservaId) {
          const cancha = mockCanchas.find((c) => c.id === reserva.venueId)
          const horaLlegada = new Date().toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
          })
          const [horaInicio] = reserva.startTime.split(':').map(Number)
          const [horaActual] = horaLlegada.split(':').map(Number)

          // Verificar tolerancia (simplificado)
          const diferenciaMinutos = (horaActual - horaInicio) * 60
          const dentroDeTolerancia =
            Math.abs(diferenciaMinutos) <= (cancha?.toleranciaMinutos || 15)

          return {
            ...reserva,
            horaLlegada,
            dentroDeTolerancia,
            status: 'in_progress',
            updatedAt: new Date().toISOString(),
          }
        }
        return reserva
      })
    )

    setLoading(false)
    toast.success('Llegada registrada')
  }, [])

  // Get by ID
  const getReservaById = useCallback(
    (id: string) => {
      return reservas.find((r) => r.id === id)
    },
    [reservas]
  )

  return {
    reservas,
    filteredReservas,
    stats: mockReservaStats,
    filters,
    setFilters,
    loading,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    registrarPago,
    marcarLlegada,
    getReservaById,
    canchas: mockCanchas,
    productos: mockProductos,
    promociones: mockPromociones,
  }
}

// Helper
function calcularHoraFin(horaInicio: string, duracion: number): string {
  const [horas, minutos] = horaInicio.split(':').map(Number)
  const nuevasHoras = horas + duracion
  return `${nuevasHoras.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
}
