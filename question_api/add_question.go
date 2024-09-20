// this is a method used to add questions to the database. This function will eventually be only called by admins.
package main 

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"context"
)
//TODO: add logic to check for the question ID before adding, should add to the next ID number.
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

	db.collection.InsertOne(context.Background(), question)
	ctx.JSON(http.StatusCreated, gin.H{"Success": "Question added successfully"})
}