# 🎯 Admin Dashboard - Pichanga Dual

Panel de Super-Administradores para la gestión completa de la plataforma Pichanga Dual.

## 🔐 Acceso al Admin Dashboard

### Credenciales Demo

Para acceder al Admin Dashboard, usa las siguientes credenciales:

| Usuario             | Email               | Password    | Rol   |
| ------------------- | ------------------- | ----------- | ----- |
| **Admin Principal** | `admin@pichanga.pe` | `admin1234` | Admin |
| Pedro Ramos         | `owner@pichanga.pe` | `demo1234`  | Owner |
| Carlos Mendoza      | `carlos@futbol.pe`  | `cancha123` | Owner |

### Flujo de Autenticación

1. Ve a `/login`
2. Ingresa las credenciales de admin
3. El sistema detecta el rol `admin` y redirige automáticamente a `/admin`
4. Si intentas acceder a `/admin` sin autenticación, serás redirigido a `/login`

### Protección de Rutas

- El layout del admin (`src/app/(admin)/layout.tsx`) verifica que:
  - El usuario esté autenticado
  - El usuario tenga rol `admin`
- Si no cumple estas condiciones, redirige a `/login`

### Acceso desde Owner Dashboard

Si un usuario admin está logueado y visita el owner dashboard (`/dashboard`), verá un banner de acceso rápido al Admin Panel.

## 📁 Estructura del Proyecto

```
src/app/(admin)/
├── layout.tsx                    # Layout principal con sidebar
├── admin/
│   ├── page.tsx                  # Dashboard principal
│   ├── types.ts                  # Todos los tipos TypeScript
│   ├── hooks/
│   │   └── useAdmin.ts           # Hooks personalizados
│   ├── components/
│   │   ├── kpi-card.tsx
│   │   ├── alert-panel.tsx
│   │   ├── data-table.tsx
│   │   ├── dialog.tsx
│   │   ├── change-role-modal.tsx
│   │   ├── suspend-user-modal.tsx
│   │   ├── owner-approval-modal.tsx
│   │   ├── ReservationActionsModal.tsx
│   │   ├── DisputePanel.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── index.ts              # Barrel exports
│   ├── usuarios/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── owners/
│   │   └── page.tsx
│   ├── canchas/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── components/
│   │       ├── VenueApprovalModal.tsx
│   │       └── index.ts
│   ├── reservas/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── components/
│   ├── finanzas/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── RevenueChart.tsx
│   │       ├── CommissionConfigCard.tsx
│   │       ├── TopPerformersTable.tsx
│   │       └── index.ts
│   ├── moderacion/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── ReportResolutionModal.tsx
│   │       └── index.ts
│   ├── configuracion/
│   │   └── page.tsx
│   └── auditoria/
│       └── page.tsx

src/components/layout/
├── admin-sidebar.tsx
├── admin-mobile-sidebar.tsx
└── index.ts
```

## 🚀 Módulos Implementados

### 1. Dashboard Principal (`/admin`)

- KPIs en tiempo real (usuarios, owners, canchas, reservas, ingresos)
- Panel de alertas pendientes
- Tendencias semanales
- Top owners ranking

### 2. Gestión de Usuarios (`/admin/usuarios`)

- Listado con búsqueda y filtros
- Vista detalle de usuario
- Cambio de rol (user/owner/admin)
- Suspensión/activación de cuentas
- Reset de contraseña

### 3. Gestión de Owners (`/admin/owners`)

- Tabs: Pendientes / Activos
- Modal de aprobación con información del negocio
- Rechazo con razón
- Métricas por owner

### 4. Gestión de Canchas (`/admin/canchas`)

- Tabs: En Revisión / Activas / Inactivas
- Modal de aprobación con checklist completo:
  - Datos básicos
  - Fotos (mínimo 3)
  - Horarios y precios
  - Políticas
- Vista detalle con tabs
- Override de configuración

### 5. Gestión de Reservas (`/admin/reservas`)

