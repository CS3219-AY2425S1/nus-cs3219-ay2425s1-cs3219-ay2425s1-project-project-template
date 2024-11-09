FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

FROM node:20-alpine AS production
ENV REACT_APP_QUESTION_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
ENV REACT_APP_USER_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
ENV REACT_APP_MATCHING_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
ENV REACT_APP_COLLAB_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
ENV REACT_APP_COMM_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
ENV REACT_APP_CODE_EXECUTION_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
ENV REACT_APP_HISTORY_SVC_PORT=https://peerprep-gateway-3lykcawy.an.gateway.dev
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npx", "serve", "build"]
