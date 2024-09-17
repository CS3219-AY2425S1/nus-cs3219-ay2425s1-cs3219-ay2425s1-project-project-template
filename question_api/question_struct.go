package question_api
/*
import (
	"encoding/json"
	"fmt"
)
*/

// Difficulty represents the difficulty level of a question
type Difficulty int 

const (
	Easy Difficulty = 1
	Medium Difficulty = 2
	Hard Difficulty = 3
)

// Question struct
type Question struct {
	ID         int       `json:"id"`
	Difficulty Difficulty `json:"difficulty"`
	Title 	string    `json:"title"`
	Description string `json:"description"`
	TestCases map[string]string `json:"test_cases"`
	//Images []string `json:"images"` // for future uses
}