- Tabs: Todas / Hoy / Disputas
- Filtros avanzados (estado, pago, origen, fechas)
- Vista detalle con timeline
- Acciones admin: cancelar, reembolso, completar
- Sistema de disputes completo:
  - Mensajes
  - Evidencia
  - Resolución

### 6. Finanzas (`/admin/finanzas`)

- KPIs por período (hoy, semana, mes, año)
- Gráfico de ingresos diarios
- Distribución por ciudad
- Métodos de pago
- Top performers (owners y canchas)
- Configuración de comisiones
- Exportación de reportes

### 7. Moderación (`/admin/moderacion`)

- Tabs: Reportes / Reseñas / Fotos
- Resolución de reportes:
  - Mantener contenido
  - Editar
  - Eliminar
  - Advertir usuario
- Moderación de reseñas
- Moderación de fotos

### 8. Configuración (`/admin/configuracion`)

- Tab General:
  - Ciudades
  - Tipos de deporte
  - Tipos de superficie
  - Servicios disponibles
  - Métodos de pago
  - Configuración de reservas
  - Notificaciones
- Tab Integraciones:
  - Culqi
  - SendGrid
  - Twilio
  - Google Analytics
  - AWS S3
- Tab Features:
  - Feature flags por categoría
  - Habilitar/deshabilitar
- Tab Mantenimiento:
  - Activar/desactivar
  - Programar mantenimiento
  - IPs whitelist
  - Banner de aviso

### 9. Auditoría (`/admin/auditoria`)

- Logs de todas las acciones admin
- Filtros avanzados
- Detalle completo de cada acción
- Información de dispositivo y ubicación
- Exportación (CSV, Excel, PDF)

## 🧩 Componentes Reutilizables

### UI Components

```tsx
// Loading
<LoadingSpinner size="md" text="Cargando..." />
<PageLoading text="Cargando datos..." />
<CardSkeleton />
<TableRowSkeleton columns={5} />
<KPISkeleton />

// Empty States
<EmptyState icon={Users} title="No hay usuarios" description="..." />
<NoSearchResults query="búsqueda" />
<NoReservations />
<ErrorState onRetry={() => refetch()} />

// Confirmation
const { confirm, dialogProps } = useConfirmDialog()
confirm({
  title: '¿Eliminar usuario?',
  description: 'Esta acción no se puede deshacer',
  variant: 'destructive',
  onConfirm: () => deleteUser(),
})
<ConfirmDialog {...dialogProps} />
```

### Data Display

```tsx
<KPICard
  title="Usuarios"
  value="1,234"
  subtitle="+12 hoy"
  trend={12}
  icon={Users}
/>

<DataTable
  columns={columns}
  data={users}
  pagination
  actions={[
    { label: 'Ver', icon: Eye, onClick: (row) => navigate(`/users/${row.id}`) },
  ]}
/>
```

## 🎨 Design System

### Colores (CSS Variables)

```css
--primary: #22c55e /* Verde - acciones principales */ --secondary: #f59e0b
  /* Naranja - secundario */ --destructive: #ef4444 /* Rojo - eliminar, danger */
  --background: #ffffff /* Fondo principal */ --card: #ffffff /* Fondo de cards */ --muted: #f4f4f5
  /* Elementos deshabilitados */ --sidebar: #1c1917 /* Sidebar oscuro */;
```

### Tipografía

- Font Family: Plus Jakarta Sans
- Títulos H1: 2rem (32px)
- Títulos H2: 1.5rem (24px)
- Body: 1rem (16px)
- Caption: 0.875rem (14px)

### Espaciado

- Base: 4px (0.25rem)
- gap-2: 8px
- gap-4: 16px
- gap-6: 24px
- gap-8: 32px

### Radius

- Cards: 20px (--radius-lg)
- Buttons: 18px (--radius-md)
- Badges: 16px (--radius-sm)

## 🔧 Hooks Personalizados

### useAdminUsers()

```tsx
const { users, loading, getUserById, updateUserRole, updateUserStatus } = useAdminUsers()
```

