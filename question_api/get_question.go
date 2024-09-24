// This is used to get a specific question using the unique ID of the question.
// The endpoint is defined as /questions/solve/id=<id>
package main

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)


func GetQuestionWithLogger(db *QuestionDB, logger *Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get the numeric ID from the URL
		id, err := strconv.Atoi(ctx.Param("id"))
		
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error retrieving question": "Invalid ID"})
			logger.Log.Warn("Invalid ID: ", ctx.Param("id"))
			return
		}

		question_cursor := db.questions.FindOne(context.Background(), bson.D{bson.E{Key: "id", Value: id}})
		
		if question_cursor.Err() != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"Error retrieving question": "Question not found"})
			logger.Log.Warn(fmt.Sprintf("Question with ID %d not found", id))
			return
		}

		var question Question
		if err := question_cursor.Decode(&question); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error retrieving question": "Error decoding question"})
			logger.Log.Error("Error decoding question: ", err)
			return
		}

		ctx.JSON(http.StatusOK, question)
		logger.Log.Info(fmt.Sprintf("Question with ID %d returned successfully", id))
	}
}