# Use Go 1.20 or later
FROM golang:1.20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire project to the working directory
COPY . .

# Build the Go service
RUN go build -o /matching-service ./cmd

# Create the final image from alpine
FROM alpine:latest

# Set the working directory in the final image
WORKDIR /root/

# Copy the built Go binary from the builder stage
COPY --from=builder /matching-service .

# Copy the .env file from the builder stage (assuming it's located in the project root)
COPY --from=builder /app/.env .

# Expose the port your application runs on (change if your app uses a different port)
EXPOSE 5050

# Command to run the Go service
CMD ["./matching-service"]
