package controllers

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DeleteQuestion deletes a question from the MongoDB collection by ID
func DeleteQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the question ID from the URL parameters
	params := mux.Vars(r)
	questionID := params["id"]

	// Convert the question ID to ObjectId (if it's an ObjectId in MongoDB)
	objID, err := primitive.ObjectIDFromHex(questionID)
	if err != nil {
		log.Println("Invalid ObjectID format:", err)
		http.Error(w, "Invalid question ID", http.StatusBadRequest)
		return
	}

	// Prepare the filter to find the question by ID
	filter := bson.M{"_id": objID}

	// Delete the question from MongoDB
	result, err := questionCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		log.Println("Error deleting question:", err)
		http.Error(w, "Failed to delete question", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Question not found", http.StatusNotFound)
		return
	}

	log.Println("Question deleted successfully")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Question deleted successfully"))
}
