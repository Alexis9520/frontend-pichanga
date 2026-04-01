# 📋 Documento de Requerimientos del Producto (PRD)

## Pichanga Dual — Sistema de Reservas de Canchas de Fútbol + Red Social Deportiva

**Versión:** 2.0  
**Fecha:** Marzo 2026  
**Estado:** Especificación Técnica para Desarrollo  
**Tipo:** Sistema Multiplataforma (App Móvil + Web Dashboard)

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto

Pichanga Dual es una plataforma tecnológica diseñada para revolucionar la reserva de canchas de fútbol en Perú, combinando un motor de reservas robusto con una capa de red social que permite a los jugadores conectarse, formar equipos y compartir experiencias deportivas. El sistema está compuesto por dos interfaces principales: una aplicación móvil dirigida a jugadores y usuarios finales, y un panel web administrativo dirigido a los dueños de canchas y al equipo administrador de la plataforma.

### 1.2 Propuesta de Valor

La propuesta de valor central radica en tres pilares fundamentales:

**Automatización del proceso de reserva:** Se elimina la necesidad de llamadas telefónicas y la incertidumbre sobre la disponibilidad mediante un sistema en tiempo real que muestra horarios exactos, precios variables según horarios y confirmación instantánea de pagos.

**Comunidad deportiva activa:** Los usuarios pueden descubrir canchas cercanas mediante geolocalización, guardar sus favoritos, calificar y reseñar instalaciones, y conectar con otros jugadores para formar equipos o simplemente jugar partidos espontáneos.

**Gestión profesional para propietarios:** Los dueños de canchas obtienen un dashboard completo para administrar múltiples instalaciones, configurar horarios y precios diferenciados, visualizar reservas en tiempo real, gestionar bloqueos manuales y monitorear sus ingresos sin requerir conocimientos técnicos.

### 1.3 Modelo de Negocio

El modelo de negocio se sustenta en una comisión por transacción que inicialmente será gratuita para incentivo de adopción (período promocional), posteriormente se cobrará un porcentaje por cada reserva concretada. El pago se procesa antes de confirmar la reserva mediante Culqi, con generación automática de comprobantes de pago y código QR para validación en el establecimiento.

---

## 2. Alcance del Producto

### 2.1 Funcionalidades para Jugadores (App Móvil)

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| F01 | Registro de usuarios mediante email/contraseña y autenticación con Google | Alta |
| F02 | Visualización de canchas de fútbol en un mapa interactivo con geolocalización | Alta |
| F03 | Filtrado de canchas por ciudad, precio, características y disponibilidad | Alta |
| F04 | Sistema de reserva por horas (1, 2, 3 horas consecutivas) | Alta |
| F05 | Integración de pagos mediante Culqi con confirmación instantánea | Alta |
| F06 | Generación de comprobantes de pago (boleta/factura) y código QR | Alta |
| F07 | Historial completo de reservas realizadas con estado actual | Alta |
| F08 | Sistema de favoritos para guardar canchas preferidas | Media |
| F09 | Reseñas y calificaciones de canchas con fotos y comentarios | Media |
| F10 | Sistema de conexión entre usuarios para formar equipos | Media |
| F11 | Notificaciones push para recordatorios de partidos | Media |
| F12 | Chat in-app integrado con enlace directo a WhatsApp | Media |
| F13 | Visualización de precios diferenciados por slot de horario | Alta |
| F14 | Descubrir y aplicar promociones/ofertas disponibles | Alta |
| F15 | Agregar productos extras y servicios a la reserva (pre-venta) | Alta |
| F16 | Opción de pago parcial (adelanto mínimo) o pago total | Alta |
| F17 | Ver información de políticas de la cancha (tolerancia, cancelación) | Media |
| F18 | Ver descuentos aplicados en el resumen de reserva | Media |

### 2.2 Funcionalidades para Dueños de Canchas (Web Dashboard)

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| D01 | Autenticación segura con email/contraseña | Alta |
| D02 | Gestión completa de canchas (crear, editar, desactivar) | Alta |
| D03 | Configuración de horarios de operación por día | Alta |
| D04 | Definición de precios por hora con rangos diferenciados | Alta |
| D05 | Sistema de bloqueo manual de horarios específicos | Alta |
| D06 | Visualización de reservas en tiempo real | Alta |
| D07 | Panel de ingresos con estadísticas y gráficos | Alta |
| D08 | Gestión de políticas de cancelación y reembolso | Media |
| D09 | Acceso a datos de contacto de usuarios | Media |
| D10 | Sistema de horarios flexibles con precios por slot de 30 min | Alta |
| D11 | Configuración de tolerancia para llegada (tiempo de gracia) | Alta |
| D12 | Sistema de promociones para horarios de baja demanda | Alta |
| D13 | Sistema de inventario y ventas extras (productos y servicios) | Alta |
| D14 | Sistema de pagos parciales/adelantos configurables | Alta |
| D15 | Políticas de reserva personalizables por cancha | Media |
| D16 | Sistema de reservas manuales (independiente de app móvil) | Alta |

### 2.3 Funcionalidades para Administradores (Super-Admins)

| ID | Funcionalidad | Prioridad |
|----|---------------|-----------|
| A01 | Panel de control general con métricas | Alta |
| A02 | Aprobación de nuevos dueños de canchas | Alta |
| A03 | Activación y desactivación de canchas | Alta |
| A04 | Gestión de comisiones y tasas de la plataforma | Alta |
| A05 | Visualización de todas las reservas del sistema | Alta |
| A06 | Reportes de rendimiento por cancha, ciudad y período | Media |

### 2.4 Funcionalidades por Fase de Lanzamiento

#### Fase 1 - Web Dashboard (Independiente)
El sistema web para dueños funcionará 100% de forma independiente, permitiendo:
- Gestión completa de canchas y horarios
- Sistema de reservas manuales (para clientes que llaman o llegan al local)
- Registro de pagos en efectivo/tarjeta en el local
- Control de inventario y ventas extras
- Promociones y ofertas configurables
- Panel de ingresos y estadísticas

#### Fase 2 - App Móvil para Jugadores
- Reservas automáticas desde la app
- Pagos en línea con Culqi
- Geolocalización y descubrimiento de canchas
- Sistema de reseñas y calificaciones
- Red social y conexiones entre jugadores

#### Funcionalidades para Fase 3 (Futuro)
- Reservas recurrentes automáticas (torneos y ligas)
- Sistema de mensajería interna entre usuarios
- Editor de fotos y filtros avanzados para reseñas
- Modo offline con sincronización posterior
- Integración con más pasarelas de pago (Yape, Plin)
- Múltiples idiomas
- Notificaciones SMS
- Sistema de referidos y recompensas

---

## 3. User Personas

### 3.1 El Jugador Ocasional (Carlos Mendoza)

- **Edad:** 28 años
- **Perfil:** Profesional de oficina, juega fútbol los fines de semana
- **Dispositivo:** Smartphone Android gama media-alta
- **Frustraciones:** Llamar por teléfono a varias canchas, llegar y encontrar cerrada, difficulty para organizar partidos
- **Necesidades:** Ver disponibilidad real, reservar y pagar en menos de 2 minutos, código QR de confirmación

### 3.2 El Dueño de Cancha (Pedro Ramos)

- **Edad:** 45 años
- **Perfil:** Emprendedor con complejo de 3 canchas en Huancayo
- **Dispositivo:** Laptop para administración, smartphone
- **Frustraciones:** Pérdida de tiempo en llamadas, clientes que no llegaban, falta de visibilidad de ingresos
- **Necesidades:** Sistema donde clientes vean disponibilidad real, bloquear horarios para mantenimiento, ver panel de ingresos claro

### 3.3 El Jugador Buscador (Miguel Ángel Torres)

- **Edad:** 22 años
- **Perfil:** Jugador frecuente (2-3 veces/semana), sin equipo fijo
- **Dispositivo:** Smartphone gama alta
- **Frustraciones:** Canchas lleno sin reserva, difficulty para encontrar partidos abiertos
- **Necesidades:** Encontrar canchas disponibles cerca, ver ratings y reseñas, conectar con otros jugadores

---

## 4. Requerimientos Funcionales Detallados

### 4.1 Autenticación y Gestión de Usuarios

#### 4.1.1 Registro de Usuarios

El sistema debe permitir el registro de usuarios proporcionando los siguientes datos obligatorios:

