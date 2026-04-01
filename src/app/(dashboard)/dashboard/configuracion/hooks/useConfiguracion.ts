'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type {
  UsuarioConfig,
  NegocioConfig,
  PagosConfig,
  PoliticasConfig,
  NotificacionesConfig,
  UsuarioSistema,
  SesionActiva,
  RolUsuario,
  ConfigSection,
  UseConfiguracionReturn,
} from '../types'
import {
  mockUsuarioConfig,
  mockNegocioConfig,
  mockPagosConfig,
  mockPoliticasConfig,
  mockNotificacionesConfig,
  mockUsuarios,
  mockSesiones,
} from '../mock-data'

export function useConfiguracion(): UseConfiguracionReturn {
  // Estados
  const [usuarioConfig, setUsuarioConfig] = useState<UsuarioConfig>(mockUsuarioConfig)
  const [negocioConfig, setNegocioConfig] = useState<NegocioConfig>(mockNegocioConfig)
  const [pagosConfig, setPagosConfig] = useState<PagosConfig>(mockPagosConfig)
  const [politicasConfig, setPoliticasConfig] = useState<PoliticasConfig>(mockPoliticasConfig)
  const [notificacionesConfig, setNotificacionesConfig] =
    useState<NotificacionesConfig>(mockNotificacionesConfig)
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>(mockUsuarios)
  const [sesiones, setSesiones] = useState<SesionActiva[]>(mockSesiones)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<ConfigSection>('perfil')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // ==========================================
  // ACCIONES - PERFIL
  // ==========================================
  const updateUsuarioConfig = useCallback(async (data: Partial<UsuarioConfig>) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUsuarioConfig((prev) => ({ ...prev, ...data }))
    setHasUnsavedChanges(true)
    setLoading(false)
    toast.success('Perfil actualizado')
  }, [])

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Mock URL
    const url = URL.createObjectURL(file)
    setUsuarioConfig((prev) => ({ ...prev, avatarUrl: url }))
    setLoading(false)
    toast.success('Avatar actualizado')
    return url
  }, [])

  // ==========================================
  // ACCIONES - NEGOCIO
  // ==========================================
  const updateNegocioConfig = useCallback(async (data: Partial<NegocioConfig>) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setNegocioConfig((prev) => ({ ...prev, ...data }))
    setHasUnsavedChanges(true)
    setLoading(false)
    toast.success('Datos del negocio actualizados')
  }, [])

  const uploadLogo = useCallback(async (file: File): Promise<string> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const url = URL.createObjectURL(file)
    setNegocioConfig((prev) => ({ ...prev, logoUrl: url }))
    setLoading(false)
    toast.success('Logo actualizado')
    return url
  }, [])

  // ==========================================
  // ACCIONES - PAGOS
  // ==========================================
  const updatePagosConfig = useCallback(async (data: Partial<PagosConfig>) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPagosConfig((prev) => ({ ...prev, ...data }))
    setHasUnsavedChanges(true)
    setLoading(false)
    toast.success('Configuración de pagos actualizada')
  }, [])

  const connectCulqi = useCallback(async (publicKey: string, _secretKey: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPagosConfig((prev) => ({
      ...prev,
      culqiPublicKey: publicKey,
      culqiConfigured: true,
    }))
    setLoading(false)
    toast.success('Culqi conectado exitosamente')
  }, [])

  const disconnectCulqi = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPagosConfig((prev) => ({
      ...prev,
      culqiPublicKey: undefined,
      culqiConfigured: false,
    }))
    setLoading(false)
    toast.success('Culqi desconectado')
  }, [])

  // ==========================================
  // ACCIONES - POLÍTICAS
  // ==========================================
  const updatePoliticasConfig = useCallback(async (data: Partial<PoliticasConfig>) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPoliticasConfig((prev) => ({ ...prev, ...data }))
    setHasUnsavedChanges(true)
    setLoading(false)
    toast.success('Políticas actualizadas')
  }, [])

  // ==========================================
  // ACCIONES - NOTIFICACIONES
  // ==========================================
  const updateNotificacionesConfig = useCallback(async (data: Partial<NotificacionesConfig>) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setNotificacionesConfig((prev) => ({ ...prev, ...data }))
    setLoading(false)
    toast.success('Preferencias de notificación actualizadas')
  }, [])

  // ==========================================
  // ACCIONES - USUARIOS
  // ==========================================
  const invitarUsuario = useCallback(async (email: string, rol: RolUsuario) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const nuevoUsuario: UsuarioSistema = {
      id: `u-${Date.now()}`,
      nombre: email.split('@')[0],
      email,
      rol,
      activo: true,
      ultimoAcceso: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    setUsuarios((prev) => [...prev, nuevoUsuario])
    setLoading(false)
    toast.success(`Invitación enviada a ${email}`)
  }, [])

  const actualizarRolUsuario = useCallback(async (id: string, rol: RolUsuario) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)))
    setLoading(false)
    toast.success('Rol actualizado')
  }, [])

  const toggleUsuarioActivo = useCallback(async (id: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)))
    setLoading(false)
    toast.success('Estado del usuario actualizado')
  }, [])

  const eliminarUsuario = useCallback(async (id: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
    setLoading(false)
    toast.success('Usuario eliminado')
  }, [])

  // ==========================================
  // ACCIONES - SEGURIDAD
  // ==========================================
  const cambiarPassword = useCallback(async (actual: string, _nueva: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Mock: validar contraseña actual
    if (actual !== 'password123') {
      setLoading(false)
      toast.error('La contraseña actual es incorrecta')
      throw new Error('Contraseña incorrecta')
    }
    setLoading(false)
    toast.success('Contraseña actualizada exitosamente')
  }, [])

  const cerrarSesion = useCallback(async (id: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setSesiones((prev) => prev.filter((s) => s.id !== id))
    setLoading(false)
    toast.success('Sesión cerrada')
  }, [])

  const cerrarTodasSesiones = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSesiones((prev) => prev.filter((s) => s.esActual))
    setLoading(false)
    toast.success('Todas las demás sesiones han sido cerradas')
  }, [])

  // ==========================================
  // ACCIONES - AVANZADO
  // ==========================================
  const exportarConfiguracion = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const config = {
      usuario: usuarioConfig,
      negocio: negocioConfig,
      pagos: pagosConfig,
      politicas: politicasConfig,
      notificaciones: notificacionesConfig,
      exportadoEn: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pichanga-config-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
    toast.success('Configuración exportada')
  }, [usuarioConfig, negocioConfig, pagosConfig, politicasConfig, notificacionesConfig])

  const eliminarCuenta = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    toast.success('Cuenta eliminada. Redirigiendo...')
    // En producción, esto redirigiría al login
  }, [])

  return {
    usuarioConfig,
    negocioConfig,
    pagosConfig,
    politicasConfig,
    notificacionesConfig,
    usuarios,
    sesiones,
    loading,
    activeSection,
    setActiveSection,
    hasUnsavedChanges,
    updateUsuarioConfig,
    uploadAvatar,
    updateNegocioConfig,
    uploadLogo,
    updatePagosConfig,
    connectCulqi,
    disconnectCulqi,
    updatePoliticasConfig,
    updateNotificacionesConfig,
    invitarUsuario,
    actualizarRolUsuario,
    toggleUsuarioActivo,
    eliminarUsuario,
    cambiarPassword,
    cerrarSesion,
    cerrarTodasSesiones,
    exportarConfiguracion,
    eliminarCuenta,
  }
}
