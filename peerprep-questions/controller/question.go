package controller

import (
	"encoding/json"
	"net/http"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/model"
)

func CreateQuestion(w http.ResponseWriter, r *http.Request) {
	var question model.Question
	if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Validation

	// Set to DB

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(question)
}

func ListQuestions(w http.ResponseWriter, r *http.Request) {
	// var question model.Question
	// if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
	// 	http.Error(w, "Invalid input", http.StatusBadRequest)
	// 	return
	// }

	// // Validation

	// // Set to DB

	// w.WriteHeader(http.StatusCreated)
	// json.NewEncoder(w).Encode(question)
}

func UpdateQuestion(w http.ResponseWriter, r *http.Request) {
	// var question model.Question
	// if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
	// 	http.Error(w, "Invalid input", http.StatusBadRequest)
	// 	return
	// }

	// // Validation

	// // Set to DB

	// w.WriteHeader(http.StatusCreated)
	// json.NewEncoder(w).Encode(question)
}

func DeleteQuestion(w http.ResponseWriter, r *http.Request) {
	// var question model.Question
	// if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
	// 	http.Error(w, "Invalid input", http.StatusBadRequest)
	// 	return
	// }

	// // Validation

	// // Set to DB

	// w.WriteHeader(http.StatusCreated)
	// json.NewEncoder(w).Encode(question)
}

func GetQuestion(w http.ResponseWriter, r *http.Request) {
	// var question model.Question
	// if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
	// 	http.Error(w, "Invalid input", http.StatusBadRequest)
	// 	return
	// }

	// // Validation

	// // Set to DB

	// w.WriteHeader(http.StatusCreated)
	// json.NewEncoder(w).Encode(question)
}
