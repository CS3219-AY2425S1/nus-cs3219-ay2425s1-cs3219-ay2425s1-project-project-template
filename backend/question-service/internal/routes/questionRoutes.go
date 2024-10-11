package routes

import (
	"question-service/internal/controllers"

	"github.com/gorilla/mux"
)

// RegisterQuestionRoutes defines the API routes for managing questions
func RegisterQuestionRoutes(router *mux.Router) {
	router.HandleFunc("/questions", controllers.CreateQuestion).Methods("POST")
	router.HandleFunc("/questions/{id}", controllers.UpdateQuestion).Methods("PUT")
	router.HandleFunc("/questions/{id}", controllers.DeleteQuestion).Methods("DELETE")
	router.HandleFunc("/questions/{id}", controllers.GetQuestionByID).Methods("GET")
	router.HandleFunc("/questions", controllers.GetAllQuestions).Methods("GET")
}
