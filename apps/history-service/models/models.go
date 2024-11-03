package models

import "time"

type CollaborationHistory struct {
	// Submission related details
	Code     string `json:"code" firestore:"code"`
	Language string `json:"language" firestore:"language"`

	// Match related details
	User          string   `json:"user" firestore:"user"`
	MatchedUser   string   `json:"matchedUser" firestore:"matchedUser"`
	MatchedTopics []string `json:"matchedTopics" firestore:"matchedTopics"`

	// Question related details
	Title              string   `json:"title" firestore:"title"`
	QuestionDocRefID   string   `json:"questionDocRefId" firestore:"questionDocRefId"`
	QuestionDifficulty string   `json:"questionDifficulty" firestore:"questionDifficulty"`
	QuestionTopics     []string `json:"questionTopics" firestore:"questionTopics"`

	// Special DB fields
	CreatedAt       time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt" firestore:"updatedAt"` // updatedAt is unused as history is never updated once created
	HistoryDocRefID string    `json:"historyDocRefId"`
}
