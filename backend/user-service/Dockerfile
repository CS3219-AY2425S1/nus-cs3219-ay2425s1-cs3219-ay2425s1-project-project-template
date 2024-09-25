FROM node:22-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

COPY . .
 
# Generate a partial monorepo with a pruned lockfile for the service
RUN npx turbo prune --scope=user-service --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN npx turbo build --filter=user-service
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 user-service
USER user-service

COPY --from=installer /app .
 
EXPOSE ${port}
CMD ["node", "app/backend/user-service/dist/server"]