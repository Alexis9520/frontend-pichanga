'use client'

import * as React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg">
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {variant === 'destructive' && (
              <div className="bg-destructive/10 rounded-full p-2">
                <AlertTriangle className="text-destructive h-5 w-5" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold">{title}</h2>
              {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t p-4">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm()
            }}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing confirm dialog state
export function useConfirmDialog() {
  const [open, setOpen] = React.useState(false)
  const [config, setConfig] = React.useState<Omit<
    ConfirmDialogProps,
    'open' | 'onOpenChange'
  > | null>(null)

  const confirm = React.useCallback(
    (options: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
      setConfig(options)
      setOpen(true)
    },
    []
  )

  const dialogProps: ConfirmDialogProps = {
    open,
    onOpenChange: setOpen,
    title: config?.title || '',
    description: config?.description,
    confirmLabel: config?.confirmLabel,
    cancelLabel: config?.cancelLabel,
    onConfirm: config?.onConfirm || (() => {}),
    variant: config?.variant,
    loading: config?.loading,
  }

  return { confirm, dialogProps }
}
