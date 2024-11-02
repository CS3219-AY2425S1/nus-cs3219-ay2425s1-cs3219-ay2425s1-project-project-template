package models

import "time"

type CollaborationHistory struct {
	Title              string   `json:"title"`
	Code               string   `json:"code"`
	Language           string   `json:"language"`
	User               string   `json:"user"`
	MatchedUser        string   `json:"matchedUser"`
	MatchID            string   `json:"matchId"`
	MatchedTopics      []string `json:"matchedTopics"`
	QuestionDocRefID   string   `json:"questionDocRefId"`
	QuestionDifficulty string   `json:"questionDifficulty"`
	QuestionTopics     []string `json:"questionTopics"`
	Status             string   `json:"status"`

	// Special DB fields
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
