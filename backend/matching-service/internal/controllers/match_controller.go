package controllers

import (
	"log"
	"matching-service/internal/models"
	"matching-service/internal/services"
	"matching-service/internal/socket"
	"matching-service/internal/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AddUserHandler handles the request to add a user and start matching
func AddUserHandler(c *gin.Context) {
	var matchingInfo models.MatchingInfo
	if err := c.ShouldBindJSON(&matchingInfo); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	matchingInfo.Status = models.Pending
	matchingInfo.RoomID = uuid.New().String()

	services.DeleteUnusedFromDB()

	// Insert matching info into MongoDB
	_, err := services.InsertMatching(matchingInfo)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	go startMatchingProcess(matchingInfo)

	c.JSON(200, gin.H{"message": "User added", "user_id": matchingInfo.UserID, "socket_id": matchingInfo.SocketID})
}

// CancelMatchHandler handles the request to cancel a user's match search
func CancelMatchHandler(c *gin.Context) {
	userID := c.Param("userID")

	// update the user's status to 'Cancelled' in MongoDB
	err := services.CancelUserMatch(userID)
	if err != nil {
		log.Printf("Error canceling match for user_id: %s, error: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel match"})
		return
	}

	log.Printf("User %s has successfully canceled their match", userID)
	c.JSON(http.StatusOK, gin.H{"message": "Match search canceled"})
}

// findIntersection returns the intersection of two slices of strings
func findIntersection(a, b []string) []string {
	set := make(map[string]bool)
	intersection := []string{}

	for _, item := range a {
		set[item] = true
	}
	for _, item := range b {
		if set[item] {
			intersection = append(intersection, item)
		}
	}

	return intersection
}

// findComplexityIntersection returns the intersection of two slices of QuestionComplexityEnum
func findComplexityIntersection(a, b []models.QuestionComplexityEnum) []models.QuestionComplexityEnum {
	set := make(map[models.QuestionComplexityEnum]bool)
	intersection := []models.QuestionComplexityEnum{}

	for _, item := range a {
		set[item] = true
	}

	for _, item := range b {
		if set[item] {
			intersection = append(intersection, item)
		}
	}

	return intersection
}

