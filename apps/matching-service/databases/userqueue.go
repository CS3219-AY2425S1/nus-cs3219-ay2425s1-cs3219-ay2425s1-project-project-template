package databases

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"matching-service/models"
	"strings"

	"github.com/redis/go-redis/v9"
)

// Print existing users in the matching queue
func PrintMatchingQueue(tx *redis.Tx, status string, ctx context.Context) {
	users, err := GetAllQueuedUsers(tx, ctx)
	if err != nil {
		return
	}

	var concatenatedUsers strings.Builder
	for i, user := range users {
		concatenatedUsers.WriteString(user)
		if i != len(users)-1 {
			concatenatedUsers.WriteString(", ")
		}
	}

	log.Println("Redis Queue (" + status + "): " + concatenatedUsers.String())
}

func IsQueueEmpty(tx *redis.Tx, ctx context.Context) (bool, error) {
	queueLength, err := tx.LLen(ctx, MatchmakingQueueRedisKey).Result()
	if err != nil {
		log.Println("Error checking queue length:", err)
		return false, err
	}
	// No users in the queue, so no need to perform matching
	return queueLength == 0, nil
}

// Enqueue a user into the matchmaking queue
func EnqueueUser(tx *redis.Tx, username string, ctx context.Context) {
	err := tx.LPush(ctx, MatchmakingQueueRedisKey, username).Err()
	if err != nil {
		log.Println("Error enqueuing user:", err)
	}
}

// Remove user from the matchmaking queue
func DequeueUser(tx *redis.Tx, username string, ctx context.Context) {
	err := tx.LRem(ctx, MatchmakingQueueRedisKey, 1, username).Err()
	if err != nil {
		log.Println("Error dequeuing user:", err)
		return
	}
}

// Returns the first user's username from the queue.
func GetFirstUser(tx *redis.Tx, ctx context.Context) (string, error) {
	// Peek at the user queue
	username, err := tx.LIndex(ctx, MatchmakingQueueRedisKey, 0).Result()
	if err != nil {
		log.Println("Error peeking user from queue:", err)
		return "", err
	}
	return username, nil
}

func GetAllQueuedUsers(tx *redis.Tx, ctx context.Context) ([]string, error) {
	users, err := tx.LRange(ctx, MatchmakingQueueRedisKey, 0, -1).Result()
	if err != nil {
		log.Println("Error retrieving users from queue:", err)
		return nil, err
	}
	return users, nil
}

// Add user details into hashset in Redis
func StoreUserDetails(tx *redis.Tx, request models.MatchRequest, ctx context.Context) {
	topicsJSON, err := json.Marshal(request.Topics)
	if err != nil {
		log.Println("Error marshalling topics:", err)
		return
	}

	difficultiesJSON, err := json.Marshal(request.Difficulties)
	if err != nil {
		log.Println("Error marshalling difficulties:", err)
		return
	}

	err = tx.HSet(ctx, request.Username, map[string]interface{}{
		"topics":     topicsJSON,
		"difficulty": difficultiesJSON,
		"username":   request.Username,
	}).Err()
	if err != nil {
		log.Println("Error storing user details:", err)
	}
}

// Retrieve user details from hashset in Redis
func GetUserDetails(tx *redis.Tx, username string, ctx context.Context) (models.MatchRequest, error) {
	userDetails, err := tx.HGetAll(ctx, username).Result()
	if err != nil {
		return models.MatchRequest{}, err
	}

	if len(userDetails) == 0 {
		return models.MatchRequest{}, fmt.Errorf("user not found in hashset: %s", username)
	}

	topicsJSON, topicsExist := userDetails["topics"]
	difficultiesJSON, difficultiesExist := userDetails["difficulty"]

	if !topicsExist || !difficultiesExist {
		return models.MatchRequest{}, fmt.Errorf("incomplete user details for: %s", username)
	}

	var topics []string
	err = json.Unmarshal([]byte(topicsJSON), &topics)
	if err != nil {
		return models.MatchRequest{}, fmt.Errorf("error unmarshalling topics: %v", err)
	}

	var difficulties []string
	err = json.Unmarshal([]byte(difficultiesJSON), &difficulties)
	if err != nil {
		return models.MatchRequest{}, fmt.Errorf("error unmarshalling difficulties: %v", err)
	}

	matchRequest := models.MatchRequest{
		Topics:       topics,
		Difficulties: difficulties,
		Username:     username,
	}

	return matchRequest, nil
}

// Remove user details from HashSet
func RemoveUserDetails(tx *redis.Tx, username string, ctx context.Context) {
	err := tx.Del(ctx, username).Err()
	if err != nil {
		log.Println("Error removing user details:", err)
	}
}

// Find the first matching user based on topics
// TODO: match based on available questions
func FindMatchingUser(tx *redis.Tx, username string, ctx context.Context) (*models.MatchFound, error) {
	user, err := GetUserDetails(tx, username, ctx)
	if err != nil {
		return nil, err
	}

	for _, topic := range user.Topics {
		users, err := tx.SMembers(ctx, strings.ToLower(topic)).Result()
		if err != nil {
			return nil, err
		}

		for _, potentialMatch := range users {
			if potentialMatch == username {
				continue
			}

			matchedUser, err := GetUserDetails(tx, potentialMatch, ctx)
			if err != nil {
				return nil, err
			}

			commonDifficulty := models.GetCommonDifficulty(user.Difficulties, matchedUser.Difficulties)

			matchFound := models.MatchFound{
				Type:                "match_found",
				MatchedUser:         potentialMatch,
				MatchedTopics:       topic,
				MatchedDifficulties: commonDifficulty,
			}

			return &matchFound, nil
		}
	}

	return nil, nil
}

func PopAndInsertUser(tx *redis.Tx, username string, ctx context.Context) {
	// Pop user
	username, err := tx.LPop(ctx, MatchmakingQueueRedisKey).Result()
	if err != nil {
		log.Println("Error popping user from queue:", err)
	}

	// Insert back in queue
	err = tx.LPush(ctx, MatchmakingQueueRedisKey, username).Err()
	if err != nil {
		log.Println("Error enqueuing user:", err)
	}
}
