# Build stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Development stage
FROM base AS dev
COPY . .
CMD ["yarn", "dev"]

# Production build stage
FROM base AS build
COPY . .
RUN yarn build

# Production runtime stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
RUN yarn install --production --frozen-lockfile
CMD ["yarn", "start"]