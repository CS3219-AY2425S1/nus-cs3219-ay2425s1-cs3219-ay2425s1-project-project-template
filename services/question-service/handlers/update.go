package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"question-service/models"
	"question-service/utils"

	"cloud.google.com/go/firestore"
	"github.com/go-chi/chi/v5"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Service) UpdateQuestion(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Parse request
	id := chi.URLParam(r, "id")
	var question models.Question
	if err := utils.DecodeJSONBody(w, r, &question); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if exists
	_, err := s.Client.Collection("questions").Doc(id).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			http.Error(w, "Question not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching question", http.StatusInternalServerError)
		return
	}

	// Prepare the update data
	updates := []firestore.Update{
		{Path: "title", Value: question.Title},
		{Path: "description", Value: question.Description},
		{Path: "complexity", Value: question.Complexity},
		{Path: "categories", Value: question.Categories},
	}

	// Update database
	_, err = s.Client.Collection("questions").Doc(id).Update(ctx, updates)
	if err != nil {
		http.Error(w, "Error updating question", http.StatusInternalServerError)
		return
	}

	// Map data
	question.Ref = id

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(question)

	fmt.Fprintf(w, "Question with ID %s updated successfully", id)
}
