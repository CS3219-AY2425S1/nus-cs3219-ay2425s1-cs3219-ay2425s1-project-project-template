// this is used to get all questions that match a query. The query can be on either the title or the id of the question
package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

//matches if the id is equal to the query, or if the title contains the query
func GetMatchingQuestionsWithLogger(db *QuestionDB, logger *Logger) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		query := ctx.Param("query")
		
		if strings.Contains(query, " ") {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "endpoint cannot contain spaces"})
			logger.Log.Warn("Attempted to query with illegal endpoint: ", query)
			return
		}
		
		// replace all dashes with spaces
		query = strings.ReplaceAll(query, "-", " ")
		questions, err := db.GetMatchingQuestions(query)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error retrieving questions": err.Error()})
			logger.Log.Error("Error retrieving questions: ", err.Error())
			return
		}

		if len(questions) == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{"No questions found matching the query: ": query})
			logger.Log.Warn(fmt.Sprintf("No questions found matching the query: %s", query))
			return
		}

		ctx.JSON(http.StatusOK, questions)
		logger.Log.Info(fmt.Sprintf("Questions matching query %s retrieved successfully", query))
	}
}

