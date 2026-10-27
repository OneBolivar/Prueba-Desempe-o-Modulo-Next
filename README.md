# CoSpace — Plataforma Integral de Gestión y Reserva de Espacios de Coworking

Bienvenido a **CoSpace**, una plataforma moderna, ágil y de alto rendimiento diseñada para la reserva y administración dinámica de espacios de trabajo colaborativo (escritorios compartidos, salas de juntas y cabinas insonorizadas) por hora, sin contratos permanentes ni costos ocultos.

---

## 1. Título y Descripción del Proyecto

**CoSpace** es una solución Full-Stack empresarial desarrollada con arquitectura de vanguardia, modularidad desacoplada y tipado estricto:
- **Framework Principal:** [Next.js 16](https://nextjs.org) utilizando el nuevo motor **App Router con Turbopack**, Cache Components, Partial Prerendering (`PPR`) y empaquetado autónomo (`standalone`).
- **Librería de Interfaz:** React 19 con componentes de servidor y de cliente optimizados, control estricto de hidratación y supresión de desajustes cliente/servidor.
- **Sistema de Diseño Visual:** **"Vibrant Workspace"** (Stitch) implementado con Tailwind CSS v4, compatible con modo claro y oscuro, microinteracciones táctiles, badges dinámicos y adaptación responsiva fluida (móviles y PC).
- **Header / Navbar Premium:** Cabecera fija traslúcida (`backdrop-blur-md bg-white/85 dark:bg-slate-950/80`), detección de ruta activa en tiempo real (`usePathname`), avatar con iniciales dinámicas, badges visuales de rol (`USER` en violeta y `ADMIN` en ámbar), selector integrado de idioma/tema agrupado con división limpia y menú móvil responsive fluido.
- **Telemetría y Control de Hidratación (Punto 10):** Componente `ClientClock` integrado de forma prominente en el banner del Dashboard, desplegando hora local en vivo con segundos, día de la semana, zona horaria (`Intl.DateTimeFormat`) y diodo emisor de pulso en vivo (`animate-ping`), blindado contra advertencias de desincronización de hidratación mediante bandera `isMounted` y `suppressHydrationWarning`.
- **Flujo de Redirección Inteligente en Autenticación:** Formularios de `/login` y `/register` con captura y decodificación automática del parámetro de origen `from`, invocación coordinada de `router.refresh()` y navegación inmediata a la ruta solicitada (o `/dashboard` por defecto), respaldados por protección perimetral en `(auth)/layout.tsx` y `src/proxy.ts` que impiden que usuarios autenticados visualicen pantallas de inicio de sesión.
- **Internacionalización Nativa (i18n):** Sistema bilingüe simétrico (Español / Inglés) con persistencia en cliente (`localStorage`) y conmutador accesible en Navbar.
- **ORM y Persistencia de Datos:** [Prisma ORM 6](https://www.prisma.io) operando contra una base de datos relacional PostgreSQL alojada en [Supabase](https://supabase.com). Cero datos quemados (*hardcoded*), persistencia transaccional y validación de concurrencia contra traslape de reservas.
- **Seguridad Perimetral y Autenticación:** Sesiones blindadas mediante cookies `httpOnly`, rotación de tokens JWT (`access_token` de 15m y `refresh_token` de 7d con hash bcrypt en la BD), Rate Limiting por IP (100 req/min) y control perimetral de roles (`USER` y `ADMIN`) gestionado desde `src/proxy.ts`.

---

## 2. Requisitos Previos y Versiones

Asegúrate de contar con las siguientes herramientas instaladas en tu entorno de desarrollo o despliegue:

- **Node.js:** Versión `20.x` LTS (v20.10.0 o superior recomendada; mínimo v18+).
- **npm:** Versión `10.x` o superior.
- **Docker Engine:** Versión `24.x` o superior y **Docker Compose v2**.
- **Cuenta de Supabase:** Proyecto PostgreSQL activo con credenciales de acceso directo y por pool de conexiones (*Transaction Mode*).

---

## 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto tomando como plantilla [.env.example](file:///home/cohorte5/Escritorio/Prueba-Desempe-o-Modulo-Next/.env.example). A continuación se describe cada parámetro requerido:

| Variable | Descripción | Formato / Ejemplo | Obligatoria / Opcional |
| :--- | :--- | :--- | :--- :--- |
| `DATABASE_URL` | Cadena de conexión PostgreSQL con Connection Pooling (PgBouncer). Utilizada por Prisma Client en runtime. | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require` | **Obligatoria** |
| `DIRECT_URL` | Conexión directa a PostgreSQL (puerto 5432) sin pooler. Utilizada por Prisma CLI para migraciones y sincronización del esquema. | `postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres?sslmode=require` | **Obligatoria** |
| `JWT_ACCESS_SECRET` | Clave criptográfica para firmar los tokens de acceso efímeros (15 min). | Cadena segura de 32+ caracteres generada con `openssl rand -base64 32` | **Obligatoria** |
| `JWT_REFRESH_SECRET` | Clave criptográfica para firmar los tokens de actualización persistentes (7 días). | Cadena segura de 32+ caracteres generada con `openssl rand -base64 32` | **Obligatoria** |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de expiración del Access Token. | `15m` | Opcional (Defecto: 15m) |
| `REFRESH_TOKEN_EXPIRES_IN` | Tiempo de expiración del Refresh Token. | `7d` | Opcional (Defecto: 7d) |
| `NEXT_PUBLIC_APP_URL` | Dominio base público de la aplicación para resolución de URLs y callbacks. | `http://localhost:3000` | **Obligatoria** |

---

## 4. Guía de Instalación y Ejecución Secuencial

Para levantar el proyecto en un entorno de desarrollo o prueba local, ejecuta de forma secuencial los siguientes pasos:

### a. Instalación de dependencias
```bash
npm install
```

### b. Sincronización de base de datos
Aplica el modelo de datos de Prisma directamente sobre PostgreSQL:
```bash
npx prisma db push
```

### c. Poblado de datos de prueba
Siembra en la base de datos las cuentas oficiales (`ADMIN` y `USER`) y los 6 espacios iniciales de coworking:
```bash
npx prisma db seed
```

### d. Compilación del proyecto
Genera el artefacto optimizado de producción con empaquetado autónomo (*standalone*):
```bash
npm run build
```

### e. Inicio del servidor en producción
Inicia el servidor Node.js de producción en el puerto 3000:
```bash
npm run start
```
La aplicación estará disponible inmediatamente en [http://localhost:3000](http://localhost:3000).

*(Para modo desarrollo con recarga en caliente de Turbopack, puedes utilizar alternativamente `npm run dev`).*

---

## 5. Credenciales de Prueba (Seed)

La base de datos cuenta con usuarios sembrados automáticamente listos para pruebas de acceso y control de permisos:

| Rol | Correo Electrónico | Contraseña en Texto Plano | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@cospace.com` | `Admin123*` | Control total del sistema: acceso al panel maestro `/admin`, visualización de métricas globales de ingresos y ocupación, anulación de reservas de cualquier usuario y administración del inventario `/admin/spaces` (alta de espacios y desactivación/activación). |
| **USER** | `usuario@cospace.com` | `User123*` | Usuario estándar: exploración del catálogo `/`, reserva dinámica por horas `/spaces/[id]`, panel personal `/dashboard` con reloj en vivo y gestión/cancelación de reservas propias en `/reservas`. |

---

## 6. Despliegue y Ejecución en Docker

La plataforma está completamente dockerizada mediante un **Multi-Stage Build** optimizado basado en Debian Bookworm (`node:20-slim`), garantizando compatibilidad nativa con **OpenSSL 3.0.x** (`debian-openssl-3.0.x`), empaquetado autónomo (`standalone`), usuario sin privilegios root (`nextjs:nodejs`) y enlace directo del Query Engine de Prisma.

### a. Compilación de la imagen de Docker
```bash
docker build -t cospace-app .
```

### b. Ejecución del contenedor pasando las variables de entorno
```bash
docker run -p 3000:3000 --env-file .env cospace-app
```

### c. Alternativa declarativa con Docker Compose
Puedes orquestar el contenedor mediante el archivo declarativo `docker-compose.yml`:
```bash
docker compose up --build -d
```
Para detener el servicio:
```bash
docker compose down
```
La aplicación queda expuesta en [http://localhost:3000](http://localhost:3000).

---

## 7. Scripts Disponibles

En el archivo `package.json` se encuentran disponibles los siguientes scripts de automatización:

| Script | Comando | Descripción |
| :--- | :--- | :--- |
| `dev` | `next dev` | Inicia el servidor de desarrollo local con soporte Turbopack. |
| `build` | `next build` | Compila la aplicación para producción generando el bundle autónomo standalone. |
| `start` | `next start` | Arranca la aplicación compilada en modo producción. |
| `lint` | `eslint` | Ejecuta el linter estricto de ESLint 9 para código Next.js y React 19. |
| `seed` | `tsx prisma/seed.ts` | Ejecuta la siembra de usuarios y espacios en la base de datos PostgreSQL. |
| `postinstall`| `prisma generate` | Genera automáticamente el cliente fuertemente tipado de Prisma tras instalar dependencias. |

---

## 8. Estructura del Proyecto

El código fuente se organiza siguiendo las mejores prácticas de la arquitectura modular de Next.js 16:

```text
├── prisma/
│   ├── schema.prisma           # Esquema de Prisma (User, Space, Booking, Roles, BinaryTargets)
│   ├── seed.ts                 # Script de poblado inicial de usuarios y espacios
│   └── config.ts               # Configuración de Prisma
├── public/                     # Recursos públicos y estáticos (favicons, logos)
├── src/
│   ├── app/                    # Next.js App Router estructurado por Route Groups
│   │   ├── (admin)/            # Vistas administrativas protegidas para rol ADMIN
│   │   │   ├── admin/          # Panel maestro de ocupación e ingresos (/admin)
│   │   │   │   └── spaces/     # CRUD de gestión de espacios (/admin/spaces)
│   │   │   └── layout.tsx      # Layout administrativo aislado
│   │   ├── (auth)/             # Vistas de autenticación con protección de sesión activa
│   │   │   ├── login/          # Inicio de sesión con redirección reactiva (/login)
│   │   │   ├── register/       # Registro de usuarios con redirección fluida (/register)
│   │   │   └── layout.tsx      # Layout con guardia de servidor ante usuarios ya autenticados
│   │   ├── (private)/          # Vistas privadas protegidas para usuarios autenticados
│   │   │   ├── dashboard/      # Panel con banner de telemetría ClientClock e inversión (/dashboard)
│   │   │   ├── reservas/       # Historial y cancelación reactiva (/reservas)
│   │   │   └── layout.tsx      # Layout privado
│   │   ├── (public)/           # Vistas públicas accesibles
│   │   │   ├── page.tsx        # Catálogo principal con filtros dinámicos (/)
│   │   │   ├── spaces/         # Explorador completo (/spaces)
│   │   │   │   └── [id]/       # Detalle y panel de reserva sticky (/spaces/[id])
│   │   │   └── layout.tsx      # Layout público
│   │   ├── api/                # Route Handlers REST
│   │   │   ├── auth/           # Endpoints: /login, /register, /logout, /refresh, /me
│   │   │   ├── bookings/       # Endpoints: /api/bookings y /api/bookings/[id]
│   │   │   └── spaces/         # Endpoints: /api/spaces y /api/spaces/[id]
│   │   ├── globals.css         # Directivas de Tailwind CSS v4 y tokens Stitch
│   │   ├── layout.tsx          # Root Layout con providers globales y script anti-flicker
│   │   └── not-found.tsx       # Pantalla 404 personalizada con diseño Vibrant Workspace
│   ├── components/             # Arquitectura modular de componentes UI y de dominio
│   │   ├── bookings/           # Componentes de reservas (BookingCard)
│   │   ├── shared/             # Layout global compartido (Navbar premium, Footer)
│   │   ├── spaces/             # Dominio de espacios (SpaceCard, SpaceDetailClient)
│   │   ├── ui/                 # Componentes utilitarios base (ThemeToggle, LanguageToggle, ClientClock, Badge, Spinner)
│   │   └── index.ts            # Archivo barril con exportaciones modulares
│   ├── context/
│   │   └── AuthContext.tsx     # Contexto global de autenticación de usuario
│   ├── i18n/
│   │   ├── dictionaries.ts     # Diccionarios simétricos en Español e Inglés
│   │   └── I18nContext.tsx     # Contexto de internacionalización con persistencia en localStorage
│   ├── lib/
│   │   ├── auth.ts             # Lógica de firmado/verificación JWT y cookies seguras
│   │   ├── prisma.ts           # Singleton de conexión con PrismaClient
│   │   ├── rate-limit.ts       # Rate Limiter por IP en memoria
│   │   └── validators.ts       # Validaciones estrictas de reglas de negocio
│   ├── types/                  # Contratos y tipos desacoplados sin 'any'
│   │   ├── auth.ts             # Tipos de payloads y tokens
│   │   ├── booking.ts          # Tipos de entidades de reserva y estados
│   │   ├── space.ts            # Tipos de espacios y filtros de búsqueda
│   │   ├── user.ts             # Tipos de usuario y contexto de autenticación
│   │   └── validators.ts       # Tipos de resultados de validación
│   └── proxy.ts                # Proxy perimetral nativo de Next.js 16 (Punto 8)
├── .dockerignore               # Archivos excluidos del contexto de construcción Docker
├── .env.example                # Plantilla documentada de variables de entorno
├── docker-compose.yml          # Definición declarativa de orquestación de servicios Docker
├── Dockerfile                  # Construcción multi-stage en 3 etapas con node:20-slim
├── eslint.config.mjs           # Configuración plana de ESLint 9
├── next.config.ts              # Configuración de Next.js (output standalone, remotePatterns)
├── package.json                # Manifiesto de dependencias y scripts de ejecución
├── README.md                   # Documentación oficial del proyecto
└── tsconfig.json               # Configuración estricta del compilador TypeScript
```

---

## 9. Despliegue en Producción

> 🚀 **Enlace de Producción en Vercel:**  
> **URL de Producción:** [https://prueba-desempe-o-modulo-next.vercel.app/](https://prueba-desempe-o-modulo-next.vercel.app/)

> **Infraestructura de Despliegue:**
> - **Hosting:** Vercel Edge Network con Serverless & Edge Functions.
> - **Base de Datos:** Supabase PostgreSQL con SSL obligatorio, réplicas globales y Connection Pooling (PgBouncer).
> - **Modo de Compilación:** Next.js 16 App Router con Turbopack y Partial Prerendering (PPR) habilitado.
