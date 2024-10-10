package models

// MatchRequest defines the structure for a matchmaking request
type MatchRequest struct {
	UserID          string   `json:"userId"`
	Topics          []string `json:"topics"`
	ExperienceLevel string   `json:"experienceLevel"`
}
