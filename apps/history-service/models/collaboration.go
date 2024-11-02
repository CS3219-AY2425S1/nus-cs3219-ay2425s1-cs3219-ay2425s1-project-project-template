package models

import "time"

const (
	ACCEPTED  = "Accepted"
	ATTEMPTED = "Attempted"
)

type CollaborationHistory struct {
	Title              string   `json:"title" firestore:"title"`
	Code               string   `json:"code" firestore:"code"`
	Language           string   `json:"language" firestore:"language"`
	User               string   `json:"user" firestore:"user"`
	MatchedUser        string   `json:"matchedUser" firestore:"matchedUser"`
	MatchID            string   `json:"matchId" firestore:"matchId"`
	MatchedTopics      []string `json:"matchedTopics" firestore:"matchedTopics"`
	QuestionDocRefID   string   `json:"questionDocRefId" firestore:"questionDocRefId"`
	QuestionDifficulty string   `json:"questionDifficulty" firestore:"questionDifficulty"`
	QuestionTopics     []string `json:"questionTopics" firestore:"questionTopics"`
	Status             string   `json:"status" firestore:"status"`

	// Special DB fields
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" firestore:"updatedAt"`
}
