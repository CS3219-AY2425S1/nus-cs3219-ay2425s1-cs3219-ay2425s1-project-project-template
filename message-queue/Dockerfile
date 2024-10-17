FROM node:18-alpine

WORKDIR /src

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3002

CMD ["node", "index.js"]