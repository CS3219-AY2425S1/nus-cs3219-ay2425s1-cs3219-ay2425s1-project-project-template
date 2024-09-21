// This is used to keep track of all the endpoints that we are using in the application
package main

import (
	"github.com/gin-gonic/gin"
)

func SetAllEndpoints(router *gin.Engine, db *QuestionDB, logger *Logger) {
	router.GET("/questions", GetAllQuestionsWithLogger(db, logger))
	router.POST("/questions", AddQuestionWithLogger(db, logger))
	router.GET("/questions/:query", GetMatchingQuestionsWithLogger(db, logger))
	router.GET("/questions/solve/:id", GetQuestionWithLogger(db, logger))
	/*
	TODO: implement the following endpoints
	router.PUT("/questions/:id", db.UpdateQuestion)
	router.DELETE("/questions/:id", db.DeleteQuestion)
	*/
}
