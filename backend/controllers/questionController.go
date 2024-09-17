package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"backend/config"
	"backend/models"

	"go.mongodb.org/mongo-driver/mongo"
)

// MongoDB client and collection
var questionCollection *mongo.Collection = config.GetCollection(config.DB, "questions")

// Question model (struct) from models
type Question = models.Question

// Create a new question
func CreateQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var question Question
	_ = json.NewDecoder(r.Body).Decode(&question)
	question.CreatedAt = time.Now()
	question.UpdatedAt = time.Now()

	result, err := questionCollection.InsertOne(context.TODO(), question)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
