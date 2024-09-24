package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"question-service/models"
	"question-service/utils"
)

func (s *Service) CreateQuestion(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Parse request
	var question models.Question
	if err := utils.DecodeJSONBody(w, r, &question); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Update database
	docRef, _, err := s.Client.Collection("questions").Add(ctx, map[string]interface{}{
		"title":       question.Title,
		"description": question.Description,
		"complexity":  question.Complexity,
		"categories":  question.Categories,
	})
	if err != nil {
		http.Error(w, "Error adding question", http.StatusInternalServerError)
		return
	}

	// Map data
	question.Ref = docRef.ID

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(question)

	fmt.Fprintf(w, "Question with ID %s created successfully", question.ID)
}
