//updates a question with a given id. The id must be matched perfectly.
//Updating questions will not increment the next id like that of a post request, unless the supplied id is greater or equal to the next id.

package main

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// for PUT requests, to replace an entire question with a new question, or create a new question if the id does not yet exist
func ReplaceQuestionWithLogger(db *QuestionDB, logger *Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id_param, err := strconv.Atoi(ctx.Param("id"))

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error replacing question": "ID is not a number"})
			logger.Log.Warn("Attempted to update with invalid ID: ", ctx.Param("id"))
			return
		}

		new_question := Question{}
		err = ctx.BindJSON(&new_question)
		if err != nil {
			logger.Log.Error("error", "Failed to bind JSON", err)
			ctx.JSON(http.StatusBadGateway, gin.H{"Error replacing question": err.Error()})
			return
		}

		if id_param >= db.FindNextQuestionId() {
			// ID is greater than the next ID, so we will create a new question. This is equivalent to a POST request.
			logger.Log.Info("Attempting to update a question with an ID greater than next ID, creating a new question")

			if db.QuestionExists(&new_question) {
				ctx.JSON(http.StatusConflict, gin.H{"Error adding question": "Question already exists"})
				logger.Log.Warn("Cannot add question: question already exists")
				return
			}

			new_question.ID = db.FindNextQuestionId()

			if new_question.ID == -1 {
				ctx.JSON(http.StatusBadGateway, gin.H{"Error adding question": "Could not find next question ID"})
				logger.Log.Error("Could not find next question ID")
				return
			}

			if _, err := db.questions.InsertOne(context.Background(), new_question); err != nil {
				ctx.JSON(http.StatusBadGateway, gin.H{"Error adding question": err.Error()})
				logger.Log.Error("Error adding question: ", err.Error())
				return
			}

			db.IncrementNextQuestionId(new_question.ID+1, logger)
			ctx.JSON(http.StatusCreated, gin.H{"Success": "Question added successfully"})
			logger.Log.Info("Question added successfully with ID: ", new_question.ID)
			return
		}

		logger.Log.Info("Replacing question with ID: ", id_param)

		new_question.ID = id_param //ensure the ID is the same as the ID in the URL

		// used	to ensure that replacing a question will not cause a conflict with another question
		// e.g new question shares same title as question A, but is used to replace question B. This will result in 2 question A's in the database.
		if db.QuestionExistsExceptId(&new_question) {
			ctx.JSON(http.StatusConflict, gin.H{"Error adding question": "Question already exists"})
			logger.Log.Warn("Cannot add question: question already exists")
			return
		}

		var count *mongo.UpdateResult
		count, err = db.questions.ReplaceOne(context.Background(), bson.D{bson.E{Key: "id", Value: id_param}}, new_question)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error replacing question": err.Error()})
			logger.Log.Error("Failed to replace question: ", err)
			return
		}

		if count.MatchedCount == 0 {
			//the reason the ID does not exist is likely because the previous question with this ID was deleted.
			//simply insert the new question with the same ID, to fill in the gap.
			if db.QuestionExists(&new_question) {
				ctx.JSON(http.StatusConflict, gin.H{"Error adding question": "Question already exists"})
				logger.Log.Warn("Cannot add question: question already exists")
				return
			}

			db.questions.InsertOne(context.Background(), new_question)
			ctx.JSON(http.StatusCreated, gin.H{"Success": "Question replaced successfully"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"Success": "Question replaced successfully"})
	}
}
