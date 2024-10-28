FROM node:20-alpine

WORKDIR /app

# Install Docker CLI
RUN apk add --no-cache docker-cli

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
