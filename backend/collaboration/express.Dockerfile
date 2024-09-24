FROM node:lts-alpine AS build
WORKDIR /data/collab-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/collab-express
COPY --from=build /data/collab-express/package*.json ./
RUN npm ci --omit=dev
COPY --from=build --chown=node:node /data/collab-express/dist ./dist

ARG env
COPY ".env.${env}" .
EXPOSE 8001
CMD [ "npm", "run", "start" ]