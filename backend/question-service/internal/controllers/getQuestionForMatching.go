package controllers

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"question-service/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// GetQuestion retrieves a random question based on complexity and category (topics)
func GetQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract query parameters from the URL
	complexity := r.URL.Query().Get("complexity")
	categories := r.URL.Query()["categories"] // Get the array of categories

	// Log the parameters for debugging
	log.Printf("Received complexity: %s, categories: %v", complexity, categories)

	// Validate the parameters (ensure complexity and at least one category are provided)
	if complexity == "" || len(categories) == 0 {
		http.Error(w, "Invalid query parameters", http.StatusBadRequest)
		return
	}

	// Create filter for MongoDB based on complexity and categories
	filter := bson.M{
		"complexity": complexity,                // Match the complexity (difficulty level)
		"category":   bson.M{"$in": categories}, // Match at least one of the provided categories (topics)
	}

	// Log the filter being used for MongoDB
	log.Printf("MongoDB query filter: %v", filter)

	// Query MongoDB to find all matching questions
	cursor, err := questionCollection.Find(context.TODO(), filter)
	if err != nil {
		log.Printf("Error finding questions: %v", err)
		http.Error(w, "Error retrieving questions", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	// Collect the matching questions into a slice
	var questions []models.Question
	for cursor.Next(context.TODO()) {
		var question models.Question
		if err := cursor.Decode(&question); err != nil {
			log.Printf("Error decoding question: %v", err)
			continue
		}
		questions = append(questions, question)
	}

	// If no questions are found, return a 404 response
	if len(questions) == 0 {
		http.Error(w, "No suitable questions found", http.StatusNotFound)
		return
	}

	// Create a new random number generator with a source based on the current time
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	// Select a random question from the list
	selectedQuestion := questions[rng.Intn(len(questions))]

	// Send the selected question as a JSON response
	json.NewEncoder(w).Encode(selectedQuestion)
}
