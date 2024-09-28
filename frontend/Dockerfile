FROM node:20-alpine

# Create a non-privileged user
RUN useradd -ms /bin/sh -u 1001 app

# Switch to the non-privileged user
USER app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --chown=app:app . .

EXPOSE 5173

CMD ["npm", "run", "dev"]