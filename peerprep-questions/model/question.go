package model

type Question struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Complexity  string `json:"complexity"`
}
