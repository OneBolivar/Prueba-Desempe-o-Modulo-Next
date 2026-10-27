# =============================================================
# Dockerfile Multi-Stage para CoSpace (Next.js 16 + Prisma ORM)
# Base: Debian Bookworm (node:20-slim) con soporte OpenSSL 3.0.x
# =============================================================

# ----- Etapa 1: Dependencias (deps) -----
FROM node:20-slim AS deps
WORKDIR /app

# Instalar dependencias del sistema y certificados para OpenSSL 3
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar manifiestos y esquema de Prisma
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalación limpia de dependencias
RUN npm ci

# ----- Etapa 2: Compilación (builder) -----
FROM node:20-slim AS builder
WORKDIR /app

# Instalar dependencias del sistema para la generación de binarios de Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno requeridas en tiempo de compilación (Next.js y Prisma)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:dummy@localhost:5432/postgres?sslmode=require"
ENV DIRECT_URL="postgresql://postgres:dummy@localhost:5432/postgres?sslmode=require"
ENV JWT_ACCESS_SECRET="build_time_secret_at_least_32_characters_long_min"
ENV JWT_REFRESH_SECRET="build_time_secret_at_least_32_characters_long_min"

# Generación del cliente Prisma (incluye target debian-openssl-3.0.x) y compilación
RUN npx prisma generate
RUN npm run build

# ----- Etapa 3: Entorno de Ejecución (runner) -----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Instalar OpenSSL 3.0.x y certificados de CA para conexiones seguras con Supabase
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Crear usuario y grupo de sistema sin privilegios de root por seguridad
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copiar recursos estáticos de public
COPY --from=builder /app/public ./public

# Crear directorio .next y ajustar permisos para el usuario nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar el artefacto compilado standalone de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar explícitamente los paquetes y Query Engines generados de Prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Fallback explícito para la localización del Query Engine de Prisma en runtime
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node

# Cambiar al usuario no-root
USER nextjs

EXPOSE 3000

# Ejecutar el servidor standalone optimizado
CMD ["node", "server.js"]

CMD ["node", "server.js"]