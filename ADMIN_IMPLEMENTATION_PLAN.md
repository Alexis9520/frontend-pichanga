# 🎯 Plan de Implementación - Admin Dashboard

## Pichanga Dual - Panel de Super-Administradores

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Enfoque:** UI/UX Limpia, Usable, Progressive Implementation

---

## 📐 Principios de Diseño

### Filosofía UI/UX

El Admin Dashboard debe seguir estos principios fundamentales:

| Principio                | Aplicación                                             |
| ------------------------ | ------------------------------------------------------ |
| **Less is More**         | Solo métricas donde son necesarias (Dashboard, Dinero) |
| **Progressive Disclose** | Información revelada gradualmente, no overwhelm        |
| **Clean Interfaces**     | Espaciado adecuado, jerarquía visual clara             |
| **Action-Oriented**      | Botones claros, CTAs prominentes                       |
| **Contextual Help**      | tooltips, hints donde sea necesario                    |
| **Mobile-Responsive**    | Funciona en tablet y desktop                           |

### Paleta de Colores (Using globals.css)

El admin panel usará el mismo sistema de colores definido en `globals.css`:

| Elemento       | Variable CSS    | Uso                        |
| -------------- | --------------- | -------------------------- |
| Background     | `--background`  | Páginas principales        |
| Card/Surface   | `--card`        | Contenedores, cards        |
| Primary Action | `--primary`     | Botones CTA, links activos |
| Secondary      | `--secondary`   | Botones alternativos       |
| Destructive    | `--destructive` | Eliminar, rechazar, danger |
| Muted          | `--muted`       | Texto secundario, borders  |
| Sidebar        | `--sidebar`     | Panel lateral oscuro       |

### Tipografía

| Uso           | Font Family       | Size            |
| ------------- | ----------------- | --------------- |
| Títulos H1    | Plus Jakarta Sans | 2rem / 32px     |
| Títulos H2    | Plus Jakarta Sans | 1.5rem / 24px   |
| Títulos H3    | Plus Jakarta Sans | 1.25rem / 20px  |
| Body Text     | Plus Jakarta Sans | 1rem / 16px     |
| Small/Caption | Plus Jakarta Sans | 0.875rem / 14px |
| Código/Data   | JetBrains Mono    | 0.875rem / 14px |

### Espaciado System

```css
--spacing: 0.25rem /* Base unit = 4px */ /* Usage:
  gap-2 = 8px
  gap-4 = 16px
  gap-6 = 24px
  gap-8 = 32px
  p-4 = padding 16px
  p-6 = padding 24px
*/;
```

### Radius

```css
--radius: 1.25rem /* 20px */ /* Variants:
  --radius-sm = 16px (cards pequeños)
  --radius-md = 18px (inputs, botones)
  --radius-lg = 20px (modales, containers grandes)
  --radius-xl = 24px (hero sections)
*/;
```

---

## 🏗️ Arquitectura de Layout

### Layout Principal

```
┌────────────────────────────────────────────────────────────────────┐
│                        HEADER (Fixed)                               │
│  ┌─────────┬────────────────────────────┬───────────────────────┐  │
│  │ Logo    │  Search Bar                │  Profile + Actions    │  │
│  │         │  (Search users/venues)     │  (Notifications)      │  │
│  └─────────┴────────────────────────────┴───────────────────────┘  │
├────────────┬───────────────────────────────────────────────────────┤
│            │                                                        │
│  SIDEBAR   │                    MAIN CONTENT                        │
│  (Fixed)   │                                                        │
│            │   ┌────────────────────────────────────────────────┐  │
│  ┌──────┐  │   │                                                 │  │
│  │Menu  │  │   │  Page Title                                     │  │
│  │      │  │   │  Subtitle/Breadcrumb                            │  │
│  │Dashboard│ │   │────────────────────────────────────────────────│  │
│  │Users │  │   │                                                 │  │
│  │Owners│  │   │  Content Area                                   │  │
│  │Venues│  │   │  (Cards, Tables, Forms, etc.)                   │  │
│  │Reserv│  │   │                                                 │  │
│  │Finance│ │   │                                                 │  │
│  │Moder │  │   │                                                 │  │
│  │Config│  │   │                                                 │  │
│  │Logs  │  │   │                                                 │  │
│  │      │  │   │                                                 │  │
│  └──────┘  │   └────────────────────────────────────────────────┘  │
│            │                                                        │
└────────────┴────────────────────────────────────────────────────────┘
```

### Sidebar - Navigation Items

