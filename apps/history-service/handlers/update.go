package handlers

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"history-service/models"
	"history-service/utils"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
)

// Update an existing code snippet
func (s *Service) UpdateHistory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Parse request
	docRefId := chi.URLParam(r, "docRefId")
	var updatedHistory models.CollaborationHistory
	if err := utils.DecodeJSONBody(w, r, &updatedHistory); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Reference document
	docRef := s.Client.Collection("collaboration-history").Doc(docRefId)

	// Validation
	// Check if exists
	_, err := docRef.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			http.Error(w, "History not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching history", http.StatusInternalServerError)
		return
	}

	// Prepare the update data.
	updates := []firestore.Update{
		{Path: "code", Value: updatedHistory.Code},
		{Path: "updatedAt", Value: time.Now()},
	}

	// Update database
	_, err = docRef.Update(ctx, updates)
	if err != nil {
		http.Error(w, "Error updating history", http.StatusInternalServerError)
		return
	}

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

	// Map data
	if err := doc.DataTo(&updatedHistory); err != nil {
		http.Error(w, "Failed to map history data", http.StatusInternalServerError)
		return
	}
	updatedHistory.DocRefID = doc.Ref.ID

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedHistory)
}

//curl -X PUT http://localhost:8082/histories/largSKbROswF5pveMkEL \
//-H "Content-Type: application/json" \
//-d "{
//\"title\": \"Hello World in Python\",
//\"code\": \"print('Hello, Universe!')\",
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
