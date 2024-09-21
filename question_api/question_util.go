// utility functions for questions api
package main

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
)

// used to check if a question already exists in the database.
func (db *QuestionDB) questionExists(question *Question) bool {
	filter := bson.D{bson.E{Key: "title", Value: question.Title}}
	err := db.questions.FindOne(context.Background(), filter).Decode(&Question{}) //FindOne() returns error if no document is found
	return err == nil
}
