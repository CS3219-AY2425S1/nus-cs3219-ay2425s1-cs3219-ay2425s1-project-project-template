FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE ${USER_SERVICE_PORT}

CMD ["npm", "start"]
