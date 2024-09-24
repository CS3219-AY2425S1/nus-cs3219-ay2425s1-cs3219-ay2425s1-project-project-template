package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/model"
	repository "github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/respository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestionController struct {
	questionRepository repository.QuestionRepository
}

func NewQuestionController(questionRepository repository.QuestionRepository) QuestionController {
	return QuestionController{
		questionRepository: questionRepository,
	}
}

func (qc QuestionController) CreateQuestion(w http.ResponseWriter, r *http.Request) {
	var question model.Question
	if err := json.NewDecoder(r.Body).Decode(&question); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Validation

	// Set to DB
	result, err := qc.questionRepository.CreateQuestion(question)
	if err != nil {
		log.Fatal("Error creating question")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	question.Id = result.InsertedID.(primitive.ObjectID)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(question)
}

func (qc QuestionController) ListQuestions(w http.ResponseWriter, r *http.Request) {
	// parse pagination/filter if need

	// Get from DB
	questions, err := qc.questionRepository.ListQuestions()
	if err != nil {
		log.Fatal("Error getting all question")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(questions)
}

func (qc QuestionController) UpdateQuestion(w http.ResponseWriter, r *http.Request) {
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

func (qc QuestionController) DeleteQuestion(w http.ResponseWriter, r *http.Request) {
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

func (qc QuestionController) GetQuestion(w http.ResponseWriter, r *http.Request) {
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
