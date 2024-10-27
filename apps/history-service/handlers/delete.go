package handlers

import (
	"github.com/go-chi/chi/v5"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net/http"
)

// Delete a code snippet by ID
func (s *Service) DeleteHistory(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Parse request
	docRefId := chi.URLParam(r, "docRefId")

	// Reference document
	docRef := s.Client.Collection("collaboration-history").Doc(docRefId)

	// Validation
	// Check if exists
	doc, err := docRef.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			http.Error(w, "History not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error fetching history", http.StatusInternalServerError)
		return
	}

	// Update database
	_, err = doc.Ref.Delete(ctx)
	if err != nil {
		http.Error(w, "Error deleting history", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}

//curl -X DELETE http://localhost:8082/histories/largSKbROswF5pveMkEL \
//-H "Content-Type: application/json"
