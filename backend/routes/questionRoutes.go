package routes

import (
	controller "backend/controllers"

	"github.com/gin-gonic/gin"
)

// UserRoutes function
func QuestionRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("/v1/questions", controller.GetQuestions())
}
