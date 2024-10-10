package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/streadway/amqp"
)

// MatchRequest represents the structure of the incoming message
type MatchRequest struct {
	UserID          string `json:"userID"`
	Topic           string `json:"topic"`
	ExperienceLevel string `json:"experienceLevel"`
}

// PendingMatches stores users waiting for a match, keyed by topic and experience level
var PendingMatches = make(map[string][]string)
var mu sync.Mutex // To ensure thread-safe access to PendingMatches

// New function to attempt matching within the same level or adjacent levels
func attemptMatchAfterTimeout(userID, topic, experienceLevel string, delivery amqp.Delivery) {
	log.Printf("Starting 30-second timer for user %s", userID)
	time.Sleep(30 * time.Second) // Wait for 30 seconds before attempting to match

	mu.Lock()
	defer mu.Unlock() // Ensure unlock even in case of early return

	// Attempt to match users within the same level or adjacent levels
	matchAttempted := matchFromQueue(topic, experienceLevel, userID)
	if !matchAttempted {
		// Check adjacent levels if no match is found at the same level
		prevLevel, nextLevel := getAdjacentLevels(experienceLevel)
		if prevLevel != "" && matchFromQueue(topic, prevLevel, userID) {
			log.Printf("Matched user %s from adjacent level %s", userID, prevLevel)
			delivery.Ack(false) // Acknowledge after successful match
			return
		}
		if nextLevel != "" && matchFromQueue(topic, nextLevel, userID) {
			log.Printf("Matched user %s from adjacent level %s", userID, nextLevel)
			delivery.Ack(false) // Acknowledge after successful match
			return
		}
	}

	// No match found, log this and dequeue user
	log.Printf("No match found for user %s after 30 seconds, dequeuing", userID)
	dequeueUserAfterTimeout(userID, topic, experienceLevel)
	delivery.Ack(false) // Acknowledge after processing
}

// Updated ProcessMatchRequest to call the new function
func ProcessMatchRequest(delivery amqp.Delivery) error {
	log.Printf("Processing message: %s", delivery.Body)

	// Unmarshal the JSON message into a MatchRequest struct
	var matchRequest MatchRequest
	err := json.Unmarshal(delivery.Body, &matchRequest)
	if err != nil {
		return fmt.Errorf("failed to unmarshal message: %w", err)
	}

	userID := matchRequest.UserID
	topic := matchRequest.Topic
	experienceLevel := matchRequest.ExperienceLevel
	queueKey := fmt.Sprintf("%s:%s", topic, experienceLevel)

	mu.Lock()
	// Add the user to the pending queue
	PendingMatches[queueKey] = append(PendingMatches[queueKey], userID)
	log.Printf("Added user %s to pending matches for topic %s at level %s", userID, topic, experienceLevel)
	mu.Unlock()

	// Call the new function as a goroutine to attempt matching after 30 seconds
	go attemptMatchAfterTimeout(userID, topic, experienceLevel, delivery)

	return nil
}

// Function to match users from the queue, considering the specific userID passed
func matchFromQueue(topic, level, userID string) bool {
	queueKey := fmt.Sprintf("%s:%s", topic, level)
	if users, exists := PendingMatches[queueKey]; exists {
		// Check if the userID exists in the queue
		for i, u := range users {
			if u == userID {
				// Attempt to match this user with another user in the queue
				if len(users) > 1 {
					// Ensure there are other users in the queue to match with
					matchedUser := ""
					for j, otherUser := range users {
						if j != i { // Find another user to match
							matchedUser = otherUser
							break
						}
					}

					if matchedUser != "" {
						// Match found, remove both users from the queue
						PendingMatches[queueKey] = removeFromQueue(users, i)
						PendingMatches[queueKey] = removeFromQueue(PendingMatches[queueKey], findIndex(PendingMatches[queueKey], matchedUser))

						log.Printf("Matched users: %s and %s for topic %s at level %s", userID, matchedUser, topic, level)
						notifyUsers(userID, matchedUser)
						return true
					}
				}
				// No match found for this user
				break
			}
		}
	}
	return false
}

// Function to dequeue the user after timeout if not matched
func dequeueUserAfterTimeout(userID, topic, experienceLevel string) {
	queueKey := fmt.Sprintf("%s:%s", topic, experienceLevel)

	// Remove the user if they are still in the queue after 30 seconds
	if users, exists := PendingMatches[queueKey]; exists {
		for i, u := range users {
			if u == userID {
				// Remove the user from the queue
				PendingMatches[queueKey] = append(users[:i], users[i+1:]...)
				log.Printf("User %s was dequeued after 30 seconds timeout for topic %s at level %s", userID, topic, experienceLevel)
				return
			}
		}
	}
}

// Dummy function to simulate notifying the matched users
func notifyUsers(user1, user2 string) {
	log.Printf("Notified users %s and %s that they are matched.", user1, user2)
}

// Function to get the adjacent experience levels
func getAdjacentLevels(currentLevel string) (string, string) {
	levels := []string{"beginner", "intermediate", "expert"}
	index := -1

	// Find the index of the current experience level
	for i, level := range levels {
		if level == currentLevel {
			index = i
			break
		}
	}

	// Return empty strings if the index is out of bounds
	prevLevel, nextLevel := "", ""
	if index > 0 {
		prevLevel = levels[index-1] // One level down
	}
	if index < len(levels)-1 {
		nextLevel = levels[index+1] // One level up
	}

	return prevLevel, nextLevel
}

// Helper function to remove a user from the queue by index
func removeFromQueue(users []string, index int) []string {
	return append(users[:index], users[index+1:]...)
}

// Helper function to find the index of a user in the queue
func findIndex(users []string, userID string) int {
	for i, u := range users {
		if u == userID {
			return i
		}
	}
	return -1
}
