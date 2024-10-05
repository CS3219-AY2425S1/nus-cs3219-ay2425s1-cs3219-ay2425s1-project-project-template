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
FROM build AS prod
CMD ["yarn", "start"]