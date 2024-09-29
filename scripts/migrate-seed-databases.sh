#!/bin/sh

# Migrate Services
for service in backend/*; do
  cd "$service"
  npm run db:migrate
  cd ../..
done

# Seed Services
seeded_services=("question" "user")
for service in "${seeded_services[@]}"; do
  cd "backend/$service"
  npm run db:seed
  cd ../..
done
