'use client'

import * as React from 'react'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ExportarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (formato: 'pdf' | 'excel') => Promise<void>
  periodo: string
}

export function ExportarModal({ open, onOpenChange, onExport, periodo }: ExportarModalProps) {
  const [formatoSeleccionado, setFormatoSeleccionado] = React.useState<'pdf' | 'excel' | null>(null)
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    if (!formatoSeleccionado) return

    setIsExporting(true)
    try {
      await onExport(formatoSeleccionado)
      onOpenChange(false)
    } finally {
      setIsExporting(false)
    }
  }

  // Reset al cerrar
  React.useEffect(() => {
    if (!open) {
      setFormatoSeleccionado(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className="max-w-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Exportar Reporte</h2>
          <p className="text-muted-foreground text-sm">
            Genera un reporte detallado del período: {periodo}
          </p>
        </div>

        {/* Opciones de formato */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormatoSeleccionado('pdf')}
            className={cn(
              'rounded-xl border p-4 text-center transition-all',
              formatoSeleccionado === 'pdf'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div className="mb-2 flex justify-center">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg',
                  formatoSeleccionado === 'pdf' ? 'bg-primary/20' : 'bg-muted'
                )}
              >
                <FileText
                  className={cn('h-6 w-6', formatoSeleccionado === 'pdf' ? 'text-primary' : '')}
                />
              </div>
            </div>
            <p className="font-medium">PDF</p>
            <p className="text-muted-foreground mt-1 text-xs">Documento imprimible</p>
          </button>

          <button
            type="button"
            onClick={() => setFormatoSeleccionado('excel')}
            className={cn(
              'rounded-xl border p-4 text-center transition-all',
              formatoSeleccionado === 'excel'
                ? 'border-success bg-success/10'
                : 'border-border hover:border-success/50'
            )}
          >
            <div className="mb-2 flex justify-center">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg',
                  formatoSeleccionado === 'excel' ? 'bg-success/20' : 'bg-muted'
                )}
              >
                <FileSpreadsheet
                  className={cn('h-6 w-6', formatoSeleccionado === 'excel' ? 'text-success' : '')}
                />
              </div>
            </div>
            <p className="font-medium">Excel</p>
            <p className="text-muted-foreground mt-1 text-xs">Datos editables</p>
          </button>
        </div>

        {/* Contenido del reporte */}
        <Card className="bg-muted/50 p-4">
          <h4 className="mb-2 text-sm font-medium">El reporte incluirá:</h4>
          <ul className="text-muted-foreground space-y-1 text-xs">
            <li>• Resumen de ingresos totales</li>
            <li>• Desglose por reservas y ventas extras</li>
            <li>• Ingresos por cancha y horario</li>
            <li>• Top productos y horarios</li>
            <li>• Distribución por método de pago</li>
          </ul>
        </Card>

        {/* Footer */}
        <div className="border-border flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={!formatoSeleccionado || isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