| Sección       | Icon            | Badge (si aplica)      |
| ------------- | --------------- | ---------------------- |
| Dashboard     | LayoutDashboard | KPIs badge             |
| Usuarios      | Users           |                        |
| Owners        | UserCog         | Solicitudes pendientes |
| Canchas       | MapPin          | En revisión            |
| Reservas      | Calendar        |                        |
| Finanzas      | DollarSign      |                        |
| Moderación    | ShieldCheck     | Reportes pendientes    |
| Configuración | Settings        |                        |
| Auditoría     | FileText        |                        |

### Responsive Behavior

| Breakpoint          | Sidebar         | Header        | Content    |
| ------------------- | --------------- | ------------- | ---------- |
| Desktop (≥1024px)   | Visible fixed   | Visible fixed | Full width |
| Tablet (768-1024px) | Collapsible     | Visible       | Adjusted   |
| Mobile (<768px)     | Hidden (toggle) | Compact       | Full width |

---

## 📱 Estructura de Páginas

### 1. Dashboard Principal

**Ubicación:** `/admin/dashboard`

**Propósito:** Vista overview con KPIs esenciales

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Dashboard                                           April 2, 2026  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  📊 Resumen del Día                                            │  │
│  │                                                               │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │  │
│  │  │ Users   │ │ Owners  │ │ Venues  │ │ Reservas│ │ Ingresos│ │  │
│  │  │ 1,234   │ │ 45      │ │ 89      │ │ 156     │ │ S/45,000│ │  │
│  │  │ +12 hoy │ │ 3 pend. │ │ 2 rev.  │ │ hoy     │ │ hoy     │ │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🚨 Alertas Pendientes                                         │  │
│  │                                                               │  │
│  │  • 3 solicitudes de owner esperando aprobación                │  │
│  │  • 2 canchas en revisión                                      │  │
│  │  • 5 reportes de contenido pendientes                         │  │
│  │  • 1 dispute de reserva abierto                               │  │
│  │                                                               │  │
│  │  [Ver todas las alertas →]                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  📈 Tendencias (Últimos 7 días)                               │  │
│  │                                                               │  │
│  │  ┌─────────────────────────┐ ┌─────────────────────────────┐ │  │
│  │  │ Reservas                │ │ Ingresos                    │ │  │
│  │  │ [Line Chart]            │ │ [Bar Chart]                 │ │  │
│  │  │                         │ │                             │ │  │
│  │  │ Mo: 45  Tu: 52 ...      │ │ Mo: S/2k  Tu: S/3k ...      │ │  │
│  │  └─────────────────────────┘ └─────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🏆 Top Owners (Esta semana)                                  │  │
│  │                                                               │  │
│  │  1. Los Campeones - S/12,000                                  │  │
│  │  2. Futbol Total - S/8,500                                    │  │
│  │  3. Cancha 7 - S/6,200                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Componentes:**

- KPI Cards (5 stats esenciales)
- Alert Panel (notificaciones urgentes)
- Charts (tendencias semanales)
- Top Owners Ranking (mini leaderboard)

**NO incluye:** Gráficos complejos, métricas detalladas, analytics profundos

---

### 2. Gestión de Usuarios

**Ubicación:** `/admin/users`

**Propósito:** Listado y gestión de usuarios

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Usuarios                                           1,234 usuarios  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [🔍 Buscar por nombre/email...] [Filtrar ▼]    [+ Nuevo]     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Nombre              │ Email          │ Rol     │ Estado │ ... │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Carlos Mendoza      │ carlos@email   │ user    │ Active │ ⋮  │  │
│  │  Pedro Ramos         │ pedro@email    │ owner   │ Active │ ⋮  │  │
│  │  Admin User          │ admin@email    │ admin   │ Active │ ⋮  │  │
│  │  Juan Lopez          │ juan@email     │ user    │ Susp.  │ ⋮  │  │
│  │  ...                                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [← Prev] [1] [2] [3] ... [50] [Next →]                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Acciones por fila:**

- Ver detalle (→ página detalle)
- Editar rol
- Suspender/Activar
- Reset password

