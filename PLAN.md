# TurniX — Plan de Desarrollo

> SaaS de gestión de turnos para negocios.  
> **Stack:** React + TypeScript + Tailwind + Vite | NestJS + TypeScript | PostgreSQL + Prisma | JWT

---

## Progreso del proyecto

**Sprint 0:** ██████████ 12/12 tareas  
**Sprint 1:** ████████████ 12/12 tareas  
**Sprint 2:** ██████████ 7/7 tareas  
**Sprint 3:** ██████████ 7/7 tareas  
**Sprint 3.5:** ████████████ 11/11 tareas  
**Sprint 4:** ██████████ 9/9 tareas  
**Sprint 5:** ██████████ 9/9 tareas  
**Sprint 6:** ██████████ 9/9 tareas  
**Sprint 7:** ██████████ 4/4 tareas  
**Sprint 8:** ██████████ 8/9 tareas  
**Sprint 9:** ████████████ 10/10 tareas  
**Sprint 10:** ░░░░░░░░░░ 0/4 tareas  
**Sprint 11:** ░░░░░░░░░░ 0/8 tareas  

**Total:** ████████░░ 98/111 tareas — 88%

---

## Índice

- [Arquitectura General](#arquitectura-general)
- [Sprints](#sprints)
  - [Sprint 0: Inicialización de proyectos](#sprint-0-inicialización-de-proyectos)
  - [Sprint 1: Base de datos + Autenticación](#sprint-1-base-de-datos--autenticación)
  - [Sprint 2: Módulos core (Users, Professionals, Services, Availability)](#sprint-2-módulos-core-users-professionals-services-availability)
  - [Sprint 3: Módulo Appointments + Lógica de disponibilidad](#sprint-3-módulo-appointments--lógica-de-disponibilidad)
  - [Sprint 4: Frontend — Landing + Auth + Agendar turno](#sprint-4-frontend--landing--auth--agendar-turno)
  - [Sprint 5: Dashboard ADMIN completo](#sprint-5-dashboard-admin-completo)
  - [Sprint 6: Dashboard — Estadísticas y gráficos](#sprint-6-dashboard--estadísticas-y-gráficos)
  - [Sprint 7: Perfil de cliente + Mis turnos](#sprint-7-perfil-de-cliente--mis-turnos)
  - [Sprint 8: Pulido final, responsive, edge cases](#sprint-8-pulido-final-responsive-edge-cases)
  - [Sprint 9: Despliegue](#sprint-9-despliegue)
- [Modelo de datos completo](#modelo-de-datos-completo)
- [API endpoints finales](#api-endpoints-finales)
- [Árbol de archivos final](#árbol-de-archivos-final)

---

## Arquitectura General

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  React+Vite  │HTTP │  NestJS+Prisma│    │              │
│  Tailwind    │◀────│  JWT Auth    │◀────│              │
└──────────────┘     └──────────────┘     └──────────────┘
```

- **Monorepo** con npm workspaces
- Frontend en `frontend/`, Backend en `backend/`
- Comunicación vía REST API
- Autenticación con JWT (access token)
- Roles: `ADMIN` (dueño del negocio) y `CLIENT` (cliente que reserva)

---

## Origen del Frontend (Figma)

Los diseños fueron creados en Figma y exportados como proyecto React + Vite + Tailwind v4 + shadcn/ui.  
Están en la carpeta `makeup/` y de ahí se adaptan a nuestro frontend.

**Qué contiene `makeup/`:**

| Archivo | Contenido | Destino en frontend |
|---|---|---|
| `src/styles/theme.css` | Design tokens (colores, radius, fuentes) | `frontend/src/styles/globals.css` |
| `src/app/components/LandingPage.tsx` | Landing + booking flow completo (5 pasos) | `frontend/src/pages/Landing.tsx` + `components/appointments/*` |
| `src/app/components/AdminDashboard.tsx` | Dashboard con sidebar, gráficos, tabla de turnos | `frontend/src/pages/Dashboard/*` |
| `src/app/components/ui/*` | 48 componentes shadcn/ui | `frontend/src/components/ui/*` (solo los que usemos) |
| `.vite.config.ts` | Vite + @tailwindcss/vite + alias @/ | Se copia la config |
| `package.json` | Dependencias (incluye MUI que no usaremos) | Se toma lo necesario (shadcn, recharts, lucide, radix) |

**Adaptación necesaria:**
- Partir componentes monolíticos en archivos individuales
- Reemplazar datos mock por llamadas API al backend
- Agregar Login / Register / AuthContext (no existen en makeup)
- Configurar React Router (instalado pero sin usar en makeup)
- Eliminar dependencias no necesarias (MUI)

---

## Sprints

---

### Sprint 0: Inicialización de proyectos

**Duración estimada:** 1 sesión

| # | Tarea | Archivos involucrados | ✓ |
|---|---|---|---|
| 0.1 | Inicializar NestJS en `backend/` | `backend/package.json`, `backend/src/main.ts` | ✓ |
| 0.2 | Configurar Prisma + conexión a PostgreSQL | `backend/prisma/schema.prisma`, `.env` | ✓ |
| 0.3 | Crear migración inicial con todas las tablas | `backend/prisma/migrations/` | ✓ |
| 0.4 | Inicializar Vite + React + TS en `frontend/` | `frontend/package.json` | ✓ |
| 0.5 | Configurar Tailwind v4 vía `@tailwindcss/vite` (copiando config de `makeup/vite.config.ts` en 0.10, no necesita archivos separados) | `frontend/vite.config.ts` | ✓ |
| 0.6 | Crear esqueleto de Axios client (sin interceptors JWT aún — se agregan en Sprint 1 cuando exista AuthContext) | `frontend/src/api/client.ts` | ✓ |
| 0.7 | Configurar variables de entorno | `.env` en backend y frontend | ✓ |
| 0.8 | **Copiar design tokens** de `makeup/src/styles/theme.css` a `frontend/src/styles/globals.css` | `frontend/src/styles/globals.css` | ✓ |
| 0.9 | **Copiar componentes shadcn/ui** de `makeup/src/app/components/ui/` a `frontend/src/components/ui/` | `frontend/src/components/ui/` | ✓ |
| 0.10 | **Copiar y adaptar** `vite.config.ts` desde `makeup/` (alias @, plugin tailwind) | `frontend/vite.config.ts` | ✓ |
| 0.11 | **Instalar dependencias frontend** desde `makeup/package.json` (shadcn, recharts, lucide, radix, react-router, date-fns) | `frontend/package.json` | ✓ |
| 0.12 | **Eliminar dependencias no necesarias** de makeup: MUI (`@mui/*`, `@emotion/*`), react-slick, react-dnd, y otras no usadas | `frontend/package.json` | ✓ |

**Checklist de finalización:**
- [x] `npm run dev` en backend arranca sin errores
- [x] `npx prisma migrate dev` crea las tablas en PostgreSQL
- [x] `npm run dev` en frontend muestra pantalla de Vite + Tailwind
- [x] Design tokens y shadcn/ui copiados desde `makeup/`
- [x] Dependencias correctas (sin MUI)

---

### Sprint 1: Base de datos + Autenticación

**Duración estimada:** 1-2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|
| 1.1 | Crear módulo `Auth` (register + login) | `backend/src/auth/` | ✓ |
| 1.2 | Implementar `passport-jwt` strategy | `backend/src/auth/strategies/jwt.strategy.ts` | ✓ |
| 1.3 | Crear `RolesGuard` (ADMIN / CLIENT) | `backend/src/auth/guards/roles.guard.ts` | ✓ |
| 1.4 | Crear decorator `@Roles()` y `@CurrentUser()` | `backend/src/common/decorators/` | ✓ |
| 1.5 | Crear DTOs de Register y Login | `backend/src/auth/dto/` | ✓ |
| 1.6 | Hashear passwords con bcrypt | `backend/src/auth/auth.service.ts` | ✓ |
| 1.7 | Login devuelve JWT | `backend/src/auth/auth.service.ts` | ✓ |
| 1.8 | Endpoints: `POST /auth/register`, `POST /auth/login` | `backend/src/auth/auth.controller.ts` | ✓ |
| 1.9 | Frontend: Página de Login + Register | `frontend/src/pages/Login.tsx`, `Register.tsx` | ✓ |
| 1.10 | Frontend: AuthContext + persistencia del token | `frontend/src/context/AuthContext.tsx` | ✓ |
| 1.11 | Frontend: Hook `useAuth` | `frontend/src/hooks/useAuth.ts` | ✓ |
| 1.12 | Proteger rutas del frontend (ADMIN/CLIENT) | `frontend/src/components/layout/ProtectedRoute.tsx` | ✓ |

**Checklist de finalización:**
- [x] BACKEND: Register + Login funcionan con JWT
- [x] FRONTEND: Login y Register pages funcionales
- [x] FRONTEND: AuthContext persiste token en localStorage
- [x] FRONTEND: Rutas protegidas redirigen si no hay token

**Reglas de negocio:**
- Al registrarse, el rol por defecto es `CLIENT`
- Solo un usuario `ADMIN` puede crear otros admins (desde dashboard)
- El JWT expira en 24h

---

### Sprint 2: Módulos core (Users, Professionals, Services, Availability)

**Duración estimada:** 1-2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|
| 2.1 | Módulo `Users`: CRUD + perfil | `backend/src/users/` | ✓ |
| 2.2 | Módulo `Professionals`: CRUD | `backend/src/professionals/` | ✓ |
| 2.3 | Módulo `Services`: CRUD | `backend/src/services/` | ✓ |
| 2.4 | Módulo `Availability`: CRUD | `backend/src/availability/` | ✓ |
| 2.5 | Validar que Availability no tenga overlaps | `backend/src/availability/availability.service.ts` | ✓ |
| 2.6 | Proteger rutas ADMIN (professionals, services, availability) | Guards en controllers | ✓ |
| 2.7 | Seed data inicial para pruebas | `backend/prisma/seed.ts` | ✓ |

**Endpoints:**

```
Professionals (ADMIN)
  POST   /professionals
  GET    /professionals
  GET    /professionals/:id
  PATCH  /professionals/:id
  DELETE /professionals/:id         ← borrado lógico (isActive = false)

Services (ADMIN)
  POST   /services
  GET    /services          ← público (para landing)
  GET    /services/:id
  PATCH  /services/:id
  DELETE /services/:id

Availability (ADMIN)
  POST   /availability        (body: { professionalId, dayOfWeek, startTime, endTime })
  GET    /availability/professional/:professionalId
  PATCH  /availability/:id
  DELETE /availability/:id

Users
  GET    /users               ← ADMIN (lista todos)
  GET    /users/:id           ← ADMIN

Auth
  GET    /auth/profile        ← autenticado (perfil propio)
  PATCH  /auth/profile        ← autenticado (editar perfil propio)
```

**Checklist de finalización:**
- [x] BACKEND: Todos los endpoints CRUD funcionando
- [x] BACKEND: Availability valida overlaps
- [x] BACKEND: Soft delete en professionals
- [x] BACKEND: Seed data poblada en DB
- [x] BACKEND: Endpoints públicos filtran isActive

**Reglas de negocio:**
- Un `Professional` se crea vinculado a un `User` existente con rol `CLIENT` (el user existe primero, luego se le asigna profesional)
- `Availability` permite múltiples bloques por día (ej: 9-12 y 14-18 para el almuerzo)
- `dayOfWeek`: 0=Domingo, 1=Lunes ... 6=Sábado
- El `DELETE /professionals/:id` es **borrado lógico**: `prisma.professional.update({ data: { isActive: false } })` en vez de `delete()`
- Los endpoints públicos filtran con `where: { isActive: true }`

---

### Sprint 3: Módulo Appointments + Lógica de disponibilidad

**Duración estimada:** 2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|---|
| 3.1 | Módulo `Appointments`: CRUD | `backend/src/appointments/` | ☑ |
| 3.2 | Crear endpoint `GET /appointments/available` | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.3 | Implementar lógica de cruce: Availability vs Appointments existentes | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.4 | Validar que turno no se superponga con otro existente | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.5 | Al crear turno, copiar `durationMinutes` y `price` desde `Service`, luego calcular `endTime` | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.6 | Endpoints de cambio de estado (confirmar/cancelar) | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.7 | Validar que solo ADMIN pueda confirmar, CLIENT pueda cancelar su propio turno | Guards + lógica en service | ☑ |

**Reglas de negocio:**
- Un cliente solo puede ver/modificar sus propios turnos
- El ADMIN puede ver todos los turnos y cambiar cualquier estado
- No se puede agendar en un horario ya ocupado
- No se puede agendar en un horario fuera del Availability del profesional
- Al crear turno: `durationMinutes = service.durationMinutes` y `price = service.price` (se copian, no referencian)
- `endTime = startTime + durationMinutes` (usa el valor congelado, no el actual del servicio)
- Estado de Appointment: `PENDING` (al crearlo) → `CONFIRMED` (ADMIN) o `CANCELLED` (ADMIN o CLIENT)

**Endpoint de disponibilidad:**
```
GET /appointments/available?professionalId=X&date=YYYY-MM-DD
```
Respuesta:
```json
{
  "date": "2026-06-15",
  "professionalId": 1,
  "slots": [
    { "startTime": "09:00", "endTime": "09:30" },
    { "startTime": "09:30", "endTime": "10:00" },
    ...
  ]
}
```

**Checklist de finalización:**
- [x] BACKEND: Crear turno copia durationMinutes y price
- [x] BACKEND: Endpoint /available devuelve slots libres correctos
- [x] BACKEND: No permite overlaps
- [x] BACKEND: Cambio de estados funciona con roles

**Lógica:**
1. Obtener Availability del profesional para ese `dayOfWeek`
2. Obtener los turnos existentes para ese profesional en esa fecha
3. Generar slots de `durationMinutes` dentro de cada bloque de Availability
4. Filtrar slots que colisionan con turnos existentes
5. Devolver slots libres

---

### Sprint 3.5: Sistema de validaciones profesional

**Duración estimada:** 1 sesión

| # | Tarea | Archivos | ✓ |
|---|---|---|---|
| 3.5.1 | `@IsEmail()`, `@MinLength(6)` y `@Matches()` en DTOs de Auth | `backend/src/auth/dto/register.dto.ts` | ☑ |
| 3.5.2 | `@IsDateString()`, `@Matches(/^\d{2}:\d{2}$/)` en CreateAppointmentDto y QueryAvailableDto | `backend/src/appointments/dto/` | ☑ |
| 3.5.3 | Validación `startTime < endTime` en CreateAvailabilityDto (custom validator) | `backend/src/availability/dto/` | ☑ |
| 3.5.4 | Rechazar fecha pasada en `appointments.create` | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.5.5 | Validar que un CLIENT no tenga turno overlapping en `appointments.create` | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.5.6 | Al confirmar PENDING, verificar que no haya overlap con otros CONFIRMED | `backend/src/appointments/appointments.service.ts` | ☑ |
| 3.5.7 | Validar `startTime < endTime` en `availability.create` service | `backend/src/availability/availability.service.ts` | ☑ |
| 3.5.8 | Deshabilitar botón "Reservar" durante envío en BookingConfirmation | `frontend/src/components/appointments/BookingConfirmation.tsx` | ☑ |
| 3.5.9 | Mostrar error del backend en BookingConfirmation (no solo toast) | `frontend/src/components/appointments/BookingConfirmation.tsx` | ☑ |
| 3.5.10 | Validar email format + password min length en Login/Register forms | `frontend/src/pages/Login.tsx`, `Register.tsx` | ☑ |
| 3.5.11 | Validar price > 0 y duration > 0 en Services dialog | `frontend/src/pages/Dashboard/Services.tsx` | ☑ |

**Checklist de finalización:**
- [x] BACKEND: Todos los DTOs con validaciones class-validator completas
- [x] BACKEND: No se puede crear turno en fecha pasada
- [x] BACKEND: No se puede crear turno que solape con otro del mismo cliente o profesional
- [x] BACKEND: No se puede confirmar turno si hay conflicto con otros CONFIRMED
- [x] BACKEND: No se puede crear bloque horario con start >= end
- [x] FRONTEND: Doble submit prevenido en BookingFlow
- [x] FRONTEND: Errores del backend visibles en pantalla (no solo toast)
- [x] FRONTEND: Validación de email/password en Login/Register

---

### Sprint 4: Frontend — Landing + Auth + Agendar turno

**Duración estimada:** 2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|---|
| 4.1 | **Adaptar** LandingPage.tsx desde `makeup/`: partir el monolito en componentes individuales | `frontend/src/pages/Landing.tsx` | ☑ |
| 4.2 | **Extraer** ServiceSelector, ProfessionalSelector, DatePickerStep, TimeSlotPicker, BookingConfirmation, BookingFlow, Row desde `makeup/LandingPage.tsx` | `frontend/src/components/appointments/*` | ☑ |
| 4.3 | Conectar paso 1: Servicios desde la API (`GET /services`) | `frontend/src/components/appointments/ServiceSelector.tsx` | ☑ |
| 4.4 | Conectar paso 2: Profesionales desde la API (`GET /professionals`) | `frontend/src/components/appointments/ProfessionalSelector.tsx` | ☑ |
| 4.5 | Conectar paso 3: Calendario con días disponibles | `frontend/src/components/appointments/DatePicker.tsx` | ☑ |
| 4.6 | Conectar paso 4: Slots libres desde la API (`GET /appointments/available`) | `frontend/src/components/appointments/TimeSlotPicker.tsx` | ☑ |
| 4.7 | Conectar paso 5: Confirmar turno (`POST /appointments`) | `frontend/src/components/appointments/BookingConfirmation.tsx` + `BookingFlow.tsx` | ☑ |
| 4.8 | Diseño responsive con Tailwind (ya viene de makeup, solo ajustar) | Todos los componentes | ☑ |
| 4.9 | Estados: loading, empty, error en cada paso | Todos los componentes | ☑ |

**Checklist de finalización:**
- [x] FRONTEND: Landing con hero, features, booking flow
- [x] FRONTEND: 5 pasos del booking funcionando con datos reales de la API
- [x] FRONTEND: Loading/empty/error states en cada paso

**Flujo de agendamiento:**
```
Landing → Elegir servicio → Elegir profesional → Elegir fecha → Elegir horario → Confirmar → Login/Register (si no está logueado) → Turno creado ✓
```

**Componente clave: BookingFlow**
```typescript
// Estado del flujo
interface BookingState {
  service: Service | null
  professional: Professional | null
  date: string | null
  timeSlot: { startTime: string; endTime: string } | null
  step: 'service' | 'professional' | 'date' | 'time' | 'confirm' | 'done'
}
```

---

### Sprint 5: Dashboard ADMIN completo

**Duración estimada:** 2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|---|
| 5.1 | **Adaptar** `AdminDashboard.tsx` desde `makeup/`: extraer Sidebar + Header + layout base con `<Outlet />` | `frontend/src/components/layout/DashboardLayout.tsx` | ☑ |
| 5.2 | **Extraer** stats, gráficos y tabla de próximos turnos desde `makeup/AdminDashboard.tsx` | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 5.3 | CRUD de Profesionales (tabla + modal) conectar a `GET/POST/PATCH/DELETE /professionals` | `frontend/src/pages/Dashboard/Professionals.tsx` | ☑ |
| 5.4 | CRUD de Servicios (tabla + modal) conectar a `GET/POST/PATCH/DELETE /services` | `frontend/src/pages/Dashboard/Services.tsx` | ☑ |
| 5.5 | CRUD de Availability (por profesional) conectar a `GET/POST/DELETE /availability` | `frontend/src/pages/Dashboard/AvailabilityPage.tsx` | ☑ |
| 5.6 | Gestión de turnos (tabla con filtros + cambio de estado) conectar a `GET/PATCH /appointments` | `frontend/src/pages/Dashboard/AppointmentsManager.tsx` | ☑ |
| 5.7 | Lista de clientes conectar a `GET /users` | `frontend/src/pages/Dashboard/Clients.tsx` | ☑ |
| 5.8 | Navegación del sidebar con React Router + rutas anidadas | `frontend/src/App.tsx` | ☑ |
| 5.9 | API helpers: dashboard.ts con CRUD de servicios, profesionales, availability, usuarios | `frontend/src/api/dashboard.ts` | ☑ |

**Checklist de finalización:**
- [x] FRONTEND: Sidebar + DashboardLayout funcional con React Router
- [x] FRONTEND: CRUD Professionals conectado a API
- [x] FRONTEND: CRUD Services conectado a API
- [x] FRONTEND: CRUD Availability conectado a API
- [x] FRONTEND: Lista de turnos con cambios de estado
- [x] FRONTEND: Lista de clientes

**Navegación del dashboard:**
```
/dashboard
├── /                    → Home (resumen)
├── /turnos              → Todos los turnos (CRUD + estados)
├── /profesionales       → CRUD profesionales
├── /servicios           → CRUD servicios
├── /horarios            → Availability por profesional
└── /clientes            → Lista de clientes registrados
```

---

### Sprint 6: Dashboard — Estadísticas y gráficos

**Duración estimada:** 1-2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|---|
| 6.1 | Endpoint `GET /dashboard/stats` en backend con JWT+ADMIN guard | `backend/src/dashboard/dashboard.service.ts` + `dashboard.controller.ts` | ☑ |
| 6.2 | Tarjetas de resumen conectadas a datos reales (turnos hoy, ingresos, clientes) | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.3 | Gráfico: Turnos de la semana (barras) con datos reales | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.4 | Gráfico: Ingresos últimos 30 días (línea) — datos reales desde backend | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.5 | Gráfico: Top servicios (donut) con datos reales desde backend | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.6 | Gráfico: Rendimiento de profesionales (barras horizontales) con datos reales | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.7 | Timeline de turnos de hoy con datos reales | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.8 | Tabla de próximos turnos (siguientes 10) con datos reales | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |
| 6.9 | Filtro de rango (hoy / semana / mes) conectado al endpoint | `frontend/src/pages/Dashboard/DashboardHome.tsx` | ☑ |

**Checklist de finalización:**
- [ ] BACKEND: Endpoint /dashboard/stats funcionando con datos reales
- [ ] FRONTEND: Tarjetas de resumen con datos reales
- [ ] FRONTEND: Gráficos (barras, línea, donut) con datos reales
- [ ] FRONTEND: Filtro de rango funcional

**Endpoint:**
```
GET /dashboard/stats?range=week|month
```

Respuesta:
```typescript
{
  todayAppointments: number
  todayRevenue: number
  newClientsThisWeek: number
  confirmationRate: number
  weeklyAppointments: { day: string; confirmed: number; pending: number; cancelled: number }[]
  monthlyRevenue: { date: string; amount: number }[]
  topServices: { name: string; count: number; revenue: number }[]
  professionalPerformance: { name: string; appointments: number; revenue: number }[]
  todayTimeline: { time: string; client: string; service: string; status: string }[]
  upcomingAppointments: Appointment[]
}
```

**Librerías:** `recharts` para gráficos.

---

### Sprint 7: Perfil de cliente + Mis turnos

**Duración estimada:** 1 sesión

| # | Tarea | Archivos | ✓ |
|---|---|---|---|---|
| 7.1 | Vista "Mis Turnos" para CLIENT con turnos activos e historial | `frontend/src/pages/MisTurnos.tsx` + `frontend/src/App.tsx` | ☑ |
| 7.2 | El cliente puede cancelar sus turnos (solo PENDING) | `frontend/src/pages/MisTurnos.tsx` | ☑ |
| 7.3 | Perfil de usuario (editar nombre, email) con endpoint `PATCH /auth/profile` | `frontend/src/pages/Profile.tsx` + `frontend/src/api/auth.ts` | ☑ |
| 7.4 | Historial de turnos pasados del cliente | `frontend/src/pages/MisTurnos.tsx` | ☑ |

**Checklist de finalización:**
- [x] FRONTEND: Vista Mis Turnos con turnos activos e historial
- [x] FRONTEND: Cancelación de turnos (solo PENDING)
- [x] FRONTEND: Perfil de usuario editable

**Reglas:**
- Un CLIENT solo puede cancelar turnos en estado `PENDING`
- Un CLIENT no puede modificar turnos ya `CONFIRMED`
- El historial muestra turnos pasados con estado final

---

### Sprint 8: Pulido final, responsive, edge cases

**Duración estimada:** 1-2 sesiones

| # | Tarea | ✓ |
|---|---|---|---|
| 8.1 | Manejo global de errores en frontend (toast notifications) — Sonner en App.tsx | ☑ |
| 8.2 | Loading skeletons en todas las vistas (Skeleton component) | ☑ |
| 8.3 | Estados vacíos (EmptyState component con icono y acción) | ☑ |
| 8.4 | Responsive design: sidebar como drawer en mobile | ☑ |
| 8.5 | Validaciones extra en formularios (botones disabled si inválido) | ☑ |
| 8.6 | Manejo de expired JWT → redirect a /login (Axios interceptor) | ☑ |
| 8.7 | Proteger rutas del frontend (ADMIN vs CLIENT con ProtectedRoute) | ☑ |
| 8.8 | Global exception filter en backend (formato JSON consistente) | ☑ |
| 8.9 | Paginación en endpoints con muchos resultados | ☐ |

**Checklist de finalización:**
- [x] FRONTEND: Toasts funcionando en toda la app
- [x] FRONTEND: Loading skeletons en todas las vistas
- [x] FRONTEND: Diseño responsive mobile-tablet-desktop
- [x] BACKEND: Exception filters globales
- [x] FULLSTACK: JWT expirado redirige a login

---

### Sprint 9: Sistema de notificaciones real-time (SSE)

**Duración estimada:** 1-2 sesiones

| # | Tarea | Archivos | ✓ |
|---|---|---|---|
| 9.1 | Agregar modelo `Notification` a Prisma + migración | `backend/prisma/schema.prisma` | ☑ |
| 9.2 | `NotificationsService` — crear, listar, marcar leídas, unread count | `backend/src/notifications/notifications.service.ts` | ☑ |
| 9.3 | `NotificationsController` — GET, PATCH read, POST read-all, GET unread-count | `backend/src/notifications/notifications.controller.ts` | ☑ |
| 9.4 | Endpoint SSE `GET /notifications/stream` (conexión persistente tiempo real) | `backend/src/notifications/notifications.controller.ts` | ☑ |
| 9.5 | Integrar `NotificationsService.create()` en AppointmentsService (al crear turno y al cambiar status) | `backend/src/appointments/appointments.service.ts` | ☑ |
| 9.6 | Hook `useNotifications` (abre SSE al montar, expone `notifications[]`, `unreadCount`, `markRead`, `markAllRead`) | `frontend/src/hooks/useNotifications.ts` | ☑ |
| 9.7 | Componente `NotificationBell` (ícono + badge + dropdown con lista + acción marcar leída) | `frontend/src/components/notifications/NotificationBell.tsx` | ☑ |
| 9.8 | Reemplazar campana decorativa en DashboardLayout y Landing navbar | `frontend/src/components/layout/DashboardLayout.tsx`, `frontend/src/pages/Landing.tsx` | ☑ |
| 9.9 | Desktop notifications (permiso + disparo cuando pestaña inactiva) | `frontend/src/hooks/useNotifications.ts` | ☑ |
| 9.10 | Sonner toast al recibir notificación SSE mientras app activa | `frontend/src/hooks/useNotifications.ts` | ☑ |

**Reglas de notificaciones:**

| Evento | Mensaje | Destinatario |
|---|---|---|
| CLIENT crea turno | "Nuevo turno — [cliente] reservó [servicio] con [profesional] el [fecha] a las [hora]" | ADMIN |
| ADMIN confirma | "Tu turno del [fecha] a las [hora] fue confirmado ✅" | CLIENT dueño |
| ADMIN cancela | "Tu turno del [fecha] a las [hora] fue cancelado ❌" | CLIENT dueño |
| CLIENT cancela propio | "[Cliente] canceló su turno del [fecha] a las [hora]" | ADMIN |

**Checklist de finalización:**
- [x] BACKEND: Modelo Notification + migración
- [x] BACKEND: CRUD notificaciones + SSE stream endpoint
- [x] BACKEND: Notificaciones se crean automáticamente al crear/confirmar/cancelar turnos
- [x] FRONTEND: SSE conexión viva, tiempo real sin polling
- [x] FRONTEND: Badge rojo con contador actualizado
- [x] FRONTEND: Dropdown con últimas notificaciones, clic → marcar leída + navegar al turno
- [x] FRONTEND: Desktop notification si la pestaña está en segundo plano
- [x] FRONTEND: Sonner toast si la app está activa

---

### Sprint 10: Polish Élite

**Duración estimada:** 1 sesión

| # | Tarea | ✓ |
|---|---|---|
| 10.1 | BACKEND: Seed mejorado — admin con contraseña distinta, 4 profesionales con avatars (UI Avatars), 5 servicios, ~50 turnos históricos en últimos 30 días | ☐ |
| 10.2 | BACKEND: Swagger — instalar @nestjs/swagger, configurar DocumentBuilder en main.ts, ruta /api/docs | ☐ |
| 10.3 | FRONTEND: Botones "Ingresar como Admin (Demo)" y "Ingresar como Cliente (Demo)" en Login.tsx con 1 clic | ☐ |
| 10.4 | DOCS: README.md profesional en raíz con badges, tech stack, screenshots, setup instructions, botón demo | ☐ |

**Checklist de finalización:**
- [ ] Seed genera datos que llenan los gráficos del Dashboard desde el primer día
- [ ] Swagger accesible en /api/docs con todos los endpoints documentados
- [ ] Login con 1 clic para demo admin y demo cliente
- [ ] README.md presentable en GitHub

---

### Sprint 11: Despliegue

**Duración estimada:** 1 sesión

| # | Tarea | ✓ |
|---|---|---|
| 11.1 | Build de producción en frontend y backend | ☐ |
| 11.2 | Configurar variables de entorno para producción | ☐ |
| 11.3 | Desplegar backend en Railway / Render / Fly.io | ☐ |
| 11.4 | Desplegar frontend en Vercel / Netlify | ☐ |
| 11.5 | Configurar PostgreSQL en producción (Neon / Supabase / Railway) | ☐ |
| 11.6 | Correr migraciones en producción | ☐ |
| 11.7 | Test POSTMAN / curl de todos los endpoints | ☐ |
| 11.8 | Push a GitHub | ☐ |

---

## Modelo de datos completo

```prisma
enum Role {
  ADMIN
  CLIENT
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

model User {
  id             Int           @id @default(autoincrement())
  email          String        @unique
  password       String
  role           Role          @default(CLIENT)
  name           String
  professional   Professional?
  appointments   Appointment[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Professional {
  id             Int           @id @default(autoincrement())
  name           String
  specialty      String
  userId         Int           @unique
  user           User          @relation(fields: [userId], references: [id])
  isActive       Boolean       @default(true)
  appointments   Appointment[]
  availability   Availability[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Service {
  id              Int           @id @default(autoincrement())
  name            String
  description     String?
  durationMinutes Int
  price           Float
  isActive        Boolean       @default(true)
  appointments    Appointment[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Availability {
  id             Int           @id @default(autoincrement())
  professionalId Int
  professional   Professional  @relation(fields: [professionalId], references: [id])
  dayOfWeek      Int
  startTime      String        // "HH:mm"
  endTime        String        // "HH:mm"
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([professionalId, dayOfWeek])
}

model Appointment {
  id             Int               @id @default(autoincrement())
  date           DateTime          @db.Date
  startTime      String            // "HH:mm"
  endTime        String            // "HH:mm"
  durationMinutes Int              // copiado de Service al crear
  price          Float             // copiado de Service al crear
  status         AppointmentStatus @default(PENDING)
  userId         Int
  user           User              @relation(fields: [userId], references: [id])
  professionalId Int
  professional   Professional      @relation(fields: [professionalId], references: [id])
  serviceId      Int
  service        Service           @relation(fields: [serviceId], references: [id])
  notes          String?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@index([professionalId, date])
  @@index([userId])
  @@index([date])
}
```

---

## API endpoints finales

```
Módulo       Método   Endpoint                              Auth       Rol
──────       ──────   ────────                              ────       ───
Auth         POST     /auth/register                        ❌         -
Auth         POST     /auth/login                           ❌         -
Auth         GET      /auth/profile                         ✅         cualquier
Auth         PATCH    /auth/profile                         ✅         cualquier

Users        GET      /users                                ✅         ADMIN
Users        GET      /users/:id                            ✅         ADMIN

Professionals POST    /professionals                        ✅         ADMIN
Professionals GET     /professionals                        ❌         -
Professionals GET     /professionals/:id                    ❌         -
Professionals PATCH   /professionals/:id                    ✅         ADMIN
Professionals DELETE  /professionals/:id                    ✅         ADMIN

Services      POST    /services                             ✅         ADMIN
Services      GET     /services                             ❌         -
Services      GET     /services/:id                         ❌         -
Services      PATCH   /services/:id                         ✅         ADMIN
Services      DELETE  /services/:id                         ✅         ADMIN

Availability  POST    /availability                         ✅         ADMIN
Availability  GET     /availability/professional/:profId    ❌         -
Availability  PATCH   /availability/:id                     ✅         ADMIN
Availability  DELETE  /availability/:id                     ✅         ADMIN

Appointments  POST    /appointments                         ✅         CLIENT
Appointments  GET     /appointments                         ✅         ADMIN (todos) / CLIENT (suyos)
Appointments  GET     /appointments/available               ❌         -
Appointments  GET     /appointments/:id                     ✅         ADMIN / dueño
Appointments  PATCH   /appointments/:id/status              ✅         ADMIN
Appointments  DELETE  /appointments/:id                     ✅         ADMIN / dueño (solo PENDING)

Dashboard     GET     /dashboard/stats                      ✅         ADMIN
```

---

## Árbol de archivos final

```
TurniX/
├── package.json                        ← npm workspaces
├── PLAN.md                             ← este archivo
├── README.md                           ← documentación del proyecto
│
├── makeup/                             ← diseño exportado de Figma (shadcn/ui)
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── styles/theme.css            ← design tokens
│   │   ├── app/components/
│   │   │   ├── LandingPage.tsx          ← landing + booking flow (partir)
│   │   │   ├── AdminDashboard.tsx       ← dashboard completo (partir)
│   │   │   └── ui/                     ← 48 componentes shadcn/ui
│   │   └── main.tsx
│   └── ...
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   ├── .env
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── dto/
│       │   │   ├── register.dto.ts
│       │   │   └── login.dto.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   └── guards/
│       │       ├── jwt-auth.guard.ts
│       │       └── roles.guard.ts
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── dto/
│       ├── professionals/
│       │   ├── professionals.module.ts
│       │   ├── professionals.controller.ts
│       │   ├── professionals.service.ts
│       │   └── dto/
│       ├── services/
│       │   ├── services.module.ts
│       │   ├── services.controller.ts
│       │   ├── services.service.ts
│       │   └── dto/
│       ├── availability/
│       │   ├── availability.module.ts
│       │   ├── availability.controller.ts
│       │   ├── availability.service.ts
│       │   └── dto/
│       ├── appointments/
│       │   ├── appointments.module.ts
│       │   ├── appointments.controller.ts
│       │   ├── appointments.service.ts
│       │   └── dto/
│       │       ├── create-appointment.dto.ts
│       │       └── query-available.dto.ts
│       ├── dashboard/
│       │   ├── dashboard.module.ts
│       │   ├── dashboard.controller.ts
│       │   └── dashboard.service.ts
│       └── common/
│           ├── decorators/
│           │   ├── roles.decorator.ts
│           │   └── current-user.decorator.ts
│           └── filters/
│               └── http-exception.filter.ts
│
└── frontend/
    ├── package.json                     ← dependencias desde makeup/ (sin MUI)
    ├── vite.config.ts                   ← copiado y adaptado de makeup/
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx                      ← React Router (nuevo, no estaba en makeup)
        ├── styles/
        │   └── globals.css              ← copiado de makeup/src/styles/theme.css
        ├── api/
        │   └── client.ts                ← Axios instance + interceptors (nuevo)
        ├── context/
        │   └── AuthContext.tsx           ← nuevo (no estaba en makeup)
        ├── hooks/
        │   ├── useAuth.ts
        │   └── useAppointments.ts
        ├── types/
        │   ├── user.ts
        │   ├── service.ts
        │   ├── professional.ts
        │   ├── appointment.ts
        │   └── availability.ts
        ├── utils/
        │   ├── formatDate.ts
        │   ├── formatTime.ts
        │   └── validators.ts
        ├── components/
        │   ├── ui/                      ← copiado de makeup/src/app/components/ui/
        │   │   ├── Button.tsx
        │   │   ├── badge.tsx
        │   │   ├── card.tsx
        │   │   ├── table.tsx
        │   │   ├── input.tsx
        │   │   ├── select.tsx
        │   │   ├── dialog.tsx           ← reemplaza a Modal (shadcn)
        │   │   ├── avatar.tsx
        │   │   ├── skeleton.tsx
        │   │   ├── sonner.tsx           ← toasts
        │   │   └── ... (los que usemos de los 48)
        │   ├── layout/
        │   │   ├── Navbar.tsx           ← extraído de makeup/LandingPage.tsx
        │   │   ├── Footer.tsx
        │   │   ├── Sidebar.tsx          ← extraído de makeup/AdminDashboard.tsx
        │   │   ├── DashboardLayout.tsx  ← extraído de makeup/AdminDashboard.tsx
        │   │   └── ProtectedRoute.tsx   ← nuevo
        │   └── appointments/           ← extraído de makeup/LandingPage.tsx
        │       ├── ServiceSelector.tsx
        │       ├── ProfessionalSelector.tsx
        │       ├── DatePicker.tsx
        │       ├── TimeSlotPicker.tsx
        │       ├── BookingConfirmation.tsx
        │       └── BookingFlow.tsx
        └── pages/
            ├── Landing.tsx              ← adaptado de makeup/LandingPage.tsx (navbar + hero + features)
            ├── Login.tsx                ← nuevo
            ├── Register.tsx             ← nuevo
            ├── Profile.tsx              ← nuevo
            ├── MisTurnos.tsx            ← nuevo
            └── Dashboard/
                ├── DashboardHome.tsx    ← extraído de makeup/AdminDashboard.tsx (stats + charts + tabla)
                ├── Professionals.tsx    ← nuevo (CRUD)
                ├── Services.tsx         ← nuevo (CRUD)
                ├── Availability.tsx     ← nuevo (CRUD)
                ├── Appointments.tsx     ← nuevo (CRUD)
                └── Clients.tsx          ← nuevo (CRUD)
```

---

## Convenios de código

- **Backend:** NestJS modular, validación con `class-validator` + `class-transformer`, uso de DTOs
- **Frontend:** Functional components + hooks, estado con Context API, estilos con Tailwind utility classes
- **Tipado estricto** en TypeScript (strict mode)
- **Rutas protegidas** con guards en backend y ProtectedRoute en frontend
- **SSR:** No aplica (SPA con Vite)
- **Husos horarios (Timezones):** Todos los horarios se almacenan como strings `"HH:mm"` en formato 24h. El frontend muestra en la zona horaria local del usuario. El backend nunca convierte zonas horarias, compara horarios como minutos desde medianoche (`const minutos = h * 60 + m`). Se usa `dayjs` en frontend y backend para manipulación.

---

> Este plan es una guía viva. Se ajusta durante el desarrollo según aparezcan mejoras o cambios.
