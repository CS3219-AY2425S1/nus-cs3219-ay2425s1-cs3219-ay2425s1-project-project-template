// This is used to keep track of all the endpoints that we are using in the application
package main

import (
	"github.com/gin-gonic/gin"
)

func SetAllEndpoints(router *gin.Engine, db *QuestionDB) {
	router.GET("/questions", db.GetAllQuestions)
	router.POST("/questions", db.AddQuestion)
	/*
	TODO: implement the following endpoints
	router.GET("/questions/:id", db.GetQuestion)
	router.PUT("/questions/:id", db.UpdateQuestion)
	router.DELETE("/questions/:id", db.DeleteQuestion)
	*/
}
