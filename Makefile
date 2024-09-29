setup:
	./scripts/install-deps.sh
	./scripts/ensure-volume.sh

migrate-seed:
	./scripts/migrate-seed-databases.sh

db-up:
	./scripts/ensure-volume.sh
	docker compose --env-file .env.local up -d

db-down:
	docker compose --env-file .env.local down

