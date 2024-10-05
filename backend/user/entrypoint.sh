#!/bin/sh
if [ ! -f db-init ]
then
echo "migrating..."
npm run db:prod:migrate
echo "migration complete"
echo "seeding..."
npm run db:prod:seed
echo "seeding complete"
touch .db-init
echo "db-init created"
fi

npm run start
