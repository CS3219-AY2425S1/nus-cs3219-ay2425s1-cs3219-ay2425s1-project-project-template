FROM node:20-alpine AS build

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./

#ADD Service ENV 
ARG VITE_USER_SERVICE
ARG VITE_QUESTION_SERVICE
ENV VITE_USER_SERVICE=${VITE_USER_SERVICE}
ENV VITE_QUESTION_SERVICE=${VITE_QUESTION_SERVICE}

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ARG port
EXPOSE ${port}

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]