- Nombre completo (mínimo 2 palabras, máximo 100 caracteres)
- Número de teléfono (formato peruano de 9 dígitos)
- Correo electrónico (formato válido, único en el sistema)
- Contraseña (mínimo 8 caracteres, debe incluir al menos una letra y un número)

Opcionalmente, el usuario puede registrarse mediante autenticación con Google, lo cual debe solicitar permisos de lectura de perfil y correo electrónico.

#### 4.1.2 Inicio de Sesión

El sistema debe permitir inicio de sesión mediante:

- Correo electrónico y contraseña
- Autenticación con Google (OAuth 2.0)

El sistema debe implementar:

- Hash de contraseñas con algoritmo bcrypt (cost factor 12)
- Limitación de intentos (bloqueo temporal después de 5 intentos fallidos)
- Tokens JWT con expiración de 24 horas
- Refresh tokens con expiración de 30 días

#### 4.1.3 Recuperación de Contraseña

El sistema debe permitir recuperación de contraseña mediante:

1. Solicitud de reset con correo electrónico
2. Envío de enlace con token temporal (expira en 1 hora)
3. Formulario de nueva contraseña
4. Confirmación y acceso al sistema

#### 4.1.4 Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| user | Jugador estándar | Reservar, reseñar, Favoritos, Conexiones |
| owner | Dueño de canchas | Gestionar sus canchas, ver reservas, configurar precios |
| admin | Super-administrador | Acceso completo, aprobar owners, gestionar plataforma |

### 4.2 Geolocalización y Descubrimiento de Canchas

#### 4.2.1 Mapa Interactivo

El sistema debe mostrar un mapa interactivo con las siguientes características:

- Centro en la ubicación actual del usuario (con consentimiento)
- Pines de canchas con información resumida (nombre, precio desde-hasta)
- Estilo de mapa personalizado (escala de grises/crema)
- Movimiento suave y zoom con gestostouch

#### 4.2.2 Búsqueda por Ubicación

El sistema debe permitir buscar canchas mediante:

- Geolocalización automática del usuario
- Ingreso de dirección o nombre de lugar
- Selección manual en el mapa
- Filtro por ciudad/distrito

#### 4.2.3 Radios de Búsqueda

El sistema debe ofrecer los siguientes radios predefinidos:

| Opción | Radio | Uso Recomendado |
|--------|-------|-----------------|
| Muy cercano | 500 m | Walking distance |
| Cercano | 1 km | Barrio/distrito |
| Medio | 3 km | Zona extendida |
| Extendido | 5 km | Ciudad completa |
| Personalizado | Variable | Selección manual |

#### 4.2.4 Filtros de Búsqueda

El sistema debe permitir filtrar por:

- **Precio:** Rango mínimo-máximo por hora
- **Tipo de superficie:** Grass sintético, grass natural, losa, concreto
- **Tipo de deporte:** Fútbol 5, fútbol 7, fulbito
- **Servicios:** Estacionamiento, baños, duchAS, iluminación, quincho, tribuna
- **Calificación:** Mínimo 1-5 estrellas

### 4.3 Gestión de Canchas

#### 4.3.1 Datos de la Cancha

Cada cancha debe incluir:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| nombre | VARCHAR(100) | Sí | Nombre comercial |
| direccion | TEXT | Sí | Dirección textual |
| latitud | DECIMAL(10,8) | Sí | Coordenada GPS |
| longitud | DECIMAL(11,8) | Sí | Coordenada GPS |
| ciudad | VARCHAR(50) | Sí | Ciudad |
| distrito | VARCHAR(50) | Sí | Distrito |
| tipo_deporte | ENUM | Sí | f5, f7, fulbito |
| superficie | ENUM | Sí | grass_sintetico, grass_natural, losa, concreto |
| capacidad | INT | Sí | Jugadores máximos por equipo |
| servicios | JSON | No | Array de servicios disponibles |
| fotos | JSON | Sí | Array de URLs (mínimo 3) |
| descripcion | TEXT | No | Descripción adicional |
| precio_hora_base | DECIMAL(8,2) | Sí | Precio hora normal |
| precio_hora_noche | DECIMAL(8,2) | Sí | Precio hora nocturna |
| hora_inicio_diurno | TIME | Sí | Inicio horario normal |
| hora_inicio_noche | TIME | Sí | Inicio horario nocturno |
| hora_cierre | TIME | Sí | Hora de cierre |
| dias_descanso | JSON | No | Días sin operación |
| estado | ENUM | Sistema | activa, inactiva, en_revision |

#### 4.3.2 Estados de Cancha

| Estado | Descripción | Visible para usuarios |
|--------|-------------|----------------------|
| activa | Aprobada y operativa | Sí |
| inactiva | Desactivada por owner/admin | No |
| en_revision | Pendiente de aprobación | No |

#### 4.3.3 Horarios de Operación

El sistema debe permitir configurar horarios específicos por cada día de la semana:

- Hora de apertura y cierre independientepor día
- Días de descanso configurable
- Horarios diferenciados (diurno/nocturno) con precios distintos

#### 4.3.4 Bloqueos de Horario

El owner debe poder bloquear horarios para:

- Mantenimiento de la cancha
- Eventos privados
- Otras razones específicas

Los bloqueos pueden ser:

- **Puntuales:** Una fecha y hora específica
- **Recurrentes:** Repetición semanal en días fijos

### 4.4 Reservas y Disponibilidad

#### 4.4.1 Proceso de Reserva

1. Usuario selecciona una cancha
2. Selecciona fecha del calendario
3. Ve horarios disponibles visualmente
4. Selecciona hora de inicio y duración (1-3 horas)
5. Sistema calcula precio total
6. Usuario confirma y procede al pago

#### 4.4.2 Cálculo de Precio

El sistema debe calcular el precio total considerando:

- Precio por cada hora según el rango horario
- Si la reserva cruza de horario diurno a nocturno, aplicar precio correcto por segmento
- Mostrar desglose del cálculo al usuario

#### 4.4.3 Estados de Reserva

| Estado | Descripción | Transición |
|--------|-------------|------------|
| pending_payment | Iniciada, sin pago confirmado | → confirmed, → cancelled |
| confirmed | Pagada y confirmada | → in_progress, → cancelled |
| in_progress | En curso (llegó hora de inicio) | → completed |
| completed | Finalizó exitosamente | Estado final |
| cancelled | Cancelada por usuario/owner | Estado final |
| cancelled_with_refund | Cancelada con reembolso | Estado final |

#### 4.4.4 Prevención de Doble Reserva

El sistema debe implementar:

- Transacción atómica para verificación + creación
- Lock optimista en base de datos
- Manejo de condición de carrera
- Si dos usuarios reservan simultáneamente, el primero gana

### 4.5 Pagos y Facturación

#### 4.5.1 Integración con Culqi

El sistema debe integrar Culqi para:

- Crear órdenes de pago con tokenización
- Procesar pagos con tarjetas (débito/crédito)
- Recibir webhooks de confirmación
- Manejar pagos fallidos y reintentos
- Procesar reembolsos

#### 4.5.2 Flujo de Pago

1. Usuario inicia reserva
2. Backend crea orden en Culqi (válida 15 minutos)
3. Frontend presenta formulario de tarjeta
4. Usuario ingresa datos y autoriza
5. Culqi procesa y devuelve token
6. Backend confirma cargo
7. Webhook actualiza estado de reserva
8. Si exitoso → reserva confirmada + QR + comprobante

#### 4.5.3 Comprobantes

El sistema debe generar:

- **Boleta:** Para personas sin RUC
- **Factura:** Para contribuyentes con RUC (ingresado por usuario)

Contenido del comprobante:

- Datos del establecimiento (dueño)
- Datos del cliente
- Detalle de la reserva (cancha, fecha, hora, duración)
- Monto subtotal, IGV, total
- Código QR único de validación

### 4.6 Cancelaciones y Reembolsos

#### 4.6.1 Política de Cancelación

- **Cancelación gratuita:** Hasta 3 horas antes del inicio
- **Con reembolso:** Según configuración del owner
- **Sin reembolso:** Menos de 3 horas antes

#### 4.6.2 Proceso de Cancelación

1. Usuario solicita cancelación
2. Sistema verifica tiempo restante
3. Aplica política correspondiente
4. Si aplica reembolso, inicia proceso en Culqi
5. Actualiza estado de reserva
6. Notifica a ambas partes

### 4.7 Red Social y Comunidad

#### 4.7.1 Conexiones entre Usuarios

El sistema debe permitir:

- Enviar solicitud de conexión
- Aceptar o rechazar solicitudes
- Ver lista de conexiones
- Ver perfil de conexiones

