# Use Golang base image
FROM golang:1.20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to the container and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the Go code to the container
COPY . .

# Build the Go application
RUN go build -o main ./cmd/main.go

# Expose the port your Go server listens on
EXPOSE 8080

# Command to run the Go application
CMD ["./main"]
