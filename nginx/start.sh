#!/bin/bash
envsubst '\$USER_SERVICE_ADDR \$QUESTION_SERVICE_ADDR \$MATCH_NOTIFICATION_SERVICE_ADDR \$COLLABORATION_SERVICE_ADDR'< /tmp/default.conf > /etc/nginx/conf.d/default.conf
mkdir -p /etc/nginx/conf.d/templates
cp /tmp/templates/api.conf /etc/nginx/conf.d/templates/api.conf
cp /tmp/templates/socket.conf /etc/nginx/conf.d/templates/socket.conf
rm /tmp
nginx -g 'daemon off;'
