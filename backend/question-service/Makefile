.PHONY: db 
db:
	docker run --name question-db -p 27017:27017 -d mongodb/mongodb-community-server:6.0.8-ubi9

.PHONY: server
server:
	@poetry run uvicorn question_service.main:app --reload

.PHONY: test
test:
	@pytest --cov=question_service

.PHONY: lint
lint:
	@ruff check question_service/* tests/*

.PHONY: format
format:
	@ruff format question_service/* tests/*