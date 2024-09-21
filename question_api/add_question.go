// this is a method used to add questions to the database. This function will eventually be only called by admins.
package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

// When adding a question, the next ID to be used is found by calling findNextQuestionId() and the question is added to the database.
// The next ID is then incremented by 1.
func (db *QuestionDB) AddQuestion(ctx *gin.Context) {
	var question Question

	if err := ctx.BindJSON(&question); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"Error adding question: ": err.Error()})
		return
	}

	if db.questionExists(&question) {
		ctx.JSON(http.StatusConflict, gin.H{"Error adding question: ": "Question already exists"})
		return
	}

	question.ID = db.findNextQuestionId()
	db.questions.InsertOne(context.Background(), question)

	db.incrementNextQuestionId(question.ID + 1)
	ctx.JSON(http.StatusCreated, gin.H{"Success": "Question added successfully"})
}