**Detalle de Usuario:** `/admin/users/[id]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  Usuario: Carlos Mendoza                                            │
│  ← Volver                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Información Personal                                          │  │
│  │                                                               │  │
│  │  Nombre: Carlos Mendoza                                       │  │
│  │  Email: carlos@email.com                                      │  │
│  │  Teléfono: +51 999 888 777                                    │  │
│  │  Rol: user                                                    │  │
│  │  Estado: Active                                               │  │
│  │  Registrado: March 15, 2026                                   │  │
│  │  Método: Google OAuth                                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Actividad                                                     │  │
│  │                                                               │  │
│  │  Reservas: 23                                                 │  │
│  │  Reseñas: 5                                                   │  │
│  │  Favoritos: 3                                                 │  │
│  │  Última actividad: April 1, 2026                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Acciones                                                      │  │
│  │                                                               │  │
│  │  [Cambiar Rol ▼]  [Suspender]  [Reset Password]              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 3. Gestión de Owners

**Ubicación:** `/admin/owners`

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Owners                                              45 owners       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────┬─────────┬─────────────────────────────────────────────┐ │
│  │ Pendientes│ Activos│ Todos                                       │ │
│  │   (3)    │  (40)  │                                             │ │
│  └─────────┴─────────┴─────────────────────────────────────────────┘ │
│                                                                      │
│  [Solicitudes Pendientes - Tab Active]                              │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Solicitante         │ Negocio       │ Ciudad   │ Fecha   │ ...│  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Roberto García      │ Cancha 5      │ Lima     │ Apr 1   │ ...│  │
│  │  María Lopez         │ Fútbol Pro    │ Arequipa│ Mar 28 │ ...│  │
│  │  Luis Torres         │ Los Campeones │ Cusco    │ Mar 25 │ ...│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Owners Activos - Tab Inactive]                                    │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Owner               │ Canchas │ Ingresos│ Estado │ ...        │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Pedro Ramos         │ 3       │ S/45,000│ Active │ ⋮          │  │
│  │  Ana Martinez        │ 2       │ S/28,000│ Active │ ⋮          │  │
│  │  ...                                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Solicitud de Owner - Modal:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Solicitud de Owner                                         [X]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Solicitante                                                   │  │
│  │                                                               │  │
│  │  Nombre: Roberto García                                       │  │
│  │  Email: roberto@email.com                                     │  │
│  │  Teléfono: +51 999 123 456                                    │  │
│  │  Fecha solicitud: April 1, 2026                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Negocio                                                       │  │
│  │                                                               │  │
│  │  Nombre: Cancha 5                                             │  │
│  │  RUC: 20123456789                                             │  │
│  │  Dirección: Av. Principal 123                                │  │
│  │  Ciudad: Lima                                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Acciones                                                      │  │
│  │                                                               │  │
│  │  [✓ Aprobar]  [✗ Rechazar]                                    │  │
│  │                                                               │  │
│  │  Si rechaza:                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Razón: [Dropdown: Info incompleta, RUC inválido, Otro] │ │  │
│  │  │ Detalle: [Textarea...]                                 │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4. Gestión de Canchas

**Ubicación:** `/admin/venues`

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Canchas                                              89 canchas    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────┬─────────┬─────────┬─────────────────────────────────────┐│
│  │ En Rev. │ Activas │ Inactiva│ Todas                                ││
│  │   (2)   │  (75)   │  (12)  │                                      ││
│  └─────────┴─────────┴─────────┴─────────────────────────────────────┘│
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [🔍 Buscar...] [Ciudad ▼] [Owner ▼] [Estado ▼]               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Cancha          │ Owner        │ Ciudad │ Estado │ Ocupación│  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Los Campeones   │ Pedro Ramos  │ Lima   │ Activa │ 78%      │  │
│  │  Fútbol Pro      │ Ana Martinez │ Arequip│ Activa │ 65%      │  │
│  │  Cancha 5        │ Roberto Gar. │ Lima   │ Review │ --       │  │
│  │  ...                                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Aprobación de Cancha - Modal:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Aprobar Cancha: Cancha 5                                   [X]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Datos Básicos                                                 │  │
│  │                                                               │  │
│  │  Nombre: Cancha 5                                             │  │
│  │  Dirección: Av. Principal 123                                │  │
│  │  Ciudad: Lima                                                 │  │
│  │  Tipo: Fútbol 5                                               │  │
│  │  Superficie: Grass sintético                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Fotos (3 mín.)                                                │  │
│  │                                                               │  │
│  │  [Foto 1] [Foto 2] [Foto 3] [Foto 4]                          │  │
│  │  ✓ 3 fotos verificadas                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Horarios & Precios                                           │  │
│  │                                                               │  │
│  │  ✓ Horarios configurados (Lun-Dom)                           │  │
│  │  ✓ Precios definidos por slot                                │  │
│  │  ✓ Políticas establecidas                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Acciones                                                      │  │
│  │                                                               │  │
│  │  [✓ Aprobar]  [✗ Rechazar]                                    │  │
│  │                                                               │  │
│  │  Si rechaza:                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Razón: [Falta fotos, Horarios no config, GPS error...] │ │  │
│  │  │ Detalle: [Textarea...]                                 │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 5. Gestión de Reservas

**Ubicación:** `/admin/reservations`

**Propósito:** Visibilidad de todas las reservas (sin métricas)

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Reservas                                            156 reservas   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [🔍 Buscar...] [Fecha ▼] [Estado ▼] [Origen ▼] [Owner ▼]    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ID       │ Cancha      │ Cliente    │ Fecha │ Estado │ Pago │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  #1234    │ Los Campeones│ Carlos    │ Apr 2 │ Confir │ Full │  │
│  │  #1235    │ Fútbol Pro  │ Manual     │ Apr 2 │ Confir │ Pend │  │
│  │  #1236    │ Cancha 5    │ Roberto    │ Apr 3 │ Cancel │ Refun│  │
│  │  ...                                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [← Prev] [1] [2] [3] ... [Next →]                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Detalle de Reserva:** `/admin/reservations/[id]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  Reserva #1234                                               [X]     │
│  ← Volver                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Estado: Confirmada                                            │  │
│  │                                                               │  │
│  │  ┌───────────────────────────────────────────────────────────┐│  │
│  │  │ Cancha                                                    ││  │
│  │  │ Los Campeones - Lima                                      ││  │
│  │  │ Owner: Pedro Ramos                                        ││  │
│  │  └───────────────────────────────────────────────────────────┘│  │
│  │                                                               │  │
│  │  ┌───────────────────────────────────────────────────────────┐│  │
│  │  │ Horario                                                   ││  │
│  │  │ Fecha: April 2, 2026                                      ││  │
│  │  │ Hora: 3:00 PM - 5:00 PM (2 horas)                        ││  │
│  │  │ Precio: S/200                                             ││  │
│  │  └───────────────────────────────────────────────────────────┘│  │
│  │                                                               │  │
│  │  ┌───────────────────────────────────────────────────────────┐│  │
│  │  │ Cliente                                                   ││  │
│  │  │ Nombre: Carlos Mendoza                                    ││  │
│  │  │ Email: carlos@email.com                                   ││  │
│  │  │ Origen: App                                               ││  │
│  │  └───────────────────────────────────────────────────────────┘│  │
│  │                                                               │  │
│  │  ┌───────────────────────────────────────────────────────────┐│  │
│  │  │ Pago                                                      ││  │
│  │  │ Estado: Completo                                          ││  │
│  │  │ Método: Culqi                                             ││  │
│  │  │ Total: S/200                                              ││  │
│  │  │ Extras: S/24 (6 gaseosas)                                 ││  │
│  │  └───────────────────────────────────────────────────────────┘│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Acciones                                                      │  │
│  │                                                               │  │
│  │  [Cancelar]  [Forzar Reembolso]                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6. Finanzas

