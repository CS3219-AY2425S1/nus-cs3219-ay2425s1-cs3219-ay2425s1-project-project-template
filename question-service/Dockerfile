# Stage 1: Build the application
FROM node:20

# Create a non-privileged user
RUN useradd -ms /bin/sh -u 1001 app

# Switch to the non-privileged user
USER app

# Set working directory
WORKDIR /app

COPY --chown=app:app package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=app:app . /app

# # Compile TypeScript to JavaScript
# RUN npm run build

# Expose the port your app runs on
EXPOSE 3002

# Set the command to run your application
CMD ["npm", "run", "dev"]