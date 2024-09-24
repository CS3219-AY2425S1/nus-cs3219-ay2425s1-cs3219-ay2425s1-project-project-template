package models

// TODO: currently the Question model is a simplified model
type Question struct {
	ID          int      `json:"id"`
	Ref         string   `json:"ref"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Categories  []string `json:"categories"`
	Complexity  string   `json:"complexity"`
}
