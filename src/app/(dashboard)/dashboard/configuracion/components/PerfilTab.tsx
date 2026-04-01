'use client'

import * as React from 'react'
import { User, Camera, Save } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  Avatar,
} from '@/components/ui'
import type { UsuarioConfig, Idioma, Tema } from '../types'

interface PerfilTabProps {
  usuarioConfig: UsuarioConfig
  onUpdate: (data: Partial<UsuarioConfig>) => Promise<void>
  onUploadAvatar: (file: File) => Promise<string>
  loading: boolean
}

const IDIOMAS: { value: Idioma; label: string }[] = [
  { value: 'es', label: '🇵🇪 Español' },
  { value: 'en', label: '🇺🇸 English' },
]

const TEMAS: { value: Tema; label: string }[] = [
  { value: 'light', label: '☀️ Claro' },
  { value: 'dark', label: '🌙 Oscuro' },
  { value: 'system', label: '💻 Sistema' },
]

export function PerfilTab({ usuarioConfig, onUpdate, onUploadAvatar, loading }: PerfilTabProps) {
  const [formData, setFormData] = React.useState(usuarioConfig)
  const [isSaving, setIsSaving] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setFormData(usuarioConfig)
  }, [usuarioConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onUpdate(formData)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadAvatar(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Foto de perfil
          </CardTitle>
          <CardDescription>Tu foto aparecerá en el dashboard y en los comprobantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar src={formData.avatarUrl} name={formData.nombre} size="xl" />
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Camera className="mr-2 h-4 w-4" />
                Cambiar foto
              </Button>
              <p className="text-muted-foreground text-xs">JPG, PNG o GIF. Máximo 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>Actualiza tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                placeholder="999888777"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>Configura tu idioma y tema preferido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma</Label>
              <Select
                id="idioma"
                options={IDIOMAS}
                value={formData.idioma}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, idioma: e.target.value as Idioma }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tema">Tema</Label>
              <Select
                id="tema"
                options={TEMAS}
                value={formData.tema}
                onChange={(e) => setFormData((prev) => ({ ...prev, tema: e.target.value as Tema }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón guardar */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving || loading}>
          <Save className="mr-2 h-4 w-4" />
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