#### 4.7.2 Reseñas de Canchas

El sistema debe permitir:

- Reseñar solo si el usuario tiene reserva completada en esa cancha
- Calificación de 1-5 estrellas
- Comentario textual
- Fotos adjuntas (opcional)
- Respuesta del owner

### 4.8 Notificaciones

#### 4.8.1 Notificaciones Push

| Tipo | Momento | Destinatario |
|------|---------|--------------|
| Recordatorio 24h | 24 horas antes | Usuario |
| Recordatorio 1h | 1 hora antes | Usuario |
| Reserva confirmada | Tras pago exitoso | Usuario |
| Adelanto confirmado | Tras pago parcial | Usuario |
| Nueva reserva | Cuando se reserva | Owner |
| Cancelación | Cuando se cancela | Usuario/Owner |
| Respuesta a reseña | Cuando owner responde | Usuario |
| Promoción disponible | Cuando hay promo en cancha favorita | Usuario |
| Promo por vencer | 1 día antes de fin de promo | Usuario |
| Saldo pendiente | Al llegar el día del partido | Usuario |
| Stock bajo | Cuando inventario bajo mínimo | Owner |
| Nueva venta | Cuando se registra venta | Owner |
| Pago de saldo | Cuando se completa pago en cancha | Usuario/Owner |

#### 4.8.2 Soporte al Cliente

- Chat in-app con historial
- Botón directo a WhatsApp con mensaje predefinido

### 4.8.3 Experiencia de Usuario en App Móvil

#### 4.8.3.1 Visualización de Precios por Slot

El usuario debe poder ver:

- Precio específico para cada slot de horario disponible
- Indicador visual de slots premium vs regulares
- Comparación de precios en diferentes horarios
- Precio total calculado en tiempo real al seleccionar

**Interfaz:**
```
┌─────────────────────────────────────┐
│  Selecciona tu horario              │
├─────────────────────────────────────┤
│  ⭐ 3:00 PM - 4:00 PM   S/100      │
│  ⭐ 3:30 PM - 4:30 PM   S/120      │
│     4:00 PM - 5:00 PM   S/90       │
│     4:30 PM - 5:30 PM   S/95       │
│  ⭐ 5:00 PM - 6:00 PM   S/110      │
└─────────────────────────────────────┘
⭐ = Hora en punto (premium)
```

#### 4.8.3.2 Descubrimiento y Aplicación de Promociones

**Ubicación de promociones:**

1. **En el detalle de cancha:**
   - Badge "Promoción" visible
   - Sección "Ofertas disponibles"

2. **Durante la selección de horario:**
   - Promociones aplicables al slot seleccionado
   - Indicador de cupos disponibles

3. **En el resumen de reserva:**
   - Descuento aplicado visible
   - Ahorro total mostrado

**Proceso de aplicación:**

1. Usuario selecciona fecha y horario
2. Sistema muestra promociones disponibles
3. Usuario puede aplicar promoción (si cumple requisitos)
4. Sistema verifica cupos y límites
5. Descuento aplicado al total

**Ejemplo de UI de promoción:**
```
┌─────────────────────────────────────┐
│  🎉 PROMOCIÓN DISPONIBLE            │
├─────────────────────────────────────┤
│  Martes de mañana                   │
│  20% OFF en horarios 6AM-12PM       │
│                                     │
│  Cupos disponibles: 3/10            │
│                                     │
│  [APLICAR PROMOCIÓN]                │
└─────────────────────────────────────┘
```

#### 4.8.3.3 Pre-venta de Productos y Servicios

**Ubicación en el flujo:**
- Después de seleccionar horario
- Antes del pago

**Productos disponibles:**
- Bebidas (agua, gaseosas, cerveza)
- Snacks
- Alquiler de balón
- Árbitro (si disponible)
- Otros servicios

**Proceso de agregado:**

1. Usuario ve sección "Agrega extras a tu reserva"
2. Navega por categorías
3. Selecciona cantidad de cada producto
4. Ve total de extras en tiempo real
5. Confirma o continúa sin extras

**Ejemplo de UI:**
```
┌─────────────────────────────────────┐
│  Agrega extras a tu reserva         │
├─────────────────────────────────────┤
│  🍺 Bebidas                         │
│  ├─ Agua mineral x1   S/3.00  [-][+]│
│  ├─ Gaseosa x1        S/4.00  [-][+]│
│  └─ Cerveza x1        S/8.00  [-][+]│
│                                     │
│  🏀 Adicionales                     │
│  ├─ Alquiler balón   S/10.00 [ ]    │
│  └─ Árbitro          S/50.00 [ ]    │
├─────────────────────────────────────┤
│  Total extras: S/15.00              │
└─────────────────────────────────────┘
```

#### 4.8.3.4 Opción de Pago Parcial o Total

**Durante el checkout:**

El usuario debe ver:

| Opción | Descripción |
|--------|-------------|
| Pagar total | Pagar 100% ahora (S/100.00) |
| Pagar adelanto | Pagar mínimo (S/30.00), resto en cancha |

**Interfaz de selección:**
```
┌─────────────────────────────────────┐
│  Opciones de pago                   │
├─────────────────────────────────────┤
│  Total de reserva: S/100.00         │
│                                     │
│  ◉ Pagar total ahora                │
│     S/100.00                        │
│                                     │
│  ○ Pagar adelanto mínimo            │
│     S/30.00 (resto S/70.00 en cancha)│
│                                     │
│  Nota: El saldo restante se paga    │
│  al llegar al establecimiento       │
└─────────────────────────────────────┘
```

**Confirmación de pago parcial:**
- Estado de pago: "Adelanto pagado"
- Monto pendiente visible
- Instrucciones claras de pago restante

#### 4.8.3.5 Información de Políticas de la Cancha

**Ubicación:**
- Detalle de cancha → Sección "Políticas"
- Durante checkout → Resumen

**Información visible:**

| Política | Cómo se muestra |
|----------|-----------------|
| Tolerancia | "Llegada: Tienes 15 min de tolerancia" |
| Cancelación | "Cancelación gratis hasta 3h antes" |
| Adelanto mínimo | "Adelanto mínimo: S/30" |
| Penalidad | Si aplica, se muestra en políticas |

**Ejemplo en detalle de cancha:**
```
┌─────────────────────────────────────┐
│  📋 Políticas de la cancha          │
├─────────────────────────────────────┤
│  ⏱️ Tolerancia de llegada: 15 min   │
│  ❌ Cancelación gratis: hasta 3h    │
│  💰 Adelanto mínimo: S/30           │
│  🏃 No show: Pierdes el adelanto    │
└─────────────────────────────────────┘
```

#### 4.8.3.6 Resumen de Reserva Mejorado

El resumen debe mostrar:

```
┌─────────────────────────────────────┐
│  📋 Resumen de tu reserva           │
├─────────────────────────────────────┤
│  Cancha: Los Campeones              │
│  Fecha: Sábado 15 de Marzo          │
│  Horario: 3:30 PM - 5:30 PM         │
│                                     │
│  ─────────────────────────────────  │
│  Precio base (2 horas)    S/200.00  │
│  Promoción martes         -S/40.00  │
│  Extras:                                 │
│  └─ 6 Gaseosas            S/24.00   │
│  ─────────────────────────────────  │
│  TOTAL                    S/184.00  │
│                                     │
│  💰 Ahorraste: S/40.00              │
│                                     │
│  Opciones de pago:                  │
│  ◉ Total: S/184.00                  │
│  ○ Adelanto: S/30.00                │
└─────────────────────────────────────┘
```

#### 4.8.3.7 Historial de Reservas Mejorado

Cada reserva debe mostrar:

- Estado de pago (total pagado / parcial / pendiente)
- Saldo pendiente (si aplica)
- Promoción aplicada (si aplica)
- Productos extras (si compró)

**Estados visuales:**

| Estado | Badge | Descripción |
|--------|-------|-------------|
| Confirmada | ✅ Verde | Reserva pagada y confirmada |
| Adelanto | 💛 Amarillo | Adelanto pagado, saldo pendiente |
| Pendiente | 🟠 Naranja | Reserva manual, pago en cancha |
| Completada | ✅ Verde | Partido jugado |
| Cancelada | ❌ Rojo | Cancelada |

### 4.9 Sistema de Horarios y Precios Flexibles

#### 4.9.1 Configuración de Slots de Tiempo

El sistema debe permitir a los dueños configurar horarios con granularidad de 30 minutos:

