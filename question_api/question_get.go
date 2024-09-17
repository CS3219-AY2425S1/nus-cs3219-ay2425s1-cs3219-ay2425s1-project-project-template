package main

import (
	"github.com/gin-gonic/gin"
)

func GetAllQuestions(context *gin.Context) {
	context.JSON(200, questions)
}