// utility functions for questions api
package main

import (
	"context"
	"fmt"
	"strconv"

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
	
	if err := db.nextId.FindOne(context.Background(), filter).Decode(&id); err != nil {
		return -1
	}
	
	return id.Next
}

// used to increment the next question ID to be used.
// since the collection is capped at one document, inserting a new document will replace the old one.
func (db *QuestionDB) incrementNextQuestionId(nextId int, logger *Logger) {
	var err error
	if _, err = db.nextId.InsertOne(context.Background(), bson.D{bson.E{Key: "next", Value: nextId}}); err != nil {
		logger.Log.Error("Error incrementing next question ID: ", err)
		return
	}

	logger.Log.Info(fmt.Sprintf("Next question ID incremented to %d successfully", nextId))
}

// used to get all questions that match a query. The query can be on either the title or the id of the question
func (db *QuestionDB) GetMatchingQuestions(query string) ([]Question, error) {
	questions := []Question{}
	
	//create filter for exact match for ID. First attempt to parse query as an integer
	id, err := strconv.Atoi(query)
	var id_filter bson.D
	
	//query is an integer
	if err == nil {
		id_filter = bson.D{bson.E{Key: "id", Value: id}}
	}

	//create filter for case-insensitive partial match for title
	title_filter := bson.D{bson.E{Key: "title", Value: bson.D{bson.E{Key: "$regex", Value: "(?i)" + query}}}}

	var filter bson.D
	
	if id_filter == nil {
		//query is a string
		filter = title_filter
	} else {
		//query is an integer
		filter = bson.D{bson.E{Key: "$or", Value: []bson.D{id_filter, title_filter}}}
	}
	
	cursor, err := db.questions.Find(context.Background(), filter)
	
	if err != nil {
		return questions, err
	}

	if err = cursor.All(context.Background(), &questions); err != nil {
		return questions, err
	}

	return questions, nil
}


// used to check if a question being replaced will cause duplicates in the database

func (db *QuestionDB) questionExistsExceptId(question *Question) bool {
	filter := bson.D{bson.E{Key: "title", Value: question.Title}, bson.E{Key: "id", Value: bson.D{bson.E{Key: "$ne", Value: question.ID}}}}
	err := db.questions.FindOne(context.Background(), filter).Decode(&Question{}) //FindOne() returns error if no document is found
	return err == nil
}