| Característica | Descripción |
|----------------|-------------|
| Slots de inicio | Cada 30 minutos (ej: 3:00, 3:30, 4:00, 4:30) |
| Duración mínima | 1 hora (siempre en bloques de hora) |
| Duración máxima | Configurable por el dueño (ej: 3 horas) |
| Precios por slot | Cada hora de inicio puede tener precio diferente |

#### 4.9.2 Precios Diferenciados por Slot

El dueño puede configurar precios específicos para cada hora de inicio:

**Ejemplo de configuración:**
- Lunes 3:00 PM - 4:00 PM → S/80
- Lunes 3:30 PM - 4:30 PM → S/100
- Lunes 4:00 PM - 5:00 PM → S/90

**Características del sistema de precios:**
- Precio base configurable por rango horario (mañana, tarde, noche)
- Ajuste individual por cada slot de 30 minutos
- Horas en punto vs horas intermedias con precios distintos
- Diferenciación por día de la semana

#### 4.9.3 Rangos Horarios

El dueño puede definir rangos horarios con sub-configuraciones:

| Rango | Horario | Precio Base | Ajustes |
|-------|---------|-------------|---------|
| Madrugada | 6:00 AM - 8:00 AM | S/60 | Slots 6:00 y 6:30 |
| Mañana | 8:00 AM - 12:00 PM | S/80 | Horas en punto +10% |
| Tarde | 12:00 PM - 6:00 PM | S/100 | Slots 3:00 premium |
| Noche | 6:00 PM - 10:00 PM | S/120 | Horas intermedias -5% |

#### 4.9.4 Plantillas de Horarios

El sistema debe soportar plantillas reutilizables:

- Crear plantillas de configuración horaria
- Aplicar plantillas a días específicos
- Modificar plantillas con cambios reflejados en días asignados
- Duplicar plantillas existentes para variaciones

#### 4.9.5 Ejemplo Práctico de Configuración

**Escenario: Cancha "Los Campeones"**

| Día | Slot | Hora Inicio | Hora Fin | Precio |
|-----|------|-------------|----------|--------|
| Lunes | 1 | 3:00 PM | 4:00 PM | S/80 |
| Lunes | 2 | 3:30 PM | 4:30 PM | S/100 |
| Lunes | 3 | 4:00 PM | 5:00 PM | S/90 |
| Lunes | 4 | 4:30 PM | 5:30 PM | S/95 |
| Sábado | 1 | 3:00 PM | 4:00 PM | S/150 |
| Sábado | 2 | 3:30 PM | 4:30 PM | S/180 |

### 4.10 Sistema de Tolerancia para Llegada

#### 4.10.1 Configuración de Tiempo de Gracia

El dueño puede configurar el tiempo de tolerancia para cada cancha:

| Campo | Tipo | Valores | Descripción |
|-------|------|---------|-------------|
| tolerancia_minutos | INT | 0-30 | Minutos de gracia después de la hora de inicio |
| politica_exceso | ENUM | perder_reserva, penalidad, tiempo_restante, configurable | Qué pasa si llega tarde |

#### 4.10.2 Políticas de Exceso

| Política | Descripción |
|----------|-------------|
| perder_reserva | Si excede tolerancia, pierde la reserva sin reembolso |
| penalidad | Se cobra una penalidad pero puede jugar el tiempo restante |
| tiempo_restante | Solo puede jugar el tiempo que quede de la reserva |
| configurable | El dueño define su propia política personalizada |

#### 4.10.3 Configuración por Dueño

El dueño puede definir:
- Minutos de tolerancia (ej: 10, 15, 20 minutos)
- Política cuando se excede la tolerancia
- Penalidad aplicable (monto fijo o porcentaje)
- Notificación automática al cliente cuando se excede

#### 4.10.4 Registro de Llegadas

El sistema debe permitir:
- Marcar hora de llegada del cliente
- Calcular automáticamente si está dentro de tolerancia
- Aplicar política configurada si corresponde
- Notificar al cliente sobre su estatus

### 4.11 Sistema de Promociones y Ofertas

#### 4.11.1 Tipos de Promociones Soportadas

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| Descuento Porcentual | Porcentaje de descuento sobre precio base | 20% OFF en martes por la mañana |
| Precio Fijo Promocional | Precio especial fijo | S/60 en lugar de S/100 los miércoles |
| Combo de Horas | Descuento por reservar múltiples horas | 2 horas al precio de 1.5 horas |
| Combo con Productos | Reserva + productos incluidos | Cancha + 6 bebidas por S/120 |
| Descuento por Recurrencia | Descuento por reservas frecuentes | 15% OFF en tu 3ra reserva del mes |

#### 4.11.2 Configuración de Promociones

Cada promoción debe incluir:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | VARCHAR(100) | Nombre de la promoción |
| tipo | ENUM | Tipo de promoción (ver tabla anterior) |
| dias_aplicables | JSON | Días de la semana (ej: ["martes", "miercoles"]) |
| horarios | JSON | Rangos horarios (ej: [{"inicio": "06:00", "fin": "12:00"}]) |
| fecha_inicio | DATE | Fecha de inicio de vigencia |
| fecha_fin | DATE | Fecha de fin de vigencia |
| cupos_maximos | INT | Cantidad máxima de reservas con promoción por día |
| cupos_por_usuario | INT | Máximo de usos por usuario |
| valor | DECIMAL(8,2) | Valor del descuento o precio fijo |
| activa | BOOLEAN | Estado de la promoción |
| canchas_aplicables | JSON | IDs de canchas donde aplica |

#### 4.11.3 Límites y Restricciones

- **Cupos limitados por día/horario:** El dueño define cuántas reservas pueden usar la promoción
- **Límite por usuario:** Máximo de usos por cliente
- **Combinabilidad:** Si puede combinarse con otras promociones
- **Anticipación mínima:** Días de anticipación requeridos para aplicar

#### 4.11.4 Promociones de Baja Demanda

Sistema inteligente para promocionar horarios con poca ocupación:

- Detección automática de horarios con baja ocupación
- Sugerencias de promociones al dueño
- Creación rápida de promociones para horarios vacíos
- Notificaciones a usuarios sobre ofertas cercanas

### 4.12 Sistema de Inventario y Ventas Extras

#### 4.12.1 Catálogo de Productos y Servicios

| Categoría | Ejemplos | Control de Stock |
|-----------|----------|------------------|
| Bebidas | Agua, gaseosas, cerveza, jugos | Opcional |
| Snacks | Papas, chocolates, maní | Opcional |
| Artículos Deportivos | Balones, camisetas, espinilleras | Opcional |
| Alquiler | Balón, árbitro, camerinos | Sin stock |
| Servicios | Estacionamiento, duchas, quincho | Sin stock |

#### 4.12.2 Gestión de Productos

Cada producto debe incluir:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| nombre | VARCHAR(100) | Sí | Nombre del producto |
| categoria | ENUM | Sí | bebida, snack, deportivo, alquiler, servicio |
| precio | DECIMAL(8,2) | Sí | Precio de venta |
| costo | DECIMAL(8,2) | No | Costo del producto (para márgenes) |
| control_stock | BOOLEAN | Sí | Si tiene control de inventario |
| stock_actual | INT | Condicional | Cantidad actual (si control_stock=true) |
| stock_minimo | INT | Condicional | Alerta de stock bajo (si control_stock=true) |
| activo | BOOLEAN | Sí | Si está disponible para venta |
| imagen_url | VARCHAR | No | Imagen del producto |

#### 4.12.3 Control de Stock Configurable

El dueño puede elegir para cada producto:

**Con control de stock:**
- Registro de entradas y salidas
- Alertas de stock bajo
- Historial de movimientos
- Reportes de rotación

**Sin control de stock:**
- Solo registro de ventas
- Sin alertas de inventario
- Para productos/servicios de consumo ilimitado

#### 4.12.4 Sistema de Ventas Híbrido

**Pre-venta con Reserva (Opcional para Cliente):**
- Cliente puede agregar productos al hacer la reserva
- Productos reservados automáticamente al llegar
- Pago junto con la reserva o en el local

**Ventas Manuales en Local:**
- El dueño registra ventas de productos
- Asociación opcional con reserva existente
- Registro de cliente (nombre/teléfono) sin cuenta
- Métodos de pago: efectivo, tarjeta, Yape, Plin