**Ubicación:** `/admin/finance`

**Propósito:** métricas financieras (DINERO = Métricas Sí)

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Finanzas                                           April 2026      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────┬─────────┬─────────┬─────────────────────────────────────┐│
│  │ Hoy     │ Semana  │ Mes     │ Año                                  ││
│  │S/45,000 │S/280,000│S/1.2M  │                                      ││
│  └─────────┴─────────┴─────────┴─────────────────────────────────────┘│
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  💰 Ingresos Totales                                           │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────────┐│  │
│  │  │                                                             ││  │
│  │  │   [Chart de Ingresos por día - Últimos 30 días]            ││  │
│  │  │                                                             ││  │
│  │  │   Día 1  Día 5  Día 10  Día 15  Día 20  Día 25  Día 30    ││  │
│  │  │   S/2k  S/3k  S/2.5k  S/4k   S/3.5k  S/5k   S/4.5k        ││  │
│  │  │                                                             ││  │
│  │  └─────────────────────────────────────────────────────────────┘│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  📊 Desglose                                                    │  │
│  │                                                               │  │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │  │
│  │  │ Reservas      │ │ Extras        │ │ Comisiones    │        │  │
│  │  │ S/38,000      │ │ S/7,000       │ │ S/3,800       │        │  │
│  │  │ 84%           │ │ 16%           │ │ 10%           │        │  │
│  │  └───────────────┘ └───────────────┘ └───────────────┘        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🎯 Top Performers                                              │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────────┐│  │
│  │  │ Owner              │ Ingresos    │ Comisiones │ % Share    ││  │
│  │  ├─────────────────────────────────────────────────────────────┤│  │
│  │  │ Los Campeones      │ S/12,000    │ S/1,200    │ 27%        ││  │
│  │  │ Fútbol Pro         │ S/8,500     │ S/850      │ 19%        ││  │
│  │  │ Cancha 7           │ S/6,200     │ S/620      │ 14%        ││  │
│  │  │ ...                                                           ││  │
│  │  └─────────────────────────────────────────────────────────────┘│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ⚙️ Configuración de Comisión                                  │  │
│  │                                                               │  │
│  │  Comisión global: 10%                                         │  │
│  │  Días sin comisión: 0 (promoción terminada)                  │  │
│  │                                                               │  │
│  │  [Editar Comisión]                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Exportar Reporte ▼]                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Componentes:**

