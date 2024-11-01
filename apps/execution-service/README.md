# Execution Service

## Overview

The Execution Service is built with Go, utilizing Firestore as the database and Chi as the HTTP router. It provides an API to manage test cases, such as populating test cases (via question-service), reading visible test cases and executing visible, hidden and custom test cases.

## Features

- Populate test cases (via populate questins in question-service)
- Read visible test cases via a question ID
- Execute visible test cases via a question ID

## Technologies Used

- Go (Golang)
- Firestore (Google Cloud Firestore)
- Chi (HTTP router)
- Yaegi (Go interpreter)

## Getting Started

### Prerequisites

- Go 1.16 or later
- Google Cloud SDK
- Firestore database setup in your Google Cloud project

### Installation

1. Clone the repository

2. Set up your Firestore client

3. Install dependencies:

```bash
go mod tidy
```

4. Create the `.env` file from copying the `.env.example`, and copy the firebase JSON file into execution-service/ fill in the `FIREBASE_CREDENTIAL_PATH` with the path of the firebase credential JSON file.

### Running the Application

To start the server, run the following command:

```bash
go run main.go
```

The server will be available at http://localhost:8083.

## Running the Application via Docker

To run the application via Docker, run the following command:

```bash
docker build -t question-service .
```

```bash
docker run -p 8083:8083 --env-file .env -d execution-service
```

The server will be available at http://localhost:8083.

## API Endpoints

- `POST /tests/populate`
- `GET /tests/{questionDocRefId}/`
- `GET /tests/{questionDocRefId}/execute`

## Managing Firebase

To reset and repopulate the database, run the following command:

```bash
go run main.go
```

## Repopulate test cases

To repopulate test cases, you need to repopulate the questions in the question-service, which will automatically call the execution-service to populate the test cases.

In question-service, run the following command:

```bash
go run main.go -populate
```

## API Documentation

`GET /tests/{questionDocRefId}/`

To read visible test cases via a question ID, run the following command:

```bash
curl -X GET http://localhost:8083/tests/bmzFyLMeSOoYU99pi4yZ/ \
-H "Content-Type: application/json"
```

`GET /tests/{questionDocRefId}/execute`

To execute test cases via a question ID without custom test cases, run the following command, with custom code and language:

```bash
curl -X POST http://localhost:8083/tests/{questionDocRefId}/execute \
-H "Content-Type: application/json" \
-d '{
"code": "name = input()\nprint(name[::-1])",
"language": "Python"
}'
```

To execute test cases via a question ID with custom test cases, run the following command, with custom code, language and custom test cases:

```bash
curl -X POST http://localhost:8083/tests/{questionDocRefId}/execute \
-H "Content-Type: application/json" \
-d '{
"code": "name = input()\nprint(name[::-1])",
"language": "Python",
"customTestCases": "2\nHannah\nhannaH\nabcdefg\ngfedcba\n"
}'
```
