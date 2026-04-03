'use client'

import * as React from 'react'
import { Dialog } from './dialog'
import type { UserRole } from '../types'

interface ChangeRoleModalProps {
  open: boolean
  onClose: () => void
  userName: string
  currentRole: UserRole
  onConfirm: (newRole: UserRole) => void
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: 'user', label: 'Usuario', description: 'Jugador estándar - Puede reservar y reseñar' },
  { value: 'owner', label: 'Owner', description: 'Dueño de canchas - Puede gestionar sus venues' },
  { value: 'admin', label: 'Admin', description: 'Super-admin - Acceso completo a la plataforma' },
]

export function ChangeRoleModal({
  open,
  onClose,
  userName,
  currentRole,
  onConfirm,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(currentRole)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setSelectedRole(currentRole)
    }
  }, [open, currentRole])

  const handleConfirm = async () => {
    if (selectedRole === currentRole) {
      onClose()
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm(selectedRole)
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Cambiar Rol"
      description={`Cambiar rol de ${userName}`}
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
            disabled={isLoading || selectedRole === currentRole}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Selecciona el nuevo rol para este usuario:</p>

        {ROLE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`border-input bg-background hover:bg-accent flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              selectedRole === option.value ? 'border-primary bg-primary/5 ring-primary ring-1' : ''
            }`}
          >
            <input
              type="radio"
              name="role"
              value={option.value}
              checked={selectedRole === option.value}
              onChange={() => setSelectedRole(option.value)}
              className="text-primary mt-0.5 h-4 w-4"
            />
            <div>
              <p className="font-medium">{option.label}</p>
              <p className="text-muted-foreground text-sm">{option.description}</p>
            </div>
          </label>
        ))}

        {selectedRole !== currentRole && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Atención:</strong> Al cambiar el rol, los permisos del usuario se modificarán
              inmediatamente.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  )
}