- KPI Cards (4 períodos)
- Line Chart (ingresos por día)
- Pie Chart (desglose)
- Table (top owners)
- Commission Settings (config)

---

### 7. Moderación

**Ubicación:** `/admin/moderation`

**Propósito:** Moderar reseñas y contenido reportado

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Moderación                                         5 pendientes    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────┬─────────┬─────────────────────────────────────────────┐ │
│  │ Reportes│ Reseñas │ Todas                                       │ │
│  │   (5)   │  (all)  │                                             │ │
│  └─────────┴─────────┴─────────────────────────────────────────────┐ │
│                                                                      │
│  [Reportes Pendientes - Tab Active]                                 │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tipo    │ Contenido       │ Reportado │ Categoría │ Fecha   │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Reseña  │ "Este lugar..." │ user1     │ Offensive │ Apr 1   │  │
│  │  Foto    │ [imagen]        │ user2     │ Inapprop. │ Mar 28 │  │
│  │  ...                                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Resolución de Reporte - Modal:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Resolver Reporte                                            [X]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Contenido Original                                            │  │
│  │                                                               │  │
│  │  Reseña de: Los Campeones                                     │  │
│  │  Rating: 2 estrellas                                          │  │
│  │  Texto: "Este lugar es terrible, el owner es un..."           │  │
│  │  Foto: [Ver foto]                                             │  │
│  │  Fecha: March 25, 2026                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Reporte                                                       │  │
│  │                                                               │  │
│  │  Reportado por: user1                                         │  │
│  │  Categoría: Contenido Offensive                               │  │
│  │  Descripción: "Lenguaje inappropriate"                        │  │
│  │  Fecha reporte: April 1, 2026                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Acción                                                        │  │
│  │                                                               │  │
│  │  [✓ Mantener]  [✎ Editar]  [✗ Eliminar]                       │  │
│  │                                                               │  │
│  │  Si editar:                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Nuevo texto: [Textarea...]                              │ │  │
│  │  │ Eliminar foto: [Checkbox]                               │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                                                               │  │
│  │  Si eliminar:                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Razón: [Textarea...]                                    │ │  │
│  │  │ Notificar usuario: [Checkbox]                           │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 8. Configuración Global

**Ubicación:** `/admin/settings`

**Propósito:** Configurar parámetros globales

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Configuración                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────┬─────────┬─────────┬─────────┬───────────────────────────┐│
│  │ General │ Integr. │ Features│ Manten. │                           ││
│  └─────────┴─────────┴─────────┴─────────┴───────────────────────────┘│
│                                                                      │
│  [General - Tab Active]                                             │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Ciudades                                                      │  │
│  │                                                               │  │
│  │  [Lima] [Arequipa] [Cusco] [Trujillo] [+ Agregar]             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tipos de Deporte                                              │  │
│  │                                                               │  │
│  │  [Fútbol 5] [Fútbol 7] [Fulbito] [+ Agregar]                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tipos de Superficie                                           │  │
│  │                                                               │  │
│  │  [Grass sintético] [Grass natural] [Losa] [Concreto]          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Servicios Disponibles                                         │  │
│  │                                                               │  │
│  │  [Estacionamiento] [Baños] [Duchas] [Iluminación] [Quincho]   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Métodos de Pago                                               │  │
│  │                                                               │  │
│  │  [Culqi ✓] [Efectivo ✓] [Yape ○] [Plin ○]                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Guardar Cambios]                                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 9. Auditoría / Logs

**Ubicación:** `/admin/logs`

**Propósito:** Ver logs de acciones admin (solo tabla, sin métricas)

**Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Auditoría                                          1,234 registros │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [Admin ▼] [Acción ▼] [Target Type ▼] [Fecha Range ▼]        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Fecha     │ Admin   │ Acción         │ Target    │ Detalles │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Apr 2     │ admin1  │ owner_approve  │ Roberto G │ [Ver]    │  │
│  │  Apr 1     │ admin1  │ venue_approve  │ Cancha 5  │ [Ver]    │  │
│  │  Mar 28    │ admin2  │ review_delete  │ reseña#45 │ [Ver]    │  │
│  │  ...                                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [← Prev] [1] [2] [3] ... [Next →]                                  │
│                                                                      │
│  [Exportar Logs ▼]                                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes Reutilizables

### KPI Card

```tsx
interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; type: 'up' | 'down' | 'neutral' }
  icon?: LucideIcon
}

// Usage:
;<KPICard title="Usuarios" value="1,234" subtitle="+12 hoy" icon={Users} />
```

### DataTable

```tsx
interface DataTableProps {
  columns: ColumnDef[]
  data: any[]
  pagination?: boolean
  filters?: FilterConfig[]
  actions?: RowAction[]
}

// Usage:
;<DataTable
  columns={[
    { header: 'Nombre', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Estado', accessor: 'status', cell: StatusBadge },
  ]}
  data={users}
  pagination
  actions={[
    { label: 'Ver', icon: Eye, onClick: (row) => navigate(`/users/${row.id}`) },
    { label: 'Editar', icon: Edit, onClick: (row) => openEditModal(row) },
  ]}
/>
```

### Status Badge

```tsx
interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'pending' | 'rejected'
}

// Variants:
// active = green
// suspended = red
// pending = yellow
// rejected = gray
```

### Modal

```tsx
interface ModalProps {
  title: string
  children: React.ReactNode
  actions?: ModalAction[]
  onClose: () => void
}

// Usage:
;<Modal title="Aprobar Owner" onClose={closeModal}>
  <OwnerApplicationDetails application={data} />
  <ModalActions>
    <Button variant="primary">Aprobar</Button>
    <Button variant="destructive">Rechazar</Button>
  </ModalActions>
</Modal>
```

### Tabs

```tsx
interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tab: string) => void
}

// Usage:
;<Tabs
  tabs={[
    { id: 'pending', label: 'Pendientes', count: 3 },
    { id: 'active', label: 'Activos', count: 40 },
    { id: 'all', label: 'Todos' },
  ]}
  activeTab="pending"
  onChange={setActiveTab}
/>
```

### Filter Bar

```tsx
interface FilterBarProps {
  search?: boolean
  filters?: Filter[]
  onFilterChange: (filters: Record<string, any>) => void
}

// Usage:
;<FilterBar
  search
  filters={[
    { id: 'status', type: 'select', options: ['active', 'suspended'] },
    { id: 'city', type: 'select', options: cities },
  ]}
  onFilterChange={handleFilter}
/>
```

---

## 📅 Etapas de Implementación

### ETAPA 1: Foundation (Semanas 1-4)

**Objetivo:** Layout base, navegación, dashboard simple

| Semana | Tasks                                        | Priority |
| ------ | -------------------------------------------- | -------- |
| 1      | Layout principal (Header, Sidebar, Content)  | High     |
| 2      | Navegación sidebar + responsive behavior     | High     |
| 3      | Dashboard básico (KPIs cards, alert panel)   | High     |
| 4      | Componentes base (KPICard, DataTable, Modal) | High     |

**Archivos a crear:**

```
src/app/admin/
  layout.tsx
  page.tsx (dashboard)
  components/
    KPICard.tsx
    DataTable.tsx
    Modal.tsx
    StatusBadge.tsx
    Tabs.tsx
    FilterBar.tsx
    Sidebar.tsx
    Header.tsx
```

---

### ETAPA 2: Gestión de Usuarios & Owners (Semanas 5-8)

**Objetivo:** CRUD usuarios, aprobación de owners

| Semana | Tasks                                       | Priority |
| ------ | ------------------------------------------- | -------- |
| 5      | Página usuarios (listado, filtros)          | High     |
| 6      | Detalle usuario + acciones (rol, suspender) | High     |
| 7      | Página owners (tabs pendientes/activos)     | High     |
| 8      | Modal aprobación/rechazo de owner           | High     |

**Archivos a crear:**

```
src/app/admin/
  users/
    page.tsx
    [id]/
      page.tsx
  owners/
    page.tsx
    components/
      OwnerApplicationModal.tsx
      OwnerDetailsCard.tsx
```

