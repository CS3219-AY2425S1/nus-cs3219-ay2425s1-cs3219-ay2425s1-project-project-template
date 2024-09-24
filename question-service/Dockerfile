FROM node:18.16.0-alpine as base

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY src ./src

COPY tsconfig.json ./tsconfig.json

RUN npm run build

# Make port 3001 available to the world outside this container
ENV PORT=4001

EXPOSE ${PORT}

# Define the command to run your app
CMD ["npm", "start"]