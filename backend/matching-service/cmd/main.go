package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/streadway/amqp"
)

// Define the structure for UserMatchRequest
type UserMatchRequest struct {
	UserID          string `json:"userID"`
	Topic           string `json:"topic"`
	ExperienceLevel string `json:"experienceLevel"`
}

// A map to store the pending matches
var pendingMatches = make(map[string]map[string][]string)

// This function checks if the user is already in the pending queue for a specific topic and experience level
func isUserAlreadyInQueue(userID, topic, experienceLevel string) bool {
	if _, exists := pendingMatches[topic]; exists {
		if _, levelExists := pendingMatches[topic][experienceLevel]; levelExists {
			for _, id := range pendingMatches[topic][experienceLevel] {
				if id == userID {
					return true
				}
			}
		}
	}
	return false
}

// This function adds the user to the pending matches
func addUserToPendingMatches(userID, topic, experienceLevel string) {
	if pendingMatches[topic] == nil {
		pendingMatches[topic] = make(map[string][]string)
	}
	pendingMatches[topic][experienceLevel] = append(pendingMatches[topic][experienceLevel], userID)
}

// Function to simulate matching users
func matchUsers(topic, experienceLevel string) {
	if users, exists := pendingMatches[topic][experienceLevel]; exists && len(users) >= 2 {
		log.Printf("Matched users: %s and %s on topic %s at level %s", users[0], users[1], topic, experienceLevel)
		// After matching, remove these users from the pending matches
		pendingMatches[topic][experienceLevel] = pendingMatches[topic][experienceLevel][2:]
	}
}

// Function to process incoming RabbitMQ messages
func processMessage(message []byte) {
	var request UserMatchRequest
	err := json.Unmarshal(message, &request)
	if err != nil {
		log.Println("Error unmarshalling message:", err)
		return
	}

	log.Printf("Processing message: %s", message)

	if !isUserAlreadyInQueue(request.UserID, request.Topic, request.ExperienceLevel) {
		addUserToPendingMatches(request.UserID, request.Topic, request.ExperienceLevel)
		log.Printf("Added user %s to pending matches for topic %s at level %s", request.UserID, request.Topic, request.ExperienceLevel)

		// Try to match users after adding a new one
		matchUsers(request.Topic, request.ExperienceLevel)
	} else {
		log.Printf("User %s is already in the pending matches for topic %s at level %s, skipping.", request.UserID, request.Topic, request.ExperienceLevel)
	}
}

func listenToQueue() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"peer-matching-queue", // Queue name
		true,                  // Durable
		false,                 // Delete when unused
		false,                 // Exclusive
		false,                 // No-wait
		nil,                   // Arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %v", err)
	}

	msgs, err := ch.Consume(
		q.Name, // Queue name
		"",     // Consumer tag
		false,  // Auto-ack (set to false for manual ack)
		false,  // Exclusive
		false,  // No-local
		false,  // No-wait
		nil,    // Arguments
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %v", err)
	}

	log.Println("Waiting for messages. To exit press CTRL+C")

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)

			// Process the message
			processMessage(d.Body)

			// Manually acknowledge the message after processing
			d.Ack(false)
		}
	}()

	// Block until an interrupt signal is received
	forever := make(chan bool)
	<-forever
}

// HTTP handler to add users dynamically
func addUserHandler(w http.ResponseWriter, r *http.Request) {
	var request UserMatchRequest

	// Parse JSON body
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Publish the request to RabbitMQ
	err = publishMatchRequest(request)
	if err != nil {
		http.Error(w, "Failed to publish message", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User %s added to queue for topic %s at level %s", request.UserID, request.Topic, request.ExperienceLevel)
}

// Function to publish a message to RabbitMQ
func publishMatchRequest(request UserMatchRequest) error {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open a channel: %v", err)
	}
	defer ch.Close()

	body, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %v", err)
	}

	err = ch.Publish(
		"",                    // exchange
		"peer-matching-queue", // routing key
		false,                 // mandatory
		false,                 // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish a message: %v", err)
	}

	return nil
}

// Function to handle graceful shutdown
func gracefulShutdown() {
	// Wait for interrupt signal to gracefully shut down the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	// Block until a signal is received
	<-c
	log.Println("Shutting down server...")
	os.Exit(0)
}

func main() {
	log.Println("Server started. Listening for messages...")

	// Start listening to RabbitMQ queue
	go listenToQueue()

	// Start HTTP server on port 8080
	http.HandleFunc("/match", addUserHandler)

	go func() {
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()

	// Handle graceful shutdown
	gracefulShutdown()
}