### useOwnerApplications()

```tsx
const { applications, pendingApplications, approveApplication, rejectApplication } =
  useOwnerApplications()
```

### useAdminReservations()

```tsx
const { reservations, stats, filters, setFilters, updateReservationStatus, processRefund } =
  useAdminReservations()
```

### useFinanceData()

```tsx
const { kpis, dailyRevenue, breakdown, period, changePeriod, exportData } = useFinanceData('month')
```

### useModeration()

```tsx
const { filteredReports, reviews, photos, stats, resolveReport, deleteReview } = useModeration()
```

### useAuditLogs()

```tsx
const { logs, stats, filters, setFilters, exportLogs } = useAuditLogs()
```

## 📊 Tipos Principales

```typescript
// Usuario
interface AdminUser {
  id: string
  fullName: string
  email: string
  role: 'user' | 'owner' | 'admin'
  status: 'active' | 'suspended'
  // ...
}

// Reserva
interface ReservationDetails {
  id: string
  venueName: string
  clientName: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'refunded'
  hasDispute: boolean
  // ...
}

// Finanzas
interface FinanceKPIs {
  totalRevenue: number
  totalCommission: number
  totalReservations: number
  revenueGrowth: number
  // ...
}

// Moderación
interface ContentReport {
  id: string
  type: 'review' | 'photo' | 'user_profile'
  category: 'offensive_content' | 'inappropriate' | 'spam'
  status: 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  // ...
}
```

## 🚦 Estados de Carga

### Loading States

1. **PageLoading** - Para cargas iniciales de página
2. **LoadingSpinner** - Para acciones en curso
3. **CardSkeleton** - Para cards mientras cargan
4. **TableRowSkeleton** - Para tablas mientras cargan

### Empty States

1. **EmptyState** - Genérico
2. **NoSearchResults** - Sin resultados de búsqueda
3. **NoUsers/NoReservations/etc** - Específicos por módulo
4. **ErrorState** - Con botón de retry

## 🔐 Permisos (Futuro)

```typescript
// Ejemplo de estructura de permisos
const permissions = {
  users: ['read', 'write', 'delete'],
  owners: ['read', 'approve', 'reject'],
  venues: ['read', 'approve', 'edit', 'delete'],
  reservations: ['read', 'cancel', 'refund'],
  finance: ['read', 'export'],
  moderation: ['read', 'resolve'],
  config: ['read', 'write'],
  audit: ['read', 'export'],
}
```

## 📱 Responsive Design

| Breakpoint          | Sidebar         | Header        | Content    |
| ------------------- | --------------- | ------------- | ---------- |
| Desktop (≥1024px)   | Visible fixed   | Visible fixed | Full width |
| Tablet (768-1024px) | Collapsible     | Visible       | Adjusted   |
| Mobile (<768px)     | Hidden (toggle) | Compact       | Full width |

## 🧪 Testing Checklist

- [ ] Navegación entre módulos
- [ ] Filtros y búsqueda
- [ ] Acciones CRUD
- [ ] Modales de confirmación
- [ ] Estados de loading
- [ ] Empty states
- [ ] Responsive (tablet/mobile)
- [ ] Accesibilidad (a11y)

## 📝 Notas de Implementación

1. **Mock Data**: Todos los hooks usan mock data. En producción, reemplazar con llamadas a API.
2. **Autenticación**: El layout admin debe verificar que el usuario sea admin.
3. **Paginación**: Implementada en auditoría, pendiente en otros módulos.
4. **Exportación**: Preparada para CSV/Excel/PDF, requiere implementación real.
5. **WebSockets**: Considerar para actualizaciones en tiempo real.

## 🎯 Próximos Pasos

1. Integrar con API real del backend
2. Implementar autenticación y autorización
3. Agregar tests unitarios y de integración
4. Implementar WebSockets para tiempo real
5. Optimizar bundle size
6. Agregar PWA support

---

**Versión:** 1.0.0  
**Fecha:** Abril 2026  
**Autor:** Pichanga Dual Team
