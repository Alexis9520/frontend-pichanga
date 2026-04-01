'use client'

import * as React from 'react'
import { Plus, Ban, ShoppingCart, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Accion {
  id: string
  label: string
  icon: LucideIcon
  href: string
  variant?: 'default' | 'outline'
  color?: 'primary' | 'secondary'
}

interface AccionesRapidasProps {
  acciones?: Accion[]
}

const ACCIONES_DEFAULT: Accion[] = [
  {
    id: 'nueva-reserva',
    label: 'Nueva reserva manual',
    icon: Plus,
    href: '/dashboard/reservas',
    variant: 'default',
    color: 'primary',
  },
  {
    id: 'bloquear',
    label: 'Bloquear horario',
    icon: Ban,
    href: '/dashboard/calendario',
    variant: 'outline',
  },
  {
    id: 'venta',
    label: 'Registrar venta extra',
    icon: ShoppingCart,
    href: '/dashboard/inventario',
    variant: 'outline',
  },
  {
    id: 'reportes',
    label: 'Ver reportes',
    icon: FileText,
    href: '/dashboard/ingresos',
    variant: 'outline',
  },
]

export function AccionesRapidas({ acciones = ACCIONES_DEFAULT }: AccionesRapidasProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        {acciones.map((accion) => {
          const Icon = accion.icon
          return (
            <Link key={accion.id} href={accion.href}>
              <Button variant={accion.variant || 'outline'} className="w-full justify-start">
                <Icon className="mr-2 h-4 w-4" />
                {accion.label}
              </Button>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
