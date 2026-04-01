# 🏟️ Pichanga Dashboard

Sistema de gestión web para dueños de canchas de fútbol. Parte del proyecto **Pichanga Dual**.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) con App Router
- **Runtime:** [Bun](https://bun.sh/) (también compatible con npm/pnpm/yarn)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) strict mode
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) con design system custom
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Gráficos:** [Recharts](https://recharts.org/)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/       # Rutas del dashboard (protegidas)
│   │   ├── canchas/       # Gestión de canchas
│   │   ├── reservas/      # Sistema de reservas
│   │   ├── calendario/    # Vista calendario
│   │   ├── promociones/   # Ofertas y promociones
│   │   ├── inventario/    # Productos y ventas extras
│   │   ├── ingresos/      # Reportes y estadísticas
│   │   └── configuracion/ # Ajustes del negocio
│   ├── api/               # API routes
│   ├── globals.css        # Estilos globales + Tailwind
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Página inicial
│
├── components/
│   ├── ui/                # Componentes UI reutilizables
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   └── ...
│   ├── layout/            # Componentes de layout
│   │   ├── sidebar.tsx
│   │   └── mobile-sidebar.tsx
│   ├── forms/             # Componentes de formularios
│   ├── charts/            # Componentes de gráficos
│   └── cards/             # Tarjetas específicas
│
├── lib/
│   └── utils.ts           # Utilidades (cn, formatCurrency, etc.)
│
├── hooks/                 # Custom hooks
│   ├── use-media-query.ts
│   ├── use-debounce.ts
│   ├── use-local-storage.ts
│   └── use-click-outside.ts
│
├── stores/                # Zustand stores
│   ├── auth-store.ts
│   └── sidebar-store.ts
│
├── services/              # API clients
│   └── api-client.ts
│
├── types/                 # TypeScript types
│   └── index.ts
│
└── utils/                 # Utilidades adicionales
```

## 🎨 Design System

El proyecto usa un design system custom con colores inspirados en fútbol:

- **Primary:** Verde (`hsl(142 76% 36%)`) - Acciones principales
- **Secondary:** Naranja (`hsl(15 100% 63%)`) - Acentos y warnings
- **Background:** Crema claro / Verde oscuro (dark mode)
- **Border radius:** 1.25rem (20px)

### Variables CSS

```css
--primary: hsl(142 76% 36%);
--secondary: hsl(15 100% 63%);
--background: hsl(45 30% 98%);
--foreground: hsl(150 60% 5%);
```

## 🛠️ Instalación

### Con Bun (recomendado)

```bash
# Instalar Bun si no lo tienes
curl -fsSL https://bun.sh/install | bash

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev
```

### Con npm

```bash
npm install
npm run dev
```

### Con pnpm

```bash
pnpm install
pnpm dev
```

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo con Turbopack |
| `bun run build` | Build de producción |
| `bun run start` | Iniciar servidor de producción |
| `bun run lint` | Ejecutar ESLint |
| `bun run lint:fix` | Corregir errores de linting |
| `bun run typecheck` | Verificar tipos de TypeScript |
| `bun run format` | Formatear código con Prettier |

## 🔐 Variables de Entorno

Crea un archivo `.env.local` basándote en `.env.example`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Culqi (Pagos)
CULQI_PUBLIC_KEY=
CULQI_SECRET_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 🧩 Componentes UI

### Button

```tsx
import { Button } from '@/components/ui'

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button isLoading>Loading...</Button>
```

### Input

```tsx
import { Input } from '@/components/ui'

<Input placeholder="Email" leftIcon={<Mail />} />
<Input error="Campo requerido" />
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from '@/components/ui'

<Badge variant="success">Activo</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="destructive">Error</Badge>
```

## 🎯 Funcionalidades por Módulo

### 📊 Dashboard
- Métricas del día/semana/mes
- Próximas reservas
- Acciones rápidas
- Alertas importantes

### 🏟️ Canchas
- CRUD de canchas
- Configuración de horarios y precios
- Servicios disponibles
- Estados (activa/inactiva)

### 📅 Reservas
- Lista de reservas con filtros
- Crear reserva manual
- Estados de pago
- Historial completo

### 📆 Calendario
- Vista mensual
- Reservas por día
- Navegación intuitiva

### 🎫 Promociones
- Crear/editar promociones
- Tipos: descuento %, precio fijo, combos
- Control de cupos
- Activar/desactivar

### 📦 Inventario
- Productos y servicios
- Control de stock
- Ventas extras
- Alertas de stock bajo

### 💰 Ingresos
- Gráficos de ingresos
- Productos más vendidos
- Horarios populares
- Exportar reportes

### ⚙️ Configuración
- Perfil del dueño
- Datos del negocio
- Notificaciones
- Seguridad

## 📱 Responsive Design

- **Mobile First:** Diseño optimizado para móviles
- **Sidebar:** Colapsable en desktop, drawer en mobile
- **Tablas:** Scroll horizontal en pantallas pequeñas
- **Cards:** Grid adaptativo según el viewport

## 🌙 Dark Mode

El proyecto soporta dark mode nativo:

```tsx
// En tu layout o componente
import { useEffect } from 'react'

useEffect(() => {
  document.documentElement.classList.add('dark')
}, [])
```

## 🚀 Próximos Pasos

1. **Conectar con backend:** Configurar `NEXT_PUBLIC_API_URL`
2. **Autenticación real:** Implementar OAuth con Google
3. **Pagos:** Integrar Culqi
4. **Notificaciones:** Configurar websockets o polling
5. **PWA:** Convertir en Progressive Web App

## 📄 Licencia

Privado - Pichanga Team

---

**Hecho con 💚 para los amantes del fútbol**