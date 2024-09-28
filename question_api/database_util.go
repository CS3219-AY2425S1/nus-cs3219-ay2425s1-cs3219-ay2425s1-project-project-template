// utility functions for questions api
package main

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

// used to check if a question already exists in the database.
func (db *QuestionDB) QuestionExists(question *Question) bool {
	filter := bson.D{bson.E{Key: "title", Value: question.Title}}
	err := db.questions.FindOne(context.Background(), filter).Decode(&Question{}) //FindOne() returns error if no document is found
	return err == nil
}

// used to find the next question ID to be used. Similar to SERIAL in psql.
func (db *QuestionDB) FindNextQuestionId() int {
	id := struct {
		Next int `json:"next"`
	}{}
	filter := bson.D{}

	if err := db.nextId.FindOne(context.Background(), filter).Decode(&id); err != nil {
		return -1
	}

	return id.Next
}

// used to increment the next question ID to be used.
// since the collection is capped at one document, inserting a new document will replace the old one.
func (db *QuestionDB) IncrementNextQuestionId(nextId int, logger *Logger) {
	var err error
	if _, err = db.nextId.InsertOne(context.Background(), bson.D{bson.E{Key: "next", Value: nextId}}); err != nil {
		logger.Log.Error("Error incrementing next question ID: ", err)
		return
	}

	logger.Log.Info(fmt.Sprintf("Next question ID incremented to %d successfully", nextId))
}

// used to check if a question being replaced will cause duplicates in the database

func (db *QuestionDB) QuestionExistsExceptId(question *Question) bool {
	filter := bson.D{bson.E{Key: "title", Value: question.Title}, bson.E{Key: "id", Value: bson.D{bson.E{Key: "$ne", Value: question.ID}}}}
	err := db.questions.FindOne(context.Background(), filter).Decode(&Question{}) //FindOne() returns error if no document is found
	return err == nil
}
