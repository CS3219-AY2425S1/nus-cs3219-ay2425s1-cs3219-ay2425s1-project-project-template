# Base stage for both dev and prod
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install

# Development stage
FROM base AS development

COPY src ./src
COPY tsconfig.json ./

# Note: Don't expose ports here, Compose will handle that for us

CMD ["pnpm", "dev"]


# Production stage
FROM base AS production
ENV NODE_ENV=production
ENV PORT=4444
ENV AUDIO_PORT=5555
# Copy source files
COPY src ./src
COPY tsconfig.json ./

# Build the TypeScript code
RUN pnpm build

EXPOSE ${PORT} ${AUDIO_PORT}

CMD ["pnpm", "start"]
