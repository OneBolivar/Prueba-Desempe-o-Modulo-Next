# -------------------------------------------------------------
# Dockerfile Multi-Stage para CoSpace (Next.js 16 App Router)
# Basado en Node.js 20 Alpine para máxima ligereza y seguridad
# -------------------------------------------------------------

# ----- Stage 1: Dependencias -----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar manifiestos de paquetes y esquema Prisma
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalación limpia de dependencias
RUN npm ci

# ----- Stage 2: Compilación y Build -----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno dummy para compilación segura
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generación del cliente Prisma y construcción de producción (standalone)
RUN npx prisma generate
RUN npm run build

# ----- Stage 3: Runner de Producción Ligero -----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear usuario y grupo sin privilegios root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos estáticos y de la carpeta public
COPY --from=builder /app/public ./public

# Crear directorio de caché de Next y asignar permisos
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar artefactos optimizados del build standalone de Next.js 16
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Asignar usuario no root
USER nextjs

EXPOSE 3000

# Ejecución con el servidor autónomo optimizado
CMD ["node", "server.js"]

