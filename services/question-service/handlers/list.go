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

var isValidSortField = map[string]bool{
	"title":      true,
	"id":         true,
	"complexity": true,
	"createdAt":  true,
}

var isValidSortValue = map[string]bool{
	"asc":  true,
	"desc": true,
}

var getOrderFromSortValue = map[string]firestore.Direction{
	"asc":  firestore.Asc,
	"desc": firestore.Desc,
}

var isValidQueryField = map[string]bool{
	"title":      true,
	"complexity": true,
	"categories": true,
	"sortField":  true,
	"sortValue":  true,
	"limit":      true,
	"offset":     true,
	"id":         true,
	"createdAt":  true,
}

func (s *Service) ListQuestions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Check validity of query parameters
	for key := range r.URL.Query() {
		if _, valid := isValidQueryField[key]; !valid {
			http.Error(w, "Invalid query parameter: "+key, http.StatusBadRequest)
			return
		}
	}

	query := s.Client.Collection("questions").Query

	// Filtering by title
	titleParam := r.URL.Query().Get("title")
	if titleParam != "" {
		query = query.Where("title", "==", titleParam)
	}

	// Filtering by complexity (multi-select)
	complexityParam := r.URL.Query().Get("complexity")
	if complexityParam != "" {
		complexities := strings.Split(complexityParam, ",")
		query = query.Where("complexity", "in", complexities)
	}

	// Filtering by categories (multi-select)
	categoriesParam := r.URL.Query().Get("categories")
	if categoriesParam != "" {
		categories := strings.Split(categoriesParam, ",")
		query = query.Where("categories", "array-contains-any", categories)
	}

	// Sorting
	sortFieldsParam := r.URL.Query()["sortField"]
	sortValuesParam := r.URL.Query()["sortValue"]

	if len(sortFieldsParam) != len(sortValuesParam) {
		http.Error(w, "Mismatched sortField and sortValue parameters", http.StatusBadRequest)
		return
	}

	if len(sortFieldsParam) > 1 || len(sortValuesParam) > 1 {
		http.Error(w, "At most 1 sortField and sortValue pair allowed", http.StatusBadRequest)
		return
	}

	sortedById := false
	for i, sortField := range sortFieldsParam {
		if !isValidSortField[sortField] {
			http.Error(w, "Invalid sortField: "+sortField, http.StatusBadRequest)
			return
		}

		sortValue := sortValuesParam[i]
		if !isValidSortValue[sortValue] {
			http.Error(w, "Invalid sortValue: "+sortValue, http.StatusBadRequest)
			return
		}

		query = query.OrderBy(sortField, getOrderFromSortValue[sortValue])

		if sortField == "id" {
			sortedById = true
		}
	}
	if !sortedById {
		query = query.OrderBy("id", firestore.Asc)
	}

	// Count total documents matching the filter
	totalIter, err := query.Documents(ctx).GetAll()
	totalCount := len(totalIter)
	if err != nil {
		http.Error(w, "Failed to count questions: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Pagination
	limitParam := r.URL.Query().Get("limit")
	limit := 10
	if limitParam != "" {
		limit, err = strconv.Atoi(limitParam) // convert limit to integer
		if err != nil || limit <= 0 {
			http.Error(w, "Invalid limit", http.StatusBadRequest)
			return
		}
	}
	currentPage := 1
	offsetParam := r.URL.Query().Get("offset")
	if offsetParam != "" {
		offset, err := strconv.Atoi(offsetParam) // convert offset to integer
		if err != nil {
			http.Error(w, "Invalid offset", http.StatusBadRequest)
			return
		}
		if offset%limit != 0 {
			http.Error(w, "Offset does not match limit. Default limit is 10 when unspecified", http.StatusBadRequest)
		}
		currentPage = (offset / limit) + 1
		query = query.Offset(offset)
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
			http.Error(w, "Failed to retrieve questions", http.StatusInternalServerError)
			return
		}

		// Map data
		var question models.Question
		if err := doc.DataTo(&question); err != nil {
			http.Error(w, "Failed to parse question", http.StatusInternalServerError)
			return
		}
		question.DocRefID = doc.Ref.ID
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
//curl -X GET "http://localhost:8080/questions?offset=10"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=Easy,Medium"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&categories=Algorithms,Strings"
//
//
//curl -X GET "http://localhost:8080/questions?sortField=title&sortValue=asc&offset=10"
//
//curl -X GET "http://localhost:8080/questions?sortField=createdAt&sortValue=desc&offset=10"
//
//curl -X GET "http://localhost:8080/questions?sortField=complexity&sortValue=desc&offset=10"
//
//curl -X GET "http://localhost:8080/questions?sortField=id&sortValue=asc&offset=10"
//
//curl -X GET "http://localhost:8080/questions?limit=5"
//
//curl -X GET "http://localhost:8080/questions?limit=5&offset=10"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=Easy,Medium&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=complexity&sortValue=desc"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=Easy,Medium&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=createdAt&sortValue=desc"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=Easy,Medium&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=id&sortValue=asc"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=Easy,Medium&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=Easy,Medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=title&sortValue=asc"
//
//
//curl -X GET "http://localhost:8080/questions?complexity=InvalidComplexity"
//
//curl -X GET "http://localhost:8080/questions?InvalidFilterField=InvalidComplexity"
//
//curl -X GET "http://localhost:8080/questions?sortField=InvalidSortField&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?sortField=complexity&&sortValue=InvalidSortValue"
//
