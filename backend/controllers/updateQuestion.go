package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UpdateQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the question ID from the URL parameters
	params := mux.Vars(r)
	questionID := params["id"]

	// Convert string ID to MongoDB ObjectId
	objID, err := primitive.ObjectIDFromHex(questionID)
	if err != nil {
		log.Println("Invalid ObjectID format:", err)
		http.Error(w, "Invalid question ID", http.StatusBadRequest)
		return
	}

	// Prepare the update data
	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		log.Println("Error decoding update data:", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Ensure that the "UpdatedAt" field is updated
	updateData["updatedAt"] = time.Now()

	// Prepare the filter to find the question by ObjectId
	filter := bson.M{"_id": objID}

	// Create the update object using MongoDB's $set operator
	update := bson.M{
		"$set": updateData,
	}

	// Perform the update
	result, err := questionCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Error updating question:", err)
		http.Error(w, "Failed to update question", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Question not found", http.StatusNotFound)
		return
	}

	// Respond with success
	log.Println("Question updated successfully")
	json.NewEncoder(w).Encode("Question updated successfully")
}