---

### ETAPA 3: Gestión de Canchas (Semanas 9-12)

**Objetivo:** CRUD canchas, aprobación, override

| Semana | Tasks                                     | Priority |
| ------ | ----------------------------------------- | -------- |
| 9      | Página canchas (tabs en-revisión/activas) | High     |
| 10     | Modal aprobación de cancha                | High     |
| 11     | Detalle cancha (ver configuración)        | Medium   |
| 12     | Override de configuración (edit)          | Medium   |

**Archivos a crear:**

```
src/app/admin/
  venues/
    page.tsx
    [id]/
      page.tsx
    components/
      VenueApprovalModal.tsx
      VenueConfigViewer.tsx
      VenueOverrideForm.tsx
```

---

### ETAPA 4: Gestión de Reservas (Semanas 13-16)

**Objotivo:** Visibilidad de reservas, acciones override

| Semana | Tasks                                        | Priority |
| ------ | -------------------------------------------- | -------- |
| 13     | Página reservas (listado, filtros avanzados) | High     |
| 14     | Detalle reserva                              | High     |
| 15     | Acciones override (cancelar, reembolso)      | High     |
| 16     | Sistema de disputes                          | Medium   |

**Archivos a crear:**

```
src/app/admin/
  reservations/
    page.tsx
    [id]/
      page.tsx
    components/
      ReservationDetails.tsx
      ReservationActions.tsx
      DisputePanel.tsx
```

---

### ETAPA 5: Finanzas (Semanas 17-20)

**Objetivo:** métricas financieras, comisiones, reportes

| Semana | Tasks                             | Priority |
| ------ | --------------------------------- | -------- |
| 17     | Página finanzas (KPIs, charts)    | High     |
| 18     | Configuración de comisiones       | High     |
| 19     | Reportes por período/owner/cancha | Medium   |
| 20     | Exportación de reportes           | Medium   |

**Archivos a crear:**

```
src/app/admin/
  finance/
    page.tsx
    components/
      RevenueChart.tsx
      CommissionConfig.tsx
      TopPerformersTable.tsx
      ReportExport.tsx
```

---

### ETAPA 6: Moderación (Semanas 21-24)

**Objetivo:** Moderación de reseñas, reportes de contenido

| Semana | Tasks                                     | Priority |
| ------ | ----------------------------------------- | -------- |
| 21     | Página moderación (tabs reportes/reseñas) | High     |
| 22     | Modal resolución de reporte               | High     |
| 23     | Listado de reseñas con acciones           | Medium   |
| 24     | Moderación de fotos                       | Medium   |

**Archivos a crear:**

```
src/app/admin/
  moderation/
    page.tsx
    components/
      ReportResolutionModal.tsx
      ReviewModerationCard.tsx
      PhotoModerationPanel.tsx
```

---

### ETAPA 7: Configuración Global (Semanas 25-28)

**Objetivo:** Configuración de plataforma, integraciones, features

| Semana | Tasks                                          | Priority |
| ------ | ---------------------------------------------- | -------- |
| 25     | Página settings (tabs general/integr/features) | High     |
| 26     | Configuración general (ciudades, tipos, etc.)  | High     |
| 27     | Configuración de integraciones                 | High     |
| 28     | Feature flags + maintenance mode               | High     |

**Archivos a crear:**

```
src/app/admin/
  settings/
    page.tsx
    components/
      GeneralSettings.tsx
      IntegrationSettings.tsx
      FeatureFlags.tsx
      MaintenanceMode.tsx
```

---

### ETAPA 8: Auditoría (Semanas 29-32)

**Objetivo:** Logs de acciones, exportación

| Semana | Tasks                           | Priority |
| ------ | ------------------------------- | -------- |
| 29     | Página logs (tabla con filtros) | High     |
| 30     | Detalle de log                  | Medium   |
| 31     | Exportación de logs             | Medium   |
| 32     | Configuración de retención      | Low      |

**Archivos a crear:**

```
src/app/admin/
  logs/
    page.tsx
    components/
      LogTable.tsx
      LogDetails.tsx
      LogExport.tsx
```

---

### ETAPA 9: Polish & Testing (Semanas 33-36)

**Objetivo:** Bug fixing, optimización, UX improvements

| Semana | Tasks                                          | Priority |
| ------ | ---------------------------------------------- | -------- |
| 33     | Responsive testing (tablet/mobile)             | High     |
| 34     | UX improvements (loading states, empty states) | High     |
| 35     | Accessibility audit                            | Medium   |
| 36     | Final testing + launch                         | High     |

