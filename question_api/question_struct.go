// defines the JSON format of quesitons.
package main

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
	Categories []string `json:"categories"`
	TestCases map[string]string `json:"test_cases"`
	//Images []string `json:"images"` // for future uses
}

