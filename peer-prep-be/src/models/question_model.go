package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Question struct {
	QuestionId primitive.ObjectID `json:"questionId,omitempty"`
	QuestionTitle string `json:"questionTitle" validate:"required"`
	QuestionDescription string `json:"questionDescription" validate:"required"`
	QuestionCategory string `json:"questionCategory" validate:"required"`
	QuestionComplexity string `json:"questionComplexity" validate:"required"`
}