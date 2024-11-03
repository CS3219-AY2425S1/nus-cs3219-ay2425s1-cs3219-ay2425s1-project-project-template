package handlers

import (
	"encoding/json"
	"history-service/models"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/go-chi/chi/v5"
	"google.golang.org/api/iterator"
)

func (s *Service) ListUserQuestionHistories(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Parse request
	username := chi.URLParam(r, "username")
	questionDocRefID := chi.URLParam(r, "questionDocRefId")

	// Reference collection
	collRef := s.Client.Collection("collaboration-history")

	// Query data
	iterUser := collRef.Where("user", "==", username).
		Where("questionDocRefId", "==", questionDocRefID).
		OrderBy("createdAt", firestore.Desc).
		Documents(ctx)
	iterMatchedUser := collRef.Where("matchedUser", "==", username).
		Where("questionDocRefId", "==", questionDocRefID).
		OrderBy("createdAt", firestore.Desc).
		Documents(ctx)

	// Map data
	var histories []models.CollaborationHistory
	for {
		doc, err := iterUser.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to get histories for user", http.StatusInternalServerError)
			return
		}

		var history models.CollaborationHistory
		if err := doc.DataTo(&history); err != nil {
			http.Error(w, "Failed to map history data for user", http.StatusInternalServerError)
			return
		}
		history.HistoryDocRefID = doc.Ref.ID

		histories = append(histories, history)
	}

	for {
		doc, err := iterMatchedUser.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to get histories for matched user", http.StatusInternalServerError)
			return
		}

		var history models.CollaborationHistory
		if err := doc.DataTo(&history); err != nil {
			http.Error(w, "Failed to map history data for matched user", http.StatusInternalServerError)
			return
		}
		history.HistoryDocRefID = doc.Ref.ID

		// Swap matched user and user
		history.MatchedUser = history.User
		history.User = username

		histories = append(histories, history)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(histories)
}
