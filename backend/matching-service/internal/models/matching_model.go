package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MatchStatusEnum string

const (
	Matched   MatchStatusEnum = "Matched"
	Pending   MatchStatusEnum = "Pending"
	Timeout   MatchStatusEnum = "Timeout"
	Cancelled MatchStatusEnum = "Cancelled"
)

type QuestionComplexityEnum string

const (
	Easy   QuestionComplexityEnum = "Easy"
	Medium QuestionComplexityEnum = "Medium"
	Hard   QuestionComplexityEnum = "Hard"
)

// ProgrammingLanguageEnum contains 8 common programming languages
type ProgrammingLanguageEnum string

const (
	Go         ProgrammingLanguageEnum = "Go"
	Python     ProgrammingLanguageEnum = "Python"
	Java       ProgrammingLanguageEnum = "Java"
	Cpp        ProgrammingLanguageEnum = "C++"
	JavaScript ProgrammingLanguageEnum = "JavaScript"
	Ruby       ProgrammingLanguageEnum = "Ruby"
	Swift      ProgrammingLanguageEnum = "Swift"
	CSharp     ProgrammingLanguageEnum = "C#"
)

// MatchingInfo struct includes user matching criteria
type MatchingInfo struct {
	UserID               string                    `json:"user_id" bson:"user_id"`
	SocketID             string                    `json:"socket_id" bson:"socket_id"`
	DifficultyLevel      []QuestionComplexityEnum  `json:"difficulty_levels" bson:"difficulty_levels"`
	Categories           []string                  `json:"categories" bson:"categories"`
	ProgrammingLanguages []ProgrammingLanguageEnum `json:"programming_languages" bson:"programming_languages"`
	GeneralizeLanguages  bool                      `json:"generalize_languages" bson:"generalize_languages"`
	Status               MatchStatusEnum           `json:"status" bson:"status"`
	RoomID               string                    `json:"room_id" bson:"room_id"`
}

type Question struct {
	QuestionID  string    `json:"questionId" bson:"questionId"`
	Title       string    `json:"title" bson:"title"`
	Description string    `json:"description" bson:"description"`
	Constraints string    `json:"constraints" bson:"constraints"`
	Examples    string    `json:"examples" bson:"examples"`
	Category    []string  `json:"category" bson:"category"`
	Complexity  string    `json:"complexity" bson:"complexity"`
	ImageURL    string    `json:"imageUrl" bson:"imageUrl"`
	CreatedAt   primitive.DateTime `json:"createdAt" bson:"createdAt"`
	UpdatedAt   primitive.DateTime `json:"updatedAt" bson:"updatedAt"`
}

type MatchResult struct {
	UserOneSocketID string `json:"user_one_socket_id"`
	UserTwoSocketID string `json:"user_two_socket_id"`
	UserOne     string                  `bson:"userOne"`
	UserTwo     string                  `bson:"userTwo"`
	RoomID      string                 `bson:"room_id"`
	Complexity  []QuestionComplexityEnum `bson:"complexity"`
	Categories  []string               `bson:"categories"`
	Question    Question             `bson:"question"` 
}

