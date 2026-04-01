'use client'

import * as React from 'react'
import { Settings, LogOut } from 'lucide-react'
import { Card, CardContent, Button } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { useConfiguracion } from './hooks/useConfiguracion'
import { SECTIONS_CONFIG } from './types'
import {
  SidebarNav,
  PerfilTab,
  NegocioTab,
  PagosFacturacionTab,
  PoliticasTab,
  NotificacionesTab,
  UsuariosTab,
  SeguridadTab,
  AvanzadoTab,
} from './components'

export default function ConfiguracionPage() {
  const { logout } = useAuthStore()
  const {
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
  } = useConfiguracion()

  const handleLogout = () => {
    logout()
  }

  const sectionConfig = SECTIONS_CONFIG[activeSection]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Configuración</h1>
        <p className="text-muted-foreground">Gestiona la configuración de tu cuenta y negocio</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="h-fit lg:col-span-1">
          <CardContent className="p-3">
            <SidebarNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
            />
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6 lg:col-span-3">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <span className="text-xl">{sectionConfig.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{sectionConfig.label}</h2>
              <p className="text-muted-foreground text-sm">{sectionConfig.description}</p>
            </div>
          </div>

          {/* Content */}
          {activeSection === 'perfil' && (
            <PerfilTab
              usuarioConfig={usuarioConfig}
              onUpdate={updateUsuarioConfig}
              onUploadAvatar={uploadAvatar}
              loading={loading}
            />
          )}

          {activeSection === 'negocio' && (
            <NegocioTab
              negocioConfig={negocioConfig}
              onUpdate={updateNegocioConfig}
              onUploadLogo={uploadLogo}
              loading={loading}
            />
          )}

          {activeSection === 'pagos' && (
            <PagosFacturacionTab
              pagosConfig={pagosConfig}
              onUpdate={updatePagosConfig}
              onConnectCulqi={connectCulqi}
              onDisconnectCulqi={disconnectCulqi}
              loading={loading}
            />
          )}

          {activeSection === 'politicas' && (
            <PoliticasTab
              politicasConfig={politicasConfig}
              onUpdate={updatePoliticasConfig}
              loading={loading}
            />
          )}

          {activeSection === 'notificaciones' && (
            <NotificacionesTab
              notificacionesConfig={notificacionesConfig}
              onUpdate={updateNotificacionesConfig}
              loading={loading}
            />
          )}

          {activeSection === 'usuarios' && (
            <UsuariosTab
              usuarios={usuarios}
              onInvitar={invitarUsuario}
              onActualizarRol={actualizarRolUsuario}
              onToggleActivo={toggleUsuarioActivo}
              onEliminar={eliminarUsuario}
              loading={loading}
            />
          )}

          {activeSection === 'seguridad' && (
            <SeguridadTab
              sesiones={sesiones}
              onCambiarPassword={cambiarPassword}
              onCerrarSesion={cerrarSesion}
              onCerrarTodasSesiones={cerrarTodasSesiones}
              loading={loading}
            />
          )}

          {activeSection === 'avanzado' && (
            <AvanzadoTab
              onExportar={exportarConfiguracion}
              onEliminarCuenta={eliminarCuenta}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  )
}
