#!/bin/sh

# Drizzle will handle its own logic to remove conflicts
npm run db:prod:migrate

# Checks admin table and will not seed if data exists
npm run db:prod:seed

npm run start
