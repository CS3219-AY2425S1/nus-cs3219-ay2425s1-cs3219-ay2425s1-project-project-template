FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

# Keep container running (dummy command)
CMD ["tail", "-f", "/dev/null"]

# Eventually, run:
# CMD ["npm", "run", "dev"]