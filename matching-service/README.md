# Matching Service

## Setting up

1. Run RabbitMQ container: `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management`
2. Run Redis container: `docker run -d --name my-redis-stack -p 6379:6379  redis/redis-stack-server:latest`

## Running matching service

1. Run matching service: `npm run dev`

## Matching service API guide

### Find match
- Description: This endpoint allows finding a match

- HTTP method: `POST`

- Endpoint: `http://localhost:3000/api/match`

- Body:

  - Required: userId (string), topic (string), difficulty (string)
  ```
  {
    "userId": "(Replace with userId)",
    "topic": "array",
    "difficulty": "easy"
  }
  ```

- Example for two users:

  User 1:
  ```
  {
    "userId": "66eaf41a42e9e32670f99739",
    "topic": "array",
    "difficulty": "easy"
  }
  ```
  User 2:
  ```
  {
    "userId": "66eaf3a642e9e32670f99736",
    "topic": "array",
    "difficulty": "easy"
  }

  ```

  Expected output:

  ```
  Match found between 66eaf3a642e9e32670f99736 and 66eaf41a42e9e32670f99739 
  ```
