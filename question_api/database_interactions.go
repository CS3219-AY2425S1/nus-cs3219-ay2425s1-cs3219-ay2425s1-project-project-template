// contains the database-related functions for the questions API.
package main

import (
	"context"
	"errors"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
)

func (db *QuestionDB) GetAllQuestionsWithQuery(logger *Logger, filter bson.D) ([]Question, error) {
	questionCursor, err := db.questions.Find(context.Background(), filter)

	if err != nil {
		logger.Log.Error("Error retrieving questions: ", err.Error())
		return nil, err
	}

	var questions []Question

	if err = questionCursor.All(context.Background(), &questions); err != nil {
		logger.Log.Error("Error decoding questions: ", err.Error())
		return nil, err
	}

	return questions, nil
}

func (db *QuestionDB) AddQuestion(logger *Logger, question *Question) (int, error) {
	if db.QuestionExists(question) {
		logger.Log.Warn("Cannot add question: question already exists")
		return http.StatusConflict, errors.New("question already exists")
	}

	question.ID = db.FindNextQuestionId()

	if question.ID == -1 {
		logger.Log.Error("Could not find next question ID")
		return http.StatusBadGateway, errors.New("could not find the next question ID")
	}

	if _, err := db.questions.InsertOne(context.Background(), question); err != nil {
		logger.Log.Error("Error adding question", err.Error())
		return http.StatusBadGateway, err
	}

	db.IncrementNextQuestionId(question.ID + 1, logger)
	return http.StatusOK, nil
}	