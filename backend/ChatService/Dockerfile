# Dockerfile for ChatService
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the chat port (set in .env)
EXPOSE 8081

# Run the service
CMD ["node", "chat-service.js"]
