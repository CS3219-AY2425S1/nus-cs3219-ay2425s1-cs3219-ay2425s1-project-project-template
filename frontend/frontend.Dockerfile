FROM node:20-alpine AS build

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./

ARG VITE_USER_SERVICE
ARG VITE_QUESTION_SERVICE
ENV VITE_USER_SERVICE=${VITE_USER_SERVICE}
ENV VITE_QUESTION_SERVICE=${VITE_QUESTION_SERVICE}

RUN npm run build

FROM node:20-alpine AS production
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist

ARG port
EXPOSE ${port} 

CMD ["serve", , "-s", "dist"]
