# Build stage
FROM node:14-alpine AS builder

WORKDIR /usr/src/goof

# Copy package files
COPY package*.json ./

# Install dependencies (skip prepare script that needs husky)
RUN npm ci --only=production --ignore-scripts

# Final stage
FROM node:14-alpine

# Create necessary directories
RUN mkdir -p /usr/src/goof /tmp/extracted_files

WORKDIR /usr/src/goof

# Copy dependencies from builder
COPY --from=builder /usr/src/goof/node_modules ./node_modules

# Copy application code
COPY . .

# Expose ports
EXPOSE 3001
EXPOSE 9229

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Start the application
CMD ["npm", "start"]
