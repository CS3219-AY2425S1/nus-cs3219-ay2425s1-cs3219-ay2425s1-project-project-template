#!/bin/bash

docker compose -f ./docker-compose.local.yml up -d db redis
sleep 10s
docker compose -f ./docker-compose.local.yml up -d
sleep 5s
docker compose ps