FROM node:22.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./ ./

ENV NEXT_PUBLIC_QUESTION_SERVICE_URL=NEXT_PUBLIC_QUESTION_SERVICE_URL
ENV NEXT_PUBLIC_IMAGE_UPLOAD_KEY=NEXT_PUBLIC_IMAGE_UPLOAD_KEY
ENV NEXT_PUBLIC_FRONTEND_PORT=NEXT_PUBLIC_FRONTEND_PORT

RUN npm run build

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["npm", "start"]
