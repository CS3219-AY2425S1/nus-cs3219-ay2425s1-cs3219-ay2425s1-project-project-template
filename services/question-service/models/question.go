package models

import "time"

// TODO: currently the Question model is a simplified model
type Question struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Categories  []string `json:"categories"`
	Complexity  string   `json:"complexity"`

	// Special DB fields
	ID        int64     `json:"id"`
	DocRefID  string    `json:"docRefId"` // The firestore document reference ID
	CreatedAt time.Time `json:"createdAt"`
}
