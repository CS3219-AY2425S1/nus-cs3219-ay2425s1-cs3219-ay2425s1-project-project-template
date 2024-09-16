FROM node:lts-alpine
WORKDIR /data/user-express
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g typescript ts-node
EXPOSE 8001
CMD ["ts-node", "./src/index.ts"]
