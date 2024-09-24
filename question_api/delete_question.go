/*
This is used to delete a question using the unique ID of the question.
The endpoint is defined as /questions/delete/id=<id>
Since deletion is a dangerous operation, it will perform a delete only on an exact match of the ID.
*/

package main

import (
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
	"net/http"
	"go.mongodb.org/mongo-driver/bson"
)

func DeleteQuestionWithLogger(db *QuestionDB, logger *Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// attempt to convert the ID to an integer
		id, err := strconv.Atoi(ctx.Param("id"))
		
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error deleting question": "Invalid ID"})
			logger.Log.Warn("Attempted deletion with invalid ID: ", ctx.Param("id"))
			return
		}

		deleteStatus, err := db.questions.DeleteOne(context.Background(), bson.D{bson.E{Key: "id", Value: id}})
		
		if err != nil {
			ctx.JSON(http.StatusBadGateway, gin.H{"Error deleting question": err.Error()})
			logger.Log.Warn(fmt.Sprintf("Failed to delete question with ID %d: %s", id, err.Error()))
			return
		} else if deleteStatus.DeletedCount == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{"Error deleting question": "Question not found"})
			logger.Log.Warn(fmt.Sprintf("Question with ID %d not found", id))
			return
		}

		ctx.JSON(http.StatusNoContent, gin.H{"Success": "Question deleted successfully"})
		logger.Log.Warn(fmt.Sprintf("Question with ID %d deleted successfully", id))
	}
}