#### 4.12.5 Registro de Ventas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| reserva_id | UUID | Reserva asociada (opcional) |
| cliente_nombre | VARCHAR | Nombre del cliente |
| cliente_telefono | VARCHAR | Teléfono del cliente |
| productos | JSON | Array de productos vendidos |
| total | DECIMAL(8,2) | Monto total de la venta |
| metodo_pago | ENUM | efectivo, tarjeta, yape, plin |
| fecha | DATETIME | Fecha y hora de la venta |
| vendedor_id | UUID | Usuario que registró la venta |

#### 4.12.6 Reportes de Ventas

- Ventas por día/semana/mes
- Productos más vendidos
- Ingresos por categoría
- Margen de ganancia
- Comparativa con reservas

### 4.13 Sistema de Pagos Parciales y Adelantos

#### 4.13.1 Configuración de Adelantos

El dueño puede configurar el monto de adelanto por cancha y/o horario:

| Configuración | Descripción |
|---------------|-------------|
| Adelanto por cancha | Monto fijo para cada cancha (ej: S/30) |
| Adelanto por horario | Monto diferente según día/hora (ej: S/50 sábados noche) |
| Adelanto mínimo global | Monto mínimo para todo el complejo |

**Reglas de configuración:**
- Monto fijo en soles (no porcentaje)
- Configurable individualmente por cancha
- Ajustable por día de la semana
- Ajustable por rango horario

#### 4.13.2 Estados de Pago

| Estado | Descripción |
|--------|-------------|
| pending | Reserva creada, sin pago |
| partial | Adelanto pagado, pendiente saldo |
| completed | Pago completo |
| refunded | Reembolsado |
| partial_refund | Reembolso parcial |

#### 4.13.3 Flujo de Pago Parcial

**Desde App Móvil (Fase 2):**
1. Cliente selecciona horario
2. Sistema muestra monto de adelanto requerido
3. Cliente paga adelanto (ej: S/30 de S/100 total)
4. Reserva confirmada con estado `partial`
5. Resto se paga al llegar al local

**Desde Web Dashboard (Reserva Manual):**
1. Dueño crea reserva manual para cliente
2. Registra monto de adelanto recibido (si aplica)
3. Indica método de pago del adelanto
4. Registra pago del saldo al llegar

#### 4.13.4 Control del Pago Restante

El dueño tiene control manual sobre el pago del saldo:

**Acciones disponibles:**
- Marcar reserva como "saldo pagado"
- Registrar método de pago del saldo
- Marcar reserva como "no se presentó" (si no pagó el resto)
- Cancelar reserva si no completó pago

**Sin penalidad automática:** El sistema no cancela automáticamente por falta de pago del saldo; el dueño decide cómo manejarlo.

#### 4.13.5 Registro de Pagos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| reserva_id | UUID | Reserva asociada |
| tipo_pago | ENUM | adelanto, saldo, completo |
| monto | DECIMAL(8,2) | Monto pagado |
| metodo_pago | ENUM | culqi, efectivo, tarjeta_local, yape, plin |
| fecha_pago | DATETIME | Fecha y hora del pago |
| registrado_por | UUID | Usuario que registró el pago |

### 4.14 Sistema de Reservas Manuales

#### 4.14.1 Reservas Independientes de la App

Para que el sistema web funcione sin la app móvil:

| Característica | Descripción |
|----------------|-------------|
| Registro de cliente | Nombre y teléfono (sin cuenta) |
| Creación manual | El dueño crea la reserva desde el dashboard |
| Bloqueo de horario | Reserva manual bloquea el horario igual que automática |
| Estados | Mismos estados que reservas automáticas |
| Origen | Diferenciación entre `manual` y `app` |

#### 4.14.2 Datos de Reserva Manual

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| cliente_nombre | VARCHAR(100) | Sí | Nombre del cliente |
| cliente_telefono | VARCHAR(20) | Sí | Teléfono de contacto |
| cliente_email | VARCHAR(100) | No | Email (opcional) |
| cancha_id | UUID | Sí | Cancha reservada |
| fecha | DATE | Sí | Fecha de la reserva |
| hora_inicio | TIME | Sí | Hora de inicio |
| hora_fin | TIME | Sí | Hora de finalización |
| precio_total | DECIMAL(8,2) | Sí | Precio total acordado |
| adelanto | DECIMAL(8,2) | No | Adelanto recibido |
| metodo_adelanto | ENUM | No | Método del adelanto |
| observaciones | TEXT | No | Notas del dueño |

#### 4.14.3 Ventajas del Sistema Híbrido

- Funciona 100% desde el primer día sin app móvil
- Los dueños no pierden clientes que llaman por teléfono
- Sincronización automática entre reservas manuales y automáticas
- Historial unificado de todas las reservas
- Reportes consolidados

---

## 5. Requerimientos No Funcionales

### 5.1 Rendimiento

| Métrica | Objetivo |
|---------|----------|
| Tiempo respuesta lectura | ≤ 2 segundos |
| Tiempo respuesta escritura | ≤ 5 segundos |
| Usuarios concurrentes | 500+ |
| Disponibilidad | 99.5% |

### 5.2 Seguridad

- Contraseñas hasheadas con bcrypt (cost 12)
- HTTPS con TLS 1.2+
- Tokens JWT con expiración
- Protección: SQL injection, XSS, CSRF
- Datos de tarjetas nunca almacenados (solo tokens Culqi)

### 5.3 Compatibilidad

| Plataforma | Versión Mínima |
|------------|----------------|
| Android | 6.0 (API 23) |
| iOS | 12.0 |
| Web | Chrome, Firefox, Safari, Edge (versiones actuales) |

### 5.4 Accesibilidad

- Contraste de colores WCAG 2.1 AA
- Textos redimensionables
- Compatible con lectores de pantalla

---

## 6. Modelo de Datos

### 6.1 Diagrama Entidad-Relación (Actualizado)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │     │   Venues    │     │  Venues     │
│             │     │             │     │  Schedules  │
│ id (PK)     │────<│ owner_id    │────<│ venue_id    │
│ email       │     │ id (PK)     │     │ id (PK)     │
│ password    │     │ name        │     │ day_of_week │
│ full_name   │     │ address     │     │ open_time   │
│ phone       │     │ lat         │     │ close_time  │
│ role        │     │ lng         │     └─────────────┘
│ avatar_url  │     │ city        │       │
│ status      │     │ price_base  │       │
│ created_at  │     │ price_night │       │
└─────────────┘     │ status      │       │
       │           └─────────────┘       │
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Reservations │   │   Reviews   │   │  Venue      │
│             │   │             │   │  Blockings  │
│ id (PK)     │   │ id (PK)     │   │             │
│ user_id     │   │ venue_id    │   │ id (PK)     │
│ venue_id    │   │ user_id     │   │ venue_id    │
│ date        │   │ rating      │   │ date        │
│ start_time  │   │ comment     │   │ start_time  │
│ end_time    │   │ created_at  │   │ end_time    │
│ total_price │   └─────────────┘   │ reason      │
│ status      │                     │ is_recurring│
│ payment_id  │                     │ status      │
│ source      │ ← NUEVO             └─────────────┘
│ cliente_nombre│ ← NUEVO                  │
│ cliente_tel   │ ← NUEVO                  │
└─────────────┘                           │
       │                                  │
       ▼                                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Payments   │   │  Favorites  │   │   User      │
│             │   │             │   │  Connections│
│ id (PK)     │   │ id (PK)     │   │             │
│ reservation_│   │ user_id     │   │ id (PK)     │
│   id        │   │ venue_id    │   │ from_user   │
│ amount      │   │ created_at  │   │ to_user     │
│ currency    │   └─────────────┘   │ status      │
│ status      │                     │ created_at  │
│ culqi_id    │                     └─────────────┘
│ tipo_pago   │ ← NUEVO
│ metodo_pago │ ← NUEVO
│ created_at  │
└─────────────┘

══════════════════════════════════════════════════════════════
                    NUEVAS TABLAS (FASE 1)
══════════════════════════════════════════════════════════════

