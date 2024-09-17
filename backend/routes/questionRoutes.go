package routes

import (
	"backend/controllers"

	"github.com/gorilla/mux"
)

// RegisterQuestionRoutes sets up the API endpoints for questions
func RegisterQuestionRoutes(router *mux.Router) {
	router.HandleFunc("/api/questions", controllers.CreateQuestion).Methods("POST")
}
