# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
# Copy husky hooks (for prepare/install.mjs)
COPY .husky ./.husky

# Install ALL dependencies (dev + prod)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
# Copy husky hooks (for prepare/install.mjs)
COPY .husky ./.husky

ENV HUSKY=0
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy configuration files
COPY config ./config

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "dist/src/main"] 