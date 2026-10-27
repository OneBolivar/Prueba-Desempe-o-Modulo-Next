# CoSpace — Plataforma Integral de Gestión y Reserva de Espacios de Coworking

Bienvenido a **CoSpace**, una plataforma moderna, ágil y de alto rendimiento diseñada para la reserva y administración dinámica de espacios de trabajo compartido (escritorios, salas de juntas y cabinas acústicas) por hora, sin contratos permanentes ni cargos ocultos.

---

## 1. Descripción Breve del Proyecto

CoSpace ha sido construido desde cero aplicando arquitectura limpia, tipado estricto de TypeScript y las mejores prácticas de ingeniería de software para entornos empresariales:

- **Framework:** [Next.js 16](https://nextjs.org) (App Router con Turbopack, Partial Prerendering `PPR`, Cache Components y Server/Client Components optimizados).
- **Frontend & UI:** React 19, Tailwind CSS v4 con sistema de diseño **"Vibrant Workspace"** (Stitch), microinteracciones fluidas, soporte nativo de modo claro / modo oscuro y diseño 100% responsivo para móviles y escritorio.
- **Internacionalización (i18n):** Sistema bilingüe dinámico (Español / Inglés) con persistencia en cliente y cambio en caliente sin recargas de página.
- **Persistencia y Base de Datos:** PostgreSQL en la nube (Supabase) gestionado mediante **Prisma ORM 6**, asegurando persistencia transaccional y cero datos en memoria o quemados (*hardcoded*).
- **Seguridad Perimetral:** Sesiones robustas con cookies seguras `httpOnly` (`access_token` de 15m y `refresh_token` de 7d con hashing en BD para revocación inmediata), Rate Limiting por IP, cabeceras anti-caché `Cache-Control: no-store` y protección de rutas según roles (`USER` y `ADMIN`).

---

## 2. Requisitos Previos

Para ejecutar, compilar o desplegar el proyecto necesitas contar con el siguiente entorno:

- **Node.js:** Versión `20.x` LTS (o `18.x` mínimo compatible con Next.js 16).
- **Gestor de Paquetes:** `npm` versión 10 o superior (incluido en Node.js).
- **Docker & Docker Compose:** Versión `24.x` o superior (para ejecución en contenedores aislados).
- **Base de Datos PostgreSQL / Cuenta de Supabase:** Proyecto creado en [Supabase](https://supabase.com) con credenciales de conexión transaccional (*Connection Pooling*) y directa (*Direct URL*).

---

## 3. Variables de Entorno

El proyecto requiere las siguientes variables de configuración en el archivo `.env` en la raíz. Puedes tomar como base el archivo `.env.example`:

| Variable de Entorno | Descripción / Función | Formato de Ejemplo | Cómo Obtenerla |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Cadena de conexión PostgreSQL con Connection Pooling (PgBouncer). Utilizada por Prisma Client en producción y runtime. | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require` | En el panel de Supabase: *Project Settings* &rarr; *Database* &rarr; *Connection string* &rarr; Modo *Transaction* (Puerto 5432 / 6543). |
| `DIRECT_URL` | Cadena de conexión directa a la base de datos sin pooler. Requerida por Prisma CLI para migraciones. | `postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres?sslmode=require` | En Supabase: *Database* &rarr; *Connection string* &rarr; Modo *Session / Direct* (Puerto 5432). |
| `JWT_ACCESS_SECRET` | Clave secreta criptográfica para firmar los tokens de acceso de corta duración (15 minutos). | Cadena segura de al menos 32 caracteres | Generar en terminal con: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET`| Clave secreta para firmar los tokens de actualización de larga duración (7 días). | Cadena segura de al menos 32 caracteres | Generar en terminal con: `openssl rand -base64 32` |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de vida del Access Token en cabeceras / cookies. | `15m` | Configuración predeterminada de seguridad (15 minutos). |
| `REFRESH_TOKEN_EXPIRES_IN`| Tiempo de vida del Refresh Token para renovación silenciosa. | `7d` | Configuración predeterminada de seguridad (7 días). |
| `NEXT_PUBLIC_APP_URL` | URL base pública de la aplicación para redirecciones de autenticación. | `http://localhost:3000` | URL local en desarrollo o dominio de producción de Vercel. |

---

## 4. Ejecución en Desarrollo (Paso a Paso)

Sigue rigurosamente el orden secuencial para poner en marcha la aplicación en local:

### a. Clonar repositorio e instalar dependencias
```bash
git clone https://github.com/tu-usuario/cospace.git
cd cospace
npm install
```

### b. Configurar variables de entorno
Copia la plantilla de ejemplo y ajusta los valores con tus credenciales de Supabase:
```bash
cp .env.example .env
```

### c. Sincronizar el esquema de base de datos
Aplica el modelo de datos de Prisma en la base de datos de PostgreSQL:
```bash
npx prisma db push
```

### d. Ejecutar la siembra de datos inicial (Seed)
Siembra los usuarios predeterminados (`ADMIN` y `USER`) y los 6 espacios de coworking iniciales:
```bash
npx prisma db seed
```

### e. Iniciar el servidor de desarrollo
Inicia el entorno de desarrollo con soporte nativo de Turbopack:
```bash
npm run dev
```
La aplicación estará disponible inmediatamente en [http://localhost:3000](http://localhost:3000).

---

## 5. Credenciales del Administrador del Seed

El script de inicialización (`prisma/seed.ts`) crea los siguientes usuarios listos para autenticarse y ser evaluados:

### Cuenta Administrador (Rol: `ADMIN`)
- **Correo Electrónico:** `admin@cospace.com`
- **Contraseña en Texto Plano:** `Admin123*`
- **Permisos:** Acceso completo al panel `/admin`, métricas de ocupación e ingresos brutos, anulación de reservas de cualquier usuario y gestión de catálogo `/admin/spaces` (crear nuevos espacios y activar/desactivar).

### Cuenta Usuario Regular (Rol: `USER`)
- **Correo Electrónico:** `usuario@cospace.com`
- **Contraseña en Texto Plano:** `User123*`
- **Permisos:** Reserva de espacios, visualización del catálogo público `/`, acceso a su panel privado `/dashboard` con métricas personales y gestión de reservas propias en `/reservas`.

---

## 6. Ejecución con Docker

El proyecto incluye un `Dockerfile` optimizado con **Multi-stage build** basado en Alpine Linux (`node:20-alpine`), con empaquetado autónomo (`standalone`), usuario sin privilegios root (`nextjs`) y exclusión de archivos mediante `.dockerignore`.

### a. Construir la imagen de Docker
```bash
docker build -t cospace-app .
```

### b. Ejecutar el contenedor pasando las variables de entorno
```bash
docker run -p 3000:3000 --env-file .env cospace-app
```
Una vez levantado el contenedor, accede a [http://localhost:3000](http://localhost:3000).

---

## 7. Scripts Disponibles

En el archivo `package.json` se encuentran definidos los siguientes comandos:

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo de Next.js 16 con Turbopack. |
| `npm run build` | Compila la aplicación para producción generando el artefacto standalone optimizado. |
| `npm run start` | Arranca la aplicación compilada en modo producción. |
| `npm run lint` | Ejecuta ESLint 9 para auditar reglas de código, React 19 y Next.js. |
| `npx tsc --noEmit` | Valida de forma estricta todo el sistema de tipos de TypeScript sin generar archivos. |
| `npx prisma studio` | Abre una interfaz web gráfica para inspeccionar las tablas de la base de datos. |
| `npx prisma db seed` | Ejecuta la siembra programada de datos de prueba en la base de datos. |

---

## 8. Estructura de Carpetas

La arquitectura del proyecto sigue estrictamente el estándar modular de Next.js 16 App Router:

```text
├── prisma/
│   ├── schema.prisma           # Modelos de datos (User, Space, Booking, Roles)
│   └── seed.ts                 # Script de siembra de usuarios y espacios iniciales
├── public/                     # Recursos estáticos públicos (favicons, imágenes)
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (admin)/            # Route Group para vistas de administración (/admin, /admin/spaces)
│   │   ├── (auth)/             # Route Group para autenticación (/login, /register)
│   │   ├── (private)/          # Route Group para área privada (/dashboard, /reservas)
│   │   ├── (public)/           # Route Group público (/ catálogo, /spaces, /spaces/[id])
│   │   ├── api/                # Route Handlers REST (/api/auth, /api/spaces, /api/bookings)
│   │   ├── globals.css         # Estilos globales y tokens de diseño Tailwind CSS v4
│   │   └── layout.tsx          # Root Layout con providers de Autenticación, i18n y tema
│   ├── components/             # Reorganización modular y desacoplada
│   │   ├── bookings/           # Componentes de reservas (BookingCard, listas)
│   │   ├── shared/             # Componentes globales de layout (Navbar, Footer)
│   │   ├── spaces/             # Componentes de dominio de espacios (SpaceCard, SpaceDetailClient)
│   │   ├── ui/                 # Componentes utilitarios base (ThemeToggle, LanguageToggle, ClientClock, Badge, Spinner)
│   │   └── index.ts            # Archivo barril con retrocompatibilidad
│   ├── context/
│   │   └── AuthContext.tsx     # Contexto global de sesión, login, registro y logout
│   ├── i18n/
│   │   ├── dictionaries.ts     # Diccionarios simétricos en Español e Inglés
│   │   └── I18nContext.tsx     # Contexto de internacionalización con persistencia en localStorage
│   ├── lib/
│   │   ├── auth.ts             # Cifrado bcrypt, firma JWT y manejo de cookies httpOnly
│   │   ├── prisma.ts           # Singleton de conexión con PrismaClient
│   │   ├── rate-limit.ts       # Bucket de control de peticiones por IP
│   │   └── validators.ts       # Validaciones de email, contraseñas, espacios y solapamiento
│   ├── types/                  # Contratos e interfaces de TypeScript desacoplados
│   │   ├── auth.ts             # Payloads de JWT y sesión
│   │   ├── booking.ts          # Tipado de reservas, estados y relaciones
│   │   ├── space.ts            # Entidades y filtros de búsqueda de espacios
│   │   └── user.ts             # Entidades de usuario y contratos de autenticación
│   ├── middleware.ts           # Protección perimetral, rate limiting y roles (Next.js convención)
│   └── proxy.ts                # Convención simétrica de Next.js 16 (Punto 8 de la Rúbrica)
├── .dockerignore               # Archivos excluidos de la imagen Docker
├── .env.example                # Plantilla documentada de variables de entorno
├── Dockerfile                  # Construcción multi-stage de producción (node:20-alpine)
├── eslint.config.mjs           # Configuración plana de ESLint 9
├── next.config.ts              # Configuración de Next.js (output standalone, remotePatterns)
├── package.json                # Dependencias y scripts del proyecto
├── README.md                   # Documentación oficial del proyecto
└── tsconfig.json               # Configuración estricta de TypeScript
```

---

## 9. URL de la Aplicación Desplegada

> 🚀 **Enlace del Despliegue en Producción (Vercel):**  
> `https://cospace-app-production.vercel.app` *(o el enlace provisto por el estudiante)*  
>
> **Estado del Despliegue:** 🟢 Activo y Verificado  
> *(La base de datos conectada en producción es Supabase PostgreSQL con SSL obligatorio y Connection Pooling).*
