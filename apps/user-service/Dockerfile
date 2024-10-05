FROM node:20-alpine AS base

ARG DB_CLOUD_URI
ARG JWT_SECRET
ENV DB_CLOUD_URI=${DB_CLOUD_URI}
ENV JWT_SECRET=${JWT_SECRET}
# ARG NODE_ENV=development
# ENV NODE_ENV=${NODE_ENV}
ENV ENV=PROD

FROM base AS deps

# RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm audit fix --force

# Uncomment the following line if you are building code for production.
# RUN npm ci --omit=dev

COPY . .

# Expose port 3001 so it can be mapped by Docker daemon.
EXPOSE 3001

# Define the command to run your app using CMD which defines your runtime.
CMD [ "npm", "start" ]