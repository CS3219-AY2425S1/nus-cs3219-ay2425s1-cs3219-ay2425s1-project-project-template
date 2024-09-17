FROM node:lts-alpine AS build
WORKDIR /data/user-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /data/user-express
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /data/user-express/dist ./dist
EXPOSE 8001
CMD ["node", "dist/index.js"]