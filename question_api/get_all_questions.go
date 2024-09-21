// endpoint to get all questions
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"context"
)
func GetAllQuestionsWithLogger(db *QuestionDB, logger *Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get all questions from the database
		questions_cursor, err := db.questions.Find(context.Background(), bson.D{})

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error retrieving questions": err.Error()})
			logger.Log.Error("Error retrieving questions: ", err.Error())
			return
		}

		// create a slice to store the questions
		var questions []Question

		// decode all the questions from the cursor. If there is an error, return the error
		if err = questions_cursor.All(context.Background(), &questions); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error decoding questions": err.Error()})
			logger.Log.Error("Error decoding questions: ", err.Error())
			return
		}

		if len(questions) == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "No questions found"})
			logger.Log.Error("No questions found when retrieving all questions")
			return
		}

		ctx.JSON(http.StatusOK, questions)
		logger.Log.Info("All questions retrieved successfully")
	}
}

