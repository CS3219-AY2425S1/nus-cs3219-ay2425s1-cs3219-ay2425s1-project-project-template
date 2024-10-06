
FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "start"]
