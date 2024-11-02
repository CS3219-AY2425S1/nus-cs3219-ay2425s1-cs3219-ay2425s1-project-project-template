# Use the official Golang image as the base image
FROM golang:1.22-alpine

RUN apk add --no-cache docker-cli

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

CMD ["go", "run", "main.go", "run", "standalone"]