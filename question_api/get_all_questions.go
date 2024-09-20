// endpoint to get all questions
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	//"go.mongodb.org/mongo-driver/mongo"
	"context"
)

func (db *QuestionDB) GetAllQuestions(ctx *gin.Context) {
	// get all questions from the database
	questions_cursor, err := db.collection.Find(context.Background(), bson.D{})

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error retrieving questions": err.Error()})
	}

	// create a slice to store the questions
	var questions []Question

	// decode all the questions from the cursor. If there is an error, return the error
	if err = questions_cursor.All(context.Background(), &questions); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error decoding questions": err.Error()})
	}

	if len(questions) == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "No questions found"})
	}

	ctx.JSON(http.StatusOK, questions)
}