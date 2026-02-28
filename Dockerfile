FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Start aşamasında container çalıştığında derlemeyi ve başlatmayı yapmak için
COPY --from=builder /app ./

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Otonom Start Script: Container ayağa kalkınca (DB Ağına girdiğinde) Build et ve Çalıştır
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && npm run build && npm start"]
