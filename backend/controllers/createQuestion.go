package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"backend/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var questionCollection *mongo.Collection

// SetCollection sets the MongoDB collection in the controller
func SetCollection(collection *mongo.Collection) {
	questionCollection = collection
}

// CreateQuestion handles the POST request to create a new question
func CreateQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var question models.Question

	log.Println("Received a request to create a question...")

	// Decode the request body into the Question struct
	err := json.NewDecoder(r.Body).Decode(&question)
	if err != nil {
		log.Println("Error decoding request body:", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Println("Decoded request body successfully...")

	// Set creation and update timestamps
	question.CreatedAt = time.Now()
	question.UpdatedAt = time.Now()

	// Generate a unique ID for the question
	question.QuestionID = primitive.NewObjectID().Hex()

	// Insert the question into MongoDB
	result, err := questionCollection.InsertOne(context.TODO(), question)
	if err != nil {
		log.Println("Error inserting question into MongoDB:", err)
		http.Error(w, "Failed to create question", http.StatusInternalServerError)
		return
	}

	log.Println("Question inserted with ID:", result.InsertedID)
	json.NewEncoder(w).Encode(result.InsertedID)
}
