// utility functions for questions api
package main

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
)

// used to check if a question already exists in the database.
func (db *QuestionDB) questionExists(question *Question) bool {
	filter := bson.D{bson.E{Key: "title", Value: question.Title}}
	err := db.questions.FindOne(context.Background(), filter).Decode(&Question{}) //FindOne() returns error if no document is found
	return err == nil
}

// used to find the next question ID to be used. Similar to SERIAL in psql.
func (db *QuestionDB) findNextQuestionId() int {
	id := struct {
		Next int `json:"next"`
	}{}
	filter := bson.D{}
	
	var err error
	if err = db.nextId.FindOne(context.Background(), filter).Decode(&id); err != nil {
		log.Fatal(err)  // should not happen. 
	}
	
	log.Println("Next ID: ", id.Next)
	return id.Next
}

// used to increment the next question ID to be used.
// since the collection is capped at one document, inserting a new document will replace the old one.
func (db *QuestionDB) incrementNextQuestionId(nextId int) {
	var err error
	if _, err = db.nextId.InsertOne(context.Background(), bson.D{bson.E{Key: "next", Value: nextId}}); err != nil {
		log.Fatal(err)  // should not happen. 
	}
}

