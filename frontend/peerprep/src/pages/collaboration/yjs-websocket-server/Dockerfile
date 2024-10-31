FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the parent directory
COPY ../../package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Make port 1234 available to the world outside this container
EXPOSE 1234

# Define the command to run your app
CMD ["node", "y-websocket-server.cjs"]
