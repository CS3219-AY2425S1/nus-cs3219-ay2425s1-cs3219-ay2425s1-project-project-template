# Stage 1: Build Go Application

FROM golang:1.23 AS builder

WORKDIR /usr/src/app

COPY go.mod go.sum ./

RUN go mod tidy && go mod download && go mod verify

# Copy the .env file to the final image
COPY .env /usr/src/app/.env

COPY . .

RUN go build -v -o /usr/local/bin/app ./main.go

# Stage 2: Setup Redis and combine with Go
FROM redis:latest

# Copy the built Go binary from the builder stage
COPY --from=builder /usr/local/bin/app /usr/local/bin/app

EXPOSE 8081 6379

# Start both Redis and the Go application
CMD ["sh", "-c", "redis-server & app; wait"]
