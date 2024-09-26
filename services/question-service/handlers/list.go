package handlers

import (
	"cloud.google.com/go/firestore"
	"encoding/json"
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
		var complexityInts []int
		complexityStrs := strings.Split(complexityParam, ",")
		for _, complexityStr := range complexityStrs {
			complexityType, err := models.ParseComplexity(complexityStr)
			if err != nil {
				http.Error(w, "Failed to filter by complexity: "+err.Error(), http.StatusInternalServerError)
				return
			}
			complexityInts = append(complexityInts, int(complexityType))
		}
		query = query.Where("complexity", "in", complexityInts)
	}

	// Filtering by categories (multi-select): Partially using array-contains-any first
	categoriesParam := r.URL.Query().Get("categories")
	var categories []string
	if categoriesParam != "" {
		categories = strings.Split(categoriesParam, ",")
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

	results, err := query.Documents(ctx).GetAll()
	if err != nil {
		http.Error(w, "Failed to to get fetch questions: "+err.Error(), http.StatusInternalServerError)
	}

	// Filter the results to check if the document contains all categories (implementation of array-contains-all)
	var filteredResults []*firestore.DocumentSnapshot
	if categories != nil {
		for _, doc := range results {
			data := doc.Data()

			// Retrieve the "categories" field from the document and convert to []string
			if docCategories, ok := data["categories"].([]interface{}); ok {
				stringCategories := make([]string, len(docCategories))
				for i, cat := range docCategories {
					if catStr, ok := cat.(string); ok {
						stringCategories[i] = catStr
					}
				}

				if containsAllCategoriesSet(stringCategories, categories) {
					filteredResults = append(filteredResults, doc)
				}
			}
		}
	} else {
		filteredResults = results
	}

	// Pagination
	limitParam := r.URL.Query().Get("limit")
	limit := 10
	if limitParam != "" {
		limit, err = strconv.Atoi(limitParam) // convert limit to integer
		if err != nil || limit <= 0 {
			http.Error(w, "Invalid limit: "+strconv.Itoa(limit), http.StatusBadRequest)
			return
		}
	}
	offsetParam := r.URL.Query().Get("offset")
	var offset int
	if offsetParam != "" {
		offset, err = strconv.Atoi(offsetParam) // convert offset to integer
		if err != nil {
			http.Error(w, "Invalid offset: "+strconv.Itoa(offset), http.StatusBadRequest)
			return
		}
		if offset%limit != 0 {
			http.Error(w, "Offset does not match limit. Default limit is 10 when offset is unspecified",
				http.StatusBadRequest)
		}
	}

	paginatedResults := paginateResults(filteredResults, offset, limit)

	var questions []models.Question
	for _, doc := range paginatedResults {
		// Map data
		var question models.Question
		if err := doc.DataTo(&question); err != nil {
			http.Error(w, "Failed to parse question: "+err.Error(), http.StatusInternalServerError)
			return
		}
		question.DocRefID = doc.Ref.ID
		questions = append(questions, question)
	}

	// Calculate pagination info
	totalCount := len(filteredResults)
	totalPages := (totalCount + limit - 1) / limit
	currentPage := (offset / limit) + 1
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

func containsAllCategoriesSet(docCategories []string, queryCategories []string) bool {
	categorySet := make(map[string]bool)

	// Populate the set with document categories
	for _, cat := range docCategories {
		categorySet[cat] = true
	}

	// Check if all query categories are present in the document categories
	for _, queryCat := range queryCategories {
		if !categorySet[queryCat] {
			return false
		}
	}
	return true
}

func paginateResults(results []*firestore.DocumentSnapshot, offset, limit int) []*firestore.DocumentSnapshot {
	start := offset
	end := offset + limit

	if start >= len(results) {
		return []*firestore.DocumentSnapshot{}
	}
	if end > len(results) {
		end = len(results)
	}
	return results[start:end]
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
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=easy,medium"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&categories=Algorithms,Strings"
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
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=easy,medium&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&sortField=complexity&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=complexity&sortValue=desc"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=easy,medium&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&sortField=createdAt&sortValue=desc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=createdAt&sortValue=desc"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=easy,medium&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&sortField=id&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=id&sortValue=asc"
//
//
//curl -X GET "http://localhost:8080/questions?title=Reverse%20a%20String&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Data%20Structures&complexity=easy,medium&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?categories=Algorithms,Strings&title=Reverse%20a%20String&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&sortField=title&sortValue=asc"
//
//curl -X GET "http://localhost:8080/questions?complexity=easy,medium&title=Reverse%20a%20String&categories=Algorithms,Strings&sortField=title&sortValue=asc"
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
