# TurniX

> SaaS de gestión de turnos para negocios — Agenda, administrá y facturá tus reservas en un solo lugar.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=fff)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?logo=chartdotjs&logoColor=fff)

---

## ✨ Funcionalidades

- **Landing profesional** con flujo de reserva en 5 pasos
- **Autenticación JWT** con roles ADMIN y CLIENT
- **Dashboard administrativo** con gráficos (Recharts), métricas y CRUD completo
- **Gestión de turnos** con selección de profesional, servicio, fecha y horario
- **Notificaciones en tiempo real** vía SSE con toasts y notificaciones de escritorio
- **Disponibilidad** dinámica por profesional con validación de superposición
- **Panel "Mis Turnos"** para que los clientes vean y cancelen sus reservas
- **Perfil de usuario** editable
- **Swagger** documentación interactiva de la API
- **Seed inteligente** con datos históricos para demostración inmediata

---

## 🚀 Demo en vivo

[![Vercel](https://img.shields.io/badge/VER_DEMO_EN_VIVO-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://turnix.vercel.app)

**Credenciales de prueba:**

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@turnix.com | admin123 |
| Cliente | cliente@turnix.com | admin123 |

---
---

## 🛠️ Stack tecnológico

### Frontend
- **React 19** + TypeScript
- **Vite** — bundler ultrarrápido
- **Tailwind CSS v4** — estilos utilitarios
- **shadcn/ui** — componentes accesibles y customizables
- **Recharts** — gráficos interactivos
- **React Router v7** — enrutamiento SPA
- **Axios** — cliente HTTP con interceptores
- **Sonner** — toasts elegantes

### Backend
- **NestJS 11** — framework Node.js progresivo
- **TypeScript** — tipado estricto
- **Passport + JWT** — autenticación segura
- **class-validator + class-transformer** — validación de DTOs
- **Prisma 7** — ORM moderno con PostgreSQL

### Base de datos
- **PostgreSQL 16**
- **Prisma Migrate** — migraciones declarativas

---

## 📦 Instalación local

### Prerequisitos
- Node.js 22+
- PostgreSQL 16
- npm

### 1. Clonar repositorio
```bash
git clone https://github.com/alanfoa/TurniX.git
cd turnix
```

### 2. Instalar dependencias
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Configurar variables de entorno
```bash
cp backend/.env.example backend/.env
```
Editá `backend/.env` con tu conexión a PostgreSQL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turnix?schema=public"
JWT_SECRET="tu-secreto-aqui"
JWT_EXPIRATION="24h"
```

### 4. Crear base de datos y ejecutar migraciones
```bash
cd backend
npx prisma migrate dev
```

### 5. Sembrar datos de prueba
```bash
npx prisma db seed
```

### 6. Iniciar backend
```bash
npm run start:dev
# Backend corriendo en http://localhost:3000
# Swagger en http://localhost:3000/api/docs
```

### 7. Iniciar frontend
```bash
cd frontend
npm run dev
# Frontend en http://localhost:5173
```

---

## 📋 API (Swagger)

Una vez corriendo el backend, visitá:

**http://localhost:3000/api/docs**

Documentación interactiva generada automáticamente con todos los endpoints, DTOs y códigos de respuesta.

---

## 📁 Estructura del proyecto

```
TurniX/
├── backend/               # API NestJS
│   ├── prisma/            # Schema, migraciones, seed
│   └── src/
│       ├── auth/          # Login, registro, JWT
│       ├── users/         # CRUD usuarios
│       ├── professionals/ # CRUD profesionales
│       ├── services/      # CRUD servicios
│       ├── availability/  # CRUD disponibilidad
│       ├── appointments/  # Turnos y lógica de reserva
│       ├── dashboard/     # Estadísticas y métricas
│       ├── notifications/ # SSE y notificaciones
│       └── common/        # Decoradores, filtros, DTOs
├── frontend/              # SPA React
│   └── src/
│       ├── api/           # Clientes HTTP
│       ├── components/    # UI (shadcn) y booking
│       ├── context/       # AuthContext
│       ├── hooks/         # Hooks custom
│       ├── pages/         # Landing, Dashboard, Login, etc.
│       └── types/         # Interfaces TypeScript
├── makeup/                # Diseño Figma (shadcn/ui)
└── PLAN.md                # Plan de desarrollo detallado
```

---

## 📄 Licencia

MIT
