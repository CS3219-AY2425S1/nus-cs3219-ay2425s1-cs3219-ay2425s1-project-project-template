FROM node:lts-alpine AS build
WORKDIR /data/user-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/user-express
COPY --from=build /data/user-express/package*.json ./
RUN npm ci --omit=dev
COPY --from=build --chown=node:node /data/user-express/dist ./dist
EXPOSE 8001
ENTRYPOINT ["node", "dist/index.js"]