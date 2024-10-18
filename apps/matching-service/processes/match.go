package processes

import (
	"context"
	"fmt"
	"log"
	"matching-service/models"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	redisClient *redis.Client
	mu          sync.Mutex // Mutex to ensure only one matchmaking goroutine is running
	ctx         = context.Background()
)

// SetRedisClient sets the Redis client to a global variable
func SetRedisClient(client *redis.Client) {
	redisClient = client
}

// Get redisclient
func GetRedisClient() *redis.Client {
	return redisClient
}

func getPortNumber(addr string) (int64, error) {
	// Split the string by the colon
	parts := strings.Split(addr, ":")
	if len(parts) < 2 {
		return 0, fmt.Errorf("no port number found")
	}

	// Convert the port string to an integer
	port, err := strconv.ParseInt(parts[len(parts)-1], 10, 64)
	if err != nil {
		return 0, err // Return an error if conversion fails
	}

	return port, nil
}

func PerformMatching(matchRequest models.MatchRequest, ctx context.Context, matchFoundChannels map[string]chan models.MatchFound) {
	// Acquire mutex
	mu.Lock()
	// Defer unlocking the mutex
	defer mu.Unlock()

	for {

		// Log queue before matchmaking
		// PrintMatchingQueue(redisClient, "Before Matchmaking", context.Background())

		// Check if the queue is empty
		queueLength, err := redisClient.LLen(context.Background(), "matchmaking_queue").Result()
		if err != nil {
			log.Println("Error checking queue length:", err)
			time.Sleep(1 * time.Second)
			continue
		}

		if queueLength == 0 {
			// log.Println("No users in the queue")
			time.Sleep(1 * time.Second)
			continue
		}

		// Peek at the user queue
		username, err := redisClient.LIndex(context.Background(), "matchmaking_queue", 0).Result()
		if err != nil {
			log.Println("Error peeking user from queue:", err)
			time.Sleep(1 * time.Second)
			continue
		}

		// log.Printf("Performing matching for user: %s", username)
		matchedUsername, matchedTopic, matchedDifficulty, err := FindMatchingUser(redisClient, username, ctx)
		if err != nil {
			log.Println("Error finding matching user:", err)
			time.Sleep(1 * time.Second)
			continue
		}

		if matchedUsername != "" {
			// Log down the state of queue before matchmaking
			PrintMatchingQueue(redisClient, "Before Matchmaking", context.Background())

			// Log down which users got matched
			log.Printf("Users %s and %s matched on the topic: %s with difficulty: %s", username, matchedUsername, matchedTopic, matchedDifficulty)

			// Clean up queue, sets and hashset in Redis
			DequeueUser(redisClient, username, ctx)
			DequeueUser(redisClient, matchedUsername, ctx)
			RemoveUserFromTopicSets(redisClient, username, ctx)
			RemoveUserFromTopicSets(redisClient, matchedUsername, ctx)
			RemoveUserDetails(redisClient, username, ctx)
			RemoveUserDetails(redisClient, matchedUsername, ctx)

			// Log queue after matchmaking
			PrintMatchingQueue(redisClient, "After Matchmaking", context.Background())

			// Generate a random match ID
			matchId, err := GenerateMatchID()
			if err != nil {
				log.Println("Unable to randomly generate matchID")
			}

			// Signal that a match has been found
			matchFoundChannels[username] <- models.MatchFound{
				Type:        "match_found",
				MatchID:     matchId,
				User:        username,
				MatchedUser: matchedUsername,
				Topic:       matchedTopic,
				Difficulty:  matchedDifficulty,
			}

		} else {
			// log.Printf("No match found for user: %s", username)

			// Pop user and add user back into queue
			PopAndInsert(redisClient, username, ctx)
		}
	}
}
