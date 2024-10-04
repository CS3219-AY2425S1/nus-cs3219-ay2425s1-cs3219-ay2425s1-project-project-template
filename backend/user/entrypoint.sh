#!/bin/sh

if [ ! -f .db-init ]; then
  echo "migrating..."
  npm run db:prod:migrate
  echo "seeding..."
  npm run db:prod:seed
  touch .db-init
fi

npm run start