┌─────────────────────┐     ┌─────────────────────┐
│   venue_time_slots  │     │    venue_policies   │
│                     │     │                     │
│ id (PK)             │     │ id (PK)             │
│ venue_id (FK)       │     │ venue_id (FK)       │
│ day_of_week         │     │ tolerancia_minutos  │
│ start_time          │     │ politica_exceso     │
│ end_time            │     │ adelanto_minimo     │
│ slot_duration       │     │ penalidad_monto     │
│ price               │     │ cancelacion_horas   │
│ is_premium          │     │ reembolso_porcentaje│
│ is_active           │     │ created_at          │
│ created_at          │     └─────────────────────┘
└─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│     promotions      │     │   slot_templates    │
│                     │     │                     │
│ id (PK)             │     │ id (PK)             │
│ venue_id (FK)       │     │ venue_id (FK)       │
│ nombre              │     │ nombre              │
│ tipo                │     │ descripcion         │
│ valor               │     │ config_horarios     │
│ dias_aplicables     │     │ config_precios      │
│ horarios            │     │ is_active           │
│ fecha_inicio        │     │ created_at          │
│ fecha_fin           │     └─────────────────────┘
│ cupos_maximos       │
│ cupos_por_usuario   │
│ activa              │
│ canchas_aplicables  │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│   inventory_items   │     │       sales         │
│                     │     │                     │
│ id (PK)             │     │ id (PK)             │
│ venue_id (FK)       │     │ venue_id (FK)       │
│ nombre              │     │ reservation_id (FK) │
│ categoria           │     │ cliente_nombre      │
│ precio              │     │ cliente_telefono    │
│ costo               │     │ productos (JSON)    │
│ control_stock       │     │ total               │
│ stock_actual        │     │ metodo_pago         │
│ stock_minimo        │     │ fecha               │
│ activo              │     │ vendedor_id (FK)    │
│ imagen_url          │     │ created_at          │
│ created_at          │     └─────────────────────┘
└─────────────────────┘

┌─────────────────────┐
│   promotion_usage   │
│                     │
│ id (PK)             │
│ promotion_id (FK)   │
│ reservation_id (FK) │
│ user_id (FK)        │
│ descuento_aplicado  │
│ created_at          │
└─────────────────────┘
```

### 6.2 Detalle de Nuevas Tablas

#### 6.2.1 venue_time_slots

Configuración de precios por slot de tiempo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| venue_id | UUID | FK a venues |
| day_of_week | INT | 0-6 (domingo-sábado) |
| start_time | TIME | Hora de inicio del slot |
| end_time | TIME | Hora de fin del slot |
| slot_duration | INT | Duración en minutos (default: 60) |
| price | DECIMAL(8,2) | Precio para este slot |
| is_premium | BOOLEAN | Si es hora en punto (precio mayor) |
| is_active | BOOLEAN | Si el slot está disponible |
| created_at | TIMESTAMP | Fecha de creación |

#### 6.2.2 venue_policies

Políticas configurables por cancha.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| venue_id | UUID | FK a venues (único) |
| tolerancia_minutos | INT | Minutos de gracia para llegada |
| politica_exceso | ENUM | perder_reserva, penalidad, tiempo_restante, configurable |
| adelanto_minimo | DECIMAL(8,2) | Monto mínimo de adelanto |
| penalidad_monto | DECIMAL(8,2) | Monto de penalidad por exceso |
| cancelacion_horas | INT | Horas de anticipación para cancelar gratis |
| reembolso_porcentaje | INT | Porcentaje de reembolso |
| created_at | TIMESTAMP | Fecha de creación |

#### 6.2.3 promotions

Sistema de promociones y ofertas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| venue_id | UUID | FK a venues |
| nombre | VARCHAR(100) | Nombre de la promoción |
| tipo | ENUM | descuento_porcentual, precio_fijo, combo_horas, combo_productos, recurrencia |
| valor | DECIMAL(8,2) | Valor del descuento o precio fijo |
| dias_aplicables | JSON | Array de días ["lunes", "martes"] |
| horarios | JSON | Array de rangos [{"inicio": "06:00", "fin": "12:00"}] |
| fecha_inicio | DATE | Inicio de vigencia |
| fecha_fin | DATE | Fin de vigencia |
| cupos_maximos | INT | Máximo de usos por día |
| cupos_por_usuario | INT | Máximo de usos por usuario |
| activa | BOOLEAN | Si está activa |
| canchas_aplicables | JSON | Array de venue_ids |
| created_at | TIMESTAMP | Fecha de creación |

#### 6.2.4 slot_templates

Plantillas de horarios reutilizables.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| venue_id | UUID | FK a venues |
| nombre | VARCHAR(100) | Nombre de la plantilla |
| descripcion | TEXT | Descripción opcional |
| config_horarios | JSON | Configuración de horarios |
| config_precios | JSON | Configuración de precios |
| is_active | BOOLEAN | Si está activa |
| created_at | TIMESTAMP | Fecha de creación |

#### 6.2.5 inventory_items

Catálogo de productos y servicios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| venue_id | UUID | FK a venues |
| nombre | VARCHAR(100) | Nombre del producto |
| categoria | ENUM | bebida, snack, deportivo, alquiler, servicio |
| precio | DECIMAL(8,2) | Precio de venta |
| costo | DECIMAL(8,2) | Costo del producto |
| control_stock | BOOLEAN | Si tiene control de inventario |
| stock_actual | INT | Cantidad actual en stock |
| stock_minimo | INT | Alerta de stock bajo |
| activo | BOOLEAN | Si está disponible |
| imagen_url | VARCHAR | URL de la imagen |
| created_at | TIMESTAMP | Fecha de creación |

#### 6.2.6 sales

Registro de ventas extras.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| venue_id | UUID | FK a venues |
| reservation_id | UUID | FK a reservations (opcional) |
| cliente_nombre | VARCHAR(100) | Nombre del cliente |
| cliente_telefono | VARCHAR(20) | Teléfono del cliente |
| productos | JSON | Array de productos vendidos |
| total | DECIMAL(8,2) | Monto total |
| metodo_pago | ENUM | efectivo, tarjeta, yape, plin |
| fecha | DATETIME | Fecha y hora de la venta |
| vendedor_id | UUID | FK a users |
| created_at | TIMESTAMP | Fecha de creación |

#### 6.2.7 promotion_usage

Uso de promociones por reserva.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| promotion_id | UUID | FK a promotions |
| reservation_id | UUID | FK a reservations |
| user_id | UUID | FK a users (opcional) |
| descuento_aplicado | DECIMAL(8,2) | Monto descontado |
| created_at | TIMESTAMP | Fecha de uso |

### 6.3 Modificaciones a Tablas Existentes

#### 6.3.1 reservations (campos nuevos)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| source | ENUM | manual, app |
| cliente_nombre | VARCHAR(100) | Nombre del cliente (reserva manual) |
| cliente_telefono | VARCHAR(20) | Teléfono (reserva manual) |
| cliente_email | VARCHAR(100) | Email (reserva manual) |
| adelanto_pagado | DECIMAL(8,2) | Monto de adelanto |
| saldo_pendiente | DECIMAL(8,2) | Saldo restante |
| estado_pago | ENUM | pending, partial, completed, refunded |
| promotion_id | UUID | FK a promotions (si aplica) |
| observaciones | TEXT | Notas del dueño |

#### 6.3.2 payments (campos nuevos)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| tipo_pago | ENUM | adelanto, saldo, completo |
| metodo_pago | ENUM | culqi, efectivo, tarjeta_local, yape, plin |
| registrado_por | UUID | FK a users |

### 6.4 Detalle de Tablas (Original)

Ver archivo separado: `database/schema.sql`

---

## 7. Flujos de Usuario

### 7.1 Flujo de Reserva desde App Móvil (Fase 2)

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP MÓVIL                                │
├─────────────────────────────────────────────────────────────────┤
│  1. Mapa con canchas                                            │
│         │                                                       │
│         ▼                                                       │
│  2. Preview canchas (al tocar pin)                              │
│         │                                                       │
│         ▼                                                       │
│  3. Detalle de cancha (fotos, servicios, rating)                │
│         │                                                       │
│         ▼                                                       │
│  4. Seleccionar fecha (calendario)                               │
│         │                                                       │
│         ▼                                                       │
│  5. Seleccionar horario (grid visual con precios por slot)      │
│         │                                                       │
│         ▼                                                       │
│  6. Ver promociones disponibles (si aplica)                     │
│         │                                                       │
│         ▼                                                       │
│  7. Agregar productos extras (opcional)                         │
│         │                                                       │
│         ▼                                                       │
│  8. Resumen + precio total + adelanto mínimo                    │
│         │                                                       │
│         ▼                                                       │
│  9. Datos de tarjeta (Culqi) - pagar adelanto o total           │
│         │                                                       │
│         ▼                                                       │
│  10. Confirmar pago                                             │
│         │                                                       │
│         ▼                                                       │
│  11. Pantalla de éxito + QR + compartir WhatsApp                │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Flujo de Reserva Manual (Web Dashboard - Fase 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                      WEB DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│  1. Seleccionar "Nueva Reserva Manual"                          │
│         │                                                       │
│         ▼                                                       │
│  2. Datos del cliente                                           │
│         ├── Nombre (obligatorio)                                │
│         ├── Teléfono (obligatorio)                              │
│         └── Email (opcional)                                    │
│         │                                                       │
│         ▼                                                       │
│  3. Seleccionar cancha                                          │
│         │                                                       │
│         ▼                                                       │
│  4. Seleccionar fecha y horario                                 │
│         │                                                       │
│         ▼                                                       │
│  5. Ver precio calculado según configuración                    │
│         │                                                       │
│         ▼                                                       │
│  6. Aplicar promoción (opcional)                                │
│         │                                                       │
│         ▼                                                       │
│  7. Registrar adelanto                                          │
│         ├── Monto recibido                                      │
│         └── Método de pago (efectivo/tarjeta/yape/plin)         │
│         │                                                       │
│         ▼                                                       │
│  8. Agregar productos extras (opcional)                         │
│         │                                                       │
│         ▼                                                       │
│  9. Confirmar reserva                                           │
│         │                                                       │
│         ▼                                                       │
│  10. Reserva creada + código de confirmación                    │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Flujo de Gestión de Owner

```
┌─────────────────────────────────────────────────────────────────┐
│                      WEB DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│  Login → Dashboard (métricas del día/semana)                    │
│         │                                                       │
│         ├── Canchas → Listado / Crear / Editar                  │
│         │                                                       │
│         ├── Horarios y Precios                                  │
│         │       ├── Configurar slots de 30 min                  │
│         │       ├── Definir precios por slot                    │
│         │       ├── Crear plantillas de horarios                │
│         │       └── Aplicar plantillas a días                   │
│         │                                                       │
│         ├── Promociones                                         │
│         │       ├── Crear promoción                             │
│         │       ├── Configurar días/horarios                    │
│         │       ├── Definir cupos límite                        │
│         │       └── Activar/desactivar                          │
│         │                                                       │
│         ├── Reservas                                            │
│         │       ├── Ver todas / Filtrar por fecha               │
│         │       ├── Crear reserva manual                        │
│         │       ├── Registrar pago de saldo                     │
│         │       └── Marcar llegada del cliente                  │
│         │                                                       │
│         ├── Inventario y Ventas                                 │
│         │       ├── Catálogo de productos                       │
│         │       ├── Control de stock                            │
│         │       ├── Registrar venta                             │
│         │       └── Reportes de ventas                          │
│         │                                                       │
│         ├── Ingresos                                            │
│         │       ├── Gráficos por período                        │
│         │       ├── Desglose reservas vs ventas extras          │
│         │       └── Exportar reportes                           │
│         │                                                       │
│         └── Configuración                                       │
│                 ├── Datos del negocio                           │
│                 ├── Políticas de reserva                        │
│                 │       ├── Tolerancia para llegada             │
│                 │       ├── Política de exceso                  │
│                 │       ├── Adelanto mínimo                     │
│                 │       └── Política de cancelación             │
│                 └── Datos bancarios                             │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Flujo de Configuración de Horarios Flexibles

