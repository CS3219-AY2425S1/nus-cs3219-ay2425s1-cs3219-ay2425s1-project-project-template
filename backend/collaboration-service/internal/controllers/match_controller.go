package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"collaboration-service/internal/config"
	"collaboration-service/internal/models"

	"go.mongodb.org/mongo-driver/bson"
)

// AuthorisedUserHandler checks if a user is authorised to join the room
func AuthorisedUserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract query parameters
	userId := r.URL.Query().Get("userId")
	roomId := r.URL.Query().Get("roomId")

	if userId == "" || roomId == "" {
		http.Error(w, "Missing userId or roomId", http.StatusBadRequest)
		return
	}

	// Get the matches collection from MongoDB
	collection := config.GetCollection("matches")

	// Find the match in the MongoDB collection
	var match models.Match
	filter := bson.M{"room_id": roomId}
	err := collection.FindOne(context.TODO(), filter).Decode(&match)
	if err != nil {
		log.Println("Error finding match:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Compare the userId with userOne and userTwo from the match
	if userId == match.UserOne || userId == match.UserTwo {
		json.NewEncoder(w).Encode(map[string]bool{"authorised": true})
	} else {
		json.NewEncoder(w).Encode(map[string]bool{"authorised": false})
	}
}

// GetQuestionHandler retrieves the question for a match based on the roomId
func GetQuestionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract roomId from query parameters
	roomId := r.URL.Query().Get("roomId")
	if roomId == "" {
		http.Error(w, "Missing roomId", http.StatusBadRequest)
		return
	}

	// Get the matches collection from MongoDB
	collection := config.GetCollection("matches")

	// Find the match in the MongoDB collection
	var match models.Match
	filter := bson.M{"room_id": roomId}
	err := collection.FindOne(context.TODO(), filter).Decode(&match)
	if err != nil {
		log.Println("Error finding match:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Check if the question exists in the match
	if match.Question.QuestionID == "" {
		http.Error(w, "No question found for the given roomId", http.StatusNotFound)
		return
	}

	// Return the question as a JSON response
	err = json.NewEncoder(w).Encode(match.Question)
	if err != nil {
		log.Printf("Error encoding question to JSON: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}

