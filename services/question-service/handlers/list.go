package handlers

import (
	"encoding/json"
	"net/http"
	"question-service/models"

	"google.golang.org/api/iterator"
)

// TODO: add filters/pagination/sorter
func (s *Service) ListQuestions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	iter := s.Client.Collection("questions").Documents(ctx)

	var questions []models.Question
	for {
		// Get data
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to retrieve questions", http.StatusInternalServerError)
			return
		}

		// Map data
		var question models.Question
		question.DocRefID = doc.Ref.ID
		if err := doc.DataTo(&question); err != nil {
			http.Error(w, "Failed to parse question", http.StatusInternalServerError)
			return
		}
		questions = append(questions, question)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(questions)
}
