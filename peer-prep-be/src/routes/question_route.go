package routes

import (
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/controllers"
	"github.com/labstack/echo/v4"
)

func QuestionRoute(e *echo.Echo) {
	e.GET("/question/:questionId", controllers.GetQuestion)
	e.POST("/question", controllers.CreateQuestion)
}