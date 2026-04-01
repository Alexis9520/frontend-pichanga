'use client'

import * as React from 'react'
import { Building, Camera, Save, Globe, Phone, Mail, MessageCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
} from '@/components/ui'
import type { NegocioConfig } from '../types'

interface NegocioTabProps {
  negocioConfig: NegocioConfig
  onUpdate: (data: Partial<NegocioConfig>) => Promise<void>
  onUploadLogo: (file: File) => Promise<string>
  loading: boolean
}

export function NegocioTab({ negocioConfig, onUpdate, onUploadLogo, loading }: NegocioTabProps) {
  const [formData, setFormData] = React.useState(negocioConfig)
  const [isSaving, setIsSaving] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setFormData(negocioConfig)
  }, [negocioConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onUpdate(formData)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadLogo(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Logo del negocio
          </CardTitle>
          <CardDescription>
            Este logo aparecerá en tus comprobantes y en la app móvil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Building className="text-muted-foreground h-10 w-10" />
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Camera className="mr-2 h-4 w-4" />
                {formData.logoUrl ? 'Cambiar logo' : 'Subir logo'}
              </Button>
              <p className="text-muted-foreground text-xs">PNG o JPG. Recomendado 200x200px.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información comercial */}
      <Card>
        <CardHeader>
          <CardTitle>Información comercial</CardTitle>
          <CardDescription>Datos que aparecerán en tus comprobantes de pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del negocio</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre comercial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                value={formData.ruc}
                onChange={(e) => setFormData((prev) => ({ ...prev, ruc: e.target.value }))}
                placeholder="20123456789"
                maxLength={11}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
              placeholder="Av. Los Deportes 123"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData((prev) => ({ ...prev, ciudad: e.target.value }))}
                placeholder="Huancayo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distrito">Distrito</Label>
              <Input
                id="distrito"
                value={formData.distrito}
                onChange={(e) => setFormData((prev) => ({ ...prev, distrito: e.target.value }))}
                placeholder="Huancayo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Información de contacto
          </CardTitle>
          <CardDescription>Datos de contacto para tus clientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefono">
                <Phone className="mr-1 inline h-3 w-3" />
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                placeholder="064-234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                <MessageCircle className="mr-1 inline h-3 w-3" />
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="999888777"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="mr-1 inline h-3 w-3" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="contacto@minegocio.pe"
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes sociales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Redes sociales
          </CardTitle>
          <CardDescription>Enlaces a tus redes sociales (opcional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.redesSociales.facebook || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    redesSociales: { ...prev.redesSociales, facebook: e.target.value },
                  }))
                }
                placeholder="https://facebook.com/minegocio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.redesSociales.instagram || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    redesSociales: { ...prev.redesSociales, instagram: e.target.value },
                  }))
                }
                placeholder="https://instagram.com/minegocio"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
          <CardDescription>Información adicional sobre tu negocio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del negocio</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Describe tu negocio..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horarioAtencion">Horario de atención</Label>
            <Input
              id="horarioAtencion"
              value={formData.horarioAtencion || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, horarioAtencion: e.target.value }))
              }
              placeholder="Lunes a Domingo: 6:00 AM - 11:00 PM"
            />
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
