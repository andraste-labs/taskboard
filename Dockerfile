# syntax=docker/dockerfile:1
# TaskBoard - React + TypeScript + Vite SPA
# Multi-stage production-optimized build

# ---------- Stage 1: Install dependencies ----------
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --progress=false

# ---------- Stage 2: Build static assets ----------
FROM node:18-alpine AS builder
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Stage 3: Production runtime (Nginx, non-root) ----------
FROM nginx:1.27-alpine AS production

RUN apk add --no-cache curl \
    && addgroup -g 1001 -S appgroup \
    && adduser -S appuser -u 1001 -G appgroup

# Custom SPA-aware nginx config (routing fallback, gzip, security headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets only (no source/node_modules in final image)
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix permissions for non-root nginx user (unprivileged port 8080)
RUN chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
