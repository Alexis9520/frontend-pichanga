'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Dialog } from './dialog'

interface SuspendUserModalProps {
  open: boolean
  onClose: () => void
  userName: string
  action: 'suspend' | 'activate'
  onConfirm: (reason?: string) => void
}

export function SuspendUserModal({
  open,
  onClose,
  userName,
  action,
  onConfirm,
}: SuspendUserModalProps) {
  const [reason, setReason] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setReason('')
    }
  }, [open])

  const handleConfirm = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm(action === 'suspend' ? reason : undefined)
    setIsLoading(false)
    onClose()
  }

  const isSuspend = action === 'suspend'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isSuspend ? 'Suspender Usuario' : 'Activar Usuario'}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="border-input bg-background hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (isSuspend && !reason.trim())}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              isSuspend
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isLoading
              ? isSuspend
                ? 'Suspendiendo...'
                : 'Activando...'
              : isSuspend
                ? 'Suspender'
                : 'Activar'}
          </button>
        </div>
      }
    >
      {isSuspend ? (
        <div className="space-y-4">
          <div className="bg-destructive/10 flex items-start gap-3 rounded-lg p-4">
            <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">¿Estás seguro de suspender a {userName}?</p>
              <p className="text-muted-foreground mt-1 text-sm">
                El usuario no podrá acceder a la plataforma mientras esté suspendido.
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Razón de la suspensión <span className="text-destructive">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Documenta la razón de la suspensión..."
              rows={3}
              className="border-input bg-background focus:ring-ring mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            ¿Estás seguro de activar a <strong>{userName}</strong>?
          </p>
          <p className="text-muted-foreground text-sm">
            El usuario podrá acceder nuevamente a la plataforma.
          </p>
        </div>
      )}
    </Dialog>
  )
}
