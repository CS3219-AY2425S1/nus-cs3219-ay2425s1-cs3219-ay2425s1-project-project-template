# Question Service

## Overview

The History Service is built with Go, utilizing Firestore as the database and Chi as the HTTP router. It allows for basic operations such as creating, reading, updating, and deleting question records.

## Features

- Create new collaboration history
- Read collaboration history by collaboration history ID
- Update collaboration history code
- Delete collaboration history

## Technologies Used

- Go (Golang)
- Firestore (Google Cloud Firestore)
- Chi (HTTP router)

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

4. Create the `.env` file from copying the `.env.example`, copying the firebase json key file into history-service directory, and fill in the `FIREBASE_CREDENTIAL_PATH` with the path of the firebase credential JSON file.

### Running the Application

To start the server, run the following command:

```bash
go run main.go
```

The server will be available at http://localhost:8082.

## Running the Application via Docker

To run the application via Docker, run the following command:

```bash
docker build -t history-service .
```

```bash
docker run -p 8082:8082 -d history-service
```

The server will be available at http://localhost:8082.

## API Endpoints

- `POST /histories`
- `GET /histories/{docRefId}`
- `PUT /histories/{docRefId}`
- `DELETE /histories/{docRefId}`

```bash
go run main.go
```
