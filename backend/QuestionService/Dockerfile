# Use the official Golang image to create a build artifact.
# This is a multi-stage build. It uses the golang image for building the app.
FROM golang:1.23 as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Start a new stage from scratch
# This is the second stage where the compiled binary is run in a minimal environment.
FROM alpine:latest  

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .

# Expose port 3002 to the outside world
EXPOSE 3002

# Command to run the executable
CMD ["./main"]
