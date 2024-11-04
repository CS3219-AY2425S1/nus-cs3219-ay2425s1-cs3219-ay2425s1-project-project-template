FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

FROM node:20-alpine AS production
ENV REACT_APP_QUESTION_SVC_PORT=https://question-183444271064.asia-southeast1.run.app
ENV REACT_APP_USER_SVC_PORT=https://user-183444271064.asia-southeast1.run.app
ENV REACT_APP_MATCHING_SVC_PORT=https://matching-183444271064.asia-southeast1.run.app
ENV REACT_APP_COLLAB_SVC_PORT=https://collab-183444271064.asia-southeast1.run.app
ENV REACT_APP_COMM_SVC_PORT=https://comm-183444271064.asia-southeast1.run.app
ENV REACT_APP_CODE_EXECUTION_SVC_PORT=https://code-exec-183444271064.asia-southeast1.run.app
ENV REACT_APP_HISTORY_SVC_PORT=https://history-183444271064.asia-southeast1.run.app
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npx", "serve", "build"]
