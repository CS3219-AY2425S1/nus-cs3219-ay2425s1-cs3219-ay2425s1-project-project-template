// this is a method used to add questions to the database. This function will eventually be only called by admins.
package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)
func AddQuestionWithLogger(db *QuestionDB, logger *Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var question Question

		if err := ctx.BindJSON(&question); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error adding question": err.Error()})
			logger.Log.Error("Error converting JSON to question: ", err.Error())
			return
		}

		if db.questionExists(&question) {
			ctx.JSON(http.StatusConflict, gin.H{"Error adding question": "Question already exists"})
			logger.Log.Warn("Cannot add question: question already exists")
			return
		}

		question.ID = db.findNextQuestionId()

		if question.ID == -1 {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error adding question": "Could not find next question ID"})
			logger.Log.Error("Could not find next question ID")
			return
		}
		
		if _, err := db.questions.InsertOne(context.Background(), question); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error adding question": err.Error()})
			logger.Log.Error("Error adding question", err.Error())
			return
		}

		db.incrementNextQuestionId(question.ID + 1, logger)
		ctx.JSON(http.StatusCreated, gin.H{"Success": "Question added successfully"})
		logger.Log.Info("Question added successfully")
	}
}
