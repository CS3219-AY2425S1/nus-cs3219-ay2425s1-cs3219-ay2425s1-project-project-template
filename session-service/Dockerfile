# Build stage
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Copy source code and tsconfig
COPY src ./src
COPY tsconfig.json ./

# Build the TypeScript code
RUN pnpm build

# Production stage
FROM node:18-alpine AS production
ENV NODE_ENV=production
ENV PORT=4444

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

# Run the compiled JavaScript
CMD ["node", "dist/server.js"]

# Development stage
FROM node:18-alpine AS development

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY src ./src
COPY tsconfig.json ./

CMD ["pnpm", "dev"]
