# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (both client and server)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder
# Vite builds frontend to dist/client
# TypeScript builds backend to dist/server
COPY --from=builder /app/dist ./dist

# Copy shared entities needed at runtime
COPY --from=builder /app/src/shared ./src/shared

# Expose ports
EXPOSE 3000

# Start the application (Express server serves both API and static frontend)
CMD ["node", "dist/server/index.js"]
