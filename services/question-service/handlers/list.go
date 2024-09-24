package handlers

import (
	"cloud.google.com/go/firestore"
	"encoding/json"
	"google.golang.org/api/iterator"
	"net/http"
	"question-service/models"
	"strconv"
	"strings"
)

func (s *Service) ListQuestions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := s.Client.Collection("questions").Query

	// Filtering by title
	titleParam := r.URL.Query().Get("title")
	if titleParam != "" {
		query = query.Where("Title", "==", titleParam)
	}

	// Filtering by complexity (multi-select)
	complexityParam := r.URL.Query().Get("complexity")
	if complexityParam != "" {
		complexities := strings.Split(complexityParam, ",")
		query = query.Where("Complexity", "in", complexities)
	}

	// Filtering by categories (multi-select)
	categoriesParam := r.URL.Query().Get("categories")
	if categoriesParam != "" {
		categories := strings.Split(categoriesParam, ",")
		query = query.Where("Categories", "array-contains-any", categories)
	}

	// Sorting
	sortField := r.URL.Query().Get("sortField")
	sortValue := r.URL.Query().Get("sortValue")
	if sortField != "" {
		order := firestore.Asc // Default ascending order
		if sortValue == "desc" {
			order = firestore.Desc
		}
		query = query.OrderBy(sortField, order)
	}

	// Count total documents matching the filter
	totalIter, err := query.Documents(ctx).GetAll()
	totalCount := len(totalIter)
	if err != nil {
		http.Error(w, "Failed to count questions: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Pagination
	currentPage := 1
	limitParam := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitParam) // convert limit to integer
	if err != nil || limit <= 0 {
		limit = 10 // Default to 10
	}
	startAfterParam := r.URL.Query().Get("startAfter")
	if startAfterParam != "" {
		// Calculate current page based on total documents before startAfter
		beforeIter := query.EndAt(startAfterParam).Documents(ctx)
		countBeforeStart := 0
		for {
			_, err := beforeIter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				http.Error(w, "Failed to retrieve documents: "+err.Error(), http.StatusInternalServerError)
				return
			}
			countBeforeStart++
		}
		currentPage = (countBeforeStart / limit) + 1

		// start after previous page last question's document reference
		query = query.StartAfter(startAfterParam)
	}
	query = query.Limit(limit)

	iter := query.Documents(ctx)

	var questions []models.Question
	for {
		// Get data
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			http.Error(w, "Failed to retrieve questions: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Map data
		var question models.Question
		if err := doc.DataTo(&question); err != nil {
			http.Error(w, "Failed to parse question: "+err.Error(), http.StatusInternalServerError)
			return
		}
		question.Ref = doc.Ref.ID
		questions = append(questions, question)
	}

	// Calculate pagination info
	totalPages := (totalCount + limit - 1) / limit
	hasNextPage := totalPages > currentPage

	// Construct response
	response := models.QuestionResponse{
		TotalCount:  totalCount,
		TotalPages:  totalPages,
		CurrentPage: currentPage,
		Limit:       limit,
		HasNextPage: hasNextPage,
		Questions:   questions,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

//Manual test cases
//
//curl -X GET "http://localhost:8080/questions"
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures"
//
//curl -X GET "http://localhost:8080/questions?sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?sortField=title&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?limit=5"
//
//curl -X GET "http://localhost:8080/questions?limit=5&startAfter=<last_question_document_ref>"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&sortField=title&sortValue=asc&limit=5"
//
//curl -X GET "http://localhost:8080/questions?categories=Data%20Structures,Algorithms&complexity=Hard,Easy"
//
//curl -X GET "http://localhost:8080/questions?complexity=InvalidComplexity"
