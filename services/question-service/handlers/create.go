package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"question-service/models"
	"question-service/utils"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

func (s *Service) CreateQuestion(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Parse request
	var question models.Question
	if err := utils.DecodeJSONBody(w, r, &question); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validation
	// TODO: Duplicate checking for question name

	// Reference to the document where we store the last ID
	counterDocRef := s.Client.Collection("counters").Doc("questions")

	// Firestore transaction to implement auto-increment
	err := s.Client.RunTransaction(ctx, func(ctx context.Context, tx *firestore.Transaction) error {
		doc, err := tx.Get(counterDocRef)
		if err != nil {
			return err
		}

		// Get the current value of the counter
		currentCounter := doc.Data()["count"].(int64)
		newCounter := currentCounter + 1

		// Update the counter in Firestore
		if err := tx.Set(counterDocRef, map[string]interface{}{
			"count": newCounter,
		}); err != nil {
			return err
		}

		// Use the newCounter as the ID for the new document
		docRef, _, err := s.Client.Collection("questions").Add(ctx, map[string]interface{}{
			"id":          newCounter,
			"title":       question.Title,
			"description": question.Description,
			"complexity":  question.Complexity,
			"categories":  question.Categories,
			"createdAt":   firestore.ServerTimestamp,
		})
		if err != nil {
			http.Error(w, "Error adding question", http.StatusInternalServerError)
			return err
		}

		// Get data
		doc, err = docRef.Get(ctx)
		if err != nil {
			if err != iterator.Done {
				http.Error(w, "Question not found", http.StatusNotFound)
				return err
			}
			http.Error(w, "Failed to get question", http.StatusInternalServerError)
			return err
		}

		// Map data
		question.DocRefID = doc.Ref.ID
		if err := doc.DataTo(&question); err != nil {
			http.Error(w, "Failed to map question data", http.StatusInternalServerError)
			return err
		}

		return nil
	})
	if err != nil {
		log.Fatalf("Trasaction failed: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(question)

	fmt.Fprintf(w, "Question with ID %s created successfully", question.DocRefID)
}