// startMatchingProcess starts the matching logic with a timeout
func startMatchingProcess(matchingInfo models.MatchingInfo) {
	matchChan := make(chan *models.MatchingInfo)

	// start a goroutine to attempt matching the user
	go func() {
		result, err := services.FindMatch(matchingInfo)
		if err != nil || result == nil {
			matchChan <- nil
			return
		}

		// only check programming languages if generalize_languages is false
		if !matchingInfo.GeneralizeLanguages {

			// If either user has selected "any" language, allow the other user's language
			if len(result.ProgrammingLanguages) == 0 && len(matchingInfo.ProgrammingLanguages) == 0 {
				// default language JavaScript
				result.ProgrammingLanguages = []models.ProgrammingLanguageEnum{models.JavaScript}
				matchingInfo.ProgrammingLanguages = []models.ProgrammingLanguageEnum{models.JavaScript}
				matchChan <- result
				return
			} else if len(matchingInfo.ProgrammingLanguages) == 0 {
				matchingInfo.ProgrammingLanguages = result.ProgrammingLanguages
				matchChan <- result
				return
			} else if len(result.ProgrammingLanguages) == 0 {
				result.ProgrammingLanguages = matchingInfo.ProgrammingLanguages
				matchChan <- result
				return
			}
			

			// check for specific language match if both users have specific selections
			languageMatched := false
			for _, lang1 := range matchingInfo.ProgrammingLanguages {
				for _, lang2 := range result.ProgrammingLanguages {
					if lang1 == lang2 {
						languageMatched = true // Match found with a common language
						break
					}
				}
				if languageMatched {
					break
				}
			}

			if !languageMatched {
				log.Printf("No match for user_id: %s due to language mismatch", matchingInfo.UserID)
				matchChan <- nil
				return
			}
		}

		// If generalization is allowed or languages match, proceed with the match
		matchChan <- result

	}()

	// set up a 30-second timeout
	select {
	case matchedUser := <-matchChan:
		if matchedUser != nil {
			log.Printf("Found a match for user_id: %s", matchingInfo.UserID)

			// check if both users are still Pending before proceeding
			user1Status, err := services.GetUserStatus(matchingInfo.UserID)
			if err != nil {
				log.Printf("Error retrieving status for user_id: %s", matchingInfo.UserID)
				return
			}

			user2Status, err := services.GetUserStatus(matchedUser.UserID)
			if err != nil {
				log.Printf("Error retrieving status for user_id: %s", matchedUser.UserID)
				return
			}

			if user1Status == models.Cancelled || user2Status == models.Cancelled {
				log.Printf("User %s or %s has cancelled, match discarded", matchingInfo.UserID, matchedUser.UserID)
				return
			}

			// cancel the timeout for both users
			if timer, ok := utils.Store[matchingInfo.UserID]; ok {
				timer.Stop()
				delete(utils.Store, matchingInfo.UserID)
			}

			if timer, ok := utils.Store[matchedUser.UserID]; ok {
				timer.Stop() 
				delete(utils.Store, matchedUser.UserID)
			}

			roomID := matchingInfo.RoomID

			// i[date the status and room_id of both users in MongoDB (only after the match is confirmed)
			err = services.UpdateMatchStatusAndRoomID(matchingInfo.UserID, matchedUser.UserID, roomID)
			if err != nil {
				log.Printf("Error updating status for user_id: %s and user_id: %s", matchingInfo.UserID, matchedUser.UserID)
			}

			// dind the intersection of complexities and categories
			complexityIntersection := findComplexityIntersection(matchingInfo.DifficultyLevel, matchedUser.DifficultyLevel)
			categoriesIntersection := findIntersection(matchingInfo.Categories, matchedUser.Categories)

			matchResult := models.MatchResult{
				UserOneSocketID: matchingInfo.SocketID,
				UserTwoSocketID: matchedUser.SocketID,
				UserOne:         matchingInfo.UserID,   
				UsernameOne:     matchingInfo.Username,
				UserTwo:         matchedUser.UserID,   
				UsernameTwo:     matchedUser.Username,
				RoomID:          roomID,                
				ProgrammingLanguages: matchedUser.ProgrammingLanguages,
				Complexity:      complexityIntersection, 
				Categories:      categoriesIntersection, 
				Question:        models.Question{},      
			}

			// Publish the match result to RabbitMQ
			err = services.PublishMatch(matchResult)
			if err != nil {
				log.Printf("Error publishing match result to RabbitMQ: %v", err)
			}

			// Send match result to WebSocket clients
			socket.BroadcastMatch(socket.MatchMessage{
				User1:  matchingInfo.SocketID,
				User2:  matchedUser.SocketID,
				RoomId: matchResult.RoomID,
				State:  "Matched",
			})

			log.Printf("User %s and User %s have been matched and published to RabbitMQ", matchingInfo.UserID, matchedUser.UserID)

		} else {
			// no match was found within the matchChan logic
			log.Printf("No match found for user_id: %s within matchChan logic", matchingInfo.UserID)

			time.Sleep(30 * time.Second) // Give the match process time to continue
			services.MarkAsTimeout(matchingInfo)
			log.Printf("User %s has been marked as Timeout", matchingInfo.UserID)
		}
	case <-time.After(30 * time.Second):
		// timeout after 30 seconds, no match was found
		log.Printf("Timeout occurred for user_id: %s, no match found", matchingInfo.UserID)
		services.MarkAsTimeout(matchingInfo)
		log.Printf("User %s has been marked as Timeout (Timeout elapsed)", matchingInfo.UserID)
	}
}
