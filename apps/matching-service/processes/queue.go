package processes

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"matching-service/models"
	"strings"
	"sync"

	"github.com/redis/go-redis/v9"
)

var mutex sync.Mutex // Mutex for concurrency safety

// To simulate generating a random matchID for collaboration service (TODO: Future)
func GenerateMatchID() (string, error) {
	b := make([]byte, 16) // 16 bytes = 128 bits
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	matchID := hex.EncodeToString(b)
	return matchID, nil
}

// Print existing users in the matching queue
func PrintMatchingQueue(client *redis.Client, status string, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	users, err := client.LRange(ctx, "matchmaking_queue", 0, -1).Result()
	if err != nil {
		log.Println("Error retrieving users from queue:", err)
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

//

// Enqueue a user into the matchmaking queue
func EnqueueUser(client *redis.Client, username string, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	key := "matchmaking_queue"
	err := client.LPush(ctx, key, username).Err()
	if err != nil {
		log.Println("Error enqueuing user:", err)
	}
}

// Remove user from the matchmaking queue
func DequeueUser(client *redis.Client, username string, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	key := "matchmaking_queue"
	err := client.LRem(ctx, key, 1, username).Err()
	if err != nil {
		log.Println("Error dequeuing user:", err)
	}
}

// Add user into each specified topic set based on the topics selected by users
func AddUserToTopicSets(client *redis.Client, request models.MatchRequest, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	for _, topic := range request.Topics {
		err := client.SAdd(ctx, strings.ToLower(topic), request.Username).Err()
		if err != nil {
			log.Println("Error adding user to topic set:", err)
		}
	}
}

// Remove user from each specified topic set based on the topics selected by users
func RemoveUserFromTopicSets(client *redis.Client, username string, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	request, err := GetUserDetails(client, username, ctx)
	if err != nil {
		log.Println("Error retrieving user from hashset:", err)
		return
	}

	for _, topic := range request.Topics {
		err := client.SRem(ctx, strings.ToLower(topic), request.Username).Err()
		if err != nil {
			log.Println("Error removing user from topic set:", err)
		}
	}
}

// Add user details into hashset in Redis
func StoreUserDetails(client *redis.Client, request models.MatchRequest, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

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

	err = client.HSet(ctx, request.Username, map[string]interface{}{
		"topics":     topicsJSON,
		"difficulty": difficultiesJSON,
		"username":   request.Username,
	}).Err()
	if err != nil {
		log.Println("Error storing user details:", err)
	}
}

// Retrieve user details from hashset in Redis
func GetUserDetails(client *redis.Client, username string, ctx context.Context) (models.MatchRequest, error) {
	userDetails, err := client.HGetAll(ctx, username).Result()
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
func RemoveUserDetails(client *redis.Client, username string, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()

	err := client.Del(ctx, username).Err()
	if err != nil {
		log.Println("Error removing user details:", err)
	}
}

// Find the first matching user based on topics
func FindMatchingUser(client *redis.Client, username string, ctx context.Context) (string, string, string, error) {
	mutex.Lock()
	defer mutex.Unlock()

	user, err := GetUserDetails(client, username, ctx)
	if err != nil {
		return "", "", "", err
	}

	for _, topic := range user.Topics {
		users, err := client.SMembers(ctx, strings.ToLower(topic)).Result()
		if err != nil {
			return "", "", "", err
		}

		for _, potentialMatch := range users {
			if potentialMatch != username {
				matchedUser, err := GetUserDetails(client, potentialMatch, ctx)
				if err != nil {
					return "", "", "", err
				}

				commonDifficulty := GetCommonDifficulty(user.Difficulties, matchedUser.Difficulties)
				return potentialMatch, topic, commonDifficulty, nil
			}
		}
	}

	return "", "", "", nil
}

// Get the highest common difficulty between two users, if no common difficulty found, choose the min of the 2 arrays
func GetCommonDifficulty(userArr []string, matchedUserArr []string) string {
	commonDifficulties := make([]int, 3)
	for i := range commonDifficulties {
		commonDifficulties[i] = 0
	}

	for _, difficulty := range userArr {
		formattedDifficulty := strings.ToLower(difficulty)
		switch formattedDifficulty {
		case "easy":
			commonDifficulties[0]++
		case "medium":
			commonDifficulties[1]++
		case "hard":
			commonDifficulties[2]++
		default:
			log.Println("Unknown difficulty specified: " + difficulty)
		}
	}

	for _, difficulty := range matchedUserArr {
		formattedDifficulty := strings.ToLower(difficulty)
		switch formattedDifficulty {
		case "easy":
			commonDifficulties[0]++
		case "medium":
			commonDifficulties[1]++
		case "hard":
			commonDifficulties[2]++
		default:
			log.Println("Unknown difficulty specified: " + difficulty)
		}
	}

	lowest := "Hard"
	for i := 2; i >= 0; i-- {
		if commonDifficulties[i] == 2 {
			switch i {
			case 0:
				return "Easy"
			case 1:
				return "Medium"
			case 2:
				return "Hard"
			}
		} else if commonDifficulties[i] > 0 {
			switch i {
			case 0:
				lowest = "Easy"
			case 1:
				lowest = "Medium"
			case 2:
				lowest = "Hard"
			}
		}
	}
	return lowest
}

func CleanUpUser(client *redis.Client, username string, ctx context.Context) {
	mutex.Lock()
	defer mutex.Unlock()
	// Dequeue user
	key := "matchmaking_queue"
	err := client.LRem(ctx, key, 1, username).Err()
	if err != nil {
		log.Println("Error dequeuing user:", err)
	}

	// Remove user from topic sets
	request, err := GetUserDetails(client, username, ctx)
	if err != nil {
		log.Println("Error retrieving user from hashset:", err)
		return
	}

	for _, topic := range request.Topics {
		err := client.SRem(ctx, strings.ToLower(topic), request.Username).Err()
		if err != nil {
			log.Println("Error removing user from topic set:", err)
		}
	}

	// Remove user details
	err = client.Del(ctx, username).Err()
	if err != nil {
		log.Println("Error removing user details:", err)
	}
	return
}

func PopAndInsert(client *redis.Client, username string, ctx context.Context) {
	// Acquire Lock
	mutex.Lock()
	defer mutex.Unlock()

	// Pop user
	username, err := client.LPop(ctx, "matchmaking_queue").Result()
	if err != nil {
		log.Println("Error popping user from queue:", err)
	}

	// Insert back in queue
	key := "matchmaking_queue"
	err = client.LPush(ctx, key, username).Err()
	if err != nil {
		log.Println("Error enqueuing user:", err)
	}
	return
}
