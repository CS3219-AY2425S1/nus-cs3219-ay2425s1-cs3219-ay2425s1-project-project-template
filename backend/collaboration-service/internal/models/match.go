package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Define an enum for question complexity
type QuestionComplexityEnum string

const (
	Easy   QuestionComplexityEnum = "Easy"
	Medium QuestionComplexityEnum = "Medium"
	Hard   QuestionComplexityEnum = "Hard"
)

// Question struct as defined earlier
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

// Match struct equivalent to the TypeScript Pair interface
type Match struct {
	ID          primitive.ObjectID     `bson:"_id,omitempty"`
	UserOne     string                  `bson:"userOne"`
	UserTwo     string                 `bson:"userTwo"`
	RoomID      string                 `bson:"room_id"`
	Complexity  []QuestionComplexityEnum `bson:"complexity"`
	Categories  []string               `bson:"categories"`
	Question    Question             `bson:"question"` 
}
