package processes

import (
	"context"
	"encoding/json"
	"log"
	"matching-service/databases"
	"matching-service/models"
	"matching-service/utils"

	"github.com/redis/go-redis/v9"
)

// Performs the matching algorithm at most once starting from the front of the queue of users,
// until a match is found or no match and the user is enqueued to the queue.
func PerformMatching(matchRequest models.MatchRequest, ctx context.Context) {
	redisClient := databases.GetRedisClient()

	err := redisClient.Watch(ctx, func(tx *redis.Tx) error {
		// Log queue before and after matchmaking
		databases.PrintMatchingQueue(tx, "Before Matchmaking", ctx)
		defer databases.PrintMatchingQueue(tx, "After Matchmaking", ctx)

		// Iterate through the users in the queue from the front of the queue
		queuedUsernames, err := databases.GetAllQueuedUsers(tx, ctx)
		if err != nil {
			return err
		}

		currentUsername := matchRequest.Username
		databases.AddUser(tx, matchRequest, ctx)

		for _, username := range queuedUsernames {
			// Skip same user
			if username == currentUsername {
				// WARN: same user should not appear, since user is added after the queue users is accessed
				// so this means that the user has another active websocket connection
				continue
			}

			// Find a matching user if any
			matchFound, err := databases.FindMatchingUser(tx, currentUsername, ctx)
			if err != nil {
				log.Println("Error finding matching user:", err)
				return err
			}

			if matchFound != nil {
				matchedUsername := matchFound.MatchedUser
				matchedTopic := matchFound.Topic
				matchedDifficulty := matchFound.Difficulty

				// Generate a random match ID
				matchId, err := utils.GenerateMatchID()
				if err != nil {
					log.Println("Unable to randomly generate matchID")
				}

				// Log down which users got matched
				matchFound.MatchID = matchId
				log.Printf("Users %s and %s matched on the topic: %s with difficulty: %s", currentUsername, matchedUsername, matchedTopic, matchedDifficulty)

				// Clean up redis for this match
				databases.CleanUpUser(tx, currentUsername, ctx)
				databases.CleanUpUser(tx, matchedUsername, ctx)

				publishMatch(tx, ctx, currentUsername, matchedUsername, matchFound)
				publishMatch(tx, ctx, matchedUsername, currentUsername, matchFound)
			}
		}

		return nil
	})
	if err != nil {
		// Handle error (like retry logic could be added here)
		// return fmt.Errorf("transaction execution failed: %v", err)
		return
	}
}

// publish a match to the target user's pubsub channel
func publishMatch(tx *redis.Tx, ctx context.Context, targetUser string, otherMatchedUser string, matchFound *models.MatchFound) error {
	matchFound.User = targetUser
	matchFound.MatchedUser = otherMatchedUser
	msg, err := json.Marshal(matchFound)
	if err != nil {
		log.Fatalf("Could not marshal message: %v", err)
		return err
	}
	tx.Publish(ctx, targetUser, msg)
	return nil
}
