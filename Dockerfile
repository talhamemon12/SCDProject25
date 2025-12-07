# Use Node.js 20 LTS Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Create necessary directories
RUN mkdir -p backups data

# Expose application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('mongoose').connection.readyState === 1 || process.exit(1)"

# Start the application
CMD ["node", "main.js"]