```
┌─────────────────────────────────────────────────────────────────┐
│              CONFIGURACIÓN DE HORARIOS Y PRECIOS                │
├─────────────────────────────────────────────────────────────────┤
│  1. Seleccionar cancha                                          │
│         │                                                       │
│         ▼                                                       │
│  2. Seleccionar día de la semana                                │
│         │                                                       │
│         ▼                                                       │
│  3. Configurar horario general                                  │
│         ├── Hora apertura                                       │
│         └── Hora cierre                                         │
│         │                                                       │
│         ▼                                                       │
│  4. Configurar precios por slot                                 │
│         ├── Opción A: Precio uniforme para todos los slots      │
│         ├── Opción B: Precio por rango (mañana/tarde/noche)     │
│         └── Opción C: Precio individual por cada slot           │
│         │                                                       │
│         ▼                                                       │
│  5. Preview de configuración                                    │
│         ├── Tabla con todos los slots                           │
│         └── Precio de cada uno                                  │
│         │                                                       │
│         ▼                                                       │
│  6. Guardar o crear plantilla                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 Flujo de Descubrimiento de Promociones (App Móvil)

```
┌─────────────────────────────────────────────────────────────────┐
│              DESCUBRIR PROMOCIONES Y OFERTAS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Opción A: Desde el mapa/listado                               │
│  ─────────────────────────────────────────────────────────────  │
│  1. Ver canchas con badge "Promoción"                          │
│         │                                                       │
│         ▼                                                       │
│  2. Filtrar por "Con ofertas disponibles"                       │
│         │                                                       │
│         ▼                                                       │
│  3. Ver lista de canchas con promociones activas               │
│                                                                 │
│  Opción B: Desde detalle de cancha                             │
│  ─────────────────────────────────────────────────────────────  │
│  1. Entrar a detalle de cancha                                  │
│         │                                                       │
│         ▼                                                       │
│  2. Ver sección "Ofertas disponibles"                          │
│         │                                                       │
│         ▼                                                       │
│  3. Ver lista de promociones activas                           │
│         ├── Nombre de promoción                                │
│         ├── Descuento/precio especial                          │
│         ├── Horarios aplicables                                │
│         ├── Cupos disponibles                                  │
│         └── Vigencia                                           │
│         │                                                       │
│         ▼                                                       │
│  4. Seleccionar "Reservar con esta promoción"                  │
│         │                                                       │
│         ▼                                                       │
│  5. Sistema pre-selecciona horarios aplicables                 │
│         │                                                       │
│         ▼                                                       │
│  6. Continuar flujo de reserva normal                          │
│                                                                 │
│  Opción C: Desde notificación push                             │
│  ─────────────────────────────────────────────────────────────  │
│  1. Recibir notificación de promoción en cancha favorita       │
│         │                                                       │
│         ▼                                                       │
│  2. Tocar notificación                                         │
│         │                                                       │
│         ▼                                                       │
│  3. Ir directo a detalle de cancha con promo destacada         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.6 Flujo de Compra de Productos Extras (App Móvil)

