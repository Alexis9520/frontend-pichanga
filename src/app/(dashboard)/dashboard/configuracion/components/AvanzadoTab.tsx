'use client'

import * as React from 'react'
import { Download, Upload, Trash2, AlertTriangle, Info, FileJson, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'
import { Dialog, DialogContent } from '@/components/ui'

interface AvanzadoTabProps {
  onExportar: () => Promise<void>
  onEliminarCuenta: () => Promise<void>
  loading: boolean
}

export function AvanzadoTab({ onExportar, onEliminarCuenta, loading }: AvanzadoTabProps) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [deleteConfirm, setDeleteConfirm] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (deleteConfirm !== 'ELIMINAR') return
    setIsDeleting(true)
    try {
      await onEliminarCuenta()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Exportar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Exportar configuración
          </CardTitle>
          <CardDescription>Descarga una copia de seguridad de tu configuración</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            Exporta todos los datos de configuración de tu negocio: información del negocio,
            políticas, métodos de pago y preferencias. Útil para respaldo o migración.
          </p>
          <Button onClick={onExportar} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Exportar configuración
          </Button>
        </CardContent>
      </Card>

      {/* Importar (placeholder) */}
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar configuración
          </CardTitle>
          <CardDescription>Restaura una configuración previamente exportada</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            Esta funcionalidad estará disponible próximamente. Te permitirá restaurar
            configuraciones desde archivos de respaldo.
          </p>
          <Button variant="outline" disabled>
            <Upload className="mr-2 h-4 w-4" />
            Importar configuración
          </Button>
        </CardContent>
      </Card>

      {/* Info del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Información del sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Versión del sistema</p>
              <p className="font-medium">Pichanga Dashboard v1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground">Última actualización</p>
              <p className="font-medium">Marzo 2026</p>
            </div>
            <div>
              <p className="text-muted-foreground">Entorno</p>
              <p className="font-medium">Desarrollo</p>
            </div>
            <div>
              <p className="text-muted-foreground">Base de datos</p>
              <p className="font-medium">PostgreSQL 15</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zona de peligro */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona de peligro
          </CardTitle>
          <CardDescription>Acciones irreversibles sobre tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-destructive/30 bg-destructive/5 flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Eliminar cuenta</p>
              <p className="text-muted-foreground text-sm">
                Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. No se
                puede deshacer.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar cuenta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal eliminar */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent size="sm">
          <div className="mb-4">
            <h2 className="text-destructive text-lg font-bold">Eliminar cuenta</h2>
            <p className="text-muted-foreground text-sm">
              Esta acción es permanente y no se puede deshacer
            </p>
          </div>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3">
              <p className="text-sm">Se eliminarán permanentemente:</p>
              <ul className="text-muted-foreground mt-2 list-inside list-disc text-sm">
                <li>Tu perfil y configuración</li>
                <li>Todas las canchas registradas</li>
                <li>Historial de reservas</li>
                <li>Datos de inventario y ventas</li>
                <li>Promociones y configuraciones</li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">
              Escribe <strong>ELIMINAR</strong> para confirmar:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="ELIMINAR"
              className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={deleteConfirm !== 'ELIMINAR'}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar permanentemente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
