// This is used to keep track of all the endpoints that we are using in the application
package main

import (
	"github.com/gin-gonic/gin"
)

func SetAllEndpoints(router *gin.Engine, db *QuestionDB, logger *Logger) {
	router.GET("/questions", GetAllQuestionsWithLogger(db, logger))
	router.POST("/questions", AddQuestionWithLogger(db, logger))
	router.GET("/questions/search/:query", GetMatchingQuestionsWithLogger(db, logger))
	router.GET("/questions/solve/:id", GetQuestionWithLogger(db, logger))
	router.DELETE("/questions/delete/:id", DeleteQuestionWithLogger(db, logger))
	router.PUT("/questions/replace/:id", ReplaceQuestionWithLogger(db, logger))
}