```
┌─────────────────────────────────────────────────────────────────┐
│              AGREGAR PRODUCTOS EXTRAS A RESERVA                 │
├─────────────────────────────────────────────────────────────────┤
│  1. Después de seleccionar horario                              │
│         │                                                       │
│         ▼                                                       │
│  2. Sistema muestra sección "¿Deseas agregar extras?"          │
│         │                                                       │
│         ├── Opción A: Continuar sin extras → Ir al pago        │
│         │                                                       │
│         └── Opción B: Agregar extras                           │
│                 │                                               │
│                 ▼                                               │
│  3. Ver catálogo de productos disponibles                      │
│         │                                                       │
│         ├── Bebidas                                            │
│         │   └─ Agua, Gaseosa, Cerveza (con precios)            │
│         ├── Snacks                                             │
│         │   └─ Papas, Maní, etc.                               │
│         └── Servicios                                          │
│             └─ Alquiler balón, Árbitro, Camerinos              │
│         │                                                       │
│         ▼                                                       │
│  4. Seleccionar cantidad de cada producto                       │
│         │                                                       │
│         ▼                                                       │
│  5. Ver total de extras actualizado en tiempo real             │
│         │                                                       │
│         ▼                                                       │
│  6. Confirmar selección de extras                               │
│         │                                                       │
│         ▼                                                       │
│  7. Ver resumen completo (reserva + extras)                    │
│         │                                                       │
│         ▼                                                       │
│  8. Continuar al pago                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 7.7 Flujo de Pago Parcial (App Móvil)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGO PARCIAL / ADELANTO                      │
├─────────────────────────────────────────────────────────────────┤
│  1. En pantalla de checkout                                     │
│         │                                                       │
│         ▼                                                       │
│  2. Ver opciones de pago                                        │
│         │                                                       │
│         ├── ◉ Pagar total: S/100.00                            │
│         │                                                       │
│         └── ○ Pagar adelanto: S/30.00                          │
│             (Resto S/70.00 se paga en la cancha)               │
│         │                                                       │
│         ▼                                                       │
│  3. Usuario selecciona "Pagar adelanto"                        │
│         │                                                       │
│         ▼                                                       │
│  4. Ver advertencia                                             │
│         ├── "El saldo restante debe pagarse al llegar"         │
│         └── "Lleva el comprobante QR para validar tu reserva"  │
│         │                                                       │
│         ▼                                                       │
│  5. Proceder con pago de S/30.00                               │
│         │                                                       │
│         ▼                                                       │
│  6. Completar pago con Culqi                                    │
│         │                                                       │
│         ▼                                                       │
│  7. Ver confirmación                                            │
│         ├── Estado: "Adelanto confirmado"                      │
│         ├── Saldo pendiente: S/70.00                           │
│         ├── Código QR de validación                            │
│         └── Instrucciones de pago del resto                    │
│         │                                                       │
│         ▼                                                       │
│  8. El día del partido                                          │
│         ├── Presentar QR en la cancha                          │
│         └── Owner marca saldo como pagado                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Integraciones

### 8.1 Culqi

- **API:** REST API v2
- **Endpoints:** Órdenes, Cargos, Reembolsos
- **Webhooks:** Confirmación de pagos
- **Seguridad:** Tokens RSA

### 8.2 Google Sign-In

- **OAuth 2.0** para autenticación
- **Scopes:** profile, email

### 8.3 Almacenamiento

- **Cloudinary** o **AWS S3** para imágenes
- Fotos de canchas, avatares, reseñas

### 8.4 Email

- **SendGrid** o **AWS SES** para transaccionales
- Bienvenida, confirmación, recuperación, notificaciones

---

## 9. Plan de Implementación

### Fase 1: Web Dashboard para Dueños (Meses 1-3)

#### Mes 1: Fundación Web

| Semana | Backend | Web Dashboard |
|--------|---------|---------------|
| 1 | Arquitectura, servidor, DB | Diseño UI/UX |
| 2 | Users, Roles, Venues | Login, Panel básico |
| 3 | Schedules, Time Slots, Disponibilidad | Crear/editar cancha, horarios flexibles |
| 4 | Venue Policies, Bloqueos | Configuración de políticas, bloqueos |

**Meta:** Sistema de gestión de canchas funcionando

#### Mes 2: Reservas Manuales e Inventario

| Semana | Funcionalidad |
|--------|---------------|
| 5 | Sistema de reservas manuales (sin app) |
| 6 | Sistema de pagos parciales y registro de pagos |
| 7 | Inventario y ventas extras |
| 8 | Promociones y ofertas |

**Meta:** Dashboard completo para gestión independiente

#### Mes 3: Polishing y Lanzamiento Web

| Semana | Funcionalidad |
|--------|---------------|
| 9 | Sistema de tolerancia y políticas |
| 10 | Reportes y métricas avanzadas |
| 11 | Bug fixing + optimización |
| 12 | Lanzamiento web para dueños |

**Meta:** Web dashboard 100% funcional e independiente

### Fase 2: App Móvil para Jugadores (Meses 4-6)

#### Mes 4: App Móvil - Fundación

| Semana | Backend | App Móvil |
|--------|---------|-----------|
| 13 | API endpoints para app | Diseño UI/UX |
| 14 | Geolocalización, búsqueda | Login, registro |
| 15 | Integración con horarios flexibles | Mapa, listado canchas |
| 16 | Sistema de promociones en app | Detalle cancha, selector horario |

**Meta:** App básica funcionando

#### Mes 5: Pagos y Reservas

| Semana | Funcionalidad |
|--------|---------------|
| 17 | Prevención doble reserva |
| 18 | Integración Culqi + Webhooks |
| 19 | Pagos parciales desde app |
| 20 | Pre-venta de productos |

**Meta:** Reserva con pago real desde app

#### Mes 6: Beta y Red Social

| Semana | Funcionalidad |
|--------|---------------|
| 21 | Reseñas y calificaciones |
| 22 | Conexiones entre usuarios |
| 23 | Testing completo |
| 24 | Lanzamiento beta |

**Meta:** App móvil lista para usuarios

### Fase 3: Funcionalidades Avanzadas (Meses 7+)

- Reservas recurrentes (torneos y ligas)
- Más pasarelas de pago (Yape, Plin)
- Sistema de referidos
- Notificaciones SMS
- Múltiples idiomas

---

## 10. KPIs de Éxito

### Fase 1 - Web Dashboard

| Indicador | Objetivo |
|-----------|----------|
| Dueños registrados | ≥ 20 |
| Canchas configuradas | ≥ 30 |
| Reservas manuales creadas | ≥ 100 |
| Uso de sistema de promociones | ≥ 50% de dueños |
| Uso de inventario/ventas | ≥ 70% de dueños |

### Fase 2 - App Móvil

| Indicador | Objetivo |
|-----------|----------|
| Usuarios registrados | ≥ 500 |
| Reservas desde app | ≥ 200 |
| Doble reserva | 0 casos |
| Pagos confirmados | 100% |
| Tasa de uso de promociones | ≥ 30% |

### Generales

| Indicador | Objetivo |
|-----------|----------|
| Disponibilidad | 99.5% |
| Tiempo respuesta | < 2 segundos |
| Satisfacción dueños | ≥ 4/5 |
| Satisfacción usuarios | ≥ 4/5 |

---

## 11. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Dueños no adoptan dashboard | Media | Alto | Onboarding guiado, soporte cercano, reservas manuales fáciles |
| Configuración horarios muy compleja | Media | Medio | Plantillas predefinidas, asistente de configuración |
| Retraso en integración Culqi | Media | Alto | Mock de pagos desde inicio |
| Doble reserva por concurrencia | Baja | Alto | Transacciones atómicas, testing exhaustivo |
| Geolocalización imprecisa (Fase 2) | Baja | Medio | Fallback a búsqueda manual |
| Problemas de rendimiento | Baja | Alto | Caché Redis, índices adecuados |
| Inventario difícil de usar | Media | Medio | Interfaz simple, control de stock opcional |

---

## 12. Glosario

| Término | Definición |
|---------|------------|
| Owner | Dueño de una o más canchas |
| Venue | Cancha de fútbol |
| Reservation | Reserva de un horario específico |
| Blocking | Bloqueo manual de horario |
| Time Slot | Franja horaria configurable (ej: 3:00 PM, 3:30 PM) |
| Review | Reseña/calificación de una cancha |
| Connection | Conexión entre usuarios (red social) |
| Culqi | Pasarela de pago peruana |
| QR Code | Código QR de validación de reserva |
| Pago parcial | Adelanto mínimo para confirmar reserva |
| Promoción | Oferta especial para horarios de baja demanda |
| Inventario | Sistema de productos y servicios extras |

---

**Documento preparado para desarrollo**  
*Versión 2.0 - Marzo 2026*

---

## 13. Historial de Cambios

### Versión 2.0 - Marzo 2026

**Nuevas funcionalidades para Dueños de Canchas:**
- D10: Sistema de horarios flexibles con precios por slot de 30 min
- D11: Configuración de tolerancia para llegada (tiempo de gracia)
- D12: Sistema de promociones para horarios de baja demanda
- D13: Sistema de inventario y ventas extras (productos y servicios)
- D14: Sistema de pagos parciales/adelantos configurables
- D15: Políticas de reserva personalizables por cancha
- D16: Sistema de reservas manuales (independiente de app móvil)

**Nuevas funcionalidades para Jugadores (App Móvil):**
- F13: Visualización de precios diferenciados por slot de horario
- F14: Descubrir y aplicar promociones/ofertas disponibles
- F15: Agregar productos extras y servicios a la reserva (pre-venta)
- F16: Opción de pago parcial (adelanto mínimo) o pago total
- F17: Ver información de políticas de la cancha (tolerancia, cancelación)
- F18: Ver descuentos aplicados en el resumen de reserva

**Cambios estructurales:**
- Reorganización en 3 fases de lanzamiento (Web primero, App después)
- Sistema web 100% funcional sin app móvil
- 7 nuevas tablas en el modelo de datos
- Flujos de usuario actualizados y expandidos
- 13 nuevos tipos de notificaciones push

**Secciones técnicas agregadas:**
- 4.9: Sistema de Horarios y Precios Flexibles
- 4.10: Sistema de Tolerancia para Llegada
- 4.11: Sistema de Promociones y Ofertas
- 4.12: Sistema de Inventario y Ventas Extras
- 4.13: Sistema de Pagos Parciales y Adelantos
- 4.14: Sistema de Reservas Manuales
- 4.8.3: Experiencia de Usuario en App Móvil

**Flujos de usuario agregados:**
- 7.5: Flujo de Descubrimiento de Promociones
- 7.6: Flujo de Compra de Productos Extras
- 7.7: Flujo de Pago Parcial

### Versión 1.0 - Febrero 2026
- Versión inicial del documento
