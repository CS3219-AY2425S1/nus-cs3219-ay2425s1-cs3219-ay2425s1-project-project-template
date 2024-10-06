FROM node:22

WORKDIR /user-service
# TODO: don't include the .env file in the COPY
# TODO: multistage build
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]