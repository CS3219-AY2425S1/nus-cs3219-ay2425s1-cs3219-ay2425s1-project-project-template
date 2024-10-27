package models

import "time"

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

	// Special DB fields
	CreatedAt time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" firestore:"updatedAt"`
	DocRefID  string    `json:"docRefId" firestore:"docRefId"`
}