---

## 🎯 Checklist de UX/UI

### Cada página debe tener:

| Elemento         | Requirement                               |
| ---------------- | ----------------------------------------- |
| Page Title       | Claro, con breadcrumb si es sub-página    |
| Empty State      | Mensaje cuando no hay datos               |
| Loading State    | Skeleton o spinner                        |
| Error State      | Mensaje claro con retry option            |
| Success Feedback | Toast notification para acciones exitosas |
| Confirmation     | Dialog para acciones destructivas         |
| Pagination       | Si hay más de 20 items                    |
| Mobile View      | Funciona en tablet/desktop                |

### Actions deben tener:

| Elemento        | Requirement                                  |
| --------------- | -------------------------------------------- |
| Clear Label     | Texto descriptivo, no solo icon              |
| Visual Feedback | Hover state, loading state                   |
| Confirmation    | Para acciones destructivas (delete, suspend) |
| Result Toast    | Success/error notification                   |
| Loading Spinner | Durante acción async                         |

### Tables deben tener:

| Elemento          | Requirement                     |
| ----------------- | ------------------------------- |
| Sortable Columns  | Al menos columns principales    |
| Filterable        | Search + dropdowns              |
| Row Actions       | Menu dropdown (⋮) para acciones |
| Pagination        | Si hay muchos registros         |
| Mobile Responsive | Cards en mobile si tabla no fit |

---

## 📁 Estructura de Archivos Final

```
src/app/admin/
├── layout.tsx                          # Main layout with sidebar
├── page.tsx                            # Dashboard
│
├── users/
│   ├── page.tsx                        # Users list
│   └── [id]/page.tsx                   # User detail
│
├── owners/
│   ├── page.tsx                        # Owners list (tabs)
│   └── components/
│       ├── OwnerApplicationModal.tsx
│       └── OwnerDetailsCard.tsx
│
├── venues/
│   ├── page.tsx                        # Venues list (tabs)
│   ├── [id]/page.tsx                   # Venue detail
│   └── components/
│       ├── VenueApprovalModal.tsx
│       ├── VenueConfigViewer.tsx
│       └── VenueOverrideForm.tsx
│
├── reservations/
│   ├── page.tsx                        # Reservations list
│   ├── [id]/page.tsx                   # Reservation detail
│   └── components/
│       ├── ReservationDetails.tsx
│       ├── ReservationActions.tsx
│       └── DisputePanel.tsx
│
├── finance/
│   ├── page.tsx                        # Finance dashboard
│   └── components/
│       ├── RevenueChart.tsx
│       ├── CommissionConfig.tsx
│       ├── TopPerformersTable.tsx
│       └── ReportExport.tsx
│
├── moderation/
│   ├── page.tsx                        # Moderation (tabs)
│   └── components/
│       ├── ReportResolutionModal.tsx
│       ├── ReviewModerationCard.tsx
│       └── PhotoModerationPanel.tsx
│
├── settings/
│   ├── page.tsx                        # Settings (tabs)
│   └── components/
│       ├── GeneralSettings.tsx
│       ├── IntegrationSettings.tsx
│       ├── FeatureFlags.tsx
│       └── MaintenanceMode.tsx
│
├── logs/
│   ├── page.tsx                        # Audit logs
│   └── components/
│       ├── LogTable.tsx
│       ├── LogDetails.tsx
│       └── LogExport.tsx
│
└── components/                         # Shared components
    ├── KPICard.tsx
    ├── DataTable.tsx
    ├── Modal.tsx
    ├── StatusBadge.tsx
    ├── Tabs.tsx
    ├── FilterBar.tsx
    ├── Sidebar.tsx
    ├── Header.tsx
    ├── EmptyState.tsx
    ├── LoadingState.tsx
    ├── Toast.tsx
    ├── ConfirmDialog.tsx
    └── Pagination.tsx
```

---

## 🚀 Ready to Start!

Este plan está diseñado para:

1. **UI Limpia** - métricas solo donde importa (Dashboard + Finanzas)
2. **Progressive Implementation** - 9 etapas, 36 semanas
3. **Good UX** - Empty states, loading, feedback, confirmation
4. **Responsive** - Desktop/Tablet/Mobile
5. **Reusable Components** - DataTable, Modal, KPICard, etc.
6. **Clear Structure** - Files well organized

---

**Next Step:** ¿Quieres empezar con la ETAPA 1 (Foundation)? 🎯
