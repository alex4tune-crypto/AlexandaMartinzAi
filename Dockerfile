# Multi-stage Dockerfile for AlexandaMartinzAi
FROM node:20-slim AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy backend package files
COPY backend/package.json backend/package-lock.json* ./backend/

# Install root and backend dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN cd backend && npx prisma generate

# Build frontend and backend
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy root and backend package files
COPY package.json ./
COPY backend/package.json ./backend/

# Install production dependencies only
RUN npm install --omit=dev
RUN cd backend && npm install --omit=dev

# Copy built files and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules/@prisma ./backend/node_modules/@prisma

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
