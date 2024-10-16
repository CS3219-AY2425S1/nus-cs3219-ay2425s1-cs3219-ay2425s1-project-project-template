FROM node:18-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

CMD ["node", "index.js"]