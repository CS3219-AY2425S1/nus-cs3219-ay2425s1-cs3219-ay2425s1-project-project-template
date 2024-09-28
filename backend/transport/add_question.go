// this is a method used to add questions to the database. This function will eventually be only called by admins.
package transport

import (
	"net/http"
	"peerprep/common"
	"peerprep/database"

	"github.com/gin-gonic/gin"
)

func AddQuestionWithLogger(db *database.QuestionDB, logger *common.Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var question common.Question

		if err := ctx.BindJSON(&question); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"Error adding question": err.Error()})
			logger.Log.Error("Error converting JSON to question: ", err.Error())
			return
		}

		status, err := db.AddQuestion(logger, &question)

		if err != nil {
			ctx.JSON(status, err.Error())
			return
		}

		ctx.JSON(status, "Question added successfully")
		logger.Log.Info("Question added successfully")
	}
}
