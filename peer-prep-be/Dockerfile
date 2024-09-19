# Start by pulling the Go base image
FROM golang:1.23

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to the working directory
COPY go.mod go.sum ./

# Download all Go dependencies
RUN go mod download

# Copy the rest of the application code
COPY *.go ./

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -o test_run ./src

# Command to run the executable
CMD ["./test_run"]
