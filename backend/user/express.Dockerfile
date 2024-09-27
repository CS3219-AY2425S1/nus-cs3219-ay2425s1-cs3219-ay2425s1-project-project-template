FROM node:lts-alpine AS build
WORKDIR /data/question-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/question-express
COPY --from=build /data/question-express/package*.json ./
RUN npm ci --omit=dev
COPY --from=build --chown=node:node /data/question-express/dist ./dist

ARG env
COPY ".env.${env}" .
ARG port
EXPOSE ${port}
CMD [ "npm", "run", "start" ]