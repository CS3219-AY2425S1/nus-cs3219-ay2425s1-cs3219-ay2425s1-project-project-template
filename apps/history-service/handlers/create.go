package handlers

import (
	"encoding/json"
	"google.golang.org/api/iterator"
	"history-service/models"
	"history-service/utils"
	"net/http"
)

// Create a new code snippet
func (s *Service) CreateHistory(w http.ResponseWriter, r *http.Request) {
	println("test1")
	ctx := r.Context()

	// Parse request
	var collaborationHistory models.CollaborationHistory
	if err := utils.DecodeJSONBody(w, r, &collaborationHistory); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		println(err.Error())
		return
	}

	println("test2")

	docRef, _, err := s.Client.Collection("collaboration-history").Add(ctx, map[string]interface{}{
		"title":              collaborationHistory.Title,
		"code":               collaborationHistory.Code,
		"language":           collaborationHistory.Language,
		"user":               collaborationHistory.User,
		"matchedUser":        collaborationHistory.MatchedUser,
		"matchId":            collaborationHistory.MatchID,
		"matchedTopics":      collaborationHistory.MatchedTopics,
		"questionDocRefId":   collaborationHistory.QuestionDocRefID,
		"questionDifficulty": collaborationHistory.QuestionDifficulty,
		"questionTopics":     collaborationHistory.QuestionTopics,
		"createdAt":          collaborationHistory.CreatedAt,
		"updatedAt":          collaborationHistory.UpdatedAt,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	println("test3")

	// Get data
	doc, err := docRef.Get(ctx)
	if err != nil {
		if err != iterator.Done {
			http.Error(w, "History not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to get history", http.StatusInternalServerError)
		return
	}

	println("test4")

	// Map data
	if err := doc.DataTo(&collaborationHistory); err != nil {
		http.Error(w, "Failed to map history data", http.StatusInternalServerError)
		return
	}
	collaborationHistory.DocRefID = doc.Ref.ID

	println(collaborationHistory.Title, "test")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(collaborationHistory)
}

//curl -X POST http://localhost:8082/histories \
//-H "Content-Type: application/json" \
//-d "{
//\"title\": \"Hello World in Python\",
//\"code\": \"print('Hello, World!')\",
//\"language\": \"Python\",
//\"user\": \"user789\",
//\"matchedUser\": \"user123\",
//\"matchId\": \"match123\",
//\"matchedTopics\": [\"Python\", \"Programming\"],
//\"questionDocRefId\": \"question123\",
//\"questionDifficulty\": \"Easy\",
//\"questionTopics\": [\"Python\", \"Programming\"],
//\"createdAt\": \"2024-10-27T10:00:00Z\",
//\"updatedAt\": \"2024-10-27T10:00:00Z\"
//}"
