#!/bin/sh

envsubst '${port} ${VITE_USER_SERVICE} ${VITE_QUESTION_SERVICE}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'