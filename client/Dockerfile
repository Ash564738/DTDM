# ==========================================
# Stage 1: Build the React TypeScript SPA
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Accept optional build arguments for API URLs during build time
ARG VITE_API_BASE_URL
ARG VITE_USE_MOCK

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_USE_MOCK=${VITE_USE_MOCK}

# Install dependencies (utilizing Docker layer caching)
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Compile TypeScript and bundle Vite production assets
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:alpine

# Default PORT environment variable (overridden automatically by Render)
ENV PORT=80

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy Nginx template (processed automatically by envsubst with $PORT on startup)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose default port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
