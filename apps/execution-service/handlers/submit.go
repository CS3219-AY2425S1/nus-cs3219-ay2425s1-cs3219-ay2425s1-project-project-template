package handlers

import (
	"bytes"
	"encoding/json"
	"execution-service/models"
	"execution-service/utils"
	"github.com/go-chi/chi/v5"
	"google.golang.org/api/iterator"
	"net/http"
	"os"
)

func (s *Service) ExecuteVisibleAndHiddenTestsAndSubmit(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	questionDocRefId := chi.URLParam(r, "questionDocRefId")
	if questionDocRefId == "" {
		http.Error(w, "questionDocRefId is required", http.StatusBadRequest)
		return
	}

	var collab models.Collaboration
	if err := utils.DecodeJSONBody(w, r, &collab); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	iter := s.Client.Collection("tests").Where("questionDocRefId", "==", questionDocRefId).Limit(1).Documents(ctx)
	doc, err := iter.Next()
	if err != nil {
		if err == iterator.Done {
			http.Error(w, "Test not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var test models.Test
	if err := doc.DataTo(&test); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	testResults, err := utils.ExecuteVisibleAndHiddenTests(models.Code{
		Code:     collab.Code,
		Language: collab.Language,
	}, test)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Save the collaboration history via the history-service
	// TODO: convert to message queue
	collabHistory := models.CollaborationHistory{
		Title:              collab.Title,
		Code:               collab.Code,
		Language:           collab.Language,
		User:               collab.User,
		MatchedUser:        collab.MatchedUser,
		MatchID:            collab.MatchID,
		MatchedTopics:      collab.MatchedTopics,
		QuestionDocRefID:   questionDocRefId,
		QuestionDifficulty: collab.QuestionDifficulty,
		QuestionTopics:     collab.QuestionTopics,
	}

	jsonData, err := json.Marshal(collabHistory)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// get history-service url from os env
	historyServiceUrl := os.Getenv("HISTORY_SERVICE_URL")
	if historyServiceUrl == "" {
		http.Error(w, "HISTORY_SERVICE_URL is not set", http.StatusInternalServerError)
		return
	}

	req, err := http.NewRequest(http.MethodPut, historyServiceUrl+"histories/match/"+collabHistory.MatchID,
		bytes.NewBuffer(jsonData))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Failed to save collaboration history", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(testResults)
}

//curl -X POST http://localhost:8083/tests/Yt29JjnIDpRwIlYAX8OF/submit \
//-H "Content-Type: application/json" \
//-d '{
//"title": "Example Title",
//"code": "name = input()\nprint(name[::-1])",
//"language": "Python",
//"user": "user123",
//"matchedUser": "user456",
//"matchId": "match123",
//"matchedTopics": ["topic1", "topic2"],
//"questionDifficulty": "Medium",
//"questionTopics": ["Loops", "Strings"]
//}'
