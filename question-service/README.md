# Question Service

## Setup

Run the following command to install the dependencies

```bash
docker build -t question-service . --no-cache
docker run -p 4001:4001 --env-file .env.dev question-service
```

## Routes Endpoint

- GET /questions/ - get all questions
- GET /userQuestions/ - get all questions of a user
