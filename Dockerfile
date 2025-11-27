# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY server.js .

# Expose port
EXPOSE 8080

# Set environment
ENV PORT=8080

# Start the server
CMD ["npm", "start"]
